const CACHE_NAME = "voidfm-github-pages-v16";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./browser-api.js",
  "./app.js",
  "./shuffle-engine.js",
  "./recommendation-engine.js",
  "./chord-engine.js",
  "./shared-normalizers.js",
  "./lyrics-popout.html",
  "./chords-popout.html",
  "./site.webmanifest",
  "./favicon.ico",
  "./assets/loading_bg.png",
  "./assets/voidfm-icon.png",
  "./assets/voidfm-icon-192.png",
  "./assets/voidfm-icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== location.origin || url.pathname.includes("/api/")) return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      if (event.request.method === "GET" && response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
      }
      return response;
    }))
  );
});
