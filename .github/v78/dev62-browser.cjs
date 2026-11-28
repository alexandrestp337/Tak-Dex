const assert=require('node:assert/strict');
const {chromium}=require('playwright-core');
const url=process.argv[2]||'http://localhost:8919/';

async function openDex(page,game,name){
 await page.locator('#dexTab').click();
 await page.locator('#dexGame').selectOption(game);
 await page.locator('#dexInput').fill(name);
 await page.locator('#dexResults').getByRole('button',{name:new RegExp(name,'i')}).first().click();
}

(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  for(const [width,light,game,name] of [[360,false,'X','Tyrunt'],[360,true,'Y','Amaura'],[412,false,'Y','Tyrunt'],[412,true,'X','Amaura']]){
   const page=await browser.newPage({viewport:{width,height:800},isMobile:true,hasTouch:true});
   try{
    if(light)await page.addInitScript(()=>document.addEventListener('DOMContentLoaded',()=>document.body.classList.add('light'),{once:true}));
    await page.goto(url);
    await openDex(page,game,name);
    const panel=page.locator('#td56DexEncounters');
    const fossil=panel.locator('.td77-acquisition-entry').filter({hasText:/Ambrette Town · Fossil · Lv 20/});
    await fossil.waitFor({state:'attached'});
    assert.equal(await fossil.count(),1);
    assert.match(await fossil.textContent(),/Glittering Cave.*Ambrette Fossil Lab/s);
    assert.equal(await fossil.locator('button').count(),0);
    assert.doesNotMatch(await panel.textContent(),/Glittering Cave · Gift/);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
    const oras=width===360?'Omega Ruby':'Alpha Sapphire';
    const machine=light?'hm06':'tm97';
    await page.locator('#moreTab').click();
    await page.locator('#td68OpenMove').click();
    await page.getByRole('tab',{name:'TM / HM'}).click();
    await page.locator('#tmGame').selectOption(oras);
    await page.locator('#tmMove option').first().waitFor({state:'attached'});
    await page.locator('#tmMoveSearch').fill(machine);
    await page.locator('#tmMoveResults button').first().click();
    const guide=page.locator('#td65MachineGuide');
    await guide.locator('summary').click();
    const expected=light?/Mauville City.*Wally.*Dynamo Badge/:width===360?/Team Magma Hideout/:/Team Aqua Hideout/;
    assert.match(await guide.locator('p b').innerText(),expected);
    assert.equal(await guide.locator('[data-td74-tm-map]').count(),0);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
    const locations=await page.evaluate(async game=>{
     const list=await takDexDB74.machines('omega-ruby-alpha-sapphire');
     return list.filter(row=>takDexAcquisitionV77.machineLocation(game,row.item)).length;
    },oras);
    assert.equal(locations,107);
    console.log(width,light?'light':'dark',game,name,oras,machine,'passed');
   }finally{await page.close();}
  }
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
