const CACHE_VERSION = 'react-git-mastery-v1';
const CORE_CACHE = `${CACHE_VERSION}-core`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const CORE_ASSETS = [
  './',
  './index.html',
  './react-git-10day-tutorial.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

const OPTIONAL_RUNTIME_ASSETS = [
  'https://unpkg.com/react@18/umd/react.development.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.development.js',
  'https://unpkg.com/@babel/standalone/babel.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CORE_CACHE)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => caches.open(RUNTIME_CACHE))
      .then(cache => Promise.allSettled(
        OPTIONAL_RUNTIME_ASSETS.map(url => fetch(url, { mode: 'cors' }).then(response => {
          if (response && response.ok) {
            return cache.put(url, response);
          }
          return undefined;
        }))
      ))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  const keep = new Set([CORE_CACHE, RUNTIME_CACHE]);
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(key => keep.has(key) ? undefined : caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;

  if (request.method !== 'GET') return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CORE_CACHE).then(cache => cache.put('./index.html', copy));
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isOptionalRuntime = OPTIONAL_RUNTIME_ASSETS.includes(request.url);

  if (isSameOrigin || isOptionalRuntime) {
    event.respondWith(cacheFirst(request, isOptionalRuntime ? RUNTIME_CACHE : CORE_CACHE));
  }
});

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response && (response.ok || response.type === 'opaque')) {
      await cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const fallback = await caches.match('./index.html');
    if (fallback && request.destination === 'document') return fallback;
    throw error;
  }
}
