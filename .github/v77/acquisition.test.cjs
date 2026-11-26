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
