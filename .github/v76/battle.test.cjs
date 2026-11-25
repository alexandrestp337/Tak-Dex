const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const read=name=>fs.readFileSync(new URL('../../'+name,'file://'+__filename),'utf8');
const app=read('app.js');
const between=(a,b)=>app.slice(app.indexOf(a),app.indexOf(b,app.indexOf(a)));
const context=vm.createContext({window:{}});
vm.runInContext(between('function movePowerRange','function accuracyLabel')+between('function td74StatEstimate','window.takDexBattleStatsV74')+between('function estimateDamage','function plannerDamageLabel')+read('battle-outcomes.js'),context);
vm.runInContext(`const ALWAYS_HIT_MOVES=new Set(),td74TypeItems={};
const TD74_STAT_KEYS=['hp','attack','defense','speed','special-attack','special-defense'];
const td2ActualAbility=mon=>mon.ability||null,td73MoveKey=value=>String(value||'').toLowerCase().replaceAll(' ','-');
const td72AbilityReport=()=>({possibleImmune:[]}), defensiveEffect=m=>m.effect??1;
const tdDev1Level=(n,f)=>Number(n)||f;`,context);
const outcomes=context.window.takDexBattleOutcomes;
const mon=(speed,moves,hp=100)=>({level:50,types:['normal'],moves,battleStats:{hp,attack:100,defense:100,speed,'special-attack':100,'special-defense':100}});
const move=(name,power,extras={})=>({name,power,priority:0,accuracy:100,type:'fighting',damageClass:'physical',...extras});
test('Faster lethal hit prevents a stronger counterattack, imported Speed can reverse it',()=>{
 const foe=mon(115,[move('Close Combat',120,{effect:2.4})]);
 const player=mon(90,[move('Fire Punch',75,{effect:4})]);
 assert.equal(outcomes.attacks(player,foe,5)[0].acts,0);
 assert.equal(outcomes.attacks(player,foe,5)[0].win,0);
 player.battleStats.speed=130;
 assert.equal(outcomes.attacks(player,foe,5)[0].win,1);
});
test('Current HP and tied Speed affect the first-hit outcome',()=>{
 const shot=move('Earthquake',100,{effect:3});
 const a=mon(100,[shot]),d=mon(100,[shot]);
 assert.equal(outcomes.attacks(a,d,5)[0].win,.5);
 assert.equal(outcomes.attacks({...a,currentHP:0},d,5).length,0);
});
test('Revenge and Avalanche account for negative priority, misses and successful damage',()=>{
 const foe=mon(90,[move('Waterfall',60,{accuracy:80})],200);
 for(const name of ['Revenge','Avalanche']){
  const a=mon(100,[move(name,60,{priority:-4}),move('X Scissor',80)],200);
  const rank=outcomes.attacks(a,foe,5);
  assert.equal(rank[0].m.name,name);
  assert.equal(rank[0].boost,.8);
  assert.ok(rank[0].maximum>rank[0].minimum);
 }
});
test('Payback uses prior action and Assurance requires damage to its target',()=>{
 const foe=mon(110,[move('Waterfall',60,{accuracy:10})],200);
 const a=mon(100,[move('Payback',50),move('Assurance',50)],200);
 const rank=outcomes.attacks(a,foe,5);
 assert.equal(rank[0].m.name,'Payback');
 assert.ok(Math.abs(rank[0].boost-1)<1e-10);
 assert.equal(rank[1].boost,0);
});
test('Post-hit recharge does not hide Hyper Beam OHKO, charging does',()=>{
 const attacks=[move('Overheat',140,{accuracy:90,effect:.85}),move('Hyper Beam',150,{accuracy:90,effect:1.8}),move('Solar Beam',120,{effect:3})];
 const foe=mon(115,attacks),a=mon(90,[move('Quick Attack',40)]);
 assert.equal(outcomes.threat(foe,a,5).m.name,'Hyper Beam');
});
test('Imported stat deltas and underlying Challenge stat level preserve offsets',()=>{
 const base=Object.fromEntries(Object.keys(mon(1,[]).battleStats).map(k=>[k,100]));
 const saveStats={level:50,stats:mon(100,[]).battleStats,nature:3,ivs:base,evs:base};
 const stats=context.td74EntryStats;
 const current=stats(base,{level:50,saveStats,statAdjustments:{speed:4}});
 const next=stats(base,{level:51,saveStats,statAdjustments:{speed:4}});
 assert.equal(current.speed,104);
 assert.equal(next.speed-stats(base,{level:51,saveStats},{}).speed,4);
 assert.equal(stats(base,{level:60,challengeOffset:5,statAdjustments:{speed:4}}).speed,135);
});
test('Sturdy and Focus Sash can survive a full-HP hit to return a KO',()=>{
 const a=mon(90,[move('Fire Punch',75,{effect:4})]);
 const d=mon(115,[move('Close Combat',120,{effect:2.4})]);
 assert.equal(outcomes.attacks({...a,ability:'sturdy'},d,5)[0].win,1);
 assert.equal(outcomes.attacks({...a,heldItem:'Focus Sash'},d,5)[0].win,1);
 assert.equal(outcomes.attacks({...a,currentHP:99,heldItem:'Focus Sash'},d,5)[0].win,0);
});
test('Knockout labels distinguish first-turn certainty, rolls and move accuracy',()=>{
 const target=mon(80,[move('Scratch',20)]);
 const prediction=attack=>outcomes.attacks(mon(120,[attack]),target,5)[0];
 assert.equal(outcomes.koLabel(prediction(move('Fire Punch',75,{effect:4}))),'Guaranteed OHKO');
 assert.equal(outcomes.koLabel(prediction(move('Fire Punch',100,{effect:2.3}))),'OHKO chance: 25%');
 assert.equal(outcomes.koLabel(prediction(move('Fire Punch',75,{effect:4,accuracy:90}))),'OHKO chance: 90%');
});
test('A faster lethal opponent prevents a guaranteed OHKO label',()=>{
 const attacker=mon(80,[move('Fire Punch',75,{effect:4})]);
 const foe=mon(130,[move('Close Combat',120,{effect:4})]);
 const prediction=outcomes.attacks(attacker,foe,5)[0];
 assert.equal(prediction.acts,0);
 assert.equal(prediction.firstKo,0);
 assert.equal(outcomes.koLabel(prediction),'');
});
test('Two-hit labels require two landed attacks and distinguish charge and recharge moves',()=>{
 const target=mon(80,[move('Scratch',20)]);
 const prediction=attack=>outcomes.attacks(mon(120,[attack]),target,5)[0];
 assert.equal(outcomes.koLabel(prediction(move('Fire Punch',50,{effect:2.5}))),'Guaranteed 2HKO');
 assert.equal(outcomes.koLabel(prediction(move('Fire Punch',50,{effect:2.5,accuracy:75}))),'2HKO chance: 56%');
 assert.equal(outcomes.koLabel(prediction(move('Hyper Beam',150,{effect:3,accuracy:90}))),'OHKO chance: 90%');
 const charge=prediction(move('Solar Beam',120,{effect:3}));
 assert.equal(charge.win,1);
 assert.equal(outcomes.koLabel(charge),'');
});
test('Conditional power contributes to two hits without implying an OHKO',()=>{
 const foe=mon(95,[move('Scratch',20)]);
 const attacker=mon(110,[move('Revenge',60,{priority:-4})]);
 const result=outcomes.attacks(attacker,foe,5)[0];
 assert.equal(result.boost,1);
 assert.equal(outcomes.koLabel(result),'2HKO chance: 31%');
});
