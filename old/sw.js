const PREFIX = "ododo-old-";
const CACHE = PREFIX + "v4";
const FILES = [
  ".",
  "index.html",
  "index.js",
  "index.wasm",
  "index.data",
  "odin.js",
  "../icon-192.png",
  "assets/Sounds/positive-blip-effect.wav",
  "assets/Sounds/failureLoud.wav",
  "assets/Sounds/click.wav",
  "assets/Sounds/confirmed.wav",
];

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(FILES.map(f => c.add(f)))));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k.startsWith(PREFIX) && k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request, { cache: "no-cache" })
      .then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});