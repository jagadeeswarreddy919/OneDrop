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

// Push notification event for Mobile Phone Notification Bar & System Popups
self.addEventListener('push', (event) => {
  let parsed = {};
  if (event.data) {
    try {
      parsed = event.data.json();
    } catch (e) {
      parsed = { title: '🚨 ONEDROP Alert', body: event.data.text() };
    }
  }

  const title = parsed.title || parsed.notification?.title || '🚨 ONEDROP Lifesaver Alert';
  const body = parsed.body || parsed.message || parsed.notification?.body || 'New blood request or urgent alert received.';
  const payloadData = parsed.data || parsed;

  const options = {
    body: body,
    icon: '/be_a_hero.png',
    badge: '/be_a_hero.png',
    vibrate: [300, 100, 300, 100, 300],
    requireInteraction: true,
    renotify: true,
    tag: parsed.tag || 'onedrop-push-' + Date.now(),
    data: payloadData,
    actions: [
      { action: 'open', title: 'Open ONEDROP' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Mobile phone & OS system notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const rawData = event.notification.data || {};
  const data = rawData.data || rawData;
  let targetUrl = '/';

  if (data.type === 'chat_message' || data.chatId) {
    targetUrl = data.chatId ? `/chat?chatId=${data.chatId}` : '/chat';
  } else if (data.type === 'new_request' || data.type === 'emergency_request') {
    targetUrl = '/donor';
  } else if (data.type === 'request_accepted') {
    targetUrl = '/recipient';
  } else if (data.type === 'certificate_issued') {
    targetUrl = '/donor-dashboard?action=certificate';
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
