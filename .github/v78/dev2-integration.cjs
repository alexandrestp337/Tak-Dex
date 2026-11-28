const assert=require('node:assert/strict');
const {readFile}=require('node:fs/promises');
const {chromium}=require('playwright-core');
const {makeSave}=require('../v76/fixtures.cjs');
const url=process.argv[2]||'http://127.0.0.1:8912';
const game='Black 2',key='takdex-v78-state-v1';

const plan={
 game,deadline:'pre-league',mode:'final',slots:[{
  id:523,name:'zebstrika',types:['electric'],confirmedCandidate:true,locked:true,duringTargetId:522,duringSpecies:'blitzle',
  acquisitionRoute:{id:'522|link trade||0|0',startId:522},duringMoves:[{move:'spark',purpose:'keep'}],
  plannedMoves:[{move:'wild-charge',purpose:'keep'}],finalManualSlots:[true],duringManualSlots:[true]
 }]
};
const pokemon={id:498,name:'tepig',types:['fire'],level:24,moves:[{name:'Flame Wheel'}]};
const initial={id:'trade',game,name:'Black 2',pokemon:[pokemon]};
const seed={team:initial,plan};

async function state(page){return page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);}
async function openPlanner(page){
 const planner=page.locator('[data-td41-team-plan="trade"]');
 if(!await planner.isVisible())await page.locator('[data-td71-toggle="trade"]').click();
 await planner.click();
 await page.waitForFunction(()=>document.querySelector('#td4Status').textContent==='');
}
async function storage(browser){
 const context=await browser.newContext({viewport:{width:412,height:880},isMobile:true,hasTouch:true,ignoreHTTPSErrors:true,serviceWorkers:'block'});
 await context.addInitScript(({seed,key})=>{
  if(localStorage.getItem(key)||localStorage.getItem('poketact-teams'))return;
  localStorage.setItem('poketact-teams',JSON.stringify([seed.team]));
  localStorage.setItem('takdex-v74-playthrough-plans',JSON.stringify({[seed.team.game+':'+seed.team.id]:seed.plan}));
 },{seed,key});
 const a=await context.newPage(),b=await context.newPage();
 try{
  await Promise.all([a.goto(url),b.goto(url)]);
  const fill=async (page,name)=>{
   await page.locator('#addTeam').tap();
   const popup=page.locator('#newDialog');
   assert.equal(await popup.evaluate(el=>document.activeElement.id),'cancelNew');
   assert.deepEqual(await popup.locator('.buttons button').allTextContents(),['Cancel','Import','Create']);
   const dimensions=await popup.locator('.buttons button').evaluateAll(rows=>rows.map(e=>[e.offsetTop,e.offsetHeight]));
   assert.ok(dimensions.every(([y,h])=>y===dimensions[0][0]&&h===44));
   await page.locator('#teamName').fill(name);
   await page.locator('#game').selectOption(game);
  };
  await Promise.all([fill(a,'Black 2'),fill(b,'black 2')]);
  await Promise.all([a.getByRole('button',{name:'Create',exact:true}).tap(),b.getByRole('button',{name:'Create',exact:true}).tap()]);
  await a.waitForFunction(key=>Object.values(JSON.parse(localStorage.getItem(key))?.teams||{}).length===3,key);
  const teamNames=Object.values((await state(a)).teams).map(({value})=>value.name.toLowerCase()).sort();
  assert.deepEqual(teamNames,['black 2','black 2 (2)','black 2 (3)']);

  await a.locator('#teamsTab').click();
  if(!await a.locator('[data-export-card="trade"]').isVisible())await a.locator('[data-td71-toggle="trade"]').click();
  const download=a.waitForEvent('download');
  await a.locator('[data-export-card="trade"]').click();
  const raw=await readFile(await (await download).path());
  assert.deepEqual(JSON.parse(raw).plan,plan);
  await a.locator('#addTeam').tap();
  await a.locator('#importTeamFile').setInputFiles({name:'trade.json',mimeType:'application/json',buffer:raw});
  await a.locator('#newDialog').waitFor({state:'hidden'});
  const envelope=await state(a);
  const imported=Object.values(envelope.teams).find(row=>row.value.name==='Black 2 (4)').value;
  assert.deepEqual(envelope.plans[game+':'+imported.id].value,plan);
  assert.equal(envelope.links[imported.id],undefined);
  assert.equal(envelope.teams.trade.value.name,'Black 2');

  await a.locator('#teamsTab').click();
  if(!await a.locator('[data-td74-builder-team="trade"][data-td74-builder-slot="0"]').isVisible())await a.locator('[data-td71-toggle="trade"]').click();
  await a.locator('[data-td74-builder-team="trade"][data-td74-builder-slot="0"]').click();
  const profile=a.locator('#td77BuilderBattle');
  await profile.locator(':scope > summary').click();
  await profile.locator('.td74-battle-stats > summary').click();
  const attack=profile.locator('[data-td74-stat="attack"]');
  const reset=profile.getByRole('button',{name:'Reset manual battle stat adjustments'});
  const source=profile.locator('[data-td76-stat-source]');
  const initialAttack=await attack.inputValue();
  await attack.fill('150');
  assert.match(await source.innerText(),/Manually adjusted/);
  const [sourceBox,resetBox]=await Promise.all([source.boundingBox(),reset.boundingBox()]);
  assert.equal(resetBox.height,32);
  assert.equal(resetBox.width,32);
  assert.ok(sourceBox.x+sourceBox.width<=resetBox.x);
  await reset.tap();
  assert.equal(await attack.inputValue(),initialAttack);
  await a.locator('[data-td74-builder-team="trade"][data-td74-builder-slot="0"]').click();
  await a.locator('#td78Confirmation').getByRole('button',{name:'Discard'}).click();
  await a.locator('#teamsTab').click();
  await openPlanner(a);
  const importedParty=async (sequence,species,other=false)=>{
   const roster=[{species,pid:6299,move:209,ability:31,item:0}];
   if(other)roster.unshift({species:504,pid:23,move:44,ability:22,item:0});
   const bytes=Array.from(makeSave(23,sequence,30,{mask:7},roster));
   const result=await a.evaluate(bytes=>takDexSaveSync.synchronize({teamId:'trade',bytes:new Uint8Array(bytes)}),bytes);
   assert.equal(result,'updated');
   await a.waitForFunction(({key,game,species})=>JSON.parse(localStorage.getItem(key)).plans[game+':trade'].value.slots[0].fulfilledStage===species,{key,game,species});
   return (await state(a)).plans[game+':trade'].value.slots[0];
  };
  for(const row of [await importedParty(10,522),await importedParty(11,523,true)]){
   assert.equal(row.fulfilledPid,6299);
   assert.equal(row.duringTargetId,522);
   assert.equal(row.locked,true);
   assert.deepEqual(row.acquisitionRoute,plan.slots[0].acquisitionRoute);
   assert.equal(row.duringMoves[0].move,'spark');
   assert.equal(row.plannedMoves[0].move,'wild-charge');
  }
  await a.reload();
  await openPlanner(a);
  const linkedTile=a.locator('#td4Slots [data-td4-slot="0"]');
  await linkedTile.locator('.td772-stage strong').getByText('Blitzle',{exact:true}).waitFor();
  assert.match(await linkedTile.innerText(),/Blitzle.*Zebstrika/s);
  console.log('Cross-tab case-insensitive names, modal focus and dimensions, compact stat reset, portable trade-route export/import, persisted trade fulfillment and same-PID evolution after reorder passed.');
 }finally{await context.close();}
}

async function navigation(browser){
 const page=await browser.newPage({viewport:{width:412,height:880},isMobile:true,hasTouch:true,reducedMotion:'reduce',ignoreHTTPSErrors:true,serviceWorkers:'block'});
 const errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.addInitScript(()=>{
  localStorage.setItem('poketact-teams',JSON.stringify([{id:'maps',name:'Maps',game:'Black 2',pokemon:[]}]));
  localStorage.setItem('takdex-v71-active-team','maps');
  document.addEventListener('click',event=>{
   if(event.target.closest('[data-td74-dex-map],[data-td73-map-link],[data-td74-machine-location],[data-td74-tm-map]'))
    window.departure={scroll:scrollY,max:document.documentElement.scrollHeight-innerHeight};
  },true);
 });
 await page.goto(url);
 page.setDefaultTimeout(12000);
 const back=page.locator('#backMaps'),maps=page.locator('#mapsPage');
 const fromMap=async (source,link,mode='regular')=>{
  await link.scrollIntoViewIfNeeded();
  await link.tap();
  const departure=await page.evaluate(()=>window.departure);
  await maps.waitFor();
  await page.locator('#mapsCanvas svg[data-map-game="Black 2"]').waitFor();
  assert.equal(await page.getByRole('button',{name:'Back',exact:true}).count(),1);
  const [rect,controls]=await page.evaluate(()=>['backMaps','mapsFullscreen'].map(id=>document.getElementById(id).getBoundingClientRect().toJSON()));
  assert.ok(rect.x>controls.x&&rect.top===controls.top&&rect.height===controls.height,JSON.stringify({rect,controls}));
  if(mode==='fullscreen'){
   await page.locator('#mapsFullscreen').tap();
   await page.locator('.td63-map-full .td73-map-toolbar #backMaps').waitFor();
   assert.equal(await page.locator('#mapsBackFallback #backMaps').count(),0);
  }
  await back.tap();
  await source.waitFor();
  await page.waitForFunction(scroll=>Math.abs(scrollY-scroll)<=4,departure.scroll,{timeout:3000}).catch(async()=>{
   const arrival=await page.evaluate(()=>({scroll:scrollY,max:document.documentElement.scrollHeight-innerHeight}));
   assert.fail(JSON.stringify({source:await source.getAttribute('id'),departure,arrival}));
  });
 };

 const dex=page.locator('#dexPage');
 await page.locator('#dexTab').click();
 await page.evaluate(()=>takDexBattleNavigationV73.showDex('lapras','dex',{game:'Black 2',id:131}));
 const encounters=page.locator('#td56DexEncounters');
 if(!await encounters.evaluate(el=>el.open))await encounters.locator('summary').click();
 const village=encounters.locator('[data-td74-dex-map="Village Bridge"]').first();
 await fromMap(dex,village,'fullscreen');
 assert.equal(await encounters.evaluate(el=>el.open),true);
 assert.match(await page.locator('#dexResult h3').first().innerText(),/Lapras/);

 await page.locator('#moreTab').tap();
 await page.locator('#td68OpenMove').tap();
 const movePage=page.locator('#td68MovePage');
 await page.locator('#td68MoveInput').fill('Ice Punch');
 await page.locator('#td68MoveInput').press('Enter');
 const tutorDetails=page.locator('#td68MoveResult summary').getByText('Where to get Ice Punch');
 await tutorDetails.click();
 const tutor=page.locator('#td68MoveResult [data-td73-map-link="Driftveil City"]').first();
 await fromMap(movePage,tutor);
 assert.equal(await tutorDetails.locator('xpath=../..').evaluate(el=>el.open),true);
 assert.equal(await page.locator('#td68MoveInput').inputValue(),'Ice Punch');

 await page.locator('[data-move-catalog="machines"]').click();
 await page.locator('#tmGame').selectOption(game);
 await page.locator('#tmMoveSearch').fill('26');
 await page.locator('#tmMoveResults button').filter({hasText:'Earthquake'}).click();
 await page.locator('#td68MoveResult summary').getByText('Where to get Earthquake').click();
 const machine=page.locator('#td68MoveResult [data-td74-machine-location^="Route 15"]').first();
 await fromMap(movePage,machine);
 assert.match(await page.locator('#td68MoveResult h2').first().innerText(),/Earthquake/);

 await page.locator('#tmMoveSearch').fill('surf');
 await page.locator('#tmMoveResults button').filter({hasText:'Surf'}).click();
 await page.locator('#td68MoveResult summary').getByText('Where to get Surf').click();
 await fromMap(movePage,page.locator('#td68MoveResult [data-td74-machine-location^="Route 6"]').first());
 assert.match(await page.locator('#td68MoveResult h2').first().innerText(),/Surf/);

 await page.locator('#moreTab').tap();
 await page.locator('#openMaps').tap();
 assert.equal(await back.getAttribute('aria-label'),'More');
 assert.equal(await page.locator('#mapsBackFallback #backMaps').count(),1);
 assert.deepEqual(errors,[]);
 console.log('Contextual Back geometry and fullscreen from Pokédex Village Bridge, tutor, TM and HM; original Pokédex disclosure, move, and scroll restored; More remains distinct.');
 await page.close();
}

(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  if(process.env.TAKDEX_FOCUS!=='maps')await storage(browser);
  if(process.env.TAKDEX_FOCUS!=='storage')await navigation(browser);
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
