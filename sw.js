const CACHE='forme-96bc8b99';
const ASSETS=["./", "index.html", "manifest.webmanifest", "icons/icon-180.png", "icons/icon-192.png", "icons/icon-512.png", "fonts/barlow-400.woff2", "fonts/barlow-500.woff2", "fonts/barlow-600.woff2", "fonts/barlow-condensed-600.woff2", "fonts/barlow-condensed-700.woff2"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
  if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put('index.html',c));return r}).catch(()=>caches.match('index.html')));return}
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
