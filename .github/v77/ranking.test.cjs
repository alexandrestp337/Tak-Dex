const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const app=fs.readFileSync(new URL('../../app.js','file://'+__filename),'utf8');
const part=(from,to)=>app.slice(app.indexOf(from),app.indexOf(to,app.indexOf(from)));
const context=vm.createContext({games:[...Array(18).fill(''), 'Black 2']});
vm.runInContext(part('const chart=','\nconst safe=')+part('function gameGeneration(','\nfunction historicalTypes(').split('\nfunction historicalTypes(')[0].split('\nfunction ')[0]+
 'function matchup(t,types){return types.reduce((n,d)=>n*(chart[t]?.[d]??1),1)}\n'+
 'const typesFor=()=>Object.keys(chart);const metrics=party=>({covered:typesFor().filter(t=>party.some(p=>p.types.some(a=>matchup(a,[t])>1)))});\n'+
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
