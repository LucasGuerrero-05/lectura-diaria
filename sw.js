const V = "ld-v7", SHELL = ["./", "index.html", "app.js", "styles.css", "manifest.json", "icon.svg", "data/libros.json"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(V).then((c) => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener("activate", (e) => e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((x) => x !== V && x !== "cfg").map((x) => caches.delete(x)))).then(() => self.clients.claim())));
// Archivos de la app: primero la red (para recibir mejoras), si no hay conexión, la copia guardada.
// Datos (Biblia y comentario): primero la copia guardada, para leer sin conexión.
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const u = new URL(e.request.url);
  const datos = u.pathname.includes("/data/") && !u.pathname.endsWith("libros.json");
  e.respondWith(caches.open(V).then(async (c) => {
    if (datos) {
      const hit = await c.match(e.request);
      if (hit) return hit;
    }
    try {
      const r = await fetch(e.request);
      if (r.ok) c.put(e.request, r.clone());
      return r;
    } catch (err) {
      const hit = await c.match(e.request, { ignoreSearch: true });
      if (hit) return hit;
      throw err;
    }
  }));
});
self.addEventListener("periodicsync", (e) => {
  if (e.tag !== "recordatorio") return;
  e.waitUntil((async () => {
    const r = await (await caches.open("cfg")).match("cfg"); if (!r) return;
    const c = await r.json(); if (!c.on || !c.pendiente) return;
    const hoy = new Date().toISOString().slice(0, 10), [h, m] = c.time.split(":"), t = new Date(); t.setHours(+h, +m, 0, 0);
    if (new Date() >= t && c.last !== hoy) self.registration.showNotification("Tu lectura de hoy", { body: "Es hora de leer.", icon: "icon.svg", tag: "diario" });
  })());
});
self.addEventListener("notificationclick", (e) => { e.notification.close(); e.waitUntil(clients.openWindow("./")); });
