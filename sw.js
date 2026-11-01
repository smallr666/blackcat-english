/* 離線快取：讓網站可以「加到主畫面」像 App 一樣使用，沒網路也能複習。
 * 每次更新網站內容時，把 VERSION 數字加一，使用者就會拿到新版。 */
const VERSION = "bce-v2";
const SHELL = [
  "./", "index.html", "manifest.webmanifest",
  "assets/css/style.css", "assets/js/config.js", "assets/js/store.js", "assets/js/speech.js", "assets/js/mascot.js", "assets/js/app.js",
  "assets/img/icon.svg", "assets/img/icon-192.png", "data/catalog.js"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request).then(hit => {
      const net = fetch(e.request).then(res => {
        if (res.ok) caches.open(VERSION).then(c => c.put(e.request, res.clone()));
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
