const {chromium}=require('playwright-core');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const base=process.argv[2]||'http://127.0.0.1:8795';

(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:412,height:900},isMobile:true,hasTouch:true,acceptDownloads:true,ignoreHTTPSErrors:true});
  page.setDefaultTimeout(12000);
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(()=>{
   if(localStorage.getItem('poketact-teams'))return;
   localStorage.setItem('poketact-teams',JSON.stringify([{id:'legacy',name:'Legacy Team',game:'Black',
    pokemon:[{id:555,name:'Darmanitan',types:['fire'],moves:[{name:'Fire Punch'}],ability:'zen-mode'}]}]));
   localStorage.setItem('takdex-v71-active-team','legacy');
   localStorage.setItem('takdex-v72-6v6-levels',JSON.stringify({legacy:[{id:555,name:'darmanitan',level:50,item:'Choice Band',statAdjustments:{speed:-10,attack:5}}]}));
  });
  await page.goto(base,{waitUntil:'domcontentloaded'});
  const stored=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('poketact-teams')).find(t=>t.id==='legacy').pokemon[0]);
  assert.deepEqual((({level,item,statAdjustments})=>({level,item,statAdjustments}))(await stored()),{level:50,item:'Choice Band',statAdjustments:{speed:-10,attack:5}});
  assert.equal(await page.evaluate(()=>localStorage.getItem('takdex-v72-6v6-levels')),null);
  assert.deepEqual(await page.evaluate(()=>[
   td74HeldItems('Red').filter(Boolean).length,
   td74HeldItems('Gold').includes('Choice Band'),
   td74HeldItems('Ruby').includes('Choice Band'),
   td74HeldItems('Ruby').includes('Choice Scarf'),
   td74HeldItems('Black').includes('Choice Scarf')
  ]),[0,false,true,false,true]);

  const analyze=async()=>{
   await page.locator('#moreTab').click();
   await page.locator('#openPlanner').click();
   await page.locator('#td74Focus [data-td76-move="Fire Punch"]').waitFor();
   assert.equal(await page.locator('#td74EditorOwn').isVisible(),false);
   return page.locator('#td74Focus [data-td76-move="Fire Punch"]').locator('xpath=ancestor::article[1]');
  };
  await page.locator('#moreTab').click();
  await page.locator('#openPlanner').click();
  await page.locator('#planMode').selectOption('custom');
  await page.evaluate(()=>{
   plannerOpp[0]={name:'lucario',level:50,moves:['earthquake'],ability:'inner-focus'};
   renderPlannerSlots('planOpp',plannerOpp,false);
   document.getElementById('planAnalyze').click();
  });
  const moveCard=page.locator('#td74Focus .td76-move-card').filter({has:page.locator('[data-td76-move="Fire Punch"]')});
  const damage=async()=>Number((await moveCard.locator('.td76-damage-text').textContent()).match(/–(\d+) HP/)[1]);
  const start=await damage();
  assert.equal(await page.locator('#td74Focus .td76-turn-order.opponent').isVisible(),true);
  const edit=async()=>{
   await page.locator('#teamsTab').click();
   await page.locator('[data-td74-builder-team="legacy"][data-td74-builder-slot="0"]').click();
   const profile=page.locator('#td77BuilderBattle');
   await profile.waitFor();
   assert.equal(await profile.locator('.td74-battle-stats').evaluate(el=>el.open),false);
   return profile;
  };
  const save=()=>page.locator('#savePoke').click();
  let profile=await edit();
  await profile.locator(':scope > summary').click();
  await profile.locator('.td77-builder-equipment > summary').click();
  await profile.locator('#td77BuilderItem').fill('life orb');
  await profile.locator('[data-td74-item-choice="Life Orb"]').click();
  await save();
  await analyze();
  const lifeOrb=await damage();
  assert.ok(lifeOrb<start);
  assert.equal(await page.evaluate(()=>plannerOwn[0].item),'Life Orb');

  profile=await edit();
  await profile.locator(':scope > summary').click();
  await profile.locator('.td77-builder-equipment > summary').click();
  await profile.locator('.td74-item-clear').click();
  await save();
  await analyze();
  const noItem=await damage();
  assert.ok(noItem<lifeOrb);
  assert.equal(await page.evaluate(()=>plannerOwn[0].item),'');

  profile=await edit();
  await profile.locator(':scope > summary').click();
  await profile.locator('.td74-battle-stats > summary').click();
  await profile.locator('[data-td74-stat="attack"]').fill('250');
  await profile.locator('[data-td74-stat="speed"]').fill('240');
  await profile.locator('#td77BuilderLevel').fill('55');
  await save();
  await analyze();
  const trained=await damage();
  assert.ok(trained>noItem);
  assert.equal(await page.locator('#td74Focus .td76-turn-order.player').isVisible(),true);
  assert.equal(await page.evaluate(()=>plannerOwn[0].level),55);
  assert.equal(await page.locator('#td74OwnChips .td74-crowned').count(),1);

  profile=await edit();
  await profile.locator(':scope > summary').click();
  await profile.locator('.td77-builder-equipment > summary').click();
  await page.locator('#td2TeamAbility').selectOption('sheer-force');
  await save();
  await analyze();
  assert.ok(await damage()>trained);
  assert.match(await page.locator('#td74Focus .td3-ability-name').first().textContent(),/Sheer Force/);
  assert.equal(await page.evaluate(()=>plannerOpp[0].name),'lucario');

  await page.locator('#teamsTab').click();
  const exported=page.waitForEvent('download');
  await page.locator('[data-export-card="legacy"]').click();
  const data=await fs.readFile(await (await exported).path());
  const payload=JSON.parse(data.toString());
  assert.deepEqual(payload.team.pokemon[0],await stored());
  await page.locator('#importTeamFile').setInputFiles({name:'team.json',mimeType:'application/json',buffer:data});
  await page.waitForFunction(()=>JSON.parse(localStorage.getItem('poketact-teams')).length===2);
  assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('poketact-teams'))[1].pokemon[0]),await stored());
  await page.reload({waitUntil:'domcontentloaded'});
  assert.equal((await stored()).ability,'sheer-force');
  assert.equal((await stored()).level,55);
  assert.equal((await stored()).item,'');
  assert.ok((await stored()).statAdjustments.speed>0);

  await page.locator('#moreTab').click();
  await page.locator('#openPlanner').click();
  await page.locator('#planTeam').selectOption('__custom__');
  await page.locator('#td74EditorOwn > summary').click();
  await page.locator('#planOwn details').first().locator('summary').first().click();
  const custom=page.locator('#planOwn input[data-field="name"]').first();
  await custom.fill('lucario');
  await page.locator('#planOwn [data-td66-pokemon="lucario"]').first().click();
  assert.equal(await page.evaluate(()=>plannerOwn[0].name),'lucario');
  await page.locator('#planMode').selectOption('elite');
  await page.locator('#planTrainer').selectOption({label:'Alder (postgame)'});
  const preset=await page.evaluate(()=>plannerOpp.find(mon=>mon.name==='volcarona'));
  assert.equal(preset.ability,'flame-body');
  await page.locator('#td74OppChips [data-td74-i="5"]').click();
  const volcarona=page.locator('#td74Focus [data-td73-mon="volcarona" i]');
  assert.match(await volcarona.locator('.td3-ability-name').textContent(),/Flame Body/);

  const comparison=await page.evaluate(async()=>{
   const entries=[
    {name:'darmanitan-standard',level:64,ability:'sheer-force',item:'Charcoal',moves:['rock-slide','fire-punch','flare-blitz','superpower']},
    {name:'samurott',level:65,ability:'torrent',moves:['surf','waterfall','aqua-jet','revenge']}
   ];
   const opponent=plannerOpp[5], gen=5, game='Black';
   const d=await loadPlannerPokemon(opponent,gen,game);
   const own=await Promise.all(entries.map(entry=>loadPlannerPokemon(entry,gen,game)));
   const outcomes=window.takDexBattleOutcomes;
   const report=own.map(a=>{
    const best=outcomes.attacks(a,d,gen)[0];
    const hyper=d.moves.find(m=>m.name==='Hyper Beam');
    const result=outcomes.against(a,d,best.m,hyper,gen);
    return {name:a.name,move:best.m.name,reply:best.n.name,stats:a.battleStats,
     incoming:best.incomingFirstKo,execute:best.acts,outgoing:best.firstKo,victory:best.win,
     hyper:{incoming:result.incomingFirstKo,execute:result.acts,outgoing:result.firstKo,victory:result.win}};
   });
   plannerOwn=entries;
   renderPlannerSlots('planOwn',plannerOwn,true);
   document.getElementById('planAnalyze').click();
   return {player:report,opponent:d.battleStats};
  });
  const [darmanitan,samurott]=comparison.player;
  assert.equal(darmanitan.move,'Rock Slide');
  assert.equal(samurott.move,'Waterfall');
  assert.ok(darmanitan.hyper.incoming>.5&&darmanitan.hyper.execute<.5);
  assert.equal(samurott.hyper.incoming,0);
  assert.ok(samurott.victory>darmanitan.victory);
  await page.locator('#td74OwnChips .td74-crowned.active').filter({hasText:'Samurott'}).waitFor();
  await page.locator('#td74OwnChips [data-td74-i="0"]').click();
  assert.match(await page.locator('#td74Focus .td76-battle-warning:not(.td76-battle-opportunity)').textContent(),/Hyper Beam can KO/);
  assert.equal(await page.locator('#td74Focus .td76-battle-opportunity').count(),0);
  assert.match(await page.locator('#td74OwnChips .td74-crowned').textContent(),/Samurott/);
  console.log('Alder Volcarona estimated fixture:',JSON.stringify(comparison));

  const abilityChecks=await page.evaluate(()=>{
   const mon=(ability,types=['normal'])=>({
    level:50,types,abilities:[ability].filter(Boolean),
    battleStats:{hp:200,attack:100,defense:100,speed:100,'special-attack':100,'special-defense':100}
   });
   const move=(name,type,power)=>({name,type,power,accuracy:100,damageClass:'physical'});
   const eq=move('Earthquake','ground',100),punch=move('Fire Punch','fire',75);
   return [
    defensiveEffect(eq,mon('levitate',['electric']),5,mon('')),
    defensiveEffect(eq,mon('levitate',['electric']),5,mon('mold-breaker')),
    defensiveEffect(punch,mon('flash-fire'),5,mon('')),
    estimateDamage(mon(''),mon('intimidate'),punch,5)<estimateDamage(mon(''),mon(''),punch,5),
    estimateDamage(mon('sheer-force'),mon(''),punch,5)>estimateDamage(mon(''),mon(''),punch,5)
   ];
  });
  assert.deepEqual(abilityChecks,[0,2,0,true,true]);
  assert.deepEqual(errors,[]);
  console.log('Legacy migration, held-item selection and clear, stat and ability damage changes, speed and ranks, persistence, JSON round trip, hypothetical editors and verified ability rendering passed');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
