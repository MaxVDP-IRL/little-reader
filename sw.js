const CACHE = 'little-reader-v1';
const ASSETS = [
  '/little-reader/',
  '/little-reader/index.html',
  '/little-reader/app.js',
  '/little-reader/styles.css',
  '/little-reader/manifest.json',
  '/little-reader/icon-192.png',
  '/little-reader/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => caches.match('/little-reader/')))
  );
});
