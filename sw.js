// 나 키우기 오프라인 지원. 앱을 고치면 VERSION만 바꾸면 됨
const VERSION='0.13.0';
const CACHE='raise-me-'+VERSION;
const CORE=['./','index.html','manifest.webmanifest','apple-touch-icon.png','icon-192.png','icon-512.png','icon-maskable-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  // 화면은 인터넷이 되면 최신 버전, 안 되면 저장해 둔 버전
  if(r.mode==='navigate'){e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put('index.html',c));return res}).catch(()=>caches.match('index.html')));return}
  // 아이콘·글꼴 등은 저장해 둔 것을 먼저 씀
  e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c))}return res})));
});
