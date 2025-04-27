const CACHE_NAME = 'lostmyphone-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/main.*.js',
  '/static/css/main.*.css',
  '/static/media/*',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png'
];

// Install a service worker
/* eslint-disable-next-line no-restricted-globals */
addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Cache and return requests
/* eslint-disable-next-line no-restricted-globals */
addEventListener('fetch', event => {
  // Skip non-GET requests and those that are for API
  if (event.request.method !== 'GET' || 
      event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          response => {
            // Return the response
            return response;
          }
        );
      })
  );
});

// Update a service worker
/* eslint-disable-next-line no-restricted-globals */
addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); 