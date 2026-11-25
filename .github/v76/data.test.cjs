const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const root=new URL('../../','file://'+__filename);
const read=file=>fs.readFileSync(new URL(file,root),'utf8');

test('Black trainer lists correct known moves without guessing fallback data',()=>{
 const context={window:{}};
 vm.runInNewContext(read('unova-trainer-reference.js'),context);
 const lookup=context.window.takDexUnovaTrainerReference;
 assert.deepEqual(Array.from(lookup('Black','Chili','v1','lillipup',12).moves),['bite','work-up']);
 assert.deepEqual(Array.from(lookup('Black','Alder (postgame)','v2','volcarona',77).moves),['overheat','quiver-dance','bug-buzz','hyper-beam']);
 assert.equal(lookup('Black','Unindexed','v1','lillipup',12),null);
});
test('Black 2 verified Challenge data retains the underlying level and item',()=>{
 const context={window:{}};
 vm.runInNewContext(read('unova-trainer-reference.js'),context);
 const lookup=context.window.takDexUnovaTrainerReference;
 const lillipup=lookup('Black 2','Cheren','v3','lillipup',14);
 assert.equal(lillipup.statLevel,13);
 assert.equal(lillipup.item,'Oran Berry');
 assert.deepEqual(Array.from(lillipup.moves),['work-up','bite','tackle']);
 const kyurem=lookup('Black 2','Ghetsis','v1','hydreigon',52);
 assert.deepEqual(Array.from(kyurem.moves),['dragon-rush','crunch','rock-slide','frustration']);
});
test('Every local script and stylesheet in the page is available in the offline shell',()=>{
 const shell=new Set();
 vm.runInNewContext(read('sw.js')+'; for (const file of FILES) shell.add(file)',{self:{addEventListener(){}},shell});
 const html=read('index.html');
 for(const [,source] of html.matchAll(/(?:<script src|<link rel="stylesheet" href)="([^"]+)"/g)){
  if(!source.includes('://'))assert.ok(shell.has('./'+source),source);
 }
 for(const file of shell){
  if(file==='./')continue;
  assert.ok(fs.existsSync(new URL(file,root)),file);
 }
});
