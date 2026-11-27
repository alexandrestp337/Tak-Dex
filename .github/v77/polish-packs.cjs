const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const {chromium}=require('playwright-core');

(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:412,height:850},isMobile:true,hasTouch:true,reducedMotion:'reduce',ignoreHTTPSErrors:true});
  const url=process.argv[2]||'http://127.0.0.1:8813/';
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.evaluate(async()=>{await navigator.serviceWorker.ready;});
  await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
  const version=await page.locator('meta[name="takdex-version"]').getAttribute('content');
  const cache='takdex-'+version.toLowerCase().replace(/ rc(\d+)$/,'-rc.$1');
  assert.ok(await page.evaluate(async name=>(await caches.keys()).includes(name),cache));
  const open=async(game)=>{
   await page.locator('#moreTab').click();
   await page.locator('#td59OpenOffline').click();
   await page.locator('#td59Game').selectOption(game);
  };
  const expect=async(game,status,saved)=>{
   await page.waitForFunction(({game,status})=>{
    const select=document.querySelector('#td59Game');
    return select.value===game&&select.selectedOptions[0].textContent.endsWith(status)&&
     document.querySelector('#td59State').textContent.includes(status);
   },{game,status});
   assert.equal((await page.locator('#td59Saved b').allTextContents()).includes(game),saved);
  };
  const capture=async name=>{
   const evidence=process.env.TAKDEX_EVIDENCE;
   if(evidence){await fs.mkdir(evidence,{recursive:true});await page.screenshot({path:evidence+'/'+name+'.png'});}
  };
  await open('Black 2');
  await expect('Black 2','No pack',false);
  await page.evaluate(()=>takDexEncounterV55.get('Black 2'));
  await page.locator('#td59Game').selectOption('White 2');
  await page.locator('#td59Game').selectOption('Black 2');
  await expect('Black 2','No pack',false);
  await page.evaluate(async()=>{
   const g='Black 2',slug='black-2';
   const put=async(cache,key,data)=>(await caches.open(cache)).put(key,new Response(JSON.stringify(data)));
   await put('takdex-reference-v58-'+slug,'takdex-reference-v58/'+slug+'.json',{game:g,schema:58,complete:true});
   window.dispatchEvent(new Event('td58-pack-update'));
  });
  await expect('Black 2','Partial download',true);
  await capture('black2-partial');
  await page.locator('#td59Game').selectOption('White 2');
  await expect('White 2','Shared reference',false);
  await capture('white2-shared');
  await page.evaluate(async()=>{
   const g='Black 2',slug='black-2';
   const put=async(cache,key,data)=>(await caches.open(cache)).put(key,new Response(JSON.stringify(data)));
   await put('takdex-artwork-v60-'+slug,'takdex-artwork-v60/'+slug+'.json',{game:g,schema:60,complete:true});
   await takDexEncounterV55.refresh(g);
  });
  await page.locator('#td59Game').selectOption('Black 2');
  await expect('Black 2','Downloaded',true);
  const dimensions=await page.evaluate(()=>{
   const [a,b]=['td59Download','td59Delete'].map(id=>document.getElementById(id).getBoundingClientRect());
   return [a.width,b.width,a.height,b.height];
  });
  assert.equal(dimensions[0],dimensions[1]);assert.equal(dimensions[2],dimensions[3]);
  await capture('black2-downloaded');
  await page.reload({waitUntil:'domcontentloaded'});
  await open('Black 2');
  await expect('Black 2','Downloaded',true);
  await page.context().setOffline(true);
  await page.reload({waitUntil:'domcontentloaded'});
  await open('Black 2');
  await expect('Black 2','Downloaded',true);
  assert.match(await page.locator('footer').textContent(),/Developed by WHOASP/);
  await page.context().setOffline(false);
  const remove=async accept=>{
   const dialog=page.waitForEvent('dialog');
   const remove=page.locator('#td59Delete').click();
   const prompt=await dialog;
   assert.match(prompt.message(),/Saved teams and settings/);
   if(accept)await prompt.accept();else await prompt.dismiss();
   await remove;
  };
  await remove(false);
  await expect('Black 2','Downloaded',true);
  await remove(true);
  await expect('Black 2','No pack',false);
  await page.locator('#td59Game').selectOption('White 2');
  await expect('White 2','No pack',false);
  assert.deepEqual(errors,[]);
  console.log('Black 2 absent, partial and downloaded; White 2 shared; both controls equal; refresh, restart, offline reload and removal passed.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
