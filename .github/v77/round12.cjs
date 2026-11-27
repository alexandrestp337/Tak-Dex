const assert=require('node:assert/strict');
const {chromium}=require('playwright-core');

(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:412,height:860},isMobile:true,hasTouch:true,reducedMotion:'reduce',serviceWorkers:'block'});
  await page.addInitScript(()=>{
   const game='Black 2',id='r12',types=['fire','fighting'];
   localStorage.setItem('poketact-teams',JSON.stringify([{id,name:'Round 12',game,pokemon:[
    {id:391,name:'Monferno',level:25,types,saveStats:{pid:391},moves:[{name:'Scratch'}]}
   ]}]));
   localStorage.setItem('takdex-v74-playthrough-plans',JSON.stringify({[game+':'+id]:{game,slots:[
    {id:391,name:'monferno',types,originPid:391,confirmedCandidate:true,plannedMoves:[{move:'flame-wheel',purpose:'keep'}]}
   ]}}));
  });
  await page.goto(process.argv[2]||'http://127.0.0.1:8795',{waitUntil:'domcontentloaded'});
  const planner=page.locator('[data-td41-team-plan="r12"]');
  if(!await planner.isVisible())await page.locator('[data-td71-toggle="r12"]').click();
  await planner.click();
  const slot=page.locator('#td4Slots [data-td4-slot="0"]');
  await slot.tap();
  const row=page.locator('#td41MoveSlots [data-td77-planned-move="flame-wheel"]');
  await row.locator('[data-td78-open-move]').tap();
  const search=row.locator('input');
  const box=row.locator('.suggestions');
  await search.fill('e');
  const checker=box.getByRole('button',{name:'Checker',exact:true});
  await checker.scrollIntoViewIfNeeded();
  const before=await box.evaluate(el=>{
   const list=el.querySelector('.td78-move-results');
   list.scrollTop=90;
   return {page:window.scrollY,list:list.scrollTop};
  });
  assert.ok(before.list>0);
  await checker.tap();
  const back=page.locator('#td68MoveResult .td64-move-back');
  await back.waitFor();
  assert.match(await page.locator('#td68MoveResult article h2').textContent(),/Flame Wheel/i);
  await back.tap();
  await page.waitForTimeout(400); // Let return frames, async refresh and the focusout timer run.
  assert.equal(await slot.getAttribute('aria-expanded'),'true');
  assert.equal(await box.isVisible(),true,'move editor must remain open after render');
  assert.equal(await search.inputValue(),'e');
  assert.equal(await search.evaluate(el=>document.activeElement===el),false);
  const after=await box.evaluate(el=>({page:window.scrollY,list:el.querySelector('.td78-move-results').scrollTop}));
  assert.ok(Math.abs(after.page-before.page)<=2,JSON.stringify({before,after}));
  assert.equal(after.list,before.list);
  console.log('412px: Flame Wheel Checker → contextual Back restores the selected slot, open editor, search and both scroll positions without focus.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
