const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const path=require('node:path');
const {chromium}=require('playwright-core');

const [candidate,baseline,reference,output]=process.argv.slice(2);

function seed(){
 const game='Black 2';
 const team={id:'rc5-spacing',name:'Acquisition spacing',game,pokemon:[{
  id:503,name:'samurott',types:['water'],level:36,moves:[{name:'Tail Whip',type:'normal',damageClass:'status',accuracy:100}]
 }]};
 // The approved Aqua Jet reminder example is a layout fixture. Samurott's real
 // Black 2 Aqua Jet level is 33. The other methods represent live game records.
 const methods={'aqua-jet':[['level-up',1]],'aerial-ace':[['machine',0]],
  'water-pulse':[['level-up',25]],'icy-wind':[['tutor',0]]};
 const plan={...team.pokemon[0],moves:[],confirmedCandidate:true,originSlot:0,originName:'samurott',
  finalLearnset:{legalMoves:Object.keys(methods),learnMethods:methods},finalManualSlots:[true,true,true,true],
  plannedMoves:Object.keys(methods).map(move=>({move,purpose:'keep'})),duringMoves:[{move:'water-pulse',purpose:'keep'}]};
 plan.plannedMoves[3]={move:'water-pulse',purpose:'temporary',replacement:'icy-wind'};
 localStorage.setItem('poketact-teams',JSON.stringify([team]));
 localStorage.setItem('takdex-v74-playthrough-plans',JSON.stringify({[game+':'+team.id]:{game,slots:[plan],deadline:'pre-league'}}));
}

async function measure(row){
 return row.evaluate(el=>{
  const card=el.querySelector('.td77-move-comparison').getBoundingClientRect();
  const disclosure=el.querySelector('.td62-move-timing');
  const summary=disclosure.querySelector('summary');
  const heading=summary?.firstElementChild||disclosure;
  const line=heading.getBoundingClientRect();
  const divider=el.nextElementSibling?.getBoundingClientRect().top;
  const style=getComputedStyle(summary||heading);
  const hit=summary&&[...Array(80).keys()].filter(i=>document.elementFromPoint(
   line.left+8, line.top-20+i)?.closest('summary')===summary).length;
  const cardBottom=card.bottom;
  const above=line.top-cardBottom+(summary?0:parseFloat(style.paddingTop));
  const below=divider-line.bottom+(summary?0:parseFloat(style.paddingBottom));
  return {above,below,hit,font:style.fontSize,line:parseFloat(style.lineHeight),
   centered:!summary||Math.abs((line.top+line.bottom)-(summary.getBoundingClientRect().top+summary.getBoundingClientRect().bottom))<0.1,
   overflow:disclosure.scrollWidth>disclosure.clientWidth};
 });
}

(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 const results={};
 try{
  for(const width of [360,412]){
   const dir=path.join(output,String(width));await fs.mkdir(dir,{recursive:true});
   const page=await browser.newPage({viewport:{width,height:950},isMobile:true,hasTouch:true,serviceWorkers:'block',ignoreHTTPSErrors:true});
   await page.goto(reference);
   const ref=await page.locator('.acq summary').first().evaluate(el=>{
    const box=el.getBoundingClientRect(),style=getComputedStyle(el);
    return {above:box.top+parseFloat(style.paddingTop)-el.closest('details').previousElementSibling.getBoundingClientRect().bottom,
     below:parseFloat(style.paddingBottom),line:parseFloat(style.lineHeight)};
   });
   assert.deepEqual(ref,{above:8,below:8,line:20});
   await page.locator('.panel').screenshot({path:path.join(dir,'reference.png')});
   await page.addInitScript(seed);
   const records={reference:ref};
   for(const [name,url] of [['rc4',baseline],['rc5',candidate]]){
    await page.goto(url,{waitUntil:'domcontentloaded'});
    await page.locator('[data-td71-toggle="rc5-spacing"]').click();
    await page.locator('[data-td41-team-plan="rc5-spacing"]').click();
    await page.locator('[data-td4-slot="0"]').click();
    const row=move=>page.locator('[data-td77-planned-move="'+move+'"]');
    const reminder=row('aqua-jet').locator('summary');
    const machine=row('aerial-ace').locator('summary');
    assert.match(await reminder.textContent(),/Move Reminder/);
    assert.match(await machine.textContent(),/TM40 · Mistralton City/);
    await row('aqua-jet').evaluate(el=>el.scrollIntoView({block:'center'}));
    await page.locator('#td41MoveSlots').screenshot({path:path.join(dir,name+'.png')});
    await row('aqua-jet').evaluate(el=>el.scrollIntoView({block:'center'}));
    records[name]={reminder:await measure(row('aqua-jet')),machine:await measure(row('aerial-ace')),level:await measure(row('water-pulse'))};
    if(name==='rc4')continue;
    console.log(width,JSON.stringify(records));
    for(const m of [records.rc5.reminder,records.rc5.machine,records.rc5.level]){
     assert.equal(m.above,8);assert.equal(m.below,8);assert.equal(m.centered,true);assert.equal(m.overflow,false);
     if(m.hit!==null)assert.ok(m.hit>=44,JSON.stringify(m));
    }
    assert.equal(records.rc5.machine.font,records.rc4.machine.font);
    assert.match(await row('icy-wind').textContent(),/Temporary: Water Pulse.*Move Tutor/s);
    await machine.focus();
    await page.keyboard.press('Enter');
    assert.equal(await machine.evaluate(el=>el.parentElement.open),true);
    await page.locator('#td41MoveSlots').screenshot({path:path.join(dir,'expanded.png')});
    const map=row('aerial-ace').locator('[data-td74-dex-map]').first();
    await map.click();await page.locator('#mapsContent').waitFor();
    await page.locator('#backMaps').click();
    assert.equal(await machine.evaluate(el=>el.parentElement.open),true);
    await machine.click();
    assert.equal(await machine.evaluate(el=>el.parentElement.open),false);
    // Constrain a live heading to test natural wrapping without modifying app data.
    await machine.evaluate(el=>el.style.maxWidth='135px');
    const wrap=await measure(row('aerial-ace'));
    assert.equal(wrap.above,8);assert.equal(wrap.below,8);assert.equal(wrap.centered,true);
    assert.equal(wrap.overflow,false);
    await page.locator('#td41MoveSlots').screenshot({path:path.join(dir,'wrapped.png')});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
    records.wrapped=wrap;
   }
   results[width]=records;
   await page.close();
  }
 }finally{await browser.close();}
 await fs.writeFile(path.join(output,'measurements.json'),JSON.stringify(results,null,2));
 console.log(JSON.stringify(results));
})().catch(error=>{console.error(error);process.exitCode=1});
