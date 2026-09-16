// Clikchat Progressive Web App Service Worker
const CACHE_NAME = 'clikchat-cache-v1.20.52';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => clients.claim())
  );
});

// Push Notification Event Listener (Triggered when Business Owner answers Fallback query)
self.addEventListener('push', (event) => {
  let data = {
    title: '💬 ClikChat: Respuesta del Asesor',
    body: 'El dueño de la tienda ha respondido tu consulta.',
    url: '/'
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: 'https://api.iconify.design/lucide:bot.svg?color=%236366f1',
    badge: 'https://api.iconify.design/lucide:sparkles.svg?color=%236366f1',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    },
    actions: [
      { action: 'open', title: 'Ver Respuesta' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification Click Event (Opens the chat and focuses window)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
