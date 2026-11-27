const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const path=require('node:path');
const {chromium}=require('playwright-core');

const root=process.env.TAKDEX_EVIDENCE||'/workspace/work/checks/rc3';
const target=process.argv[2]||'http://127.0.0.1:8833/';
const baseline=process.argv[3]||'http://127.0.0.1:8832/';

function fixture(){
 const game='Black 2';
 const move=(name,type,power,damageClass,accuracy=100)=>({name,type,power,damageClass,accuracy});
 const mon=(id,name,types,moves=[],level=25)=>({id,name,types,moves,level,
  image:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/'+id+'.png'});
 const plan=(pokemon,moves,extra={})=>({...pokemon,name:pokemon.name.toLowerCase(),confirmedCandidate:true,
  plannedMoves:moves.map(name=>({move:name,purpose:'keep'})),finalManualSlots:[true,true,true,true],...extra});
 const purrloin=mon(509,'Purrloin',['dark'],[move('Scratch','normal',40,'physical'),move('Fury Swipes','normal',18,'physical',80)]);
 const growlithe=mon(58,'Growlithe',['fire']);
 const tepig=mon(498,'Tepig',['fire'],[move('Tackle','normal',50,'physical'),move('Ember','fire',40,'special')]);
 const emboar=mon(500,'Emboar',['fire','fighting']);
 const psyduck=mon(54,'Psyduck',['water'],[move('Water Gun','water',40,'special')],30);
 const golduck=mon(55,'Golduck',['water']);
 const patrat=mon(504,'Patrat',['normal'],[move('Tackle','normal',50,'physical')],5);
 const espeon=mon(196,'Espeon',['psychic']);
 const first=[plan(growlithe,['flame-wheel','flamethrower'],{originName:'purrloin',originSlot:0}),
  plan(emboar,['hammer-arm','flare-blitz'],{originName:'tepig',originSlot:1}),
  plan(golduck,['water-gun','ice-punch'],{originName:'psyduck',originSlot:2,locked:true})];
 const second=[plan(patrat,[],{originName:'patrat',originSlot:0}),
  plan(espeon,['psychic','shadow-ball','quick-attack','helping-hand'],{duringTargetId:133,duringSpecies:'eevee',duringMoves:[]})];
 localStorage.setItem('poketact-teams',JSON.stringify([
  {id:'rc3-pairs',name:'RC3 pairs',game,pokemon:[purrloin,tepig,psyduck,null,null,null],saveLink:{progression:{badgeCount:2}}},
  {id:'rc3-weak',name:'RC3 weaknesses',game,pokemon:[patrat,null,null,null,null,null],saveLink:{progression:{badgeCount:2}}}
 ]));
 localStorage.setItem('takdex-v74-playthrough-plans',JSON.stringify({
  [game+':rc3-pairs']:{game,slots:first,deadline:'pre-league'},
  [game+':rc3-weak']:{game,slots:second,deadline:'pre-league'}
 }));
}

(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  for(const width of (process.env.TAKDEX_WIDTHS||'360,412,1280').split(',').map(Number)){
   const context=await browser.newContext({viewport:{width,height:900},isMobile:width<600,hasTouch:width<600,reducedMotion:'reduce',ignoreHTTPSErrors:true,serviceWorkers:'block'});
   const page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.setDefaultTimeout(14000);
   await page.addInitScript(fixture);
   const dir=path.join(root,String(width));
   await fs.mkdir(dir,{recursive:true});
   const loc=s=>page.locator(s);
   const click=s=>loc(s).first().click();
   const tile=index=>loc(`#td4Slots [data-td4-slot="${index}"]`);
   const open=async(url,id)=>{
    await page.goto(url,{waitUntil:'domcontentloaded'});
    await click(`[data-td71-toggle="${id}"]`);
    await click(`[data-td41-team-plan="${id}"]`);
    await page.waitForFunction(()=>document.querySelector('#td77SlotRoute')&&document.querySelector('#td4Slots .movechip'));
   };
   const disclosure=async selector=>{
    const el=loc(selector).first();
    if(!await el.evaluate(node=>node.open))await el.locator(':scope > summary').click();
   };
   const shots=async(name,selector)=>{
    const el=loc(selector).first();
    await el.waitFor();
    await el.evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
    await el.evaluate(el=>Promise.race([Promise.all([...el.querySelectorAll('img')].map(i=>i.decode().catch(()=>{}))),new Promise(resolve=>setTimeout(resolve,2500))]));
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
    await page.screenshot({path:path.join(dir,name+'.png'),animations:'disabled'});
   };
   const bounds=()=>loc('#td4Slots').evaluate(grid=>{
    const cards=[...grid.querySelectorAll('[data-td4-slot]')].slice(0,2);
    return cards.map(card=>{
     const rect=card.getBoundingClientRect(),rows=[...card.querySelectorAll('.td42-tile-moves > *')];
     const names=[...card.querySelectorAll('.movechip > span')].map(el=>{
      const range=document.createRange();range.selectNodeContents(el);
      const rect=range.getBoundingClientRect();
      return {name:el.textContent,lines:range.getClientRects().length,height:+rect.height.toFixed(1),font:getComputedStyle(el).fontSize};
     });
     return {height:+rect.height.toFixed(1),rows:rows.map(el=>+el.getBoundingClientRect().height.toFixed(1)),names};
    });
   });
   await open(baseline,'rc3-pairs');
   const before=await bounds();
   await shots('rc2-pairs','#td4Slots');
   await open(target,'rc3-pairs');
   await page.waitForFunction(()=>document.querySelector('[data-td4-slot="0"] .td774-single-line'));
   const after=await bounds();
   assert.deepEqual(after[0].rows,after[1].rows);
   assert.ok(after[0].names.find(n=>n.name==='Flame Wheel').lines===1);
   assert.ok(after[1].names.find(n=>n.name==='Hammer Arm').lines===1);
   assert.ok(after[0].names.some(n=>n.name==='Flamethrower'));
   assert.ok(await tile(0).locator('.movechip > span').evaluateAll(names=>names.every(el=>{
    const range=document.createRange();range.selectNodeContents(el);
    const box=el.parentElement.getBoundingClientRect();
    return [...range.getClientRects()].every(rect=>rect.left>=box.left-1&&rect.right<=box.right+1);
   })));
   await page.waitForFunction(()=>document.querySelector('[data-td4-slot="2"] .td774-evolution-arrow')?.textContent.includes('Lv. 33'));
   assert.equal(await tile(0).locator('.td774-evolution-arrow').count(),0);
   await shots('rc3-pairs','#td4Slots');
   await tile(2).click();
   await disclosure('#td4Edit > details');
   const selected=loc('#td63ManualCandidate [data-td77-preview-context]');
   await selected.waitFor();
   assert.match(await selected.locator('.td772-preview-label').textContent(),/Selected/);
   assert.equal(await selected.locator('[data-td63-manual-select]').count(),0);
   assert.equal(await loc('#td63SelectedReplacement').textContent(),'');
   assert.match(await selected.locator('.td774-route-choice').textContent(),/Use owned Psyduck.*Evolve at Lv\. 33/s);
   assert.equal(await loc('#td77Legendary').isVisible(),false);
   assert.match(await loc('#td4CandidateStatus').textContent(),/Replacement locked/);
   assert.equal(await loc('#td77FinalForm select').isEnabled(),true);
   await shots('rc3-locked','#td4Edit > details');
   await disclosure('#td5TeamOptimize');
   await loc('#td5TeamProposals [data-td64-alt]').first().waitFor();
   await loc('#td5TeamOptimize > summary').click();
   await click('#td77Lock');
   assert.ok(await loc('#td77Legendary').isVisible());

   await open(target,'rc3-weak');
   const shared=loc('[data-td774-shared-weakness="fighting"]');
   await disclosure('details:has(> #td77Improvements)');
   await disclosure('#td77Improvements .td78-category:first-child');
   assert.equal(await shared.count(),0);
   await click('[data-view="during"]');
   await shared.waitFor();
   assert.match(await shared.textContent(),/2 weak · Patrat, Eevee/);
   await disclosure('details:has(> #td4Coverage)');
   const defense=loc('.td774-defensive');
   assert.match(await defense.textContent(),/Fighting\s+2 weak/);
   await shots('rc3-defensive','.td774-defensive');
   await click('[data-view="final"]');
   assert.equal(await shared.count(),0);
   const proposal=loc('.td772-team-proposal').first();
   await proposal.waitFor();
   await proposal.locator(':scope > summary').click();
   assert.equal(await proposal.locator('.td43-candidate-pick').count(),0);
   assert.equal(await proposal.locator('.td79-pokemon-compare img').count(),2);
   assert.equal(await proposal.locator('.td82-base-stats').count(),1);
   await shots('rc3-pokemon-improvement','.td772-team-proposal');
   const moves=loc('#td77Improvements .td78-category').filter({hasText:'Move improvements'});
   if(!await moves.evaluate(n=>n.open))await moves.locator(':scope > summary').click();
   const improvement=moves.locator('details').filter({hasText:'Crunch'}).first();
   const move=await improvement.count()?improvement:moves.locator('details').first();
   await move.locator(':scope > summary').click();
   assert.ok(await move.locator('.td774-move-metrics').count());
   await shots('rc3-move-improvement','.td79-move-compare');
   const paired=moves.locator('details:has(.td79-move-compare > button:first-child)').first();
   await paired.waitFor({state:'attached'});
   if(!await paired.evaluate(el=>el.open))await paired.locator(':scope > summary').click();
   assert.equal(await paired.locator('.td774-move-metrics').count(),2);
   await shots('rc3-paired-improvement','#td77Improvements .td79-move-compare:has(>button:first-child)');

   await tile(1).click();
   await disclosure('#td4Edit > details');
   const candidates=loc('#td4Candidates [data-candidate-id]');
   await candidates.first().waitFor();
   const cover=candidates.first().locator('.td773-coverage');
   assert.equal(await cover.evaluate(e=>e.open),false);
   const closedRankHeight=(await candidates.first().boundingBox()).height;
   await shots('rc3-ranked-collapsed','#td4Candidates');
   await cover.locator('summary').click();
   assert.equal(await candidates.nth(1).locator('.td773-coverage').evaluate(e=>e.open),false);
   assert.equal(await candidates.first().locator('.td80-candidate-acquisition').evaluate(e=>e.open),false);
   assert.equal(await cover.locator('.td773-coverage-grid').count(),1);
   await shots('rc3-replacement','#td4Candidates');
   const choose=async name=>{
    await loc('#td4Search').fill(name);
    await click(`#td4SearchResults [data-value="${name}"]`);
    await selected.locator('.td43-candidate-copy strong').filter({hasText:new RegExp(name,'i')}).waitFor();
   };
   await choose('eevee');
   const compare=selected.locator('.td774-comparison');
   assert.equal(await compare.evaluate(el=>el.open),false);
   await compare.locator('summary').click();
   assert.ok(await compare.locator('.td774-stat-tiles > div').count());
   await shots('rc3-comparison','#td63ManualCandidate');
   await shots('rc3-evolutions','.td772-evolution-choices');
   const evolution=loc('.td774-evolution-choice').first();
   assert.equal(await evolution.getByRole('button').textContent(),'Plan ›');
   assert.ok(await evolution.evaluate(el=>el.querySelector('b').getBoundingClientRect().right<=el.querySelector('button').getBoundingClientRect().left));
   const timing=loc('[data-td77-planned-move="psychic"] .td62-move-timing').first();
   const collapsed=timing.locator('summary');
   assert.equal((await collapsed.textContent()).trim(),'TM29 · Route 13');
   const acquisitionHeight=(await collapsed.boundingBox()).height;
   assert.ok(acquisitionHeight<=30);
   await shots('rc3-acquisition-collapsed','[data-td77-planned-move="psychic"]');
   await collapsed.click();
   assert.match(await timing.textContent(),/After badge 6/);
   assert.match(await timing.textContent(),/Requires Surf/);
   await shots('rc3-acquisition','[data-td77-planned-move="psychic"]');
   await timing.getByRole('button').first().click();
   await loc('#mapsContent').waitFor();
   await click('#backMaps');
   assert.equal(await timing.evaluate(el=>el.open),true);

   await tile(5).click();
   await candidates.first().waitFor();
   const empty=candidates.first().locator('.td773-coverage');
   assert.equal(await empty.locator('summary').textContent(),'Coverage gained');
   assert.equal(await empty.evaluate(el=>el.open),false);
   await empty.locator('summary').click();
   assert.ok(await empty.locator('.td774-gains').count());
   assert.doesNotMatch(await empty.textContent(),/Lost/);
   assert.equal(await empty.locator('[aria-label="None"]').count(),0);
   await shots('rc3-addition','#td4Candidates');

   await click('#battleTab');
   await loc('#foeInput').fill('lucario');
   await click('#foeResults button:has-text("Lucario")');
   const normal=loc('#matchups .pill').filter({hasText:'Normal'}).first();
   await normal.waitFor();
   assert.equal(await normal.evaluate(el=>getComputedStyle(el).color),'rgb(255, 255, 255)');
   await shots('rc3-battle','#matchups');
   await click('#moreTab');await click('#td68OpenMove');
   assert.equal(await loc('#td68MoveInput').evaluate(el=>document.activeElement===el),false);
   await loc('#td68MoveInput').fill('body slam');
   await loc('#td68MoveSuggest [data-td68-select="body-slam"] .td774-move-metrics').waitFor();
   await click('#td72MoveTypeToggle');
   await loc('#td72MoveTypeGame').selectOption('Black 2');
   await click('#td72MoveTypeChoices [data-td72-move-type="normal"]');
   const names=['body-slam','camouflage','chip-away','comet-punch','conversion-2'];
   await loc('[data-td72-type-move="conversion-2"]').waitFor();
   const heights=[];
   for(const name of names){
    const row=loc(`[data-td72-type-move="${name}"]`);
    const shape=await row.evaluate(el=>{
     const b=el.getBoundingClientRect(),h=el.querySelector('.td774-move-title').getBoundingClientRect(),m=el.querySelector('.td774-move-metrics').getBoundingClientRect(),t=el.querySelector('.pill');
     const badge=t.getBoundingClientRect();
     return {height:b.height,fit:h.bottom<=m.top&&h.right<=badge.left&&b.right-badge.right<13,ink:getComputedStyle(t).color};
    });
    assert.ok(shape.fit);
    assert.equal(shape.ink,'rgb(255, 255, 255)');
    heights.push(shape.height);
   }
   assert.equal(new Set(heights).size,1);
   await shots('rc3-move-results','[data-td72-type-move="body-slam"]');
   await click('#td72MoveFilters');
   await loc('#td5FilterMode').selectOption('team');
   await loc('#td5FilterTeam').selectOption('rc3-weak');
   await click('#td72MoveFilters');
   const filtered=loc('[data-td72-type-move="tackle"]');
   await filtered.waitFor();
   assert.match(await filtered.textContent(),/Patrat/);
   assert.equal(await loc('#td72MoveFilters').getAttribute('aria-expanded'),'false');
   await shots('rc3-move-filtered','[data-td72-type-move="tackle"]');
   await click('#td72MoveFilters');await loc('#td5FilterMode').selectOption('');await click('#td72MoveFilters');
   await click('#moreTab');await click('#moreTheme');await click('#td68OpenMove');await click('#td72MoveTypeToggle');
   await loc('[data-td72-type-move="body-slam"]').waitFor();
   const contrast=await loc('[data-td72-type-move="body-slam"] .pill').evaluate(el=>{
    const css=getComputedStyle(el),canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');
    const luminance=color=>{
     ctx.fillStyle=color;ctx.fillRect(0,0,1,1);
     const rgb=[...ctx.getImageData(0,0,1,1).data].slice(0,3).map(c=>c/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
     return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;
    };
    const values=[luminance(css.color),luminance(css.backgroundColor)].sort((a,b)=>b-a);
    return (values[0]+.05)/(values[1]+.05);
   });
   assert.ok(contrast>=4.5);
   await shots('rc3-light','[data-td72-type-move="body-slam"]');
   assert.deepEqual(errors,[]);
   console.log(JSON.stringify({width,before,after,heights,closedRankHeight,acquisitionHeight,contrast:+contrast.toFixed(2)}));
   await context.close();
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
