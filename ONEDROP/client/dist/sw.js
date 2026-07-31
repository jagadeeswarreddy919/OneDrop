const CACHE_NAME = 'onedrop-offline-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then((response) => {
        return response || caches.match('/index.html');
      });
    })
  );
});

// Push notification event for Mobile Phone Notification Bar
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'ONEDROP Alert', body: event.data.text() };
    }
  }

  const title = data.title || data.notification?.title || '🚨 ONEDROP Alert';
  const options = {
    body: data.body || data.message || data.notification?.body || 'New blood request or chat alert received.',
    icon: '/be_a_hero.png',
    badge: '/be_a_hero.png',
    vibrate: [300, 100, 300, 100, 300],
    requireInteraction: true,
    renotify: true,
    tag: data.tag || 'onedrop-push-' + Date.now(),
    data: data
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Mobile phone notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const data = event.notification.data || {};
  let targetUrl = '/';

  if (data.type === 'chat_message' || data.chatId) {
    targetUrl = `/chat?chatId=${data.chatId || ''}`;
  } else if (data.type === 'new_request' || data.type === 'emergency_request') {
    targetUrl = '/donor';
  } else if (data.type === 'request_accepted') {
    targetUrl = '/recipient';
  } else if (data.url) {
    targetUrl = data.url;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if ('focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
