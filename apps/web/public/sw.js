/*
 * Service worker de Smarter Academy — UNIQUEMENT les notifications « طلب جديد » de la
 * librairie (BOOKS_STORE.md §6quater). Il n'est enregistré que sur l'appareil d'un compte de
 * la librairie qui active les notifications (page « طلبات الكتب »), jamais chez un élève.
 *
 * Volontairement SANS gestionnaire `fetch` : il ne met rien en cache et ne touche à aucune
 * page (le site reste servi exactement comme sans lui).
 */

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch { data = { title: 'طلب جديد', body: event.data && event.data.text() }; }
  const title = data.title || 'طلب جديد';
  event.waitUntil(self.registration.showNotification(title, {
    body: data.body || '',
    tag: data.tag || 'book-order',
    renotify: true,
    dir: 'rtl',
    lang: 'ar',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: { url: data.url || '/admin/livres/commandes' },
  }));
});

// Toucher la notification ouvre la commande (dans un onglet déjà ouvert du site si possible).
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = new URL((event.notification.data && event.notification.data.url) || '/admin/livres/commandes', self.location.origin).href;
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of windows) {
      if (new URL(client.url).origin === self.location.origin && 'navigate' in client) {
        await client.focus();
        return client.navigate(url);
      }
    }
    return self.clients.openWindow(url);
  })());
});
