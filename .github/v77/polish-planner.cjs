const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const {chromium} = require('playwright-core');

const url = process.argv[2] || 'http://127.0.0.1:8813/';
const evidence = process.env.TAKDEX_EVIDENCE;
const key = 'Black 2:polish';
const store = 'takdex-v74-playthrough-plans';

(async () => {
 const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try {
  for (const width of [360,412]) {
   const context = await browser.newContext({viewport:{width,height:840},isMobile:true,hasTouch:true,reducedMotion:'reduce',ignoreHTTPSErrors:true,serviceWorkers:'block'});
   const page = await context.newPage();
   const errors = [];
   page.on('pageerror', e => errors.push(e.message));
   await page.addInitScript(() => {
    if(localStorage.getItem('poketact-teams'))return;
    localStorage.setItem('poketact-teams',JSON.stringify([{id:'polish',name:'Polish audit',game:'Black 2',pokemon:Array(6).fill(null)}]));
   });
   const tile=i=>page.locator(`#td4Slots [data-td4-slot="${i}"]`);
   const choice=page.getByRole('combobox',{name:'Planned evolution'});
   const read=()=>page.evaluate(([store,key])=>JSON.parse(localStorage.getItem(store))[key],[store,key]);
   const expect=async(i,id,during)=>{
    await page.waitForFunction(([store,key,i,id,during])=>{
     const slot=JSON.parse(localStorage.getItem(store))[key].slots[i];
     return slot?.id===id&&slot.duringTargetId===(during||undefined);
    },[store,key,i,id,during??null]);
   };
   const view=async name=>page.locator(`[data-view="${name}"]`).tap();
   const open=async()=>{
    await page.goto(url,{waitUntil:'domcontentloaded'});
    const button=page.locator('[data-td41-team-plan="polish"]');
    if(!await button.isVisible())await page.locator('[data-td71-toggle="polish"]').click();
    await button.click();
   };
   const search=async name=>{
    const details=page.locator('#td4Edit > details').first();
    if(!await details.evaluate(e=>e.open))await details.locator('summary').first().click();
    await page.locator('#td4Search').fill(name);
    await page.locator(`#td4SearchResults [data-value="${name}"]`).first().click();
    await page.locator('#td63ManualCandidate [data-td63-manual-select]:not(:disabled)').waitFor();
   };
   const apply=()=>page.locator('#td63ManualCandidate [data-td63-manual-select]').click();
   const select=async (i,name,id,during)=>{
    await tile(i).tap();
    await search(name);
    await apply();
    await expect(i,id,during);
    await page.waitForFunction(i=>{
     const tile=document.querySelector(`[data-td4-slot="${i}"]`);
     const edit=document.querySelector('#td4Edit');
     const header=document.querySelector('body > header');
     const top=Math.max(8,(header?.getBoundingClientRect().bottom||0)+8);
     const row=tile.getBoundingClientRect(),editor=edit.getBoundingClientRect();
     return tile.classList.contains('td64-selected')&&Math.abs(row.top-top)<6&&editor.top>=row.bottom&&
      editor.top<innerHeight&&document.activeElement?.tagName!=='INPUT';
    },i);
   };
   const pair=async(i,during,final)=>{
    const names=tile(i).locator('.td42-mon-pair strong');
    assert.deepEqual(await names.allTextContents(),[during,final]);
    assert.deepEqual(await tile(i).locator('.td772-stage>small').allTextContents(),['During game','Final']);
    assert.match(await tile(i).locator('.td772-active-stage').textContent(),new RegExp(during));
    await view('final');
    assert.deepEqual(await names.allTextContents(),[during,final]);
    assert.match(await tile(i).locator('.td772-active-stage').textContent(),new RegExp(final));
   };
   const shot=async name=>{if(evidence){await fs.mkdir(evidence,{recursive:true});await page.screenshot({path:`${evidence}/${width}-${name}.png`});}};

   await open();
   await view('during');
   await select(0,'eevee',133,133);
   await view('final');
   await choice.selectOption('196');
   await expect(0,196,133);
   await view('during');
   const plannedTypeCount=page.locator('#td4Coverage .td42-coverage').filter({hasText:'Potential STAB coverage'})
    .locator('.td44-cover-col').last().locator('strong');
   assert.match(await plannedTypeCount.textContent(),/^0\//);
   await pair(0,'Eevee','Espeon');
   assert.match(await plannedTypeCount.textContent(),/^2\//);
   assert.equal((await tile(0).textContent()).match(/Obtain Eevee/g).length,1);
   const modes=(await read()).slots[0];
   assert.notDeepEqual(modes.duringMoves,modes.plannedMoves);

   await select(1,'espeon',196);
   await view('during');
   await choice.selectOption('133');
   await expect(1,196,133);
   await pair(1,'Eevee','Espeon');

   await view('during');
   await select(2,'trapinch',328,328);
   await view('final');
   await search('flygon');
   await apply();
   await expect(2,330,328);
   await view('during');
   await pair(2,'Trapinch','Flygon');

   await select(3,'flygon',330);
   await view('during');
   await search('trapinch');
   await apply();
   await expect(3,330,328);
   await pair(3,'Trapinch','Flygon');
   await view('during');
   await choice.selectOption('329');
   await expect(3,330,329);
   await pair(3,'Vibrava','Flygon');

   await view('during');
   await select(4,'flygon',330,330);
   assert.deepEqual(await tile(4).locator('.td42-mon-pair strong').allTextContents(),['Flygon']);
   await tile(5).tap();
   const first=page.locator('#td4Candidates [data-candidate-id]').first();
   await first.waitFor();
   assert.match(await first.locator('strong').first().textContent(),/^#1 · /);
   const candidateId=Number(await first.getAttribute('data-candidate-id'));
   await first.locator('[data-td4-candidate]').click();
   await apply();
   await expect(5,candidateId,candidateId);
   await search('eevee');
   await apply();
   await expect(5,133,133);
   await view('final');
   await choice.selectOption('196');
   await expect(5,196,133);
   await view('during');
   page.once('dialog', dialog=>dialog.dismiss());
   await choice.selectOption('197');
   assert.equal((await read()).slots[5].id,196);
   page.once('dialog', dialog=>dialog.accept());
   await choice.selectOption('197');
   await expect(5,197,197);
   assert.deepEqual(await tile(5).locator('.td42-mon-pair strong').allTextContents(),['Umbreon']);

   const before=await read();
   await open();
   const after=await read();
   for(const [i,old] of before.slots.entries()){
    assert.equal(after.slots[i].id,old.id);
    assert.equal(after.slots[i].duringTargetId,old.duringTargetId);
    assert.deepEqual(after.slots[i].plannedMoves,old.plannedMoves);
    assert.deepEqual(after.slots[i].duringMoves,old.duringMoves);
    assert.deepEqual(after.slots[i].acquisitionRoute,old.acquisitionRoute);
   }
   await page.waitForFunction(()=>document.querySelectorAll('#td4Slots .td772-active-stage').length>=3);
   await tile(2).evaluate(e=>e.scrollIntoView({block:'center'}));
   await shot('unowned-pairs');
   assert.deepEqual(errors,[]);
   console.log(width+'px: both selection orders, intermediate/identical stages, incompatible branch confirmation, all six row anchors and reload persistence passed');
   await context.close();
  }
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
