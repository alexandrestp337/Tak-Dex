const {chromium}=require('playwright-core');
const assert=require('node:assert/strict');
const url=process.argv[2]||'http://127.0.0.1:8795';
const team={id:'r3-team',name:'Round 3 test',game:'Black 2',pokemon:[
 {id:54,name:'Psyduck',level:22,types:['water'],moves:[{name:'Scratch'},{name:'Tail Whip'},{name:'Water Sport'}]},
 {id:58,name:'Growlithe',level:22,types:['fire'],moves:[{name:'Ember'}]},
 {id:81,name:'Magnemite',level:22,types:['electric','steel'],moves:[{name:'Thundershock'}]}
]};
const fullTeam={...team,pokemon:[...team.pokemon,
 {id:41,name:'Zubat',level:25,types:['poison','flying'],moves:[]},
 {id:551,name:'Sandile',level:25,types:['ground','dark'],moves:[{name:'Sand Attack'},{name:'Bite'}]},
 {id:559,name:'Scraggy',level:25,types:['dark','fighting'],moves:[{name:'Leer'},{name:'Low Kick'},{name:'Sand Attack'},{name:'Faint Attack'}]}
]};
async function openPlan(page){
 await page.goto(url,{waitUntil:'domcontentloaded'});
 await page.locator('[data-td71-toggle="r3-team"]').click();
 await page.locator('[data-td41-team-plan="r3-team"]').click();
 await page.locator('#td4Slots [data-td4-slot="0"]').click();
}
async function openOptions(page){
 const fold=page.locator('#td4Edit details.td42-settings').first();
 if(!await fold.evaluate(el=>el.open))await fold.locator(':scope > summary').click();
 await page.locator('[data-td4-candidate]').first().waitFor();
}
const plan=page=>page.evaluate(()=>JSON.parse(localStorage.getItem('takdex-v74-playthrough-plans'))['Black 2:r3-team']);
async function compareHead(page){
 const option=page.locator('[data-td4-candidate]').first();
 await option.scrollIntoViewIfNeeded();
 const r=await option.boundingBox();
 await page.mouse.move(r.x+r.width/2,r.y+r.height/2);
 await page.mouse.down();await page.waitForTimeout(500);await page.mouse.up();
 await page.locator('dialog[open] [data-compare-confirm]').click();
 await page.locator('#td56ComparePage .td56-cards').first().waitFor();
 await page.waitForFunction(()=>Math.abs(document.querySelector('#td56ComparePage .td56-cards').getBoundingClientRect().top)<75);
 await page.locator('#td56Back').click();
}
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  let incompleteRanking=[];
  for(const width of [320,360,390,412,1280]){
   const page=await browser.newPage({viewport:{width,height:900},isMobile:width<600,hasTouch:width<600,ignoreHTTPSErrors:true,reducedMotion:'reduce'});
   page.setDefaultTimeout(24000);
   const errors=[];page.on('pageerror',error=>errors.push(error.stack));
   await page.addInitScript(seed=>{
    if(!localStorage.getItem('poketact-teams'))localStorage.setItem('poketact-teams',JSON.stringify([seed]));
   },width===1280?fullTeam:team);
   await openPlan(page);
   await page.locator('[data-view="during"]').click();
   await page.locator('[data-td77-during]').first().waitFor();
   assert.equal(await page.locator('[data-td77-during]').count(),4);
   const texts=page.locator('.td77-during-flow .movechip');
   await texts.first().waitFor();
   const geometry=await texts.evaluateAll(elements=>elements.filter(el=>['Scratch','Tail Whip','Water Sport'].includes(el.textContent.trim())).map(el=>{
    const range=document.createRange();range.selectNodeContents(el);
    return [el.textContent.trim(),new Set([...range.getClientRects()].filter(r=>r.width>0).map(r=>Math.round(r.y))).size];
   }));
   assert.deepEqual(geometry,[['Scratch',1],['Tail Whip',1],['Water Sport',1]]);
   await openOptions(page);
   assert.equal(await page.locator('#td77Legendary').evaluate(input=>{
    const a=input.getBoundingClientRect(),b=input.nextElementSibling.getBoundingClientRect();
    return a.right<b.left&&Math.abs((a.y+a.height/2)-(b.y+b.height/2))<3;
   }),true);
   assert.equal(await page.locator('#td77MoveViews').evaluate(el=>{
    const [a,b]=[...el.children].map(x=>x.getBoundingClientRect());
    return Math.abs(a.width-b.width)<1&&Math.abs(a.y-b.y)<1&&getComputedStyle(el.firstElementChild).borderBottomWidth==='2px';
   }),true);
   assert.equal(await page.locator('.td77-analysis-summary').first().evaluate(el=>{
    const title=el.querySelector('strong'),summary=el.querySelector('small');
    return title.getBoundingClientRect().bottom<=summary.getBoundingClientRect().top&&parseFloat(getComputedStyle(title).fontSize)>parseFloat(getComputedStyle(summary).fontSize);
   }),true);
   const read=()=>page.locator('#td4Candidates [data-candidate-id]').evaluateAll(rows=>rows.map(r=>({id:r.dataset.candidateId,name:r.querySelector('strong').textContent,score:+r.dataset.score,factors:JSON.parse(r.dataset.factors)})));
   if(width===1280){
    const fullRanking=await read();
    assert.ok(fullRanking.some((r,i)=>r.id!==incompleteRanking[i]?.id));
    for(const [slot, actualCount] of [[1,1],[3,0],[4,2],[5,4]]){
     await page.locator(`#td4Slots [data-td4-slot="${slot}"]`).click();
     assert.equal(await page.locator('[data-td77-during]').count(),4);
     assert.equal(await page.locator('.td77-during-flow .movechip').count(),actualCount);
     assert.equal(await page.locator('.td77-during-flow .td42-empty-move').count(),4-actualCount);
     await page.locator('[data-view="final"]').click();
     assert.equal(await page.locator('#td41MoveSlots [data-td42-preview]').count(),4);
     await page.locator('[data-view="during"]').click();
    }
    const improvements=page.locator('#td77Improvements');
    await improvements.locator('xpath=..').locator(':scope > summary').click();
    await improvements.getByText('More improvements',{exact:true}).waitFor();
    assert.equal(await improvements.evaluate(el=>[...el.children].filter(row=>row.matches('div, details')&&row.querySelector(':scope > summary')?.textContent!=='More improvements').length),3);
    await improvements.getByText('More improvements',{exact:true}).click();
    assert.ok(await improvements.locator(':scope > details[open] button').count()>0);
    console.log('Complete team changed the ranked list; both modes retained four slots for 0–4 actual moves; three ranked improvements visible.');
   }
   if(width===412){
    const prepare=async name=>{
     const button=page.locator('#td4Candidates [data-td4-candidate]').filter({hasText:name}).first();
     await button.click();
     await page.locator('[data-td63-manual-select]').click();
    };
    const switchSlot=async i=>{await page.locator(`#td4Slots [data-td4-slot="${i}"]`).click();await openOptions(page);};
    const stage=page.locator('[data-candidate-id="55"]');
    assert.match(await stage.textContent(),/Evolution of the planned Pokémon/);
    assert.match(await stage.textContent(),/Psyduck → Golduck/);
    const first=await read();
    incompleteRanking=first;
    await compareHead(page);
    await prepare('Golduck');
    await page.waitForFunction(()=>JSON.parse(localStorage.getItem('takdex-v74-playthrough-plans'))['Black 2:r3-team'].slots[0].id===55);
    await page.locator('[data-td4-candidate]').first().waitFor();
    const sameSlot=await read();
    assert.ok(sameSlot.some(row=>first.some(old=>old.id===row.id&&old.score!==row.score)));
    await switchSlot(1);
    const before=await read();
    await switchSlot(2);
    const choice=(await read()).find(r=>r.id!=='81');
    assert.ok(choice);
    await prepare(choice.name);
    await page.waitForFunction(id=>JSON.parse(localStorage.getItem('takdex-v74-playthrough-plans'))['Black 2:r3-team'].slots[2].id===+id,choice.id);
    await switchSlot(1);
    const after=await read();
    const common=before.filter(row=>after.some(next=>next.id===row.id));
    assert.ok(common.length>=3);
    assert.ok(common.some((a,i)=>common.slice(i+1).some(b=>after.findIndex(n=>n.id===a.id)>after.findIndex(n=>n.id===b.id))));
    console.log('R3 ranking',JSON.stringify({first:first.slice(0,5),sameSlot:sameSlot.slice(0,5),before:before.slice(0,5),after:after.slice(0,5),choice}));
    assert.equal((await plan(page)).slots[0].id,55);
   }
   await page.locator('#dexTab').click();
   await page.locator('#dexGame').selectOption('Black 2');
   await page.locator('#dexInput').fill('magikarp');
   await page.locator('#dexResults button').filter({hasText:'Magikarp'}).first().click();
   const encounters=page.locator('#td56DexEncounters');
   await encounters.waitFor();
   if(!await encounters.evaluate(el=>el.open))await encounters.locator('summary').click();
   const acquisition=encounters.locator('.td77-acquisition-entry [data-td74-dex-map="Marvelous Bridge"]').first();
   await acquisition.waitFor();
   assert.doesNotMatch(await encounters.textContent(),/Recorded encounter:|intentionally incomplete|unknown.area/i);
   await acquisition.click();
   await page.waitForFunction(()=>/Marvelous Bridge/.test(document.querySelector('#mapsSelectionLabel').textContent));
   const toolbar=await page.locator('.td73-map-toolbar').evaluate(el=>{
    const buttons=[...el.querySelectorAll('button')],boxes=buttons.map(b=>b.getBoundingClientRect());
    return {count:boxes.length,same:boxes.every(b=>Math.abs((b.top+b.height/2)-(boxes[0].top+boxes[0].height/2))<1),fits:boxes.every(b=>b.left>=0&&b.right<=innerWidth)};
   });
   assert.deepEqual(toolbar,{count:6,same:true,fits:true});
   await page.locator('#backMaps').click();
   assert.equal(await encounters.evaluate(el=>el.open),true);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
   assert.deepEqual(errors,[]);
   console.log(width+'px: checkbox geometry, mode tabs, four slots, move names, summary hierarchy, Marvelous Bridge and single-row contextual map toolbar');
   await page.close();
  }
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
