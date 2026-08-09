// ONEDROP Firebase Cloud Messaging service worker
importScripts('/firebase-config.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

const config = self.FIREBASE_WEB_CONFIG || {};
if (config.apiKey && config.projectId) {
  firebase.initializeApp(config);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    const title = payload.notification?.title || payload.data?.title || '🚨 ONEDROP Alert';
    const options = {
      body: payload.notification?.body || payload.data?.body || payload.data?.message || 'Blood match or chat alert received.',
      icon: '/be_a_hero.png',
      badge: '/be_a_hero.png',
      vibrate: [300, 100, 300, 100, 300],
      requireInteraction: true,
      renotify: true,
      data: payload.data || {},
      tag: payload.data?.type || 'onedrop-push-' + Date.now()
    };
    self.registration.showNotification(title, options);
  });
}

// Universal Web Push handler for Mobile Phone Top Notification Bar & OS Popups
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

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const rawData = event.notification.data || {};
  const data = rawData.data || rawData;
  let targetUrl = '/';

  if (data.type === 'chat_message' && data.chatId) {
    targetUrl = `/chat?chatId=${data.chatId}`;
  } else if (data.type === 'new_request' || data.type === 'emergency_request') {
    targetUrl = '/donor';
  } else if (data.type === 'request_accepted') {
    targetUrl = '/recipient';
  } else if (data.type === 'camp_announcement') {
    targetUrl = '/campaigns';
  } else if (data.type === 'certificate_issued') {
    targetUrl = '/donor-dashboard?action=certificate';
  } else if (data.chatPartnerId) {
    targetUrl = `/chat?partnerId=${data.chatPartnerId}`;
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
