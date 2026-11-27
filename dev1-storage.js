/* V78 DEV1: atomic local state and one cross-document writer lane. */
(function(root){
 'use strict';
 const KEY='takdex-v78-state-v1',TEAM_KEY='poketact-teams',PLAN_KEY='takdex-v74-playthrough-plans';
 const tables=['teams','plans','links'];
 const copy=value=>value==null?null:JSON.parse(JSON.stringify(value));
 const same=(a,b)=>JSON.stringify(a??null)===JSON.stringify(b??null);
 const own=(object,key)=>Object.hasOwn(object,key)?object[key]:undefined;
 const blank=()=>({schema:1,revision:0,teams:{},plans:{},links:{}});
 const fault=(code,message)=>Object.assign(Error(message),{code});
 const isTeam=(team,id)=>team&&team.id===id&&typeof team.game==='string'&&typeof team.name==='string'&&Array.isArray(team.pokemon);
 function read(storage){
  try{
   const raw=storage.getItem(KEY);
   if(raw!==null){
    const state=JSON.parse(raw);
    if(state?.schema!==1||!Number.isSafeInteger(state.revision)||state.revision<0||
     tables.some(name=>!state[name]||typeof state[name]!=='object'||Array.isArray(state[name])||
      Object.values(state[name]).some(row=>!row||!Number.isSafeInteger(row.revision)||row.revision<0||
       row.revision>state.revision||!Object.hasOwn(row,'value'))))throw Error('Invalid state envelope');
    if(Object.entries(state.teams).some(([id,row])=>row.value!==null&&!isTeam(row.value,id))||
     Object.values(state.plans).some(row=>row.value!==null&&!Array.isArray(row.value?.slots))||
     Object.values(state.links).some(row=>row.value!==null&&(!Number.isSafeInteger(row.value?.generation)||row.value.generation<0)))
     throw Error('Invalid stored entities');
    return {state,status:'ready'};
   }
   const teamRaw=storage.getItem(TEAM_KEY),planRaw=storage.getItem(PLAN_KEY);
   const teams=JSON.parse(teamRaw??'[]'),plans=JSON.parse(planRaw??'{}');
   if(!Array.isArray(teams)||!plans||typeof plans!=='object'||Array.isArray(plans))throw Error('Invalid legacy state');
   const ids=new Set();
   const state=blank();
   for(const team of teams){
    if(!team||typeof team.id!=='string'||!team.id||ids.has(team.id)||typeof team.game!=='string'||
     typeof team.name!=='string'||!Array.isArray(team.pokemon))throw Error('Invalid legacy team');
    ids.add(team.id);
    Object.defineProperty(state.teams,team.id,{value:{revision:0,value:team},writable:true,enumerable:true,configurable:true});
   }
   for(const [id,value] of Object.entries(plans)){
    if(!value||typeof value!=='object'||!Array.isArray(value.slots))throw Error('Invalid legacy plan');
    Object.defineProperty(state.plans,id,{value:{revision:0,value},writable:true,enumerable:true,configurable:true});
   }
   return {state,status:teamRaw===null?'missing':teams.length?'legacy':'empty'};
  }catch(error){return {state:blank(),status:'corrupt',error};}
 }
 const entry=(state,table,id)=>own(state[table],id)||{revision:0,value:null};
 const values=(state,table)=>Object.fromEntries(Object.entries(state[table]).filter(([,row])=>row.value!==null).map(([key,row])=>[key,row.value]));
 function replace(state,table,id,value){
  if(!tables.includes(table)||typeof id!=='string'||!id)throw Error('Invalid state key');
  const old=entry(state,table,id);
  if(same(old.value,value))return old;
  const row={revision:++state.revision,value:copy(value)};
  Object.defineProperty(state[table],id,{value:row,writable:true,enumerable:true,configurable:true});
  return row;
 }
 function expect(state,table,id,expected){
  const current=entry(state,table,id);
  if(current.revision!==expected.revision||!same(current.value,expected.value))
   throw fault('CONFLICT','This '+(table==='plans'?'plan':'team')+' changed in another operation. Your changes were not applied.');
  return current;
 }
 function endLink(link,intent,game){
  const generation=link?.generation||0;
  const authorizations=new Set(link?.releaseGenerations||[]);
  authorizations.add(generation);
  if(link?.confirmed)authorizations.add(generation-1);
  if(link?.invalidatedGeneration!=null)authorizations.add(link.invalidatedGeneration);
  return {game,generation:generation+1,intent,releaseGenerations:[...authorizations]};
 }
 function mirror(storage,state){
  // Compatibility projections for the legacy adapter and pre-V78 readers.
  // The authoritative envelope always wins if projecting or recovering is interrupted.
  try{
   storage.setItem(TEAM_KEY,JSON.stringify(Object.values(values(state,'teams'))));
   storage.setItem(PLAN_KEY,JSON.stringify(values(state,'plans')));
  }catch(error){return error;}
  return null;
 }
 function create({storage,indexedDB}){
  let connection;
  function connect(){
   if(!indexedDB)return Promise.reject(fault('COORDINATION','Coordinated storage is unavailable. Existing data remains readable and exportable.'));
   if(!connection)connection=new Promise((resolve,reject)=>{
    const request=indexedDB.open('takdex-v78-writer',1);
    request.onupgradeneeded=()=>request.result.createObjectStore('lane');
    request.onerror=()=>reject(request.error);
    request.onblocked=()=>reject(fault('COORDINATION','The storage writer is blocked by another document.'));
    request.onsuccess=()=>{const db=request.result;db.onversionchange=()=>{db.close();connection=null;};resolve(db);};
   }).catch(error=>{connection=null;throw error;});
   return connection;
  }
  async function commit(edit){
   const db=await connect();
   // Every document uses this same IDB readwrite lane. The callback performs
   // synchronous localStorage operations under the lane, with no asynchronous gap.
   return new Promise((resolve,reject)=>{
    const tx=db.transaction('lane','readwrite');
    const request=tx.objectStore('lane').get('writer');
    tx.onerror=()=>reject(tx.error||request.error);
    tx.onabort=()=>reject(tx.error||fault('COORDINATION','The storage writer was interrupted.'));
    request.onsuccess=()=>{
     try{
      const {state,status}=read(storage);
      if(status==='corrupt')throw fault('RECOVERY','Local state needs recovery. Existing storage was left intact.');
      const before=state.revision;
      const result=edit(state);
      if(result?.then)throw TypeError('State mutations must be synchronous.');
      if(state.revision!==before)storage.setItem(KEY,JSON.stringify(state));
      const projectionError=state.revision!==before?mirror(storage,state):null;
      resolve({state,result,projectionError});
     }catch(error){reject(error);}
    };
   });
  }
  return {read:()=>read(storage),commit};
 }
 const api={KEY,TEAM_KEY,PLAN_KEY,read,entry,values,replace,expect,endLink,copy,same,fault,create};
 if(typeof module==='object')module.exports=api;
 else{
  let storage,indexedDB;
  try{storage=root.localStorage;indexedDB=root.indexedDB;}catch{}
  root.takDexStorageV78={...api,...create({storage,indexedDB})};
 }
})(globalThis);
