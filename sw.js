// V70: match the actual versioned URLs requested by index.html for offline cold starts.
const NAME='takdex-v76-release-candidate-5';
const ART='takdex-artwork-runtime-v74-dev71';
const FILES=['./','./index.html','./styles.css?v=76.0.4','./bw-core-dev5.js?v=74.0.0','./app.js?v=76.0.4','./gen5-save.js?v=76.0.0','./save-sync.js?v=76.0.4','./db74/gen5-save-names.json','./db74.js?v=74.0.0','./tutor-locations.js?v=74.0.0','./v73-ui.js?v=74.0.0','./hoenn-map.js?v=76.0.0','./maps.js?v=76.0.0','./battle-outcomes.js?v=76.0.3','./v74-ux.js?v=76.0.4','./unova-v74.js?v=74.5.2.20261124','./bw-trainer-moves-v76.js?v=74.5.2.20261124','./unova-trainer-reference.js?v=76.0.0','./trainer-abilities-v76.js?v=76.0.3','./sprite-ids-v77.js?v=74.5.2.20261124','./platinum-league-v77.js?v=74.5.2.20261124','./unova-b2w2-v74.js?v=74.0.0','./unova-black-2-v74.jpg?v=74.6.1','./unova-white-2-v74.jpg?v=74.6.1','./unova-black-v78.jpg?v=74.8.3','./unova-white-v78.jpg?v=74.8.3','./feedback-config.js?v=74.0.0','./manifest.webmanifest','./icon-192.png','./icon-512.png','./takdex-background.webp','./takdex-background-light.webp','./takdex-radar-logo.png','./takdex-header-logo.png','./takdex-team-nav.png','./takdex-battle-nav.png','./takdex-pokedex-nav.png','./takdex-splash.png','./sinnoh-platinum-game-map.png'];
FILES.push(...["./db74/e-alpha-sapphire.json","./db74/e-black-2.json","./db74/e-black.json","./db74/e-blue.json","./db74/e-brilliant-diamond.json","./db74/e-crystal.json","./db74/e-diamond.json","./db74/e-emerald.json","./db74/e-firered.json","./db74/e-gold.json","./db74/e-heartgold.json","./db74/e-leafgreen.json","./db74/e-moon.json","./db74/e-omega-ruby.json","./db74/e-pearl.json","./db74/e-platinum.json","./db74/e-red.json","./db74/e-ruby.json","./db74/e-sapphire.json","./db74/e-scarlet.json","./db74/e-shield.json","./db74/e-shining-pearl.json","./db74/e-silver.json","./db74/e-soulsilver.json","./db74/e-sun.json","./db74/e-sword.json","./db74/e-ultra-moon.json","./db74/e-ultra-sun.json","./db74/e-violet.json","./db74/e-white-2.json","./db74/e-white.json","./db74/e-x.json","./db74/e-y.json","./db74/e-yellow.json","./db74/index.json","./db74/machines.json","./db74/moves.json","./db74/p0.json","./db74/p1.json","./db74/p10.json","./db74/p11.json","./db74/p12.json","./db74/p13.json","./db74/p14.json","./db74/p15.json","./db74/p156.json","./db74/p157.json","./db74/p158.json","./db74/p159.json","./db74/p16.json","./db74/p160.json","./db74/p161.json","./db74/p2.json","./db74/p3.json","./db74/p4.json","./db74/p5.json","./db74/p6.json","./db74/p7.json","./db74/p8.json","./db74/p9.json"]);
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(NAME).then(c=>c.addAll(FILES)))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>(k.startsWith('takdex-v')&&k!==NAME)||k==='takdex-artwork-v26').map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 const u=new URL(e.request.url);
 if(e.request.method!=='GET')return;
 if(u.origin===self.location.origin){
  if(u.pathname.endsWith('/feedback-config.js')){
   e.respondWith((async()=>{try{const r=await fetch(e.request,{cache:'no-cache'});if(r.ok){try{await(await caches.open(NAME)).put(e.request,r.clone())}catch{}return r;}}catch{}const cached=await caches.match(e.request);return cached||new Response('window.TAKDEX_FEEDBACK_FORM_ID = "";', {headers:{'Content-Type':'application/javascript'}});})());return;
  }
  // Cache first: offline cold starts must not wait for a stalled network handshake.
  e.respondWith((async()=>{const cached=await caches.match(e.request);if(cached)return cached;try{return await fetch(e.request)}catch(err){const fallback=await caches.match(e.request,{ignoreSearch:true});if(fallback)return fallback;throw err}})());
  return;
 }
 if(u.hostname==='raw.githubusercontent.com'&&u.pathname.startsWith('/PokeAPI/sprites/master/sprites/pokemon/')&&u.pathname.endsWith('.png')){
  e.respondWith((async()=>{
   const c=await caches.open(ART),url=e.request.url;
   const valid=r=>r&&r.type!=='opaque'&&r.ok&&((r.headers.get('content-type')||'').toLowerCase().startsWith('image/'));
   const cached=await c.match(url);if(valid(cached))return cached;
   // Preserve downloaded game packs and prefer a readable cached image over an opaque response.
   const packed=await caches.match(url);if(valid(packed))return packed;
   try{
    // Fetch CORS-readable image data; unlike opaque responses, we can validate its body.
    const r=await fetch(url,{mode:'cors',credentials:'omit'});
    if(valid(r)){const body=await r.clone().blob();if(body.size){try{await c.put(url,r.clone());const keys=await c.keys();if(keys.length>400)await Promise.all(keys.slice(0,keys.length-400).map(k=>c.delete(k)));}catch{}return r;}}
   }catch{}
   // Uncached direct request remains available if CORS is unavailable. Never cache opaque failures.
   try{return await fetch(e.request)}catch(err){if(cached&&cached.type==='opaque'&&e.request.mode==='no-cors')return cached;throw err;}
  })());
 }
});
