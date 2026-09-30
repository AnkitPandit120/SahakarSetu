const CACHE_NAME = 'sahakarsetu-shell-v2';
const SHELL_ASSETS = [
  '/',
  '/manifest.json',
  '/images/modi_portrait.jpg',
  '/images/yogi_portrait.jpg',
  '/images/amit_shah_portrait.jpg',
  '/images/pacs_farmer_cooperative.jpg',
  '/images/cooperation_banner.jpg',
  '/images/crcs_sahara_banner.jpg',
  '/images/farmer_sugarcane.jpg',
  '/images/citizen_beneficiary.jpg',
  '/images/agricultural_land.jpg'
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
            console.log('Purging legacy service worker cache:', key);
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

  // For API or POST chat queries, network-only (always get fresh AI/RAG results)
  if (event.request.method !== 'GET' || url.pathname.startsWith('/api/') || url.pathname.startsWith('/chat/')) {
    return;
  }

  // Network-first for HTML pages and images to ensure fresh visual assets
  if (url.pathname === '/' || url.pathname.startsWith('/views/') || url.pathname.startsWith('/images/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const resClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
          }
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match('/')))
    );
  } else {
    // Other static JS/CSS assets: cache-first with network fallback
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return (
          cached ||
          fetch(event.request).then((response) => {
            if (response && response.status === 200) {
              const resClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
            }
            return response;
          })
        );
      })
    );
  }
});
