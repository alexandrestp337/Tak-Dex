const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const {chromium}=require('playwright-core');
const url=process.argv[2]||'http://127.0.0.1:8919';
const evidence=process.env.TAKDEX_EVIDENCE;
const key='takdex-v78-state-v1',game='Black 2',id='dev5',planKey=game+':'+id;
const entries=names=>names.map(move=>({move,purpose:'keep'}));
const mon=(id,name,types,moves,extra={})=>({id,name,types,level:27,moves,plannedMoves:entries(moves),duringMoves:entries(moves),...extra});
const pikachu=mon(25,'pikachu',['electric'],['thunder-shock','quick-attack'],{originName:'pikachu',explicitOwned:true,locked:true});
const eevee=mon(133,'eevee',['normal'],['tackle','bite'],{originPid:101});
const psyduck=mon(54,'psyduck',['water'],['water-gun','scratch','tail-whip'],{originPid:103,level:5});
const espeon=mon(196,'espeon',['psychic'],['confusion'],{originPid:102,duringTargetId:133,duringSpecies:'eevee',
 acquisitionRoute:{id:'133|owned|102',startId:133}});
const catchPlan=mon(55,'golduck',['water'],['water-gun'],{confirmedCandidate:true,fulfilledPid:900,fulfilledStage:54,
 acquisitionRoute:{id:'54|owned|900',startId:54}});
const team={id,game,name:'DEV5 fixture',pokemon:[pikachu,{...eevee,saveStats:{pid:101}},{...psyduck,saveStats:{pid:103}},{...eevee,saveStats:{pid:102}},
 {...mon(54,'psyduck',['water'],['water-gun']),level:5,saveStats:{pid:900}}]};
const plan={game,mode:'final',deadline:'badge-6',slots:[null,eevee,psyduck,espeon,catchPlan,mon(504,'patrat',['normal'],['tackle'],{confirmedCandidate:true})],independentSlots:{0:{during:pikachu}}};
const rect=loc=>loc.evaluate(e=>e.getBoundingClientRect().toJSON());
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
async function check(browser,width,light){
 const page=await browser.newPage({viewport:{width,height:700},isMobile:true,hasTouch:true,
  reducedMotion:'reduce',ignoreHTTPSErrors:true,serviceWorkers:'block'});
 const tag=width+'-'+(light?'light':'dark');
 try{
  await page.addInitScript(({light,team,plan,planKey})=>{
   localStorage.setItem('poketact-teams',JSON.stringify([team]));
   localStorage.setItem('takdex-v74-playthrough-plans',JSON.stringify({[planKey]:plan}));
   if(light)document.addEventListener('DOMContentLoaded',()=>document.body.classList.add('light'),{once:true});
  },{light,team,plan,planKey});
  await page.goto(url);
  const entry=page.locator(`[data-td41-team-plan="${id}"]`);
  if(!await entry.isVisible())await act(page.locator(`[data-td71-toggle="${id}"]`));
  await act(entry);
  await openSlot(page,4);
  const route=page.locator('#td77SlotRoute');
  const owned=route.locator('.td78-owned-route');
  await owned.waitFor();
  assert.deepEqual(await owned.locator('small').allTextContents(),['On team · Lv. 5','Evolution remaining · Golduck at Lv. 33']);
  const [ownership,evolution]=await Promise.all((await owned.locator('small').all()).map(rect));
  assert.equal(evolution.top-ownership.bottom,4);
  assert.equal(ownership.left,evolution.left);
  assert.equal(await route.locator('[data-td77-route]').count(),0);
  await photo(owned,tag+'-owned');
  const wrapped=await owned.evaluate(el=>{
   el.style.width='140px';
   const result=[...el.children].map(child=>child.getBoundingClientRect().toJSON());
   el.style.removeProperty('width');
   return result;
  });
  assert.equal(wrapped[1].top-wrapped[0].bottom,4);
  assert.ok(wrapped[1].height>evolution.height);
  await openSlot(page,5);
  assert.ok(await route.locator('.td78-route-picker').count());

  await openSlot(page,1);
  await act(page.locator('[data-td78-evolution]'));
  const dialog=page.getByRole('dialog',{name:'Planned evolution'});
  const rows=await dialog.locator('.td78-evolution-options > div').evaluateAll(elements=>elements.map(row=>{
   const [button,text]=[...row.children].map(el=>el.getBoundingClientRect().toJSON());
   return {button,text,top:row.getBoundingClientRect().top,border:parseFloat(getComputedStyle(row).borderTopWidth),
    bottom:Math.max(button.bottom,text.bottom),contentTop:Math.min(button.top,text.top)};
  }));
  assert.equal(await dialog.evaluate(e=>e.scrollTop),0);
  assert.ok(rows.length>=5);
  const clearances=rows.slice(1).map((row,i)=>[row.top-rows[i].bottom,row.contentTop-row.top-row.border]);
  for(const row of rows){
   assert.ok(Math.abs((row.button.top+row.button.bottom-row.text.top-row.text.bottom)/2)<.1);
   assert.ok(Math.abs(row.button.width-row.text.width)<1);
  }
  for(const [above,below] of clearances){
   assert.ok(Math.abs(above-7)<.1&&Math.abs(below-7)<.1,JSON.stringify(clearances));
  }
  await photo(dialog,tag+'-evolution');
  await page.setViewportSize({width,height:440});
  assert.ok(await dialog.evaluate(el=>{
   el.scrollTop=50;
   return el.scrollTop>0&&el.scrollHeight>el.clientHeight;
  }));
  await page.setViewportSize({width,height:700});
  await dialog.getByRole('button',{name:'Cancel'}).click();
  await dialog.waitFor({state:'hidden'});

  const settings=page.locator('#td4Edit > details.td42-settings').first();
  if(!await settings.evaluate(el=>el.open))await act(settings.locator('summary'));
  const funnel=page.locator('#td77TypeFilter');
  await act(funnel);
  const filter=page.locator('#td77TypeOptions');
  const clear=filter.getByRole('button',{name:'Clear filters'});
  const water=filter.getByRole('button',{name:'Water',exact:true});
  const [a,b]=await Promise.all([rect(clear),rect(water)]);
  for(const prop of ['width','height','right'])assert.ok(Math.abs(a[prop]-b[prop])<=1,JSON.stringify({a,b}));
  assert.ok(a.bottom<=b.top);
  const sizing=el=>[getComputedStyle(el).borderRadius,getComputedStyle(el).fontSize];
  assert.deepEqual(await clear.evaluate(sizing),await water.evaluate(sizing));
  assert.equal(await clear.isDisabled(),true);
  await act(water);
  assert.equal(await clear.isEnabled(),true);
  await photo(filter,tag+'-pokemon-filter');
  await act(clear);
  assert.equal(await clear.isDisabled(),true);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
  console.log(JSON.stringify({tag,clearances,clear:[a.width,a.height,a.right],water:[b.width,b.height,b.right],
   ownership:[ownership.y,ownership.height],evolution:[evolution.y,evolution.height]}));
 }finally{await page.close();}
}
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 try{for(const width of [360,412])for(const light of [false,true])await check(browser,width,light);}
 finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
