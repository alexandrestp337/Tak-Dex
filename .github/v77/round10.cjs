const assert=require('node:assert/strict');
const {chromium}=require('playwright-core');
const base=process.argv[2]||'http://127.0.0.1:8795';
const game='Black 2', key=game+':r10';
const mon=(id,name,types,pid)=>({id,name,level:25,types,saveStats:{pid},moves:[{name:'Scratch'}]});
const party=[mon(391,'Monferno',['fire','fighting'],391),mon(54,'Psyduck',['water'],54)];
const plan=(id,name,types,origin,move,legalMoves)=>({
 id,name,types,originPid:origin,confirmedCandidate:true,finalManualSlots:[true],
 finalLearnset:{legalMoves,learnMethods:{}},plannedMoves:[{move,purpose:'keep'}],duringMoves:[{move,purpose:'keep'}]
});
const slots=[
 plan(391,'monferno',['fire','fighting'],391,'flame-wheel',['flame-wheel','mach-punch','leer','ember','taunt','fury-swipes','feint','fire-spin','close-combat']),
 plan(52,'meowth',['normal'],54,'bite',['scratch','bite'])
];

(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  for(const width of [320,412]){
   const page=await browser.newPage({viewport:{width,height:860},isMobile:true,hasTouch:true,reducedMotion:'reduce',serviceWorkers:'block'});
   const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.addInitScript(({game,key,party,slots})=>{
    localStorage.setItem('poketact-teams',JSON.stringify([{id:'r10',name:'Round 10',game,pokemon:party,saveLink:{progression:{badgeCount:3}}}]));
    localStorage.setItem('takdex-v74-playthrough-plans',JSON.stringify({[key]:{game,slots,deadline:'pre-league'}}));
   },{game,key,party,slots});
   await page.goto(base,{waitUntil:'domcontentloaded'});
   if(!await page.locator('[data-td41-team-plan="r10"]').isVisible())await page.locator('[data-td71-toggle="r10"]').click();
   await page.locator('[data-td41-team-plan="r10"]').click();
   await page.waitForFunction(key=>JSON.parse(localStorage.getItem('takdex-v74-playthrough-plans'))[key].slots[0]?.legalMoves?.length,key);
   const tile=i=>page.locator(`#td4Slots [data-td4-slot="${i}"]`);
   const row=page.locator('#td41MoveSlots [data-td77-actual-move="scratch"]');
   const openEditor=()=>row.locator('[data-td78-open-move]').click();
   const box=row.locator('.suggestions');
   const back=page.locator('#td68MoveResult .td64-move-back');
   const checkerResult=page.locator('#td68MoveResult');
   await tile(0).click();
   const actual=row.locator('[data-td77-plan-move="scratch"]').first();
   await actual.click();
   await back.waitFor();
   assert.match(await checkerResult.textContent(),/Scratch/i);
   await back.click();

   await openEditor();
   assert.equal(await box.locator('[data-td45-restore="scratch"]').isEnabled(),true);
   assert.equal(await box.locator('[data-td77-plan-move]').getAttribute('data-td77-plan-move'),'flame-wheel');
   const geometry=await row.evaluate(el=>{
    const box=el.querySelector('.suggestions'),card=el.querySelector('.td77-edit-move .td77-planner-move-info'),list=box.querySelector('.td78-move-results');
    return {rows:[box,card].map(n=>[getComputedStyle(n).borderTopColor,getComputedStyle(n).borderTopWidth]),
     focused:el.querySelector('input')===document.activeElement,width:document.documentElement.scrollWidth,
     maxHeight:parseFloat(getComputedStyle(list).maxHeight),height:list.clientHeight,scrollHeight:list.scrollHeight};
   });
   assert.deepEqual(geometry.rows[0],geometry.rows[1]);
   assert.equal(geometry.rows[0][1],'1px');
   const expected=await row.evaluate(el=>{
    const probe=document.createElement('span');probe.style.color='var(--accent)';el.append(probe);
    const color=getComputedStyle(probe).color;probe.remove();return color;
   });
   assert.equal(geometry.rows[0][0],expected);
   assert.equal(geometry.focused,false);
   assert.equal(geometry.width,width);
   assert.equal(geometry.maxHeight,260);
   assert.equal(geometry.height,260);
   assert.ok(geometry.scrollHeight>geometry.height);
   await box.locator('[data-td77-plan-move="flame-wheel"]').click();
   await back.waitFor();
   assert.match(await checkerResult.textContent(),/Flame Wheel/i);
   await back.click();
   if(!await box.isVisible())await openEditor();
   await box.locator('[data-td45-restore="scratch"]').click();
   await row.locator('.td41-good').getByText('Keep',{exact:true}).waitFor();
   assert.match(await page.locator('#td4PlanProgress').textContent(),/1\/2Planned moves already known/);

   await page.locator('[data-view="during"]').click();
   await openEditor();
   await box.locator('[data-td45-restore="scratch"]').click();
   await row.locator('[data-td45-move="0:during"]').waitFor({state:'attached'});
   assert.equal(await row.getAttribute('data-td77-retained'),'true');
   await page.locator('[data-view="final"]').click();

   await tile(1).click();
   await openEditor();
   assert.equal(await box.getByRole('button',{name:'Keep',exact:true}).isDisabled(),true);
   await box.getByRole('button',{name:'Close',exact:true}).click();
   await tile(2).click();
   const candidates=page.locator('#td4Candidates');
   const direct=candidates.locator('details.td80-candidate-acquisition').filter({hasText:'Acquisition details'}).first();
   const evolution=candidates.locator('details.td80-candidate-acquisition').filter({hasText:'→'}).first();
   await direct.waitFor();
   await evolution.waitFor();
   for(const entry of [direct,evolution]){
    assert.equal(await entry.evaluate(el=>el.open),false);
    await entry.locator(':scope > summary').click();
    assert.equal(await entry.evaluate(el=>el.open),true);
    assert.equal(await page.locator('#td63ManualCandidate [data-td77-preview-context]').count(),0);
    assert.equal(await entry.locator('small').count()>1,true);
   }
   const link=candidates.locator('details[open] [data-td74-dex-map]').first();
   await link.click();
   await page.locator('#backMaps').click();
   await candidates.waitFor();
   assert.ok(await candidates.locator('details[open]').count()>0);
   const badges=candidates.getByText('Existing move coverage · gains STAB',{exact:false}).first();
   await badges.waitFor();
   assert.equal(await badges.locator('.pill').count()>0,true);
   assert.equal(await candidates.getByText('(already covered by planned moves)',{exact:false}).count(),0);
   assert.deepEqual(errors,[]);
   console.log(`${width}px: active borders, owned retention outside learnset, unrelated Keep disabled, distinct Checkers, grouped badges, acquisition disclosure and map return passed`);
   await page.close();
  }
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
