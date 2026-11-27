const assert=require('node:assert/strict');
const {chromium}=require('playwright-core');
const {makeSave}=require('../v76/fixtures.cjs');
const url=process.argv[2]||'http://127.0.0.1:8894/';
const key='takdex-v78-state-v1';
const game='Black 2';
const fixture=(sequence,species=509,mask=3,trainer=0)=>makeSave(23,sequence,30,{mask,trainer},[
 {species,pid:species,move:44,ability:22,item:0}
]);

async function State(page){return page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);}
async function waitState(page,fn,arg){await page.waitForFunction(fn,arg);}
async function openTeam(page,id){
 await page.locator('#teamsTab').click();
 const handle=page.locator('[data-td71-toggle="'+id+'"]');
 if(await handle.getAttribute('aria-expanded')!=='true')await handle.click();
}
async function plan(page,id){
 await openTeam(page,id);
 await page.locator('[data-td41-team-plan="'+id+'"]').click();
}
async function create(page,name){
 await page.locator('#addTeam').click();
 await page.locator('#teamName').fill(name);
 await page.locator('#game').selectOption(game);
 await page.getByRole('button',{name:'Create team',exact:true}).click();
}
async function rename(page,id,name){
 await openTeam(page,id);
 await page.locator('[data-edit-card="'+id+'"]').click();
 await page.locator('#editTeamName').fill(name);
 await page.locator('#editTeamForm').getByRole('button',{name:'Save changes',exact:true}).click();
}
async function remove(page,id){
 await openTeam(page,id);
 page.once('dialog',dialog=>dialog.accept());
 await page.locator('[data-delete="'+id+'"]').click();
}

async function teamsAndPlans(browser){
 const context=await browser.newContext({viewport:{width:360,height:900},serviceWorkers:'block'});
 try{
  const a=await context.newPage(),b=await context.newPage();
  const initial=[{id:'left',name:'Original left',game,pokemon:[]},{id:'right',name:'Original right',game,pokemon:[]}];
  await context.addInitScript(({initial,key})=>{
   if(!localStorage.getItem('poketact-teams')&&!localStorage.getItem(key))localStorage.setItem('poketact-teams',JSON.stringify(initial));
  },{initial,key});
  await Promise.all([a.goto(url),b.goto(url)]);
  await Promise.all([create(a,'Created A'),create(b,'Created B')]);
  await waitState(a,()=>JSON.parse(localStorage.getItem('poketact-teams')).length===4);
  await Promise.all([rename(a,'left','Edited left'),rename(b,'right','Edited right')]);
  await waitState(a,()=>JSON.parse(localStorage.getItem('poketact-teams')).filter(t=>t.name.startsWith('Edited')).length===2);
  await Promise.all([plan(a,'left'),plan(b,'right')]);
  await a.locator('#td77Availability').selectOption('badge-3');
  await b.locator('#td77Availability').selectOption('badge-5');
  await waitState(a,()=>{const p=JSON.parse(localStorage.getItem('takdex-v74-playthrough-plans')||'{}');return p['Black 2:left']?.deadline==='badge-3'&&p['Black 2:right']?.deadline==='badge-5';});
  await Promise.all([a.reload(),b.reload()]);
  await Promise.all([rename(a,'left','Conflict A'),rename(b,'left','Conflict B')]);
  await Promise.race([a.getByRole('alert').filter({hasText:'changed in another operation'}).waitFor(),b.getByRole('alert').filter({hasText:'changed in another operation'}).waitFor()]);
  const committed=(await State(a)).teams.left.value.name;
  assert.match(committed,/^Conflict [AB]$/);
  const recovery=await a.locator('#td78WriteWarning').count()?a:b;
  assert.equal(await recovery.getByRole('button',{name:'Download unsaved changes'}).isVisible(),true);
  assert.equal(await recovery.evaluate(()=>document.documentElement.scrollWidth),360);
  await Promise.all([a.reload(),b.reload()]);
  await Promise.all([plan(a,'left'),plan(b,'left')]);
  await a.locator('#td77Availability').selectOption('badge-6');
  await waitState(a,()=>JSON.parse(localStorage.getItem('takdex-v74-playthrough-plans'))['Black 2:left'].deadline==='badge-6');
  await b.locator('#td77Availability').selectOption('badge-7');
  await b.getByRole('alert').filter({hasText:'plan changed in another operation'}).waitFor();
  assert.equal((await State(a)).plans['Black 2:left'].value.deadline,'badge-6');
  await Promise.all([a.reload(),b.reload()]);
  await Promise.all([remove(a,'left'),remove(b,'right')]);
  await waitState(a,key=>{const s=JSON.parse(localStorage.getItem(key));return s.teams.left.value===null&&s.teams.right.value===null;},key);
  const after=await State(a);
  assert.equal(after.plans['Black 2:left'].value,null);
  assert.equal(after.plans['Black 2:right'].value,null);
  assert.equal(Object.values(after.teams).filter(row=>row.value).length,2);
  assert.deepEqual(await a.evaluate(()=>takDexSaveSync.nativeLinks.inspect({teamId:'left',sourceGeneration:0})),{status:'release-authorized',generation:0});
  console.log('Same-origin tabs: distinct create/edit/delete, same-team and same-plan conflict/recovery, independent plans and atomic deletion passed.');
 }finally{await context.close();}
}

async function request(page,id,bytes,options={}){
 return page.evaluate(({id,bytes,options})=>takDexSaveSync.synchronize({teamId:id,bytes:new Uint8Array(bytes),...options}),{id,bytes:[...bytes],options});
}
async function syncTests(browser){
 const context=await browser.newContext({serviceWorkers:'block'});
 try{
  const a=await context.newPage(),b=await context.newPage();
  const initial=['linked','wrap','race','delete','other'].map(id=>({id,name:id,game,pokemon:[]}));
  await context.addInitScript(({initial,key})=>{
   if(!localStorage.getItem('poketact-teams')&&!localStorage.getItem(key))localStorage.setItem('poketact-teams',JSON.stringify(initial));
   window.auditEvents=[];
   for(const name of ['td77:progression','td76:save-synced','td74:team-saved'])
    addEventListener(name,event=>auditEvents.push({name,teamId:event.detail?.teamId}));
  },{initial,key});
  await Promise.all([a.goto(url),b.goto(url)]);
  const read=(seq,species,opts={})=>request(a,'linked',fixture(seq,species),{linked:true,...opts});
  assert.equal(await read(10,509,{modifiedAt:100}), 'updated');
  const events=await a.evaluate(()=>auditEvents.length);
  assert.equal(await read(12,509,{modifiedAt:1}), 'unchanged');
  assert.equal(await a.evaluate(()=>auditEvents.length),events);
  assert.equal((await State(a)).links.linked.value.mark.sequence,12);
  assert.equal(await read(11,551,{modifiedAt:500}), 'stale');
  assert.equal(await read(12,509), 'unchanged');
  await assert.rejects(read(12,551),/same save sequence/);
  await assert.rejects(request(a,'linked',fixture(13,509,3,422),{linked:true}),/different trainer/);
  await a.reload();
  assert.equal(await read(11,551),'stale');
  assert.equal(await request(a,'linked',fixture(8,551),{manual:true}), 'updated');
  assert.equal(await read(13,509), 'unchanged');
  assert.equal((await State(a)).teams.linked.value.pokemon[0].id,551);
  assert.equal((await State(a)).teams.linked.value.saveLink.sequence,8);
  assert.equal(await request(a,'linked',fixture(14,509,7),{linked:true}), 'updated');
  const progressEvents=await a.evaluate(()=>auditEvents.filter(e=>e.name==='td77:progression').length);
  assert.equal(await request(a,'linked',fixture(15,509,15),{linked:true}), 'updated');
  assert.equal(await a.evaluate(()=>auditEvents.filter(e=>e.name==='td77:progression').length),progressEvents+1);
  assert.equal(await request(a,'wrap',fixture(65535),{linked:true}), 'updated');
  assert.equal(await request(a,'wrap',fixture(0,551),{linked:true}), 'updated');
  assert.equal(await request(a,'wrap',fixture(0x8000),{linked:true}), 'stale');

  await a.evaluate(()=>{
   const original=takDexDB74.encounter;window.hydrationWaiters=[];
   takDexDB74.encounter=(...args)=>new Promise(resolve=>hydrationWaiters.push(()=>resolve(original(...args))));
  });
  const pause=async(id,seq,species=509,options={linked:true})=>{
   await a.evaluate(({id,bytes,options})=>{
    const call=takDexSaveSync.synchronize({teamId:id,bytes:new Uint8Array(bytes),...options});
    (window.pausedRequests??=[]).push(call.then(code=>({code}),error=>({error:error.message})));
   },{id,bytes:[...fixture(seq,species)],options});
  };
  const ready=n=>a.waitForFunction(n=>hydrationWaiters.length===n,n);
  const release=i=>a.evaluate(i=>{hydrationWaiters.splice(i,1)[0]();},i);
  const result=i=>a.evaluate(i=>pausedRequests[i],i);
  await pause('race',1);await ready(1);
  await assert.rejects(request(a,'race',Buffer.alloc(0x80000),{manual:true,parsed:{game}}),/No valid Generation V/);
  await openTeam(a,'other');
  await release(0);
  assert.deepEqual(await result(0),{code:'updated'});
  assert.equal(await a.evaluate(()=>current.id),'other');
  assert.equal(await a.evaluate(()=>auditEvents.filter(e=>e.name==='td76:save-synced'&&e.teamId==='race').length),1);
  await pause('race',2,551);await ready(1);
  await pause('race',3,552);await ready(2);
  await release(1);assert.deepEqual(await result(2),{code:'updated'});
  await release(0);assert.deepEqual(await result(1),{code:'stale'});
  await pause('race',4,553);await ready(1);
  await rename(b,'race','Edited during hydration');
  await waitState(b,key=>JSON.parse(localStorage.getItem(key)).teams.race.value.name==='Edited during hydration',key);
  await release(0);assert.match((await result(3)).error,/team was edited/);
  assert.equal((await State(a)).teams.race.value.pokemon[0].id,552);
  await pause('delete',1);await ready(1);
  await remove(b,'delete');
  await waitState(b,key=>JSON.parse(localStorage.getItem(key)).teams.delete.value===null,key);
  await release(0);assert.deepEqual(await result(4),{code:'superseded'});
  await pause('race',4,553);await ready(1);
  assert.equal(await request(b,'race',fixture(1,551),{relink:true,linked:true}),'updated');
  await release(0);assert.deepEqual(await result(5),{code:'stale'});
  assert.equal((await State(b)).teams.race.value.pokemon[0].id,551);
  console.log('Linked save: equivalent watermark, stale/equal conflict, provider time, trainer, manual override, wrap, progression, invalid overlap, order, switch/edit/delete/relink races passed.');
 }finally{await context.close();}
}

async function recoveryAndNative(browser){
 const context=await browser.newContext({serviceWorkers:'block'});
 try{
  const p=await context.newPage();
  await p.goto(url);
  const inspect=(teamId='native',sourceGeneration=0)=>p.evaluate(args=>takDexSaveSync.nativeLinks.inspect(args),{teamId,sourceGeneration});
  for(const [raw,reason] of [[null,'missing'],['[]','empty'],['{','corrupt']]){
   await p.evaluate(raw=>{if(raw===null)localStorage.removeItem('poketact-teams');else localStorage.setItem('poketact-teams',raw);},raw);
   assert.deepEqual(await inspect(),{status:'quarantined',reason});
  }
  const initial=[{id:'native',name:'Native test',game,pokemon:[]}];
  await p.evaluate(initial=>localStorage.setItem('poketact-teams',JSON.stringify(initial)),initial);
  await p.reload();
  assert.equal((await inspect()).status,'associated');
  assert.equal((await inspect('other')).reason,'unassociated');
  assert.equal(await request(p,'native',fixture(100),{linked:true}), 'updated');
  const args={teamId:'native',requestId:'replacement-1',sourceGeneration:0};
  const prepare=(args,bytes)=>p.evaluate(({args,bytes})=>takDexSaveSync.nativeLinks.prepareRelink({...args,bytes:new Uint8Array(bytes)}),{args,bytes:[...bytes]});
  const finish=args=>p.evaluate(args=>takDexSaveSync.nativeLinks.finishRelink(args),args);
  const replacement=fixture(20,551);
  assert.deepEqual(await prepare(args,replacement),{status:'pending',generation:0,nextGeneration:1});
  await p.reload();assert.equal((await inspect()).status,'pending');
  assert.equal((await State(p)).teams.native.value.saveLink.sequence,100);
  assert.equal(await finish({...args,cancel:true}),'cancelled');
  assert.equal((await inspect()).status,'associated');
  await prepare(args,replacement);
  await p.evaluate(key=>{
   window.originalSet=Storage.prototype.setItem;
   Storage.prototype.setItem=function(k,v){if(k===key)throw new DOMException('Simulated quota','QuotaExceededError');return originalSet.call(this,k,v);};
  },key);
  await assert.rejects(request(p,'native',replacement,{...args,linked:true,relink:true}),/Simulated quota/);
  await p.reload();
  assert.equal((await inspect()).status,'pending');
  assert.equal((await State(p)).teams.native.value.saveLink.sequence,100);
  assert.equal(await request(p,'native',replacement,{...args,linked:true,relink:true}),'updated');
  await p.reload();assert.equal((await inspect()).status,'awaiting-native');
  assert.equal(await request(p,'native',replacement,{...args,linked:true,relink:true}),'unchanged');
  assert.equal(await finish({...args,sourceGeneration:1}),'acknowledged');
  assert.equal(await finish({...args,sourceGeneration:1}),'acknowledged');
  assert.equal((await inspect('native',1)).status,'associated');
  assert.equal(await request(p,'native',fixture(101),{linked:true,sourceGeneration:0}),'stale');
  const unlink=()=>p.evaluate(()=>takDexSaveSync.nativeLinks.unlink({teamId:'native',sourceGeneration:1}));
  assert.equal(await unlink(),'unlinked');assert.equal(await unlink(),'unlinked');
  assert.equal((await inspect('native',1)).status,'release-authorized');
  assert.equal((await inspect('native',0)).status,'quarantined');
  assert.equal(await request(p,'native',fixture(102),{linked:true,sourceGeneration:1}),'stale');

  // The app keeps an authoritative atomic snapshot when compatibility projection is interrupted.
  await p.evaluate(()=>{
   window.originalSet=Storage.prototype.setItem;
   Storage.prototype.setItem=function(k,v){if(k==='takdex-v74-playthrough-plans')throw Error('Projection interrupted');return originalSet.call(this,k,v);};
  });
  const imported={format:'takdex-team',version:2,team:{name:'Imported atomically',game,pokemon:[]},
   plan:{game,mode:'during',deadline:'badge-3',slots:[]}};
  async function upload(payload){
   await p.locator('#addTeam').click();
   await p.locator('#importTeamFile').setInputFiles({name:'team.json',mimeType:'application/json',buffer:Buffer.from(payload)});
  }
  await upload(JSON.stringify(imported));
  await p.getByRole('alert').filter({hasText:'Compatibility copies could not be refreshed'}).waitFor();
  const saved=await State(p);
  const importedId=Object.values(saved.teams).find(row=>row.value.name==='Imported atomically').value.id;
  assert.equal(saved.plans[game+':'+importedId].value.deadline,'badge-3');
  await p.reload();await plan(p,importedId);
  assert.equal(await p.locator('#td77Availability').inputValue(),'badge-3');
  await p.locator('#td4Back').click();
  const rejectFile=async payload=>{
   const dialog=p.waitForEvent('dialog').then(async event=>{const message=event.message();await event.dismiss();return message;});
   await upload(payload);
   assert.match(await dialog,/Could not import team/);
   await p.locator('#cancelNew').click();
  };
  const count=Object.values((await State(p)).teams).filter(row=>row.value).length;
  await rejectFile(JSON.stringify({...imported,team:{...imported.team,pokemon:[{id:9,name:'Blastoise',types:['water'],moves:[{name:'Surf',accuracy:999}]}]}}));
  await rejectFile(' '.repeat(2000001));
  assert.equal(Object.values((await State(p)).teams).filter(row=>row.value).length,count);
  const fallback=await p.evaluate(async()=>{
   const reader=takDexStorageV78.create({storage:localStorage});
   try{await reader.commit(()=>{});}catch(error){return {available:!!reader.read().state,code:error.code};}
  });
  assert.deepEqual(fallback,{available:true,code:'COORDINATION'});
  console.log('Native Web contract and recovery: absent/corrupt/empty quarantine, restored association, cancel/ack/retry, older relink, quota/restart, atomic import with projection fault, invalid/oversized JSON and safe fallback passed.');
 }finally{await context.close();}
}

(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{await teamsAndPlans(browser);await syncTests(browser);await recoveryAndNative(browser);}
 finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
