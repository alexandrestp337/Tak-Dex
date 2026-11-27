const assert=require('node:assert/strict');
const {chromium}=require('playwright-core');

(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:412,height:860},isMobile:true,hasTouch:true,reducedMotion:'reduce',serviceWorkers:'block'});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{
   const game='Black 2',id='maintenance';
   const owned=[{id:498,name:'Tepig',types:['fire'],level:12,saveStats:{pid:10},moves:[{name:'Tackle'}]},
    {id:504,name:'Patrat',types:['normal'],level:5,saveStats:{pid:20},moves:[{name:'Tackle'}]}];
   const slots=owned.map((mon,i)=>({...mon,name:mon.name.toLowerCase(),originPid:mon.saveStats.pid,locked:i===0,
    plannedMoves:[{move:'tackle',purpose:'keep'}],duringMoves:[{move:'tackle',purpose:'keep'}],
    finalManualSlots:[true],duringManualSlots:[true]}));
   if(localStorage.getItem('poketact-teams'))return;
   localStorage.setItem('poketact-teams',JSON.stringify([{game,id,name:'Maintenance test',pokemon:owned,saveLink:{progression:{badgeCount:0}}}]));
   localStorage.setItem('takdex-v74-playthrough-plans',JSON.stringify({[game+':'+id]:{game,slots,deadline:'pre-league'}}));
  });
  await page.goto(process.argv[2]||'http://127.0.0.1:8795',{waitUntil:'domcontentloaded'});
  const planner=page.locator('[data-td41-team-plan="maintenance"]');
  if(!await planner.isVisible())await page.locator('[data-td71-toggle="maintenance"]').click();
  await planner.click();
  const tile=index=>page.locator(`#td4Slots [data-td4-slot="${index}"]`);
  const read=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('takdex-v74-playthrough-plans'))['Black 2:maintenance']);
  const species=(slot,id)=>page.waitForFunction(([i,n])=>
   JSON.parse(localStorage.getItem('takdex-v74-playthrough-plans'))['Black 2:maintenance'].slots[i]?.id===n,[slot,id]);
  await tile(0).tap();
  const evolution=page.getByRole('combobox',{name:'Planned evolution'});
  await evolution.locator('option[value="499"]').waitFor({state:'attached'});
  assert.match(await evolution.locator('option[value="499"]').textContent(),/Pignite.*17/);
  assert.match(await evolution.locator('option[value="500"]').textContent(),/Emboar.*36/);
  const gym=page.locator('#td77GymSummary');
  await page.waitForFunction(()=>document.querySelector("#td77GymSummary").textContent.includes("0/2"));
  assert.equal(await gym.getAttribute('data-readiness-status'),'bad');
  await evolution.selectOption('499');
  await species(0,499);
  const route=(await read()).slots[0].acquisitionRoute.id;
  await page.locator('[data-view="during"]').click();
  await evolution.selectOption('500');
  await species(0,500);
  assert.equal((await read()).slots[0].acquisitionRoute.id,route);
  assert.equal((await read()).slots[0].locked,true);
  await evolution.selectOption('499');
  await species(0,499);
  assert.equal((await read()).slots[0].plannedMoves[0].move,'tackle');
  assert.equal(await gym.getAttribute('data-readiness-status'),'bad');
  await evolution.selectOption('500');
  await species(0,500);
  const emboar=(await read()).slots[0];

  await page.locator('[data-view="final"]').click();
  const tackle=page.locator('#td41MoveSlots [data-td77-planned-move="tackle"]');
  assert.equal(await tackle.getAttribute('data-td77-retained'),'true');
  assert.equal(await tackle.locator('.td62-move-timing').count(),0);
  const resources=page.locator('#td77Improvements [data-td77-resource="Heart Scale"]');
  assert.doesNotMatch(await resources.allTextContents().then(x=>x.join(' ')),/Emboar/);
  await tackle.locator('[data-td78-open-move]').click();
  page.once('dialog',d=>d.accept());
  await tackle.getByRole('button',{name:'Clear planned move'}).click();
  assert.match(await tile(0).textContent(),/Tackle\s*→\s*×/);
  await page.locator('[data-view="during"]').click();
  await page.locator('[data-view="final"]').click();
  assert.equal((await read()).slots[0].plannedMoves[0].move,'');
  page.once('dialog',d=>d.accept());
  await page.locator('#td4Clear').click();
  await species(0,498);
  for(const mode of ['final','during']){
   await page.locator(`[data-view="${mode}"]`).click();
   assert.equal(await tile(0).locator('[data-td77-retained]').count(),1);
   assert.equal(await page.locator('#td41MoveSlots [data-td77-planned-move="tackle"]').getAttribute('data-td77-retained'),'true');
  }

  const stab=page.locator('#td4Coverage .td42-coverage').filter({hasText:'Potential STAB coverage'});
  await stab.waitFor({state:'attached'});
  const counts=()=>stab.locator('.td44-cover-col strong').allTextContents();
  const before=await counts();
  await tile(2).tap();
  await page.locator('#td4Search').fill('espeon');
  await page.locator('#td4SearchResults [data-value="espeon"]').first().click();
  await page.locator('#td63ManualCandidate [data-td63-manual-select]').click();
  await species(2,196);
  const after=await counts();
  assert.equal(after[0],before[0]);
  assert.equal(parseInt(after[1])-parseInt(before[1]),2);
  assert.equal(await gym.getAttribute('data-readiness-status'),'bad');

  const improvements=page.locator('#td77Improvements');
  await improvements.locator('..').locator(':scope > summary').click();
  const pokemon=improvements.locator('.td78-category').filter({hasText:'Pokémon improvements'});
  await pokemon.locator(':scope > summary').click();
  const item=pokemon.locator('details:has(> .td82-base-stats)').first();
  await item.locator(':scope > summary').click();
  const stats=item.locator('.td82-base-stats');
  assert.equal(await stats.evaluate(el=>el.open),false);
  await stats.locator('summary').click();
  const rows=await stats.locator('tbody tr').evaluateAll(els=>els.map(el=>Array.from(el.cells,c=>c.textContent.trim())));
  assert.equal(rows.length,7);
  for(const [,left,right,delta] of rows)assert.equal(Number(delta),Number(right)-Number(left));
  assert.match(await stats.locator('summary').textContent(),/BST [+-]?\d+/);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),412);
  await page.evaluate(emboar=>{
   const teams=JSON.parse(localStorage.getItem('poketact-teams'));
   Object.assign(teams[0].pokemon[0],{id:499,name:'Pignite',types:['fire','fighting'],level:25});
   localStorage.setItem('poketact-teams',JSON.stringify(teams));
   const plans=JSON.parse(localStorage.getItem('takdex-v74-playthrough-plans'));
   plans['Black 2:maintenance'].slots[0]=emboar;
   plans['Black 2:maintenance'].editorSlot=0;
   localStorage.setItem('takdex-v74-playthrough-plans',JSON.stringify(plans));
  },emboar);
  await page.reload({waitUntil:'domcontentloaded'});
  if(!await planner.isVisible())await page.locator('[data-td71-toggle="maintenance"]').click();
  await planner.click();
  await evolution.locator('option[value="499"]').waitFor({state:'attached'});
  assert.equal(await evolution.locator('option[value="498"]').count(),0);
  await evolution.selectOption('499');
  await species(0,499);
  assert.equal((await read()).slots[0].acquisitionRoute.startId,499);
  assert.deepEqual(errors,[]);
  console.log('412px: shared intermediate evolution, actual Gym, intended Espeon STAB, retained Tackle, clear/reset and dynamic base stats passed.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
