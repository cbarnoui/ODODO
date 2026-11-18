const CACHE = "ododo-v2";
const FILES = [
  ".",
  "index.html",
  "app.wasm",
  "odin.js",
  "icon-192.png",
  "assets/Sounds/positive-blip-effect.wav",
  "assets/Sounds/failureLoud.wav",
  "assets/Sounds/click.wav",
  "assets/Sounds/confirmed.wav",
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
