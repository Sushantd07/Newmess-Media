// Service Worker for CategoryGrid Performance Optimization
const CACHE_NAME = 'category-grid-v1';
const STATIC_CACHE = 'static-v1';
const API_CACHE = 'api-v1';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png'
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/categories',
  '/api/categories/grid-data',
  '/api/categories/with-subcategories'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== API_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - handle requests with caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests with cache-first strategy
  if (API_ENDPOINTS.some(endpoint => url.pathname.includes(endpoint))) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static assets with cache-first strategy
  if (request.destination === 'image' || request.destination === 'script' || request.destination === 'style') {
    event.respondWith(handleStaticRequest(request));
    return;
  }

  // Handle HTML requests with network-first strategy
  if (request.destination === 'document') {
    event.respondWith(handleDocumentRequest(request));
    return;
  }

  // Default: network-first strategy
  event.respondWith(handleDefaultRequest(request));
});

// API request handler - cache-first with network fallback
async function handleApiRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Check if cache is still valid (less than 10 minutes old)
      const cacheTime = new Date(cachedResponse.headers.get('sw-cache-time'));
      const now = new Date();
      if (now - cacheTime < 10 * 60 * 1000) { // 10 minutes
        return cachedResponse;
      }
    }

    // Fetch from network
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Clone response to cache
      const responseToCache = networkResponse.clone();
      
      // Add cache timestamp
      const headers = new Headers(responseToCache.headers);
      headers.set('sw-cache-time', new Date().toISOString());
      
      const responseWithTimestamp = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers
      });

      // Cache the response
      const cache = await caches.open(API_CACHE);
      cache.put(request, responseWithTimestamp);
    }

    return networkResponse;
  } catch (error) {
    // If network fails, try to return cached response
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Offline mode - please check your connection' 
      }), 
      { 
        status: 503, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}

// Static asset handler - cache-first strategy
async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return new Response('Offline', { status: 503 });
  }
}

// Document handler - network-first strategy
async function handleDocumentRequest(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response('Offline', { status: 503 });
  }
}

// Default handler - network-first strategy
async function handleDefaultRequest(request) {
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response('Offline', { status: 503 });
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Perform background sync operations
    console.log('Performing background sync...');
    
    // Clear old caches
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(async (cacheName) => {
        if (cacheName !== STATIC_CACHE && cacheName !== API_CACHE) {
          await caches.delete(cacheName);
        }
      })
    );
    
    console.log('Background sync completed');
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(clearAllCaches());
  }
});

async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
  console.log('All caches cleared');
}
