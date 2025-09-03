// Performance Optimization Utilities for CategoryGrid Component

// Lazy loading utility for images
export const lazyLoadImage = (imgElement, src, placeholder = null) => {
  if (!imgElement) return;

  // Set placeholder if provided
  if (placeholder) {
    imgElement.src = placeholder;
  }

  // Create intersection observer for lazy loading
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = src;
        img.classList.remove('lazy');
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px 0px', // Start loading 50px before image comes into view
    threshold: 0.01
  });

  imageObserver.observe(imgElement);
};

// Debounce utility for search and scroll events
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

// Throttle utility for scroll events
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Performance monitoring utility
export const measurePerformance = (operation, fn) => {
  const start = performance.now();
  return fn().finally(() => {
    const duration = performance.now() - start;
    
    // Log slow operations in development
    if (process.env.NODE_ENV === 'development' && duration > 100) {
      console.warn(`⚠️ Slow operation detected: ${operation} took ${duration.toFixed(2)}ms`);
    }
    
    // Send to analytics in production
    if (process.env.NODE_ENV === 'production' && duration > 500) {
      // You can integrate with your analytics service here
      console.warn(`Performance issue: ${operation} took ${duration.toFixed(2)}ms`);
    }
  });
};

// Virtual scrolling utility for large lists
export const createVirtualScroller = (container, itemHeight, totalItems, renderItem) => {
  let scrollTop = 0;
  let visibleItems = [];
  
  const updateVisibleItems = () => {
    const containerHeight = container.clientHeight;
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(startIndex + Math.ceil(containerHeight / itemHeight) + 1, totalItems);
    
    visibleItems = Array.from({ length: endIndex - startIndex }, (_, i) => startIndex + i);
    
    // Update container scroll height
    container.style.height = `${totalItems * itemHeight}px`;
    
    // Render only visible items
    renderItem(visibleItems, startIndex);
  };
  
  const handleScroll = throttle(() => {
    scrollTop = container.scrollTop;
    updateVisibleItems();
  }, 16); // ~60fps
  
  container.addEventListener('scroll', handleScroll);
  updateVisibleItems();
  
  return {
    destroy: () => {
      container.removeEventListener('scroll', handleScroll);
    },
    update: updateVisibleItems
  };
};

// Memory management utility
export const createMemoryManager = () => {
  const observers = new Set();
  const timeouts = new Set();
  const intervals = new Set();
  
  const addObserver = (observer) => {
    observers.add(observer);
    return observer;
  };
  
  const addTimeout = (callback, delay) => {
    const timeoutId = setTimeout(() => {
      timeouts.delete(timeoutId);
      callback();
    }, delay);
    timeouts.add(timeoutId);
    return timeoutId;
  };
  
  const addInterval = (callback, delay) => {
    const intervalId = setInterval(callback, delay);
    intervals.add(intervalId);
    return intervalId;
  };
  
  const cleanup = () => {
    // Disconnect all observers
    observers.forEach(observer => {
      if (observer.disconnect) observer.disconnect();
      if (observer.unobserve) observer.unobserve();
    });
    observers.clear();
    
    // Clear all timeouts
    timeouts.forEach(timeoutId => clearTimeout(timeoutId));
    timeouts.clear();
    
    // Clear all intervals
    intervals.forEach(intervalId => clearInterval(intervalId));
    intervals.clear();
  };
  
  return {
    addObserver,
    addTimeout,
    addInterval,
    cleanup
  };
};

// Image optimization utility
export const optimizeImage = (src, options = {}) => {
  const {
    width = 300,
    height = 200,
    quality = 80,
    format = 'webp'
  } = options;
  
  // If it's an external image service, optimize the URL
  if (src.includes('unsplash.com')) {
    return `${src}&w=${width}&h=${height}&fit=crop&q=${quality}&fm=${format}`;
  }
  
  if (src.includes('cloudinary.com')) {
    return src.replace('/upload/', `/upload/w_${width},h_${height},c_fill,q_${quality},f_${format}/`);
  }
  
  // For local images, return as is (consider using next/image or similar for optimization)
  return src;
};

// Bundle size optimization utility
export const preloadCriticalResources = () => {
  // Preload critical CSS and JS
  const criticalResources = [
    '/src/index.css',
    '/src/App.jsx'
  ];
  
  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    link.as = resource.endsWith('.css') ? 'style' : 'script';
    document.head.appendChild(link);
  });
};

// Network optimization utility
export const createRequestQueue = (maxConcurrent = 3) => {
  const queue = [];
  let running = 0;
  
  const processQueue = async () => {
    if (running >= maxConcurrent || queue.length === 0) return;
    
    running++;
    const { request, resolve, reject } = queue.shift();
    
    try {
      const result = await request();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      running--;
      processQueue();
    }
  };
  
  const add = (request) => {
    return new Promise((resolve, reject) => {
      queue.push({ request, resolve, reject });
      processQueue();
    });
  };
  
  return { add };
};

// Export all utilities
export default {
  lazyLoadImage,
  debounce,
  throttle,
  measurePerformance,
  createVirtualScroller,
  createMemoryManager,
  optimizeImage,
  preloadCriticalResources,
  createRequestQueue
};
