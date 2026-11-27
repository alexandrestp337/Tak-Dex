const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const read=name=>fs.readFileSync(new URL('../../'+name,'file://'+__filename),'utf8');
const app=read('app.js');
const between=(source,a,b)=>source.slice(source.indexOf(a),source.indexOf(b,source.indexOf(a)));
const context=vm.createContext({window:{}});
vm.runInContext([
 app.split('\n').find(line=>line.startsWith('const chart=')),
 between(app,'function matchup(','function effectText('),
 between(app,'const ALWAYS_HIT_MOVES','function historicalAbilities('),
 between(app,'function td2AllAbilities(','function accuracyLabel('),
 between(app,'function expectedPower(','function effectivePowerLabel('),
 between(app,'function analyze(','const spreadTargets'),
 between(app,'function td33BaseBattleMon(','function showBattle('),
 app.split('\n').find(line=>line.startsWith('const td74TypeItems=')),
 between(app,'function td78ImportedStatus(','function plannerDamageLabel('),
 between(read('v74-ux.js'),'function quickOrder(','function potentialThreat('),
 'const tdDev1Level=(value,fallback)=>value||fallback;',
 'const td73MoveKey=value=>String(value||"").toLowerCase().replaceAll(" ","-");',
 read('battle-outcomes.js')
].join('\n'),context);
const engine=context.window.takDexBattleOutcomes;
const array=value=>value&&Array.from(value);
const {fixtures}=require('./gen5-damage-golden.json');

for(const {label,a,d,m,rolls} of fixtures)test('Gen V golden · '+label,()=>{
 assert.deepEqual(array(context.td78DamageRolls(a,d,m,5)),rolls);
 assert.equal(context.estimateDamage(a,d,m,5),rolls.at(-1));
});

test('The independent 90 HP threshold produces 12.5% on hit and accounts for accuracy',()=>{
 const {a,d,m,rolls}=fixtures[0];
 const reply={name:'Scratch',type:'normal',damageClass:'physical',power:40,accuracy:100};
 assert.equal(rolls.at(-1),91);
 const base=engine.against(a,d,m,reply,5);
 assert.equal(base.firstKo,.125);
 assert.equal(base.preemptiveKo,.125);
 assert.equal(engine.koLabel(base),'OHKO chance: 12.5%');
 assert.equal(engine.against(a,d,{...m,accuracy:90},reply,5).firstKo,.1125);
 assert.equal(engine.against(a,{...d,currentHP:92},m,reply,5).firstKo,0);
 assert.equal(engine.against(a,{...d,currentHP:76},m,reply,5).firstKo,1);
 // Enumerate the independent two-hit cumulative damage with misses.
 const weighted=rolls.map(damage=>[damage,.9/16]).concat([[0,.1]]);
 const nonRecharge=engine.against(a,{...d,currentHP:130},{...m,accuracy:90},reply,5);
 const expected=weighted.reduce((sum,[x,px])=>sum+weighted.reduce((partial,[y,py])=>
  partial+(x+y>=130?px*py:0),0),0);
 assert.ok(Math.abs(nonRecharge.twoHitKo-expected)<1e-10);
});

test('Quick Battle uses base Speed, defensive stats and unknown HP in the same policy',()=>{
 const move=(name,power,type='steel')=>({name,power,type,damageClass:'physical',accuracy:100});
 const baseStats={hp:74,attack:94,defense:131,speed:20,'special-attack':54,'special-defense':116};
 const base={name:'Ferrothorn',types:['grass','steel'],baseStats,moves:[
  move('Gyro Ball',null),move('Iron Head',80),move('Brine',65,'water')]};
 const opponent={name:'Stoutland',types:['normal'],baseStats:{defense:90,speed:80,hp:85},level:50,
  battleStats:{defense:90,speed:80,hp:100},currentHP:20};
 const low={...base,level:10,battleStats:{...baseStats,speed:10,hp:100},currentHP:15,saveStats:{ivs:{speed:0},currentHP:15}};
 const high={...low,level:85,battleStats:{...baseStats,speed:95,attack:240,hp:200},currentHP:200,saveStats:{ivs:{speed:31},currentHP:200}};
 const power=(name,power,actor,target,policy)=>context.td2Power(move(name,power),actor,target,5,policy);
 const report=p=>context.analyze(context.td33BaseBattleMon(p),context.td33BaseBattleMon(opponent),5);
 assert.deepEqual(report(low).offense,report(high).offense);
 assert.equal(report(low).best.name,'Gyro Ball');
 assert.equal(report(low).score,report(high).score);
 assert.equal(context.quickOrder(low,opponent,5),context.quickOrder(high,opponent,5));
 assert.equal(power('Gyro Ball',null,low,opponent,'base').min,101);
 assert.equal(power('Gyro Ball',null,low,opponent).min,150);
 assert.equal(power('Gyro Ball',null,{...high,battleStats:{...high.battleStats,speed:51}},opponent).min,40);
 assert.equal(power('Electro Ball',null,opponent,low,'base').min,150);
 assert.equal(power('Electro Ball',null,opponent,high).min,40);
 for(const [name,def,minimum,maximum] of [['Brine',65,65,130],['Eruption',null,1,150],['Reversal',null,20,200]]){
  const result=power(name,def,low,opponent,'base');
  assert.deepEqual([result.min,result.max],[minimum,maximum]);
  assert.notEqual(power(name,def,low,opponent).max,power(name,def,high,{...opponent,currentHP:100}).max);
 }
});

test('Known status, order and survival safeguards constrain estimates',()=>{
 assert.equal(context.td78ImportedStatus({statusWord:16},5),'burn');
 assert.equal(context.td78ImportedStatus({statusWord:64},5),'paralysis');
 assert.equal(context.td78ImportedStatus({statusWord:136},5),'toxic');
 assert.equal(context.td78ImportedStatus({statusWord:80},5),undefined);
 assert.equal(context.td78ImportedStatus({statusWord:64},4),undefined);
 const {a,d,m}=fixtures[0];
 const reply={name:'Scratch',type:'normal',damageClass:'physical',power:40,accuracy:100,priority:0};
 const certain={...d,currentHP:70};
 assert.equal(engine.against({...a,status:'paralysis'},certain,m,reply,5).firstKo,.75);
 assert.equal(engine.orderChance({...a,status:'paralysis'},d,m,reply,5),0);
 assert.equal(engine.orderChance({...a,status:'paralysis'},d,{...m,priority:1},reply,5),1);
 const band=engine.against(a,{...certain,heldItem:'Focus Band'},m,reply,5);
 assert.equal(band.preemptiveKo,.9);
 assert.equal(band.win,.99);
});

test('Historical factors and fixed damage remain separate from Gen V rounding',()=>{
 const {a,d,m}=fixtures[0];
 assert.equal(context.td78DamageRolls(a,d,m,2).length,39);
 assert.equal(context.td78DamageRolls(a,d,m,3).length,16);
 const fixed={name:'Dragon Rage',type:'dragon',damageClass:'special'};
 assert.deepEqual(array(context.td78DamageRolls(a,d,fixed,1)),[40]);
 assert.equal(context.estimateDamage(a,{...d,types:['steel']},{...m,type:'ghost'},5)<
  context.estimateDamage(a,{...d,types:['steel']},{...m,type:'ghost'},6),true);
});
