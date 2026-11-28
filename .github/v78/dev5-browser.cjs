const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const {chromium}=require('playwright-core');
const url=process.argv[2]||'http://127.0.0.1:8919';
const evidence=process.env.TAKDEX_EVIDENCE;
const reference=process.env.TAKDEX_DESIGN;
const key='takdex-v78-state-v1',game='Black 2',id='dev5',planKey=game+':'+id;
const entries=names=>names.map(move=>({move,purpose:'keep'}));
const mon=(id,name,types,moves,extra={})=>({id,name,types,level:27,moves,plannedMoves:entries(moves),duringMoves:entries(moves),...extra});
const pikachu=mon(25,'pikachu',['electric'],['thunder-shock','quick-attack'],{originName:'pikachu',explicitOwned:true,locked:true});
const eevee=mon(133,'eevee',['normal'],['tackle','bite'],{originPid:101});
const psyduck=mon(54,'psyduck',['water'],['water-gun','scratch','tail-whip'],{originPid:103});
const espeon=mon(196,'espeon',['psychic'],['confusion'],{originPid:102,duringTargetId:133,duringSpecies:'eevee',
 acquisitionRoute:{id:'133|owned|102',startId:133}});
const catchPlan=mon(55,'golduck',['water'],['water-gun'],{confirmedCandidate:true,fulfilledPid:900,fulfilledStage:54,
 acquisitionRoute:{id:'54|owned|900',startId:54}});
const team={id,game,name:'DEV5 fixture',pokemon:[pikachu,{...eevee,saveStats:{pid:101}},{...psyduck,saveStats:{pid:103}},{...eevee,saveStats:{pid:102}},
 {...mon(54,'psyduck',['water'],['water-gun']),saveStats:{pid:900}}]};
const plan={game,mode:'final',deadline:'badge-6',slots:[null,eevee,psyduck,espeon,catchPlan,mon(504,'patrat',['normal'],['tackle'],{confirmedCandidate:true})],independentSlots:{0:{during:pikachu}}};
const rect=loc=>loc.evaluate(e=>e.getBoundingClientRect().toJSON());
const saved=page=>page.evaluate(({key,planKey})=>JSON.parse(localStorage.getItem(key)).plans[planKey].value,{key,planKey});
async function act(locator){await locator.evaluate(e=>e.scrollIntoView({block:'center'}));await locator.click();}
async function photo(locator,name){
 if(!evidence)return;
 await fs.mkdir(evidence,{recursive:true});
 await locator.evaluate(e=>e.scrollIntoView({block:'center'}));
 for(let i=0;i<3;i++)try{await locator.screenshot({path:evidence+'/'+name+'.png'});return;}catch(error){
  if(i===2||!error.message.includes('not attached'))throw error;
 }
}
async function openSlot(page,i){const target=page.locator(`#td4Slots [data-td4-slot="${i}"]`);if(await target.getAttribute('aria-expanded')!=='true')await act(target);}
async function checkUI(browser,width,light){
 const page=await browser.newPage({viewport:{width,height:890},isMobile:true,hasTouch:true,
  reducedMotion:'reduce',ignoreHTTPSErrors:true,serviceWorkers:'block'});
 const tag=width+'-'+(light?'light':'dark'),errors=[];
 page.setDefaultTimeout(18000);
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(({light,key,team,plan,planKey})=>{
  if(!localStorage.getItem(key)){
   localStorage.setItem('poketact-teams',JSON.stringify([team]));
   localStorage.setItem('takdex-v74-playthrough-plans',JSON.stringify({[planKey]:plan}));
  }
  if(light)document.addEventListener('DOMContentLoaded',()=>document.body.classList.add('light'),{once:true});
 },{light,key,team,plan,planKey});
 try{
  if(reference&&evidence){
   await page.setContent(await fs.readFile(reference,'utf8'));
   if(light)await page.locator('.theme').click();
   await photo(page.locator('.dialog'),tag+'-reference');
  }
  await page.goto(url);
  const entry=page.locator(`[data-td41-team-plan="${id}"]`);
  if(!await entry.isVisible())await act(page.locator(`[data-td71-toggle="${id}"]`));
  await act(entry);
  await openSlot(page,0);
  const untouched=(await saved(page)).independentSlots[0].during;
  const actualTeam=()=>page.evaluate(({key,id})=>JSON.parse(localStorage.getItem(key)).teams[id].value,{key,id});
  const beforeTeam=await actualTeam();
  await act(page.getByRole('button',{name:'Keep Pikachu',exact:true}));
  await page.waitForFunction(({key,planKey})=>!!JSON.parse(localStorage.getItem(key)).plans[planKey].value.slots[0]?.plannedMoves.some(move=>move.move),{key,planKey});
  const state=await saved(page);
  assert.equal(state.slots[0].name,'pikachu');
  assert.deepEqual(state.independentSlots[0].during,untouched);
  assert.deepEqual(await actualTeam(),beforeTeam);
  const pik=page.locator('#td4Slots [data-td4-slot="0"]');
  assert.equal(await pik.locator('img').count(),1);
  assert.equal(await pik.locator('.td78-stage-label').count(),0);
  assert.equal(await page.getByRole('button',{name:'Keep Pikachu',exact:true}).count(),0);
  const settings=page.locator('#td4Edit > details.td42-settings').first();
  if(!await settings.evaluate(el=>el.open))await act(settings.locator('summary'));
  const selected=page.locator('#td63ManualCandidate .td773-candidate-meta');
  await selected.getByRole('button',{name:'Remove'}).waitFor();
  assert.ok((await rect(selected.getByRole('button',{name:'Remove'}))).bottom<=(await rect(selected.getByText(/BST \d+/))).top);
  assert.doesNotMatch(await selected.innerText(),/Selected/);
  await photo(selected,tag+'-candidate-action');

  // Fulfillment guards the capture picker while still providing the path and future requirements.
  await openSlot(page,4);
  const route=page.locator('#td77SlotRoute');
  assert.match(await route.innerText(),/On team · Lv. 27/);
  assert.match(await route.innerText(),/Evolution remaining · Golduck at Lv\. 33/);
  assert.equal(await route.locator('[data-td77-route]').count(),0);
  assert.equal(await route.getByText('Selected route history').count(),0);

  await openSlot(page,5);
  assert.ok(await page.locator('#td77SlotRoute .td78-route-picker').count());
  await openSlot(page,1);
  const choose=page.locator('[data-td78-evolution]');
  await act(choose);
  const dialog=page.getByRole('dialog',{name:'Planned evolution'});
  const rows=dialog.locator('.td78-evolution-options > div');
  assert.equal(await dialog.evaluate(e=>e.scrollTop),0);
  assert.equal(await dialog.locator('a,[data-td74-dex-map]').count(),0);
  assert.ok(await rows.count()>=5);
  for(const row of await rows.all()){
   const [button,requirements]=await Promise.all([rect(row.locator('button')),rect(row.locator(':scope > div'))]);
   assert.ok(Math.abs(button.width-requirements.width)<1&&button.right<requirements.left,JSON.stringify([button,requirements]));
  }
  assert.notEqual(await rows.nth(1).evaluate(e=>getComputedStyle(e).boxShadow),'none');
  await photo(dialog,tag+'-evolution');
  await page.keyboard.press('Escape');
  await dialog.waitFor({state:'hidden'});
  assert.equal(await choose.evaluate(e=>e===document.activeElement),true);

  if(!await settings.evaluate(el=>el.open))await act(settings.locator('summary'));
  await act(page.locator('#td77TypeFilter'));
  const type=page.locator('#td77TypeOptions [data-td77-filter-type="normal"]');
  await type.waitFor();
  const buttonStyle=el=>{const s=getComputedStyle(el),r=el.getBoundingClientRect();return [r.height,r.width,s.fontSize,s.padding,s.textAlign,s.opacity]};
  const pokemonClear=await page.locator('#td77TypeOptions [data-td78-clear-filters]').evaluate(buttonStyle);
  const pokemonFilter=await rect(type);
  assert.equal(pokemonFilter.height,30);
  assert.doesNotMatch(await page.locator('#td77TypeOptions').innerText(),/\d+ selected/);
  await photo(page.locator('#td77TypeOptions'),tag+'-pokemon-filter');
  if(width===360&&!light){
   const search=page.locator('#td4Search'),results=page.locator('#td4Candidates');
   await act(page.locator('#td77TypeFilter'));
   await page.waitForFunction(()=>document.querySelector('#td4Candidates').offsetHeight>innerHeight);
   await search.fill('pi');
   await results.evaluate(el=>window.scrollBy(0,el.getBoundingClientRect().top+220));
   const up=page.locator('#td79SearchReturn');
   await up.waitFor();
   await up.click();
   await up.waitFor({state:'hidden'});
   assert.equal(await search.inputValue(),'pi');
   assert.equal(await search.evaluate(el=>el===document.activeElement),false);
   await act(choose);
   assert.equal(await dialog.evaluate(e=>e.scrollTop),0);
   await dialog.getByRole('button',{name:'Vaporeon',exact:true}).click();
   await page.waitForFunction(({key,planKey})=>JSON.parse(localStorage.getItem(key)).plans[planKey].value.slots[1]?.name==='vaporeon',{key,planKey});
   await page.locator('#td77SlotRoute [data-td74-dex-map="Route 19"]').first().waitFor({state:'attached'});
  }
  await openSlot(page,2);
  const move=page.locator('#td41MoveSlots [data-td77-planned-move="water-gun"]');
  const toggle=move.locator('[data-td78-open-move]'),wrapper=move.locator('.td77-edit-move');
  await toggle.waitFor({state:'attached'});
  assert.ok(Math.abs((await rect(toggle)).width-(await rect(wrapper)).width)<=2);
  await act(toggle);
  const shell=move.locator('.td78-editor-shell');await shell.waitFor();
  await act(shell.getByRole('button',{name:'Move filters'}));
  const moveType=page.locator('.td78-move-filter-panel [data-td78-move-type="normal"]:visible');
  assert.equal((await rect(moveType)).height,pokemonFilter.height);
  assert.deepEqual(await shell.locator('[data-td78-clear-filters]').evaluate(buttonStyle),pokemonClear);
  await photo(shell.locator('.td78-move-filter-panel'),tag+'-move-filter');
  await act(toggle);
  assert.equal(await shell.isVisible(),false);
  assert.equal(await toggle.getAttribute('aria-expanded'),'false');
  await act(toggle);await shell.waitFor();
  assert.equal(await shell.locator('input').evaluate(e=>e===document.activeElement),false);
  if(width===360&&!light){
   if(await shell.getByRole('button',{name:'Move filters'}).getAttribute('aria-expanded')!=='true')await act(shell.getByRole('button',{name:'Move filters'}));
   await act(shell.locator('[data-td78-move-type="water"]'));
   await act(shell.getByRole('button',{name:'Move filters'}));
   await act(shell.getByRole('button',{name:'Checker',exact:true}));
   await page.locator('#td68MoveResult .td64-move-back').click();
   await shell.waitFor();
   assert.equal(await shell.locator('.td78-move-badges button').count(),1);
   assert.equal(await shell.locator('input').evaluate(e=>e===document.activeElement),false);
  }

  if(width===360&&!light){
   const teamRecs=page.locator('#td77Improvements .td772-team-proposal .td82-base-stats').first();
   await teamRecs.waitFor({state:'attached'});
   assert.equal(await teamRecs.locator('tbody tr').count(),7);
   assert.equal(await page.locator('#td63ManualCandidate .td774-stat-tiles,#td63ManualCandidate .td82-base-stats').count(),0);
  }
  const pair=page.locator('#td4Slots [data-td4-slot="3"] .td42-mon-pair');
  assert.equal(await pair.locator('img').count(),2);
  await pair.getByText('Friendship',{exact:true}).waitFor();
  await photo(pair,tag+'-paired-artwork');
  assert.ok(await pair.evaluate(el=>[...el.querySelectorAll('.pill,strong')].every(child=>{
   const a=child.getBoundingClientRect(),b=el.getBoundingClientRect();
   return a.left>=b.left-1&&a.right<=b.right+1;
  })));
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);

  await page.evaluate(()=>takDexMapsV73.open('Black 2','Aspertia Gym · Basic Badge'));
  await page.locator('#mapsContent').waitFor();
  assert.equal(await page.locator('#mapsZoomValue').count(),0);
  const battleAction=page.locator('#mapsDetails [data-td73-gym-trainer]');
  const surface=await battleAction.evaluate(e=>({fill:getComputedStyle(e).backgroundColor,accent:getComputedStyle(e).getPropertyValue('--accent').trim(),neutral:getComputedStyle(e).color}));
  assert.ok(surface.fill.startsWith('color(srgb')&&surface.accent&&surface.neutral);
  await act(page.locator('#mapsFullscreen'));
  assert.equal(await page.locator('#mapsZoomValue').count(),0);
  await act(page.locator('#mapsFullscreen'));
  await act(page.locator('#moreTab'));await act(page.locator('#td59OpenOffline'));
  await page.locator('#td59Game').selectOption('Black 2');
  await page.locator('#td59State').getByText(/Not downloaded/).waitFor();
  assert.deepEqual(await page.locator('#td59Legend li span:last-child').allTextContents(),['Downloaded','Partial download','Not downloaded']);
  assert.equal((await rect(page.locator('#td59Download'))).height,(await rect(page.locator('#td59Delete'))).height);
  await photo(page.locator('#td59OfflinePage'),tag+'-offline');
  assert.deepEqual(errors,[]);
  console.log(tag+' · Keep, capture history, equal filters, full move hit area, selector geometry and map controls passed');
 }finally{await page.close();}
}
async function coverageAndFeedback(browser){
 const page=await browser.newPage({serviceWorkers:'block'});
 try{
  await page.goto(url);
  const key='takdex-reference-v58-black-2';
  const cacheKey=new URL('takdex-reference-v58/black-2.json',url).href;
  await page.evaluate(async({key,cacheKey})=>{
   const cache=await caches.open(key);
   await cache.put(cacheKey,new Response(JSON.stringify({schema:58,game:'Black 2',complete:true,machines:[{item:'tm01',move:'hone-claws'}]})));
  },{key,cacheKey});
  const inventory=()=>page.evaluate(()=>takDexCoverageV79.inventory());
  const rows=await inventory();
  assert.equal(rows.length,34);assert.equal(new Set(rows.map(row=>row.game)).size,34);
  for(const row of rows)assert.ok(row.group&&row.downloadedReference&&row.downloadedEncounter);
  const b2=rows.find(row=>row.game==='Black 2');
  assert.equal(b2.encounter.rows,3850);assert.equal(b2.encounter.groups,1566);
  assert.ok(b2.machines.count>90);assert.match(b2.machines.source,/Bundled/);
  assert.match(b2.downloadedReference,/Missing/);assert.ok(b2.shared.includes('White 2'));
  assert.ok(b2.totals.variants>b2.totals.trainers&&b2.totals.moves>0&&b2.totals.items>0&&b2.totals.abilities>0);
  assert.equal(rows.find(row=>row.game==='Scarlet').encounter.rows,0);
  assert.match(rows.find(row=>row.game==='Emerald').maps.source,/Hoenn/);
  await page.evaluate(key=>caches.delete(key),key);
  assert.equal((await inventory()).find(row=>row.game==='Black 2').downloadedReference,'No download');
  await page.locator('#moreTab').click();
  await page.locator('#td70OpenAbout').click();
  await page.getByRole('button',{name:/Database Coverage/}).click();
  await page.locator('.td68-coverage-row').last().waitFor();
  assert.equal(await page.locator('.td68-coverage-row').count(),34);
  await page.locator('#moreTab').click();
  let submission='';
  await page.route('https://formspree.io/f/dev5fixture',route=>{
   submission=route.request().postData()||'';
   return route.fulfill({status:200,contentType:'application/json',body:'{}'});
  });
  await page.evaluate(()=>{window.TAKDEX_FEEDBACK_FORM_ID='dev5fixture';});
  await page.locator('#td7FeedbackOpen').click();
  await page.locator('#td7FeedbackDialog textarea').fill('Local intercepted verification');
  await page.locator('#td7FeedbackSubmit').click();
  await page.getByText('Feedback sent. Thank you!').waitFor();
  assert.match(submission,/V78 DEV5 RC2/);
  let requests=0;
  await page.route('https://pokeapi.co/api/v2/ability/static',async route=>{
   requests++;
   await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({id:9,name:'static',effect_entries:[]})});
  });
  await page.evaluate(()=>Promise.all([api('ability/static'),api('/ability/static/'),api('ability/static')]));
  assert.equal(requests,1);
  const ranking=await page.evaluate(()=>td78SearchMatches(['mega-drain','drain-punch','dragon','dragon-breath','withdraw'],'Dra'));
  assert.deepEqual(ranking,['dragon','dragon-breath','drain-punch','mega-drain','withdraw']);
  console.log('34 coverage models, absent/shared/removed/invalid sources, mocked feedback version, and coalesced fallback/search ranking passed.');
 }finally{await page.close();}
}
async function packs(browser){
 const p=await browser.newPage({serviceWorkers:'block'});
 try{
  await p.goto(url);await p.locator('#moreTab').click();await p.locator('#td59OpenOffline').click();
  const pick=async (game,label)=>{
   await p.locator('#td59Game').selectOption(game);
   await p.locator('#td59State').getByText(label,{exact:false}).waitFor();
  };
  const seed=async phase=>p.evaluate(async phase=>{
   const base='https://pokeapi.co/api/v2/',sprites='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';
   const cache=await caches.open('takdex-reference-v58-red');
   const meta=new URL('takdex-reference-v58/red.json',location.href).href;
   const put=(key,data)=>cache.put(key,new Response(JSON.stringify(data)));
   if(phase==='stale'){
    await put(meta,{schema:58,game:'Red',complete:true,machines:[]});
    await cache.put(base+'pokemon/1/',new Response('corrupt'));return;
   }
   if(phase==='remove-dependency'){await cache.delete(base+'evolution-chain/1/');return;}
   const enc=await caches.open('takdex-encounter-catalog-v55');
   const art=await caches.open('takdex-artwork-v60-red');
   await put(meta,{schema:58,game:'Red',complete:false,machines:[{item:'tm01',move:'mega-punch'}]});
   for(const kind of ['pokemon','pokemon-species','move','evolution-chain']){
    await put(base+kind+'?limit='+(kind==='evolution-chain'?1000:2000),{count:1,results:[{name:'fixture',url:base+kind+'/1/'}]});
   }
   const tasks=[];
   for(let id=1;id<=151;id++){
    tasks.push(put(base+'pokemon/'+id+'/',{id,name:'fixture',species:{name:'fixture'},types:[{type:{name:'normal'}}],
     stats:Array(5).fill({stat:{name:'hp'},base_stat:30}),moves:[]}));
    tasks.push(put(base+'pokemon-species/'+id+'/',{id,name:'fixture',evolution_chain:{url:base+'evolution-chain/1/'}}));
    for(const file of [id+'.png','other/official-artwork/'+id+'.png'])
     tasks.push(art.put(sprites+file,new Response('fixture',{headers:{'Content-Type':'image/png'}})));
   }
   tasks.push(put(base+'evolution-chain/1/',{id:1,chain:{species:{name:'fixture'},evolves_to:[]}}));
   tasks.push(enc.put(new URL('takdex-encounters-v55/blue.json',location.href).href,
    new Response(JSON.stringify({schema:65,game:'Blue',records:1,hasSource:true,mons:[[1,'fixture',['normal']]],entries:{1:[['route-1','walk',2,3]]}}))));
   await Promise.all(tasks);
  },phase);
  await seed('stale');await pick('Red','Not downloaded');
  await seed('complete');await pick('Blue','🟢 Downloaded');
  assert.equal(await p.locator('#td59Download').isDisabled(),true);
  await seed('remove-dependency');await pick('Yellow','Partial download');await pick('Blue','Partial download');
  assert.equal(await p.locator('#td59Download').isDisabled(),false);
  assert.ok(await p.evaluate(async()=>!!await (await caches.open('takdex-reference-v58-red')).match('https://pokeapi.co/api/v2/pokemon/1/')));
  console.log('Absent, stale, shared complete and missing-dependency partial pack states passed.');
 }finally{await p.close();}
}
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  if(process.env.TAKDEX_FOCUS==='packs'){await packs(browser);return;}
  if(process.env.TAKDEX_FOCUS==='coverage'){await coverageAndFeedback(browser);return;}
  for(const width of process.env.TAKDEX_WIDTH?[Number(process.env.TAKDEX_WIDTH)]:[360,412])
   for(const light of [false,true])await checkUI(browser,width,light);
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
