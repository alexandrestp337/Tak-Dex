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
    console.log(width,light?'light':'dark',game,name,'fossil passed');
   }finally{await page.close();}
  }
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
