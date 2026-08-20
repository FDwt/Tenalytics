// Tenalytics – einfacher Service Worker
// Sorgt dafür, dass die App installierbar ist und beim nächsten Öffnen
// auch ohne Internet zumindest die Grundseite lädt (Kamera/KI brauchen
// trotzdem eine Online-Verbindung bzw. lokale Modell-Dateien).

const CACHE_NAME = "tenalytics-v1";
const CORE_FILES = [
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_FILES))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
