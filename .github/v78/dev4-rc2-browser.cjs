const assert=require('node:assert/strict');
const {mkdir}=require('node:fs/promises');
const {chromium}=require('playwright-core');
const {makeSave}=require('../v76/fixtures.cjs');
const url=process.argv[2]||'http://127.0.0.1:8917';
const evidence=process.env.TAKDEX_EVIDENCE;
const game='Black 2',id='rc2',key='takdex-v78-state-v1',planKey=game+':'+id;
const entries=names=>names.map(move=>({move,purpose:'keep'}));
const pokemon=(id,name,types,moves,extra={})=>({id,name,types,
 plannedMoves:entries(moves),duringMoves:entries(moves),...extra});
const seed={team:{id,game,name:'RC2 fixture',pokemon:[
 {id:25,name:'pikachu',types:['electric'],level:24,saveStats:{pid:23},moves:['thundershock']},
 {id:133,name:'eevee',types:['normal'],level:21,moves:['tackle']},
 {id:54,name:'psyduck',types:['water'],level:21,moves:['water-gun']}
]},plan:{game,mode:'final',deadline:'pre-league',slots:[
 pokemon(623,'golurk',['ground','ghost'],['earthquake','strength']),
 pokemon(133,'eevee',['normal'],['tackle'],{originName:'eevee'}),
 pokemon(54,'psyduck',['water'],['water-gun','scratch'],{originName:'psyduck'})
],independentSlots:{0:{during:pokemon(25,'pikachu',['electric'],['thundershock','quick-attack'],{explicitOwned:true,originPid:23})}}}};
const saved=page=>page.evaluate(({key,planKey})=>JSON.parse(localStorage.getItem(key)).plans[planKey].value,{key,planKey});
const tile=(page,i)=>page.locator(`#td4Slots [data-td4-slot="${i}"]`);
const box=loc=>loc.evaluate(e=>e.getBoundingClientRect().toJSON());
async function act(loc){
 await loc.evaluate(e=>e.scrollIntoView({block:'center'}));
 await loc.click();
}
async function photo(loc,name){
 if(!evidence)return;
 await mkdir(evidence,{recursive:true});
 for(let attempt=0;attempt<3;attempt++){
  try{
   await loc.evaluate(e=>e.scrollIntoView({block:'center'}));
   await loc.screenshot({path:`${evidence}/${name}.png`});
   return;
  }catch(error){if(attempt===2||!error.message.includes('not attached'))throw error;}
 }
}
async function selectStage(page,value){await act(page.locator(`#td77MoveViews [data-view="${value}"]`));}
async function openSlot(page,i){
 if(await tile(page,i).getAttribute('aria-expanded')!=='true')await act(tile(page,i));
}
async function planner(page){
 const button=page.locator(`[data-td41-team-plan="${id}"]`);
 if(!await button.isVisible())await act(page.locator(`[data-td71-toggle="${id}"]`));
 await act(button);
}
async function config(browser,width,light,data){
 const page=await browser.newPage({viewport:{width,height:880},isMobile:true,hasTouch:true,ignoreHTTPSErrors:true,
  reducedMotion:'reduce',serviceWorkers:'block'});
 page.setDefaultTimeout(20000);
 await page.addInitScript(({key,planKey,light,data})=>{
  if(!localStorage.getItem(key)){
   localStorage.setItem('poketact-teams',JSON.stringify([data.team]));
   localStorage.setItem('takdex-v74-playthrough-plans',JSON.stringify({[planKey]:data.plan}));
  }
  if(light)document.addEventListener('DOMContentLoaded',()=>document.body.classList.add('light'),{once:true});
 },{key,planKey,light,data});
 await page.goto(url);
 return page;
}
async function ui(browser,width,light){
 const page=await config(browser,width,light,seed),tag=width+'-'+(light?'light':'dark'),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 try{
  await planner(page);
  const tabStyles=await page.locator('#td77MoveViews button').evaluateAll(rows=>rows.map(e=>[e.textContent,e.offsetHeight]));
  assert.deepEqual(tabStyles.map(r=>r[0]),['During game','Final']);
  await openSlot(page,0);
  const dual=tile(page,0).locator('.td42-mon-pair'),buttons=page.locator('#td72MoveHeading .td7-reset-top');
  assert.deepEqual(await dual.locator('strong').allTextContents(),['Pikachu','Golurk']);
  assert.deepEqual(await dual.locator('.pills').allTextContents(),['Electric','GroundGhost']);
  await photo(tile(page,0),tag+'-dual-final');
  await selectStage(page,'during');
  assert.deepEqual(await dual.locator('strong').allTextContents(),['Pikachu','Golurk']);
  assert.match(await dual.locator('[aria-current=true]').innerText(),/Pikachu/);
  assert.match(await tile(page,0).innerText(),/Quick Attack/);
  assert.doesNotMatch(await tile(page,0).innerText(),/Earthquake/);
  await photo(tile(page,0),tag+'-dual-during');
  const geometry=await buttons.locator('button').evaluateAll(rows=>rows.map(e=>e.getBoundingClientRect().toJSON()));
  assert.ok(geometry.every(r=>Math.abs(r.width-geometry[0].width)<.1&&r.top===geometry[0].top&&r.height===32));
  assert.deepEqual(await buttons.locator('button').allTextContents(),['Lock','Reset','Remove']);
  await photo(buttons,tag+'-actions');
  await act(buttons.getByRole('button',{name:'Lock',exact:true}));
  assert.ok(await buttons.getByRole('button',{name:'Reset',exact:true}).isDisabled());
  assert.ok(await buttons.getByRole('button',{name:'Remove',exact:true}).isDisabled());
  await act(buttons.getByRole('button',{name:'Unlock',exact:true}));
  if(width===360&&!light){
   const final=(await saved(page)).slots[0];
   await act(buttons.getByRole('button',{name:'Reset',exact:true}));
   await page.getByRole('dialog').getByRole('button',{name:'Reset',exact:true}).click();
   await page.waitForFunction(({key,planKey})=>JSON.parse(localStorage.getItem(key)).plans[planKey].value.independentSlots[0].during.duringMoves.every(m=>!m.move),{key,planKey});
   assert.deepEqual((await saved(page)).slots[0],final);
   await act(buttons.getByRole('button',{name:'Remove',exact:true}));
   await page.getByRole('dialog').getByRole('button',{name:'Remove',exact:true}).click();
   await dual.getByText('Golurk').waitFor();
   await page.waitForFunction(()=>document.querySelectorAll('#td4Slots [data-td4-slot="0"] .td42-mon-pair img').length===1);
   assert.equal(await dual.locator('img').count(),1);
   assert.ok(await buttons.getByRole('button',{name:'Remove',exact:true}).isDisabled());
   assert.equal((await saved(page)).independentSlots[0].during,null);
   await page.reload();await planner(page);
   assert.equal(await tile(page,0).locator('.td42-mon-pair img').count(),1);
   assert.match(await tile(page,0).innerText(),/Golurk/);
   const bytes=Array.from(makeSave(23,18,30,{mask:7},[{species:25,pid:23,move:84,ability:9,item:0}]));
   assert.equal(await page.evaluate(({id,bytes})=>takDexSaveSync.synchronize({teamId:id,bytes:new Uint8Array(bytes)}),{id,bytes}),'updated');
   assert.equal((await saved(page)).independentSlots[0].during,null);
   assert.equal((await saved(page)).slots[0].id,623);
   await selectStage(page,'final');await openSlot(page,0);
   const change=page.locator('#td4Edit > .td42-settings > summary').first();
   if(!await page.locator('#td4Search').isVisible())await act(change);
   const onCard=page.locator('#td63ManualCandidate [data-td78-remove-stage]');
   await act(onCard);
   await page.getByRole('dialog').getByRole('button',{name:'Remove',exact:true}).click();
   await dual.getByText('Pikachu').waitFor();
   assert.equal((await saved(page)).slots[0],null);
  }
  if(width===412&&light){
   const during=(await saved(page)).independentSlots[0].during;
   await selectStage(page,'final');
   await act(buttons.getByRole('button',{name:'Remove',exact:true}));
   await page.getByRole('dialog').getByRole('button',{name:'Remove',exact:true}).click();
   await page.waitForFunction(({key,planKey})=>JSON.parse(localStorage.getItem(key)).plans[planKey].value.slots[0]===null,{key,planKey});
   assert.deepEqual((await saved(page)).independentSlots[0].during,during);
   assert.equal(await dual.locator('img').count(),1);
   assert.match(await tile(page,0).innerText(),/Pikachu/);
  }
  await selectStage(page,'final');await openSlot(page,1);
  const selector=page.locator('#td77FinalForm [data-td78-evolution]');
  await act(selector);
  const dialog=page.getByRole('dialog',{name:'Planned evolution'});
  assert.ok(await dialog.getByRole('button',{name:'Keep Eevee'}).isVisible());
  for(const name of ['Espeon','Umbreon','Vaporeon','Leafeon'])await dialog.getByRole('button',{name,exact:true}).waitFor();
  assert.ok(await dialog.locator('button:disabled,.td63-danger').count());
  await photo(dialog,tag+'-evolution');
  await page.keyboard.press('Escape');
  await dialog.waitFor({state:'hidden'});
  assert.ok(await selector.evaluate(e=>e===document.activeElement));

  const change=page.locator('#td4Edit > .td42-settings > summary').first();
  if(!await page.locator('#td4Search').isVisible())await act(change);
  const funnel=page.locator('#td77TypeFilter'),input=page.locator('#td4Search');
  const neutral=await funnel.evaluate(e=>[getComputedStyle(e).borderColor,getComputedStyle(e).color]);
  const [filterBox,inputBox]=await Promise.all([box(funnel),box(input)]);
  assert.equal(filterBox.width,44);assert.equal(inputBox.height,44);assert.equal(filterBox.top,inputBox.top);
  await act(funnel);
  const open=await funnel.evaluate(e=>[getComputedStyle(e).borderColor,getComputedStyle(e).color]);
  assert.notEqual(open[0],neutral[0]);assert.equal(open[1],neutral[1]);
  for(const type of ['Psychic','Ground'])await act(page.locator('#td77TypeOptions').getByRole('button',{name:type,exact:true}));
  await photo(page.locator('.td77-candidate-search'),tag+'-pokemon-filters');
  if(width===360&&!light){
   await input.fill('solrock');
   await page.locator('#td4SearchResults [data-value="solrock"]').waitFor();
   await input.fill('hippowdon');
   await page.locator('#td4SearchResults [data-value="hippowdon"]').waitFor();
   await input.fill('');
  }
  await act(funnel);
  assert.equal(await page.locator('#td77ActiveTypes button').count(),2);
  assert.notEqual(await funnel.evaluate(e=>getComputedStyle(e).color),neutral[1]);
  await act(page.getByRole('button',{name:'Clear Psychic filter'}));
  assert.equal(await page.locator('#td77ActiveTypes button').count(),1);
  await photo(page.locator('.td77-candidate-search'),tag+'-pokemon-badges');
  await act(funnel);
  await act(page.locator('#td77TypeOptions').getByRole('button',{name:'Clear filters'}));

  await openSlot(page,2);
  assert.equal(await tile(page,2).locator('.td42-mon-pair img').count(),1);
  const move=page.locator('#td41MoveSlots [data-td77-planned-move="water-gun"]');
  await act(move.locator('[data-td78-open-move]'));
  const shell=move.locator('.td78-editor-shell');
  assert.ok(await shell.locator('input').evaluate(e=>e!==document.activeElement));
  const moveFunnel=shell.getByRole('button',{name:'Move filters'});
  await act(moveFunnel);
  const movePanel=shell.locator('.td78-move-filter-panel');
  for(const name of ['Water','Normal','Physical','Special'])await act(movePanel.getByRole('button',{name,exact:true}));
  const category=movePanel.locator('.td78-move-classes');
  const categories=await category.locator('button').evaluateAll(rows=>rows.map(e=>e.getBoundingClientRect().toJSON()));
  assert.ok(categories.every(r=>r.top===categories[0].top));
  assert.ok((await box(category)).top>=(await box(movePanel.locator('.td72-move-types'))).bottom);
  assert.equal(await movePanel.getByRole('button',{name:'Fairy'}).count(),0);
  await shell.locator('[data-td45-pick="aqua-tail"]').waitFor();
  await shell.locator('[data-td45-pick="hydro-pump"]').waitFor();
  await photo(shell,tag+'-move-filters');
  await act(moveFunnel);
  assert.equal(await shell.locator('.td78-move-badges button').count(),4);
  if(width===360&&!light){
   await act(shell.getByRole('button',{name:'Checker',exact:true}));
   await page.locator('#td68MoveResult .td64-move-back').click();
   await shell.waitFor();
   assert.equal(await shell.locator('.td78-move-badges button').count(),4);
  }

  await page.evaluate(()=>takDexMapsV73.open('Black 2','Aspertia City'));
  await page.locator('#mapsContent').waitFor();
  const toolbar=page.locator('#mapsPage .td73-map-toolbar');
  const regular=await Promise.all([box(toolbar),box(page.locator('#mapsDetails'))]);
  assert.ok(Math.abs(regular[0].left-regular[1].left)<1&&Math.abs(regular[0].right-regular[1].right)<1,JSON.stringify(regular));
  await act(page.locator('#mapsFullscreen'));
  const full=page.locator('#td76FullMapDetails');
  await full.waitFor();
  const rects=await Promise.all([box(toolbar.locator('span').last()),box(full)]);
  assert.ok(Math.abs(rects[0].left-rects[1].left)<1&&Math.abs(rects[0].right-rects[1].right)<1,JSON.stringify(rects));
  if(evidence)await page.screenshot({path:`${evidence}/${tag}-fullscreen-map.png`});
  await act(page.locator('#mapsFullscreen'));
  await act(page.locator('#moreTab'));
  await act(page.locator('#td68OpenMove'));
  await page.locator('#td68MoveInput').fill('Earthquake');
  await act(page.locator('[data-td68-select="earthquake"]'));
  await page.locator('#td68MoveResult h2').filter({hasText:'Earthquake'}).waitFor();
  assert.equal(await page.locator('#td68MoveResult .td64-move-back').count(),0);
  assert.deepEqual(errors,[]);
  console.log(tag+' · paired artwork, 3 controls, filters, Eevee selector, maps and Move Checker');
 }finally{await page.close();}
}
async function recommendations(browser){
 const party=[
  [504,'patrat',['normal'],['tackle','leer','bide']],
  [509,'purrloin',['dark'],['scratch','growl','assist']],
  [58,'growlithe',['fire'],['ember','bite','leer']],
  [54,'psyduck',['water'],['water-gun','scratch','tail-whip']],
  [519,'pidove',['normal','flying'],['gust','growl','quick-attack']]
 ];
 const team={id,game,name:'RC2 recommendations',pokemon:party.map(([id,name,types,moves])=>({id,name,types,moves,level:24}))};
 const plan={game,mode:'during',slots:party.map(([id,name,types,moves])=>pokemon(id,name,types,moves,{originName:name,locked:name==='pidove'}))};
 const page=await config(browser,412,false,{team,plan});
 try{
  await planner(page);
  await page.waitForFunction(()=>!document.querySelector('#td77ImprovementSummary').textContent.includes('Checking improvements'),null,{timeout:45000});
  const recs=page.locator('#td77Improvements .td78-category');
  const proposed=await recs.nth(1).locator('details').evaluateAll(nodes=>nodes.map(el=>[
   el.querySelector('summary').textContent,el.querySelector('[data-score]')?.dataset.score]));
  console.log('During recommendations',JSON.stringify(proposed));
  if(process.env.TAKDEX_BASELINE)return;
  for(const name of ['Patrat','Purrloin','Growlithe'])assert.ok(proposed.some(([text])=>text.startsWith(name+' · Add ')),JSON.stringify(proposed));
  assert.ok(!proposed.some(([text])=>text.startsWith('Pidove')));
  const suggestions=await recs.first().locator('.td772-team-proposal').evaluateAll(nodes=>nodes.map(el=>[
   el.querySelector('summary').textContent,el.dataset.score]));
  assert.ok(suggestions.some(([text])=>/Slot 6/.test(text)),JSON.stringify(suggestions));
  assert.ok(suggestions.some(([text])=>/Patrat.*→/.test(text)),JSON.stringify(suggestions));
  console.log('Team slots',JSON.stringify(suggestions));
  assert.equal((await saved(page)).slots[5],null);
  await page.locator('#td77Availability').selectOption('start');
  await page.waitForFunction(()=>!document.querySelector('#td77ImprovementSummary').textContent.includes('Checking improvements'),null,{timeout:30000});
  const early=await recs.nth(1).locator('summary').allTextContents();
  assert.ok(!early.some(text=>/Surf|Thunderbolt|Ice Beam|Fire Blast/.test(text)),JSON.stringify(early));
  await page.locator('#td77Availability').selectOption('badge-6');
  await page.waitForFunction(()=>!document.querySelector('#td77ImprovementSummary').textContent.includes('Checking improvements'),null,{timeout:30000});
  await recs.nth(1).getByText(/Psyduck.*Surf/).waitFor({state:'attached'});
  await selectStage(page,'final');
  assert.ok(!(await recs.nth(1).locator('summary').allTextContents()).some(text=>/→ Cut/.test(text)));
 }finally{await page.close();}
}
async function finalMoves(browser){
 const party=[
  [571,'zoroark',['dark'],['u-turn','dark-pulse','flamethrower','nasty-plot']],
  [196,'espeon',['psychic'],['signal-beam','psychic','shadow-ball','calm-mind']],
  [504,'patrat',['normal'],['tackle']]
 ];
 const team={id,game,name:'Final HM fixture',pokemon:party.map(([id,name,types,moves])=>({id,name,types,moves,level:60}))};
 const plan={game,mode:'final',deadline:'pre-league',slots:party.map(([id,name,types,moves])=>pokemon(id,name,types,moves,{originName:name,locked:name==='patrat'}))};
 const page=await config(browser,412,false,{team,plan});
 try{
  await planner(page);
  await page.waitForFunction(()=>!document.querySelector('#td77ImprovementSummary').textContent.includes('Checking improvements'),null,{timeout:45000});
  const proposed=await page.locator('#td77Improvements .td78-category').nth(1).locator('summary').allTextContents();
  assert.ok(!proposed.some(text=>/→ Cut|Patrat/.test(text)),JSON.stringify(proposed));
  await openSlot(page,2);
  const suggestions=page.locator('#td5TeamOptimize > summary');
  if(await suggestions.isVisible()){
   await act(suggestions);
   await page.locator('#td5TeamProposals').getByText('No verified move upgrade for this deadline.').waitFor();
  }
  console.log('Final excluded weaker Cut replacements; locked Patrat produced no move proposal.');
 }finally{await page.close();}
}
async function acquisition(browser){
 const page=await config(browser,412,false,seed);
 try{
  await planner(page);await openSlot(page,3);
  await page.locator('#td4Search').fill('claydol');
  await act(page.locator('#td4SearchResults [data-value="claydol"]'));
  const preview=page.locator('#td63ManualCandidate');
  await act(preview.locator('.td78-route-picker > summary'));
  await act(preview.getByRole('button',{name:'Obtain Baltoy',exact:true}).first());
  await act(preview.getByText('Acquisition details',{exact:true}));
  const route=preview.locator('.td774-route-details');
  const text=await route.innerText();
  assert.match(text,/Baltoy → Claydol \(Lv\. 36\)/);
  assert.doesNotMatch(text,/Level 36/);
  assert.match(text,/Relic Castle/);
  assert.match(text,/27–30/);
  assert.match(text,/Relic Passage/);
  const location=route.locator('[data-td74-dex-map="Relic Castle"]');
  await act(location);
  await page.waitForFunction(()=>document.querySelector('#mapsCanvas svg')?.dataset.selection==='relic-castle');
  console.log('Claydol used one evolution level, preserved the wild-level range and linked Relic Castle.');
 }finally{await page.close();}
}
async function identity(browser){
 const party=(pid,level)=>({id:54,name:'psyduck',types:['water'],level,saveStats:{pid},moves:['water-gun']});
 const team={id,game,name:'Duplicate identity fixture',pokemon:[party(23,20),party(6299,20)]};
 const plan={game,mode:'during',slots:[
  pokemon(54,'psyduck',['water'],['water-gun'],{explicitOwned:true,originPid:23}),
  pokemon(54,'psyduck',['water'],['scratch'],{explicitOwned:true,originPid:6299})
 ]};
 const page=await config(browser,412,false,{team,plan});
 try{
  await planner(page);
  await openSlot(page,0);
  const apply=async (sequence,ids)=>{
   const roster=ids.map((pid,i)=>({species:54,pid,move:i?10:55,ability:6,item:0}));
   const bytes=Array.from(makeSave(23,sequence,30,{mask:7},roster));
   const result=await page.evaluate(({id,bytes})=>takDexSaveSync.synchronize({teamId:id,bytes:new Uint8Array(bytes)}),{id,bytes});
   assert.equal(result,'updated');
  };
  await apply(31,[6299,23]);
  await page.locator('#td41MoveSlots [data-td77-actual-move="scratch"]').waitFor();
  await openSlot(page,1);
  await page.locator('#td41MoveSlots [data-td77-actual-move="water-gun"]').waitFor();
  await apply(32,[23,23]);
  await openSlot(page,0);
  assert.equal(await page.locator('#td41MoveSlots [data-td77-actual-move="scratch"],#td41MoveSlots [data-td77-actual-move="water-gun"]').count(),0);
  await openSlot(page,1);
  assert.equal(await page.locator('#td41MoveSlots [data-td77-actual-move="scratch"],#td41MoveSlots [data-td77-actual-move="water-gun"]').count(),0);
  assert.deepEqual((await saved(page)).slots.slice(0,2).map(p=>p.originPid),[23,6299]);
  console.log('Distinct identical-species IDs followed their Pokémon after reorder; duplicate PID stayed unassigned.');
 }finally{await page.close();}
}
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  if(process.env.TAKDEX_FOCUS==='recommendations'){await recommendations(browser);return;}
  if(process.env.TAKDEX_FOCUS==='final'){await finalMoves(browser);return;}
  if(process.env.TAKDEX_FOCUS==='acquisition'){await acquisition(browser);return;}
  if(process.env.TAKDEX_FOCUS==='identity'){await identity(browser);return;}
  for(const width of process.env.TAKDEX_WIDTH?[Number(process.env.TAKDEX_WIDTH)]:[360,412])for(const light of [false,true])await ui(browser,width,light);}
 finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
