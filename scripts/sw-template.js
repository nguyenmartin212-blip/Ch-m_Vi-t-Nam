import {parseRange} from '/range.js';
const CACHE='__VERSION__';
const PRECACHE=__PRECACHE__;
const AUDIO='cham-viet-audio-v1';
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(PRECACHE)));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('cham-viet-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==self.location.origin)return;
 if(req.mode==='navigate'){
  event.respondWith(fetch(req).then(r=>r.ok?r:caches.match('/index.html')).catch(()=>caches.match('/index.html')));return;
 }
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE),audio=await caches.open(AUDIO);
  const cached=await cache.match(url.pathname)||await audio.match(url.pathname);
  if(cached){
   if(req.headers.has('range')){
    const body=await cached.arrayBuffer(),range=parseRange(req.headers.get('range'),body.byteLength);
    if(!range)return new Response(null,{status:416,headers:{'Content-Range':`bytes */${body.byteLength}`}});
    return new Response(body.slice(range.start,range.end+1),{status:206,headers:{'Content-Type':cached.headers.get('content-type')||'audio/mpeg','Content-Range':`bytes ${range.start}-${range.end}/${body.byteLength}`,'Content-Length':String(range.end-range.start+1),'Accept-Ranges':'bytes'}});
   }
   return cached;
  }
  return fetch(req);
 })());
});
