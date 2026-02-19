const CACHE_NAME = 'ansori-pos-v1';
const urlsToCache = [
  'pos.html',
  'pos_order.html',
  'manifest.json',
  'https://cdn-icons-png.flaticon.com/512/2434/2434440.png'
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
        // Return cache if found, else fetch from network
        return response || fetch(event.request);
      })
  );
});
