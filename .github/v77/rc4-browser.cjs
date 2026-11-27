const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const path=require('node:path');
const {chromium}=require('playwright-core');

const root=process.env.TAKDEX_EVIDENCE||'/workspace/work/checks/rc4';
const target=process.argv[2]||'http://127.0.0.1:8844/';

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
  plan(espeon,['psychic','hyper-voice','shadow-ball','signal-beam'],{duringTargetId:133,duringSpecies:'eevee',duringMoves:['covet','quick-attack','bite','dig'].map(move=>({move,purpose:'keep'}))})];
 second[1].plannedMoves[1]={move:'tackle',purpose:'temporary',replacement:'hyper-voice'};
 second[1].plannedMoves[3]={move:'bite',purpose:'temporary',replacement:'signal-beam'};
 localStorage.setItem('poketact-teams',JSON.stringify([
  {id:'rc3-pairs',name:'RC3 pairs',game,pokemon:[purrloin,tepig,psyduck,null,null,null],saveLink:{progression:{badgeCount:2}}},
  {id:'rc4-black',name:'Original Unova',game:'Black',pokemon:[patrat],saveLink:{progression:{badgeCount:1}}},
  {id:'rc3-weak',name:'RC3 weaknesses',game,pokemon:[patrat,null,null,null,null,null],saveLink:{progression:{badgeCount:2}}}
 ]));
 localStorage.setItem('takdex-v74-playthrough-plans',JSON.stringify({
  [game+':rc3-pairs']:{game,slots:first,deadline:'pre-league'},
  [game+':rc3-weak']:{game,slots:second,deadline:'pre-league'}
 }));
}

(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  for(const width of [360,412,1280]){
   const page=await browser.newPage({viewport:{width,height:900},isMobile:width<600,hasTouch:width<600,ignoreHTTPSErrors:true,serviceWorkers:'block'});
   const dir=path.join(root,String(width));await fs.mkdir(dir,{recursive:true});
   await page.addInitScript(fixture);
   const l=s=>page.locator(s).first();
   const click=s=>l(s).click();
   const open=async id=>{
    await page.goto(target,{waitUntil:'domcontentloaded'});
    await click(`[data-td71-toggle="${id}"]`);
    await click(`[data-td41-team-plan="${id}"]`);
   };
   const shot=async(name,s)=>{
    await l(s).evaluate(el=>el.scrollIntoView({block:'start'}));
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
    await page.screenshot({path:path.join(dir,name+'.png')});
   };
   await open('rc3-pairs');
   await click('[data-td4-slot="2"]');
   await click('#td4Edit > details summary');
   assert.equal(await l('#td4Search').isVisible(),false);
   assert.equal(await l('#td77TypeFilter').isVisible(),false);
   await l('#td775ReplacementLocked').waitFor();
   const a=await l('#td77Lock').boundingBox(),b=await l('#td4Clear').boundingBox();
   assert.equal(a.height,b.height);assert.equal(a.y,b.y);
   await l('#td63ManualCandidate .td774-route-choice').waitFor();
   await shot('locked','#td4Edit > details');
   await shot('controls','#td72MoveHeading');
   await click('[data-view="during"]');
   await l('#td775ReplacementLocked').waitFor();
   assert.equal(await l('#td4Search').isVisible(),false);
   await click('[data-view="final"]');
   await click('#td77Lock');
   await l('#td4Search').waitFor();
   assert.equal(await l('#td4Search').evaluate(el=>document.activeElement===el),false);
   await open('rc3-weak');
   await click('[data-td4-slot="1"]');
   const row=move=>l(`[data-td77-planned-move="${move}"]`);
   await row('hyper-voice').waitFor();
   assert.doesNotMatch(await row('hyper-voice').textContent(),/Temporary:/);
   assert.match(await row('signal-beam').textContent(),/Temporary: Bite/);
   await click('[data-view="during"]');
   const bite=row('bite');await bite.locator('[data-td78-open-move]').click();
   page.once('dialog',d=>d.accept());
   await bite.getByRole('button',{name:'Clear planned move'}).click();
   await click('[data-view="final"]');
   assert.doesNotMatch(await row('signal-beam').textContent(),/Temporary:/);
   for(const [move, label] of [['hyper-voice','Move Tutor'],['signal-beam','Move Tutor'],['shadow-ball','TM30']])
    assert.match(await row(move).locator('.td62-move-timing').textContent(),new RegExp(label));
   const psychic=row('psychic').locator('.td62-move-timing');
   assert.match(await psychic.locator('summary').textContent(),/TM29 · Route 13/);
   await shot('acquisition-closed','[data-td77-planned-move="psychic"]');
   await psychic.locator('summary').click();
   await shot('acquisition-open','[data-td77-planned-move="psychic"]');
   await psychic.locator('[data-td74-dex-map]').first().click();
   await l('#mapsContent').waitFor();await click('#backMaps');
   assert.equal(await psychic.evaluate(el=>el.open),true);
   const gym=l('details:has(> #td77Gyms)');
   if(!await gym.evaluate(el=>el.open))await gym.locator(':scope > summary').click();
   const header=l('#td77Gyms .td775-gym-header');
   assert.match(await header.textContent(),/Cheren.*Aspertia City.*Basic Badge/s);
   await shot('gym','#td77Gyms');
   const improvements=l('details:has(> #td77Improvements)');
   await improvements.locator(':scope > summary').click();
   await click('#td77Improvements .td78-category > summary');
   await click('.td772-team-proposal > summary');
   await shot('improvement','.td772-team-proposal');
   await click('[data-td4-slot="1"]');
   await click('[data-td4-slot="1"]');
   if(!await l('#td4Search').isVisible())await click('#td4Edit > details summary');
   await l('#td4Search').fill('eevee');await click('#td4SearchResults [data-value="eevee"]');
   const options=l('.td772-evolution-choices');
   await options.waitFor();
   assert.equal(await options.locator('[data-td77-cancel-preview]').count(),0);
   await shot('evolution','.td772-evolution-choices');
   if(width<600){
    await l('#td4Search').fill('psyduck');await click('#td4SearchResults [data-value="psyduck"]');
    await options.waitFor();
    assert.equal(await options.locator('[data-td77-plan-endpoint]').count(),1);
    await open('rc4-black');
    const blackGym=l('details:has(> #td77Gyms)');
    if(!await blackGym.evaluate(el=>el.open))await blackGym.locator(':scope > summary').click();
    const lenora=page.locator('.td775-gym-header').filter({hasText:'Lenora'});
    assert.match(await lenora.textContent(),/Nacrene City.*#2 · Basic Badge/s);
    await shot('gym-black','.td775-gym-header:has-text("Lenora")');
   }
   await click('#dexTab');await shot('dex','#dexPage');
   await click('#openTypeExplorer');await l('#typeExplorerPage').waitFor();
   await click('#typeExplorerBack');
   console.log(width+'px: RC4 controls, temporary moves, acquisition/map return, Gym and navigation passed');
   await page.close();
  }
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
