const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const app=fs.readFileSync(new URL('../../app.js','file://'+__filename),'utf8');
const part=(from,to)=>app.slice(app.indexOf(from),app.indexOf(to,app.indexOf(from)));
const context=vm.createContext({games:[...Array(18).fill(''), 'Black 2']});
vm.runInContext(part('const chart=','\nconst safe=')+part('function gameGeneration(','\nfunction historicalTypes(').split('\nfunction historicalTypes(')[0].split('\nfunction ')[0]+
 'function matchup(t,types){return types.reduce((n,d)=>n*(chart[t]?.[d]??1),1)}\n'+
 'const typesFor=()=>Object.keys(chart);function defensiveEffect(move,p){return matchup(move.type,p.types)};\n'+part(' function matchupDefense(', ' function leagueTargets(')+'\n'+
 part(' function statValue(',' async function suggestedMoves(')+part(' function compositionValue(',' function setDeadlineOptions('),context);
const index=require('../../db74/planner-v77.json');
const pokemon=(id,types)=>({types,baseStats:Object.fromEntries(['hp','attack','defense','special-attack','special-defense','speed'].map((k,i)=>[k,index[id][1][i]]))});
const score=context.compositionValue;
test('Different teams change the marginal value of Golduck and Magnezone',()=>{
 const golduck=pokemon(55,['water']),magnezone=pokemon(462,['electric','steel']);
 const waterHeavy=[pokemon(134,['water']),pokemon(62,['water','fighting'])];
 const steelHeavy=[pokemon(227,['steel','flying']),pokemon(82,['electric','steel']),pokemon(376,['steel','psychic'])];
 assert.ok(score([...waterHeavy,magnezone],'Black 2')>score([...waterHeavy,golduck],'Black 2'));
 assert.ok(score([...steelHeavy,golduck],'Black 2')>score([...steelHeavy,magnezone],'Black 2'));
});

test('Defensive compensation distinguishes an uncovered weakness from a practical switch-in',()=>{
 const party=[pokemon(58,['fire']),pokemon(59,['fire']),pokemon(54,['water'])];
 const read=(team,type)=>context.metrics(team,'Black 2').weak.find(row=>row.type===type);
 const ground=read(party,'ground');
 assert.equal(ground.severity,'uncovered');
 assert.equal(ground.weak,2);
 assert.equal(read(party,'water').severity,'partial');
 const withImmune=[...party,pokemon(169,['poison','flying'])];
 assert.equal(read(withImmune,'ground').immune,1);
 assert.ok(read(withImmune,'ground').gap<ground.gap);
});

test('Offensive suitability favors a Water-resistant switch-in over a vulnerable Pokémon',()=>{
 vm.runInContext(part(' function plannerSuitability(', ' function rateMoveChange('),context);
 const electric={type:'electric',priority:0};
 assert.ok(context.plannerSuitability(pokemon(54,['water']),['water'],electric,5)>
  context.plannerSuitability(pokemon(58,['fire']),['water'],electric,5));
 assert.ok(context.plannerSuitability(pokemon(169,['poison','flying']),['water','ground'],electric,5)>
  context.plannerSuitability(pokemon(59,['fire']),['water','ground'],electric,5));
});

test('Two ordinary sturdy resistances can cover two shared weaknesses',()=>{
 const weaknesses=[pokemon(58,['fire']),pokemon(59,['fire'])];
 const counters=[pokemon(134,['water']),pokemon(55,['water'])];
 const row=context.metrics([...weaknesses,...counters],'Black 2').weak.find(type=>type.type==='water');
 assert.equal(row.weak,2);
 assert.equal(row.resist,2);
 assert.equal(row.severity,'compensated');
});

test('Trainer summaries use the same coverage classification as the opponent tiles',()=>{
 const context=vm.createContext({leagueHits:(_,row)=>({status:row})});
 vm.runInContext(part(' function readinessStatus(', ' const readinessLabels='),context);
 const classify=rows=>context.readinessStatus({rows},[]);
 assert.equal(classify(['good','good']),'good');
 assert.equal(classify(['good','nonstab']),'nonstab');
 assert.equal(classify(['good','unknown']),'unknown');
 assert.equal(classify(['nonstab','bad','unknown']),'bad');
 assert.equal(classify([]),'unknown');
});

test('Only the chosen individual can carry known moves across a planned evolution',()=>{
 const actual={id:54,moves:[{name:'Tail Whip'},{name:'Scratch'}]};
 const owned={initial:{kind:'owned'}},wild={initial:{kind:'timed'}};
 const context=vm.createContext({
  ownedFor:(_,slot)=>slot===0?actual:null,
  lineage:id=>new Set(id===55?[55,54]:[id]),
  moveKey:move=>move.name.toLowerCase().replaceAll(' ','-')
 });
 vm.runInContext(part(' function retainsMove(', ' function alignedMoves('),context);
 assert.equal(context.retainsMove({}, {id:55},'scratch',0,owned),true);
 assert.equal(context.retainsMove({}, {id:55},'scratch',0,wild),false);
 assert.equal(context.retainsMove({}, {id:55},'scratch',1,owned),false);
 assert.equal(context.retainsMove({}, {id:19},'scratch',0,owned),false);
});
