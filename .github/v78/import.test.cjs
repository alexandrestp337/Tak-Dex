const test=require('node:test');
const assert=require('node:assert/strict');
const {validate}=require('../../dev1-import.js');
const games=['Black 2'];
const team=()=>({name:'Legacy team',game:games[0],pokemon:[{id:509,name:'Purrloin',types:['dark'],moves:['Scratch'],saveStats:{pid:12}}]});
const file=()=>({format:'takdex-team',version:2,team:team(),plan:{game:games[0],mode:'during',deadline:'pre-league',slots:[
 {id:553,name:'krookodile',types:['ground','dark'],duringTargetId:551,duringSpecies:'sandile',confirmedCandidate:true,locked:true,
  originPid:12,fulfilledPid:42,fulfilledStage:552,acquisitionRoute:{id:'551|walk|Route 4|14|17',startId:551},
  plannedMoves:[{move:'bite',purpose:'temporary',replacement:'crunch'}],duringMoves:[{move:'bite',purpose:'keep'}],
  legacyDisplayNote:'kept'}
]}});
test('Legacy, v1 and v2 retain choices and permit absent historical identities with a warning',()=>{
 assert.deepEqual(validate(team(),games).team,team());
 assert.equal(validate({format:'takdex-team',team:team()},games).plan,null);
 const source=file(),result=validate(source,games);
 assert.deepEqual(result.plan,source.plan);
 assert.equal(result.warnings.length,1);
});
test('Malformed nested move, stats, names, resource URLs, role values and unsupported schema are rejected',()=>{
 const invalid=[
  a=>a.version=3,
  a=>a.team.pokemon[0].moves=[{name:'Scratch',accuracy:101}],
  a=>a.team.pokemon[0].level=101,
  a=>a.team.pokemon[0].saveStats.stats={attack:30},
  a=>a.team.pokemon[0].image='file:///private.png',
  a=>a.team.pokemon[0].image='https://user:secret@example.test/art.png',
  a=>a.plan.slots[0].plannedMoves[0].purpose='invalid',
  a=>a.plan.deadline='unexpected',
  a=>a.plan.slots[0].finalLearnset={learnMethods:{bite:[['level-up',-1]]}},
  a=>a.plan.slots[0].fulfilledPid=-3,
  a=>delete a.plan.slots[0].fulfilledPid,
  a=>a.plan.slots.push({...a.plan.slots[0]}),
  a=>a.team.pokemon.push({...a.team.pokemon[0]}),
  a=>a.team.pokemon[0].types=['unrecognized'],
 ];
 for(const mutate of invalid){
  const source=file();mutate(source);
  assert.throws(()=>validate(source,games),/Invalid team file field/);
 }
});
