const cacheName = 'v1';
const cacheAssets = [
    '/',
    '/index.html',
    '/styles.css',
    '/scripts.js',
    '/manifest.json', // or /site.webmanifest
    '/icons/android-chrome-192x192.png',
    '/icons/android-chrome-384x384.png'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches
            .open(cacheName)
            .then(cache => {
                console.log('Caching files');
                return cache.addAll(cacheAssets);
            })
            .then(() => self.skipWaiting())
    );
});


// Activate event
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== cacheName) {
                        console.log('Clearing old cache');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Fetch event
self.addEventListener('fetch', e => {
    e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request))
    );
});
