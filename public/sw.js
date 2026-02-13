const CACHE_NAME = 'valentine-surprise-v1';
const BASE_PATH = '/valentine-surprise/';

// Files to cache for offline use
const urlsToCache = [
    BASE_PATH,
    BASE_PATH + 'index.html',
    BASE_PATH + 'music.mp3',
    BASE_PATH + 'heart.svg',
    BASE_PATH + 'icon-192.svg',
    BASE_PATH + 'icon-512.svg',
    BASE_PATH + 'manifest.json'
];

// Install event - cache core files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('💝 Caching app shell');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('💝 Removing old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                if (response) {
                    return response;
                }
                return fetch(event.request).then((fetchResponse) => {
                    // Cache new resources dynamically
                    if (fetchResponse && fetchResponse.status === 200) {
                        const responseClone = fetchResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseClone);
                        });
                    }
                    return fetchResponse;
                });
            })
            .catch(() => {
                // If both cache and network fail, return the cached index
                return caches.match(BASE_PATH + 'index.html');
            })
    );
});
