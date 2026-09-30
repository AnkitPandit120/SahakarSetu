const CACHE_NAME = 'sahakarsetu-shell-v1';
const SHELL_ASSETS = [
  '/',
  '/css/style.css',
  '/js/htmx.min.js',
  '/manifest.json',
  '/images/modi_portrait.jpg',
  '/images/yogi_portrait.jpg',
  '/images/amit_shah_portrait.jpg',
  '/images/pacs_farmer_cooperative.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(SHELL_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // For API or POST chat queries, network-first (always get fresh AI/RAG results)
  if (event.request.method !== 'GET' || url.pathname.startsWith('/api/') || url.pathname.startsWith('/chat/')) {
    return;
  }

  // Network-first with cache fallback for HTML navigation, Cache-first for static assets
  if (url.pathname === '/' || url.pathname.startsWith('/views/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const resClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match('/')))
    );
  } else {
    // Static assets: cache-first
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return (
          cached ||
          fetch(event.request).then((response) => {
            const resClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
            return response;
          })
        );
      })
    );
  }
});
