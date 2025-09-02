"use strict";
// This service works in both client and server environments
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheService = exports.CacheService = void 0;
const crypto_1 = __importDefault(require("crypto"));
/**
 * Cache service for OpenAI responses
 * Provides methods to store, retrieve, and manage cached responses
 */
class CacheService {
    constructor() {
        this.CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours by default
        this.DEV_MODE = process.env.NODE_ENV === 'development';
        this.cacheStorage = new Map();
        this.loadCacheFromStorage();
    }
    /**
     * Get the singleton instance of CacheService
     */
    static getInstance() {
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
    generateCacheKey(content) {
        return crypto_1.default.createHash('md5').update(content).digest('hex');
    }
    /**
     * Store an item in the cache
     * @param key The cache key
     * @param data The data to cache
     */
    setItem(key, data) {
        const cachedItem = {
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
    getItem(key, maxAge) {
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
    clearItem(key) {
        this.cacheStorage.delete(key);
        this.saveCacheToStorage();
        console.log(`🗑️ [Cache] Cleared item with key: ${key.substring(0, 8)}...`);
    }
    /**
     * Clear all items from the cache
     */
    clearAll() {
        this.cacheStorage.clear();
        this.saveCacheToStorage();
        console.log('🧹 [Cache] Cleared all cached items');
    }
    /**
     * Save the cache to localStorage
     */
    saveCacheToStorage() {
        // Skip if we're in a server environment
        if (typeof window === 'undefined')
            return;
        try {
            const serializedCache = {};
            this.cacheStorage.forEach((value, key) => {
                serializedCache[key] = value;
            });
            localStorage.setItem('openai_cache', JSON.stringify(serializedCache));
        }
        catch (error) {
            console.error('Failed to save cache to localStorage:', error);
        }
    }
    /**
     * Load the cache from localStorage
     */
    loadCacheFromStorage() {
        // Skip if we're in a server environment
        if (typeof window === 'undefined')
            return;
        try {
            const cachedData = localStorage.getItem('openai_cache');
            if (cachedData) {
                const parsedCache = JSON.parse(cachedData);
                Object.entries(parsedCache).forEach(([key, value]) => {
                    this.cacheStorage.set(key, value);
                });
                console.log(`📂 [Cache] Loaded ${this.cacheStorage.size} items from storage`);
                // Clean up expired items
                this.cleanExpiredItems();
            }
        }
        catch (error) {
            console.error('Failed to load cache from localStorage:', error);
        }
    }
    /**
     * Remove expired items from the cache
     */
    cleanExpiredItems() {
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
    isDevelopmentMode() {
        // For server-side rendering compatibility
        if (typeof process === 'undefined')
            return false;
        return process.env.NODE_ENV === 'development';
    }
}
exports.CacheService = CacheService;
// Export a singleton instance
exports.cacheService = CacheService.getInstance();
//# sourceMappingURL=cacheService.js.map