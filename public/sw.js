const CACHE_NAME = 'pn-cache-v1'
const PRECACHE_URLS = ['/', '/manifest.webmanifest', '/icon-192.png', '/icon-512.png']

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
    )
    self.skipWaiting()
})

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
        ))
    )
    self.clients.claim()
})

// Stale-while-revalidate: serve from cache immediately when available, and
// refresh the cache in the background so the next visit gets fresh content.
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') {
        return
    }

    event.respondWith(
        caches.match(event.request).then((cached) => {
            const networkFetch = fetch(event.request).then((response) => {
                if (response.ok) {
                    const responseClone = response.clone()
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone))
                }
                return response
            }).catch(() => cached)

            return cached || networkFetch
        })
    )
})
