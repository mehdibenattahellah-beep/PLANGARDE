// AMIU6 Guard — Service Worker
const CACHE = "amiu6-guard-v1";
const CORE = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE).catch(() => {})));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  // Les appels Supabase (API) passent toujours par le réseau.
  if (req.url.includes("supabase")) return;
  // Navigation : réseau d'abord, cache en secours (offline).
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).then(r => {
        const cp = r.clone();
        caches.open(CACHE).then(c => c.put(req, cp));
        return r;
      }).catch(() => caches.match(req).then(r => r || caches.match("./")))
    );
    return;
  }
  // Autres ressources : cache d'abord.
  e.respondWith(caches.match(req).then(r => r || fetch(req)));
});
