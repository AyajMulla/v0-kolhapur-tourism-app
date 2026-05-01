importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

if (workbox) {
  console.log('[SW] Workbox is loaded');
  
  workbox.core.skipWaiting();
  workbox.core.clientsClaim();

  // Cache static assets (CSS, JS, Fonts)
  workbox.routing.registerRoute(
    ({request}) => request.destination === 'style' || request.destination === 'script' || request.destination === 'font',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'static-resources',
    })
  );

  // Cache API requests for Places, Hotels, etc. (Network First, Fallback to Cache)
  workbox.routing.registerRoute(
    ({url}) => url.pathname.startsWith('/api/'),
    new workbox.strategies.NetworkFirst({
      cacheName: 'api-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, // 24 Hours
        }),
      ],
    })
  );

  // Cache Images (Cache First)
  workbox.routing.registerRoute(
    ({request}) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'image-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    })
  );

  // Default Page Caching (Network First)
  workbox.routing.registerRoute(
    ({request}) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'pages',
    })
  );
}
