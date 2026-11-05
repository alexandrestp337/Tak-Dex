// V70: match the actual versioned URLs requested by index.html for offline cold starts.
const NAME='takdex-v71-20261105-dev3';
const ART='takdex-artwork-v26';
const FILES=['./','./index.html','./styles.css?v=71.3','./app.js?v=71.3','./manifest.webmanifest','./icon-192.png','./icon-512.png','./takdex-background.webp','./takdex-background-light.webp','./takdex-radar-logo.png','./takdex-header-logo.png','./takdex-team-nav.png','./takdex-battle-nav.png','./takdex-pokedex-nav.png','./takdex-splash.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(NAME).then(c=>c.addAll(FILES)))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('takdex-v')&&k!==NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 const u=new URL(e.request.url);
 if(u.origin===self.location.origin){
  // Cache fallback strips the query string if an older shell was cached under an unversioned URL.
  e.respondWith(fetch(e.request).catch(async()=>await caches.match(e.request)||await caches.match(e.request,{ignoreSearch:true})));
  return;
 }
 if(u.hostname==='raw.githubusercontent.com'&&u.pathname.includes('/official-artwork/')){
  e.respondWith((async()=>{const cached=await caches.match(e.request);if(cached)return cached;const c=await caches.open(ART);const r=await fetch(e.request);if(r.ok)await c.put(e.request,r.clone());return r})());
 }
});
