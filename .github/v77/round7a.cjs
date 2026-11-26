const assert = require('node:assert/strict');
const { chromium } = require('playwright-core');
const { readFile } = require('node:fs/promises');
const { join } = require('node:path');

const base = process.argv[2] || 'http://127.0.0.1:8795';
const key = 'Black 2:r7a';
const game = 'Black 2';
const mon = (id, name, level, types, moves, pid, ability) => ({
 id, name, level, types, moves: moves.map(name => ({ name })), ability,
 saveStats: { pid, level }
});
const party = [
 mon(54, 'Psyduck', 14, ['water'], ['Water Sport', 'Scratch', 'Tail Whip'], 54),
 mon(504, 'Patrat', 8, ['normal'], ['Leer', 'Tackle'], 504),
 mon(58, 'Growlithe', 30, ['fire'], ['Flame Wheel', 'Bite'], 58, 'Intimidate'),
 mon(169, 'Crobat', 35, ['poison','flying'], ['Wing Attack', 'Bite'], 169),
 null, null
];
const move = name => ({ move:name, purpose:'keep' });
const slotFrom = (p, i, moves) => ({
 id:p.id, name:p.name.toLowerCase(), types:p.types, originPid:p.saveStats.pid,
 originName:p.name.toLowerCase(), originSlot:i, plannedMoves:moves.map(move),
 duringMoves:moves.map(move), finalManualSlots:[true,true,true,true],
 duringManualSlots:[true,true,true,true]
});
const slots = [
 { ...slotFrom(party[0],0,['water-gun','scratch','disable','tail-whip']), locked:true },
 slotFrom(party[1],1,['tackle','','','']),
 slotFrom(party[2],2,['flame-wheel','bite','','']),
 slotFrom(party[3],3,['wing-attack','bite','','']),
 null,null
];
const read = page => page.evaluate(key => JSON.parse(localStorage.getItem('takdex-v74-playthrough-plans'))[key],key);
const waitSpecies = (page,i,id) => page.waitForFunction(([key,i,id]) =>
 JSON.parse(localStorage.getItem('takdex-v74-playthrough-plans'))[key]?.slots[i]?.id===id,[key,i,id]);
const tile = (page,i) => page.locator(`#td4Slots [data-td4-slot="${i}"]`);
const editor = page => page.locator('#td4Edit > details').first();
async function setSlot(page,i,search=false){
 if(await tile(page,i).getAttribute('aria-expanded')!=='true')await tile(page,i).click();
 if(search&&!await editor(page).evaluate(el=>el.open))await editor(page).locator(':scope > summary').click();
}
async function preview(page,n){
 await page.locator('#td4Search').fill(n);
 await page.locator(`#td4SearchResults [data-value="${n}"]`).first().click();
 const host=page.locator('#td63ManualCandidate [data-td77-preview-context]');
 await host.waitFor();
 return host;
}
async function select(page,i,name,id){
 await setSlot(page,i,true);
 await (await preview(page,name)).locator('[data-td63-manual-select]').click();
 await waitSpecies(page,i,id);
}
const readMoves = entries => entries.map(m=>m.purpose==='temporary'?m.replacement:m.move);
const stats = page => page.locator('[data-td77-resource="Fire Stone"] dd').allTextContents();
async function switchMode(page,mode){await page.locator(`[data-view="${mode}"]`).click();}
async function open(page){
 await page.goto(base,{waitUntil:'domcontentloaded'});
 if(!await page.locator('[data-td41-team-plan="r7a"]').isVisible())await page.locator('[data-td71-toggle="r7a"]').click();
 await page.locator('[data-td41-team-plan="r7a"]').click();
 await page.waitForFunction(key=>JSON.parse(localStorage.getItem('takdex-v74-playthrough-plans'))[key]?.slots[0]?.legalMoves?.length,key);
}

(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:412,height:860},isMobile:true,hasTouch:true,reducedMotion:'reduce',serviceWorkers:'block'});
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(({game,key,party,slots})=>{
   if(!localStorage.getItem('poketact-teams'))localStorage.setItem('poketact-teams',JSON.stringify([{id:'r7a',name:'Black 2 plan',game,pokemon:party,
    saveLink:{progression:{badgeCount:3}}}]));
   if(!localStorage.getItem('takdex-v74-playthrough-plans'))localStorage.setItem('takdex-v74-playthrough-plans',JSON.stringify({[key]:{game,slots,deadline:'pre-league'}}));
  },{game,key,party,slots});
  await open(page);
  await setSlot(page,0);
  const actualBefore=await page.evaluate(()=>localStorage.getItem('poketact-teams'));
  const expectedRows=[['water-sport','water-gun','false'],['scratch','scratch','true'],['tail-whip','tail-whip','true'],['','disable','false']];
  const rows=page.locator('#td41MoveSlots [data-td77-actual-move]');
  const rowData=()=>rows.evaluateAll(list=>list.map(e=>[e.dataset.td77ActualMove,e.dataset.td77PlannedMove,e.dataset.td77Retained]));
  assert.deepEqual(await rowData(),expectedRows);
  const progress=page.locator('#td4PlanProgress span').filter({hasText:'Planned moves already known'});
  assert.equal(await progress.locator('strong').textContent(),'7/9');
  await switchMode(page,'during');
  assert.deepEqual(await rowData(),expectedRows);
  assert.equal(await progress.locator('strong').textContent(),'7/9');
  await switchMode(page,'final');
  const target=page.getByRole('combobox',{name:'Final moveset target'});
  await target.selectOption('55');
  await waitSpecies(page,0,55);
  let plan=await read(page);
  assert.equal(plan.slots[0].acquisitionRoute.id,'54|owned|54');
  assert.equal(plan.slots[0].locked,true);
  assert.equal(plan.slots[0].finalTarget,undefined);
  assert.deepEqual(readMoves(plan.slots[0].plannedMoves),readMoves(slots[0].plannedMoves));
  assert.deepEqual(await rowData(),expectedRows);
  assert.match(await tile(page,0).textContent(),/Psyduck.*Golduck.*Planned evolution/);
  await switchMode(page,'during');
  assert.match(await page.locator('#td41MoveSlots').textContent(),/Psyduck learnset/);
  assert.equal(await progress.locator('strong').textContent(),'7/9');
  await setSlot(page,1);
  assert.deepEqual((await rowData()).find(row=>row[0]==='tackle'),['tackle','tackle','true']);
  await switchMode(page,'final');
  console.log('Retained move alignment in both modes, Patrat Tackle, 7/9 learned, Golduck route and plan persistence');
  await setSlot(page,2);
  await target.selectOption('59');
  await waitSpecies(page,2,59);
  await setSlot(page,2,true);
  await page.locator('#td4Candidates [data-candidate-id]').first().waitFor();
  assert.equal(await page.locator('#td4Candidates [data-candidate-id="58"]').count(),0);
  assert.match(await tile(page,2).textContent(),/Growlithe.*Arcanine/);

  await setSlot(page,4,true);
  const vulpix=await preview(page,'vulpix');
  const endpoint=vulpix.locator('[data-td77-plan-endpoint="ninetales"]');
  await endpoint.waitFor();
  assert.match(await endpoint.locator('..').textContent(),/Fire Stone.*After planning deadline/);
  await vulpix.locator('[data-td63-manual-select]').click();
  await waitSpecies(page,4,37);
  await target.selectOption('38');
  await waitSpecies(page,4,38);
  plan=await read(page);
  assert.equal(plan.slots[4].acquisitionRoute.startId,37);
  assert.match(plan.slots[4].acquisitionRoute.id,/Abundant Shrine/i);
  assert.equal(readMoves(plan.slots[4].plannedMoves).filter(Boolean).length,4);
  assert.match(await page.locator('#td41MoveSlots').textContent(),/Theoretical Final moves.*After planning deadline/);
  const downgrade=await preview(page,'vulpix');
  assert.match(await downgrade.textContent(),/earlier evolutionary stage of planned Ninetales/);
  await downgrade.locator('[data-td77-cancel-preview]').click();
  const improve=page.locator('#td77Improvements').locator('..');
  await improve.locator(':scope > summary').click();
  await page.locator('[data-td77-resource="Fire Stone"]').waitFor();
  assert.deepEqual((await stats(page)).slice(0,3),['2','1','1']);

  await setSlot(page,4);
  const route=page.locator('#td77SlotRoute [data-td77-route]:visible,#td63ManualCandidate [data-td77-route]:visible').first();
  const direct=await route.locator('option').evaluateAll(options=>options.find(o=>o.value.startsWith('38|'))?.value);
  assert.ok(direct,'Black 2 direct Ninetales encounter must be selectable');
  await route.selectOption(direct);
  await page.waitForFunction(key=>JSON.parse(localStorage.getItem('takdex-v74-playthrough-plans'))[key].slots[4]?.acquisitionRoute?.startId===38,key);
  assert.deepEqual((await stats(page)).slice(0,3),['1','1','0']);
  console.log('Black 2 Fire Stone total 2 / before 1 / after 1 via Vulpix; direct Ninetales total 1 / before 1 / after 0');

  await select(page,5,'magmar',126);
  let coverage=page.locator('#td4Coverage');
  await coverage.locator('..').locator(':scope > summary').click();
  await coverage.getByText(/3 weak/).first().waitFor();
  assert.match(await coverage.textContent(),/Water\s*3 weak · 1 resist · 0 immune/i);
  assert.match(await coverage.textContent(),/Ground\s*3 weak · 0 resist · 1 immune/i);
  assert.match(await coverage.textContent(),/Rock\s*[34] weak · 0 resist/i);
  const roles=coverage.getByText('Team roles',{exact:true});
  await roles.click();
  assert.match(await roles.locator('..').textContent(),/Arcanine.*Ninetales/s);
  assert.match(await coverage.textContent(),/Partially compensated/);
  assert.equal(await page.locator('#td4League').getByText(/Ninetales ·/).count(),0);
  await select(page,1,'floatzel',419);
  await select(page,3,'vaporeon',134);
  assert.match(await coverage.textContent(),/Well compensated.*Water\s*3 weak · [23] resist/s);
  console.log('Intended team shows three Fire weaknesses, compensated and partial groups, and roles; late Ninetales excluded from League readiness');

  await select(page,3,'crobat',169);
  const readReadiness=()=>page.locator('#td77Gyms .td42-league-group,#td4League .td42-league-group').evaluateAll(groups=>
   groups.map(group=>({actual:group.dataset.readinessStatus, rows:[...group.querySelectorAll('.td64-league-pair > span:last-child')].map(el=>el.className.split('-').pop())})));
  for(const {actual,rows} of await readReadiness()){
   const expected=rows.includes('bad')?'bad':!rows.length||rows.includes('unknown')?'unknown':rows.includes('nonstab')?'nonstab':'good';
   assert.equal(actual,expected);
  }
  console.log('Gym and League aggregates agree with each opponent indicator');
  await setSlot(page,4);
  page.once('dialog',dialog=>dialog.accept());
  await page.locator('#td4Clear').click();
  assert.equal((await read(page)).slots[4],null);

  const improvements=page.locator('#td77Improvements');
  const finalButton=improvements.locator('[data-td77-apply-move]').first();
  const openOffer=async button=>{
   await button.locator('..').locator(':scope > summary').waitFor({state:'attached'});
   await button.evaluate(el=>{let p=el.parentElement;while(p&&p.id!=='td77Improvements'){if(p.tagName==='DETAILS')p.open=true;p=p.parentElement;}});
   return button.locator('..').locator(':scope > summary').textContent();
  };
  await finalButton.waitFor({state:'attached'});
  const finalOffer=await openOffer(finalButton);
  const oldPlan=await read(page);
  assert.doesNotMatch(finalOffer,/Golduck|Ninetales/);
  page.once('dialog',dialog=>dialog.dismiss());
  await finalButton.click();
  assert.deepEqual((await read(page)).slots,oldPlan.slots);
  page.once('dialog',dialog=>dialog.accept());
  await finalButton.click();
  const after=await read(page);
  assert.equal(after.slots.filter((p,i)=>JSON.stringify(p?.plannedMoves)!==JSON.stringify(oldPlan.slots[i]?.plannedMoves)).length,1);
  assert.deepEqual(after.slots.map(p=>p?.duringMoves),oldPlan.slots.map(p=>p?.duringMoves));

  await switchMode(page,'during');
  const duringButton=improvements.locator('[data-td77-apply-move]').first();
  await duringButton.waitFor({state:'attached'});
  const duringOffer=await openOffer(duringButton);
  assert.doesNotMatch(duringOffer,/Golduck|Ninetales/);
  const teammate=duringOffer.split(':')[0].trim();
  const display=after.slots.findIndex(p=>p&&new RegExp(p.name,'i').test(teammate));
  await setSlot(page,display);
  await page.locator('#td77SuggestMoves').click();
  const individual=page.locator('#td5TeamProposals [data-td64-alt]').first();
  await individual.waitFor();
  assert.match(duringOffer,new RegExp((await individual.textContent()).replace('Select ',''),'i'));
  const duringBefore=await read(page);
  page.once('dialog',dialog=>dialog.accept());
  await individual.click();
  const duringAfter=await read(page);
  assert.equal(duringAfter.slots.filter((p,i)=>JSON.stringify(p?.duringMoves)!==JSON.stringify(duringBefore.slots[i]?.duringMoves)).length,1);
  assert.deepEqual(duringAfter.slots.map(p=>p?.plannedMoves),duringBefore.slots.map(p=>p?.plannedMoves));
  assert.equal(await page.evaluate(()=>localStorage.getItem('poketact-teams')),actualBefore);
  console.log('Team and individual recommendations share mode-aware options. Final:',finalOffer,'During:',duringOffer);
  assert.deepEqual(errors,[]);
  await page.close();

  const legacy = await browser.newPage({viewport:{width:390,height:840},isMobile:true,hasTouch:true,serviceWorkers:'block'});
  await legacy.addInitScript(({game,key,party,slots})=>{
   localStorage.setItem('poketact-teams',JSON.stringify([{id:'r7a',name:'Legacy Black 2 plan',game,pokemon:party}]));
   const pokemon={...slots[0],acquisitionRoute:{id:'54|owned|54',startId:54,startLevel:14},
    finalTarget:{id:55,name:'golduck',types:['water']}};
   localStorage.setItem('takdex-v74-playthrough-plans',JSON.stringify({[key]:{game,slots:[pokemon]}}));
  },{game,key,party,slots});
  await open(legacy);
  const migrated=(await read(legacy)).slots[0];
  assert.equal(migrated.id,55);
  assert.equal(migrated.acquisitionRoute.id,'54|owned|54');
  assert.equal(migrated.finalTarget,undefined);
  assert.equal(migrated.locked,true);
  assert.deepEqual(readMoves(migrated.plannedMoves),readMoves(slots[0].plannedMoves));
  await setSlot(legacy,0);
  assert.match(await tile(legacy,0).textContent(),/Psyduck.*Golduck.*Planned evolution/);
  console.log('Legacy separate Final target migrated without altering moves, route or lock');
  await legacy.close();

  if(process.env.TAKDEX_REFERENCE_SAVES){
   const retail=await browser.newPage({viewport:{width:412,height:860},isMobile:true,hasTouch:true,
    reducedMotion:'reduce',serviceWorkers:'block'});
   const retailErrors=[];
   retail.on('pageerror',error=>retailErrors.push(error.message));
   await retail.addInitScript(game=>{
    localStorage.setItem('poketact-teams',JSON.stringify([{id:'retail',name:'Retail save',game,pokemon:Array(6).fill(null)}]));
    localStorage.setItem('takdex-v71-active-team','retail');
   },game);
   await retail.goto(base,{waitUntil:'domcontentloaded'});
   const fixture=join(process.env.TAKDEX_REFERENCE_SAVES,'black2.sav');
   const before=await readFile(fixture);
   await retail.locator('[data-save-file]').setInputFiles(fixture);
   await retail.waitForFunction(()=>JSON.parse(localStorage.getItem('poketact-teams'))[0].saveLink?.progression?.postgame===true);
   await retail.evaluate(()=>window.td41OpenTeamPlan('retail'));
   await retail.waitForFunction(()=>document.querySelector('#td77ActualProgress')?.textContent.includes('Postgame unlocked'));
   const progress=retail.locator('#td4PlanProgress span').filter({hasText:'Planned moves already known'}).locator('strong');
   const value=await progress.textContent();
   assert.ok(Number(value.split('/')[0])>0,value);
   assert.match(await tile(retail,3).textContent(),/Watchog/);
   assert.ok((await readFile(fixture)).equals(before));
   assert.deepEqual(retailErrors,[]);
   console.log('Retail Black 2 file picker, postgame progression and retained known moves ('+value+'); source save unchanged');
   await retail.close();
  }else console.log('Retail Black 2 browser import not tested: TAKDEX_REFERENCE_SAVES unavailable');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
