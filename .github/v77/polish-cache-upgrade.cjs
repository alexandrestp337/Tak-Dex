const assert=require('node:assert/strict');
const http=require('node:http');
const {chromium}=require('playwright-core');

(async()=>{
 const [stable,candidate]=process.argv.slice(2).map(url=>new URL(url));
 let upstream=stable;
 const server=http.createServer((req,res)=>{
  const source=http.get(new URL(req.url,upstream),response=>{
   res.writeHead(response.statusCode,response.headers);
   response.pipe(res);
  });
  source.on('error',()=>{res.statusCode=502;res.end();});
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const url='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  const page=await browser.newPage();
  await page.goto(url,{waitUntil:'domcontentloaded'});
  const controlled=async (name,retired)=>{
   for(let attempt=0;attempt<200;attempt++){
    if(await page.evaluate(async({name,retired})=>{
     const names=await caches.keys();
     if(!navigator.serviceWorker.controller||!names.includes(name)||retired&&names.includes(retired))return false;
     return !!await (await caches.open(name)).match('/');
    },{name,retired}))return;
    await new Promise(resolve=>setTimeout(resolve,100));
   }
   throw new Error('Service worker did not finish activating '+name);
  };
  await controlled('takdex-v77.1-stable');
  const data=await page.evaluate(async()=>{
   const teams=JSON.stringify([{id:'upgrade',game:'Black 2',name:'Upgrade sample',pokemon:[null,null,null,null,null,null]}]);
   const plans=JSON.stringify({'Black 2:upgrade':{game:'Black 2',slots:[],mode:'during'}});
   localStorage.setItem('poketact-teams',teams);
   localStorage.setItem('takdex-v74-playthrough-plans',plans);
   await (await caches.open('takdex-reference-v58-black-2')).put('/retained-pack-test',new Response('saved'));
   return {teams,plans};
  });
  upstream=candidate;
  await page.evaluate(async()=>{
   const registration=await navigator.serviceWorker.getRegistration();
   await registration.update();
  });
  await controlled('takdex-v77.2-rc.1','takdex-v77.1-stable');
  await page.context().setOffline(true);
  await page.reload({waitUntil:'domcontentloaded'});
  assert.equal(await page.locator('meta[name="takdex-version"]').getAttribute('content'),'V77.2 RC1');
  assert.deepEqual(await page.evaluate(async()=>({
   teams:localStorage.getItem('poketact-teams'),
   plans:localStorage.getItem('takdex-v74-playthrough-plans'),
   pack:await (await (await caches.open('takdex-reference-v58-black-2')).match('/retained-pack-test')).text()
  })),{...data,pack:'saved'});
  console.log('V77.1 → V77.2 service worker update, retired shell cache, offline boot, saved team, plan and pack retention passed.');
 }finally{await browser.close();server.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
