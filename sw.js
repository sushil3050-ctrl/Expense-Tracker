const CACHE_NAME = 'expense-tracker-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/offline.html'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Skip waiting');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Service Worker] Cache failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log('[Service Worker] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[Service Worker] Claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Handle Chart.js from CDN
  if (url.hostname === 'cdn.jsdelivr.net') {
    event.respondWith(
      caches.match(request)
        .then((cached) => {
          if (cached) {
            return cached;
          }
          
          return fetch(request)
            .then((response) => {
              // Clone the response before caching
              const responseToCache = response.clone();
              
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(request, responseToCache);
                });
              
              return response;
            })
            .catch(() => {
              // If CDN fails and not cached, return offline page
              if (request.mode === 'navigate') {
                return caches.match('/offline.html');
              }
            });
        })
    );
    return;
  }
  
  // Cache-first strategy for static assets
  if (STATIC_ASSETS.includes(url.pathname) || 
      url.pathname.endsWith('.html') || 
      url.pathname.endsWith('.css') || 
      url.pathname.endsWith('.js') ||
      url.pathname.endsWith('.json')) {
    
    event.respondWith(
      caches.match(request)
        .then((cached) => {
          // Return cached version immediately
          if (cached) {
            // Fetch fresh version in background
            fetch(request)
              .then((response) => {
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(request, response);
                  });
              })
              .catch(() => {
                // Network failed, but we have cached version
              });
            
            return cached;
          }
          
          // Not in cache, fetch from network
          return fetch(request)
            .then((response) => {
              const responseToCache = response.clone();
              
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(request, responseToCache);
                });
              
              return response;
            })
            .catch(() => {
              // Network failed, serve offline page
              if (request.mode === 'navigate' || request.destination === 'document') {
                return caches.match('/offline.html');
              }
            });
        })
    );
    return;
  }
  
  // Network-first strategy for API calls (if any)
  event.respondWith(
    fetch(request)
      .then((response) => {
        const responseToCache = response.clone();
        
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(request, responseToCache);
          });
        
        return response;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});

// Background sync for data persistence (optional enhancement)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-expenses') {
    event.waitUntil(
      // Could sync data with a server here
      console.log('[Service Worker] Background sync triggered')
    );
  }
});

// Push notifications (optional)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Expense Tracker Update',
    icon: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 192 192%22%3E%3Crect fill=%22%233b82f6%22 rx=%2220%22 width=%22192%22 height=%22192%22/%3E%3Ctext x=%2296%22 y=%22130%22 font-size=%22120%22 text-anchor=%22middle%22 fill=%22white%22%3E💰%3C/text%3E%3C/svg%3E',
    badge: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 192 192%22%3E%3Crect fill=%22%233b82f6%22 rx=%2220%22 width=%22192%22 height=%22192%22/%3E%3Ctext x=%2296%22 y=%22130%22 font-size=%22120%22 text-anchor=%22middle%22 fill=%22white%22%3E💰%3C/text%3E%3C/svg%3E',
    tag: 'expense-tracker-notification',
    requireInteraction: false
  };
  
  event.waitUntil(
    self.registration.showNotification('Expense Tracker', options)
  );
});

// Message handling from main thread
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

console.log('[Service Worker] Registered');