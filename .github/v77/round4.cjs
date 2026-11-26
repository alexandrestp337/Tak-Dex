const {chromium}=require('playwright-core');
const assert=require('node:assert/strict');

(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:390,height:850},isMobile:true,hasTouch:true,serviceWorkers:'block',reducedMotion:'reduce'});
  await page.route('**/db74/planner-v77.json*',async route=>{
   const response=await route.fetch(),all=await response.json();
   const comparable=Object.fromEntries([54,55,120,121].map(id=>[id,all[id]]));
   await route.fulfill({response,json:comparable});
  });
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const party=[{id:54,name:'Psyduck',level:22,types:['water'],moves:[
   {name:'Water Gun'},{name:'Scratch'},{name:'Frustration'}
  ]}];
  await page.addInitScript(pokemon=>localStorage.setItem('poketact-teams',JSON.stringify([{id:'r4',name:'Round 4',game:'Black 2',pokemon}])),party);
  await page.goto(process.argv[2]||'http://127.0.0.1:8795',{waitUntil:'domcontentloaded'});
  await page.locator('[data-td71-toggle="r4"]').click();
  await page.locator('[data-td41-team-plan="r4"]').click();
  await page.locator('#td4Slots [data-td4-slot="0"]').click();
  await page.locator('#td4Edit details.td42-settings').first().locator(':scope > summary').click();
  await page.locator('#td4Candidates [data-candidate-id="121"]').waitFor();
  const ratings=await page.locator('#td4Candidates [data-candidate-id]').evaluateAll(rows=>rows.map(row=>({
   species:Number(row.dataset.candidateId),score:Number(row.dataset.score),parts:JSON.parse(row.dataset.factors)
  })));
  assert.ok(ratings.find(r=>r.species===55).parts.effort>ratings.find(r=>r.species===121).parts.effort);
  console.log('Black 2 water candidates',JSON.stringify(ratings));
  const evolution=page.locator('#td4Candidates [data-candidate-id="55"]');
  await evolution.locator("[data-td4-candidate]").click();
  await page.locator('[data-td63-manual-select]').click();
  await page.waitForFunction(()=>JSON.parse(localStorage.getItem('takdex-v74-playthrough-plans'))?.['Black 2:r4']?.slots[0]?.id===55);
  const slot=await page.evaluate(()=>JSON.parse(localStorage.getItem('takdex-v74-playthrough-plans'))['Black 2:r4'].slots[0]);
  for(const mode of ['duringMoves','plannedMoves']){
   const moves=slot[mode].map(m=>m.replacement||m.move);
   assert.equal(moves.filter(Boolean).length,4,mode+': '+moves.join(', '));
   assert.equal(new Set(moves).size,4);
   console.log(mode,moves.join(', '));
  }
  await page.locator('[data-view="during"]').click();
  assert.deepEqual(await page.locator('[data-td77-during]').evaluateAll(rows=>rows.map(row=>row.value.toLowerCase().replaceAll(' ','-'))),slot.duringMoves.map(m=>m.move));
  const choose=async(name,id)=>{
   await page.locator('#td4Search').fill(name);
   await page.locator(`#td4SearchResults [data-value="${name}"]`).first().click();
   await page.locator('[data-td63-manual-select]').click();
   await page.waitForFunction(id=>JSON.parse(localStorage.getItem('takdex-v74-playthrough-plans'))['Black 2:r4'].slots[0].id===id,id);
  };
  await choose('psyduck',54);
  const selected=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('takdex-v74-playthrough-plans'))['Black 2:r4'].slots[0]);
  await page.locator('[data-view="final"]').click();
  const target=page.getByRole('combobox',{name:'Final moveset target'});
  assert.equal(await target.inputValue(),'55');
  const initialProjection=await selected();
  assert.ok(initialProjection.finalTarget.legalMoves.includes('hydro-pump'));
  await page.locator('[data-td45-move="0:goal"]').fill('Water Pulse');
  const accept=dialog=>dialog.accept();
  page.on('dialog',accept);
  await page.locator('[data-td45-pick="water-pulse"]').click();
  await page.waitForFunction(()=>{const head=JSON.parse(localStorage.getItem('takdex-v74-playthrough-plans'))['Black 2:r4'].slots[0].plannedMoves[0];return (head.replacement||head.move)==='water-pulse';});
  const projected=await selected();
  page.off('dialog',accept);
  await page.locator('#td77Availability').selectOption('badge-1');
  assert.equal(await target.inputValue(),'55');
  assert.deepEqual((await selected()).plannedMoves,projected.plannedMoves);
  assert.match(await page.locator('#td77FinalForm').textContent(),/outside the current deadline/);
  page.once('dialog',dialog=>dialog.accept());
  await target.selectOption('');
  await page.waitForFunction(()=>!JSON.parse(localStorage.getItem('takdex-v74-playthrough-plans'))['Black 2:r4'].slots[0].finalTarget);
  assert.equal(await target.inputValue(),'');
  const confirmed=(await selected()).plannedMoves[0];
  assert.equal(confirmed.replacement||confirmed.move,'water-pulse');
  await page.locator('#td77Availability').selectOption('pre-league');
  await choose('eevee',133);
  assert.equal(await target.inputValue(),'');
  page.once('dialog',dialog=>dialog.accept());
  await target.selectOption('135');
  await page.waitForFunction(()=>JSON.parse(localStorage.getItem('takdex-v74-playthrough-plans'))['Black 2:r4'].slots[0].finalTarget?.id===135);
  assert.equal((await selected()).id,133);
  await choose('sandile',551);
  assert.equal(await target.inputValue(),'553');
  await choose('timburr',532);
  assert.equal(await target.inputValue(),'');
  assert.equal(await target.locator('option[value="534"]').isDisabled(),true);
  await page.locator('#dexTab').click();
  await page.locator('#dexGame').selectOption('Black 2');
  await page.locator('#dexInput').fill('golduck');
  await page.locator('#dexResults button').filter({hasText:'Golduck'}).first().click();
  const enc=page.locator('#td56DexEncounters');
  if(!await enc.evaluate(el=>el.open))await enc.locator('summary').click();
  const entries=enc.locator('.td77-acquisition-entry');
  await entries.first().waitFor();
  const rendered=await entries.allTextContents();
  assert.ok(rendered.some(r=>r.includes('Floccesy Ranch')&&r.includes('Level 33')));
  assert.ok(rendered.some(r=>r.includes('Route 11')&&r.includes('Lv ')));
  assert.ok(!rendered.some(r=>r.includes('Acquisition from')));
  await page.locator('#dexInput').fill('magikarp');
  await page.locator('#dexResults button').filter({hasText:'Magikarp'}).first().click();
  if(!await enc.evaluate(el=>el.open))await enc.locator('summary').click();
  const preserve=enc.locator('[data-td74-dex-map="Nature Preserve"]').first();
  await preserve.click();
  await page.waitForFunction(()=>document.querySelector('#mapsSelectionLabel')?.textContent==='Nature Preserve');
  await page.getByText('Travel from Mistralton City with Skyla.',{exact:false}).first().waitFor();
  assert.equal(await page.locator('#mapsCanvas [data-map-place="Nature Preserve"]').count(),0);
  await page.locator('#backMaps').click();
  await enc.waitFor();
  assert.deepEqual(errors,[]);
  console.log('Four recommendations, Final projection and deadline, compact route rows, detached Nature Preserve and Pokédex return passed');
  await page.close();
  for(const count of [0,1,2,4]){
   const sample=await browser.newPage({viewport:{width:412,height:850},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
   const base=party[0];
   const mon={...base,moves:[...base.moves,{name:'Confusion'}].slice(0,count)};
   await sample.addInitScript(pokemon=>localStorage.setItem('poketact-teams',JSON.stringify([{id:'r4',name:'Move count',game:'Black 2',pokemon:[pokemon]}])),mon);
   await sample.goto(process.argv[2]||'http://127.0.0.1:8795',{waitUntil:'domcontentloaded'});
   await sample.locator('[data-td71-toggle="r4"]').click();
   await sample.locator('[data-td41-team-plan="r4"]').click();
   await sample.locator('#td4Slots [data-td4-slot="0"]').click();
   await sample.locator('#td4Edit details.td42-settings').first().locator(':scope > summary').click();
   await sample.locator('#td4Candidates [data-candidate-id="55"] [data-td4-candidate]').click();
   await sample.locator('[data-td63-manual-select]').click();
   await sample.waitForFunction(()=>JSON.parse(localStorage.getItem('takdex-v74-playthrough-plans'))?.['Black 2:r4']?.slots[0]?.id===55);
   const result=await sample.evaluate(()=>JSON.parse(localStorage.getItem('takdex-v74-playthrough-plans'))['Black 2:r4'].slots[0]);
   for(const mode of ['duringMoves','plannedMoves']){
    const moves=result[mode].map(m=>m.replacement||m.move);
    assert.equal(moves.filter(Boolean).length,4,count+' actual moves · '+mode);
   }
   console.log('Four automatic choices in both modes with '+count+' actual moves');
   await sample.close();
  }
  for(const [game,move,expected] of [['Red','Thunderbolt',true],['Crystal','Earthquake',true],['Black 2','Earthquake',false]]){
   const sample=await browser.newPage({viewport:{width:412,height:850}});
   await sample.addInitScript(({game,move})=>{
    const party=[{id:143,name:'Snorlax',types:['normal']},game==='Red'?{id:112,name:'Rhydon',types:['ground','rock']}:{id:128,name:'Tauros',types:['normal']}];
    localStorage.setItem('poketact-teams',JSON.stringify([{id:'capacity',name:'Capacity',game,pokemon:party}]));
    const slots=party.map(p=>({...p,name:p.name.toLowerCase(),plannedMoves:[{move:move.toLowerCase(),purpose:'keep'}]}));
    localStorage.setItem('takdex-v74-playthrough-plans',JSON.stringify({[game+':capacity']:{game,slots}}));
   },{game,move});
   await sample.goto(process.argv[2]||'http://127.0.0.1:8795',{waitUntil:'domcontentloaded'});
   await sample.locator('[data-td71-toggle="capacity"]').click();
   await sample.locator('[data-td41-team-plan="capacity"]').click();
   await sample.getByText('Recommended improvements',{exact:true}).click();
   await sample.waitForFunction(game=>JSON.parse(localStorage.getItem('takdex-v74-playthrough-plans'))[game+':capacity'].slots.slice(0,2).every(p=>p.learnMethods),game);
   const demand=sample.getByText(move+': one TM copy in '+game,{exact:false});
   if(expected)await demand.waitFor();
   else assert.equal(await demand.count(),0);
   if(game==='Red'){
    await sample.locator('#dexTab').click();
    await sample.locator('#dexGame').selectOption('Red');
    await sample.locator('#dexInput').fill('mime');
    await sample.locator('#dexResults button').filter({hasText:/Mr.*Mime/}).first().click();
    const encounter=sample.locator('#td56DexEncounters');
    if(!await encounter.evaluate(el=>el.open))await encounter.locator('summary').click();
    const trade=encounter.locator('.td77-acquisition-entry').filter({hasText:'Trade Abra'}).first();
    await trade.waitFor();
    assert.match(await trade.textContent(),/Route 2.*Lv .*Trade Abra.*Diglett/);
   }
   console.log(game+' resource policy passed');
   await sample.close();
  }
  const capacity=await browser.newPage({viewport:{width:390,height:850},isMobile:true,hasTouch:true});
  await capacity.addInitScript(()=>{
   const game='Black 2',id='stones';
   const pokemon=[{id:58,name:'Growlithe',types:['fire']},{id:513,name:'Pansear',types:['fire']}];
   const slots=[{id:59,name:'arcanine',types:['fire'],originName:'growlithe'},{id:514,name:'simisear',types:['fire'],originName:'pansear'}];
   localStorage.setItem('poketact-teams',JSON.stringify([{id,name:'Stone planning',game,pokemon}]));
   localStorage.setItem('takdex-v74-playthrough-plans',JSON.stringify({[game+':'+id]:{game,slots,deadline:'badge-3'}}));
  });
  await capacity.goto(process.argv[2]||'http://127.0.0.1:8795',{waitUntil:'domcontentloaded'});
  await capacity.locator('[data-td71-toggle="stones"]').click();
  await capacity.locator('[data-td41-team-plan="stones"]').click();
  await capacity.getByText('Recommended improvements',{exact:true}).click();
  const stones=capacity.getByText('Fire Stone: 2 required',{exact:false});
  await stones.waitFor();
  assert.match(await stones.textContent(),/1 documented field copies.*remaining 1.*Battle Subway/);
  await capacity.locator('#td77Availability').selectOption('badge-6');
  await capacity.waitForFunction(()=>document.querySelector('#td77Improvements')?.textContent.includes('2 documented field copies'));
  assert.doesNotMatch(await stones.textContent(),/remaining 1/);
  console.log('Black 2 two-member Fire Stone plan reflects field supply and renewable BP');
  await capacity.close();
  const johto=await browser.newPage({viewport:{width:390,height:850},isMobile:true,hasTouch:true});
  await johto.goto(process.argv[2]||'http://127.0.0.1:8795',{waitUntil:'domcontentloaded'});
  await johto.locator('#dexTab').click();
  await johto.locator('#dexGame').selectOption('Gold');
  await johto.locator('#dexInput').fill('qwilfish');
  await johto.locator('#dexResults button').filter({hasText:'Qwilfish'}).first().click();
  const encounters=johto.locator('#td56DexEncounters');
  if(!await encounters.evaluate(el=>el.open))await encounters.locator('summary').click();
  const swarm=encounters.locator('.td77-acquisition-entry').filter({hasText:'Fisher Ralph'}).first();
  await swarm.waitFor();
  assert.match(await swarm.textContent(),/Route 32.*Rod.*swarm call/);
  console.log('Gold Qwilfish shows its rod and swarm prerequisites');
  await johto.close();
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
