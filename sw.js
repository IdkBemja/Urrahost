/**
 * Service Worker - Urra Hosting
 * Cache strategy for offline support and performance
 * Version: 1.0.0
 */

const CACHE_NAME = 'urrahost-v1.0.0';
const RUNTIME_CACHE = 'urrahost-runtime';

// Files to cache immediately on install
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/assets/css/app.min.css',
    '/assets/css/mobile-app.min.css',
    '/assets/js/detect-browser.js',
    '/assets/js/error-handler.js',
    '/assets/js/webp-handler.js',
    '/assets/js/animations.js',
    '/assets/imgs/logo.png',
    '/manifest.json',
    '/offline.html'
];

// Install event - cache essential files
self.addEventListener('install', event => {
    console.log('[SW] Installing Service Worker...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Precaching essential files');
                return cache.addAll(PRECACHE_URLS);
            })
            .then(() => self.skipWaiting())
            .catch(error => {
                console.error('[SW] Precache failed:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('[SW] Activating Service Worker...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(cacheName => {
                            return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
                        })
                        .map(cacheName => {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip cross-origin requests
    if (url.origin !== location.origin) {
        return;
    }

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    console.log('[SW] Serving from cache:', request.url);
                    return cachedResponse;
                }

                // Clone the request
                const fetchRequest = request.clone();

                return fetch(fetchRequest)
                    .then(response => {
                        // Check if valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        // Cache runtime files
                        if (shouldCache(request.url)) {
                            caches.open(RUNTIME_CACHE)
                                .then(cache => {
                                    console.log('[SW] Caching runtime file:', request.url);
                                    cache.put(request, responseToCache);
                                });
                        }

                        return response;
                    })
                    .catch(error => {
                        console.error('[SW] Fetch failed:', error);
                        
                        // Return offline page for navigation requests
                        if (request.mode === 'navigate') {
                            return caches.match('/offline.html');
                        }
                        
                        return new Response('Network error happened', {
                            status: 408,
                            headers: { 'Content-Type': 'text/plain' }
                        });
                    });
            })
    );
});

// Determine if file should be cached
function shouldCache(url) {
    // Cache CSS, JS, images, fonts
    const cacheableExtensions = ['.css', '.js', '.jpg', '.jpeg', '.png', '.webp', '.svg', '.woff', '.woff2', '.ttf'];
    return cacheableExtensions.some(ext => url.endsWith(ext));
}

// Message event - handle commands from clients
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        console.log('[SW] Skip waiting requested');
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CACHE_URLS') {
        console.log('[SW] Caching additional URLs');
        event.waitUntil(
            caches.open(RUNTIME_CACHE)
                .then(cache => cache.addAll(event.data.urls))
        );
    }

    if (event.data && event.data.type === 'CLEAR_CACHE') {
        console.log('[SW] Clearing runtime cache');
        event.waitUntil(
            caches.delete(RUNTIME_CACHE)
        );
    }
});

// Background sync for offline actions
self.addEventListener('sync', event => {
    console.log('[SW] Background sync:', event.tag);
    
    if (event.tag === 'sync-analytics') {
        event.waitUntil(syncAnalytics());
    }
});

async function syncAnalytics() {
    // Implement analytics sync logic here
    console.log('[SW] Syncing analytics data');
}

// Push notification support (optional)
self.addEventListener('push', event => {
    console.log('[SW] Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'Nueva notificación',
        icon: '/assets/imgs/logo.png',
        badge: '/assets/imgs/logo.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Ver más',
                icon: '/assets/imgs/checkmark.png'
            },
            {
                action: 'close',
                title: 'Cerrar',
                icon: '/assets/imgs/xmark.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('Urra Hosting', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
    console.log('[SW] Notification clicked:', event.action);
    
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

console.log('[SW] Service Worker loaded');
