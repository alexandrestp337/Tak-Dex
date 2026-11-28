const assert=require('node:assert/strict');
const {chromium}=require('playwright-core');
const {makeSave}=require('../v76/fixtures.cjs');
const {validate}=require('../../dev1-import.js');
const url=process.argv[2]||'http://127.0.0.1:8916';
const game='Black 2',id='dev4',key='takdex-v78-state-v1',planKey=game+':'+id;
const state=page=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
const plan=async page=>(await state(page)).plans[planKey].value;
const tile=(page,i)=>page.locator(`#td4Slots [data-td4-slot="${i}"]`);
async function openPlanner(page){
 const entry=page.locator(`[data-td41-team-plan="${id}"]`);
 if(!await entry.isVisible())await page.locator(`[data-td71-toggle="${id}"]`).click();
 await entry.click();
}
async function openSlot(page,i){
 if(await tile(page,i).getAttribute('aria-expanded')!=='true')await tile(page,i).click();
}
async function confirm(page,name){await page.locator('#td78Confirmation').getByRole('button',{name,exact:true}).click();}
async function style(locator){
 return locator.evaluate(el=>{
  const s=getComputedStyle(el),r=el.getBoundingClientRect();
  return {border:s.borderColor,ink:s.color,fill:s.backgroundColor,top:r.top,height:r.height,width:r.width,right:r.right,left:r.left};
 });
}
async function checkFilters(page,button,panel,activate,reset,peer){
 const neutral=await style(button);
 if(peer){
  const other=await style(peer);
  assert.equal(neutral.top,other.top);
  assert.equal(neutral.height,other.height);
  assert.equal(neutral.height,neutral.width);
 }
 await button.click();
 const open=await style(button);
 assert.equal(open.ink,neutral.ink);
 assert.notEqual(open.border,neutral.border);
 await activate();
 const active=await style(button);
 assert.equal(active.border,open.border);
 assert.notEqual(active.ink,neutral.ink);
 await button.click();
 assert.equal((await style(button)).ink,active.ink);
 await button.click();
 await panel.getByRole('button',{name:'Clear filters'}).click();
 await reset();
 assert.equal((await style(button)).ink,neutral.ink);
 await button.click();
 assert.equal((await style(button)).border,neutral.border);
}
async function ui(browser,width,light){
 const page=await browser.newPage({viewport:{width,height:860},isMobile:true,hasTouch:true,
  ignoreHTTPSErrors:true,reducedMotion:'reduce',serviceWorkers:'block'});
 page.setDefaultTimeout(18000);
 const errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.addInitScript(({key,game,id,light})=>{
  if(!localStorage.getItem(key))localStorage.setItem('poketact-teams',JSON.stringify([{id,game,name:'DEV4 fixture',pokemon:[
   {id:54,name:'psyduck',types:['water'],level:24,moves:[{name:'Water Gun'},{name:'Scratch'}]}
  ]}]));
  if(light)document.addEventListener('DOMContentLoaded',()=>document.body.classList.add('light'),{once:true});
 },{key,game,id,light});
 await page.goto(url);
 const names=await page.evaluate(()=>td78SearchMatches(['withdraw','mega-drain','dragon-claw','drain-punch','dragon'], 'Dra'));
 assert.deepEqual(names,['dragon','dragon-claw','drain-punch','mega-drain','withdraw']);
 assert.deepEqual(await page.evaluate(()=>td78SearchMatches(['Nidoran-f','Nidoran-m'],'NÍDORAN F')),['Nidoran-f']);
 const contrast=await page.locator('#openTypeExplorer').evaluate(el=>{
  const s=getComputedStyle(el),ctx=document.createElement('canvas').getContext('2d');
  const luminance=color=>{
   ctx.fillStyle=color;ctx.fillRect(0,0,1,1);
   const values=[...ctx.getImageData(0,0,1,1).data].slice(0,3).map(v=>v/255)
    .map(v=>v<.04045?v/12.92:((v+.055)/1.055)**2.4);
   return .2126*values[0]+.7152*values[1]+.0722*values[2];
  };
  const [a,b]=[s.color,s.backgroundColor].map(luminance).sort((x,y)=>y-x);
  return (a+.05)/(b+.05);
 });
 assert.ok(contrast>=4.5,contrast);
 await openPlanner(page);
 assert.equal(await page.locator('#td4Slots [data-td4-slot]').filter({hasText:'＋ Slot'}).count(),6);
 await page.locator('#td77MoveViews [data-view="during"]').click();
 await page.locator('#td77Availability').selectOption('badge-3');
 await openSlot(page,0);
 const types=page.locator('#td77TypeOptions'),typeButton=page.locator('#td77TypeFilter');
 await checkFilters(page,typeButton,types,()=>types.getByRole('button',{name:'Water',exact:true}).click(),
  async()=>assert.equal(await types.getByRole('button',{name:'Water',exact:true}).getAttribute('aria-pressed'),'false'),page.locator('#td4Search'));
 await page.getByRole('button',{name:/Use Psyduck/}).click();
 await tile(page,0).getByText('Psyduck').waitFor();
 assert.equal((await plan(page)).independentSlots[0].during.name,'psyduck');
 assert.equal((await plan(page)).slots[0],null);
 assert.equal(await page.locator('#td78Confirmation').count(),0);

 const move=page.locator('#td41MoveSlots [data-td77-planned-move="water-gun"]');
 await move.locator('[data-td78-open-move]:enabled').waitFor();
 await move.locator('[data-td78-open-move]').click();
 const shell=move.locator('.td78-editor-shell'),input=shell.locator('input');
 const funnel=shell.getByRole('button',{name:'Move filters'});
 const panel=shell.locator('.td78-move-filter-panel');
 const opened=await style(shell),card=await style(move.locator('.td77-edit-move .td77-planner-move-info'));
 assert.equal(card.border,opened.border);
 assert.notEqual((await style(input)).border,opened.border);
 await checkFilters(page,funnel,panel,()=>panel.getByRole('button',{name:'Water',exact:true}).click(),
  async()=>assert.equal(await panel.getByRole('button',{name:'Water',exact:true}).getAttribute('aria-pressed'),'false'),input);
 await input.fill('water gun');
 assert.equal(await shell.locator('[data-td45-pick="water-gun"]').count(),0);
 await input.fill('scratch');
 assert.equal(await shell.locator('[data-td45-pick="scratch"]').count(),0);
 await shell.getByRole('button',{name:'Clear planned move'}).click();
 await confirm(page,'Cancel');
 assert.ok(await shell.isVisible());
 assert.equal(await input.inputValue(),'scratch');
 assert.equal((await plan(page)).independentSlots[0].during.duringMoves[0].move,'water-gun');
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);

 await page.locator('#td77MoveViews [data-view="final"]').click();
 assert.equal(await page.locator('#td77Availability').inputValue(),'pre-league');
 await openSlot(page,0);
 const query=page.locator('#td4Search');
 await query.fill('purrloin');
 await page.locator('#td4SearchResults [data-value="purrloin"]').click();
 await page.locator('[data-td63-manual-select]').click();
 await tile(page,0).getByText('Purrloin').waitFor();
 assert.equal((await plan(page)).independentSlots[0].during.name,'psyduck');
 assert.equal((await plan(page)).slots[0].name,'purrloin');
 if(!light&&width===360){
  await openSlot(page,0);
  if(!await query.isVisible())await page.locator('#td4Edit > .td42-settings > summary').click();
  await query.fill('umbreon');
  await page.locator('#td4SearchResults [data-value="umbreon"]').click();
  const coverage=page.locator('#td63ManualCandidate .td773-coverage');
  await coverage.locator('summary').click();
  assert.match(await coverage.innerText(),/No type coverage changes/);
 }
 await page.reload();
 await openPlanner(page);
 await openSlot(page,0);
 await tile(page,0).getByText('Purrloin').waitFor();
 await page.locator('#td78RemovePlan').evaluate(el=>el.scrollIntoView({block:'center'}));
 await page.locator('#td78RemovePlan').click();
 await confirm(page,'Cancel');
 assert.equal((await plan(page)).slots[0].name,'purrloin');
 await page.locator('#td78RemovePlan').evaluate(el=>el.scrollIntoView({block:'center'}));
 await page.locator('#td78RemovePlan').click();
 await confirm(page,'Remove');
 await tile(page,0).getByText('＋ Slot 1').waitFor();
 assert.equal((await plan(page)).slots[0],null);
 await page.locator('#td77MoveViews [data-view="during"]').click();
 await tile(page,0).getByText('Psyduck').waitFor();
 assert.equal(await page.locator('#td77Availability').inputValue(),'badge-3');
 const s=await state(page);
 const imported=validate({format:'takdex-team',version:2,team:s.teams[id].value,plan:s.plans[planKey].value},[game]);
 assert.equal(imported.plan.independentSlots[0].during.duringMoves[0].move,'water-gun');

 const bytes=Array.from(makeSave(23,20,30,{mask:7},[{species:504,pid:23,move:44,ability:22,item:0}]));
 assert.equal(await page.evaluate(({bytes,id})=>takDexSaveSync.synchronize({teamId:id,bytes:new Uint8Array(bytes)}),{bytes,id}),'updated');
 assert.equal((await state(page)).teams[id].value.pokemon[0].id,504);
 assert.equal((await plan(page)).independentSlots[0].during.id,54);
 assert.match(await tile(page,1).innerText(),/Slot 2/);

 if(!light&&width===360){
  await page.locator('#td77MoveViews [data-view="final"]').click();
  await openSlot(page,0);
  await query.fill('baltoy');
  await page.locator('#td4SearchResults [data-value="baltoy"]').click();
  const preview=page.locator('#td63ManualCandidate');
  await preview.getByText('Acquisition details',{exact:true}).click();
  assert.match(await preview.innerText(),/Relic Castle/);
  assert.match(await preview.innerText(),/Clay/);
  assert.doesNotMatch(await preview.innerText(),/After planning deadline/);
  assert.match(await page.locator('#td77ActualProgress').innerText(),/3\/8 badges/);
 }
 await page.evaluate(()=>takDexMoveV68.open('', 'more', 'Black 2'));
 const moveSearch=page.locator('#td68MoveInput');
 await moveSearch.fill('Dra');
 const suggestions=page.locator('#td68MoveSuggest [data-td68-select]');
 await suggestions.first().waitFor();
 const matches=await suggestions.evaluateAll(elements=>elements.map(el=>el.dataset.td68Select));
 assert.ok(matches.indexOf('dragon-claw')>=0&&matches.indexOf('dragon-claw')<matches.indexOf('mega-drain'));
 assert.equal(await page.locator('#td68MoveResult h2').count(),0);
 await suggestions.filter({hasText:'Dragon Claw'}).first().click();
 await page.locator('#td68MoveResult h2').filter({hasText:'Dragon Claw'}).waitFor();
 assert.equal(await page.locator('#td68MoveGo').count(),0);
 await page.evaluate(()=>takDexMapsV73.open('Black 2','Village Bridge'));
 const map=page.locator('#mapsSearch');
 await map.fill('route');
 await map.press('ArrowDown');
 const first=await map.getAttribute('aria-activedescendant');
 assert.ok(first);
 await map.press('ArrowDown');
 const second=await map.getAttribute('aria-activedescendant');
 assert.notEqual(second,first);
 const chosen=await page.locator('#'+second+' span').innerText();
 await map.press('Enter');
 assert.equal(await map.inputValue(),chosen);
 assert.equal(await map.getAttribute('aria-expanded'),'false');
 assert.equal(await map.evaluate(el=>el===document.activeElement),true);
 await map.press('ArrowUp');
 await map.press('Escape');
 assert.equal(await map.getAttribute('aria-activedescendant'),null);
 assert.deepEqual(errors,[]);
 console.log(`${width}px ${light?'light':'dark'} · planner stages, map keyboard, move filters and storage passed`);
 await page.close();
}
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  for(const [width,light] of [[360,false],[360,true],[412,false],[412,true]])await ui(browser,width,light);
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
