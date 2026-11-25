const test=require('node:test');
const assert=require('node:assert/strict');
const {parse}=require('../../gen5-save.js');
const {makeSave,keys}=require('./fixtures.cjs');
for(const [version,game] of [[20,'White'],[21,'Black'],[22,'White 2'],[23,'Black 2']]){
 test(game+' party, stats, form, PP and immutable source',()=>{
  const save=makeSave(version),before=Buffer.from(save);
  const result=parse(save),p=result.pokemon[0];
  assert.equal(result.game,game);
  assert.equal(result.sequence,11);
  assert.equal(p.level,38);
  assert.equal(p.species,550);
  assert.equal(p.form,1);
  assert.equal(p.shiny,true);
  assert.equal(p.currentHP,29);
  assert.equal(p.nature,3);
  assert.equal(p.itemId,287);
  assert.equal(p.abilityId,91);
  assert.equal(p.evs.hp,252);
  assert.deepEqual(Object.values(p.ivs),keys.map(()=>31));
  assert.deepEqual(Object.values(p.stats),[120,100,73,88,65,71]);
  assert.deepEqual(p.moves,[{id:401,remainingPP:9,ppUps:1},null,null,null]);
  assert.deepEqual(save,before);
 });
}
test('Wrapped sequence selects newest valid bank',()=>assert.equal(parse(makeSave(22,0)).sequence,0));
test('Corrupt current bank falls back to intact backup',()=>{
 const bytes=makeSave();
 bytes[0x24000+0x18e10]^=1;
 assert.equal(parse(bytes).pokemon[0].level,37);
 bytes[0x18e10]^=1;
 assert.throws(()=>parse(bytes),/No valid/);
});
test('Malformed lengths and blank saves rejected',()=>{
 assert.throws(()=>parse(new Uint8Array(4)),/512 KiB/);
 assert.throws(()=>parse(new Uint8Array(0x80000)),/No valid/);
});
