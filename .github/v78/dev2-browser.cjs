const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const {execFileSync}=require('node:child_process');
const {chromium}=require('playwright-core');

const url=process.argv[2]||'http://127.0.0.1:8912';
const baseline=process.argv.includes('--baseline');
const evidence=process.env.TAKDEX_EVIDENCE;
const game='Black 2',planKey=game+':dev2',legacyPlans='takdex-v74-playthrough-plans';
const move=name=>({move:name,purpose:'keep'});
const stage=(id,name,types,extra)=>({id,name,types,confirmedCandidate:true,...extra});
const tepig=pid=>({id:498,name:'tepig',types:['fire'],level:24,saveStats:{pid},moves:[{name:'Flame Wheel'}]});
const emboar=(pid,during)=>stage(500,'emboar',['fire','fighting'],{
 originPid:pid,originName:'tepig',locked:true,duringTargetId:during,
 duringSpecies:during===498?'tepig':during===499?'pignite':'emboar',
 duringMoves:[move('flame-wheel')],plannedMoves:[move('flame-wheel')],
 duringManualSlots:[true],finalManualSlots:[true]
});
const liepard=stage(510,'liepard',['dark'],{
 duringTargetId:509,duringSpecies:'purrloin',duringMoves:[move('scratch'),move('growl')],
 plannedMoves:[{move:'scratch',replacement:'sucker-punch',purpose:'temporary'},move('cut')],
 acquisitionRoute:{id:'509|link trade||0|0',startId:509},duringManualSlots:[true,true],finalManualSlots:[true,true]
});
const seed={team:{id:'dev2',name:'DEV2 test',game,pokemon:[tepig(101),tepig(102),tepig(103),null,null,null]},
 plan:{game,deadline:'pre-league',slots:[emboar(101,498),emboar(102,499),emboar(103,500),null,null,liepard]}};

async function screenshot(page,name){
 if(!evidence)return;
 await fs.mkdir(evidence,{recursive:true});
 await page.screenshot({path:evidence+'/'+name+'.png'});
}

async function fixtures(browser,width,light){
 const desktop=width>500;
 const page=await browser.newPage({viewport:{width,height:900},isMobile:!desktop,hasTouch:!desktop,reducedMotion:'reduce',ignoreHTTPSErrors:true,serviceWorkers:'block'});
 const errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 let dismissConfirmation=false;
 page.on('dialog',dialog=>dismissConfirmation?dialog.dismiss():dialog.accept());
 await page.addInitScript(({seed,planKey,legacyPlans})=>{
  if(localStorage.getItem('takdex-v78-state-v1')||localStorage.getItem(legacyPlans))return;
  localStorage.setItem('poketact-teams',JSON.stringify([seed.team]));
  localStorage.setItem(legacyPlans,JSON.stringify({[planKey]:seed.plan}));
 },{seed,planKey,legacyPlans});
 if(baseline){
  for(const name of ['index.html','app.js','acquisition-v77.js','styles.css','maps.js','v74-ux.js']){
   const body=execFileSync('git',['show','3c2b719:'+name]);
   const target=name==='index.html'?new RegExp(url.replaceAll('.','\\.')+'/?$'):'**/'+name+'*';
   const contentType=name.endsWith('.js')?'application/javascript':name.endsWith('.css')?'text/css':'text/html';
   await page.route(target,route=>route.fulfill({body,contentType}));
  }
 }
 await page.goto(url,{waitUntil:'domcontentloaded'});
 if(light)await page.evaluate(()=>document.body.classList.add('light'));
 const tile=i=>page.locator('#td4Slots [data-td4-slot="'+i+'"]');
 const slots=()=>page.evaluate(([key,id])=>JSON.parse(localStorage.getItem(key))[id].slots,[legacyPlans,planKey]);
 const waitSlot=async (i,id,during,start)=>{
  await page.waitForFunction(({key,planKey,i,id,during,start})=>{
   const slot=JSON.parse(localStorage.getItem(key))?.[planKey]?.slots[i];
   return slot?.id===id&&(slot.duringTargetId??null)===(during??null)&&(!start||slot.acquisitionRoute?.startId===start);
  },{key:legacyPlans,planKey,i,id,during,start});
 };
 const view=name=>page.locator('#td77MoveViews [data-view="'+name+'"]').click();
 const selectSlot=async i=>{if(await tile(i).getAttribute('aria-expanded')!=='true')await tile(i).click();};
 const open=async()=>{
  const planButton=page.locator('[data-td41-team-plan="dev2"]');
  if(!await planButton.isVisible())await page.locator('[data-td71-toggle="dev2"]').click();
  await planButton.click();
  await page.waitForFunction(()=>document.querySelector('#td4Status').textContent==='');
 };
 const checkOverflow=async()=>assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
 const stages=i=>tile(i).locator('.td42-mon-pair strong').allTextContents();
 await open();
 if(baseline){
  await view('during');
  assert.deepEqual(await stages(0),['Tepig']);
  await view('final');
  assert.deepEqual(await stages(1),['Tepig','Emboar']);
  await screenshot(page,'baseline-web-005');
  console.log('Baseline reproduced: owned Actual=During shows only Tepig, and Pignite is missing from Final for Actual≠During.');
  await page.close();return;
 }

 for(const mode of ['during','final']){
  await view(mode);
  assert.deepEqual(await stages(0),['Tepig','Emboar']);
  assert.deepEqual(await stages(1),['Pignite','Emboar']);
  assert.deepEqual(await stages(2),['Emboar']);
  assert.match(await tile(1).locator('.td78-actual-stage').innerText(),/Actual · Tepig/);
  assert.equal(await tile(0).locator('.td78-actual-stage').count(),0);
 }
 const geometry=await tile(0).evaluate(el=>[el,...el.querySelectorAll('img')].map(e=>e.getBoundingClientRect().width));
 assert.ok(geometry.slice(1).every(n=>n>10&&n<geometry[0]/2));
 await tile(0).scrollIntoViewIfNeeded();
 await screenshot(page,width+(light?'-light':'-dark')+'-artwork');
 await checkOverflow();

 await selectSlot(3);
 const options=page.locator('#td4Edit > details').first();
 const manual=page.locator('#td63ManualCandidate');
 const search=async name=>{
  if(!await options.evaluate(el=>el.open))await options.locator('summary').first().click();
  await page.locator('#td4Search').fill(name);
  await page.locator('#td4SearchResults [data-value="'+name+'"]').first().click();
  await manual.locator('[data-td63-manual-select]').waitFor();
 };
 const apply=()=>manual.locator('[data-td63-manual-select]').click();
 const chooseRoute=async (start,scope=manual)=>{
  const picker=scope.locator('.td78-route-picker').first();
  if(!await picker.evaluate(el=>el.open))await picker.locator('summary').click();
  await picker.locator('button[data-route-id="'+start+'|link trade||0|0"]').click();
 };
 await search('zebstrika');
 const picker=manual.locator('.td78-route-picker');
 await picker.locator('summary').click();
 assert.equal(await picker.locator('.td78-route-group b').allTextContents().then(x=>x.join('|')),
  'Before planning deadline|After planning deadline|Other acquisition methods');
 for(const place of ['Route 7','Route 3']){
  const group=picker.locator('.td78-route-area').filter({hasText:place});
  assert.equal(await group.count(),1,place+' should group methods');
  assert.match(await group.innerText(),/Walk/);
  assert.match(await group.innerText(),/Dark Grass/);
 }
 assert.match(await picker.innerText(),/Trade Blitzle · evolves at Lv\. 27/);
 const trade=picker.locator('button[data-route-id="523|link trade||0|0"]');
 assert.equal(await trade.evaluate(el=>getComputedStyle(el).color),'rgb(83, 133, 219)');
 const activeSurface=await picker.locator('button[data-td77-route]').first().evaluate(el=>getComputedStyle(el).backgroundColor);
 assert.equal(activeSurface.startsWith('color(srgb 0.9'),light,activeSurface);
 await picker.locator('.td78-route-group').last().scrollIntoViewIfNeeded();
 await screenshot(page,width+(light?'-light':'-dark')+'-routes');
 await checkOverflow();
 await chooseRoute(523);
 await manual.locator('.td774-route-choice').filter({hasText:'Trade Zebstrika'}).waitFor();
 await apply();
 await waitSlot(3,523,null,523);
 assert.deepEqual(await stages(3),['Zebstrika']);
 await view('during');
 await page.getByRole('combobox',{name:'Planned evolution'}).selectOption('522');
 await waitSlot(3,523,522,522);
 assert.equal((await slots())[3].acquisitionRoute.id,'522|link trade||0|0');
 assert.deepEqual(await stages(3),['Blitzle','Zebstrika']);

 await selectSlot(4);
 await search('blitzle');
 await chooseRoute(522);
 await apply();
 await waitSlot(4,522,522,522);
 await view('final');
 await search('zebstrika');
 await apply();
 await waitSlot(4,523,522,522);

 // Scope the next assertions to an empty slot so earlier-stage exclusions cannot
 // pass by filtering families already elsewhere in the plan.
 await selectSlot(4);
 if(await tile(4).getAttribute('aria-expanded')!=='true')await tile(4).click();
 await page.locator('#td4Clear').click();
 await page.waitForFunction(([key,id])=>JSON.parse(localStorage.getItem(key))[id].slots[4]===null,[legacyPlans,planKey]);
 if(!await options.evaluate(el=>el.open))await options.locator('summary').click();
 await page.waitForFunction(()=>document.querySelector('#td4Candidates [data-candidate-id]'));
 const recs=page.locator('#td4Candidates [data-candidate-id]');
 const recButton=page.locator('[data-td77-more-candidates]');
 for(let n=0;n<30&&await recButton.count();n++)await recButton.click({timeout:2500}).catch(()=>{});
 const candidateIds=await recs.evaluateAll(rows=>rows.map(x=>Number(x.dataset.candidateId)));
 assert.ok(candidateIds.includes(604)&&candidateIds.includes(553),JSON.stringify(candidateIds));
 assert.ok(![551,552,602,603,522].some(id=>candidateIds.includes(id)));

 await selectSlot(5);
 await view('final');
 let comparisons=page.locator('#td41MoveSlots [data-td77-planned-move]');
 let moveKeys=()=>comparisons.evaluateAll(els=>els.map(el=>el.dataset.td77PlannedMove).filter(Boolean));
 assert.deepEqual(await moveKeys(),['sucker-punch','cut']);
 assert.doesNotMatch(await page.locator('#td41MoveSlots').innerText(),/Temporary|Scratch|Growl/i);
 const row=page.locator('#td41MoveSlots [data-td77-planned-move="sucker-punch"]');
 await row.locator('[data-td78-open-move]').click();
 const field=row.locator('input'),funnel=row.getByRole('button',{name:'Move filters'}),panel=row.locator('.td78-move-filter-panel');
 assert.equal(await field.evaluate(el=>document.activeElement===el),false);
 const [inputRect,filterRect]=await Promise.all([field.boundingBox(),funnel.boundingBox()]);
 assert.equal(inputRect.height,filterRect.height);
 assert.equal(filterRect.width,filterRect.height);
 assert.ok(filterRect.x>=inputRect.x+inputRect.width);
 await funnel.click();
 await panel.getByRole('button',{name:'Dark',exact:true}).click();
 await panel.getByRole('button',{name:'Physical',exact:true}).click();
 await field.fill('s');
 await row.locator('[data-td45-pick="sucker-punch"]').waitFor();
 const list=await row.locator('[data-td45-pick]').evaluateAll(els=>els.map(el=>el.dataset.td45Pick));
 assert.ok(list.every(n=>n.includes('s'))&&!list.includes('cut'));
 await funnel.scrollIntoViewIfNeeded();
 await screenshot(page,width+(light?'-light':'-dark')+'-move-filters');
 await checkOverflow();
 await funnel.click();
 assert.match(await funnel.getAttribute('class'),/selected/);
 await row.getByRole('button',{name:'Checker',exact:true}).click();
 await page.locator('#td68MoveResult .td64-move-back').click();
 await field.waitFor();
 assert.equal(await field.inputValue(),'s');
 assert.equal(await field.evaluate(el=>document.activeElement===el),false);
 assert.equal(await funnel.getAttribute('aria-expanded'),'false');
 await funnel.click();
 assert.equal(await panel.getByRole('button',{name:'Dark',exact:true}).getAttribute('aria-pressed'),'true');
 assert.equal(await panel.getByRole('button',{name:'Physical',exact:true}).getAttribute('aria-pressed'),'true');
 await row.getByRole('button',{name:'Clear planned move'}).click();
 await page.waitForFunction(([key,id])=>!JSON.parse(localStorage.getItem(key))[id].slots[5].plannedMoves[0].move,[legacyPlans,planKey]);
 await view('during');
 assert.deepEqual(await moveKeys(),['scratch','growl']);
 await page.reload();
 await open();
 await selectSlot(5);
 assert.deepEqual(await moveKeys(),['scratch','growl']);
 await view('final');
 assert.deepEqual(await moveKeys(),['cut']);
 if(desktop&&!light){
  await selectSlot(4);
  await view('during');
  await search('eevee');
  await apply();
  await waitSlot(4,133,133);
  await view('final');
  const evolution=page.getByRole('combobox',{name:'Planned evolution'});
  await evolution.selectOption('196');
  await waitSlot(4,196,133);
  await view('during');
  dismissConfirmation=true;
  await evolution.selectOption('197');
  await evolution.waitFor();
  assert.equal((await slots())[4].id,196);
  assert.equal((await slots())[4].duringTargetId,133);
  dismissConfirmation=false;
  await evolution.selectOption('197');
  await waitSlot(4,197,197);
  assert.deepEqual(await stages(4),['Umbreon']);
 }
 await checkOverflow();
 assert.deepEqual(errors,[]);
 console.log(width+'px '+(light?'light':'dark')+': stage artwork, both selection orders, exact grouped link trades, terminal replacements and independent filtered move editing.');
 await page.close();
}

(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  if(baseline){await fixtures(browser,360,false);return;}
  const sizes=process.env.TAKDEX_WIDTH?[Number(process.env.TAKDEX_WIDTH)]:[360,412,1280];
  for(const width of sizes)for(const light of [false,true])await fixtures(browser,width,light);
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
