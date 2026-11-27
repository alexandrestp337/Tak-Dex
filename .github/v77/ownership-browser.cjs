const assert=require('node:assert/strict');
const {chromium}=require('playwright-core');
const fs=require('node:fs');
const {makeSave}=require('../v76/fixtures.cjs');
const url=process.argv[2];
const baseline=process.argv.includes('--baseline');
const widths=baseline?[360]:[360,412];
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 try{for(const width of widths){
 const page=await browser.newPage({viewport:{width,height:900},isMobile:true,hasTouch:true,ignoreHTTPSErrors:true,serviceWorkers:'block'});
 const key='takdex-v74-playthrough-plans';
 await page.addInitScript(({key})=>{
  if(localStorage.getItem(key))return;
  const scenario=new URLSearchParams(location.search).get('scenario');
  const game='Black 2',moves=['bite','crunch','dig','earthquake'].map(move=>({move,purpose:'keep'}));
  localStorage.setItem('poketact-teams',JSON.stringify([{id:'ownership',name:'Ownership',game,pokemon:[]}]));
  const duringMoves=moves.map(move=>({...move}));
  moves[1]={move:'bite',purpose:'temporary',replacement:'crunch'};
  const slot={
   id:553,name:'krookodile',types:['ground','dark'],originPid:15,originName:'purrloin',confirmedCandidate:true,locked:true,
   duringTargetId:551,duringSpecies:'sandile',plannedMoves:moves,duringMoves,finalAutoMoves:['bite'],
   acquisitionRoute:{id:'551|walk|Route 4|14|17',startId:551}
  };
  const slots=scenario==='competing'?[slot,{...slot,originPid:91}]:[slot];
  localStorage.setItem(key,JSON.stringify({[game+':ownership']:{game,deadline:'pre-league',slots}}));
 },{key});
 let sequence=1;
 const party=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('poketact-teams'))[0].pokemon.filter(Boolean));
 const sync=async (roster,manual=false,expected='updated')=>{
  const bytes=Array.from(makeSave(23,sequence++,20,{mask:7},roster));
  if(manual){
   await page.locator('[data-save-file="ownership"]').setInputFiles({name:'black2.sav',mimeType:'application/octet-stream',buffer:Buffer.from(bytes)});
   await page.waitForFunction(()=>JSON.parse(localStorage.getItem('poketact-teams'))[0].saveLink);
  }else assert.equal(await page.evaluate(bytes=>takDexSaveSync.synchronize({teamId:'ownership',bytes:new Uint8Array(bytes)}),bytes),expected);
 };
 const mon=(species,pid,move=44)=>({species,pid,move,ability:22,item:0});
 const original=mon(509,15),patrat=mon(504,28,67),sandile=mon(551,42);
 const plan=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key))['Black 2:ownership'],key);
 const open=async()=>{
  if(!await page.locator('[data-td41-team-plan="ownership"]').isVisible())await page.locator('[data-td71-toggle="ownership"]').click();
  await page.locator('[data-td41-team-plan="ownership"]').click();
  await page.waitForFunction(()=>document.querySelector('#td4Status').textContent==='');
  await page.waitForFunction(key=>JSON.parse(localStorage.getItem(key))['Black 2:ownership'].slots.length===6,key);
 };
 const tile=page.locator('[data-td4-slot="0"]');
 await page.goto(url);
 await page.locator('[data-td71-toggle="ownership"]').click();
 await sync([original],true);
 await page.locator('[data-td41-team-plan="ownership"]').click();
 await page.waitForFunction(()=>document.querySelector('#td4Slots').children.length===6);
 await page.waitForFunction(key=>JSON.parse(localStorage.getItem(key))['Black 2:ownership'].slots.length===6,key);
 const originalIntent=intent(await plan());
 if(!baseline){
  await page.waitForFunction(()=>document.querySelector('#td77Gyms [title^="Actual:"]'));
  const coverage=()=>page.locator('#td77Gyms .td64-league-pair').evaluateAll(nodes=>nodes.slice(0,2).map(node=>[...node.children].map(el=>el.title)));
  const before=await coverage();
  await sync([patrat]);
  assert.match(await (await coverage())[0][0],/Super-effective/);
  assert.deepEqual((await coverage()).map(x=>x[1]),before.map(x=>x[1]));
  assert.match(await page.locator('[data-td4-slot="1"]').innerText(),/Slot 2/);
  assert.equal((await plan()).slots[1],null);
 }
 await sync([patrat,original,sandile]);
 if(baseline){
  assert.match(await tile.innerText(),/Purrloin/);
  assert.match(await tile.innerText(),/Obtain Sandile/);
  await saveEvidence(tile,'baseline');
  console.log('Reproduced: valid imported Purrloin followed by linked Patrat/Purrloin/Sandile remains associated with Purrloin.');
  await page.close();continue;
 }
 // Further reconciliation scenarios run against the corrected candidate.
 assert.equal(intent(await plan()),originalIntent);
 await checkCandidate({page,tile,sync,mon,original,patrat,sandile,plan,open,width,party});
 for(const scenario of ['direct','competing','duplicates']){
  await page.evaluate(key=>{localStorage.removeItem(key);localStorage.removeItem('poketact-teams');localStorage.removeItem('takdex-v78-state-v1')},key);
  await page.goto(url+'?scenario='+scenario);
  await open();
  if(scenario==='direct'){
   await sync([patrat,mon(553,42)]);
   await page.waitForFunction(()=>document.querySelector('[data-td4-slot="0"]').innerText.includes('On team'));
   await page.waitForFunction(key=>JSON.parse(localStorage.getItem(key))['Black 2:ownership'].slots[0].fulfilledPid===42,key);
   assert.equal((await plan()).slots[0].fulfilledPid,42);
  }else{
   const roster=scenario==='competing'?[sandile]:[sandile,mon(551,43)];
   await sync(roster);
   if(!await page.locator('#td4Edit').isVisible())await tile.click();
   const confirm=page.locator('[data-td7721-bind="42"]');
   await confirm.waitFor();
   if(process.env.TAKDEX_EVIDENCE&&scenario==='duplicates'){
    fs.mkdirSync(process.env.TAKDEX_EVIDENCE,{recursive:true});
    await page.locator('[data-td7721-bind]').first().scrollIntoViewIfNeeded();
    await page.screenshot({path:process.env.TAKDEX_EVIDENCE+'/'+width+'-ambiguity.png'});
   }
   assert.equal((await plan()).slots[0].fulfilledPid,undefined);
   assert.equal((await plan()).slots[1]?.fulfilledPid,undefined);
   if(scenario==='duplicates'){
    await page.locator('[data-td7721-dismiss]').click();
    await page.reload();await open();
    assert.equal(await confirm.count(),0);
    await sync([sandile,mon(551,44)]);
    await confirm.waitFor();
   }
   await confirm.click();
   await page.waitForFunction(key=>JSON.parse(localStorage.getItem(key))['Black 2:ownership'].slots[0].fulfilledPid===42,key);
   assert.equal((await plan()).slots[0].fulfilledPid,42);
   assert.equal((await plan()).slots[1]?.fulfilledPid,undefined);
   await page.reload();await open();
   await page.waitForFunction(key=>JSON.parse(localStorage.getItem(key))['Black 2:ownership'].slots[0].fulfilledPid===42,key);
   assert.equal((await plan()).slots[0].fulfilledPid,42);
  }
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
 }
 console.log(width+'px: direct later-stage acquisition, competing slots, ambiguity dismissal and persistent confirmation passed');
 await page.close();
 }}finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});

const intent=state=>JSON.stringify({deadline:state.deadline,slots:state.slots.map(p=>p&&[
  p.id,p.duringTargetId,p.duringSpecies,p.plannedMoves,p.duringMoves,p.locked,p.acquisitionRoute,p.finalAutoMoves
 ])});

async function checkCandidate({page,tile,sync,mon,original,patrat,sandile,plan,open,width,party}){
 const wait=pattern=>page.waitForFunction(pattern=>new RegExp(pattern).test(document.querySelector('[data-td4-slot="0"]').innerText),pattern);
 await wait('Sandile');
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('takdex-v74-playthrough-plans'))['Black 2:ownership'].slots[0].fulfilledPid===42);
 await saveEvidence(tile,width+'-fulfilled');
 assert.doesNotMatch(await tile.innerText(),/Purrloin/);
 const before=intent(await plan());
 assert.equal((await plan()).slots[0].fulfilledPid,42);
 const sameIntent=async()=>assert.equal(intent(await plan()),before);
 await sync([patrat]);await wait('Not in party');await sameIntent();
 await sync([original,mon(552,42),patrat]);await wait('Krokorok');await sameIntent();
 const evolved={...mon(553,42,242),level:52,item:287,ability:153};
 const reordered=[mon(553,99),patrat,evolved];
 await sync(reordered);await wait('On team');await sameIntent();
 assert.equal((await plan()).slots[0].fulfilledPid,42);
 assert.deepEqual((await party()).map(p=>p.saveStats.pid),[99,28,42]);
 const current=(await party())[2];
 assert.equal(current.level,52);assert.equal(current.saveStats.itemId,287);assert.equal(current.saveStats.abilityId,153);
 assert.match(await tile.innerText(),/Crunch/);
 assert.ok(await tile.locator('[data-td77-retained=true]').count());
 await sync(reordered,false,'unchanged');await sameIntent();
 await page.locator('[data-td4-slot="0"]').click();
 await page.locator('[data-view="during"]').click();
 await wait('Sandile');
 await sameIntent();
 await page.reload();
 await open();
 await wait('Sandile');
 await sameIntent();
 assert.equal((await plan()).slots[0].fulfilledPid,42);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
 console.log(width+'px: fulfillment, reorder, absence/return, same-PID evolution, competitor and restart passed');
}

async function saveEvidence(locator,name){
 if(!process.env.TAKDEX_EVIDENCE)return;
 fs.mkdirSync(process.env.TAKDEX_EVIDENCE,{recursive:true});
 await locator.screenshot({path:process.env.TAKDEX_EVIDENCE+'/'+name+'.png'});
}
