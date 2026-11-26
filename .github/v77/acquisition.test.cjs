const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const app=fs.readFileSync(new URL('../../app.js','file://'+__filename),'utf8');
const context=vm.createContext({window:null});
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
 assert.match(data.lookup('Black 2','golduck').note,/psyduck.*Lv 33/);
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
