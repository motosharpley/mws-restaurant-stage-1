let CACHE = 'mws-stage1-cache-v3';
let urlsToCache = [
  '/',
  '/restaurant.html',
  'css/styles.css',
  'js/main.js',
  'js/restaurant_info.js',
  'js/dbhelper.js',
  'data/restaurants.json',
  'img/1.jpg',
  'img/2.jpg',
  'img/3.jpg',
  'img/4.jpg',
  'img/5.jpg',
  'img/6.jpg',
  'img/7.jpg',
  'img/8.jpg',
  'img/9.jpg',
  'img/10.jpg'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('mws-') &&
                 cacheName != CACHE;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  // Let the browser do its default thing
  // for non-GET requests.
  if (event.request.method != 'GET') return;

  // const requestUrl = new URL(event.request.url);

  // if (requestUrl.origin === location.origin) {
  //   if (requestUrl.pathname === '/') {
  //     event.respondWith(caches.match('/restaurant'))
  //   }
  // }

  // Prevent the default, and handle the request ourselves.
  event.respondWith(async function() {
    // Try to get the response from a cache.
    const cache = await caches.open(CACHE);
    const cachedResponse = await cache.match(event.request);

    if (cachedResponse) {
      // If we found a match in the cache, return it, but also
      // update the entry in the cache in the background.
      event.waitUntil(cache.add(event.request));
      return cachedResponse;
    }

    // If we didn't find a match in the cache, use the network.
    return fetch(event.request);
  }());
});

