// V70: match the actual versioned URLs requested by index.html for offline cold starts.
const NAME='takdex-v74-dev8-3';
const ART='takdex-artwork-v26';
const FILES=['./','./index.html','./styles.css?v=74.8.2','./bw-core-dev5.js?v=74.8.2','./app.js?v=74.8.2','./tutor-locations.js?v=74.8.2','./v73-ui.js?v=74.8.2','./maps.js?v=74.8.3','./v74-ux.js?v=74.8.2','./unova-v74.js?v=74.8.2','./bw-trainer-moves-v76.js?v=74.8.2','./sprite-ids-v77.js?v=74.8.2','./platinum-league-v77.js?v=74.8.2','./unova-black-v78.jpg?v=74.8.3','./unova-white-v78.jpg?v=74.8.3','./manifest.webmanifest','./icon-192.png','./icon-512.png','./takdex-background.webp','./takdex-background-light.webp','./takdex-radar-logo.png','./takdex-header-logo.png','./takdex-team-nav.png','./takdex-battle-nav.png','./takdex-pokedex-nav.png','./takdex-splash.png','./sinnoh-platinum-game-map.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(NAME).then(c=>c.addAll(FILES)))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('takdex-v')&&k!==NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 const u=new URL(e.request.url);
 if(u.origin===self.location.origin){
  // Cache first: offline cold starts must not wait for a stalled network handshake.
  e.respondWith((async()=>{const cached=await caches.match(e.request);if(cached)return cached;try{return await fetch(e.request)}catch(err){const fallback=await caches.match(e.request,{ignoreSearch:true});if(fallback)return fallback;throw err}})());
  return;
 }
 if(u.hostname==='raw.githubusercontent.com'&&u.pathname.startsWith('/PokeAPI/sprites/master/sprites/pokemon/')&&u.pathname.endsWith('.png')){
  e.respondWith((async()=>{const cached=await caches.match(e.request);if(cached)return cached;const c=await caches.open(ART);const r=await fetch(e.request);if(r.ok)await c.put(e.request,r.clone());return r})());
 }
});
