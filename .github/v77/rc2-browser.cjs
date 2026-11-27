const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const {chromium} = require('playwright-core');

const candidate = process.argv[2] || 'http://127.0.0.1:8823/';
const baseline = process.argv[3] || 'http://127.0.0.1:8822/';
const root = process.env.TAKDEX_EVIDENCE || '/workspace/work/checks/v77.2-rc2';

function fixture() {
 const game = 'Black 2', id = 'rc2';
 const psyduck = {id:54,name:'Psyduck',types:['water'],level:12,moves:[{name:'Scratch',type:'normal',power:40,damageClass:'physical',accuracy:100}]};
 const patrat = {id:504,name:'Patrat',types:['normal'],level:12,moves:[]};
 const plan = (mon, moves, rest={}) => ({
  ...mon,name:mon.name.toLowerCase(),plannedMoves:moves.map(move=>({move,purpose:'keep'})),
  finalManualSlots:[true,true,true,true],confirmedCandidate:true,...rest
 });
 const slots = [
  plan({id:196,name:'Espeon',types:['psychic']},['psychic','shadow-ball'],{duringTargetId:133,duringSpecies:'eevee',duringMoves:[{move:'quick-attack',purpose:'keep'}]}),
  plan(psyduck,['scratch','water-pulse','ice-punch','thief'],{originName:'psyduck',originSlot:1}),
  plan(patrat,[],{originName:'patrat',originSlot:2})
 ];
 localStorage.setItem('poketact-teams',JSON.stringify([{id,game,name:'RC2 team',pokemon:[null,psyduck,patrat,null,null,null],saveLink:{progression:{badgeCount:2}}}]));
 localStorage.setItem('takdex-v74-playthrough-plans',JSON.stringify({[game+':'+id]:{game,slots,deadline:'pre-league',progress:'badge-2'}}));
}

(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  for(const width of (process.env.TAKDEX_WIDTHS||'360,412,1280').split(',').map(Number)){
   const context=await browser.newContext({viewport:{width,height:900},hasTouch:width<600,isMobile:width<600,reducedMotion:'reduce',ignoreHTTPSErrors:true,serviceWorkers:'block'});
   const page=await context.newPage();
   page.setDefaultTimeout(12000);
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.addInitScript(fixture);
   const dir=path.join(root,String(width));
   await fs.mkdir(dir,{recursive:true});
   const loc=selector=>page.locator(selector);
   const tile=i=>loc(`#td4Slots [data-td4-slot="${i}"]`);
   const click=selector=>loc(selector).first().click();
   const openPlanner=async url=>{
    await page.goto(url,{waitUntil:'domcontentloaded'});
    await click('[data-td71-toggle="rc2"]');
    await click('[data-td41-team-plan="rc2"]');
    await page.waitForFunction(()=>document.querySelector('[data-td4-slot="0"]').textContent.includes('Eevee'));
   };
   const shots=async(name,target)=>{
    if(target)await target.first().evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
    if(target)await target.first().evaluate(el=>Promise.all([...el.querySelectorAll('img')].filter(img=>img.getBoundingClientRect().top<innerHeight).map(img=>img.decode().catch(()=>{}))));
    await page.screenshot({path:path.join(dir,name+'.png'),animations:'disabled'});
   };
   const heights=selector=>loc(selector).evaluateAll(els=>els.map(el=>Number(el.getBoundingClientRect().height.toFixed(1))));
   const slotHeights=()=>heights('#td4Slots [data-td4-slot]').then(rows=>rows.slice(0,4));
   const recommendations=loc('#td4Candidates [data-candidate-id]');
   const showCandidates=async(i)=>{
    await tile(i).click();
    const settings=loc('#td4Edit > details').first();
    if(!await settings.evaluate(el=>el.open))await settings.locator(':scope > summary').click();
    await recommendations.first().waitFor();
   };
   const reviewRank=async()=>{
    await page.waitForFunction(()=>[...document.querySelectorAll('#td4Candidates [data-candidate-id]')]
     .slice(0,2).every(el=>/offensive coverage|no coverage changes/i.test(el.textContent)));
    return recommendations.first().getAttribute('data-candidate-id');
   };

   await openPlanner(baseline);
   const beforeSlots=await slotHeights();
   await shots('rc1-team',loc('#td4Slots'));
   await showCandidates(0);
   const firstRank=await reviewRank();
   const beforeRanks=(await heights('#td4Candidates [data-candidate-id]')).slice(0,3);
   await shots('rc1-recommendations',recommendations);

   await openPlanner(candidate);
   const afterSlots=await slotHeights();
   assert.ok(afterSlots[0]<beforeSlots[0]-20);
   assert.ok(afterSlots[2]<beforeSlots[2]-20);
   assert.equal(afterSlots[0],afterSlots[1]);
   const geometry=await loc('#td4Slots').evaluate(grid=>{
    const cards=[...grid.querySelectorAll('[data-td4-slot]')].slice(0,2);
    return cards.map(card=>['.td772-stage img','.td772-stage strong','.td772-stage .pills','.td772-plan-status',
     ...[1,2,3,4].map(n=>'.td42-tile-moves > :nth-child('+n+')')].map(sel=>
      Number(card.querySelector(sel).getBoundingClientRect().top.toFixed(1))));
   });
   assert.deepEqual(geometry[0],geometry[1]);
   assert.equal(await tile(0).locator('.td773-sr-only').count(),2);
   assert.deepEqual(await tile(0).locator('.td772-stage strong').allTextContents(),['Eevee','Espeon']);
   await shots('rc2-team',loc('#td4Slots'));
   await showCandidates(0);
   assert.equal(await reviewRank(),firstRank);
   const afterRanks=(await heights('#td4Candidates [data-candidate-id]')).slice(0,3);
   assert.ok(afterRanks[0]<beforeRanks[0]-30);
   const coverage='.td773-coverage', acquisition='.td80-candidate-acquisition';
   assert.ok(await recommendations.evaluateAll(cards=>cards.every(el=>[...el.querySelectorAll('details')].every(x=>!x.open))));
   await shots('rc2-recommendations',recommendations);
   const krook=loc('#td4Candidates [data-candidate-id="553"]');
   const rank=await krook.count()?krook:recommendations.first();
   const next=recommendations.nth(1);
   const header=await rank.locator('button[data-td4-candidate]').evaluate(button=>{
    const rect=sel=>button.querySelector(sel).getBoundingClientRect();
    const [art,name,types,preview,bst]=['img','strong','.pills','.td772-preview-label','.td773-candidate-meta small'].map(rect);
    return {columns:art.right<=name.left&&name.left<preview.left,
     stacked:name.bottom<=types.top&&preview.bottom<=bst.top,align:Math.abs(preview.right-bst.right)<1};
   });
   assert.deepEqual(header,{columns:true,stacked:true,align:true});
   await rank.locator(coverage+' summary').click();
   assert.ok(await rank.locator(coverage).evaluate(el=>el.open));
   assert.equal(await rank.locator(acquisition).evaluate(el=>el.open),false);
   assert.equal(await next.locator(coverage).evaluate(el=>el.open),false);
   assert.equal(await loc('#td63ManualCandidate [data-td77-preview-context]').count(),1);
   const labels=await rank.locator('.td773-coverage-grid h4').allTextContents();
   assert.ok(labels.includes('Defensive coverage'));
   assert.ok(labels.some(label=>label.includes('STAB')));
   assert.ok(await rank.locator('.td773-coverage-grid section > div:nth-of-type(2) .pill').count());
   assert.ok(await rank.locator('.td773-coverage-grid [aria-label="None"]').count());
   await shots('rc2-expanded-coverage',rank);
   await rank.locator(acquisition+' summary').click();
   assert.ok(await rank.locator(coverage).evaluate(el=>el.open));
   await rank.locator(coverage+' summary').click();
   assert.ok(await rank.locator(acquisition).evaluate(el=>el.open));
   assert.ok(await rank.locator(acquisition+' summary > span > small').isVisible());
   await shots('rc2-expanded-acquisition',rank);
   if(width===412){
    const button=rank.locator('button[data-td4-candidate]');
    await button.scrollIntoViewIfNeeded();
    const rect=await button.boundingBox();
    await page.mouse.move(rect.x+rect.width/2,rect.y+rect.height/2);
    await page.mouse.down();
    await loc('dialog[open] [data-compare-confirm]').waitFor();
    await page.mouse.up();
    await click('dialog[open] [data-compare-cancel]');
   }
   console.log(JSON.stringify({width,slots:{rc1:beforeSlots,rc2:afterSlots},recommendations:{rc1:beforeRanks,rc2:afterRanks}}));

   const searchCandidate=async name=>{
    await loc('#td4Search').fill(name);
    await click(`#td4SearchResults [data-value="${name}"]`);
    await loc('#td63ManualCandidate [data-td77-preview-context]').waitFor();
   };
   await searchCandidate('vaporeon');
   assert.match(await loc('#td63ManualCandidate .td773-candidate-meta').textContent(),/BST 525\s*$/);
   await shots('rc2-equal-bst',loc('#td63ManualCandidate'));
   await searchCandidate('eevee');
   const evolution=loc('.td772-evolution-choices [data-td77-plan-endpoint="espeon"]').locator('..');
   assert.match(await evolution.locator('b').textContent(),/Eevee → Espeon/);
   assert.match(await evolution.locator('small').first().textContent(),/friendship.*day/i);
   await shots('rc2-evolution-choice',evolution);

   const timing=target=>loc(`[data-td77-planned-move="${target}"] .td62-move-timing`).first();
   for(const [move,summary,area] of [['psychic','TM29 · Route 13','southeast'],['shadow-ball','TM30 · Reversal Mountain','behind Strange House']]){
    const route=timing(move);
    assert.equal((await route.locator(':scope > summary').textContent()).trim(),summary);
    assert.equal(await route.locator('summary.td63-danger').count(),1);
    await shots('rc2-'+move+'-collapsed',route.locator('..'));
    await route.locator('summary').click();
    const details=(await route.locator('.td773-move-route > small').allTextContents()).map(s=>s.trim());
    assert.ok(details.includes('After badge 6'));
    assert.ok(details.includes(area));
    assert.ok(details.every(text=>!text.includes('Later than current progress')));
    if(move==='psychic'){
     assert.ok(details.includes('Requires Surf'));
     assert.ok(details.some(text=>text.startsWith('Learns at Lv.')));
    }
    await shots('rc2-'+move+'-expanded',route.locator('..'));
    await route.getByRole('button').first().click();
    await loc('#mapsContent').waitFor();
    await click('#backMaps');
    assert.ok(await route.evaluate(el=>el.open));
    await route.locator('summary').click();
   }
   await tile(1).click();
   await timing('ice-punch').waitFor();
   assert.match(await timing('water-pulse').textContent(),/Learns at Lv\. 18 · 6 to go/);
   assert.match(await timing('ice-punch').textContent(),/Tutor · Driftveil City/);
   await timing('ice-punch').locator('summary').click();
   await shots('rc2-level-and-tutor',loc('#td41MoveSlots'));
   const uncertain=timing('thief');
   await uncertain.locator('summary').click();
   assert.match(await uncertain.textContent(),/TM46 · Virbank Complex/);
   assert.match(await uncertain.textContent(),/Timing unverified/);
   await shots('rc2-unverified-timing',uncertain.locator('..'));
   await showCandidates(5);
   const emptyCandidate=recommendations.first();
   await emptyCandidate.locator('.td773-coverage summary').click();
   assert.match(await emptyCandidate.locator('.td773-candidate-meta small').textContent(),/^BST \d+$/);
   assert.equal(await emptyCandidate.locator('.td773-coverage-grid section > div:nth-of-type(2) .pill').count(),0);
   await shots('rc2-empty-slot-candidate',emptyCandidate);
   await click('#td4Back');

   await click('#dexTab');await click('#openTypeExplorer');
   const dimensions=(select,button)=>page.evaluate(([select,button])=>[select,button].map(sel=>{
    const el=document.querySelector(sel),r=el.getBoundingClientRect(),css=getComputedStyle(el);
    return [r.width,r.height,Math.round(r.top),css.borderRadius];
   }),[select,button]);
   const dexSizes=await dimensions('#typeExplorerGame','#td772ExplorerFilters');
   await shots('rc2-pokemon-by-type',loc('#typeExplorerPage'));
   await click('#moreTab');await click('#td68OpenMove');await click('#td72MoveTypeToggle');
   const moveSizes=await dimensions('#td72MoveTypeGame','#td72MoveFilters');
   assert.deepEqual(moveSizes.map(([w,h,,radius])=>[w,h,radius]),dexSizes.map(([w,h,,radius])=>[w,h,radius]));
   await loc('#td72MoveTypeGame').selectOption('Black 2');
   await click('#td72MoveFilters');await loc('#td5FilterMode').selectOption('team');
   await loc('#td5FilterTeam').selectOption('rc2');
   await click('#td72MoveFilters');
   assert.equal(await loc('#td72MoveFilters').getAttribute('aria-expanded'),'false');
   assert.ok(await loc('#td72MoveFilters').evaluate(el=>el.classList.contains('selected')));
   await click('#td72MoveTypeChoices [data-td72-move-type="water"]');
   const water=loc('#td72MoveTypeResults [data-td72-type-move="water-gun"]');
   await water.waitFor();
   assert.match(await water.textContent(),/Psyduck/);
   await shots('rc2-moves-by-type-filtered',loc('#td72MoveTypePanel'));
   await water.click();
   await click('#td68MoveResult .td64-move-back');
   assert.ok(await water.isVisible());
   assert.equal(await loc('#td5FilterTeam').inputValue(),'rc2');
   assert.equal(await loc('#td72MoveFilters').getAttribute('aria-expanded'),'false');
   await click('#td72MoveFilters');await loc('#td5FilterMode').selectOption('');
   await shots('rc2-moves-by-type-filter',loc('#td68MovePage'));

   await click('#moreTab');await click('#td59OpenOffline');
   const legend=await loc('#td59Legend li').evaluateAll(rows=>rows.map(row=>{
    const r=row.getBoundingClientRect();return [r.x,r.y,row.textContent.trim()];
   }));
   assert.equal(legend.length,4);
   assert.equal(legend[0][1],legend[1][1]);
   assert.equal(legend[2][1],legend[3][1]);
   assert.equal(legend[0][0],legend[2][0]);
   assert.equal(legend[1][0],legend[3][0]);
   await shots('rc2-pack-legend',loc('#td59OfflinePage'));
   assert.deepEqual(errors,[]);
   await context.close();
  }
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
