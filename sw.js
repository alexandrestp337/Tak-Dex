// Install the exact static shell before replacing the current worker. Regional assets load on demand.
importScripts('./offline-data.js?v=78.0.0-stable');
const NAME='takdex-v78.0.0-dev6.1.5';
const ART='takdex-artwork-runtime-v74-dev71';
const OPTIONAL='takdex-bundled-runtime-v78';
const SHELL=["./","./index.html","./styles.css?v=78.0.0-stable","./manifest.webmanifest","./bw-core-dev5.js?v=74.0.0","./sprite-ids-v77.js?v=74.5.2.20261124","./unova-b2w2-v74.js?v=74.0.0","./offline-data.js?v=78.0.0-stable","./db74.js?v=78.0.0-stable","./gen5-save.js?v=77.0.0","./acquisition-v77.js?v=78.0.0-dev6.1.5","./dev1-storage.js?v=78.0.0-stable","./dev1-import.js?v=78.0.0-stable","./app.js?v=78.0.0-dev6.1.5","./save-sync.js?v=78.0.0-stable","./unova-v74.js?v=74.5.2.20261124","./bw-trainer-moves-v76.js?v=74.5.2.20261124","./unova-trainer-reference.js?v=76.0.0","./trainer-abilities-v76.js?v=76.0.3","./platinum-league-v77.js?v=74.5.2.20261124","./tutor-locations.js?v=78.0.0-dev6.1.5","./v73-ui.js?v=78.0.0-stable","./hoenn-map.js?v=76.0.0","./maps.js?v=78.0.0-stable","./feedback-config.js?v=74.0.0","./battle-outcomes.js?v=78.0.0-stable","./v74-ux.js?v=78.0.0-stable","./db74/gen5-save-names.json","./icon-192.png","./takdex-header-logo.png","./takdex-radar-logo.png","./takdex-team-nav.png","./takdex-battle-nav.png","./takdex-pokedex-nav.png"];
const scoped=file=>new URL(file,self.registration.scope);
const shellUrls=new Set(SHELL.map(file=>scoped(file).href));
const optional=path=>/^db74\/.*\.json$/.test(path)||/^[a-z0-9.-]+\.(jpg|png|webp)$/i.test(path);
const shellCache=name=>name.startsWith('takdex-v');
const helpers=self.takDexOfflineData;
const scopePath=scoped('./').pathname;
function relative(url){return url.pathname.startsWith(scopePath)?url.pathname.slice(scopePath.length):null;}
async function validAsset(response,path){
 if(!response?.ok)return false;
 if(path.startsWith('db74/'))return !!await helpers.read(response.clone(),data=>helpers.bundleShape(path.split('/').at(-1),data));
 const mime=response.headers.get('content-type')||'';
 if(path.endsWith('.js'))return /javascript|ecmascript/i.test(mime);
 if(path.endsWith('.css'))return /text\/css/i.test(mime);
 if(/\.(png|jpg|webp)$/.test(path))return /^image\//i.test(mime);
 if(!path||path.endsWith('.html'))return /text\/html/i.test(mime);
 return true;
}
self.addEventListener('install',event=>event.waitUntil((async()=>{
 // Stage every response before writing so a missing essential asset leaves the prior shell active.
 const staged=await Promise.all(SHELL.map(async file=>{
  const request=new Request(scoped(file),{cache:'reload'});
  const response=await helpers.request(request,{},async response=>{
   if(!await validAsset(response,relative(new URL(request.url))))throw Error('Invalid shell asset: '+file);
   const body=await response.arrayBuffer();
   if(!body.byteLength)throw Error('Empty shell asset: '+file);
   if((file==='./'||file==='./index.html')&&!new TextDecoder().decode(body).includes('name="takdex-version" content="V78 DEV6.1"')){
    throw Error('Mismatched shell version: '+file);
   }
   const headers=new Headers(response.headers);
   for(const field of ['Content-Encoding','Content-Length','Transfer-Encoding'])headers.delete(field);
   return new Response(body,{headers});
  });
  return [request,response];
 }));
 const existing=await caches.has(NAME),cache=await caches.open(NAME);
 const results=await Promise.allSettled(staged.map(([request,response])=>cache.put(request,response)));
 const failure=results.find(result=>result.status==='rejected');
 if(failure){
  if(!existing)await caches.delete(NAME);
  throw failure.reason;
 }
 await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 const old=(await caches.keys()).filter(name=>shellCache(name)&&name!==NAME);
 // Keep the most recent rollback shell and one pre-split cache if it supplies earlier optional data.
 let legacy;
 for(const name of [...old].reverse()){
  const cache=await caches.open(name);
  const keys=await cache.keys();
  if(keys.some(request=>/^db74\/e-/.test(relative(new URL(request.url))||''))){legacy=name;break;}
 }
 await Promise.all(old.filter(name=>name!==old.at(-1)&&name!==legacy).map(name=>caches.delete(name)));
 await self.clients.claim();
})()));
async function runtimeAsset(request,path){
 const cache=await caches.open(OPTIONAL);
 if(request.cache!=='reload'&&request.cache!=='no-store'){
  const own=await cache.match(request);
  if(await validAsset(own,path))return own;
  if(own)await cache.delete(request);
  for(const name of (await caches.keys()).filter(shellCache).reverse()){
   const saved=await(await caches.open(name)).match(request);
   if(await validAsset(saved,path))return saved;
  }
 }
 const response=await fetch(request);
 if(await validAsset(response,path))try{await cache.put(request,response.clone());}catch{}
 return response;
}
self.addEventListener('fetch',e=>{
 const u=new URL(e.request.url);
 if(e.request.method!=='GET')return;
 const path=relative(u);
 if(u.origin===self.location.origin&&path!==null){
  if(path==='feedback-config.js'){
   e.respondWith((async()=>{
    const cache=await caches.open(NAME);
    try{
     const r=await helpers.request(e.request,{cache:'no-cache'});
     if(await validAsset(r,path)){try{await cache.put(e.request,r.clone());}catch{}return r;}
    }catch{}
    return await cache.match(e.request)||new Response('window.TAKDEX_FEEDBACK_FORM_ID = "";',{headers:{'Content-Type':'application/javascript'}});
   })());
  }else if(shellUrls.has(u.href)||e.request.mode==='navigate'&&['','index.html'].includes(path)){
   e.respondWith((async()=>{
    const cache=await caches.open(NAME);
    const local=await cache.match(e.request)||(e.request.mode==='navigate'?await cache.match(scoped('./index.html')):null);
    return local||fetch(e.request);
   })());
  }else if(optional(path))e.respondWith(runtimeAsset(e.request,path));
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
