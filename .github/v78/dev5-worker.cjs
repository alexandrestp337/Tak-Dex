const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require('playwright-core');
const candidate=path.resolve(__dirname,'../..');
const baseline=process.argv[2];
assert.ok(baseline,'Pass a checkout of DEV4 RC2');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json',
 '.webmanifest':'application/manifest+json','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp'};
const name='takdex-v78.0.0-dev5-rc1';
let state='baseline',rejected=0,optionalRequests=0;
const appServer=http.createServer(async(req,res)=>{
 let file=new URL(req.url,'http://localhost').pathname.slice(1)||'index.html';
 if(file.includes('..')){res.writeHead(400).end();return;}
 if(state==='essential-failure'&&file==='app.js'){rejected++;res.writeHead(503).end();return;}
 if(state!=='baseline'&&file==='unova-black-2-v74.jpg'){optionalRequests++;res.writeHead(404).end();return;}
 try{
  const data=await fs.readFile(path.join(state==='baseline'?baseline:candidate,file));
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'}).end(data);
 }catch{res.writeHead(404).end();}
});
(async()=>{
 await new Promise(resolve=>appServer.listen(0,'127.0.0.1',resolve));
 const url='http://127.0.0.1:'+appServer.address().port;
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  const ctx=await browser.newContext(),p=await ctx.newPage();
  await p.goto(url);
  await p.waitForFunction(()=>navigator.serviceWorker.controller,{},{timeout:35000});
  assert.equal(await p.locator('meta[name=takdex-version]').getAttribute('content'),'V78 DEV4 RC2');
  await p.evaluate(()=>localStorage.setItem('dev5-worker-team-fixture','preserved'));
  state='essential-failure';
  const failed=await p.evaluate(async()=>{
   const registration=await navigator.serviceWorker.ready;
   const observed=new Promise(resolve=>registration.addEventListener('updatefound',()=>{
    const worker=registration.installing;
    const check=()=>{if(worker?.state==='redundant')resolve(true);};
    worker?.addEventListener('statechange',check);check();
   },{once:true}));
   await registration.update().catch(()=>{});
   return Promise.race([observed,new Promise(resolve=>setTimeout(()=>resolve(false),18000))]);
  });
  assert.ok(failed&&rejected);
  assert.equal(await p.evaluate(name=>caches.has(name),name),false);
  await ctx.setOffline(true);await p.reload();
  assert.equal(await p.locator('meta[name=takdex-version]').getAttribute('content'),'V78 DEV4 RC2');
  await ctx.setOffline(false);
  state='candidate';
  await p.evaluate(async()=>{
   const registration=await navigator.serviceWorker.ready;
   const activated=new Promise(resolve=>navigator.serviceWorker.addEventListener('controllerchange',resolve,{once:true}));
   await registration.update();
   await Promise.race([activated,new Promise(resolve=>setTimeout(resolve,18000))]);
  });
  await p.reload();
  assert.equal(await p.locator('meta[name=takdex-version]').getAttribute('content'),'V78 DEV5 RC1');
  assert.equal(optionalRequests,0);
  const patched=await p.evaluate(async()=>{
   const cache=await caches.open('takdex-bundled-runtime-v78');
   const asset='db74/index.json?repair-test=1';
   await cache.put(asset,new Response('broken'));
   const received=await (await fetch(asset)).json();
   const cached=await(await cache.match(asset)).json();
   return [received.coverage['black-2'].rows,cached.coverage['black-2'].rows];
  });
  assert.deepEqual(patched,[3850,3850]);
  assert.equal(await p.evaluate(async()=> (await fetch('unova-black-2-v74.jpg?missing-optional=1')).status),404);
  assert.equal(optionalRequests,1);
  await ctx.setOffline(true);await p.reload();
  assert.equal(await p.locator('meta[name=takdex-version]').getAttribute('content'),'V78 DEV5 RC1');
  assert.equal(await p.evaluate(()=>localStorage.getItem('dev5-worker-team-fixture')),'preserved');
  assert.ok(await p.evaluate(()=>caches.has('takdex-v78.0.0-dev4-rc2')));
  assert.match(await p.locator('footer').innerText(),/Developed by WHOASP/);
  console.log('DEV4 offline rollback after essential failure, DEV5 upgrade with missing map, corrupt optional JSON repair and offline reload passed.');
 }finally{await browser.close();await new Promise(resolve=>appServer.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1;appServer.close();});
