const CACHE_NAME = 'notes-cache-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/app.js',
    '/manifest.json',
    '/icons/FutureIcon16x16.png',
    '/icons/FutureIcon32x32.png',
    '/icons/FutureIcon48x48.png',
    '/icons/FutureIcon64x64.png',
    '/icons/FutureIcon128x128.png',
    '/icons/FutureIcon152x152.png',
    '/icons/FutureIcon256x256.png',
    '/icons/FutureIcon512x512.png',
    '/icons/FutureIcon.ico',
];

self.addEventListener('install', event => {
    console.log('[SW] Установка');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Кэширование ресурсов');
                return cache.addAll(ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    console.log('[SW] Активация');
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => {
                        console.log('[SW] Удаление старого кэша:', key);
                        return caches.delete(key);
                    })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});