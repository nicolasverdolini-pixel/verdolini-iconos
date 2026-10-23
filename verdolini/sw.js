// Verdolini · muestra los avisos del panel. No guarda nada del panel ni de clientes.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { cuerpo: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.titulo || 'Verdolini', {
    body: d.cuerpo || '', icon: '../verdolini-192.png', badge: '../verdolini-192.png', tag: 'verdolini-' + Date.now(), data: { url: d.url || './' },
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || './';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(ws => {
    for (const w of ws) if (w.url.indexOf('/verdolini/') > -1 && 'focus' in w) return w.focus();
    return self.clients.openWindow(url);
  }));
});
