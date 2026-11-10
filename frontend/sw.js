const CACHE_NAME = 'poc-v1';
const ASSETS = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  // Estrategia Network First con fallback a Caché para assets estáticos
  if (e.request.url.includes('/api/')) {
    return; // Peticiones API no se almacenan estáticamente en SW
  }
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});