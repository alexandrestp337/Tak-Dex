const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const app=fs.readFileSync(new URL('../../app.js','file://'+__filename),'utf8');
const context=vm.createContext({window:null,trainerRostersV57:{}});
context.window=context;
vm.runInContext(fs.readFileSync(new URL('../../acquisition-v77.js','file://'+__filename),'utf8'),context);
const start=app.indexOf('(function(){',app.indexOf('// DEV6.2: conservative story gates.'));
vm.runInContext(app.slice(start,app.indexOf('// V74 DEV4: playthrough Team Planner',start)),context);
const {td62Progress:engine,takDexAcquisitionV77:data}=context;
test('Timing distinguishes versions, postgame, evolution requirements and unknown routes',()=>{
 assert.equal(data.lookup('Black 2','mareep').rank,0);
 assert.equal(data.lookup('Black','mareep'),null);
 assert.equal(data.lookup('Black 2','magby').rank,1);
 assert.equal(data.lookup('White 2','magby').kind,'trade');
 assert.match(data.lookup('Black 2','ampharos').note,/Lv 30/);
 assert.match(data.lookup('Black 2','gigalith').note,/Emolga/);
 assert.match(data.lookup('Black 2','arcanine').note,/Fire Stone/);
 assert.equal(data.lookup('Black 2','magikarp').rank,10);
 assert.equal(engine.encounter('Black 2',['undocumented area','walk']),null);
});
test('Encounter accessibility separates area, Surf and fishing timing',()=>{
 const surf=engine.encounter('Black 2',['Route 19','surf']);
 assert.equal(surf.areaRank,0);
 assert.equal(surf.rank,5);
 assert.equal(surf.requirement,'Surf');
 assert.equal(engine.encounter('Black 2',['Route 19','super-rod']).rank,10);
 assert.equal(engine.encounter('Black','Village Bridge'.split('|')),null);
 assert.equal(engine.location('Black','Village Bridge'),10);
 assert.equal(engine.location('Black 2','Village Bridge'),6);
});

test('Verified final forms retain earlier stages, item and encounter gates',()=>{
 assert.match(data.lookup('Black 2','gliscor').note,/Gligar.*Razor Fang/);
 assert.match(data.lookup('Black 2','golduck').note,/Psyduck.*Lv 33/);
 assert.equal(data.lookup('Black 2','vaporeon').rank,5);
 assert.match(data.lookup('Black 2','vaporeon').note,/Requires Surf/);
 assert.equal(data.lookup('Black 2','archen').rank,10);
 assert.equal(data.lookup('Black','archen').rank,3);
 assert.match(data.hidden('White 2','minccino','skill-link'),/Hidden Grotto/);
 assert.equal(data.lookup('Black 2','conkeldurr').kind,'trade');
 const index=require('../../db74/planner-v77.json');
 assert.equal(index[644][0],1);
 assert.equal(index[151][0],1);
 assert.equal(index[55][0],0);
 assert.equal(index[55][1][3],95);
 assert.ok(index[55][4][14]>0);
});

test('Verified encounter routes preserve fishing, Surf and seasonal prerequisites',()=>{
 const surf=data.encounterRoute('Black 2',['unova-route-19','surf',10,20,[]]);
 assert.equal(surf.rank,5);
 assert.match(surf.note,/Requires Surf/);
 assert.equal(data.encounterRoute('Black 2',['unova-route-19','super-rod',10,20,[]]).rank,10);
 const winter=data.encounterRoute('White 2',['unova-route-7','walk',10,20,['season-winter']]);
 assert.match(winter.note,/winter/);
 assert.equal(data.encounterRoute('White 2',['unova-route-7','walk',10,20,['undocumented-flag']]),null);
 assert.match(data.lookup('White 2','braviary').note,/Monday/);
 assert.match(data.lookup('Black 2','mandibuzz').note,/Thursday/);
 assert.equal(data.lookup('Black','cranidos').rank,10);
});

test('Round 3 named examples distinguish evolution, cave, gift and version restrictions',()=>{
 assert.match(data.lookup('Black 2','garchomp').note,/Benga.*Lv 48/);
 assert.equal(data.lookup('White 2','garchomp').kind,'trade');
 assert.match(data.lookup('Black 2','claydol').path.requirement,/36/);
 assert.equal(data.lookup('Black 2','golurk').rank,9);
 assert.equal(data.placeName('unova-victory-road-2 · unknown-area-71','Black 2'),'Victory Road · Cave');
 assert.equal(data.placeName('nature-sanctuary','Black 2'),'Nature Preserve');
 assert.equal(data.encounterRoute('Black 2',['unova-route-7 · hidden-grotto','hidden-grotto',30,34,[]]).rank,5);
 assert.equal(data.encounterRoute('Black 2',['floccesy-ranch · hidden-grotto','hidden-grotto',10,14,[]]),null);
});

test('Round 4 machine gates preserve field requirements, NPC prerequisites and version differences',()=>{
 for(const asset of ['unova-v74.js','unova-b2w2-v74.js','tutor-locations.js']){
  vm.runInContext(fs.readFileSync(new URL('../../'+asset,'file://'+__filename),'utf8'),context);
 }
 const machine=[['machine',0]];
 const torment=engine.moveTiming('Black 2','torment',machine);
 assert.equal(torment.rank,5);
 assert.match(torment.text,/Surf.*spring or summer/);
 assert.equal(engine.moveTiming('Black','torment',machine).rank,2);
 const snarl=engine.moveTiming('Black','snarl',machine);
 assert.equal(snarl.rank,null);
 assert.match(snarl.text,/never distributed/);
 assert.equal(engine.moveTiming('Black 2','snarl',machine).rank,3);
 const protect=engine.moveTiming('White','protect',machine);
 assert.equal(protect.rank,null);
 assert.match(protect.text,/60 seen entries/);
 assert.equal(engine.moveTiming('Black 2','torment',[...machine,['level-up',20]]).rank,5);
});

test('Round 4 Nature Preserve, Starmie and Hidden Grotto requirements stay explicit',()=>{
 const nature=data.encounterRoute('Black 2',['nature-sanctuary','walk',45,50,[]]);
 assert.equal(nature.rank,10);
 assert.match(nature.note,/Permit.*Juniper.*Mistralton City/);
 assert.equal(data.encounterRoute('Black',['nature-sanctuary','walk',45,50,[]]),null);
 const starmie=data.lookup('Black 2','starmie');
 assert.equal(starmie.rank,6);
 assert.match(starmie.path.requirement,/Water Stone.*Surf/);
 assert.match(starmie.path.alternative,/rippling water.*Undella Town/);
 assert.equal(data.encounterRoute('White 2',['unova-route-2 · hidden-grotto','hidden-grotto',55,55,[]]).rank,10);
});

test('Verified native level evolutions preserve each parent link and version restriction',()=>{
 const pack=require('../../db74/e-black-2.json');
 const croc=data.levelPath('Black 2',553,pack,[]);
 assert.equal(croc.rank,3);
 assert.equal(croc.path.stage,'Krokorok');
 assert.match(croc.path.requirement,/40/);
 assert.equal(data.levelPath('Black 2',125,pack,[]),null);
 assert.equal(data.levelPath('White 2',125,pack,[]).rank,1);
 assert.equal(data.levelPath('Black 2',534,pack,[{id:533}]),null);
 assert.equal(data.levelPath('Black 2',135,pack,[{id:133}]),null);
});

test('Finite species and machines distinguish reusable or renewable routes',()=>{
 assert.equal(data.limitedMachine('Blue','earthquake'),true);
 assert.match(data.machineLocation('Yellow','hm03'),/Safari Zone.*Soul Badge/);
 assert.match(data.machineLocation('Red','tm15'),/5,500 Game Corner coins/);
 assert.equal(data.limitedMachine('Yellow','ice-beam'),true);
 assert.equal(data.limitedMachine('Red','double-team'),false);
 assert.equal(data.limitedMachine('Crystal','earthquake'),true);
 assert.equal(data.limitedMachine('Black 2','earthquake'),false);
 assert.equal(data.limitedSpecies('Black',9).find(r=>r.species.includes(564)).renewable,false);
 assert.equal(data.limitedSpecies('Black 2',9).find(r=>r.species.includes(564)).renewable,true);
 assert.ok(data.limitedSpecies('FireRed',9).some(r=>r.species.includes(133)));
 assert.ok(!data.limitedSpecies('FireRed',10).some(r=>r.species.includes(133)));
 assert.ok(!data.limitedSpecies('Emerald',10).some(r=>r.species.includes(345)));
});

test('Red, Blue and Yellow routes keep named gates, fishing and trade rules distinct',()=>{
 const red=require('../../db74/e-red.json');
 const yellow=require('../../db74/e-yellow.json');
 assert.equal(data.encounterRoute('Red',['kanto-route-22','walk',4,4,[]]).rank,0);
 assert.match(data.encounterRoute('Red',['kanto-route-22','old-rod',5,5,[]]).note,/Old Rod.*Vermilion/);
 assert.match(data.encounterRoute('Yellow',['pokemon-tower · 3f','walk',18,18,[]]).note,/Silph Scope/);
 assert.match(data.encounterRoute('Yellow',['cerulean-cave · b1f','static',70,70,[]]).note,/Hall of Fame.*Surf/);
 assert.equal(data.encounterRoute('FireRed',['cerulean-cave · b1f','static',70,70,[]]),null);
 assert.match(data.lookup('Red','mr-mime',red.entries[122]).note,/Abra/);
 assert.match(data.lookup('Yellow','mr-mime',yellow.entries[122]).note,/Clefairy/);
 assert.match(data.lookup('Yellow','parasect',yellow.entries[47]).alternatives[0].note,/Tangela.*Safari Zone/);
 assert.equal(data.lookup('Red','bulbasaur',red.entries[1]).kind,'tradePossible');
 assert.match(data.lookup('Yellow','bulbasaur',yellow.entries[1]).note,/happy starter Pikachu/);
});

test('Johto verifies times, version-specific legendary gates and Crystal resources separately',()=>{
 const qwilfish=data.encounterRoute('Gold',['johto-route-32','old-rod',5,5,['swarm-yes']]);
 assert.equal(qwilfish.rank,1);
 assert.match(qwilfish.note,/Old Rod.*Fisher Ralph.*swarm call/);
 assert.match(data.encounterRoute('Crystal',['johto-route-29','walk',2,4,['time-night']]).note,/night/);
 const lapras=data.encounterRoute('Silver',['union-cave · b2f','static',20,20,['weekday-friday']]);
 assert.equal(lapras.rank,4);
 assert.match(lapras.note,/Morty.*Fridays/);
 assert.equal(data.lookup('Silver','lugia').rank,7);
 assert.equal(data.lookup('Gold','lugia').rank,10);
 assert.match(data.lookup('Crystal','ho-oh').note,/three legendary beasts.*Hall of Fame/);
 assert.equal(data.lookup('Crystal','remoraid').kind,'trade');
 assert.match(data.lookup('Crystal','elekid').note,/Odd Egg/);
 assert.match(data.machineLocation('Crystal','hm07'),/Ice Path.*Rising Badge/);
 assert.equal(engine.moveTiming('Crystal','waterfall',[['machine',0]]).rank,7);
 assert.match(engine.moveTiming('Crystal','ice-beam',[['tutor',0]]).text,/Wednesday or Saturday.*4,000/);
 assert.equal(engine.moveTiming('Gold','ice-beam',[['tutor',0]]),null);
});

test('Unova sequel breeding, branch evolutions and starter tutors match their specific gates',()=>{
 assert.equal(data.lookup('Black 2','larvesta').rank,10);
 assert.match(data.lookup('Black 2','larvesta').note,/Volcarona.*Hall of Fame/);
 assert.match(data.lookup('White 2','budew').note,/Rose Incense/);
 assert.equal(data.lookup('Black 2','numel').kind,'trade');
 assert.equal(data.lookup('White 2','espeon').rank,2);
 assert.equal(data.lookup('White 2','leafeon').rank,10);
 assert.equal(data.lookup('Black 2','eelektross').path.level,39);
 assert.equal(data.lookup('White 2','chandelure').path.resource,'dusk-stone');
 assert.match(data.lookup('White 2','tornadus-incarnate').reason,/Dream Radar/);
 assert.equal(engine.moveTiming('Black','grass-pledge',[['tutor',0]]).rank,4);
 assert.match(engine.moveTiming('Black','grass-pledge',[['tutor',0]]).text,/friendship/);
 assert.equal(engine.moveTiming('White','hydro-cannon',[['tutor',0]]).rank,10);
 assert.equal(engine.moveTiming('Black 2','hydro-cannon',[['tutor',0]]).rank,5);
 assert.match(engine.moveTiming('White 2','secret-sword',[['tutor',0]]).text,/Pledge Grove.*event Keldeo/);
});

test('Final stage scheduling prevents impossible retained and post-evolution level combinations',()=>{
 const before={stage:0,at:46};
 const after={stage:1,at:28};
 assert.equal(data.scheduleEvolutionMoves([1,1],20,50,[[before],[after]]),null);
 const recall={stage:1,minimum:28};
 assert.deepEqual([...data.scheduleEvolutionMoves([1,1],20,50,[[before],[after,recall]])],[before,recall]);
 assert.equal(data.scheduleEvolutionMoves([33,1],20,32,[[{stage:0,at:24}]]),null);
 assert.equal(data.scheduleEvolutionMoves([33,1],30,45,[[{stage:0,at:24}]]),null);
});

test('Unova resource accounting separates field copies, renewable stock and a genuine shortfall',()=>{
 const stones=[{item:'dusk-stone',member:'Chandelure'},{item:'dusk-stone',member:'Lampent plan'}];
 const early=data.resourceBudget('Black 2',4,stones)[0];
 assert.equal(early.shortfall,2);
 assert.equal(early.renewable,'');
 const late=data.resourceBudget('White 2',6,stones)[0];
 assert.equal(late.guaranteed,1);
 assert.equal(late.shortfall,1);
 assert.match(late.renewable,/Chargestone Cave/);
 assert.equal(data.resourceBudget('Black 2',9,stones)[0].shortfall,0);
 assert.equal(data.resourceBudget('Emerald',9,stones).length,0);
});

test('Documented Unova swarms, residents, NPC swaps and transfers retain their evidence',()=>{
 assert.match(data.lookup('Black 2','farfetchd').note,/National Pokédex.*electronic board/);
 assert.equal(data.lookup('White 2','volbeat').kind,'trade');
 assert.match(data.lookup('White','bagon').note,/Grace.*White Forest/);
 assert.equal(data.transferOnly('Black',371,'bagon').source,'white-forest-residents');
 assert.match(data.lookup('Black 2','mawile').note,/Yancy.*male player/);
 assert.match(data.lookup('White 2','sableye').note,/Curtis.*female player/);
 assert.match(data.lookup('Black 2','glameow').reason,/Quiet Hidden Grottoes.*White 2/);
 assert.equal(data.transferOnly('White 2',1,'bulbasaur').kind,'trade');
 const pack=require('../../db74/e-black-2.json');
 assert.match(data.documentedUnovaAlternative('Black 2','abra',pack).note,/Alakazam.*Hall of Fame/);
 assert.equal(data.documentedUnovaAlternative('Black 2','kadabra',pack).path.level,16);
});

test('Trade evolution equipment is budgeted by version and actual source',()=>{
 const timing=data.lookup('White 2','electivire');
 assert.equal(data.evolutionItem(timing),'electirizer');
 const claim=[{item:'electirizer',member:'Electivire'}];
 assert.equal(data.resourceBudget('White 2',8,claim)[0].guaranteed,1);
 assert.equal(data.resourceBudget('Black 2',8,claim)[0].guaranteed,0);
 assert.match(data.resourceBudget('Black 2',8,claim)[0].renewable,/Antique Shop/);
});

test('Selected V77 routes keep all verified Flygon stages and native direct alternatives',()=>{
 const pack=require('../../db74/e-black-2.json');
 const get=id=>({id,name:pack.mons.find(r=>r[0]===id)[1]});
 const flygon=data.plannerRoutes('Black 2',get(330),pack);
 const trapinch=flygon.find(r=>r.startId===328);
 assert.deepEqual(JSON.parse(JSON.stringify(trapinch.steps.map(s=>[s.name,s.level]))),[['vibrava',35],['flygon',45]]);
 assert.equal(trapinch.initial.minLevel,21);
 assert.ok(flygon.some(r=>r.startId===329&&r.initial.minLevel===38));
 assert.ok(!flygon.some(r=>r.startId===330));
 const golduck=data.plannerRoutes('Black 2',get(55),pack);
 assert.equal(golduck[0].startName,'psyduck');
 assert.ok(golduck.some(r=>r.startName==='golduck'&&r.initial.place==='Village Bridge'&&r.steps.length===0));
 const lucario=data.plannerRoutes('Black 2',get(448),pack);
 assert.ok(lucario.some(r=>r.startName==='riolu'&&/friendship/i.test(r.steps[0].requirement)));
 assert.ok(!lucario.some(r=>r.startName==='lucario'));
});

test('Stone demand follows the exact route and reports blocked demand separately',()=>{
 const pack=require('../../db74/e-black-2.json');
 const arcanine=data.plannerRoutes('Black 2',{id:59,name:'arcanine'},pack);
 const ninetales=data.plannerRoutes('Black 2',{id:38,name:'ninetales'},pack);
 assert.ok(arcanine.every(r=>r.steps[0].resource==='fire-stone'));
 assert.ok(ninetales.some(r=>r.startId===38&&r.steps.length===0));
 assert.ok(ninetales.some(r=>r.startId===37&&r.steps[0].resource==='fire-stone'&&r.rank===10));
 const [budget]=data.resourceBudget('Black 2',3,[
  {item:'fire-stone',member:'Arcanine'}, {item:'fire-stone',member:'Ninetales',projected:true}
 ]);
 assert.equal(budget.projected,1);
 assert.equal(budget.shortfall,0);
 assert.match(budget.renewable,/Battle Subway/);
 const opts1=data.plannerRoutes('Black 2',{id:59,name:'arcanine'},pack,[{id:58,level:11,saveStats:{pid:100}}]);
 const opts2=data.plannerRoutes('Black 2',{id:59,name:'arcanine'},pack,[{id:58,level:33,saveStats:{pid:100}}]);
 assert.equal(opts1[0].id,opts2[0].id);
 assert.equal(opts2[0].initial.minLevel,33);
});

test('Generation V move reminder conditions distinguish original and sequel games',()=>{
 assert.match(data.moveReminder('Black 2').text,/Pokémon World Tournament.*One Heart Scale.*first tournament/);
 assert.match(data.moveReminder('White').text,/Mistralton City.*One Heart Scale.*Chargestone Cave/);
 assert.equal(data.moveReminder('Red'),null);
});
