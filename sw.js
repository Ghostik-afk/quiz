const CACHE_NAME = 'englishcheck-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/pages/quiz.html',
    '/pages/results.html',
    '/pages/admin.html',
    '/css/main.css',
    '/css/home.css',
    '/css/quiz.css',
    '/css/results.css',
    '/css/admin.css',
    '/js/home.js',
    '/js/quiz.js',
    '/js/results.js',
    '/js/admin.js',
    '/js/modules/dataLoader.js',
    '/js/utils/storage.js',
    '/js/utils/helpers.js',
    '/js/utils/confetti.js',
    '/data/questions.json'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
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

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
