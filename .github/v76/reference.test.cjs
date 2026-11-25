const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {parse}=require('../../gen5-save.js');
const fixtures=require('./reference.json');

for(const {file,game,sha256,rows} of fixtures){
 test('Public '+game+' save against PKTool', {skip:!process.env.TAKDEX_REFERENCE_SAVES},()=>{
  const input=fs.readFileSync(path.join(process.env.TAKDEX_REFERENCE_SAVES,file));
  const digest=()=>crypto.createHash('sha256').update(input).digest('hex');
  assert.equal(digest(),sha256);
  const save=parse(input);
  assert.equal(save.game,game);
  const actual=save.pokemon.map(p=>[p.species,p.form,p.level,p.currentHP,p.nature,p.itemId,p.abilityId,Number(p.shiny),
   ...Object.values(p.ivs),...Object.values(p.evs),...Object.values(p.stats),
   ...p.moves.flatMap(m=>m?[m.id,m.remainingPP,m.ppUps]:[0,0,0])]);
  assert.deepEqual(actual,rows);
  assert.equal(digest(),sha256);
 });
}
