const API_BASE_URL =
  ((typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  (typeof window !== 'undefined' && (window.__API_BASE_URL__ || `${window.location.origin}/api`)) ||
  '/api');

// Cache configuration
const CACHE_CONFIG = {
  categories: { ttl: 5 * 60 * 1000 }, // 5 minutes
  gridData: { ttl: 10 * 60 * 1000 }, // 10 minutes
  withSubcategories: { ttl: 15 * 60 * 1000 }, // 15 minutes
};

// Simple in-memory cache with TTL
class CacheManager {
  constructor() {
    this.cache = new Map();
  }

  set(key, value, ttl) {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  clear(key) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  clearExpired() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

const cacheManager = new CacheManager();

// Clean expired cache entries every minute
setInterval(() => cacheManager.clearExpired(), 60 * 1000);

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 5000,
};

// Exponential backoff retry function
async function retryWithBackoff(fn, retries = RETRY_CONFIG.maxRetries) {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    
    const delay = Math.min(
      RETRY_CONFIG.baseDelay * Math.pow(2, RETRY_CONFIG.maxRetries - retries),
      RETRY_CONFIG.maxDelay
    );
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryWithBackoff(fn, retries - 1);
  }
}

// Enhanced fetch with timeout and retry
async function fetchWithTimeout(url, options = {}, timeout = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

class CategoryService {
  static async getCategories() {
    const cacheKey = 'categories';
    const cached = cacheManager.get(cacheKey);
    if (cached) return cached;

    try {
      const response = await retryWithBackoff(() => 
        fetchWithTimeout(`${API_BASE_URL}/categories`, {}, 8000)
      );
      const data = await response.json();

      if (data.success) {
        cacheManager.set(cacheKey, data.data, CACHE_CONFIG.categories.ttl);
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  static async getCategoriesWithSubcategories() {
    const cacheKey = 'categoriesWithSubcategories';
    const cached = cacheManager.get(cacheKey);
    if (cached) return cached;

    try {
      const response = await retryWithBackoff(() => 
        fetchWithTimeout(`${API_BASE_URL}/categories/with-subcategories`, {}, 12000)
      );
      const data = await response.json();

      if (data.success) {
        cacheManager.set(cacheKey, data.data, CACHE_CONFIG.withSubcategories.ttl);
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch categories with subcategories');
      }
    } catch (error) {
      console.error('Error fetching categories with subcategories:', error);
      throw error;
    }
  }

  static async getCategoryBySlug(slug) {
    const cacheKey = `category_${slug}`;
    const cached = cacheManager.get(cacheKey);
    if (cached) return cached;

    try {
      const response = await retryWithBackoff(() => 
        fetchWithTimeout(`${API_BASE_URL}/categories/slug/${slug}`, {}, 8000)
      );
      const data = await response.json();
      if (data.success) {
        cacheManager.set(cacheKey, data.data, CACHE_CONFIG.categories.ttl);
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch category by slug');
      }
    } catch (error) {
      console.error('Error fetching category by slug:', error);
      throw error;
    }
  }

  static async getCategoryWithSubcategories(slug) {
    try {
      // Get all categories with subcategories and find the specific one
      const allCategories = await this.getCategoriesWithSubcategories();
      const category = allCategories.find(cat => cat.slug === slug);
      
      if (!category) {
        throw new Error('Category not found');
      }
      
      return category;
    } catch (error) {
      console.error('Error fetching category with subcategories:', error);
      throw error;
    }
  }

  static async getCategoryGridData() {
    const cacheKey = 'categoryGridData';
    const cached = cacheManager.get(cacheKey);
    if (cached) return cached;

    try {
      const response = await retryWithBackoff(() => 
        fetchWithTimeout(`${API_BASE_URL}/categories/grid-data`, {}, 10000)
      );
      const contentType = response.headers.get('content-type') || '';
      let data = null;
      try {
        if (contentType.includes('application/json')) {
          data = await response.json();
        }
      } catch (_) {}

      if (response.ok && data && data.success) {
        cacheManager.set(cacheKey, data.data, CACHE_CONFIG.gridData.ttl);
        return data.data;
      } else {
        throw new Error((data && data.message) || 'Failed to fetch category grid data');
      }
    } catch (error) {
      // Avoid noisy console in production; surface a user-friendly fallback upstream
      throw error;
    }
  }

  static async getCategoryById(id) {
    const cacheKey = `category_${id}`;
    const cached = cacheManager.get(cacheKey);
    if (cached) return cached;

    try {
      const response = await retryWithBackoff(() => 
        fetchWithTimeout(`${API_BASE_URL}/categories/${id}`, {}, 8000)
      );
      const data = await response.json();
      if (data.success) {
        cacheManager.set(cacheKey, data.data, CACHE_CONFIG.categories.ttl);
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch category');
      }
    } catch (error) {
      console.error('Error fetching category by ID:', error);
      throw error;
    }
  }

  static async createCategory(categoryData) {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });
      const data = await response.json();
      if (data.success) {
        // Clear relevant caches after creation
        this.clearCacheKey('categories');
        this.clearCacheKey('categoryGridData');
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to create category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  static async updateCategory(id, categoryData) {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });
      const data = await response.json();
      if (data.success) {
        // Clear relevant caches after update
        this.clearCacheKey('categories');
        this.clearCacheKey('categoryGridData');
        this.clearCacheKey(`category_${id}`);
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to update category');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  static async deleteCategory(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        // Clear relevant caches after deletion
        this.clearCacheKey('categories');
        this.clearCacheKey('categoryGridData');
        this.clearCacheKey(`category_${id}`);
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  // Cache management methods
  static clearCacheKey(key) {
    cacheManager.clear(key);
    return true;
  }

  static clearAllCache() {
    cacheManager.clear();
    return true;
  }

  // Performance monitoring
  static async measurePerformance(operation, fn) {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      
      // Log slow operations in development
      if (process.env.NODE_ENV === 'development' && duration > 1000) {
        console.warn(`⚠️ Slow operation detected: ${operation} took ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`❌ Operation failed: ${operation} after ${duration.toFixed(2)}ms`, error);
      throw error;
    }
  }
}

export default CategoryService;