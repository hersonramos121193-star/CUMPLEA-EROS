/* =========================================================
   SERVICE WORKER — Metelmex PWA
   Estrategia: cache-busting automático por versión + 
   "network-first" para el HTML (para que nunca se quede pegado)
   y "cache-first" para assets estáticos (rápido offline).
   ========================================================= */

/* 1) CAMBIA ESTA LÍNEA EN CADA DEPLOY (o usa el script de abajo
      para que se genere sola con la fecha/hora del commit).     */
const CACHE_VERSION = 'v1.0.0';  // <-- súbela en cada release: v1.0.1, v1.0.2...
const CACHE_NAME = `metelmex-cache-${CACHE_VERSION}`;

/* 2) Lista de archivos "core" que quieres precachear.
      Ajusta las rutas a las de tu proyecto real.            */
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

/* ---------- INSTALL: precachea el core y activa de inmediato ---------- */
self.addEventListener('install', (event) => {
  self.skipWaiting(); // no espera a que se cierren las pestañas viejas
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
});

/* ---------- ACTIVATE: borra TODAS las cachés de versiones anteriores ---------- */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith('metelmex-cache-') && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim()) // toma control de las pestañas abiertas ya mismo
  );
});

/* ---------- FETCH ----------
   - HTML (navegación): NETWORK-FIRST → siempre intenta traer la versión
     más nueva del servidor; si no hay internet, usa la copia en caché.
   - Otros assets (css/js/img): CACHE-FIRST → rápido, y se van
     refrescando solos cada vez que subes CACHE_VERSION.
--------------------------------------------------------------- */
self.addEventListener('fetch', (event) => {
  const { request } = event;

  const isHTML = request.mode === 'navigate' ||
    (request.headers.get('accept') || '').includes('text/html');

  if (isHTML) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match('./index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});

/* ---------- MENSAJE OPCIONAL PARA FORZAR ACTUALIZACIÓN DESDE LA PÁGINA ----------
   En tu index.html puedes escuchar cuando hay una versión nueva instalada
   y mostrar un botón "Hay una actualización disponible, recarga" en vez
   de esperar a que el usuario cierre y abra la app. Ejemplo de uso:

   navigator.serviceWorker.register('./service-worker.js').then(reg => {
     reg.addEventListener('updatefound', () => {
       const newWorker = reg.installing;
       newWorker.addEventListener('statechange', () => {
         if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
           // Hay una versión nueva lista. Muestra tu propio banner/botón aquí.
           if (confirm('Hay una nueva versión del dashboard. ¿Actualizar ahora?')) {
             newWorker.postMessage({ type: 'SKIP_WAITING' });
             window.location.reload();
           }
         }
       });
     });
   });
------------------------------------------------------------------- */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
