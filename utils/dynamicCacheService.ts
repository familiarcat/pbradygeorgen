/**
 * Dynamic Cache Service
 * 
 * This service extends the existing cache service to be aware of PDF changes
 * and invalidate caches when the PDF content changes.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { DanteLogger } from './DanteLogger';
import { HesseLogger } from './HesseLogger';

// Type definitions
interface CachedItem<T> {
  data: T;
  timestamp: number;
  pdfFingerprint?: string;
}

export class DynamicCacheService<T> {
  private cacheStorage: Map<string, CachedItem<T>> = new Map();
  private readonly CACHE_DURATION_MS: number = 24 * 60 * 60 * 1000; // 24 hours by default
  private readonly cacheFilePath: string;
  private readonly pdfFingerprintPath: string = path.join(process.cwd(), 'public', 'extracted', 'content_fingerprint.txt');
  private currentPdfFingerprint: string | null = null;

  constructor(cacheName: string, cacheDurationMs?: number) {
    this.cacheFilePath = path.join(process.cwd(), '.cache', `${cacheName}.json`);
    
    if (cacheDurationMs) {
      this.CACHE_DURATION_MS = cacheDurationMs;
    }
    
    // Load the PDF fingerprint
    this.loadPdfFingerprint();
    
    // Load the cache from disk
    this.loadCacheFromStorage();
    
    // Log initialization
    DanteLogger.success.basic(`DynamicCacheService initialized: ${cacheName}`);
  }

  /**
   * Load the current PDF fingerprint
   */
  private loadPdfFingerprint(): void {
    try {
      if (fs.existsSync(this.pdfFingerprintPath)) {
        this.currentPdfFingerprint = fs.readFileSync(this.pdfFingerprintPath, 'utf8').trim();
        HesseLogger.cache.hit(`Loaded PDF fingerprint: ${this.currentPdfFingerprint?.substring(0, 8)}...`);
      } else {
        this.currentPdfFingerprint = null;
        HesseLogger.cache.miss('No PDF fingerprint found');
      }
    } catch (error) {
      console.error('Error loading PDF fingerprint:', error);
      this.currentPdfFingerprint = null;
    }
  }

  /**
   * Load the cache from disk
   */
  private loadCacheFromStorage(): void {
    try {
      // Create the cache directory if it doesn't exist
      const cacheDir = path.dirname(this.cacheFilePath);
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      // Load the cache if it exists
      if (fs.existsSync(this.cacheFilePath)) {
        const cacheData = JSON.parse(fs.readFileSync(this.cacheFilePath, 'utf8'));
        
        // Convert the object back to a Map
        for (const [key, value] of Object.entries(cacheData)) {
          this.cacheStorage.set(key, value as CachedItem<T>);
        }
        
        // Invalidate cache items with different PDF fingerprint
        if (this.currentPdfFingerprint) {
          let invalidatedCount = 0;
          for (const [key, item] of this.cacheStorage.entries()) {
            if (item.pdfFingerprint && item.pdfFingerprint !== this.currentPdfFingerprint) {
              this.cacheStorage.delete(key);
              invalidatedCount++;
            }
          }
          
          if (invalidatedCount > 0) {
            HesseLogger.cache.invalidate(`Invalidated ${invalidatedCount} cache items due to PDF change`);
          }
        }
        
        HesseLogger.cache.hit(`Loaded ${this.cacheStorage.size} items from cache`);
      } else {
        HesseLogger.cache.miss('No cache file found');
      }
    } catch (error) {
      console.error('Error loading cache from storage:', error);
      // Start with an empty cache if there's an error
      this.cacheStorage = new Map();
    }
  }

  /**
   * Save the cache to disk
   */
  private saveCacheToStorage(): void {
    try {
      // Convert the Map to an object for JSON serialization
      const cacheData: Record<string, CachedItem<T>> = {};
      for (const [key, value] of this.cacheStorage.entries()) {
        cacheData[key] = value;
      }

      // Save the cache to disk
      fs.writeFileSync(this.cacheFilePath, JSON.stringify(cacheData, null, 2));
      
      HesseLogger.cache.update(`Saved ${this.cacheStorage.size} items to cache`);
    } catch (error) {
      console.error('Error saving cache to storage:', error);
    }
  }

  /**
   * Generate a cache key from content
   * @param content The content to hash
   * @returns A hash string to use as cache key
   */
  public generateCacheKey(content: string): string {
    // Include the PDF fingerprint in the cache key if available
    const contentToHash = this.currentPdfFingerprint 
      ? `${content}_pdf_${this.currentPdfFingerprint}` 
      : content;
      
    return crypto.createHash('md5').update(contentToHash).digest('hex');
  }

  /**
   * Store an item in the cache
   * @param key The cache key
   * @param data The data to cache
   */
  public setItem(key: string, data: T): void {
    const cachedItem: CachedItem<T> = {
      data,
      timestamp: Date.now(),
      pdfFingerprint: this.currentPdfFingerprint || undefined
    };

    this.cacheStorage.set(key, cachedItem);
    this.saveCacheToStorage();

    HesseLogger.cache.update(`Stored item with key: ${key.substring(0, 8)}...`);
  }

  /**
   * Retrieve an item from the cache
   * @param key The cache key
   * @param maxAge Optional maximum age in milliseconds
   * @returns The cached data or null if not found or expired
   */
  public getItem(key: string, maxAge?: number): T | null {
    const cachedItem = this.cacheStorage.get(key);

    if (!cachedItem) {
      HesseLogger.cache.miss(`Cache miss for key: ${key.substring(0, 8)}...`);
      return null;
    }

    // Check if the PDF fingerprint matches
    if (this.currentPdfFingerprint && 
        cachedItem.pdfFingerprint && 
        cachedItem.pdfFingerprint !== this.currentPdfFingerprint) {
      HesseLogger.cache.invalidate(`Cache invalidated due to PDF change: ${key.substring(0, 8)}...`);
      this.cacheStorage.delete(key);
      return null;
    }

    const age = Date.now() - cachedItem.timestamp;
    const maxAgeToUse = maxAge || this.CACHE_DURATION_MS;

    if (age > maxAgeToUse) {
      HesseLogger.cache.invalidate(`Cache expired for key: ${key.substring(0, 8)}... (${Math.round(age / 1000 / 60)} minutes old)`);
      this.cacheStorage.delete(key);
      return null;
    }

    HesseLogger.cache.hit(`Cache hit for key: ${key.substring(0, 8)}... (${Math.round(age / 1000 / 60)} minutes old)`);
    return cachedItem.data;
  }

  /**
   * Clear all items from the cache
   */
  public clearCache(): void {
    const itemCount = this.cacheStorage.size;
    this.cacheStorage.clear();
    this.saveCacheToStorage();
    HesseLogger.cache.invalidate(`Cleared ${itemCount} items from cache`);
  }

  /**
   * Force refresh the PDF fingerprint
   */
  public refreshPdfFingerprint(): void {
    this.loadPdfFingerprint();
    HesseLogger.cache.update(`Refreshed PDF fingerprint: ${this.currentPdfFingerprint?.substring(0, 8) || 'none'}`);
  }
}

// Export a singleton instance for the OpenAI cache
export const dynamicOpenAiCache = new DynamicCacheService<any>('openai');

// Export a singleton instance for the string cache
export const dynamicStringCache = new DynamicCacheService<string>('string');
