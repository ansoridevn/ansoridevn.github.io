const CACHE_NAME = 'skincare-cache-v2';

// Daftar file yang wajib disimpan di HP agar bisa offline
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,600&family=Poppins:wght@400;500;600&display=swap',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=1000&auto=format&fit=crop' // Gambar background utama
];

// 1. Proses Install Service Worker & Simpan Cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Membuka cache skincare');
        return cache.addAll(urlsToCache);
      })
  );
  // Memaksa SW yang baru langsung aktif tanpa menunggu halaman ditutup
  self.skipWaiting();
});

// 2. Proses Intercept Fetch (Mengambil data dari Cache jika offline)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Jika file ada di cache, gunakan cache. Jika tidak, ambil dari internet.
        return response || fetch(event.request);
      })
  );
});

// 3. Proses Activate & Bersihkan Cache Lama (Penting agar tidak bentrok)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Hapus cache yang depannya "skincare-" tapi versinya sudah usang
          // Pastikan tidak menyentuh cache milik aplikasi lain di root
          if (cacheName.startsWith('skincare-') && cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
