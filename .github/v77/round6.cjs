const assert = require('node:assert/strict');
const { chromium } = require('playwright-core');

const base = process.argv[2] || 'http://127.0.0.1:8795';
const team = { id:'r6', name:'Round 6 Black 2', game:'Black 2', saveLink:{ progression:{ badgeCount:3 } }, pokemon:[
 {id:54,name:'Psyduck',level:24,types:['water'],moves:[{name:'Scratch'},{name:'Tail Whip'}],saveStats:{pid:134,level:24}},
 {id:58,name:'Growlithe',level:24,types:['fire'],moves:[{name:'Ember'},{name:'Bite'}],saveStats:{pid:136,level:24}},
 {id:81,name:'Magnemite',level:22,types:['electric','steel'],moves:[{name:'ThunderShock'}]},
 null,null,null
]};
const planKey='Black 2:r6';
const choice=page=>page.locator('#td63ManualCandidate [data-td63-manual-select]');
const getPlan=page=>page.evaluate(key=>JSON.parse(localStorage.getItem('takdex-v74-playthrough-plans'))[key],planKey);
const waitSpecies=(page,i,id)=>page.waitForFunction(([key,i,id])=>JSON.parse(localStorage.getItem('takdex-v74-playthrough-plans'))?.[key]?.slots[i]?.id===id,[planKey,i,id]);
const fold=page=>page.locator('#td4Edit > details').first();
const candidate=page=>page.locator('#td63ManualCandidate [data-td77-preview-context]');
const status=page=>page.locator('#td4CandidateStatus');
const planTypes=page=>page.locator('#td77TypeOptions .td72-move-types');
const moves=(p,mode='plannedMoves')=>p[mode].map(m=>m.replacement||m.move).filter(Boolean);

async function openPlan(page){
 await page.goto(base,{waitUntil:'domcontentloaded'});
 const enter=page.locator('[data-td41-team-plan="r6"]');
 if(!await enter.isVisible())await page.locator('[data-td71-toggle="r6"]').click();
 await enter.click();
}
async function slot(page,i,change=true){
 const tile=page.locator(`#td4Slots [data-td4-slot="${i}"]`);
 if(await tile.getAttribute('aria-expanded')!=='true')await tile.click();
 if(change&&!await fold(page).evaluate(el=>el.open))await fold(page).locator(':scope > summary').click();
}
async function search(page,name){
 await page.locator('#td4Search').fill(name);
 await page.locator(`#td4SearchResults [data-value="${name}"]`).first().click();
 await candidate(page).getByText(new RegExp('Preview: '+name,'i')).waitFor();
}
async function hold(page,locator){
 await locator.scrollIntoViewIfNeeded();
 const r=await locator.boundingBox();
 await page.mouse.move(r.x+r.width/2,r.y+r.height/2);
 await page.mouse.down();
 const dialog=page.locator('dialog[open]');
 await dialog.waitFor();
 await page.mouse.up();
 return dialog;
}
function tileGeometry(){
 const tile=document.querySelector('#typeExplorerTypes [data-explore-type="water"],#td77TypeOptions [data-td77-filter-type="water"]');
 const host=tile.parentElement,style=getComputedStyle(tile),grid=getComputedStyle(host);
 return {height:tile.getBoundingClientRect().height,radius:style.borderRadius,padding:style.padding,font:style.fontSize,weight:style.fontWeight,
  color:style.backgroundColor,border:style.borderTopColor,gap:grid.columnGap,columns:grid.gridTemplateColumns.split(' ').length};
}
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  for(const width of [320,360,390,412,1280]){
   const page=await browser.newPage({viewport:{width,height:870},isMobile:width<700,hasTouch:width<700,reducedMotion:'reduce',ignoreHTTPSErrors:true});
   const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.addInitScript(team=>{
    if(!localStorage.getItem('poketact-teams'))localStorage.setItem('poketact-teams',JSON.stringify([team]));
   },team);
   await page.goto(base,{waitUntil:'domcontentloaded'});
   await page.locator('#dexTab').click();
   await page.locator('#dexGame').selectOption('Black 2');
   await page.locator('#openTypeExplorer').click();
   await page.locator('#typeExplorerTypes [data-explore-type="water"]').waitFor();
   const approved=await page.evaluate(tileGeometry);
   await openPlan(page);
   await page.waitForFunction(key=>JSON.parse(localStorage.getItem('takdex-v74-playthrough-plans'))[key]?.slots[0]?.finalAutoMoves?.length===4,planKey);
   const initial=(await getPlan(page)).slots[0];
   assert.equal(moves(initial).length,4);
   assert.equal(moves(initial,'duringMoves').length,4);
   assert.ok(moves(initial,'duringMoves').some(n=>!['scratch','tail-whip'].includes(n)));
   await slot(page,3);
   await page.locator('#td77TypeFilter').click();
   await planTypes(page).locator('[data-td77-filter-type="water"]').waitFor();
   const fromPlanner=await planTypes(page).locator('[data-td77-filter-type="water"]').evaluate(el=>{
    const style=getComputedStyle(el),grid=getComputedStyle(el.parentElement);
    return {height:el.getBoundingClientRect().height,radius:style.borderRadius,padding:style.padding,font:style.fontSize,weight:style.fontWeight,
     color:style.backgroundColor,border:style.borderTopColor,gap:grid.columnGap,columns:grid.gridTemplateColumns.split(' ').length};
   });
   assert.deepEqual(fromPlanner,approved);
   assert.equal(await planTypes(page).locator('button span').count(),0);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
   if(process.env.TAKDEX_SCREENSHOTS)await page.screenshot({path:`${process.env.TAKDEX_SCREENSHOTS}/r6-types-${width}.png`});
   await page.locator('#td77TypeFilter').click();
   await slot(page,0,false);
   const row=page.locator('#td41MoveSlots .td77-move-comparison').first();
   await row.locator('.td77-edit-move input').waitFor();
   const cards=await row.evaluate(el=>{
    const cards=el.querySelectorAll('.td77-planner-move-info');
    return [...cards].map(node=>{const b=node.getBoundingClientRect(),css=getComputedStyle(node);return {width:b.width,height:b.height,padding:css.padding,radius:css.borderRadius};});
   });
   assert.equal(cards.length,2);
   assert.ok(Math.abs(cards[0].width-cards[1].width)<1);
   assert.equal(cards[0].height,cards[1].height);
   assert.equal(cards[0].radius,cards[1].radius);
   assert.equal(await page.locator('#td4Edit summary').getByText('Change moves',{exact:true}).count(),0);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
   if(process.env.TAKDEX_SCREENSHOTS)await page.screenshot({path:`${process.env.TAKDEX_SCREENSHOTS}/r6-moves-${width}.png`});

   if(width===390){
    await slot(page,3);
    await page.locator('#td77TypeFilter').click();
    await planTypes(page).locator('[data-td77-filter-type="ground"]').click();
    await page.locator('#td77TypeFilter').click();
    const flygon=page.locator('#td4Candidates [data-candidate-id="330"]');
    await flygon.waitFor();
    assert.equal(await page.locator('#td4Candidates [data-candidate-id="328"],#td4Candidates [data-candidate-id="329"]').count(),0);
    await page.locator('[data-td77-clear-types]').click();
    await search(page,'golduck');
    await candidate(page).getByText(/Psyduck is assigned to another team slot/).waitFor();
    assert.equal(await page.locator('[data-td77-route="preview"] option').filter({hasText:'Use owned Psyduck'}).count(),0);
    await candidate(page).getByRole('button',{name:/Plan evolution in Psyduck/}).click();
    await page.waitForFunction(()=>document.querySelector('#td4Slots [data-td4-slot="0"]').getAttribute('aria-expanded')==='true');
    await candidate(page).getByText('Preview: Golduck').waitFor();
    assert.ok(await page.locator('[data-td77-route="preview"] option').filter({hasText:'Use owned Psyduck'}).count()>0);
    await choice(page).click();await waitSpecies(page,0,55);
    const stable=(await getPlan(page)).slots[0].acquisitionRoute.id;
    await choice(page).waitFor();
    assert.equal(await choice(page).isDisabled(),true);
    await fold(page).locator('summary').click();
    await fold(page).locator('summary').click();
    await candidate(page).getByText('Selected: Golduck').waitFor();
    const dialog=await hold(page,candidate(page).locator('.td43-candidate-pick'));
    await dialog.getByText('Compare Golduck with Psyduck').waitFor();
    await dialog.getByRole('button',{name:'Cancel'}).click();
    await search(page,'swanna');
    await candidate(page).getByText('Preview: Swanna').waitFor();
    await candidate(page).getByRole('button',{name:'Cancel',exact:true}).click();
    await candidate(page).getByText('Selected: Golduck').waitFor();
    assert.equal((await getPlan(page)).slots[0].acquisitionRoute.id,stable);
    await slot(page,3);
    await search(page,'trapinch');
    await candidate(page).getByText('Evolution available').waitFor();
    await candidate(page).getByRole('button',{name:/Plan Flygon.*Obtain Trapinch/}).click();
    await waitSpecies(page,3,330);
    assert.equal((await getPlan(page)).slots[3].acquisitionRoute.startId,328);
    const acceptDowngrade=dialog=>dialog.accept();
    page.on('dialog',acceptDowngrade);
    for(const [i,name] of [[0,'rock-slide'],[1,'rock-smash']]){
     const editor=page.locator(`[data-td45-move="${i}:goal"]`);
     await editor.fill(name.replace('-',' '));
     await editor.locator('..').locator('[data-td45-pick="'+name+'"]').click();
     await page.waitForFunction(([key,i,name])=>{
      const m=JSON.parse(localStorage.getItem('takdex-v74-playthrough-plans'))[key].slots[3].plannedMoves[i];
      return (m.replacement||m.move)===name;
     },[planKey,i,name]);
    }
    page.off('dialog',acceptDowngrade);
    await page.setViewportSize({width:320,height:870});
    const flygonCard=page.locator('#td4Slots [data-td4-slot="3"]');
    for(const name of ['Rock Slide','Rock Smash']){
     const move=flygonCard.locator('.td77-missing-actual .movechip > span').getByText(name,{exact:true});
     await move.waitFor();
     assert.ok(await move.evaluate(node=>node.scrollWidth<=node.clientWidth+1));
    }
    await page.setViewportSize({width,height:870});
    await slot(page,4);
    await search(page,'eevee');
    assert.ok(await candidate(page).locator('[data-td77-plan-endpoint]').count()>1);
    await choice(page).click();await waitSpecies(page,4,133);
    assert.ok(!(await getPlan(page)).slots[4].finalTarget);
    await slot(page,1);
    await search(page,'arcanine');
    await choice(page).click();await waitSpecies(page,1,59);
    await slot(page,5);
    await search(page,'ninetales');
    const route=page.locator('[data-td77-route="preview"]');
    const vulpix=await route.locator('option').filter({hasText:'Obtain Vulpix'}).first().getAttribute('value');
    await route.selectOption(vulpix);
    await candidate(page).getByText(/Use a Fire Stone/).waitFor();
    await choice(page).click();await waitSpecies(page,5,38);
    assert.equal(moves((await getPlan(page)).slots[5]).length,4);
    await page.getByText('Theoretical Final moves · after planning deadline').waitFor();
    const resources=page.locator('#td77Improvements').locator('..');
    if(!await resources.evaluate(el=>el.open))await resources.locator(':scope > summary').click();
    const stone=resources.locator('[data-td77-resource="Fire Stone"]');
    await stone.waitFor();
    assert.deepEqual(await stone.locator('dd').allTextContents(),['2','1','1','2']);
    await page.locator('#td77Availability').selectOption('postgame');
    await page.waitForFunction(()=>[...document.querySelectorAll('[data-td77-resource="Fire Stone"] dd')].map(x=>x.textContent).join(',')==='2,2,0,2');
    const finalRoute=page.locator('[data-td77-route="slot"]:visible,[data-td77-route="confirmed"]:visible');
    const direct=await finalRoute.locator('option').filter({hasText:'Obtain Ninetales directly'}).first().getAttribute('value');
    await finalRoute.selectOption(direct);
    await page.waitForFunction(()=>[...document.querySelectorAll('[data-td77-resource="Fire Stone"] dd')].map(x=>x.textContent).join(',')==='1,1,0,2');
    await page.locator('#td77CoverageSummary .td77-coverage-line').first().waitFor();
    assert.equal(await page.locator('#td77CoverageSummary .td77-coverage-line').count(),2);
    console.log('Owned auto-fill, exclusive ownership, endpoint and branching prompts, confirmed preview, theoretical moves and resource deadlines passed');
   }
   if(width===1280){
    await page.locator('#dexTab').click();
    await page.locator('#dexGame').selectOption('Black 2');
    await page.locator('#dexInput').fill('emboar');
    await page.locator('#dexResults button').filter({hasText:'Emboar'}).first().click();
    const learnset=page.locator('[data-dex-section="learnset"]');
    if(!await learnset.evaluate(el=>el.open))await learnset.locator('summary').click();
    const reminder=learnset.locator('[data-td68-move="hammer-arm"]').locator('xpath=../../..');
    assert.match(await reminder.textContent(),/Move Reminder.*Pokémon World Tournament.*1 Heart Scale.*After badge 5/);
    assert.equal(await reminder.locator('.td681-level').count(),0);
    await reminder.locator('button[data-td74-dex-map]').first().waitFor();
    const hero=page.locator('#dexResult .dex-entry').first();
    const dialog=await hold(page,hero);
    const buttons=await dialog.locator('.td77-quick-actions button').evaluateAll(elements=>elements.map(el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return [r.width,r.height,r.top,s.fontSize,s.padding,s.borderRadius];}));
    assert.deepEqual(buttons[0],buttons[1]);
    await dialog.getByRole('button',{name:'Close',exact:true}).click();
    await page.locator('#moreTab').click();await page.locator('#td68OpenMove').click();
    await page.getByRole('tab',{name:'TM / HM'}).click();
    await page.locator('#tmGame').selectOption('Black 2');
    const machine=page.locator('#tmMoveSearch');
    assert.equal(await page.locator('#tmMoveBrowse').count(),0);
    await machine.click();
    assert.ok(await page.locator('#tmMoveResults [data-machine]').count()>80);
    await machine.fill('fly');
    await machine.press('ArrowDown');await page.locator('#tmMoveResults [data-machine]').first().press('Enter');
    await page.locator('#td68MoveResult .td64-move-back').waitFor();
    console.log('Compact Reminder, matching Quick Compare buttons and browse-to-keyboard TM/HM selection passed');
   }
   assert.deepEqual(errors,[]);
   console.log(width+'px shared controls and move geometry passed');
   await page.close();
  }
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
