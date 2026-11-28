const assert=require('node:assert/strict');
const {chromium}=require('playwright-core');
const url=process.argv[2]||'http://localhost:8919/';

(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  for(const [width,light,game,item,label] of [
   [360,false,'X','hm03',/Shalour City.*Rumble Badge/],
   [360,true,'Y','tm34',/Battle Maison.*32 BP.*postgame/],
   [412,false,'Y','hm05',/Route 19.*Iceberg Badge/],
   [412,true,'X','tm19',/Route 8.*Surf/]
  ]){
   const page=await browser.newPage({viewport:{width,height:800},isMobile:true,hasTouch:true});
   if(light)await page.addInitScript(()=>document.addEventListener('DOMContentLoaded',()=>document.body.classList.add('light'),{once:true}));
   await page.goto(url);
   if(width===360&&!light){
    const mapping=await page.evaluate(async()=>{
     const assignments=await window.takDexDB74.machines('x-y');
     return assignments.map(({item})=>[item,...['X','Y'].map(g=>window.takDexAcquisitionV77.machineLocation(g,item))]);
    });
    assert.equal(mapping.length,105);
    assert.equal(new Set(mapping.map(([item])=>item)).size,105);
    assert.ok(mapping.every(([,x,y])=>x&&x===y));
   }
   if(width===360&&!light){
    const records=await page.evaluate(async()=>{
     const provider=window.takDexAcquisitionV77;
     const x=await window.takDexDB74.encounter('X'),y=await window.takDexDB74.encounter('Y');
     const place='kalos-route-2';
     const check=(pack,id)=>pack.entries[id].filter(row=>row[0]===place).map(row=>provider.encounterRoute(pack.game,row)?.rank);
     const opening=new Set([place,'santalune-forest','kalos-route-3']);
     const counts=[x,y].map(pack=>Object.values(pack.entries).flat().filter(row=>opening.has(row[0])&&provider.encounterRoute(pack.game,row)).length);
     return {counts,xWeedle:check(x,13),yWeedle:check(y,13),xCaterpie:check(x,10),yCaterpie:check(y,10),
      surf:provider.encounterRoute('X',x.entries[284].find(row=>row[0]==='kalos-route-3')),
      reminder:provider.moveReminder('Y'),oras:provider.moveReminder('Omega Ruby')};
    });
    assert.deepEqual(records.counts,[31,31]);
    assert.deepEqual([records.xWeedle,records.yWeedle,records.xCaterpie,records.yCaterpie],[[0],[],[],[0]]);
    assert.equal(records.surf.rank,3);
    assert.match(records.surf.note,/Rumble Badge/);
    assert.equal(records.reminder.place,'Dendemille Town');
    assert.equal(records.oras,null);
    await page.locator('#dexTab').click();
    await page.locator('#dexGame').selectOption('X');
    await page.locator('#dexInput').fill('Masquerain');
    await page.locator('#dexResults').getByRole('button',{name:/Masquerain/i}).first().click();
    const encounter=page.locator('#dexResult .td77-acquisition-entry').filter({hasText:/Route 3 · Surf/}).first();
    await encounter.waitFor({state:'attached'});
    assert.match(await encounter.textContent(),/After badge 3.*Rumble Badge/s);
    assert.equal(await encounter.locator('button').count(),0);
   }
   await page.locator('#moreTab').click();
   await page.locator('#td68OpenMove').click();
   await page.getByRole('tab',{name:'TM / HM'}).click();
   await page.locator('#tmGame').selectOption(game);
   await page.locator('#tmMove option').first().waitFor({state:'attached'});
   await page.locator('#tmMoveSearch').fill(item);
   await page.locator('#tmMoveResults button').first().click();
   const guide=page.locator('#td65MachineGuide');
   await guide.locator('summary').click();
   const location=guide.locator('p b');
   assert.match(await location.innerText(),label);
   assert.equal(await guide.locator('[data-td74-tm-map]').count(),0);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
   assert.equal(await page.evaluate(()=>window.takDexAcquisitionV77.machineLocation('Omega Ruby','hm03')),null);
   if(width===412&&light){
    await page.waitForFunction(async()=>navigator.serviceWorker.controller&&await caches.has('takdex-v78.0.0-dev6.1.3'));
    await page.context().setOffline(true);
    await page.reload();
    assert.equal(await page.locator('meta[name="takdex-version"]').getAttribute('content'),'V78 DEV6.1');
    assert.match(await page.evaluate(()=>window.takDexAcquisitionV77.machineLocation('Y','tm99')),/Valerie/);
   }
   await page.close();
   console.log(width,light?'light':'dark',game,item,'pass');
  }
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
