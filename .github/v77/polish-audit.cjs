const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const path=require('node:path');
const {chromium}=require('playwright-core');

(async()=>{
 const url=process.argv[2]||'http://127.0.0.1:8813/';
 const root=process.env.TAKDEX_EVIDENCE||'/workspace/work/checks/v77.2';
 const baseline=process.env.TAKDEX_BASELINE==='1';
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  for(const width of (process.env.TAKDEX_WIDTHS||'360,412,1280').split(',').map(Number)){
   const context=await browser.newContext({viewport:{width,height:850},isMobile:width<600,hasTouch:width<600,reducedMotion:'reduce',ignoreHTTPSErrors:true,serviceWorkers:'block'});
   const page=await context.newPage();
   page.setDefaultTimeout(6500);
   const errors=[],failures=[];
   page.on('pageerror',error=>errors.push(error.message));
   const dir=path.join(root,baseline?'baseline':'candidate',String(width));
   await fs.mkdir(dir,{recursive:true});
   await page.addInitScript(()=>{
    const game='Black 2',id='polish-audit';
    const move=(name,type,power,damageClass,accuracy=100)=>({name,type,power,damageClass,accuracy});
    const art=id=>'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/'+id+'.png';
    const pokemon=[
     {id:498,name:'Tepig',image:art(498),types:['fire'],level:16,ability:'blaze',moves:[
      move('Ember','fire',40,'special'),move('Flame Charge','fire',50,'physical'),move('Tackle','normal',50,'physical') ]},
     {id:55,name:'Golduck',image:art(55),types:['water'],level:36,ability:'damp',moves:[
      move('Water Gun','water',40,'special'),move('Ice Beam','ice',95,'special'),move('Tail Whip','normal',null,'status')]},
     ...Array(4).fill(null)
    ];
    const slots=[{id:500,name:'emboar',types:['fire','fighting'],duringTargetId:499,originName:'tepig',originSlot:0,locked:true,
     plannedMoves:[{move:'flame-charge',purpose:'keep'},{move:'brick-break',purpose:'keep'}],
     duringMoves:[{move:'ember',purpose:'keep'},{move:'flame-charge',purpose:'keep'}],
     finalManualSlots:[true,true],duringManualSlots:[true,true]},
     {id:55,name:'golduck',types:['water'],originName:'golduck',originSlot:1,
     plannedMoves:[{move:'water-gun',purpose:'keep'},{move:'ice-beam',purpose:'keep'},{move:'aqua-tail',purpose:'keep'}],
     duringMoves:[{move:'water-gun',purpose:'keep'},{move:'ice-beam',purpose:'keep'}]}];
    localStorage.setItem('poketact-teams',JSON.stringify([{id,name:'Audit team',game,pokemon}]));
    localStorage.setItem('takdex-v74-playthrough-plans',JSON.stringify({[game+':'+id]:{game,slots,deadline:'pre-league'}}));
    localStorage.setItem('takdex-v74-opponent-presets',JSON.stringify([{id:'audit-foe',name:'Audit opponent',game,rows:[{id:448,name:'Lucario',types:['fighting','steel'],level:32,moves:['aura-sphere','quick-attack']}]}]));
   });
   const loc=selector=>page.locator(selector);
   const click=selector=>loc(selector).first().click();
   const select=(selector,value)=>loc(selector).selectOption(value);
   const show=selector=>loc(selector).first().waitFor();
   const more=async selector=>{await click('#moreTab');await click(selector);};
   const close=async()=>{if(await loc('dialog[open]').count())await page.keyboard.press('Escape');};
   const openDetails=async selector=>{
    const detail=loc(selector).first();
    if(!await detail.evaluate(e=>e.open))await detail.locator(':scope > summary').click();
   };
   const search=async(input,results,name)=>{
    await loc(input).fill(name);
    await click(results);
   };
   const shot=async(name,target)=>{
    if(target){
     await show(target);
     await loc(target).first().evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));
    }else await page.evaluate(()=>window.scrollTo(0,0));
    const geometry=await page.evaluate(()=>{
     const width=document.documentElement.clientWidth;
     const outside=Array.from(document.querySelectorAll('main button, main select, dialog[open] input:not([tabindex="-1"])')).filter(e=>{
      const rect=e.getBoundingClientRect();
      return rect.width&&rect.height&&rect.top<innerHeight&&rect.bottom>0&&(rect.left< -2||rect.right>width+2)&&
       !e.closest('.td74-strip,.td74-team-strip,.td73-map-stage,.td74-planner-strip');
     }).slice(0,10).map(e=>e.id||e.className||e.textContent.trim().slice(0,32));
     return {width,document:document.documentElement.scrollWidth,outside};
    });
    await page.screenshot({path:path.join(dir,name+'.png'),timeout:12000,animations:'disabled'});
    console.log(JSON.stringify({width,name,geometry}));
   };
   async function audit(name,run){
    if(process.env.TAKDEX_FOCUS&&!process.env.TAKDEX_FOCUS.split(',').includes(name))return;
    try{await close();await run();}
    catch(error){failures.push(name);console.error(width,name,error.message.split('\n').slice(0,5).join(' '));}
   }
   await page.goto(url,{waitUntil:'domcontentloaded'});
   assert.match(await loc('footer').textContent(),/Developed by WHOASP/);
   console.log('ROUTES',width,await loc('main > section').evaluateAll(list=>list.map(e=>e.id).join(', ')));

   await audit('teams',async()=>{
    await shot('01-team-list');
    await click('#addTeam');await shot('02-new-team','dialog[open]');
    await close();
    if(!await loc('[data-td74-builder-team="polish-audit"]').first().isVisible())await click('[data-td71-toggle="polish-audit"]');
    await shot('03-actual-team','[data-td71-toggle="polish-audit"]');
    await click('[data-td74-builder-team="polish-audit"][data-td74-builder-slot="0"]');
    await show('#td77BuilderBattle');
    await openDetails('#td77BuilderBattle');await openDetails('.td74-battle-stats');await openDetails('.td77-builder-equipment');
    await shot('04-builder-edit','#pokeForm');
    await shot('05-builder-equipment','.td77-builder-equipment');
    await shot('06-builder-moves','#moveFields');
    await click('[data-td74-builder-team="polish-audit"][data-td74-builder-slot="0"]');
    await click('[data-edit-card="polish-audit"]');await shot('06-team-settings','dialog[open]');await close();
    const downloaded=page.waitForEvent('download');
    await click('[data-export-card="polish-audit"]');
    const data=JSON.parse(await fs.readFile(await (await downloaded).path(),'utf8'));
    assert.match(JSON.stringify(data),/Tepig/);await shot('06-team-export');
   });
   await audit('planner',async()=>{
    await click('#teamsTab');
    if(!await loc('[data-td41-team-plan="polish-audit"]').isVisible())await click('[data-td71-toggle="polish-audit"]');
    await click('[data-td41-team-plan="polish-audit"]');
    await click('[data-td4-slot="0"]');
    await shot('07-planner-owned','#td4Slots');
    await click('[data-view="during"]');
    await shot('08-planner-during','#td4Slots');
    await click('[data-view="final"]');
    await shot('09-planner-legal-route','#td77SlotRoute');
    await shot('10-move-progression','#td41MoveSlots');
    const editor=loc('#td41MoveSlots [data-td78-open-move]').first();
    if(await editor.count()){
     await editor.click();
     await shot('11-move-editor','#td41MoveSlots');
    }
    await click('[data-td4-slot="2"]');
    await show('#td4Candidates .td43-candidate');
    await shot('12-recommendations','#td4Candidates');
    await openDetails('#td4Candidates .td43-candidate details');
    await shot('13-recommendation-acquisition','#td4Candidates details');
    await search('#td4Search','#td4SearchResults [data-value="eevee"]','eevee');
    await shot('14-evolution-choices','.td772-evolution-choices,.td77-candidate-actions');
    if(await loc('#td4Coverage').count()){
     await openDetails('details:has(> #td4Coverage)');
     await shot('15-team-coverage','#td4Coverage');
    }
    await openDetails('details:has(> #td77Gyms)');
    await shot('16-gym-readiness','#td77Gyms');
    await openDetails('details:has(> #td4League)');
    await shot('17-league-readiness','#td4League');
    await openDetails('details:has(> #td77Improvements)');
    await shot('18-team-improvements','#td77Improvements');
   });
   await audit('battle',async()=>{
    await click('#teamsTab');
    if(await loc('#td4Back').isVisible())await click('#td4Back');
    const team=loc('[data-td71-toggle="polish-audit"]');
    if(await team.getAttribute('aria-expanded')!=='true')await team.click();
    await click('#battleTab');
    if(await loc('#td681BattleTeam').inputValue()!=='polish-audit')await select('#td681BattleTeam','polish-audit');
    await search('#foeInput','#foeResults button:has-text("Lucario")','lucario');
    await show('#matchups .td76-move-card').catch(async error=>{
     console.error(width,'battle state',await page.evaluate(()=>({
      team:current?.id,foe:foe?.name,game:current?.game,matchups:document.querySelector('#matchups').textContent.slice(0,300)
     })));
     throw error;
    });
    await shot('19-battle','#td76BattleStrip');
    await shot('20-battle-moves','#matchups');
    await click('#doubleMode');
    await search('#foeInput2','#foeResults2 button:has-text("Sandshrew")','sandshrew');
    await shot('21-battle-double','#battlePage');
    await click('#singleMode');
   });
   await audit('6v6',async()=>{
    await more('#openPlanner');await select('#planGame','Black 2');await select('#planTeam','polish-audit');
    await shot('22-6v6-trainer','#plannerPage');
    await shot('23-6v6-matchup','#td74Focus');
    await openDetails('#td74EditorOpp');await shot('24-6v6-editor','#td74EditorOpp');
    await select('#planMode','custom');await select('#td4OpponentSelect','audit-foe');
    await shot('25-custom-opponent','#td4OpponentPresets');
    await shot('26-custom-moves','#planOpp');
    const popup=page.waitForEvent('dialog',{timeout:4500});
    const pending=click('#td4OpponentDelete');
    const d=await popup;
    console.log(width,'Delete confirm',d.message());await d.dismiss();await pending;
   });
   await audit('pokédex',async()=>{
    await click('#dexTab');await select('#dexGame','Black 2');
    await search('#dexInput','#dexResults [data-value="psyduck"]','psyduck');
    await show('#dexResult .td66-pokemon-card');
    await shot('27-pokedex','#dexResult');
    const ability=loc('#dexResult select').first();
    if(await ability.isVisible()){
     const values=await ability.locator('option').evaluateAll(options=>options.map(o=>o.value).filter(Boolean));
     if(values.length)await ability.selectOption(values[0]);
     await shot('28-pokedex-ability','#dexResult select');
    }
    const labels=await loc('#dexResult details > summary').allTextContents();
    console.log(width,'Pokédex panels',labels);
    for(const [name,pattern] of [['evolution',/Evolution/i],['moves',/Level.up/i],['encounters',/Encounter/i],['stats',/Base stats/i]]){
     const summary=loc('#dexResult details > summary').filter({hasText:pattern}).first();
     if(await summary.count()){
      if(!await summary.evaluate(e=>e.parentElement.open))await summary.click();
      await shot('29-dex-'+name,'#dexResult details[open]:has(> summary:text-matches("'+pattern.source+'","i"))');
     }
    }
    await click('#openTypeExplorer');
    await shot('30-by-type','#typeExplorerPage');
    await click(baseline?'#td65ProgressFilter summary':'#td772ExplorerFilters');
    await shot('31-by-type-filters','#typeExplorerPage');
    await click('#td65Recorded');
    if(!baseline){
     await click('#td772ExplorerFilters');
     const dimensions=await page.evaluate(()=>{
      const s=document.querySelector('#typeExplorerGame').getBoundingClientRect(), f=document.querySelector('#td772ExplorerFilters');
      const t=f.getBoundingClientRect();
      return [s.top===t.top,s.height===t.height,t.width===t.height,f.classList.contains('selected'),f.getAttribute('aria-expanded')];
     });
     assert.deepEqual(dimensions,[true,true,true,true,'false']);
    }
    await click('[data-explore-type="water"]');
    await shot('32-type-results','#typeExplorerResults .td61-entry');
   });
   await audit('move checker',async()=>{
    await more('#td68OpenMove');
    await loc('#td68MoveInput').fill('Thunderbolt');await loc('#td68MoveInput').press('Enter');
    await shot('33-move-checker','#td68MoveResult article');
    await shot('34-move-compatibility','#td72MoveCompatibility');
    await click('[data-move-catalog="machines"]');await select('#tmGame','Black 2');
    await loc('#tmMoveSearch').fill('26');await click('#tmMoveResults button:has-text("Earthquake")');
    await shot('35-machine-detail','#td68MoveResult article');
    await click('[data-move-catalog="machines"]');await select('#tmGame','Black 2');
    await search('#tmPokemon','#tmPokemonResults [data-value="magikarp"]','magikarp');
    await shot('36-machine-compatibility','#tmResults');
    await click('[data-move-catalog=""]');
    await loc('#td68MoveInput').fill('Ice Punch');await loc('#td68MoveInput').press('Enter');
    await shot('37-tutor-acquisition','#td68MoveResult article');
    await click('#td72MoveTypeToggle');await select('#td72MoveTypeGame','Black 2');
    await click('#td72MoveTypeChoices [data-td72-move-type="water"]');
    await shot('38-moves-by-type','#td72MoveTypePanel');
   });
   await audit('maps',async()=>{
    await more('#openMaps');await select('#mapsGame','Black 2');
    if(!baseline){
     await click('#td772MapFilter');
     await select('#mapsCategory','landmark');
     await click('#td772MapFilter');
     assert.equal(await loc('#td772MapFilter').evaluate(e=>e.classList.contains('selected')),true);
     await click('#td772MapFilter');await select('#mapsCategory','all');await click('#td772MapFilter');
    }
    await loc('#mapsSearch').fill('Village Bridge');
    await shot('39-maps-search','#mapsSearch');
    await click('#mapsSuggestions button:has-text("Village Bridge")');
    await shot('40-maps-selection','#mapsContent');
    await shot('41-map-location','#mapsDetails');
    await click('#mapsFullscreen');await shot('42-maps-fullscreen');
    if(await loc('#td76FullMapDetails').isVisible()){
     await openDetails('#td76FullMapDetails');await shot('43-maps-fullscreen-location');
    }
    await click('#mapsFullscreen');
    for(const game of ['Emerald','Platinum','Black','White','White 2']){
     await select('#mapsGame',game);await shot('44-map-'+game.replace(' ','-'),'#mapsContent');
    }
   });
   await audit('compare',async()=>{
    await more('#td56OpenCompare');await select('#td56Game','Black 2');
    await loc('#td56A').fill('tepig');await click('#td56SuggestionsA button:has-text("Tepig")');
    await loc('#td56B').fill('emboar');await click('#td56SuggestionsB button:has-text("Emboar")');
    await shot('45-compare','#td56Output');
   });
   await audit('type checker',async()=>{
    await more('#openTypeChecker');await select('#typeCheckGame','Black 2');
    await click('#typeCheckGrid button:has-text("Fire")');await click('#typeCheckGrid button:has-text("Fighting")');
    await shot('46-type-matchups','#typeCheckerPage');await shot('47-type-defenses','#typeCheckResults');
   });
   await audit('other menus',async()=>{
    await click('#moreTab');await shot('48-more');
    await click('#moreTheme');await shot('49-light-theme');await click('#moreTheme');
    await click('#td7FeedbackOpen');await shot('50-feedback','dialog[open]');await close();
    await more('#td70OpenAbout');await shot('51-about','#td70AboutPage');
    await click('#td68OpenCoverage');await shot('52-data-coverage','#td68CoveragePage');
    await more('#td59OpenOffline');await select('#td59Game','Black 2');
    await shot('53-offline-packs','#td59OfflinePage');
   });
   console.log(JSON.stringify({width,failures,errors}));
   if(failures.length||errors.length)process.exitCode=1;
   await context.close();
  }
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
