const assert=require('node:assert/strict');
const {mkdir}=require('node:fs/promises');
const {execFileSync}=require('node:child_process');
const {chromium}=require('playwright-core');

const url=process.argv[2]||'http://127.0.0.1:8914';
const evidence=process.env.TAKDEX_EVIDENCE;
const fixtureOnly=process.argv.includes('--baseline');
const game='Black 2',id='dev3',planKey=game+':'+id;
const move=name=>({move:name,purpose:'keep'});
const seed={
 team:{id,name:'DEV3 browser',game,pokemon:[
  {id:498,name:'tepig',types:['fire'],level:24,moves:[{name:'Flame Wheel'}]}
 ]},
 plan:{game,deadline:'pre-league',mode:'final',slots:[
  {id:523,name:'zebstrika',types:['electric'],confirmedCandidate:true,
   acquisitionRoute:{id:'523|dark-grass|Route 7|34|36',startId:523},plannedMoves:[move('spark')]},
  {id:510,name:'liepard',types:['dark'],confirmedCandidate:true,duringTargetId:509,duringSpecies:'purrloin',
   acquisitionRoute:{id:'509|link trade||0|0',startId:509},duringMoves:[move('scratch'),move('growl')],
   plannedMoves:[move('sucker-punch'),move('cut')],finalManualSlots:[true,true]}
 ]}
};

async function snapshot(page,name,area){
 if(!evidence)return;
 await mkdir(evidence,{recursive:true});
 if(area)await area.screenshot({path:evidence+'/'+name+'.png'});
 else await page.screenshot({path:evidence+'/'+name+'.png'});
}
async function ui(browser,width,light){
 const mobile=width<720,sample=width+'-'+(light?'light':'dark');
 const page=await browser.newPage({viewport:{width,height:900},isMobile:mobile,hasTouch:mobile,
  reducedMotion:'reduce',ignoreHTTPSErrors:true,serviceWorkers:'block'});
 page.setDefaultTimeout(15000);
 const errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 page.on('dialog',dialog=>dialog.accept());
 const activate=locator=>mobile?locator.tap():locator.click();
 await page.addInitScript(({seed,planKey,light})=>{
  if(!localStorage.getItem('takdex-v78-state-v1')){
   localStorage.setItem('poketact-teams',JSON.stringify([seed.team]));
   localStorage.setItem('takdex-v74-playthrough-plans',JSON.stringify({[planKey]:seed.plan}));
  }
  if(light)document.addEventListener('DOMContentLoaded',()=>document.body.classList.add('light'),{once:true});
 },{seed,planKey,light});
 await page.goto(url,{waitUntil:'domcontentloaded'});
 const tile=i=>page.locator('#td4Slots [data-td4-slot="'+i+'"]');
 const openSlot=async i=>{if(await tile(i).getAttribute('aria-expanded')!=='true')await activate(tile(i));};
 const state=()=>page.evaluate(planKey=>JSON.parse(localStorage.getItem('takdex-v78-state-v1')).plans[planKey].value,planKey);
 const widthCheck=async()=>assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
 const ruler=(page,selectors)=>page.evaluate(selectors=>selectors.map(sel=>document.querySelector(sel).getBoundingClientRect().toJSON()),selectors);
 const toggle=page.locator('[data-td71-toggle="dev3"]');
 const planner=page.locator('[data-td41-team-plan="dev3"]');
 if(!await planner.isVisible())await activate(toggle);
 await activate(planner);
 await page.locator('#td4Slots [data-td4-slot="1"]').waitFor();

 await openSlot(0);
 const picker=page.locator('#td77SlotRoute .td78-route-picker');
 await picker.locator('summary').waitFor();
 await activate(picker.locator('summary'));
 const inset=picker.locator('.td78-route-options');
 const route=area=>inset.locator('.td78-route-area').filter({has:page.locator('[data-td74-dex-map="'+area+'"]')});
 for(const [area,methods] of [['Route 7',/Walk, Dark Grass/],['Route 3',/Walk, Dark Grass, Hidden Grotto/]]){
  assert.match(await route(area).innerText(),methods);
  assert.equal(await route(area).locator('button[data-td77-route]').count(),1);
 }
 assert.equal(await picker.locator('button[data-td77-route]').filter({hasText:/^(Walk|Dark Grass|Hidden Grotto)$/}).count(),0);
 assert.equal(await inset.evaluate(el=>getComputedStyle(el).backgroundColor),
  await page.locator('#td77SlotRoute .td774-route-choice').evaluate(el=>getComputedStyle(el).backgroundColor));
 const paddings=await page.evaluate(()=>['#td77SlotRoute summary','#td77FinalForm .td78-evolution-control'].map(sel=>getComputedStyle(document.querySelector(sel)).paddingInlineStart));
 assert.equal(paddings[0],paddings[1]);
 await snapshot(page,sample+'-acquisition',picker);
 await widthCheck();

 const beforeRoute=(await state()).slots[0].acquisitionRoute.id;
 assert.equal(await route('Route 7').locator('button[data-td77-route]').getAttribute('data-route-id'),beforeRoute);
 assert.equal(await route('Route 7').locator('button[data-td77-route]').getAttribute('aria-pressed'),'true');
 await activate(route('Route 3').locator('[data-td74-dex-map]'));
 await page.locator('#mapsPage').waitFor();
 const actions=page.locator('#mapsFullscreen').locator('..');
 const back=actions.getByRole('button',{name:'Back',exact:true});
 assert.equal(await page.locator('#mapsPage').getByRole('button',{name:'Back',exact:true}).count(),1);
 await page.waitForFunction(()=>document.querySelector('#mapsCanvas svg')?.dataset.selection?.toLowerCase().includes('route-3'));
 const buttons=await ruler(page,['#mapsFullscreen','#mapsZoomOut','#mapsZoomIn','#mapsClearSelection','#mapsZoomReset','#backMaps']);
 assert.ok(buttons.every(rect=>rect.top===buttons[0].top&&rect.height===buttons[0].height),JSON.stringify(buttons));
 const surface=await page.locator('#mapsFullscreen').evaluate(el=>getComputedStyle(el).backgroundColor);
 assert.equal(surface.startsWith('color(srgb 0.9'),light,surface);
 const row=await actions.boundingBox();
 assert.ok(Math.abs(row.x+row.width-buttons.at(-1).right)<=1);
 await snapshot(page,sample+'-map-toolbar',page.locator('.td73-map-toolbar'));
 await widthCheck();
 if(process.env.TAKDEX_FOCUS==='toolbar'){console.log(sample+': linked Back geometry and toolbar theme passed');await page.close();return;}
 if(width===412){
  await activate(page.locator('#mapsFullscreen'));
  await page.locator('#mapsPage.td63-map-full').waitFor();
  assert.equal(await back.count(),1);
 }
 await activate(back);
 await inset.waitFor();
 assert.equal((await state()).slots[0].acquisitionRoute.id,beforeRoute);
 const path3=route('Route 3').getByRole('button',{name:'Obtain Zebstrika directly'});
 const exact=await path3.getAttribute('data-route-id');
 await activate(path3);
 await page.waitForFunction(([key,exact])=>JSON.parse(localStorage.getItem('takdex-v78-state-v1')).plans[key].value.slots[0].acquisitionRoute.id===exact,[planKey,exact]);
 // The lower-level earlier trade remains a separate selectable route.
 await activate(picker.locator('summary'));
 const trade=inset.getByRole('button',{name:/Trade Blitzle/});
 await activate(trade);
 await page.waitForFunction(key=>JSON.parse(localStorage.getItem('takdex-v78-state-v1')).plans[key].value.slots[0].acquisitionRoute.id==='522|link trade||0|0',planKey);

 await openSlot(1);
 const rowMove=page.locator('#td41MoveSlots [data-td77-planned-move="sucker-punch"]');
 await activate(rowMove.locator('[data-td78-open-move]'));
 const shell=rowMove.locator('.td78-editor-shell'),search=shell.locator('input');
 const funnel=shell.getByRole('button',{name:'Move filters'});
 assert.equal(await search.evaluate(el=>el===document.activeElement),false);
 await activate(funnel);
 const panel=shell.locator('.td78-move-filter-panel');
 await activate(panel.getByRole('button',{name:'Dark',exact:true}));
 await activate(panel.getByRole('button',{name:'Physical',exact:true}));
 await search.fill('s');
 const suggestion=shell.locator('.td79-move-choice').filter({has:page.locator('[data-td45-pick="assurance"]')});
 const details=suggestion.getByRole('button',{name:'Open Assurance in Move Checker'});
 const replace=suggestion.getByRole('button',{name:'Select Assurance'});
 await details.waitFor();
 const dims=await shell.evaluate(el=>{
  const r=el.getBoundingClientRect(),select=s=>el.querySelector(s).getBoundingClientRect();
  const input=select('input'),filter=select('.td772-filter-button'),panel=select('.td78-move-filter-panel'),actions=select('.td78-move-actions');
  return {inside:input.left>r.left&&filter.right<r.right&&input.top>r.top&&actions.bottom<r.bottom,
   aligned:input.top===filter.top&&input.height===filter.height&&filter.width===44,
   ordered:input.bottom<panel.top&&panel.bottom<=actions.top};
 });
 assert.deepEqual(dims,{inside:true,aligned:true,ordered:true});
 await snapshot(page,sample+'-inline-editor',shell);
 await widthCheck();
 await activate(funnel);
 assert.match(await funnel.getAttribute('class'),/selected/);
 const stored=(await state()).slots[1];
 await details.scrollIntoViewIfNeeded();
 const scroll=await shell.evaluate(el=>({page:scrollY,list:el.querySelector('.td78-move-results').scrollTop}));
 if(mobile)await details.tap();else await details.press('Enter');
 const checker=page.locator('#td68MoveResult');
 await checker.locator('h2').filter({hasText:'Assurance'}).waitFor();
 assert.deepEqual((await state()).slots[1],stored);
 await activate(checker.locator('.td64-move-back'));
 await search.waitFor();
 assert.equal(await search.inputValue(),'s');
 assert.equal(await search.evaluate(el=>document.activeElement===el),false);
 await page.waitForFunction(scroll=>Math.abs(scrollY-scroll)<=3,scroll.page);
 assert.equal(await shell.locator('.td78-move-results').evaluate(el=>el.scrollTop),scroll.list);
 assert.equal(await funnel.getAttribute('aria-expanded'),'false');
 await activate(funnel);
 assert.equal(await panel.getByRole('button',{name:'Dark',exact:true}).getAttribute('aria-pressed'),'true');
 assert.equal(await panel.getByRole('button',{name:'Physical',exact:true}).getAttribute('aria-pressed'),'true');
 if(mobile)await replace.tap();else await replace.press('Enter');
 const downgrade=page.locator('#td78Confirmation');
 await downgrade.getByRole('button',{name:'Replace',exact:true}).click();
 await page.locator('#td41MoveSlots [data-td77-planned-move="assurance"]').waitFor();
 assert.equal(await page.locator('#td68MovePage').isVisible(),false);
 assert.deepEqual((await state()).slots[1].duringMoves,stored.duringMoves);

 await activate(page.locator('#td4Back'));
 const mon=page.locator('[data-td74-builder-team="dev3"][data-td74-builder-slot="0"]');
 if(!await mon.isVisible())await activate(toggle);
 await activate(mon);
 const profile=page.locator('#td77BuilderBattle');
 await activate(profile.locator(':scope > summary'));
 await activate(profile.locator('.td74-battle-stats > summary'));
 const stat=profile.locator('[data-td74-stat="attack"]'),reset=profile.getByRole('button',{name:'Reset manual battle stat adjustments'});
 const original=await stat.inputValue();
 await stat.fill('150');
 const [button,status]=await ruler(page,['#td77BuilderBattle [data-td74-stat-reset]','#td77BuilderBattle [data-td76-stat-source]']);
 assert.equal(button.width,32);
 assert.equal(button.height,32);
 assert.ok(status.right<=button.x-6);
 assert.equal(await reset.evaluate(el=>el.querySelector('svg').getBoundingClientRect().width),15);
 await snapshot(page,sample+'-stat-reset',profile.locator('.td75-stat-footer'));
 await activate(reset);
 assert.equal(await stat.inputValue(),original);
 await widthCheck();
 assert.deepEqual(errors,[]);
 console.log(sample+': grouped paths, independent map links, single-row Back, move name/selection targets, exact editor return, and compact stat reset passed');
 await page.close();
}

async function battle(browser){
 const page=await browser.newPage({viewport:{width:412,height:900},ignoreHTTPSErrors:true,serviceWorkers:'block'});
 await page.addInitScript(()=>{
  const game='Black 2';
  const baseStats={hp:74,attack:94,defense:131,speed:20,'special-attack':54,'special-defense':116};
  localStorage.setItem('poketact-teams',JSON.stringify([{id:'battle-test',name:'Battle test',game,pokemon:[
   {id:598,name:'ferrothorn',types:['grass','steel'],abilities:['iron-barbs','anticipation'],ability:'iron-barbs',weight:1100,baseStats,level:10,
    moves:[{name:'Gyro Ball',power:null,type:'steel',damageClass:'physical',accuracy:100,priority:0},
     {name:'Iron Head',power:80,type:'steel',damageClass:'physical',accuracy:100,priority:0}]}
  ]}]));
 });
 if(fixtureOnly){
  for(const name of ['index.html','app.js','battle-outcomes.js','v74-ux.js','maps.js','styles.css']){
   const body=execFileSync('git',['show','deadce6:'+name]);
   const contentType=name.endsWith('.js')?'application/javascript':name.endsWith('.css')?'text/css':'text/html';
   await page.route(name==='index.html'?new RegExp(url.replaceAll('.','\\.')+'/?$'):'**/'+name+'*',route=>route.fulfill({body,contentType}));
  }
 }
 await page.goto(url,{waitUntil:'domcontentloaded'});
 const info=await page.evaluate(legacy=>{
  const original=teams.find(team=>team.id==='battle-test');
  const user=original.pokemon[0];
  const baseOpponent={id:508,name:'stoutland',types:['normal'],baseStats:{hp:85,attack:100,defense:90,speed:80,'special-defense':90,'special-attack':45},abilities:['intimidate','sand-rush']};
  const target=td33BaseBattleMon(baseOpponent);
  const audit=level=>{
   const active=td33BaseBattleMon({...user,level},original);
   const [gyro,iron]=user.moves;
   return [td2Power(gyro,active,target,5,legacy?undefined:'base').min,
    expectedPower(gyro,active,target,5),expectedPower(iron,active,target,5)];
  };
  const d={type:'normal',name:'Reference move',power:45,damageClass:'physical',accuracy:100};
  const a={types:['normal'],level:50,battleStats:{hp:100,attack:300,defense:100,speed:80},moves:[d]};
  const foe={types:['normal'],level:50,battleStats:{hp:90,attack:100,defense:100,speed:30}};
  const reply={...d,power:5};
  return {before:[audit(10),audit(85)],max:estimateDamage(a,foe,d,5),odds:takDexBattleOutcomes.against(a,foe,d,reply,5).firstKo};
 },fixtureOnly);
 if(fixtureOnly){
  assert.deepEqual(info.before.map(x=>x[0]),[150,40]);
  assert.equal(info.max,91);
  assert.equal(info.odds,.25);
  console.log('DEV2 baseline reproduced '+JSON.stringify(info));await page.close();return;
 }
 assert.deepEqual(info.before[0],info.before[1]);
 assert.equal(info.before[0][0],101);
 assert.equal(info.odds,.125);

 await page.locator('#battleTab').click();
 await page.evaluate(()=>{
  openTeam('battle-test');
  window.takActivate(1);
  foe={id:508,name:'stoutland',types:['normal'],baseStats:{hp:85,attack:100,defense:90,speed:80,'special-defense':90},
   abilities:['intimidate','sand-rush'],moves:[]};
  showBattle();
 });
 const card=page.locator('#matchups article.td76-move-card').filter({has:page.locator('[data-td76-move="Gyro Ball"]')});
 await card.waitFor();
 assert.match(await card.innerText(),/PWR 101/);
 assert.equal(await card.locator('.td76-damage-text').count(),0);
 const before=await page.locator('#matchups .td76-move-card,.td76-turn-order').allTextContents();
 const ranks=await page.locator('#td76BattleStrip [data-td3-battle-slot]').evaluateAll(els=>els.map(el=>el.querySelector('.td74-corner-rank')?.textContent));
 await page.evaluate(()=>{
  const mon=current.pokemon[0];
  mon.level=85;mon.statAdjustments={speed:200,attack:250};mon.saveStats={level:85,currentHP:10,stats:{speed:120,hp:165},ivs:{speed:31}};
  showBattle();
 });
 assert.deepEqual(await page.locator('#matchups .td76-move-card,.td76-turn-order').allTextContents(),before);
 assert.deepEqual(await page.locator('#td76BattleStrip [data-td3-battle-slot]').evaluateAll(els=>els.map(el=>el.querySelector('.td74-corner-rank')?.textContent)),ranks);
 await snapshot(page,'quick-battle-412',page.locator('#matchups .td74-clash'));

 await page.locator('#moreTab').click();
 await page.locator('#openPlanner').click();
 await page.locator('#planGame').selectOption('Black 2');
 await page.locator('#planTeam').selectOption('__custom__');
 await page.locator('#planMode').selectOption('custom');
 const roster={own:{id:598,name:'ferrothorn',level:10,moves:['gyro-ball','iron-head'],ability:'iron-barbs'},
  opp:{id:508,name:'stoutland',level:50,moves:['return','tackle'],ability:'sand-rush'}};
 await page.evaluate(({own,opp})=>{
  plannerOwn[0]=own;plannerOpp[0]=opp;
  renderPlannerSlots('planOwn',plannerOwn,true);renderPlannerSlots('planOpp',plannerOpp,false);
  document.getElementById('planAnalyze').click();
 },roster);
 const focus=page.locator('#td74Focus');
 const gyro=focus.locator('[data-td76-move="Gyro Ball"]').locator('xpath=ancestor::article[1]');
 await gyro.locator('.td76-damage-text').waitFor();
 const initial=await gyro.innerText();
 await page.evaluate(()=>{plannerOwn[0].level=85;document.getElementById('planAnalyze').click();});
 await page.waitForFunction(previous=>{
  const card=document.querySelector('#td74Focus [data-td76-move="Gyro Ball"]')?.closest('.td76-move-card');
  return card&&card.innerText!==previous&&!document.querySelector('.td74-calc-note');
 },initial);
 assert.match(await gyro.innerText(),/Est\. \d+[–-]\d+ HP/);
 assert.match(await gyro.innerText(),/Est\. win/);
 const colors=await focus.locator('.td76-damage-track').evaluateAll(bars=>bars.map(bar=>[bar.classList.contains('incoming'),getComputedStyle(bar).backgroundImage]));
 assert.ok(colors.some(([incoming,color])=>incoming&&color.includes('rgb(189, 49, 77)')));
 assert.ok(colors.some(([incoming,color])=>!incoming&&color.includes('rgb(33, 145, 103)')),JSON.stringify(colors));
 if(fixtureOnly)assert.match(await focus.locator('.td76-outcome-model').innerText(),/Two-turn estimates/);
 else assert.equal(await focus.locator('.td76-outcome-model').count(),0);
 await snapshot(page,'6v6-context-412',focus);
 const {a,d}=require('./gen5-damage-golden.json').fixtures[0];
 await page.evaluate(({a,d})=>{
  const entry=(mon,id,moves)=>({id,name:mon.name.toLowerCase(),level:mon.level,ability:mon.ability,moves,
   saveStats:{level:mon.level,stats:mon.battleStats,currentHP:mon.currentHP??mon.battleStats.hp,friendship:255,statusWord:0}});
  plannerOwn[0]=entry(a,508,['return']);plannerOpp[0]=entry(d,531,['pound']);
  renderPlannerSlots('planOwn',plannerOwn,true);renderPlannerSlots('planOpp',plannerOpp,false);
  document.getElementById('planAnalyze').click();
 },{a,d});
 const returned=focus.locator('[data-td76-move="Return"]').locator('xpath=ancestor::article[1]');
 await returned.getByText('OHKO chance: 12.5%',{exact:false}).waitFor();
 assert.match(await focus.locator('.td76-battle-opportunity').innerText(),/Return can OHKO before/);
 console.log('Quick cards, rank and order stayed invariant. 6v6 Gyro Ball changed with level, and the 12.5% fixture kept contextual bars and a probabilistic green warning.');
 await page.close();
}

(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  if(fixtureOnly||process.env.TAKDEX_FOCUS==='battle'){await battle(browser);return;}
  const widths=process.env.TAKDEX_WIDTH?[Number(process.env.TAKDEX_WIDTH)]:[360,412,1280];
  for(const width of widths)for(const light of [false,true])await ui(browser,width,light);
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
