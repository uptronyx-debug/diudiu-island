// 套丟島 service worker: lets phones install the game; always asks GitHub for the newest page, falls back to cache offline
const C='diudiu-v2';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./index.html','./icon-192.png','./icon-512.png']).catch(()=>{})));});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin)return; // Firebase etc. go straight to the network
  const page=e.request.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('.html');
  e.respondWith(fetch(e.request,page?{cache:'no-cache'}:{}).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp)).catch(()=>{});return r;}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('./index.html'))));
});
