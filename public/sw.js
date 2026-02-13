const CACHE_NAME = 'valentine-surprise-v2';
const BASE_PATH = '/valentine-surprise/';

// Files to cache for offline use only
const urlsToCache = [
    BASE_PATH,
    BASE_PATH + 'music.mp3',
    BASE_PATH + 'heart.svg',
    BASE_PATH + 'icon-192.svg',
    BASE_PATH + 'icon-512.svg'
];

// Install - cache essential files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting()) // Activate immediately
    );
});

// Activate - delete ALL old caches immediately
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Take control immediately
    );
});

// Fetch - NETWORK FIRST strategy
// Always try to get fresh content from the server.
// Only use cache if the network is unavailable (offline).
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // Got fresh response - update cache with it
                if (networkResponse && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                // Network failed (offline) - try cache
                return caches.match(event.request).then((cachedResponse) => {
                    return cachedResponse || caches.match(BASE_PATH);
                });
            })
    );
});
