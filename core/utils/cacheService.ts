// This service works in both client and server environments

import { ResumeAnalysisResponse } from '@/types/openai';
import crypto from 'crypto';

/**
 * Cache service for OpenAI responses
 * Provides methods to store, retrieve, and manage cached responses
 */
export class CacheService {
  private static instance: CacheService;
  private cacheStorage: Map<string, CachedItem>;
  private readonly CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours by default
  private readonly DEV_MODE = process.env.NODE_ENV === 'development';

  constructor() {
    this.cacheStorage = new Map();
    this.loadCacheFromStorage();
  }

  /**
   * Get the singleton instance of CacheService
   */
  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  /**
   * Generate a cache key from content
   * @param content The content to hash
   * @returns A hash string to use as cache key
   */
  public generateCacheKey(content: string): string {
    return crypto.createHash('md5').update(content).digest('hex');
  }

  /**
   * Store an item in the cache
   * @param key The cache key
   * @param data The data to cache
   */
  public setItem(key: string, data: ResumeAnalysisResponse): void {
    const cachedItem: CachedItem = {
      data,
      timestamp: Date.now(),
    };

    this.cacheStorage.set(key, cachedItem);
    this.saveCacheToStorage();

    console.log(`🔵 [Cache] Stored item with key: ${key.substring(0, 8)}...`);
  }

  /**
   * Retrieve an item from the cache
   * @param key The cache key
   * @param maxAge Optional maximum age in milliseconds
   * @returns The cached data or null if not found or expired
   */
  public getItem(key: string, maxAge?: number): ResumeAnalysisResponse | null {
    const cachedItem = this.cacheStorage.get(key);

    if (!cachedItem) {
      console.log(`🟡 [Cache] Miss for key: ${key.substring(0, 8)}...`);
      return null;
    }

    const age = Date.now() - cachedItem.timestamp;
    const maxAgeToUse = maxAge || this.CACHE_DURATION_MS;

    if (age > maxAgeToUse) {
      console.log(`🟠 [Cache] Expired item for key: ${key.substring(0, 8)}... (${Math.round(age / 1000 / 60)} minutes old)`);
      return null;
    }

    console.log(`🟢 [Cache] Hit for key: ${key.substring(0, 8)}... (${Math.round(age / 1000 / 60)} minutes old)`);
    return cachedItem.data;
  }

  /**
   * Clear a specific item from the cache
   * @param key The cache key to clear
   */
  public clearItem(key: string): void {
    this.cacheStorage.delete(key);
    this.saveCacheToStorage();
    console.log(`🗑️ [Cache] Cleared item with key: ${key.substring(0, 8)}...`);
  }

  /**
   * Clear all items from the cache
   */
  public clearAll(): void {
    this.cacheStorage.clear();
    this.saveCacheToStorage();
    console.log('🧹 [Cache] Cleared all cached items');
  }

  /**
   * Save the cache to localStorage
   */
  private saveCacheToStorage(): void {
    // Skip if we're in a server environment
    if (typeof window === 'undefined') return;

    try {
      const serializedCache: Record<string, CachedItem> = {};

      this.cacheStorage.forEach((value, key) => {
        serializedCache[key] = value;
      });

      localStorage.setItem('openai_cache', JSON.stringify(serializedCache));
    } catch (error) {
      console.error('Failed to save cache to localStorage:', error);
    }
  }

  /**
   * Load the cache from localStorage
   */
  private loadCacheFromStorage(): void {
    // Skip if we're in a server environment
    if (typeof window === 'undefined') return;

    try {
      const cachedData = localStorage.getItem('openai_cache');

      if (cachedData) {
        const parsedCache = JSON.parse(cachedData) as Record<string, CachedItem>;

        Object.entries(parsedCache).forEach(([key, value]) => {
          this.cacheStorage.set(key, value);
        });

        console.log(`📂 [Cache] Loaded ${this.cacheStorage.size} items from storage`);

        // Clean up expired items
        this.cleanExpiredItems();
      }
    } catch (error) {
      console.error('Failed to load cache from localStorage:', error);
    }
  }

  /**
   * Remove expired items from the cache
   */
  private cleanExpiredItems(): void {
    const now = Date.now();
    let expiredCount = 0;

    this.cacheStorage.forEach((item, key) => {
      if (now - item.timestamp > this.CACHE_DURATION_MS) {
        this.cacheStorage.delete(key);
        expiredCount++;
      }
    });

    if (expiredCount > 0) {
      console.log(`🧹 [Cache] Cleaned up ${expiredCount} expired items`);
      this.saveCacheToStorage();
    }
  }

  /**
   * Check if we're in development mode
   */
  public isDevelopmentMode(): boolean {
    // For server-side rendering compatibility
    if (typeof process === 'undefined') return false;
    return process.env.NODE_ENV === 'development';
  }
}

/**
 * Interface for cached items
 */
interface CachedItem {
  data: ResumeAnalysisResponse;
  timestamp: number;
}

// Export a singleton instance
export const cacheService = CacheService.getInstance();
