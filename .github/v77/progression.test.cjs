const test=require('node:test');
const assert=require('node:assert/strict');
const {makeSave}=require('../v76/fixtures.cjs');
const {parse}=require('../../gen5-save.js');

test('B2W2 badges, Surf and first-clear flags are independently verified',()=>{
 for(const version of [22,23]){
  const get=progress=>parse(makeSave(version,10,40,progress)).progression;
  assert.equal(get({}).badgeCount,0);
  assert.deepEqual(get({mask:7,surf:true}).badges,['Basic','Toxic','Insect']);
  assert.deepEqual(get({mask:7,surf:true}).hms,['surf']);
  assert.equal(get({mask:255}).postgame,false);
  assert.equal(get({mask:255,clear:true}).championCompleted,true);
 }
});
test('BW story clear and Champion are separate and invalid optional blocks are ignored',()=>{
 for(const version of [20,21]){
  const save=makeSave(version,10,40,{mask:255,clear:true});
  assert.deepEqual(parse(save).progression.badges.slice(0,2),['Trio','Basic']);
  assert.equal(parse(save).progression.postgame,true);
  assert.equal(parse(save).progression.championCompleted,undefined);
  save[0x24000+0x21204]=0;
  assert.equal(parse(save).progression.badgeCount,undefined);
  assert.equal(parse(save).progression.postgame,true);
 }
});
