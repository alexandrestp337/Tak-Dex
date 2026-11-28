const $=id=>document.getElementById(id), games=['Red','Blue','Yellow','Gold','Silver','Crystal','Ruby','Sapphire','Emerald','FireRed','LeafGreen','Diamond','Pearl','Platinum','HeartGold','SoulSilver','Black','White','Black 2','White 2','X','Y','Omega Ruby','Alpha Sapphire','Sun','Moon','Ultra Sun','Ultra Moon','Sword','Shield','Brilliant Diamond','Shining Pearl','Scarlet','Violet'];
const vg={'Red':'red-blue','Blue':'red-blue','Yellow':'yellow','Gold':'gold-silver','Silver':'gold-silver','Crystal':'crystal','Ruby':'ruby-sapphire','Sapphire':'ruby-sapphire','Emerald':'emerald','FireRed':'firered-leafgreen','LeafGreen':'firered-leafgreen','Diamond':'diamond-pearl','Pearl':'diamond-pearl','Platinum':'platinum','HeartGold':'heartgold-soulsilver','SoulSilver':'heartgold-soulsilver','Black':'black-white','White':'black-white','Black 2':'black-2-white-2','White 2':'black-2-white-2','X':'x-y','Y':'x-y','Omega Ruby':'omega-ruby-alpha-sapphire','Alpha Sapphire':'omega-ruby-alpha-sapphire','Sun':'sun-moon','Moon':'sun-moon','Ultra Sun':'ultra-sun-ultra-moon','Ultra Moon':'ultra-sun-ultra-moon','Sword':'sword-shield','Shield':'sword-shield','Brilliant Diamond':'brilliant-diamond-and-shining-pearl','Shining Pearl':'brilliant-diamond-and-shining-pearl','Scarlet':'scarlet-violet','Violet':'scarlet-violet'};
const colors={normal:'#A8A77A',fire:'#EE8130',water:'#6390F0',electric:'#F7D02C',grass:'#7AC74C',ice:'#96D9D6',fighting:'#C22E28',poison:'#A33EA1',ground:'#E2BF65',flying:'#A98FF3',psychic:'#F95587',bug:'#A6B91A',rock:'#B6A136',ghost:'#735797',dragon:'#6F35FC',dark:'#705746',steel:'#B7B7CE',fairy:'#D685AD'};
const chart={normal:{rock:.5,ghost:0,steel:.5},fire:{fire:.5,water:.5,grass:2,ice:2,bug:2,rock:.5,dragon:.5,steel:2},water:{fire:2,water:.5,grass:.5,ground:2,rock:2,dragon:.5},electric:{water:2,electric:.5,grass:.5,ground:0,flying:2,dragon:.5},grass:{fire:.5,water:2,grass:.5,poison:.5,ground:2,flying:.5,bug:.5,rock:2,dragon:.5,steel:.5},ice:{fire:.5,water:.5,grass:2,ice:.5,ground:2,flying:2,dragon:2,steel:.5},fighting:{normal:2,ice:2,rock:2,dark:2,steel:2,poison:.5,flying:.5,psychic:.5,bug:.5,ghost:0,fairy:.5},poison:{grass:2,poison:.5,ground:.5,rock:.5,ghost:.5,steel:0,fairy:2},ground:{fire:2,electric:2,grass:.5,poison:2,flying:0,bug:.5,rock:2,steel:2},flying:{electric:.5,grass:2,fighting:2,bug:2,rock:.5,steel:.5},psychic:{fighting:2,poison:2,psychic:.5,dark:0,steel:.5},bug:{fire:.5,grass:2,fighting:.5,poison:.5,flying:.5,psychic:2,ghost:.5,dark:2,steel:.5,fairy:.5},rock:{fire:2,ice:2,fighting:.5,ground:.5,flying:2,bug:2,steel:.5},ghost:{normal:0,psychic:2,ghost:2,dark:.5},dragon:{dragon:2,steel:.5,fairy:0},dark:{fighting:.5,psychic:2,ghost:2,dark:.5,fairy:.5},steel:{fire:.5,water:.5,electric:.5,ice:2,rock:2,steel:.5,fairy:2},fairy:{fire:.5,fighting:2,poison:.5,dragon:2,dark:2,steel:.5}};
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));const td51DefaultForms={'darmanitan-standard':'Darmanitan','darmanitan-zen':'Darmanitan (Zen Mode)','jellicent-male':'Jellicent','frillish-male':'Frillish','basculin-red-striped':'Basculin','deoxys-normal':'Deoxys','giratina-altered':'Giratina','shaymin-land':'Shaymin','wormadam-plant':'Wormadam','landorus-incarnate':'Landorus','thundurus-incarnate':'Thundurus','tornadus-incarnate':'Tornadus','keldeo-ordinary':'Keldeo','meloetta-aria':'Meloetta','aegislash-shield':'Aegislash','zygarde-50':'Zygarde','pumpkaboo-average':'Pumpkaboo','gourgeist-average':'Gourgeist','meowstic-male':'Meowstic','indeedee-male':'Indeedee','wishiwashi-solo':'Wishiwashi','lycanroc-midday':'Lycanroc','toxtricity-amped':'Toxtricity','urshifu-single-strike':'Urshifu','oricorio-baile':'Oricorio','eiscue-ice':'Eiscue','morpeko-full-belly':'Morpeko','palafin-zero':'Palafin','maushold-family-of-four':'Maushold','dudunsparce-two-segment':'Dudunsparce','squawkabilly-green-plumage':'Squawkabilly','tatsugiri-curly':'Tatsugiri','oinkologne-male':'Oinkologne','basculegion-male':'Basculegion','enamorus-incarnate':'Enamorus'};const td51NameKey=s=>String(s??'').trim().toLowerCase().replace(/\s+/g,'-');const td51Canonical=s=>Object.keys(td51DefaultForms).find(k=>td51NameKey(td51DefaultForms[k])===td51NameKey(s))||td51NameKey(s);const pretty=s=>td51DefaultForms[td51NameKey(s)]||String(s??'').split('-').map(w=>w?w[0].toUpperCase()+w.slice(1):'').join(' ');const pill=t=>`<span class="pill" style="--c:${colors[t]||'#777'}">${safe(pretty(t))}</span>`;const chip=m=>`<span class="movechip" style="--c:${colors[m.type]||'#777'}">${safe(m.name)}</span>`;
// V74 DEV4.1: presentation only; never use a label as a canonical form identifier.
function td71StoredArt(p){const img=String(p?.image||'');const id=Number(p?.id)||window.takDexBWCoreV75?.ids?.[td51Canonical(p?.name)]||window.takDexSpriteIdsV77?.[td51Canonical(p?.name)]||0;return img&&!img.startsWith('blob:')?img:id?'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/'+id+'.png':'';}
function td73IdentityKey(p){return td51Canonical(typeof p==='string'?p:(p?.canonicalName||p?.name||''));}
function td73SamePokemon(a,b){if(!a||!b)return false;const x=Number(a.id),y=Number(b.id);if(x>0&&y>0)return x===y;const k=td73IdentityKey(a);return !!k&&k===td73IdentityKey(b);}
function td73MoveKey(m){return td51NameKey(typeof m==='string'?m:m?.name);}
function td73MoveSignature(moves){return JSON.stringify((moves||[]).map(td73MoveKey).filter(Boolean));}
function td41PokemonLabel(value){const raw=String(value??'');const key=raw.trim().toLowerCase().replace(/\s+/g,'-');return key==='darmanitan-standard'?'Darmanitan':key==='darmanitan-zen'?'Darmanitan (Zen Mode)':pretty(raw);}
// V70: Malformed local storage must never prevent the entire app from starting.
let td70TeamRecovery=null;
function td70ReadTeams(){
 let raw=null;
 try{
  raw=localStorage.getItem(takDexStorageV78.KEY)??localStorage.getItem(takDexStorageV78.TEAM_KEY);
  const snapshot=takDexStorageV78.read();
  if(snapshot.status==='corrupt')throw snapshot.error;
  const data=Object.values(takDexStorageV78.values(snapshot.state,'teams'));
  if(!Array.isArray(data)||!data.every(t=>t&&typeof t==='object'&&typeof t.id==='string'&&typeof t.name==='string'&&games.includes(t.game)&&Array.isArray(t.pokemon)))throw Error('Saved team data is not a valid team array');
  return data;
 }catch(e){
  td70TeamRecovery=raw||'Stored state is inaccessible.';
  try{
   td70TeamRecovery=JSON.stringify({canonical:localStorage.getItem(takDexStorageV78.KEY),
    teams:localStorage.getItem(takDexStorageV78.TEAM_KEY),plans:localStorage.getItem(takDexStorageV78.PLAN_KEY)},null,2);
  }catch{}
  console.warn('Tak-Dex: invalid saved teams preserved for recovery',e);
  return [];
 }
}
let teams=td70ReadTeams(),current=null,slotIndex=0,chosen=null,foe=null,foe2=null,doubleMode=false,names=null,validMoves=[],selectedMoves=[null,null,null,null],lookupVersion=0;const td78Store=window.takDexStorageV78;
const td78TeamWrites=new Map(Object.entries(td78Store.read().state.teams).map(([id,row])=>[id,{row,proposed:row.value}]));
const td78NotifyTeamSaved=teamIds=>window.dispatchEvent(new CustomEvent('td74:team-saved',{detail:{teamIds}}));
let td78Drafts=[];
function td78WriteWarning(error,draft){
 if(draft)td78Drafts.push(td78Store.copy(draft));
 let warning=$('td78WriteWarning');
 if(!warning){
  warning=document.createElement('aside');warning.id='td78WriteWarning';warning.className='card';warning.setAttribute('role','alert');
  const message=document.createElement('p'),download=document.createElement('button');
  download.type='button';download.textContent='Download unsaved changes';
  download.onclick=()=>td70DownloadFile('takdex-unsaved-changes.json',JSON.stringify(td78Drafts,null,2));
  warning.append(message,download);document.querySelector('main').before(warning);
 }
 warning.firstElementChild.textContent=(error?.message||'Could not save local changes.')+(draft?' Download your unsaved changes before reloading.':'');
 warning.lastElementChild.hidden=!td78Drafts.length;
}
async function td78CreateTeam(team,plan){
 await td70EnsureMigrated();
 const result=await td78Store.commit(state=>{
  td78Store.expect(state,'teams',team.id,{revision:0,value:null});
  const names=new Set(Object.values(td78Store.values(state,'teams')).map(row=>row.name.trim().toLowerCase()));
  const base=team.name.trim().slice(0,40);
  let name=base;
  for(let i=2;names.has(name.toLowerCase());i++){
   const suffix=' ('+i+')';
   name=base.slice(0,40-suffix.length).trimEnd()+suffix;
  }
  td78Store.replace(state,'teams',team.id,{...team,name});
  if(plan)td78Store.replace(state,'plans',team.game+':'+team.id,plan);
 });
 td78AcceptTeam(result.state,team.id);
 td78ProjectionWarning(result);
 td78NotifyTeamSaved([team.id]);
}
function td78ProjectionWarning(result){
 if(result.projectionError)td78WriteWarning(Error('Changes are saved in Tak-Dex. Compatibility copies could not be refreshed because storage is full or unavailable.'));
}
function td78AcceptTeam(state,id,{render=false}={}){
 const row=td78Store.entry(state,'teams',id);
 const before=td78TeamWrites.get(id);
 if(before?.pending||before&&!td78Store.same(before.proposed,teams.find(team=>team.id===id)))return;
 const local=teams.find(team=>team.id===id);
 if(row.value){
  if(local){for(const key of Object.keys(local))if(!Object.hasOwn(row.value,key))delete local[key];Object.assign(local,td78Store.copy(row.value));}
  else teams.push(td78Store.copy(row.value));
 }else{
  teams=teams.filter(team=>team.id!==id);
  if(current===local)current=null;
 }
 td78TeamWrites.set(id,{row,proposed:row.value});
 if(render)showTeams();
}
function td78RefreshUnrelatedTeams(state,excluded){
 for(const [id,row] of Object.entries(state.teams)){
  if(excluded.has(id))continue;
  const local=teams.find(team=>team.id===id);
  if(local===current||local&&row.value)continue;
  td78AcceptTeam(state,id);
 }
}
function save({deletedId=null,expectedPlans={}}={}){
 const desired=new Map(teams.map(team=>[team.id,td78Store.copy(team)])),edits=[];
 for(const id of new Set([...td78TeamWrites.keys(),...desired.keys()])){
  if(!desired.has(id)&&id!==deletedId)continue;
  const before=td78TeamWrites.get(id)||{row:{revision:0,value:null},proposed:null};
  const proposed=desired.get(id)||null;
  if(td78Store.same(before.proposed,proposed))continue;
  const write={proposed};
  td78TeamWrites.set(id,write);
  edits.push({id,before,write});
 }
 if(!edits.length)return Promise.resolve(true);
 const operation=Promise.all(edits.map(async ({before})=>before.pending?await before.pending:before.row)).then(expected=>
  td78Store.commit(state=>{
   edits.forEach(({id},i)=>td78Store.expect(state,'teams',id,expected[i]));
   if(deletedId){
    for(const [key,row] of Object.entries(state.plans)){
     if(row.value===null||key.slice(key.indexOf(':')+1)!==deletedId)continue;
     td78Store.expect(state,'plans',key,expectedPlans[key]||{revision:0,value:null});
     td78Store.replace(state,'plans',key,null);
    }
    const link=td78Store.entry(state,'links',deletedId).value;
    td78Store.replace(state,'links',deletedId,td78Store.endLink(link,'deleted'));
   }
   for(const {id,write} of edits){
    const previous=td78Store.entry(state,'teams',id).value;
    if(previous&&write.proposed&&previous.game!==write.proposed.game){
     const link=td78Store.entry(state,'links',id).value;
     td78Store.replace(state,'links',id,{game:write.proposed.game,generation:(link?.generation||0)+1,intent:'game-changed',invalidatedGeneration:link?.invalidatedGeneration??link?.generation??0});
    }
    td78Store.replace(state,'teams',id,write.proposed);
   }
  }));
 for(const {id,write} of edits)write.pending=operation.then(result=>td78Store.entry(result.state,'teams',id));
 return operation.then(result=>{
  for(const {id,write} of edits){
   write.row=td78Store.entry(result.state,'teams',id);write.pending=null;
  }
  td78RefreshUnrelatedTeams(result.state,new Set(edits.map(edit=>edit.id)));
  td78ProjectionWarning(result);showTeams();td78NotifyTeamSaved(edits.map(edit=>edit.id));return true;
 },error=>{
  for(const {write} of edits)write.pending?.catch(()=>{});
  td78WriteWarning(error,edits.map(({id,write})=>({id,team:write.proposed,deleteRequested:id===deletedId})));
  return false;
 });
}
function td78TeamWriteState(id){
 const queued=td78TeamWrites.get(id);
 return queued?.pending?queued.pending:Promise.resolve(queued?.row||{revision:0,value:null});
}
// CacheStorage is larger than localStorage and survives network outages for downloaded records.
const OFFLINE_CACHE='takdex-pokeapi-records-v1';
// V27: resolve name-based lookups to the numbered records stored by the offline downloader.
// PokeAPI list endpoints return canonical numeric URLs, while our UI requests names.
const API_ROOT='https://pokeapi.co/api/v2/';
// V70 storage repair: historical pt-v2 records used ~10 MiB of localStorage.
// IndexedDB is the canonical on-demand API cache. Move each legacy entry only after
// its IndexedDB transaction COMMITTED; never delete data merely because an attempt began.
const TD70_DB_NAME='takdex-cache-v70', TD70_STORE='api-records';
let td70DatabasePromise=null,td70MigrationPromise=null;
function td70DB(){
 if(!('indexedDB' in window))return Promise.reject(Error('IndexedDB is unavailable in this browser'));
 if(!td70DatabasePromise)td70DatabasePromise=new Promise((resolve,reject)=>{
  const req=indexedDB.open(TD70_DB_NAME,1);
  req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(TD70_STORE))req.result.createObjectStore(TD70_STORE)};
  req.onsuccess=()=>resolve(req.result);
  req.onerror=()=>reject(req.error||Error('Unable to open IndexedDB'));
  req.onblocked=()=>reject(Error('An older Tak-Dex tab is blocking the cache migration'));
 }).catch(e=>{td70DatabasePromise=null;throw e});
 return td70DatabasePromise;
}
async function td70IDB(action,key,value){
 const db=await td70DB();
 return new Promise((resolve,reject)=>{
  const tx=db.transaction(TD70_STORE,action==='get'||action==='count'?'readonly':'readwrite');
  const store=tx.objectStore(TD70_STORE);
  let result;
  const req=action==='get'?store.get(key):action==='put'?store.put(value,key):action==='clear'?store.clear():store.count();
  req.onsuccess=()=>{result=req.result};
  tx.oncomplete=()=>resolve(result);
  tx.onabort=()=>reject(tx.error||Error('IndexedDB transaction aborted'));
  tx.onerror=()=>reject(tx.error||Error('IndexedDB transaction failed'));
 });
}
async function td70MigrateOldCache(){
 const oldKeys=[];
 try{for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(key?.startsWith('pt-v2:'))oldKeys.push(key)}}catch(e){throw Error('Cannot read legacy cache: '+e.message)}
 if(!oldKeys.length)return 0;
 let moved=0;
 for(const key of oldKeys){
  const raw=localStorage.getItem(key);
  if(raw===null)continue;
  let value;try{value=JSON.parse(raw)}catch(e){console.warn('Preserving unreadable old API record',key,e);continue}
  // The record may also already exist in the database after a previously interrupted migration.
  await td70IDB('put',key,value);
  localStorage.removeItem(key); // only after successful commit
  moved++;
 }
 if(moved)console.info('Tak-Dex: safely migrated '+moved+' oversized API records to IndexedDB');
 return moved;
}
function td70EnsureMigrated(){
 if(!td70MigrationPromise)td70MigrationPromise=td70MigrateOldCache().catch(e=>{
  td70MigrationPromise=null;console.warn('Tak-Dex legacy cache migration could not complete; original records were kept',e);throw e;
 });
 return td70MigrationPromise;
}
// Start promptly to free space before the next team creation or import.
td70EnsureMigrated().catch(()=>{});
async function td70APICacheGet(key){
 try{const data=await td70IDB('get',key);if(data!==undefined)return data}catch(e){console.warn('IndexedDB read unavailable; checking old cache',e)}
 try{const raw=localStorage.getItem(key);if(raw!==null)return JSON.parse(raw)}catch{}
 return null;
}
async function td70APICachePut(key,data){
 try{await td70IDB('put',key,data)}catch(e){
  // Network and per-game CacheStorage are independent fallbacks; never refill localStorage.
  console.warn('API record could not be saved in IndexedDB',key,e);
 }
}
async function td70ClearAPICache(){
 // Wait out any in-flight migration so it cannot repopulate a cache just cleared by the user.
 try{await td70EnsureMigrated()}catch{}
 await td70IDB('clear');
}
async function td70HasAPICache(){try{return (await td70IDB('count'))>0}catch{return false}}
const td79ApiPending=new Map();
const td79Data=window.takDexOfflineData;
async function offlineRecord(path){
 if(!('caches' in window))return null;
 const names=(await caches.keys()).filter(key=>key===OFFLINE_CACHE||key.startsWith('takdex-reference-v58-'));
 const stores=await Promise.all(names.map(key=>caches.open(key)));
 const clean=path.replace(/^\/+|\/+$/g,'');
 const read=(response,record=clean)=>td79Data.read(response,data=>td79Data.apiShape(record,data));
 const direct=new Set([API_ROOT+path,API_ROOT+clean,API_ROOT+clean+'/']);
 for(const store of stores)for(const url of direct){
  const data=await read(await store.match(url));
  if(data)return data;
 }
 const match=clean.match(/^(pokemon|pokemon-species|move|evolution-chain|machine)\/([^/]+)$/);
 if(!match||/^\d+$/.test(match[2]))return null;
 const kind=match[1],wanted=decodeURIComponent(match[2]).toLowerCase();
 const listPath=kind+'?limit='+({machine:3000,'evolution-chain':1000}[kind]||2000);
 for(const store of stores){
  const list=await read(await store.match(API_ROOT+listPath),listPath);
  const entry=list?.results.find(row=>row.name===wanted);
  if(!entry)continue;
  const data=await read(await store.match(entry.url),entry.url.slice(API_ROOT.length));
  if(data)return data;
 }
 return null;
}
function api(path){
 path=String(path).replace(/^\/+|\/+$/g,'');
 const alias=/^pokemon\/([^/?]+)$/.exec(path);
 if(alias)try{
  const name=decodeURIComponent(alias[1]);
  if(!/^\d+$/.test(name))path='pokemon/'+encodeURIComponent(td51Canonical(name));
 }catch{}
 if(!td79ApiPending.has(path)){
  const task=td79ResolveApi(path).finally(()=>td79ApiPending.delete(path));
  td79ApiPending.set(path,task);
 }
 return td79ApiPending.get(path);
}
async function td79ResolveApi(path){
 try{const bundled=await window.takDexDB74?.api(path);if(bundled)return bundled}catch(e){console.warn('Bundled database fallback:',e.message)}
 const key='pt-v2:'+path,cached=await td70APICacheGet(key);
 if(td79Data.apiShape(path,cached))return cached;
 const offline=await offlineRecord(path).catch(()=>null);
 if(offline)return offline;
 const data=await td79Data.request(API_ROOT+path,{},response=>response.json());
 if(!td79Data.apiShape(path,data))throw Error('Pokédex response failed validation');
 await td70APICachePut(key,data);
 return data;
}
// V74 DEV1: PokéAPI history entries end INCLUSIVELY at the named generation.
// Explicit fallback for cached pre-Fairy records lacking past_types.
const TDDEV1_PRE_FAIRY_NORMAL=new Set([35,36,39,40,173,174,175,176,183,184,209,210,298,468]);
function tdDev1LegacyTypes(types,id,gen){
 if(!gen)return types;
 if(gen<6&&types.includes('fairy')){
  if(TDDEV1_PRE_FAIRY_NORMAL.has(Number(id))){
   // Marill/Azumarill and Togetic/Togekiss require their other original type.
   if([183,184].includes(Number(id)))return ['water'];
   if([176,468].includes(Number(id)))return ['normal','flying'];
   return ['normal'];
  }
  if([122,280,281,282,439].includes(Number(id)))return ['psychic'];
  if(Number(id)===303)return ['steel'];
  if([546,547].includes(Number(id)))return ['grass'];
 }
 if(gen===1&&[81,82].includes(Number(id)))return ['electric'];
 return types;
}
function td76HistoricalStats(data,game){
 const gen=gameGeneration(game), byName=new Map((data.stats||[]).map(r=>[r.stat.name,r]));
 const number=g=>({i:1,ii:2,iii:3,iv:4,v:5,vi:6,vii:7,viii:8,ix:9})[g?.split('-').pop()]||0;
 if(gen)for(const e of [...(data.past_stats||[])].sort((a,b)=>number(b.generation?.name)-number(a.generation?.name))){if(gen<=number(e.generation?.name))for(const r of e.stats||[])if(byName.has(r.stat.name))byName.set(r.stat.name,r);}
 return [...byName.values()];
}
function historicalTypes(data,game){
 const gen=gameGeneration(game);
 let types=data.types||[];
 const number=g=>({i:1,ii:2,iii:3,iv:4,v:5,vi:6,vii:7,viii:8,ix:9})[g?.split('-').pop()]||0;
 if(gen){const entry=(data.past_types||[]).map(e=>({e,through:number(e.generation?.name)})).filter(x=>x.through>=gen&&Array.isArray(x.e.types)).sort((a,b)=>a.through-b.through)[0];if(entry)types=entry.e.types;}
 return tdDev1LegacyTypes(types.slice().sort((a,b)=>a.slot-b.slot).map(t=>t.type.name),data.id,gen);
}
// Repair known old cached typings without discarding teams or forcing a network download.
(function tdDev1RepairTypes(){let dirty=false;for(const t of teams)for(const p of t.pokemon||[])if(p&&Array.isArray(p.types)){const next=tdDev1LegacyTypes(p.types,p.id,gameGeneration(t.game));if(JSON.stringify(next)!==JSON.stringify(p.types)){p.types=next;dirty=true;}}if(dirty)save();})();
async function refreshHistoricalTeamTypes(team){
 if(!team)return;
 const game=team.game, id=team.id;
 let changed=false;
 await Promise.all(team.pokemon.filter(Boolean).map(async p=>{
  try{const data=await api('pokemon/'+p.id);const types=historicalTypes(data,game);
   if(team.game===game&&team.pokemon.includes(p)){
    const abilities=historicalAbilities(data,game);
    const baseStats=Object.fromEntries(td76HistoricalStats(data,game).map(r=>[r.stat.name,r.base_stat]));
    if(JSON.stringify(p.types)!==JSON.stringify(types)||JSON.stringify(p.abilities)!==JSON.stringify(abilities)||JSON.stringify(p.baseStats)!==JSON.stringify(baseStats)||p.weight!==data.weight){
     p.types=types;p.abilities=abilities;p.baseStats=baseStats;p.baseSpeed=baseStats.speed;p.weight=data.weight;changed=true;
    }
   }
  }catch{}
 }));
 if(changed){save();if(current?.id===id){showSlots();if(!$('battlePage').hidden)showBattle()}}
}
const td7DexLimits=[151,251,386,493,649,721,809,905,1025];
const td7OldForms={2:/^unown-/,3:/^(castform-(sunny|rainy|snowy)|deoxys-(attack|defense|speed))$/,4:/^(burmy-(sandy|trash)|wormadam-(sandy|trash)|cherrim-sunshine|shellos-east|gastrodon-east|rotom-(heat|wash|frost|fan|mow)|giratina-origin|shaymin-sky|arceus-.+)$/,5:/^(basculin-blue-striped|darmanitan-zen|deerling-(summer|autumn|winter)|sawsbuck-(summer|autumn|winter)|unfezant-female|frillish-female|jellicent-female|tornadus-therian|thundurus-therian|landorus-therian|kyurem-(black|white)|keldeo-resolute|meloetta-pirouette|genesect-.+)$/};
function td7PokemonAllowed(name,id,g){const gen=gameGeneration(g);if(!gen)return true;const n=td51NameKey(name);if(/-mega(?:-|$)|-primal$/.test(n))return gen===6||gen===7;if(/-gmax$/.test(n))return g==='Sword'||g==='Shield';if(/-alola(?:-|$)/.test(n)&&gen<7||/-galar(?:-|$)/.test(n)&&gen<8||/-hisui(?:-|$)/.test(n)&&gen<8||/-paldea(?:-|$)/.test(n)&&gen<9)return false;if(id>0&&id<10000)return id<=td7DexLimits[gen-1];if(gen<=5){for(let i=2;i<=gen;i++)if(td7OldForms[i]?.test(n)){if(gen===5&&['Black','White'].includes(g)&&/-(therian|resolute|black|white)$/.test(n))return false;return true;}return false;}return true;}
let td7NameIndex=null;
async function listNames(g){if(!td7NameIndex){const rows=(await api('pokemon?limit=2000')).results;td7NameIndex=rows.map((x,i)=>({name:x.name,id:Number(x.url?.match(/\/(\d+)\/?$/)?.[1]||i+1)}));names=td7NameIndex.map(x=>x.name);}return g?td7NameIndex.filter(x=>td7PokemonAllowed(x.name,x.id,g)).map(x=>x.name):names;}
function td7SearchGame(input){const ids={dexInput:'dexGame',tmPokemon:'tmGame',td4Search:'td4Game',td5MonInput:'td72MoveTypeGame',td56A:'td56Game',td56B:'td56Game'};return ids[input.id]?$(ids[input.id])?.value:current?.game||td66SavedGame()||'';}

function td78SearchKey(value){
 return String(value??'').normalize('NFKD').toLowerCase().replaceAll('♀','f').replaceAll('♂','m').replace(/[^a-z0-9]/g,'');
}
function td78SearchMatches(values,value,label=String){
 const query=td78SearchKey(value);
 if(!query)return [...values];
 const score=name=>name===query?0:name.startsWith(query)?1:2;
 return Array.from(values,item=>({item,name:td78SearchKey(label(item))}))
  .filter(row=>row.name.includes(query))
  .sort((a,b)=>score(a.name)-score(b.name)||a.name.localeCompare(b.name))
  .map(row=>row.item);
}
function search(input,results,choose,accept=()=>true){let token=0;input.addEventListener('input',async()=>{const mine=++token,q=input.value.trim().toLowerCase().replace(/\s+/g,'-');results.hidden=true;if(q.length<2)return;results.innerHTML='<p class="note">Searching…</p>';results.hidden=false;try{const found=td78SearchMatches((await listNames(td7SearchGame(input))).filter(accept),q).slice(0,12);if(mine!==token||input.value.trim().toLowerCase().replace(/\s+/g,'-')!==q)return;results.innerHTML=found.map(n=>`<button type="button" data-value="${safe(n)}">${safe(td41PokemonLabel(n))}</button>`).join('')||'<p class="note">No matches</p>'}catch{results.innerHTML='<p class="error">Internet needed for first lookup.</p>'}});results.addEventListener('click',e=>{const b=e.target.closest('[data-value]');if(b){results.hidden=true;input.value=td41PokemonLabel(b.dataset.value);choose(b.dataset.value)}})}
// V71: independent collapsible cards; active editor remains a separate working panel.
const td71ExpandedTeams=new Set();
let td72DetailsTeam=null;
function td78Confirmation(title,detail='',action='Confirm'){
 if($('td78Confirmation'))return Promise.resolve(false);
 const dialog=document.createElement('dialog');
 dialog.id='td78Confirmation';
 dialog.setAttribute('aria-labelledby','td78ConfirmationTitle');
 if(detail)dialog.setAttribute('aria-describedby','td78ConfirmationDetail');
 const previous=document.activeElement;
 dialog.innerHTML=`<form method="dialog"><h3 id="td78ConfirmationTitle">${safe(title)}</h3>
  ${detail?`<p id="td78ConfirmationDetail">${safe(detail)}</p>`:''}<div class="buttons">
  ${action?`<button type="submit" value="cancel" class="td774-secondary" autofocus>Cancel</button>`:''}
  <button type="submit" value="accept"${action?'':' autofocus'}>${safe(action||'OK')}</button></div></form>`;
 document.body.append(dialog);
 return new Promise(resolve=>{
  dialog.addEventListener('close',()=>{
   const accepted=dialog.returnValue==='accept';
   dialog.remove();
   if(previous?.isConnected)previous.focus({preventScroll:true});
   resolve(accepted);
  },{once:true});
  dialog.showModal();
 });
}
let td74InlineSlot=null,td74InlineTeam=null,td74DraftDirty=false,td75Preview=null;
function td71NewTeamId(){return globalThis.crypto?.randomUUID?.()||String(Date.now())+Math.random().toString(36).slice(2)}
async function td74ConfirmCloseInline(){
 if(td74DraftDirty&&!await td78Confirmation('Discard unsaved Pokémon changes?', '', 'Discard'))return false;
 return td74CloseInline();
}
function td74CloseInline(){
 ++lookupVersion;td74InlineSlot=null;td74InlineTeam=null;td74DraftDirty=false;td75Preview=null;
 const form=$('pokeForm');if(form&&form.parentElement!==$('pokeDialog'))$('pokeDialog').appendChild(form);
 return true;
}
function td75UpdateBuilderPreview(mon){
 td75Preview=mon||null;
 if(td74InlineTeam!==current?.id||td74InlineSlot!==slotIndex)return;
 const tile=[...$('teams').querySelectorAll('[data-td74-builder-slot]')].find(el=>el.dataset.td74BuilderTeam===current.id&&Number(el.dataset.td74BuilderSlot)===slotIndex);
 if(!tile)return;
 const p=mon||current.pokemon[slotIndex],label=p?(p.nickname||td41PokemonLabel(p.name)):'Add Pokémon';
 tile.innerHTML=(p?`<img loading="lazy" src="${safe(td71StoredArt(p))}" alt="">`:'<span class="td74-builder-add" aria-hidden="true">＋</span>')+`<span class="td74-builder-name">${safe(label)}</span>`;
 tile.setAttribute('aria-label',p?'Edit '+label:label+' '+(slotIndex+1));
}
function showTeams(){
 const editor=$('editor');if(editor&&editor.parentElement?.closest('#teams'))$('teamsPage').appendChild(editor);if(editor)editor.hidden=true;
 const form=$('pokeForm');if(form?.parentElement!==$('pokeDialog'))$('pokeDialog').appendChild(form);
 const recovery=td70TeamRecovery?'<div class="card" role="alert"><strong>Saved team recovery needed</strong><p>Stored teams could not be read. The original data was not deleted. Export the recovery copy before creating new teams.</p><button type="button" data-td70-recover>Export recovery JSON</button></div>':'';
 $('teams').innerHTML=recovery+(teams.length?teams.map(t=>{
  const expanded=td71ExpandedTeams.has(t.id),selected=td74InlineTeam===t.id?td74InlineSlot:null;
  const members=Array.from({length:6},(_,i)=>{const p=selected===i&&td75Preview?td75Preview:t.pokemon[i],label=p?(p.nickname||td41PokemonLabel(p.name)):'Add Pokémon';return `<button type="button" class="td71-team-member td72-overview-mon td74-builder-tile ${selected===i?'td74-builder-selected':''}" data-td74-builder-team="${safe(t.id)}" data-td74-builder-slot="${i}" aria-expanded="${selected===i}" aria-label="${safe(p?'Edit '+label:label+' '+(i+1))}">${p?`<img loading="lazy" src="${safe(td71StoredArt(p))}" alt="">`:'<span class="td74-builder-add" aria-hidden="true">＋</span>'}<span class="td74-builder-name">${safe(label)}</span></button>${selected!==null&&i===(selected<3?2:5)?'<div class="td74-builder-inline" data-td74-builder-editor></div>':''}`;}).join('');
  return `<article class="card td71-team-card"><button type="button" class="td71-team-header" data-td71-toggle="${safe(t.id)}" aria-expanded="${expanded}"><span><strong>${safe(t.name)}</strong><small>${safe(t.game)}</small></span><span aria-hidden="true">${expanded?'⌃':'⌄'}</span></button>${expanded?`<div class="td71-team-body" data-td71-team-body="${safe(t.id)}"><p>${t.pokemon.filter(Boolean).length}/6 Pokémon</p><div class="td71-team-members td74-builder-grid">${members}</div><button type="button" class="td72-details-toggle" data-td41-team-plan="${safe(t.id)}"><span>Team Planner</span><span aria-hidden="true">›</span></button>${['Black','White','Black 2','White 2'].includes(t.game)?`<div class="td76-save"><label>Import party save <input type="file" accept=".sav" data-save-file="${safe(t.id)}"></label><small role="status" data-save-status="${safe(t.id)}">${safe(window.takDexSaveSync?.description(t)||'Read-only save snapshot')}</small></div>`: ''}<div class="team-actions td72-team-actions"><button type="button" data-edit-card="${safe(t.id)}">Edit team</button><button type="button" data-export-card="${safe(t.id)}">Export</button><button type="button" class="delete-team-link" data-delete="${safe(t.id)}">Delete team</button></div></div>`:''}</article>`;
 }).join(''):'<p>No teams yet.</p>');
 const host=$('teams').querySelector('[data-td74-builder-editor]');if(host&&form)host.appendChild(form);
}
$('teams').onclick=async e=>{
 const plan=e.target.closest('[data-td41-team-plan]');if(plan){if(!await td74ConfirmCloseInline())return;showTeams();window.td41OpenTeamPlan?.(plan.dataset.td41TeamPlan);return;}
 const tile=e.target.closest('[data-td74-builder-team]'),toggle=e.target.closest('[data-td71-toggle]'),edit=e.target.closest('[data-edit-card]'),exp=e.target.closest('[data-export-card]'),del=e.target.closest('[data-delete]');
 if(tile){const id=tile.dataset.td74BuilderTeam,i=Number(tile.dataset.td74BuilderSlot),same=td74InlineTeam===id&&td74InlineSlot===i;if(!await td74ConfirmCloseInline())return;if(current?.id!==id)openTeam(id);if(same){showTeams();return;}td74InlineTeam=id;td74InlineSlot=i;showTeams();editSlot(i);return;}
 if(toggle){const id=toggle.dataset.td71Toggle;if(!await td74ConfirmCloseInline())return;if(td71ExpandedTeams.has(id)){td71ExpandedTeams.delete(id);}else openTeam(id);showTeams();return}
 if(edit){if(!await td74ConfirmCloseInline())return;openTeam(edit.dataset.editCard);$('editTeam').click();return}
 if(exp){const team=teams.find(t=>t.id===exp.dataset.exportCard);if(team)td70ExportTeam(team);return}
 if(del&&await td78Confirmation('Delete this team?','This cannot be undone.','Delete')){
  const id=del.dataset.delete,wasActive=current?.id===id,expectedPlans=td78Store.read().state.plans;if(wasActive)td74CloseInline();teams=teams.filter(t=>t.id!==id);td71ExpandedTeams.delete(id);save({deletedId:id,expectedPlans});
  if(wasActive)td70CloseTeam();showTeams();return;
 }
 if(e.target.closest('[data-td70-recover]')&&td70TeamRecovery)td70DownloadFile('takdex-team-recovery.json',td70TeamRecovery);
};
function openTeam(id){
 const changedTeam=current?.id!==id;if(changedTeam)td74CloseInline();
 current=teams.find(t=>t.id===id)||null;if(!current)return;
 const gameBefore=$('planGame')?.value;
 if(td71ExpandedTeams.size!==1||!td71ExpandedTeams.has(id))td72DetailsTeam=null;
 td71ExpandedTeams.clear();td71ExpandedTeams.add(id);
 try{localStorage.setItem('takdex-v71-active-team',current.id)}catch{}
 if(games.includes(current.game))td66RememberGame(current.game,'team');
 // A saved team, not whichever battle was previously open, is the authority.
 // The V73 keep-planner-state flag only applies to switching tabs in the SAME game.
 if($('planGame')&&gameBefore!==current.game){
   $('planGame').value=current.game;
   if(typeof syncPlanner==='function'){refreshPlannerTeamMenu();$('planTeam').value=current.id;syncPlanner();}
   window.dispatchEvent(new CustomEvent('td75:active-game',{detail:{game:current.game,teamId:current.id}}));
 }else if($('planTeam')&&$('planTeam').value!==current.id&&changedTeam){
   refreshPlannerTeamMenu();$('planTeam').value=current.id;importPlannerTeam();
 }
 if($('mapsGame')&&['Platinum','Black','White','Black 2','White 2'].includes(current.game)){
   if($('mapsGame').value!==current.game)$('mapsGame').value=current.game;
   // Refresh map data without navigating away from the active tab.
   if(typeof window.takDexMapsV73?.setGameContext==='function')window.takDexMapsV73.setGameContext(current.game);
 }
 $('editor').hidden=false;$('editorTitle').textContent=current.name;$('editorGame').textContent=current.game;
 showSlots();enrichTeamMoves();refreshHistoricalTeamTypes(current);showTeams();
 refreshTeamMenus();if(changedTeam&&[...$('tmTeam').options].some(o=>o.value===current.id))$('tmTeam').value=current.id;window.dispatchEvent(new CustomEvent('td5:team-context',{detail:{game:current.game,teamId:current.id}}));
}
const evolutionStatus=new Map(),tdDev1EvolutionPending=new Set();
function tdDev1EvolutionRequest(path){let timer;return Promise.race([api(path),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Evolution lookup timed out')),12000)})]).finally(()=>clearTimeout(timer));}
async function tdDev1EvolutionOptions(p,game){
 const source=await tdDev1EvolutionRequest('pokemon/'+p.id);
 const species=await tdDev1EvolutionRequest('pokemon-species/'+(source.species?.name||p.id));
 const chain=await tdDev1EvolutionRequest(species.evolution_chain.url.replace('https://pokeapi.co/api/v2/',''));
 let node=null;function walk(n){if(n.species.name===species.name)node=n;else (n.evolves_to||[]).forEach(walk)}walk(chain.chain);
 if(!node)throw Error('Species missing from evolution chain');
 const choices=[];
 for(const option of node.evolves_to||[]){
  const next=await tdDev1EvolutionRequest('pokemon-species/'+option.species.name);
  const variety=(next.varieties||[]).find(v=>v.is_default)?.pokemon;
  if(!variety?.name)throw Error('Default evolution form unavailable');
  const candidate=await tdDev1EvolutionRequest('pokemon/'+variety.name);
  if((candidate.moves||[]).some(m=>(m.version_group_details||[]).some(v=>v.version_group.name===vg[game])))choices.push({candidate,details:option.evolution_details});
 }
 return choices;
}
async function checkEvolution(p){
 const team=current;if(!team)return;const game=team.game,key=p.id+':'+game;
 if(evolutionStatus.has(key)||tdDev1EvolutionPending.has(key))return;
 tdDev1EvolutionPending.add(key);
 try{evolutionStatus.set(key,(await tdDev1EvolutionOptions(p,game)).length>0)}catch(e){evolutionStatus.set(key,'error');console.warn('Evolution lookup failed',e)}
 finally{tdDev1EvolutionPending.delete(key);if(current?.game===game&&current.pokemon.some(x=>x?.id===p.id))showSlots();}
}
function showSlots(){$('slots').innerHTML=Array.from({length:6},(_,i)=>{const p=current.pokemon[i];return `<article class="slot">${p?`<button type="button" class="td70-dex-slot" data-td70-dex="${i}" title="Open ${safe(p.name)} in Pokédex"><span class="identity"><img src="${safe(td71StoredArt(p))}" alt=""><span><strong>${safe(p.nickname||td41PokemonLabel(p.name))}</strong>${td3AbilityText(p)}<span class="pills">${p.types.map(pill).join('')}</span></span></span></button><div class="td72-slot-moves">${(p.moves||[]).map(m=>{const power=Number.isFinite(m.power)?m.power:'—',acc=Number.isFinite(m.accuracy)?m.accuracy+'%':m.accuracy===null&&ALWAYS_HIT_MOVES.has(m.name)?'—':'—';return `<div class="td72-slot-move"><span role="button" tabindex="0" data-td5-team-move="${safe(m.name)}" class="movechip td72-move-name td75-team-move" style="--c:${colors[m.type]||'#626774'}"><span>${safe(m.name)}</span>${m.type?`<small class="td75-team-move-type">${safe(pretty(m.type))}</small>`:''}</span><span class="td72-move-extra"><small>PWR ${safe(power)} · ACC ${safe(acc)}</small></span></div>`}).join('')}</div>`:`<strong>Empty slot ${i+1}</strong><p>Add a Pokémon</p>`}<button data-slot="${i}">${p?'Edit':'＋ Add'}</button>${p&&evolutionStatus.get(p.id+':'+current.game)!==false?` <button data-evolve="${i}" ${evolutionStatus.has(p.id+':'+current.game)?'':'disabled'}>${evolutionStatus.get(p.id+':'+current.game)==='error'?'↻ Retry evolution':evolutionStatus.has(p.id+':'+current.game)?'↑ Evolve':'Checking evolution…'}</button>`:''}</article>`}).join('');current.pokemon.filter(Boolean).forEach(p=>{if(!evolutionStatus.has(p.id+':'+current.game))checkEvolution(p)})};$('slots').onclick=e=>{const b=e.target.closest('[data-slot]');if(b)editSlot(Number(b.dataset.slot));const ev=e.target.closest('[data-evolve]');if(ev){const i=Number(ev.dataset.evolve),p=current?.pokemon[i],key=p?.id+':'+current?.game;if(evolutionStatus.get(key)==='error'){evolutionStatus.delete(key);showSlots();}else evolveSlot(i);}const dex=e.target.closest('[data-td70-dex]');if(dex)td70OpenSlotDex(Number(dex.dataset.td70Dex))};
function td70OpenSlotDex(index){
 const mon=td74InlineTeam===current?.id&&td74InlineSlot===index?(chosen||current?.pokemon?.[index]):current?.pokemon?.[index];
 if(!mon||!current)return;
 window.takDexBattleNavigationV73?.showDex(mon.name,'team',{id:mon.id,game:current.game});
}

function clearForm(){++lookupVersion;chosen=null;window.td77BuilderProfile?.clear();td75UpdateBuilderPreview(null);$('pokeResults').hidden=true;$('pokeResults').innerHTML='';validMoves=[];selectedMoves=[null,null,null,null];$('pokeInput').value='';$('pokeNickname').value='';$('pokePreview').innerHTML='';$('td31TeamAbilityHost').innerHTML='';$('moveNote').textContent='Select a Pokémon to load its moves.';$('error').hidden=true;$('savePoke').disabled=true;drawMoves()}
function editSlot(i){slotIndex=i;clearForm();$('pokeHeading').textContent=current.pokemon[i]?td41PokemonLabel(current.pokemon[i].name):'Add Pokémon';$('removePoke').hidden=!current.pokemon[i];$('evolvePoke').hidden=!current.pokemon[i]||evolutionStatus.get(current.pokemon[i]?.id+':'+current.game)===false;if(!$('pokeDialog').open&&(td74InlineTeam!==current.id||td74InlineSlot!==i))$('pokeDialog').showModal();const p=current.pokemon[i];$('td74BuilderDex').hidden=!p;td74DraftDirty=false;if(p){$('pokeInput').value=td41PokemonLabel(p.name);$('pokeNickname').value=p.nickname||'';selectedMoves=(p.moves||[]).concat([null,null,null,null]).slice(0,4);drawMoves();loadPokemon(p.id,p.moves)}}
async function loadPokemon(name,old=[]){const version=++lookupVersion;chosen=null;$('savePoke').disabled=true;$('moveNote').textContent='Loading moves…';try{const p=await api('pokemon/'+name);if(version!==lookupVersion)return;if(!td7PokemonAllowed(p.name,p.id,current.game))throw Error('Pokémon form unavailable in selected game');const types=historicalTypes(p,current.game);const image=p.sprites.other?.['official-artwork']?.front_default||p.sprites.front_default||'';chosen={id:p.id,name:String(p.name).split('-').map(w=>w?w[0].toUpperCase()+w.slice(1):'').join(' '),types,image,baseSpeed:td76HistoricalStats(p,current.game).find(s=>s.stat.name==='speed')?.base_stat,baseStats:Object.fromEntries(td76HistoricalStats(p,current.game).map(s=>[s.stat.name,s.base_stat])),abilities:historicalAbilities(p,current.game),weight:p.weight??null,canonicalName:p.name};window.td77BuilderProfile?.mount(chosen,current.pokemon[slotIndex]);validMoves=p.moves.filter(m=>m.version_group_details.some(d=>d.version_group.name===vg[current.game])).map(m=>m.move.name);selectedMoves=old.concat([null,null,null,null]).slice(0,4);$('pokeHeading').textContent=td41PokemonLabel(chosen.name);$('td74BuilderDex').hidden=false;$('evolvePoke').hidden=current.pokemon[slotIndex]?.id!==p.id||evolutionStatus.get(p.id+':'+current.game)===false;td75UpdateBuilderPreview({...chosen,nickname:$('pokeNickname').value.trim()});$('td31TeamAbilityHost').innerHTML=gameGeneration(current.game)>=3?`<label for="td2TeamAbility">Actual ability</label><select id="td2TeamAbility">${td2AbilityOptions(chosen,current.pokemon[slotIndex]?.id===p.id?current.pokemon[slotIndex]?.ability:'')}</select>${td3AbilityDescriptionHtml(td2ResolveAbility(chosen,current.pokemon[slotIndex]?.id===p.id?current.pokemon[slotIndex]?.ability:''),current.game)}`:'';$('td2TeamAbility')?.addEventListener('change',e=>{td3UpdateAbilityDescription(e.target,current.game);window.td77BuilderProfile?.summary();});window.td77BuilderProfile?.summary();$('td31TeamAbilityHost').querySelectorAll('[data-td3-ability-description]').forEach(td3FillAbilityDescription);drawMoves();Promise.all(selectedMoves.map(async (m,i)=>{if(m){const next=await enrichMove(m,gameGeneration(current.game),current.game);if(version===lookupVersion&&selectedMoves[i]===m)selectedMoves[i]=next}})).then(()=>{if(version===lookupVersion&&!td74DraftDirty)drawMoves()});$('moveNote').textContent=`Moves listed for ${current.game}. Select each attack from the dropdown.`;$('savePoke').disabled=false}catch(e){if(version!==lookupVersion)return;$('error').hidden=false;$('error').textContent='Could not load Pokémon. Check your connection.'}}
function drawMoves(){$('moveFields').innerHTML=Array.from({length:4},(_,i)=>`<div class="moveRow"><b>${i+1}</b><div><div class="search"><input data-move-input="${i}" autocomplete="off" placeholder="Search attack ${i+1}" value="${safe(selectedMoves[i]?.name||'')}"><div class="suggestions" data-results="${i}" hidden></div></div><div class="moveType" data-type="${i}">${selectedMoves[i]?(selectedMoves[i].type?pill(selectedMoves[i].type):'')+moveStats(selectedMoves[i])+`<button type="button" class="td74-builder-move-link" data-td74-builder-move="${safe(selectedMoves[i].name)}">Details</button>`:''}</div></div><button type="button" class="clear" data-clear="${i}">×</button></div>`).join('')}
$('moveFields').addEventListener('input',e=>{const i=e.target.dataset.moveInput;if(i===undefined)return;selectedMoves[+i]=null;const results=document.querySelector(`[data-results="${i}"]`),q=e.target.value.toLowerCase();document.querySelector(`[data-type="${i}"]`).innerHTML='';results.hidden=!q;results.innerHTML=validMoves.filter(n=>n.includes(q.replace(/\s+/g,'-'))).slice(0,12).map(n=>`<button type="button" data-pick="${i}" data-name="${safe(n)}">${safe(td41PokemonLabel(n))}</button>`).join('')||'<p class="note">No matching move for this game</p>'});
$('moveFields').onclick=async e=>{const c=e.target.closest('[data-clear]'),b=e.target.closest('[data-pick]');if(c){td74DraftDirty=true;const i=+c.dataset.clear;selectedMoves[i]=null;drawMoves()}if(b){td74DraftDirty=true;const version=lookupVersion,team=current,slot=slotIndex,i=+b.dataset.pick,n=b.dataset.name;document.querySelector(`[data-results="${i}"]`).hidden=true;$('savePoke').disabled=true;try{const m=await api('move/'+n);if(version!==lookupVersion||current!==team||slotIndex!==slot)return;selectedMoves[i]={name:pretty(n),...moveGenerationData(m,gameGeneration(current.game),current.game),metaGeneration:gameGeneration(current.game),historicalRevision:3,historicalGame:current.game};drawMoves()}catch{if(version!==lookupVersion)return;$('error').hidden=false;$('error').textContent='Could not load move type.'}finally{if(version===lookupVersion&&current===team&&slotIndex===slot)$('savePoke').disabled=!chosen}}};
$('pokeInput').addEventListener('focus',e=>{if(e.target.value)e.target.select()});
$('pokeInput').addEventListener('input',()=>{++lookupVersion;chosen=null;$('savePoke').disabled=true;$('td74BuilderDex').hidden=true;});
$('tdDev1PokeClear').onclick=()=>{const nickname=$('pokeNickname').value;clearForm();$('pokeNickname').value=nickname;$('pokeResults').hidden=true;$('pokeInput').dispatchEvent(new Event('input',{bubbles:true}));$('pokeInput').focus();};
$('pokeForm').addEventListener('input',e=>{td74DraftDirty=true;if(e.target.id==='pokeNickname'&&chosen)td75UpdateBuilderPreview({...chosen,nickname:e.target.value.trim()});});$('pokeForm').addEventListener('change',()=>{td74DraftDirty=true});$('td74BuilderDex').onclick=()=>td70OpenSlotDex(slotIndex);
$('pokeForm').onsubmit=e=>{e.preventDefault();if(!chosen||!current||$('savePoke').disabled)return;if(window.td77BuilderProfile?.stale(current.pokemon[slotIndex])){editSlot(slotIndex);return;}current.pokemon[slotIndex]={...(current.pokemon[slotIndex]?.id===chosen.id?current.pokemon[slotIndex]:{}),...chosen,...window.td77BuilderProfile?.read(),ability:td2AllAbilities(chosen).includes($('td2TeamAbility')?.value)?$('td2TeamAbility').value:'',nickname:$('pokeNickname').value.trim(),moves:selectedMoves.filter(Boolean)};td74CloseInline();save();showSlots();showTeams();if($('pokeDialog').open)$('pokeDialog').close();};$('evolvePoke').onclick=()=>evolveSlot(slotIndex);$('removePoke').onclick=async()=>{const team=current,i=slotIndex;if(!await td78Confirmation('Remove this Pokémon from the team?','','Remove')||team!==current||i!==slotIndex)return;current.pokemon[slotIndex]=null;td74CloseInline();save();showSlots();showTeams();if($('pokeDialog').open)$('pokeDialog').close()};$('cancelPoke').onclick=async()=>{if(!await td74ConfirmCloseInline())return;showTeams();if($('pokeDialog').open)$('pokeDialog').close()};
$('game').innerHTML='<option value="">Choose game…</option>'+games.map(g=>`<option>${g}</option>`).join('');$('game').value='';$('game').required=true;const td71TeamName=$('teamName');function td71UpdateTeamPlaceholder(){td71TeamName.placeholder=games.includes($('game').value)?'My '+$('game').value+' team':'My Pokémon team'}$('game').addEventListener('change',td71UpdateTeamPlaceholder);td71UpdateTeamPlaceholder();$('addTeam').onclick=()=>{$('game').value='';td71UpdateTeamPlaceholder();$('newDialog').showModal()};$('cancelNew').onclick=()=>$('newDialog').close();$('newForm').onsubmit=async e=>{
 e.preventDefault();
 const game=$('game').value,name=$('teamName').value.trim();
 if(!games.includes(game)){$('game').reportValidity();return;}
 if(!name){$('teamName').focus();return;}
 const create=e.submitter||$('newForm').querySelector('button[type=submit]');
 create.disabled=true;
 const team={id:td71NewTeamId(),name,game,pokemon:Array(6).fill(null)};
 try{
  await td78CreateTeam(team);
  $('newDialog').close();$('teamName').value='';showTeams();openTeam(team.id);
 }catch(error){td78WriteWarning(error,team);}
 finally{create.disabled=false;}
};$('closeTeam').onclick=td70CloseTeam;$('editTeamGame').innerHTML=games.map(g=>`<option>${g}</option>`).join('');
$('editTeam').onclick=()=>{if(!current)return;$('editTeamName').value=current.name;$('editTeamGame').value=current.game;$('editTeamDialog').showModal()};
$('cancelEditTeam').onclick=()=>$('editTeamDialog').close();
$('editTeamForm').onsubmit=e=>{e.preventDefault();if(!current)return;const name=$('editTeamName').value.trim();if(!name)return;if(!games.includes($('editTeamGame').value)){td78Confirmation('Choose a valid game.','',null);return}current.name=name;current.game=$('editTeamGame').value;save();showTeams();openTeam(current.id);$('editTeamDialog').close()};
function td70DownloadFile(filename,contents){
 const blob=new Blob([contents],{type:'application/json'}),url=URL.createObjectURL(blob);
 const link=document.createElement('a');link.href=url;link.download=filename;
 document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
}
function td70ShowCopyExport(filename,contents){
 let dialog=$('td70ExportDialog');if(!dialog){
  dialog=document.createElement('dialog');dialog.id='td70ExportDialog';
  dialog.innerHTML='<h3>Save your team</h3><p class="note">File sharing is unavailable in this Android build. Copy the JSON below and save it as a .json file, or use the browser version to download.</p><p class="note" id="td70ExportName"></p><textarea id="td70ExportText" readonly rows="7" style="width:100%;max-width:100%;box-sizing:border-box"></textarea><div class="team-actions"><button type="button" id="td70ExportCopy">Copy JSON</button><button type="button" id="td70ExportClose">Close</button></div>';
  document.body.appendChild(dialog);
  $('td70ExportClose').onclick=()=>dialog.close();
  $('td70ExportCopy').onclick=async()=>{
   const field=$('td70ExportText');field.select();
   try{await navigator.clipboard.writeText(field.value);$('td70ExportCopy').textContent='Copied ✓'}
   catch{try{document.execCommand('copy');$('td70ExportCopy').textContent='Select & copy'}catch{$('td70ExportCopy').textContent='Select & copy'}}
  };
 }
 $('td70ExportName').textContent=filename;$('td70ExportText').value=contents;
 $('td70ExportCopy').textContent='Copy JSON';dialog.showModal();
}
function td77ReadPlans(){
 return td78Store.values(td78Store.read().state,'plans');
}
function td77ProgressSnapshot(value){
 if(value==null)return undefined;
 if(typeof value!=='object'||Array.isArray(value))throw Error('Invalid story progression');
 const result={};
 if(Number.isInteger(value.badgeCount)&&value.badgeCount>=0&&value.badgeCount<=8)result.badgeCount=value.badgeCount;
 if(Array.isArray(value.badges))result.badges=value.badges.filter(x=>typeof x==='string').slice(0,8);
 if(Array.isArray(value.hms))result.hms=value.hms.filter(x=>['cut','fly','surf','strength','waterfall','dive'].includes(x));
 for(const key of ['leagueCompleted','championCompleted','postgame'])if(typeof value[key]==='boolean')result[key]=value[key];
 if(value.events&&typeof value.events==='object')result.events=Object.fromEntries(Object.entries(value.events).filter(([k,v])=>/^[a-zA-Z]+$/.test(k)&&typeof v==='boolean'));
 return result;
}
async function td70ExportTeam(team){
 if(!team)return;
 const payload={format:'takdex-team',version:2,team:{name:team.name,game:team.game,pokemon:team.pokemon},
  plan:td77ReadPlans()[team.game+':'+team.id],progression:td77ProgressSnapshot(team.saveLink?.progression)};
 const json=JSON.stringify(payload,null,2);
 const filename='takdex-'+team.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')+'.json';
 const capacitor=window.Capacitor, native=Boolean(capacitor?.isNativePlatform?.());
 if(native){
  const fs=capacitor.Plugins?.Filesystem,share=capacitor.Plugins?.Share;
  if(fs?.writeFile&&share?.share){
   try{
    // Native Share accepts a real on-device URI, not WebView's blob: download URL.
    const saved=await fs.writeFile({path:filename,data:json,directory:'CACHE',encoding:'utf8'});
    await share.share({title:'Tak-Dex team export',text:'Tak-Dex team: '+team.name,url:saved.uri,dialogTitle:'Save or share your team'});
    return;
   }catch(error){console.warn('Native team export failed; offering copy fallback',error)}
  }
  // This ensures export never becomes an invisible no-op if Capacitor plugins are absent.
  td70ShowCopyExport(filename,json);return;
 }
 // Browsers support normal downloads, with the Web Share API as a fallback.
 td70DownloadFile(filename,json);
}
$('exportTeam').onclick=()=>td70ExportTeam(current);
$('importTeam').onclick=()=>$('importTeamFile').click();
$('importTeamFile').onchange=async e=>{const file=e.target.files?.[0];if(!file)return;try{
 if(file.size>2000000)throw Error('File is too large');
 const {team:source,plan,progression:observed,warnings}=window.takDexImportV78.validate(JSON.parse(await file.text()),games);
 const pokemon=Array.from({length:6},(_,i)=>source.pokemon[i]?{...source.pokemon[i],nickname:source.pokemon[i].nickname?.slice(0,30)||''}:null);
 const team={id:td71NewTeamId(),name:source.name.slice(0,40),game:source.game,pokemon};
 const progression=td77ProgressSnapshot(observed);
 if(progression)team.saveLink={progression,exportedSnapshot:true};
 await td78CreateTeam(team,plan);showTeams();$('newDialog').close();openTeam(team.id);if(warnings.length)td78Confirmation('Team imported',warnings.join('\n'),null);}catch(err){td78Confirmation('Could not import team',err.message,null)}finally{e.target.value=''}};

search($('pokeInput'),$('pokeResults'),n=>{td74DraftDirty=true;const previous=td75Preview||current?.pokemon?.[slotIndex];if(td51Canonical(previous?.name)!==td51Canonical(n))$('pokeNickname').value='';loadPokemon(n)});search($('foeInput'),$('foeResults'),name=>td76ChooseQuickOpponent(name,1));


let evolveBusy=false;
async function evolveSlot(i){
 if(evolveBusy)return;
 const team=current,game=team?.game,old=team?.pokemon[i];if(!old)return;
 evolveBusy=true;
 try{
  const choices=await tdDev1EvolutionOptions(old,game);
  if(current!==team||team.game!==game||team.pokemon[i]!==old)return;
  if(!choices.length){td78Confirmation('No evolution data found for this Pokémon in '+current.game+'.','',null);return}
  let chosenOption=choices[0];
  if(choices.length>1){
   const names=choices.map((c,n)=>`${n+1}. ${pretty(c.candidate.name)}`).join('\n');
   const answer=prompt('Choose an evolution:\n'+names,'1');
   if(answer===null)return;
   chosenOption=choices[Number(answer)-1];if(!chosenOption){td78Confirmation('Invalid selection','',null);return}
  }
  const detail=chosenOption.details?.[0];
  const hints=[];
  if(detail?.min_level)hints.push('Level '+detail.min_level+'+');
  if(detail?.item)hints.push('Use '+pretty(detail.item.name));
  if(detail?.held_item)hints.push('Hold '+pretty(detail.held_item.name));
  if(detail?.trigger?.name==='trade')hints.push('Trade required');
  if(detail?.min_happiness)hints.push('Friendship requirement');
  const note=hints.length?hints.join(', '):'Evolution conditions may apply';
  if(!await td78Confirmation(`Evolve ${old.name} into ${pretty(chosenOption.candidate.name)}?`,note,'Evolve'))return;
  const p=chosenOption.candidate;
  if(current!==team||team.game!==game||team.pokemon[i]!==old)return;
  current.pokemon[i]={...old,id:p.id,name:pretty(p.name),canonicalName:p.name,level:tdDev1Level(old.level,old.saveStats?.level||50),saveStats:undefined,statAdjustments:{},types:historicalTypes(p,game),image:p.sprites.other?.['official-artwork']?.front_default||p.sprites.front_default||'',moves:old.moves,baseSpeed:td76HistoricalStats(p,current.game).find(s=>s.stat.name==='speed')?.base_stat,baseStats:Object.fromEntries(td76HistoricalStats(p,current.game).map(s=>[s.stat.name,s.base_stat])),abilities:historicalAbilities(p,current.game),weight:p.weight??null,ability:(()=>{const next=historicalAbilities(p,game),prior=(old.abilities||[]).find(x=>x?.ability?.name===old.ability);return next.find(x=>x?.ability?.name===old.ability)?.ability?.name||(prior?next.find(x=>x.slot===prior.slot)?.ability?.name:'')||''})()};
  td74DraftDirty=false;save();showSlots();showTeams();if(td74InlineTeam===team.id&&td74InlineSlot===i)editSlot(i);if($('pokeDialog').open)$('pokeDialog').close();
 }catch(e){td78Confirmation('Could not check evolution. Internet may be needed.','',null)}finally{evolveBusy=false}
}
async function td76QuickOpponent(name,game){
 const p=await api('pokemon/'+encodeURIComponent(td73IdentityKey(name)));
 return {id:p.id,canonicalName:p.name,weight:p.weight??null,name:pretty(p.name),types:historicalTypes(p,game),
  image:p.sprites.other?.['official-artwork']?.front_default||p.sprites.front_default,
  baseStats:Object.fromEntries(td76HistoricalStats(p,game).map(s=>[s.stat.name,s.base_stat])),
  abilities:historicalAbilities(p,game)};
}
async function td76ChooseQuickOpponent(name,index,game){
 const team=current,g=team?.game||game||td66SavedGame();
 if(!g)return;
 try{
  const pokemon=await td76QuickOpponent(name,g);
  if(current!==team)return;
  if(index===1)foe=pokemon;else foe2=pokemon;
  showBattle();
 }catch(error){
  $('matchups').textContent='Could not load opponent.';
  console.warn('Opponent reference unavailable',error);
 }
}
search($('foeInput2'),$('foeResults2'),name=>td76ChooseQuickOpponent(name,2));
window.td74OpenBattleOpponent=function(name,game){
 if(!name)return;
 window.takActivate(1);
 $('foeInput').value=pretty(name);$('foeResults').hidden=true;
 return td76ChooseQuickOpponent(name,1,game);
};
$('singleMode').onclick=()=>{doubleMode=false;$('secondFoe').hidden=true;$('singleMode').classList.add('selected');$('doubleMode').classList.remove('selected');showBattle()};
$('doubleMode').onclick=()=>{doubleMode=true;$('secondFoe').hidden=false;$('doubleMode').classList.add('selected');$('singleMode').classList.remove('selected');showBattle()};
function gameGeneration(game){
 const i=games.indexOf(game);
 if(i<0)return null;
 if(i<=2)return 1;if(i<=5)return 2;if(i<=10)return 3;
 if(i<=15)return 4;if(i<=19)return 5;if(i<=23)return 6;
 if(i<=27)return 7;if(i<=31)return 8;return 9;
}
function matchup(attack,defenders,gen){
 if(!attack)return 1;
 if((gen<6&&(attack==='fairy'||defenders.includes('fairy')))||(gen<2&&(attack==='steel'||attack==='dark'||defenders.includes('steel')||defenders.includes('dark'))))return null;
 let result=defenders.reduce((v,d)=>v*(chart[attack]?.[d]??1),1);
 // Steel resisted Ghost and Dark in Generations 2–5.
 if(gen>=2&&gen<=5&&defenders.includes('steel')&&(attack==='ghost'||attack==='dark'))result*=.5;
 // Generation 1: Ghost was ineffective against Psychic, and Bug/Poison interactions differed.
 if(gen===1){
  if(attack==='ghost'&&defenders.includes('psychic'))result=0;
  if(attack==='bug'&&defenders.includes('poison'))result*=2;
  if(attack==='poison'&&defenders.includes('bug'))result*=2;
  if(attack==='ice'&&defenders.includes('fire'))result*=2;
 }
 return result;
}
function effectText(x){return x===0?'Immune':x===.25?'¼×':x===.5?'½×':x===1?'1×':x===2?'2×':x===4?'4×':`${x}×`}

// V72.1: PokeAPI past_values mark the VERSION GROUP at which an older
// value stopped applying, not merely a generation.  Within Gen 7, Let's Go
// temporarily changed Solar Beam/Sky Attack/Absorb/Mega Drain and Sword/Shield
// restored their normal values.  Treating those groups as whole generations
// incorrectly assigned 200 BP to Solar Beam in Emerald and Platinum.
const TD72_MOVE_GROUP_TIME={
 'red-blue':1,'yellow':1.2,
 'gold-silver':2,'crystal':2.2,
 'ruby-sapphire':3,'colosseum':3.1,'firered-leafgreen':3.2,'emerald':3.3,'xd':3.4,
 'diamond-pearl':4,'platinum':4.2,'heartgold-soulsilver':4.4,
 'black-white':5,'black-2-white-2':5.3,
 'x-y':6,'omega-ruby-alpha-sapphire':6.4,
 'sun-moon':7,'ultra-sun-ultra-moon':7.3,'lets-go-pikachu-lets-go-eevee':7.7,
 'sword-shield':8,'the-isle-of-armor':8.1,'the-crown-tundra':8.2,
 'brilliant-diamond-and-shining-pearl':8.3,'brilliant-diamond-shining-pearl':8.3,'legends-arceus':8.5,
 'scarlet-violet':9,'the-teal-mask':9.2,'the-indigo-disk':9.4,'legends-za':9.6,'mega-dimension':9.7,'champions':9.8,'red-green-japan':0.8,'blue-japan':0.9
};
// For generation-only queries, use the final non-Let's-Go main-series
// reference of that generation.  Game-specific UI passes its exact game.
const TD72_MAINLINE_VERSION_POINT={1:1.2,2:2.2,3:3.4,4:4.4,5:5.3,6:6.4,7:7.3,8:8.3,9:9.4};
function generationFromName(name){
 const key=String(name||'').toLowerCase();
 const roman={i:1,ii:2,iii:3,iv:4,v:5,vi:6,vii:7,viii:8,ix:9};
 return TD72_MOVE_GROUP_TIME[key]??roman[key.replace(/^generation-/,'')]??null;
}
function td77MoveStatsText(move,comparison){
 const status=move?.damageClass==='status',name=String(move?.name||'').toLowerCase().replaceAll(' ','-');
 const fixed=/^(dragon-rage|sonic-boom|night-shade|seismic-toss|psywave|super-fang|endeavor|counter|mirror-coat|metal-burst|bide|final-gambit|fissure|guillotine|horn-drill|sheer-cold)$/;
 const neverMiss=/^(aerial-ace|aura-sphere|faint-attack|feint-attack|magical-leaf|magnet-bomb|shadow-punch|shock-wave|swift|vital-throw)$/;
 const multiHit=Number(move?.meta?.max_hits)>1||name==='triple-kick';
 const power=status?'—':Number.isFinite(move?.power)?String(move.power)+(multiHit?' per hit':''):fixed.test(name)?'Special damage':'Variable';
 const accuracy=Number.isFinite(move?.accuracy)?move.accuracy+'%':(move?.alwaysHit||neverMiss.test(name))?'Always hits':'—';
 if(!comparison)return 'PWR '+power+' · ACC '+accuracy;
 const color=stat=>Number.isFinite(move[stat])&&Number.isFinite(comparison[stat])?
  move[stat]>comparison[stat]?'td41-good':move[stat]<comparison[stat]?'td41-warn':'':'';
 return '<span class="'+color('power')+'">PWR '+safe(power)+'</span> · <span class="'+color('accuracy')+'">ACC '+safe(accuracy)+'</span>';
}
function td77MoveResultLines(move,label=pretty(move.name),comparison){
 const stats=td77MoveStatsText(move,comparison);
 return '<strong>'+safe(label)+'</strong>'+pill(move.type)+'<small>'+safe(pretty(move.damageClass))+'</small><small>'+(comparison?stats:safe(stats))+'</small>';
}
function compactMoveLines(move,label=pretty(move.name),comparison){
 const stats=td77MoveStatsText(move,comparison);
 return `<span class="td774-move-title"><strong>${safe(label)}</strong><small>${safe(pretty(move.damageClass))}</small></span>${pill(move.type)}
  <small class="td774-move-metrics">${comparison?stats:safe(stats)}</small>`;
}
function td77HydrateMoveRows(host,key,game){
 host.moveObserver?.disconnect();
 const observer=new IntersectionObserver(entries=>{
  for(const {target,isIntersecting} of entries){
   if(!isIntersecting)continue;
   observer.unobserve(target);
   const name=target.dataset[key];
   enrichMove({name:pretty(name)},game?gameGeneration(game):9,game).then(move=>{
    if(move?.type&&target.isConnected)target.firstElementChild.innerHTML=compactMoveLines({...move,name},target.dataset.td77MoveLabel||pretty(name));
   }).catch(()=>{});
  }
 },{root:host});
 host.moveObserver=observer;
 for(const row of host.querySelectorAll('button'))if(row.dataset[key])observer.observe(row);
}
function moveGenerationData(data,gen,game){
 let power=data.power,accuracy=data.accuracy,pp=data.pp,type=data.type?.name,damageClass=data.damage_class?.name,priority=data.priority||0,target=data.target?.name;
 const point=game&&TD72_MOVE_GROUP_TIME[vg[game]]!==undefined
  ? TD72_MOVE_GROUP_TIME[vg[game]]
  : (TD72_MAINLINE_VERSION_POINT[gen]??gen);
 // Move past_values are previous values BEFORE the change at version_group.
 // Apply changes newest to oldest until reaching the selected game's version.
 const changes=[...(data.past_values||[])].map(change=>({change,at:generationFromName(change.version_group?.name)}))
  .filter(row=>Number.isFinite(row.at))
  .sort((a,b)=>b.at-a.at);
 for(const {change,at} of changes){
  if(at<=point)continue;
  if(Number.isFinite(change.power))power=change.power;
  if(Number.isFinite(change.accuracy))accuracy=change.accuracy;
  if(Number.isFinite(change.pp))pp=change.pp;
  if(change.type)type=change.type.name;
  if(Number.isFinite(change.priority))priority=change.priority;
  if(change.target)target=change.target.name;
 }
 // Pre-Gen4 physical/special was determined by elemental move type.
 if(gen<=3&&damageClass!=='status'){
  const special=['fire','water','electric','grass','ice','psychic','dragon','dark'];
  damageClass=special.includes(type)?'special':'physical';
 }
 if(data.name==='assurance'&&gen>=4&&gen<=5)power=50;
 return {power,accuracy,pp,type,damageClass,metaGeneration:gen,historicalRevision:3,historicalGame:game||null,priority,meta:data.meta||null,statChanges:data.stat_changes||[],target};
}
// Guard against saved team records produced by the older historical parser.
// These four moves changed ONLY in the Gen 7 Let's Go spin-offs.
const TD72_MAINLINE_MOVE_CORRECTIONS={
 'solar-beam':{power:120,pp:10},
 'assurance':{power:60,powerBefore6:50,pp:10,minGen:4},
 'sky-attack':{power:140,pp:5},
 // Both moves gained five PP in Gen 4. Do NOT overwrite Emerald's Gen 3 PP.
 'absorb':{power:20,pp:25,ppBefore4:20},
 'mega-drain':{power:40,pp:15,ppBefore4:10}
};
function td72MainlineCorrection(m,gen){
 if(!m||gen>7||gen<1)return false;
 const key=String(m.name||'').trim().replace(/([a-z])([A-Z])/g,'$1-$2').toLowerCase().replace(/[\s_]+/g,'-');
 const expected=TD72_MAINLINE_MOVE_CORRECTIONS[key];
 if(!expected||gen<(expected.minGen||1))return false;
 let changed=false;
 for(const [k,v] of [['power',gen<6?(expected.powerBefore6??expected.power):expected.power],['pp',gen<=3?(expected.ppBefore4??expected.pp):expected.pp]])if(m[k]!==v){m[k]=v;changed=true;}
 return changed;
}
// Existing local teams may have the bad 200-PWR value stored persistently.
// Correct them at startup, BEFORE showing any Battle recommendation.
(function td72RepairSavedMoveHistory(){
 let dirty=false;
 for(const t of teams)for(const pokemon of (t.pokemon||[]))if(pokemon){
  for(const m of (pokemon.moves||[]))if(td72MainlineCorrection(m,gameGeneration(t.game)))dirty=true;
 }
 if(dirty){try{save()}catch(e){console.warn('Move history corrected in memory; could not persist yet',e)}}
})();
// Relative expected move strength, not a damage calculator. Base stats provide only an approximate ratio.
const ALWAYS_HIT_MOVES=new Set(['Swift','Aerial Ace','Shock Wave','Magical Leaf','Feint Attack','Faint Attack','Shadow Punch','Aura Sphere','Magnet Bomb','Disarming Voice','Smart Strike','Flower Trick']);
const VARIABLE_MOVES=new Set(['Magnitude','Present','Hidden Power','Return','Frustration','Flail','Reversal','Low Kick','Grass Knot','Gyro Ball','Electro Ball','Heavy Slam','Heat Crash','Eruption','Water Spout','Facade','Brine','Payback','Avalanche','Revenge','Assurance','Acrobatics','Hex','Venoshock','Stored Power','Punishment','Fling','Natural Gift','Trump Card','Rollout','Ice Ball','Fury Cutter','Triple Kick','Triple Axel','Beat Up','Seismic Toss','Night Shade','Dragon Rage','Sonic Boom','Super Fang','Endeavor','Psywave','Counter','Mirror Coat','Metal Burst','Bide','Final Gambit','OHKO','Guillotine','Horn Drill','Fissure','Sheer Cold']);
// V39: defensive ability information is loaded from Pokémon records when available.
// V72 — generation-aware ability modifiers. Unknown dual abilities are never assumed.
// Single possible abilities are treated as known. A chosen ability overrides the ambiguity.
const TD72_ABILITY_IMMUNITY={
 'levitate':{type:'ground',gen:3},'flash-fire':{type:'fire',gen:3},
 'water-absorb':{type:'water',gen:3},'volt-absorb':{type:'electric',gen:3},
 'dry-skin':{type:'water',gen:4},'motor-drive':{type:'electric',gen:4},
 // In Gen 3/4 these abilities redirect attacks, but do not grant immunity.
 'storm-drain':{type:'water',gen:5},'lightning-rod':{type:'electric',gen:5},
 'sap-sipper':{type:'grass',gen:5},'earth-eater':{type:'ground',gen:9},
 'well-baked-body':{type:'fire',gen:9}
};
function historicalAbilities(data,game){
 const gen=gameGeneration(game);
 if(!gen||gen<3)return [];
 let abilities=[...(data.abilities||[])];
 const numbered=g=>({i:1,ii:2,iii:3,iv:4,v:5,vi:6,vii:7,viii:8,ix:9})[g?.split('-').pop()]||0;
 for(const entry of [...(data.past_abilities||[])].sort((a,b)=>numbered(b.generation?.name)-numbered(a.generation?.name))){
  const changed=numbered(entry.generation?.name);
  if(changed&&gen<=changed){
   const bySlot=new Map(abilities.map(a=>[a.slot,a]));
   for(const a of entry.abilities||[]){if(a.ability?.name)bySlot.set(a.slot,a);else bySlot.delete(a.slot);}
   abilities=[...bySlot.values()].sort((a,b)=>a.slot-b.slot);
  }
 }
 // Blue-striped Basculin changed slot 1 within Gen V, not between generations.
 if(data.name==='basculin-blue-striped'&&['Black','White'].includes(game))abilities=abilities.map(a=>a.slot===1?{...a,ability:{...a.ability,name:'reckless'}}:a);
 // Hidden abilities don't exist before Gen 5.
 return gen<5?abilities.filter(a=>!a.is_hidden):abilities;
}
// DEV3 shared presentation helpers.
const td3AbilityDescriptions=new Map();
function td3AbilityName(p){return td2ActualAbility(p)||'';}
function td3AbilityText(p){const n=td3AbilityName(p);return n?`<small class="td3-ability-name">${safe(pretty(n))}</small>`:'';}
function td3Stab(on){return on?'<span class="td62-stab td3-stab">STAB</span>':'';}
function td3AbilityDescriptionHtml(name,game){return `<small class="td3-ability-description" data-td3-ability-description="${safe(name||'')}" data-td3-ability-game="${safe(game||'')}"></small>`;}
async function td3FillAbilityDescription(el){const name=el.dataset.td3AbilityDescription,game=el.dataset.td3AbilityGame;if(!name){el.textContent='';return;}const key=game+':'+name;const gen=gameGeneration(game);if(!td3AbilityDescriptions.has(key))td3AbilityDescriptions.set(key,(async()=>{try{const a=await api('ability/'+name);const en=x=>x.language?.name==='en';const exact=(a.flavor_text_entries||[]).find(x=>en(x)&&x.version_group?.name===vg[game]);if(exact)return exact.flavor_text.replace(/\s+/g,' ').trim();const changes=(a.effect_changes||[]).filter(x=>{const group=x.version_group?.name;return group&&Object.keys(vg).some(k=>vg[k]===group&&gameGeneration(k)>gen)}).sort((x,y)=>{const id=z=>Number(z.version_group?.url?.match(/(\d+)\/?$/)?.[1])||999;return id(x)-id(y)});const historical=changes[0]?.effect_entries?.find(en);if(historical?.effect)return historical.effect.replace(/\s+/g,' ').trim();const entry=(a.effect_entries||[]).find(en);return entry?.short_effect||entry?.effect||'';}catch{return null;}})());const desc=await td3AbilityDescriptions.get(key);if(desc===null)td3AbilityDescriptions.delete(key);if(el.isConnected&&el.dataset.td3AbilityDescription===name&&el.dataset.td3AbilityGame===game)el.textContent=desc||'Description unavailable';}
function td3UpdateAbilityDescription(select,game){const el=select.parentElement.querySelector('.td3-ability-description');if(!el)return;el.dataset.td3AbilityDescription=select.value;el.dataset.td3AbilityGame=game;td3FillAbilityDescription(el);}
function td3HeaderLevel(p,side,i){return p?.name?`<span class="td3-header-level"><button type="button" data-td2-step="${side}:${i}:-1" aria-label="Decrease level">−</button><input type="text" inputmode="numeric" pattern="[0-9]*" data-td2-level="${side}:${i}" value="${tdDev1Level(p.level,50)}" aria-label="${safe(td41PokemonLabel(p.name))} level"><button type="button" data-td2-step="${side}:${i}:1" aria-label="Increase level">+</button></span>`:'Tap to add Pokémon';}
function td2AllAbilities(p){return [...new Set((p?.abilities||[]).map(x=>typeof x==='string'?x:x?.ability?.name).filter(Boolean))]}
function td2ResolveAbility(p,selected){const all=td2AllAbilities(p);return all.includes(selected)?selected:all.length===1?all[0]:'';}
function td2ActualAbility(p){return td2ResolveAbility(p,p?.selectedAbility||p?.ability)||null;}
function td2AbilityOptions(p,selected){const all=td2AllAbilities(p),value=td2ResolveAbility(p,selected);return (all.length===1?'':'<option value="">Unknown / not selected</option>')+all.map(n=>`<option value="${safe(n)}" ${n===value?'selected':''}>${safe(pretty(n))}</option>`).join('');}
function abilityNames(p){return [...new Set((p?.abilities||[]).filter(x=>!x?.is_hidden||typeof x==='string').map(x=>typeof x==='string'?x:x?.ability?.name).filter(Boolean))]}
function td72AbilityMultiplier(move,ability,gen,base){
 if(!ability||gen<3||!move?.type)return 1;
 const name=String(ability).toLowerCase().replace(/\s+/g,'-');
 // Ground immunity can be bypassed by special battle conditions not modeled here.
 const immune=TD72_ABILITY_IMMUNITY[name];
 if(immune&&gen>=immune.gen&&move.type===immune.type&&!(name==='levitate'&&move.name==='Thousand Arrows'))return 0;
 if(name==='wonder-guard'&&gen>=3&&move.damageClass!=='status'&&base<=1)return 0;
 if(name==='heatproof'&&gen>=4&&move.type==='fire')return .5;
 if(name==='thick-fat'&&gen>=3&&['fire','ice'].includes(move.type))return .5;
 if(name==='dry-skin'&&gen>=4&&move.type==='fire')return 1.25;
 if(['filter','solid-rock'].includes(name)&&gen>=4&&base>1)return .75;
 return 1;
}
function td72AbilityReport(move,defender,gen,attacker){
 const base=matchup(move.type,defender.types||[],gen);
 if(move.name==='Synchronoise'&&attacker?.types?.length&&defender.types?.length&&!attacker.types.some(t=>defender.types.includes(t)))return {base,effective:0,possibleImmune:[],possibleReduced:[],knownAbility:null,reason:'Requires a shared type'};
 if(gen>=4&&['mold-breaker','teravolt','turboblaze'].includes(td2ActualAbility(attacker)))return {base,effective:base,possibleImmune:[],possibleReduced:[],knownAbility:null,reason:'Ability bypass'};
 if(base===null||base===0)return {base,effective:base,possibleImmune:[],possibleReduced:[],knownAbility:null};
 const options=td2AllAbilities(defender);
 const chosen=td2ActualAbility(defender);
 const known=chosen||(options.length===1?options[0]:null);
 if(known)return {base,effective:base*td72AbilityMultiplier(move,known,gen,base),possibleImmune:[],possibleReduced:[],knownAbility:known};
 const possibleImmune=options.filter(a=>td72AbilityMultiplier(move,a,gen,base)===0);
 const possibleReduced=options.filter(a=>{const m=td72AbilityMultiplier(move,a,gen,base);return m>0&&m<1});
 return {base,effective:base,possibleImmune,possibleReduced,knownAbility:null};
}
function defensiveEffect(move,defender,gen,attacker){return td72AbilityReport(move,defender,gen,attacker).effective}
function td72RiskLabel(move,defender,gen,attacker){
 const r=td72AbilityReport(move,defender,gen,attacker);
 if(r.reason==='Requires a shared type')return r.reason;
 return r.possibleImmune.length?`Possible 0×: ${r.possibleImmune.map(pretty).join(' / ')}`:
 r.possibleReduced.length?`May be reduced by ${r.possibleReduced.map(pretty).join(' / ')}`:'';
}
function movePowerRange(m){
 const n=m.name;
 if(n==='Assurance'&&m.metaGeneration>=4&&m.metaGeneration<=5)return {min:50,max:100,note:'target damaged'};
 const ranges={Return:[1,102,'friendship 0–255'],Frustration:[1,102,'friendship 255–0'],Magnitude:[10,150,'random magnitude'],Present:[0,120,'random; may heal'], 'Hidden Power':[30,70,'IVs (generations 2–5)'],Flail:[20,200,'remaining HP'],Reversal:[20,200,'remaining HP'],'Low Kick':[20,120,'target weight'],'Grass Knot':[20,120,'target weight'],'Gyro Ball':[1,150,'relative Speed'],'Electro Ball':[40,150,'relative Speed'],'Heavy Slam':[40,120,'weight ratio'],'Heat Crash':[40,120,'weight ratio'],Eruption:[1,150,'remaining HP'],'Water Spout':[1,150,'remaining HP'],Facade:[70,140,'status condition'],Brine:[65,130,'target HP'],Payback:[50,100,'turn order'],Avalanche:[60,120,'damage received'],Revenge:[60,120,'damage received'],Assurance:[60,120,'target damaged'],Acrobatics:[55,110,'held item'],Hex:[65,130,'target status'],Venoshock:[65,130,'target poisoned'],'Stored Power':[20,860,'stat boosts'],Punishment:[60,200,'target boosts'],Rollout:[30,480,'consecutive hits'],'Ice Ball':[30,480,'consecutive hits'],'Fury Cutter':[10,160,'consecutive hits']};
 if(n==='Hidden Power'&&m.metaGeneration>=6)return {min:60,max:60,note:'fixed in generations 6+'};
 const r=ranges[n];if(r){const base=Number.isFinite(m.power)&&m.power>0?m.power:r[0];return ['Assurance','Payback','Avalanche','Revenge','Facade','Brine','Hex','Venoshock','Acrobatics'].includes(n)?{min:base,max:base*2,note:r[2]}:{min:r[0],max:r[1],note:r[2]};}
 if(Number.isFinite(m.power)&&m.power>0)return {min:m.power,max:m.power,note:''};
 return null;
}
// DEV2: conditional power from verified move metadata and available matchup context.
function td2Stat(mon,key,policy){
 return (policy==='base'?mon?.baseStats:mon?.battleStats)?.[key];
}
function td2Speed(mon,gen,policy){
 const speed=td2Stat(mon,'speed',policy);
 if(!(speed>0))return null;
 const ability=td2ActualAbility(mon);
 const active=policy!=='base'&&mon.status&&mon.status!=='none';
 const weatherAbility={rain:'swift-swim',sun:'chlorophyll',sand:'sand-rush',hail:'slush-rush'}[mon.weather];
 const weather=ability&&ability===weatherAbility?2:1;
 const scarf=gen>=4&&td73MoveKey(mon.heldItem)==='choice-scarf'?1.5:1;
 const status=active&&gen>=4&&ability==='quick-feet'?1.5:active&&mon.status==='paralysis'?(gen>=7?.5:.25):1;
 return Math.max(1,Math.floor(speed*scarf*weather*status));
}
function td2Power(m,a,d,g,policy){
 const n=m.name;let r=movePowerRange(m);const extra={'Crush Grip':[1,120],'Wring Out':[1,120],'Trump Card':[40,200],'Natural Gift':[60,100],'Weather Ball':[50,100],'Wake Up Slap':[m.power||60,(m.power||60)*2],'Smelling Salts':[m.power||60,(m.power||60)*2],'Pursuit':[40,80],'Stomp':[65,130],'Stomping Tantrum':[75,150],'Retaliate':[70,140],'Round':[60,120],'Echoed Voice':[40,200],'Rollout':[30,480],'Ice Ball':[30,480],'Spit Up':[100,300],'Beat Up':[1,100],'Punishment':[60,200],'Stored Power':[20,860],'Power Trip':[20,860],'Water Shuriken':[15,15],'Triple Kick':[10,60]};if(extra[n]&&!['Natural Gift','Beat Up','Triple Kick','Water Shuriken'].includes(n)){const [min,max]=extra[n];r={min,max,note:'Conditional'};}if(['Natural Gift','Beat Up','Triple Kick','Water Shuriken','Counter','Mirror Coat','Metal Burst','Bide','Endeavor','Super Fang','Final Gambit','Psywave','Fissure','Guillotine','Horn Drill','Sheer Cold','Present'].includes(n))return null;if(!r)return null;const fixed=p=>({min:p,max:p,note:'Resolved from matchup'});const base=n==='Assurance'&&g>=4&&g<=5?50:Number.isFinite(m.power)&&m.power>0?m.power:r.min;
 const hp=p=>policy!=='base'&&Number.isFinite(p?.currentHP)&&p.battleStats?.hp>0?p.currentHP/p.battleStats.hp:null;
 if(['Low Kick','Grass Knot'].includes(n)&&!(n==='Low Kick'&&g<=2)&&d?.weight>0){const w=d.weight/10;return fixed(w<10?20:w<25?40:w<50?60:w<100?80:w<200?100:120)}
 if(n==='Low Kick'&&g<=2)return fixed(base);
 if(['Heavy Slam','Heat Crash'].includes(n)&&a?.weight>0&&d?.weight>0){const w=a.weight/d.weight;return fixed(w>=5?120:w>=4?100:w>=3?80:w>=2?60:40)}
 if(n==='Gyro Ball'||n==='Electro Ball'){
  const own=td2Speed(a,g,policy),other=td2Speed(d,g,policy);
  if(own>0&&other>0){
   if(n==='Gyro Ball')return fixed(Math.min(150,Math.floor(25*other/own)+1));
   const q=own/other;
   return fixed(q>=4?150:q>=3?120:q>=2?80:q>=1?60:40);
  }
 }
 if(n==='Acrobatics'&&a&&Object.hasOwn(a,'heldItem'))return fixed(a.heldItem?base:base*2);
 if(n==='Return'||n==='Frustration'){if(policy!=='base'&&Number.isFinite(a?.friendship))return fixed(Math.max(1,Math.floor((n==='Return'?a.friendship:255-a.friendship)*2/5)));}
 if(['Eruption','Water Spout'].includes(n)&&hp(a)!==null)return fixed(Math.max(1,Math.floor(150*hp(a))));
 if(['Flail','Reversal'].includes(n)&&hp(a)!==null){const h=Math.floor(48*hp(a));return fixed(h<2?200:h<5?150:h<10?100:h<17?80:h<33?40:20)}
 if(n==='Brine'&&hp(d)!==null)return fixed(base*(hp(d)<=.5?2:1));
 if(n==='Facade'&&a?.status)return fixed(base*(['burn','poison','toxic','paralysis'].includes(a.status)?2:1));
 if(n==='Hex'&&d?.status)return fixed(base*(d.status!=='none'?2:1));
 if(n==='Venoshock'&&d?.status)return fixed(base*(['poison','toxic'].includes(d.status)?2:1));
 if(n==='Assurance'&&typeof d?.damagedThisTurn==='boolean')return fixed(base*(d.damagedThisTurn?2:1));
 if(['Avalanche','Revenge'].includes(n)&&typeof a?.hitByTargetThisTurn==='boolean')return fixed(base*(a.hitByTargetThisTurn?2:1));
 if(n==='Payback'&&typeof d?.actedThisTurn==='boolean')return fixed(base*(d.actedThisTurn?2:1));
 if(n==='Retaliate'&&typeof a?.allyFaintedLastTurn==='boolean')return fixed(base*(a.allyFaintedLastTurn?2:1));
 if(['Wake Up Slap','Smelling Salts'].includes(n)&&d?.status)return fixed(base*(d.status===(n==='Wake Up Slap'?'sleep':'paralysis')?2:1));
 if(['Assurance','Payback','Avalanche','Revenge','Facade','Brine','Hex','Venoshock','Acrobatics'].includes(n))r={...r,min:base,max:base*2};
 if(n==='Fury Cutter')r={...r,min:base,max:Math.min(160,base*16)};
 if(n==='Hidden Power'&&g>=6)return fixed(60);
 if(n==='Hidden Power'&&g>=3&&policy!=='base'&&a?.ivs){
  const order=['hp','attack','defense','speed','special-attack','special-defense'];
  const bits=order.reduce((word,k,i)=>word|(((a.ivs[k]>>>1)&1)<<i),0);
  return fixed(30+Math.floor(bits*40/63));
 }
 if(n==='Hidden Power'&&g===2)return {...r,min:31,max:70};
 if(['Crush Grip','Wring Out'].includes(n)&&hp(d)!==null){
  const fraction=hp(d);
  return fixed(Math.max(1,g===5?Math.floor((12000*Math.floor(fraction*4096)+2047)/409600):Math.floor(120*fraction)));
 }
 if(n==='Trump Card'&&policy!=='base'&&Number.isInteger(m.remainingPP))return fixed([200,80,60,50][m.remainingPP]??40);
 if(n==='Weather Ball'&&a?.weather)return fixed(a.weather==='none'?50:100);
 if(n==='Stored Power'||n==='Power Trip'){if(a?.boosts)return fixed(20+20*Object.values(a.boosts).reduce((t,x)=>t+Math.max(0,x),0));}
 if(n==='Punishment'&&d?.boosts)return fixed(Math.min(200,60+20*Object.values(d.boosts).reduce((t,x)=>t+Math.max(0,x),0)));
 if(n==='Spit Up'&&a?.stockpile>0)return fixed(a.stockpile*100);
 if(n==='Foul Play')return fixed(base);
 return r;
}
function td2OffensiveModifier(m,a,g,resolvedPower,policy){const ability=td2ActualAbility(a);if(!ability)return 1;
 const sheer=new Set(['Flamethrower','Fire Blast','Fire Fang','Ice Fang','Thunder Fang','Rock Slide','Iron Head','Crunch','Shadow Ball','Psychic','Energy Ball','Bug Buzz','Air Slash','Waterfall','Poison Jab','Ice Beam','Blizzard','Thunderbolt','Thunder','Body Slam','Sludge Bomb','Flare Blitz','Fire Punch','Ice Punch','Thunder Punch','Rock Smash','Headbutt','Zen Headbutt','Focus Blast','Ancient Power','Dragon Breath','Dragon Rush','Extrasensory','Signal Beam','Charge Beam','Discharge','Lava Plume','Heat Wave','Scald','Hurricane','Earth Power','Flash Cannon','Metal Claw','Steel Wing','Muddy Water','Octazooka','Acid','Acid Spray','Mud Bomb','Mud Slap','Snarl','Icy Wind','Bulldoze','Low Sweep','Crush Claw','Twister','Bite','Astonish','Dark Pulse','Fake Out','Stomp','Tri Attack','Secret Power','Ominous Wind','Silver Wind','Razor Shell','Flame Charge','Dynamic Punch','Zap Cannon','Inferno','Nuzzle','Power Up Punch','Charge Beam','Octazooka','Bubble Beam','Bubble','Sludge','Smog','Poison Sting','Lick','Ember','Psybeam','Aurora Beam','Confusion']);
 if(g>=5&&ability==='sheer-force'&&(sheer.has(m.name)||m.meta?.flinch_chance>0||m.meta?.ailment_chance>0&&['burn','paralysis','freeze','poison','confusion','sleep'].includes(m.meta?.ailment?.name)))return 1.3;
 if(g>=4&&ability==='technician'&&(resolvedPower??td2Power(m,a,null,g)?.min)<=60)return 1.5;
 if(g>=3&&['huge-power','pure-power'].includes(ability)&&m.damageClass==='physical'&&m.name!=='Foul Play')return 2;
 if(g>=4&&ability==='iron-fist'&&['Bullet Punch','Comet Punch','Dizzy Punch','Drain Punch','Dynamic Punch','Fire Punch','Focus Punch','Hammer Arm','Ice Punch','Mach Punch','Mega Punch','Meteor Mash','Power Up Punch','Shadow Punch','Sky Uppercut','Thunder Punch','Ice Hammer','Plasma Fists','Double Iron Bash','Surging Strikes','Wicked Blow','Jet Punch','Rage Fist'].includes(m.name))return 1.2;
 if(g>=5&&ability==='reckless'&&['Take Down','Double Edge','Submission','Volt Tackle','Wood Hammer','Brave Bird','Flare Blitz','Head Smash','Wild Charge','Jump Kick','High Jump Kick','Head Charge','Wave Crash'].includes(m.name))return 1.2;
 if(g>=6&&ability==='strong-jaw'&&['Bite','Crunch','Fire Fang','Ice Fang','Thunder Fang','Poison Fang','Psychic Fangs','Hyper Fang','Jaw Lock','Fishious Rend'].includes(m.name))return 1.5;
 if(g>=5&&ability==='sand-force'&&a?.weather==='sand'&&['ground','rock','steel'].includes(m.type))return 1.3;
 if(g>=3&&['blaze','torrent','overgrow','swarm'].includes(ability)&&({blaze:'fire',torrent:'water',overgrow:'grass',swarm:'bug'})[ability]===m.type&&policy!=='base'&&Number.isFinite(a?.currentHP)&&a?.battleStats?.hp>0&&a.currentHP<=a.battleStats.hp/3)return 1.5;
 return 1;
}
function td2Stab(m,a,g){return a?.types?.includes(m.type)?(g>=4&&td2ActualAbility(a)==='adaptability'?2:1.5):1;}
function td2Combined(m,a,d,g){const e=defensiveEffect(m,d,g,a);return e===null?null:e*td2Stab(m,a,g)}
const TD2_CHARGE=new Set(['Fly','Dig','Dive','Bounce','Solar Beam','Solar Blade','Skull Bash','Razor Wind','Sky Attack','Shadow Force','Phantom Force','Freeze Shock','Ice Burn','Sky Drop','Meteor Beam','Electro Shot']);
const TD2_RECHARGE=new Set(['Hyper Beam','Giga Impact','Blast Burn','Hydro Cannon','Frenzy Plant','Rock Wrecker','Roar of Time','Prismatic Laser','Eternabeam','Meteor Assault']);
function td2Turns(m,a,g){if(TD2_CHARGE.has(m.name)){if(['Solar Beam','Solar Blade'].includes(m.name)&&a?.weather==='sun')return 1;if(m.name==='Electro Shot'&&a?.weather==='rain')return 1;if(g>=4&&a?.heldItem==='Power Herb'&&m.name!=='Sky Drop')return 1;return 2;}return TD2_RECHARGE.has(m.name)?2:1;}
function td2PerTurn(a,d,m,g){const damage=estimateDamage(a,d,m,g);return damage===null?null:damage*(td2Accuracy(m)??0)/td2Turns(m,a,g);}
function td2Accuracy(m){return Number.isFinite(m.accuracy)?m.accuracy/100:(m.accuracy===null&&(ALWAYS_HIT_MOVES.has(m.name)||m.alwaysHit)?1:null)}
function accuracyLabel(m){
 if(Number.isFinite(m.accuracy))return m.accuracy+'%';
 if(m.accuracy===null&&(ALWAYS_HIT_MOVES.has(m.name)||m.alwaysHit))return 'Never misses';
 if(m.accuracy===null&&m.damageClass==='status'&&m.target==='user')return 'N/A (self)';
 return 'N/A / conditional';
}
function movePowerText(m){if(['Rollout','Ice Ball'].includes(m.name))return '30 first hit; doubles if consecutive (max 480 on turn 5)';const r=movePowerRange(m);return r?(r.min===r.max?String(r.min):r.min+'–'+r.max)+(r.note?' ('+r.note+')':''):'Variable / special';}
function expectedPower(m,attacker,target,gen,bound='min',policy=attacker?.level&&target?.level?'context':'base'){
 if(!attacker||!target||!m?.type||!['physical','special'].includes(m.damageClass)||!target.types?.length||!attacker.types?.length)return null;
 const eff=defensiveEffect(m,target,gen,attacker),r=td2Power(m,attacker,target,gen,policy),acc=td2Accuracy(m);
 if(eff===null||eff===0||td72AbilityReport(m,target,gen,attacker).possibleImmune.length||m.damageClass==='status'||!r||acc===null)return null;
 const special=m.damageClass==='special',source=m.name==='Foul Play'?target:attacker;
 const a=td2Stat(source,special?'special-attack':'attack',policy);
 const b=td2Stat(target,special&&!['Psyshock','Psystrike','Secret Sword'].includes(m.name)?'special-defense':'defense',policy);
 const statFactor=Number.isFinite(a)&&Number.isFinite(b)?Math.sqrt((a*td77Intimidate(attacker,target,m,gen)+30)/(b+30)):1;
 return r[bound]*td2Stab(m,attacker,gen)*eff*acc*statFactor*td2OffensiveModifier(m,attacker,gen,r[bound],policy)*td77HeldDamage(attacker,target,m,gen)/td2Turns(m,attacker,gen);
}
function effectivePowerLabel(m){if(m.powerIndex===null||m.powerIndex===undefined)return 'Estimated score —';return 'Attack score '+Math.round(m.powerIndex)+(m.powerIndexMax>m.powerIndex?'–'+Math.round(m.powerIndexMax):'')}
function moveStats(m){return `<span class="move-stats">PWR ${safe(movePowerText(m))} · ACC ${safe(accuracyLabel(m))}</span>`}
async function enrichMove(m,gen,game){
 if(!m)return m;
 if(typeof m==='string')m={name:pretty(m)};
 if(m.metaGeneration===gen&&m.historicalRevision===3&&m.historicalGame===game&&m.power!==undefined&&m.accuracy!==undefined&&m.target!==undefined&&m.type&&m.damageClass)return m;
 try{
  const data=await api('move/'+String(m.name).toLowerCase().replace(/\s+/g,'-'));
  const historical=moveGenerationData(data,gen,game);return {...m,...historical,alwaysHit:ALWAYS_HIT_MOVES.has(pretty(data.name)),metaGeneration:gen,historicalRevision:3,historicalGame:game};
 }catch{td72MainlineCorrection(m,gen);return m}
}
async function enrichTeamMoves(){
 if(!current)return;
 const team=current,gen=gameGeneration(team.game);
 let updated=false;
 for(const p of team.pokemon.filter(Boolean)){
  if(!p.baseStats||!p.abilities){try{const info=await api('pokemon/'+p.id);p.baseStats=Object.fromEntries(td76HistoricalStats(info,team.game).map(s=>[s.stat.name,s.base_stat]));p.abilities=historicalAbilities(info,team.game);updated=true}catch{}}
  for(let i=0;i<p.moves.length;i++){
   const m=p.moves[i];
   if(m&&(typeof m==='string'||m.metaGeneration!==gen||m.historicalRevision!==3||m.historicalGame!==team.game||m.accuracy===undefined||m.target===undefined||!m.type||!m.damageClass)){
    const next=await enrichMove(m,gen,team.game);
    if(next!==m){p.moves[i]=next;updated=true}
   }
  }
 }
 if(updated){save();if(current===team)showSlots()}
 if(current===team&&$('battlePage').hidden===false)showBattle();
}
function analyze(p,opponent,gen){
 const offense=(p.moves||[]).filter(m=>m&&typeof m==='object'&&m.type&&m.damageClass).map(m=>{
  const effectiveness=defensiveEffect(m,opponent,gen,p);
  const stab=td2Stab(m,p,gen);
  return {...m,effectiveness,stab,total:effectiveness===null?null:effectiveness*stab};
 }).filter(m=>m.total!==null);
 const scored=offense.map(m=>({...m,powerIndex:expectedPower(m,p,opponent,gen,'min','base'),powerIndexMax:expectedPower(m,p,opponent,gen,'max','base')}));
 const best=scored.filter(m=>m.powerIndex!==null).sort((a,b)=>b.powerIndex-a.powerIndex)[0]||null;
 const threats=opponent.types.map(t=>({type:t,multiplier:matchup(t,p.types,gen)}));
 const worst=Math.max(...threats.map(t=>t.multiplier??1),.25);
 const attackScore=best?.powerIndex>0?Math.log2(best.powerIndex/60):-3;
 const defensePenalty=worst>=4?3.2:worst>=2?1.6:worst===1?0:worst===.5?-.8:-1.2;
 return {p,offense:scored,best,threats,worst,score:attackScore-defensePenalty};
}

const spreadTargets=new Set(['all-opponents','all-other-pokemon','all-pokemon']);
const allyHitTargets=new Set(['all-other-pokemon','all-pokemon']);
function moveValue(move,attacker,target,gen,ally){
 const mult=defensiveEffect(move,target,gen,attacker);
 if(mult===null||td72AbilityReport(move,target,gen,attacker).possibleImmune.length)return null;
 if(move.damageClass==='status'||move.power===0)return null;
 const stab=td2Stab(move,attacker,gen);
 if(!Number.isFinite(move.power)||move.power<=0||(!Number.isFinite(move.accuracy)&&!(move.accuracy===null&&ALWAYS_HIT_MOVES.has(move.name)))||!movePowerRange(move))return null;
 const power=td2Power(move,attacker,target,gen,'base')?.min;
 const spread=spreadTargets.has(move.target);
 const penalty=spread&&gen>=4?.75:1;
 const a=attacker.baseStats?.[move.damageClass==='special'?'special-attack':'attack'];
 const d=target.baseStats?.[move.damageClass==='special'?'special-defense':'defense'];
 const statFactor=Number.isFinite(a)&&Number.isFinite(d)?Math.sqrt((a+30)/(d+30)):1;
 const value=mult*stab*(power/60)*penalty*((move.accuracy===null?100:move.accuracy)/100)*statFactor*td2OffensiveModifier(move,attacker,gen,power,'base')/td2Turns(move,attacker,gen);
 const allyRisk=ally&&allyHitTargets.has(move.target)?defensiveEffect(move,ally,gen,attacker):0;
 return {move,value,mult,spread,allyRisk,priority:move.priority||0};
}
function pairPlan(a,b,opponents,gen){
 const actors=[a,b],plans=[];
 for(let k=0;k<2;k++){
  const actor=actors[k],ally=actors[1-k];
  const moves=(actor.moves||[]).flatMap(m=>{
   const targets=opponents.map((o,i)=>{const r=moveValue(m,actor,o,gen,ally);return r?{...r,targetIndex:i}:null}).filter(Boolean);
   if(!targets.length)return[];
   if(spreadTargets.has(m.target)){
    const total=targets.reduce((s,t)=>s+t.value,0);
    const allyRisk=targets[0].allyRisk;
    const score=total-(allyRisk>=2?3.5:allyRisk>0?1.8:0);
    return[{move:m,targets:targets.map(t=>t.targetIndex),score,allyRisk,spread:true,priority:m.priority||0}];
   }
   return targets.map(t=>({move:m,targets:[t.targetIndex],score:t.value,allyRisk:0,spread:false,priority:m.priority||0}));
  });
  plans.push(moves.sort((x,y)=>y.score-x.score).slice(0,12));
 }
 let best=null;
 for(const x of plans[0])for(const y of plans[1]){
  let score=x.score+y.score;
  const covered=new Set([...x.targets,...y.targets]);
  if(covered.size===2)score+=.8;
  const overlap=x.targets.length===1&&y.targets.length===1&&x.targets[0]===y.targets[0];
  if(overlap)score-=.25;
  if(!best||score>best.score)best={score,actions:[x,y],covered:covered.size};
 }
 if(!best)return null;
 const risks=actors.map(p=>Math.max(...opponents.flatMap(o=>o.types.map(t=>matchup(t,p.types,gen)||0))));
 const defense=risks.map(r=>r>=4?3.2:r>=2?1.5:r<1?-.7:0).reduce((a,b)=>a+b,0);
 const speed=actors.reduce((s,p)=>s+(p.baseSpeed||0),0)/2;
 return {...best,actors,risks,rank:best.score-defense+Math.min(speed/200,0.5)};
}
function pairCard(plan,index,opponents){
 const [a,b]=plan.actors;
 const who=p=>`<div class="identity td73-poke-link" role="button" tabindex="0" data-td73-mon="${safe(p.name)}" data-td73-context="battle" title="Tap for Pokédex"><img src="${safe(td71StoredArt(p))}" alt=""><div><strong>${safe(td41PokemonLabel(p.name))}</strong><div class="pills">${p.types.map(pill).join('')}</div></div></div>`;
 const actions=plan.actions.map((act,i)=>`<div class="pair-action">${safe(plan.actors[i].name)}: <strong>${safe(act.move.name)}</strong> → ${act.targets.map(t=>safe(opponents[t].name)).join(' + ')}${act.spread?' <span class="note">(spread)</span>':''}${act.allyRisk>0?` <span class="bad">May hit ally (${effectText(act.allyRisk)})</span>`:''}</div>`).join('');
 return `<article class="card rank-card"><div class="rank-header"><span class="rank-number">#${index+1}</span><div class="pair-identities">${who(a)}${who(b)}</div></div>${actions}<p class="note">Potential incoming STAB risk: ${safe(a.name)} ${effectText(plan.risks[0])} · ${safe(b.name)} ${effectText(plan.risks[1])}. Speed tie-breaker uses base Speed only, not actual turn order.</p></article>`;
}
// DEV3.3: regular Battle uses species base stats, never level-derived stats or HP.
function td33BaseBattleMon(p){
 if(!p)return null;
 const {level,battleStats,statAdjustments,currentHP,maxHP,saveStats,status,ivs,evs,nature,friendship,...base}=p;
 return {...base,heldItem:p.item??p.heldItem??''};
}
function showBattle(){
 if(!foe||doubleMode)window.td76RenderBattleStrip?.(current);
 if(!current){$('matchups').innerHTML='<p>Open a team first.</p>';return}
 if(!foe){$('matchups').innerHTML='<p>Select an opponent above.</p>';return}
 if(doubleMode&&!foe2){$('matchups').innerHTML='<p>Select the second opponent to compare both threats.</p>';return}
 const gen=gameGeneration(current.game),opponents=(doubleMode?[foe,foe2]:[foe]).map(p=>td33BaseBattleMon(p));
 const ranked=current.pokemon.filter(p=>p&&!p.saveStats?.egg).map(p=>{
  const reports=opponents.map(o=>analyze(td33BaseBattleMon(p),o,gen));
  const score=reports.reduce((s,r)=>s+r.score,0)/reports.length;
  return {p,reports,score,worst:Math.max(...reports.map(r=>r.worst))};
 }).sort((a,b)=>b.score-a.score);
 let pairSection='';
 if(doubleMode){
  window.td76RenderBattleStrip?.(current,ranked);
  const members=current.pokemon.map((p,i)=>p?.saveStats?.egg?null:td33BaseBattleMon(p)).filter(Boolean),plans=[];
  for(let i=0;i<members.length;i++)for(let k=i+1;k<members.length;k++){
   const plan=pairPlan(members[i],members[k],opponents,gen);if(plan)plans.push(plan);
  }
  plans.sort((a,b)=>b.rank-a.rank);
  pairSection='<h3 class="subheading">RECOMMENDED PAIRS</h3>'+(plans.length?plans.slice(0,5).map((p,i)=>pairCard(p,i,opponents)).join(''):'<p>Add two Pokémon with damaging attacks to see pair recommendations.</p>')+'';
 }
 if(!doubleMode&&window.td3RenderSingleBattle){window.td3RenderSingleBattle(current,foe,ranked,gen);return;}
 $('matchups').innerHTML=pairSection+
 ranked.map((r,i)=>{


 const defense=r.worst>=4?'HIGH RISK':r.worst>=2?'WEAK DEFENSE':r.worst<1?'RESISTS ATTACKS':'NEUTRAL DEFENSE';
 const rows=r.reports.map((rep,k)=>`<div class="matchup-details"><h4>VS ${safe(opponents[k].name)}</h4><div class="threat-row">Potential incoming STAB: ${rep.threats.map(t=>`${pretty(t.type)} ${effectText(t.multiplier)}`).join(' · ')}</div>${window.td76QuickMoveCards?.(td33BaseBattleMon(r.p),opponents[k],gen)||'<p>No attacks saved</p>'}</div>`).join('');
 return `<article data-td76-battle-card="${current.pokemon.indexOf(r.p)}" class="card rank-card ${i===0?'rank-winner':''}"><div class="recommendation-head"><div class="ranking-medal">${i===0?'♛':i+1}</div><div class="identity rank-identity td73-poke-link" role="button" tabindex="0" data-td73-mon="${safe(r.p.name)}" data-td73-context="battle" title="Tap for Pokédex"><div class="rank-portrait"><img src="${safe(r.p.image||'')}" alt=""></div><div class="rank-info"><strong>${safe(td41PokemonLabel(r.p.name))}</strong>${td3AbilityText(r.p)}<div class="pills">${r.p.types.map(pill).join('')}</div></div></div><div class="rank-risk ${r.worst>=2?'bad':r.worst<1?'good':''}">${defense}</div></div><details class="expand-details"><summary>View all attacks & defensive matchups <span>⌄</span></summary>${rows}</details></article>`;
 }).join('')||'<p>Add Pokémon to your team to see recommendations.</p>';

}
$('teamsTab').onclick=()=>{$('teamsPage').hidden=false;$('battlePage').hidden=true;$('teamsTab').classList.add('selected');$('battleTab').classList.remove('selected')};
$('battleTab').onclick=()=>{$('teamsPage').hidden=true;$('battlePage').hidden=false;$('battleTab').classList.add('selected');$('teamsTab').classList.remove('selected');showBattle();enrichTeamMoves()};function toggleTheme(){document.body.classList.toggle('light');localStorage.setItem('poketact-light',document.body.classList.contains('light'))};if(localStorage.getItem('poketact-light')==='true')document.body.classList.add('light');showTeams();if('serviceWorker' in navigator){
  const tdAndroid=(window.Capacitor?.isNativePlatform?.()===true) || (location.hostname==='localhost'&&location.protocol==='https:');
  if(tdAndroid){
    // Android V4: native assets are bundled; remove historical service workers to protect Capacitor plugins.
    navigator.serviceWorker.getRegistrations().then(async regs=>{
      if(!regs.length)return;
      await Promise.all(regs.map(r=>r.unregister()));
      if(navigator.serviceWorker.controller)location.reload();
    }).catch(e=>console.warn('Tak-Dex Android SW cleanup',e));
  }else{
    navigator.serviceWorker.register('./sw.js').catch(e=>console.warn('Tak-Dex service worker',e));
  }
}

// V9 navigation: four real tabs, with the existing battle/team logic retained.
(function(){
 const tabs=['teamsTab','battleTab','dexTab','moreTab'];
 const pages=['teamsPage','battlePage','dexPage','morePage','plannerPage','tmPage'];
 const oldTeam=$('teamsTab').onclick,oldBattle=$('battleTab').onclick;
 function activate(index){
  window.td4RememberExplorer?.(index);
  window.td77RememberPlan?.();
  tdDev1RememberDexScroll();
  pages.forEach((id,i)=>$(id).hidden=i!==index);if($('td4TeamPlannerPage'))$('td4TeamPlannerPage').hidden=true;
  tabs.forEach((id,i)=>{$(id).classList.toggle('selected',i===index);$(id).setAttribute('aria-current',i===index?'page':'false')});
  window.scrollTo({top:0,behavior:'instant'});
  if(index===0)window.td77RestorePlan?.();
 }
 $('teamsTab').onclick=()=>{oldTeam?.();activate(0)};
 $('battleTab').onclick=()=>{oldBattle?.();activate(1)};
 $('dexTab').onclick=()=>{activate(2);refreshTeamMenus();tdDev1RestoreDexScroll();window.td4RestoreExplorer?.()};
 $('moreTab').onclick=()=>activate(3);window.takActivate=activate;
 $('moreTheme').onclick=toggleTheme;
 $('dexInput').addEventListener('keydown',e=>{if(e.key==='Enter')td77SearchDex()});
})();


// V16 tools: separate 6v6 planning, Pokédex learnsets/evolutions, TM/HM compatibility.
const gameOptions=games.map(g=>`<option value="${safe(g)}">${safe(g)}</option>`).join('');
const TD66_GAME_KEY='takdex-v66-selected-game',TD66_DEX_KEY='takdex-v66-dex-choice';
function td66SavedDexChoice(){try{const g=localStorage.getItem(TD66_DEX_KEY);return g==='All Games'||games.includes(g)?g:null}catch{return null}}
function td66RememberDexChoice(g){if(g!=='All Games'&&!games.includes(g))return;try{localStorage.setItem(TD66_DEX_KEY,g)}catch{}}
function td66SavedGame(){try{
 if(!localStorage.getItem('takdex-v70-game-migrated')){
  // Previous versions persisted an implicit Emerald choice. Start V70 blank once.
  localStorage.removeItem(TD66_GAME_KEY);localStorage.removeItem(TD66_DEX_KEY);
  localStorage.setItem('takdex-v70-game-migrated','1');
 }
 const g=localStorage.getItem(TD66_GAME_KEY);return games.includes(g)?g:null;
 }catch{return null}}
function td66RememberGame(g,source='manual'){if(!games.includes(g))return;try{localStorage.setItem('takdex-v70-game-migrated','1');localStorage.setItem(TD66_GAME_KEY,g)}catch{};td66RememberDexChoice(g)
 document.querySelectorAll('select[data-td66-global-game="1"]').forEach(el=>{if(el.id==='planGame'&&window.td73PlannerPreserveGame)return; if(el.value!==g&&[...el.options].some(o=>o.value===g))el.value=g});
 // Opening a saved team deliberately updates every game selector.
 // Each tool loads its game-specific data through its existing entry/selection handler.
}

// Closing a team clears any game and team-derived tool state, never saved team records.
function td70CloseTeam(){
 td74CloseInline();td72DetailsTeam=null;
 current=null;chosen=null;foe=null;foe2=null;lookupVersion++;
 $('editor').hidden=true;
 $('foeInput').value='';$('foeInput2').value='';
 try{localStorage.removeItem('takdex-v71-active-team')}catch{}
 document.querySelectorAll('select[data-td66-global-game="1"]').forEach(el=>{
  if(!['editTeamGame','planGame'].includes(el.id)&&[...el.options].some(x=>x.value===''))el.value=td66SavedGame()||'';
 });
 for(const id of ['tmTeam'])if($(id))$(id).value='';

 // 6v6 retains its loaded opponents/results across unrelated team changes.
 if($('tmResults'))$('tmResults').textContent='Choose a game to load TM/HM data.';
 if($('matchups'))showBattle();
}
['dexGame','planGame','tmGame'].forEach(id=>{ $(id).innerHTML='<option value="">Choose game…</option>'+gameOptions; $(id).value=td66SavedGame()||''; });
function td71TeamForGame(game){return teams.filter(t=>t.game===game)}
function teamOptions(game){const available=td71TeamForGame(game);return `<option value="">${!games.includes(game)?'Choose a game first…':available.length?'Select team…':'No teams saved for this game'}</option>`+available.map(t=>`<option value="${safe(t.id)}">${safe(t.name)} (${safe(t.game)})</option>`).join('')}
function refreshTeamMenus(){
 for(const [id,gameId] of [['tmTeam','tmGame']]){
  const select=$(id),game=$(gameId).value,previous=select.value;
  select.innerHTML=teamOptions(game);
  const available=td71TeamForGame(game);const preferred=current?.game===game?current.id:available.length===1?available[0].id:'';
  select.value=td71TeamForGame(game).some(t=>t.id===previous)?previous:preferred;
 }
 refreshPlannerTeamMenu();
}
const TD74_CUSTOM_TEAM="__custom__";
let td74CustomPlannerRows=[],td74CustomPlannerGame="";
function refreshPlannerTeamMenu(){
 const select=$('planTeam'),game=$('planGame').value,previous=select.value;
 const available=td71TeamForGame(game);
 select.innerHTML=teamOptions(game)+`<option value="${TD74_CUSTOM_TEAM}">✎ Custom Team — build your own</option>`;
 const preferred=current?.game===game?current.id:available.length===1?available[0].id:'';
 select.value=previous===TD74_CUSTOM_TEAM?TD74_CUSTOM_TEAM:available.some(t=>t.id===previous)?previous:preferred;
 if(previous&&!select.value){plannerOwn=[];renderPlannerSlots('planOwn',plannerOwn,true);$('planResults').textContent='Choose a team saved for '+(game||'the selected game')+'.'}
}
function selectedTeam(id){return teams.find(t=>t.id===$(id).value)}
// V28: the Pokédex gets the same autocomplete as the Battle opponent field.
// Selecting a suggestion clears the saved-team member selector so the typed choice wins.
search($('dexInput'),$('dexResults'),name=>{

 $('dexInput').value=pretty(name);
 $('dexResults').hidden=true;
 syncDexClear();
 td77SearchDex();
});
$('dexInput').addEventListener('keydown',e=>{
 const results=$('dexResults');
 if(e.key==='Escape'){results.hidden=true;return;}
 if(!results.hidden&&['ArrowDown','ArrowUp'].includes(e.key)){
  const buttons=results.querySelectorAll('button');
  const target=e.key==='ArrowDown'?buttons[0]:buttons[buttons.length-1];
  if(target){e.preventDefault();target.focus();}
 }
});
$('dexResults').addEventListener('keydown',e=>{
 if(e.key==='Escape'){$('dexResults').hidden=true;$('dexInput').focus();return;}
 if(!['ArrowDown','ArrowUp'].includes(e.key))return;
 const buttons=[...$('dexResults').querySelectorAll('button')],i=buttons.indexOf(e.target);
 if(i<0)return;
 e.preventDefault();buttons[(i+buttons.length+(e.key==='ArrowDown'?1:-1))%buttons.length]?.focus();
});
const dexClear=$('dexClear');
function syncDexClear(){dexClear.hidden=!$('dexInput').value.trim()}
$('dexInput').addEventListener('input',()=>{ syncDexClear() });
$('dexInput').addEventListener('focus',e=>{if(e.target.value)e.target.select()});
dexClear.addEventListener('click',()=>{$('dexInput').value='';$('dexResults').hidden=true;$('dexInput').dispatchEvent(new Event('input',{bubbles:true}));$('dexInput').focus()});
// DEV7: Pokédex evolution navigation uses the canonical species number. This must
// resolve through the same default Pokemon record as a direct catalog selection.
// Evolution taps should never be interpreted as long-press comparison gestures.
$('dexResult').addEventListener('click',event=>{
 const target=event.target.closest('[data-dex-evolution]');
 if(!target)return;
 event.preventDefault();
 const pokemon=target.dataset.dexEvolution;
 const id=Number(target.dataset.dexEvolutionId);
 if(!pokemon)return;

 $('dexInput').value=pretty(pokemon);
 if(Number.isInteger(id)&&id>0)$('dexInput').dataset.evolutionId=String(id);
 $('dexResults').hidden=true;
 syncDexClear();
 td77SearchDex();
 // The Dex search handler reads the canonical ID synchronously before awaiting.
 delete $('dexInput').dataset.evolutionId;
});

(function(){const style=document.createElement('style');style.id='td62-style';style.textContent=`
#td62SmartMoves{margin:16px 0;padding:0;overflow:hidden}
#td62SmartMoves>summary{cursor:pointer;list-style:none;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:15px 16px;font-weight:750;user-select:none}
#td62SmartMoves>summary::-webkit-details-marker{display:none}
#td62SmartMoves>summary:focus-visible{outline:2px solid var(--accent,#e34d54);outline-offset:-3px}
#td62SmartMoves .td62-caret{opacity:.8;transition:transform .15s ease}
#td62SmartMoves[open] .td62-caret{transform:rotate(180deg)}
#td62SmartMoves .td62-body{padding:0 15px 14px}
#td62SmartMoves .td62-body>h4{margin:16px 0 8px}
#td62SmartMoves .td62-row{padding:10px 0;border-top:1px solid var(--edge,#3f4149)}
#td62SmartMoves .td62-head{display:flex;align-items:center;flex-wrap:wrap;gap:7px}
#td62SmartMoves .td62-head strong{font-size:.96rem}
#td62SmartMoves .td62-method{font-size:.85rem;font-weight:650;margin-top:5px}
#td62SmartMoves .td62-meta{font-size:.79rem;opacity:.75;margin-top:3px}
#td62SmartMoves .td62-stab{border:1px solid currentColor;border-radius:12px;font-size:.66rem;opacity:.72;padding:1px 6px}
`;document.head.appendChild(style)})();
// V62 — Smart Move Advisor. Learnability is shared with TM/HM Checker.
// Do not infer compatibility from a move's global TM number or another game.
function takMoveMethodsForGame(pokemon,moveName,game){
 const record=(pokemon.moves||[]).find(x=>x.move?.name===moveName);
 return (record?.version_group_details||[]).filter(x=>x.version_group?.name===vg[game]&&!(['FireRed','LeafGreen'].includes(game)&&moveName==='dive'&&x.move_learn_method?.name==='machine'));
}
function takMachineCompatible(pokemon,moveName,game){
 return takMoveMethodsForGame(pokemon,moveName,game).some(x=>x.move_learn_method?.name==='machine');
}
const TAK62_SUPPORT=new Set(['calm-mind','swords-dance','dragon-dance','nasty-plot','bulk-up','iron-defense','agility','rock-polish','coil','quiver-dance','work-up','growth','shell-smash','leech-seed','will-o-wisp','thunder-wave','toxic','spore','sleep-powder','stun-spore','hypnosis','reflect','light-screen','recover','roost','soft-boiled','moonlight','morning-sun','wish','protect','rest','substitute','taunt','encore','stealth-rock','spikes','rapid-spin','defog']);
const TAK62_AVOID=new Set(['self-destruct','explosion','hyper-beam','giga-impact','blast-burn','frenzy-plant','hydro-cannon','solar-beam','solar-blade','focus-punch','future-sight','doom-desire','skull-bash','razor-wind','sky-attack','phantom-force','shadow-force','geomancy','meteor-beam','bide','counter','mirror-coat']);
const TAK62_VARIABLE=new Set(['return','frustration','hidden-power','low-kick','grass-knot','gyro-ball','electro-ball','heat-crash','heavy-slam','flail','reversal','eruption','water-spout','facade','brine','payback','avalanche','revenge','hex','venoshock','stored-power','rollout','ice-ball','fury-cutter','seismic-toss','night-shade','dragon-rage','sonic-boom','super-fang','endeavor','psywave','magnitude','present','beat-up','triple-kick','triple-axel','fissure','guillotine','horn-drill','sheer-cold']);
// V63: descriptions are explanatory, not move-power estimates. Historical effects may vary by game.
const TAK63_SUPPORT_GUIDE={
 'swords-dance':['Sharply increases Attack, improving physical damage.','Physical setup'],
 'dragon-dance':['Raises Attack and Speed one stage.','Physical setup'],
 'calm-mind':['Raises Special Attack and Special Defense.','Special setup'],
 'nasty-plot':['Sharply raises Special Attack.','Special setup'],
 'bulk-up':['Raises Attack and Defense.','Physical setup'],
 'iron-defense':['Sharply raises Defense.','Defensive setup'],
 'agility':['Sharply raises Speed.','Speed setup'],
 'rock-polish':['Sharply raises Speed.','Speed setup'],
 'coil':['Raises Attack, Defense and accuracy.','Physical setup'],
 'quiver-dance':['Raises Special Attack, Special Defense and Speed.','Special setup'],
 'work-up':['Raises Attack and Special Attack.','Mixed setup'],
 'growth':['Raises offensive stats; effect differs by generation and weather.','Situational'],
 'shell-smash':['Greatly boosts offensive stats and Speed, but lowers defenses.','Risky setup'],
 'leech-seed':['Drains a portion of the target’s HP each turn to heal the user.','Sustain'],
 'will-o-wisp':['Burns the target, reducing physical damage and dealing residual damage.','Status'],
 'thunder-wave':['Paralyzes a target, usually lowering its Speed.','Speed control'],
 'toxic':['Badly poisons the target; poison damage increases each turn. No fixed base power.','Chip damage'],
 'spore':['Puts the target to sleep, subject to immunities.','Sleep control'],
 'sleep-powder':['Attempts to put the target to sleep.','Sleep control'],
 'stun-spore':['Attempts to paralyze the target.','Speed control'],
 'hypnosis':['Attempts to put the target to sleep; accuracy is limited.','Sleep control'],
 'reflect':['Reduces damage taken from physical attacks while active.','Team defense'],
 'light-screen':['Reduces damage taken from special attacks while active.','Team defense'],
 'recover':['Restores up to half the user’s maximum HP.','Healing'],
 'roost':['Restores HP; Flying-type interactions change during the turn.','Healing'],
 'soft-boiled':['Restores up to half the user’s maximum HP.','Healing'],
 'moonlight':['Restores HP; weather affects the amount.','Healing'],
 'morning-sun':['Restores HP; weather affects the amount.','Healing'],
 'wish':['Restores HP on the following turn.','Delayed healing'],
 'protect':['Blocks most moves for a turn; repeated use is less reliable.','Defensive utility'],
 'rest':['Fully restores HP and removes major status, but puts the user to sleep.','Healing / sleep'],
 'substitute':['Uses some HP to create a decoy that absorbs many attacks.','Defensive utility'],
 'taunt':['Temporarily prevents the target from choosing status moves.','Disruption'],
 'encore':['Temporarily forces the target to repeat its last move.','Disruption'],
 'stealth-rock':['Sets entry hazards that damage opponents when they switch in.','Entry hazard'],
 'spikes':['Sets entry hazards that damage susceptible grounded opponents.','Entry hazard'],
 'rapid-spin':['Attacks and removes certain entry hazards; exact effects vary by game.','Field control'],
 'defog':['Clears certain field effects; exact effects vary by generation.','Field control']
};
function tak63SupportPriority(x,stats){
 const n=x.name,atk=stats.attack||0,sp=stats['special-attack']||0;
 if(['swords-dance','dragon-dance','bulk-up','coil'].includes(n))return atk>=sp?100:65;
 if(['calm-mind','nasty-plot','quiver-dance'].includes(n))return sp>=atk?100:65;
 if(['recover','roost','soft-boiled','wish','moonlight','morning-sun'].includes(n))return 94;
 if(['toxic','will-o-wisp','thunder-wave','leech-seed','spore'].includes(n))return 88;
 if(['protect','rest','reflect','light-screen','stealth-rock','spikes'].includes(n))return 78;
 return 60;
}
function tak62Score(move,stats,types,gen){
 const h=move.hist;
 if(!Number.isFinite(h.power)||h.power<35||!h.type||h.damageClass==='status'||TAK62_VARIABLE.has(move.name)||TAK62_AVOID.has(move.name))return null;
 const neverMiss=ALWAYS_HIT_MOVES.has(pretty(move.name));
 if(!Number.isFinite(h.accuracy)&&!neverMiss)return null;
 const accuracy=Number.isFinite(h.accuracy)?h.accuracy:100;
 const stat=stats[h.damageClass==='special'?'special-attack':'attack']||75;
 const stab=types.includes(h.type)?1.5:1;
 const twoTurn=new Set(['fly','dig','dive','bounce']).has(move.name)?0.75:1;
 return h.power*(accuracy/100)*stab*twoTurn*Math.sqrt((stat+35)/110);
}
async function tak62RenderSmart(host,pokemon,game,isCurrent,evolved){
 if(!isCurrent())return;
 host.innerHTML='<p class="note">Checking exact '+safe(game)+' learnsets, TM/HM compatibility and move stats…</p>';
 const gen=gameGeneration(game), types=historicalTypes(pokemon,game);
 const stats=Object.fromEntries(td76HistoricalStats(pokemon,game).map(s=>[s.stat.name,s.base_stat]));
 const applicable=(pokemon.moves||[]).map(x=>({name:x.move.name,details:takMoveMethodsForGame(pokemon,x.move.name,game)}))
  .filter(x=>x.details.some(d=>['machine','level-up','tutor'].includes(d.move_learn_method?.name)));
 if(!applicable.length){host.innerHTML='<p class="note">No verified moves are available in this game record. No recommendations can be confirmed.</p>';return}
 let machines=null;
 try{machines=await window.takDexReferenceV58?.machinesFor?.(game)}catch{}
 const lookup=new Map((machines||[]).filter(m=>m.move&&m.item).map(m=>[m.move,m.item]));
 let failures=0;
 const candidates=new Array(applicable.length);
 let cursor=0;
 async function worker(){while(cursor<applicable.length){const i=cursor++,item=applicable[i];
  try{
   const d=await api('move/'+encodeURIComponent(item.name));
   const hist=moveGenerationData(d,gen,game);
   let machine=lookup.get(item.name)||null;
   if(!machine&&item.details.some(x=>x.move_learn_method?.name==='machine')){
    // PokeAPI move.machines is version-group-specific, not a global TM number.
    const entry=(d.machines||[]).find(x=>x.version_group?.name===vg[game]);
    if(entry?.machine?.url){try{const data=await api(entry.machine.url.replace(API_ROOT,''));
     if(data.version_group?.name===vg[game]&&data.move?.name===item.name)machine=data.item?.name||null;
    }catch{}}
   }
   candidates[i]={...item,hist,machine,score:tak62Score({name:item.name,hist},stats,types,gen)};
  }catch{failures++}
 }}
 await Promise.all(Array.from({length:Math.min(6,applicable.length)},worker));
 if(!isCurrent())return;
 const verified=candidates.filter(Boolean);
 const ranked=verified.filter(x=>x.score!==null).sort((a,b)=>b.score-a.score);
 // Avoid presenting very weak early-game moves as a top recommendation once stronger options exist.
 const attacking=ranked.filter(x=>x.score>=((ranked[0]?.score||0)*.48));
 const chosen=[];const typesUsed=new Map();
 // Start with strong STAB of each of the Pokémon's types, then diverse coverage.
 for(const t of types){const match=attacking.find(x=>x.hist.type===t&&!chosen.includes(x));if(match){chosen.push(match);typesUsed.set(t,1)}}
 for(const x of attacking){if(chosen.length>=6)break;if(chosen.includes(x))continue;
  if((typesUsed.get(x.hist.type)||0)>=1)continue;chosen.push(x);typesUsed.set(x.hist.type,1)}
 for(const x of attacking){if(chosen.length>=6)break;if(!chosen.includes(x))chosen.push(x)}
 const support=verified.filter(x=>x.hist.damageClass==='status'&&TAK62_SUPPORT.has(x.name)).sort((a,b)=>tak63SupportPriority(b,stats)-tak63SupportPriority(a,stats)).slice(0,4);
 const row=x=>{
  const moves=x.details.filter(d=>d.move_learn_method?.name==='level-up').map(d=>d.level_learned_at);
  const method=[];
  const reminder=evolved&&moves.includes(1)?window.takDexAcquisitionV77?.moveReminder(game):null;
  if(reminder)method.push(td77ReminderRow(reminder,game));
  const levels=moves.filter(n=>!reminder||n!==1);
  if(levels.length)method.push('<small>'+(Math.min(...levels)===0?'On evolution':'Lv '+Math.min(...levels))+'</small>');
  if(x.details.some(d=>d.move_learn_method?.name==='machine')){
   const label=x.machine?.toUpperCase()||'TM/HM';
   const place=x.machine&&window.takDexMachineGuideV65?.label(game,x.machine);
   method.push(td77MoveAcquisitionRow(label,place,window.td62Progress?.moveAccess(game,x.name,'machine')||[],game));
  }
  if(x.details.some(d=>d.move_learn_method?.name==='tutor')){
   for(const tutor of window.takDexTutorV73?.find(game,x.name)||[]){
    method.push(td77MoveAcquisitionRow('Move Tutor',tutor.place,[tutor.cost,tutor.condition],game));
   }
  }
  const isStab=types.includes(x.hist.type)&&x.hist.damageClass!=='status';
  const category=x.hist.damageClass==='special'?'Special':x.hist.damageClass==='physical'?'Physical':'Status';
  const pwr=Number.isFinite(x.hist.power)?x.hist.power:'—';
  const acc=Number.isFinite(x.hist.accuracy)?x.hist.accuracy+'%':'—';
  const pp=Number.isFinite(x.hist.pp)?x.hist.pp:'—';
  return `<div class="td62-row td681-move-row"><div class="td681-move-head td681-move-head--advisor"><span class="td681-move-name-group"><button type="button" class="td68-move-link" data-td68-move="${safe(x.name)}">${safe(pretty(x.name))}</button>${isStab?'<span class="td62-stab td681-stab">STAB</span>':''}</span><span class="td681-type">${x.hist.type?pill(x.hist.type):''}</span></div><div class="td681-move-meta"><span>${safe(category)}</span><span>PWR ${safe(pwr)} · ACC ${safe(acc)} · PP ${safe(pp)}</span></div>${method.length?`<div class="td62-method">${method.join('')}</div>`:''}</div>`;
 };
 let html='<p class="note">Verified for <b>'+safe(game)+'</b> using this Pokémon’s game-specific learn methods. Attacks are ranked by an approximate base-stat, power, accuracy and STAB score—not simulated damage.</p>';
 html+='<h4>Suggested attacking moves</h4>'+(chosen.length?chosen.map(row).join(''):'<p class="note">No reliable fixed-power attack suggestions found for this game.</p>');
 if(support.length)html+='<h4>Useful support &amp; status moves</h4><p class="note">Support moves have no base power because their effect is not a direct damaging attack. The descriptions below explain their role.</p>'+support.map(x=>{
  const guide=TAK63_SUPPORT_GUIDE[x.name]||['Read its full effect before teaching.','Situational'];
  const priority=tak63SupportPriority(x,stats);
  const label=priority>=88?'Worth considering':'Situational';
  return row(x).replace('</div></div>',`</div><div class="td63-support-desc"><b>${safe(label)}</b> · ${safe(guide[1])}: ${safe(guide[0])}</div></div>`);
 }).join('');
 html+='<p class="note">Egg moves, events and unverified acquisition methods are outside these recommendations.</p>';
 if(failures)html+='<p class="note">'+failures+' move records could not be loaded; suggestions may be incomplete. Resume your game’s offline pack or reconnect.</p>';
 host.innerHTML=html;
}
function tak62AttachAdvisor(result,pokemon,game,requestId,evolved){
 const disclosure=result.querySelector('#td62SmartMoves'),host=result.querySelector('#td62SmartBody');
 if(!disclosure||!host)return;
 let started=false;
 function loadIfOpen(){
  if(!disclosure.open||started)return;
  started=true;
  tak62RenderSmart(host,pokemon,game,()=>requestId===takDexDexRequestV56&&host.isConnected,evolved)
   .catch(()=>{if(requestId===takDexDexRequestV56&&host.isConnected)host.innerHTML='<p class="note">Move advice could not load. Check your game pack or internet connection, then reopen this Pokémon.</p>'});
 }
 disclosure.addEventListener('toggle',loadIfOpen);
 loadIfOpen();
}

// V67: Keep expanded/collapsed sections while browsing species in the same Pokédex visit.
// Returning from another main tab resets the defaults on the next Pokémon.
let tak67DexSectionState=null;
const tak67DexSectionDefaults={type:false,evolutions:true,learnset:false,advisor:false,encounters:false};
function tak67DexSectionOpen(key){return tak67DexSectionState?.[key]??tak67DexSectionDefaults[key]}
function tak67CaptureDexSections(){
 const details=$('dexResult').querySelectorAll('details[data-dex-section]');
 if(!details.length)return;
 tak67DexSectionState={...tak67DexSectionDefaults,...(tak67DexSectionState||{})};
 details.forEach(d=>tak67DexSectionState[d.dataset.dexSection]=d.open);
}
// DEV1: preserve expanded sections when leaving Pokédex; explicit new searches capture current sections.
var tdDev1DexScroll=0;
function tdDev1RememberDexScroll(){if(!$('dexPage').hidden)tdDev1DexScroll=window.scrollY;}
function tdDev1RestoreDexScroll(){const y=tdDev1DexScroll;requestAnimationFrame(()=>{if(!$('dexPage').hidden)window.scrollTo(0,y)});}
// Native acquisition records are not exhaustive. In the game-specific catalog, list
// recorded/acquired species plus regional entries marked unverified, not falsely confirmed.
async function tak67BrowseDexCatalog(requestId){
 const game=$('dexGame').value,result=$('dexResult');
 tak67CaptureDexSections();
 result.innerHTML='<p class="note">Loading Pokémon catalog for '+safe(game)+'…</p>';
 try{
  let entries=[];
  if(game==='All Games'){
   const index=await api('pokemon?limit=2000');
   entries=(index.results||[]).map(x=>({id:Number(x.url.match(/\/(\d+)\/?$/)?.[1]||0),name:x.name,status:'National Pokédex'}))
    .filter(x=>x.id>=1&&x.id<=1025).sort((a,b)=>a.id-b.id);
  }else{
   const pack=await window.takDexEncounterV55.get(game);
   entries=pack.mons.map(m=>{
    const info=window.takDexAcquisitionV64.details(pack,m[0]);
    return {id:m[0],name:m[1],status:info.label,regional:!!m[3],confirmed:!!(info.verified||info.nativeEvolution||(pack.entries[m[0]]||[]).length),external:!!info.externalTrade};
   }).filter(m=>!m.external&&(m.confirmed||m.regional)).sort((a,b)=>a.id-b.id);
  }
  if(requestId!==takDexDexRequestV56||$('dexGame').value!==game)return;
  let shown=0;const step=80;
  result.innerHTML=`<section class="card td67-catalog"><h3>${safe(game==='All Games'?'All Pokémon':'Pokémon catalog · '+game)}</h3><p class="note">${entries.length} Pokémon listed. ${game==='All Games'?'All currently supported national Pokédex species.':'Confirmed acquisition evidence and regional Pokédex entries; entries without acquisition evidence are labeled unverified. External-trade-only species with known classifications are excluded.'} Select one to view its complete entry.</p><div class="td67-catalog-items" id="td67CatalogItems"></div><button type="button" id="td67CatalogMore">Show more Pokémon</button></section>`;
  const list=result.querySelector('#td67CatalogItems'),more=result.querySelector('#td67CatalogMore');
  function next(){
   list.insertAdjacentHTML('beforeend',entries.slice(shown,shown+step).map(m=>`<button type="button" class="td67-catalog-item" data-td67-catalog-pokemon="${safe(m.name)}" data-td71-quick-compare="${safe(m.name)}"><img loading="lazy" alt="" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${m.id}.png"><span><strong>#${m.id} ${safe(pretty(m.name))}</strong><small>${safe(m.status)}</small></span><span aria-hidden="true">›</span></button>`).join(''));
   shown+=step;more.hidden=shown>=entries.length;
   more.textContent='Show more · '+Math.min(shown,entries.length)+' / '+entries.length;
  }
  more.onclick=next;next();
 }catch(e){if(requestId===takDexDexRequestV56)result.innerHTML='<p class="note">This game’s catalog could not load. Connect to download its encounter index, or select All Games. Unknown acquisition records are never labeled obtainable.</p>'}
}
(function(){const style=document.createElement('style');style.id='td67-style';style.textContent=`
 #dexResult .td67-catalog-items{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px}
 #dexResult .td67-catalog-item{display:flex;align-items:center;gap:9px;text-align:left;min-width:0;padding:7px;background:transparent;color:var(--text);border:1px solid var(--edge);border-radius:10px;cursor:pointer}
 #dexResult .td67-catalog-item img{width:46px;height:46px;object-fit:contain;flex:none;image-rendering:pixelated}
 #dexResult .td67-catalog-item span:nth-child(2){flex:1;min-width:0}
 #dexResult .td67-catalog-item strong{display:block;font-size:.87rem}
 #dexResult .td67-catalog-item small{display:block;font-size:.72rem;color:var(--muted);margin-top:4px}
 #dexResult #td67CatalogMore{margin-top:12px;width:100%}
 `;document.head.appendChild(style)})();
$('dexResult').addEventListener('click',e=>{
 const item=e.target.closest('[data-td67-catalog-pokemon]');if(!item)return;
 $('dexInput').value=pretty(item.dataset.td67CatalogPokemon);
 $('dexResults').hidden=true;syncDexClear();td77SearchDex();
});
let takDexDexRequestV56=0;
function td77AcquisitionLinks(text,game){
 const parts=String(text||'').split(/( · | → )/);
 return parts.map(part=>{
  const target=window.takDexMapsV73?.resolveLocation(part.trim(),game);
  return target?`<button type="button" class="td74-dex-map-link" data-td74-dex-map="${safe(target)}">${safe(part.trim())} ⌖</button>`:safe(part);
 }).join('');
}
function td77MoveAcquisitionRow(label,place,requirements,game){
 return `<div class="td77-dex-acquisition"><small>${safe(label)}${place?' · '+td77AcquisitionLinks(place,game):''}</small>
  ${requirements.filter(Boolean).map(detail=>`<small>${td77AcquisitionLinks(detail,game)}</small>`).join('')}</div>`;
}
function td773ReminderRoute(reminder){
 return {label:'Move Reminder',place:reminder.place,resource:'1 Heart Scale',rank:reminder.rank,
  details:reminder.text.split(' · ').slice(3)};
}
function td77ReminderRow(requirement,game,earlier){
 const note=earlier?'Or retain from '+td41PokemonLabel(earlier):'';
 return td77MoveAcquisitionRow('Move Reminder',requirement.place,['1 Heart Scale','After badge '+requirement.rank,note],game);
}
function td77SearchDex(){ $('dexInput').dispatchEvent(new Event('takdex:pokedex-search')); }
$('dexInput').addEventListener('takdex:pokedex-search',async()=>{
 const requestId=++takDexDexRequestV56;
 window.takDexBattleNavigationV73?.parkBack();
 const inputName=$('dexInput').value.trim().toLowerCase().replace(/\s+/g,'-');
 const evoId=Number($('dexInput').dataset.evolutionId);
 const name=Number.isInteger(evoId)&&evoId>0?String(evoId):inputName;
 if(!name){await tak67BrowseDexCatalog(requestId);return;}tak67CaptureDexSections();
 const game=$('dexGame').value,result=$('dexResult');
 if(game!=='All Games'&&!games.includes(game)){result.textContent='Choose a game (or explicitly select All Games) to view this Pokémon.';return}
 tdDev1DexScroll=0;
 const version=vg[game]||'scarlet-violet',learnsetReference=game==='All Games'?'Scarlet/Violet reference':game;result.textContent='Loading Pokémon, evolution chain and level-up moves…';
 try{
  const pokemon=await api('pokemon/'+encodeURIComponent(name));
  if(!td7PokemonAllowed(pokemon.name,pokemon.id,game)){result.textContent='This Pokémon form is not available in the selected game.';return;}
  const chain=await api('pokemon-species/'+pokemon.species.name)
   .then(species=>api(species.evolution_chain.url.replace('https://pokeapi.co/api/v2/','')))
   .catch(()=>null);
  const evo=[];function walk(node,depth,ancestorNames=[]){const conditions=node.evolution_details.map(d=>[d.min_level?'Lv '+d.min_level:'',d.item?.name||'',d.trigger?.name==='trade'?'Trade':'',d.min_happiness?'Friendship':'',d.time_of_day||'',d.held_item?.name||'',d.known_move?.name||'',d.location?.name||''].filter(Boolean).join(' · ')).filter(Boolean);evo.push({name:node.species.name,id:Number(node.species.url.match(/\/(\d+)\/$/)?.[1]||0),depth,conditions,ancestorNames});node.evolves_to.forEach(n=>walk(n,depth+1,[...ancestorNames,node.species.name]))}if(chain?.chain)walk(chain.chain,0);const td71MaxSpecies=game==='All Games'?1025:[151,251,386,493,649,721,809,905,1025][gameGeneration(game)-1]||1025;const visibleEvo=evo.filter(e=>e.id>0&&e.id<=td71MaxSpecies);
  // V25: resolve each evolution form independently: typing can change on evolution.
  // A failed lookup leaves a neutral label instead of inventing a type.
  await Promise.all(visibleEvo.map(async e=>{
   try{const form=await api('pokemon/'+e.id);e.types=game==='All Games'?form.types.slice().sort((a,b)=>a.slot-b.slot).map(t=>t.type.name):historicalTypes(form,game);
    e.normalMoves=new Set((form.moves||[]).filter(m=>m.version_group_details?.some(d=>d.version_group.name===version&&d.move_learn_method.name==='level-up'&&(d.level_learned_at>1||d.level_learned_at===1&&e.depth===0))).map(m=>m.move.name));}
   catch{e.types=e.name==='sneasler'?['fighting','poison']:[]}
  }));
  const moves=pokemon.moves.flatMap(m=>m.version_group_details.filter(v=>v.version_group.name===version&&v.move_learn_method.name==='level-up').map(v=>({name:m.move.name,level:v.level_learned_at}))).sort((a,b)=>a.level-b.level||a.name.localeCompare(b.name));
  const stage=evo.find(node=>node.name===pokemon.species.name),evolved=stage?.depth>0;
  const ancestors=visibleEvo.filter(node=>stage?.ancestorNames.includes(node.name));
  const unique=[...new Map(moves.map(m=>[m.level+':'+m.name,m])).values()].map(m=>({
   ...m,requirement:m.level===1&&evolved?window.takDexAcquisitionV77?.moveReminder(game):null,
   retainFrom:m.level===1?ancestors.find(parent=>parent.normalMoves?.has(m.name))?.name:null
  }));
  const details=await Promise.all(unique.map(async m=>{try{const data=await api('move/'+m.name);return {...m,...moveGenerationData(data,gameGeneration(game),game)}}catch{return m}}));
  // Autocomplete may trigger rapid consecutive searches: only the latest may render.
  if(requestId!==takDexDexRequestV56)return;
  const img=pokemon.sprites.other?.['official-artwork']?.front_default||pokemon.sprites.front_default||'';
  const dexGen=game==='All Games'?9:gameGeneration(game);
  const dexTypes=game==='All Games'?pokemon.types.slice().sort((a,b)=>a.slot-b.slot).map(t=>t.type.name):historicalTypes(pokemon,game);
  const incoming=Object.keys(colors).filter(t=>!(dexGen<6&&t==='fairy')&&!(dexGen<2&&['dark','steel'].includes(t))).map(t=>({t,m:matchup(t,dexTypes,dexGen)}));
  const matchGroup=(title,filter)=>`<div class="td66-match-row"><strong>${title}</strong><div class="td66-match-pills">${incoming.filter(x=>filter(x.m)).map(x=>`${pill(x.t)} <span class="td66-mult">${effectText(x.m)}</span>`).join('')||'<span class="note">None</span>'}</div></div>`;
  const offensive=dexTypes.map(t=>({type:t,rows:Object.keys(colors).filter(d=>!(dexGen<6&&d==='fairy')&&!(dexGen<2&&['dark','steel'].includes(d))).map(d=>({t:d,m:matchup(t,[d],dexGen)}))}));
  const offenseRows=offensive.map(o=>`<div class="td66-offense-section"><h4>${pill(o.type)} · STAB attack type</h4>${[['Strong against',v=>v>1],['Not very effective',v=>v>0&&v<1],['No effect',v=>v===0]].map(([title,test])=>`<div class="td66-match-row"><strong>${title}</strong><div class="td66-match-pills">${o.rows.filter(x=>test(x.m)).map(x=>`${pill(x.t)} <span class="td66-mult">${effectText(x.m)}</span>`).join('')||'<span class="note">None</span>'}</div></div>`).join('')}</div>`).join('');
  const td71Stats=[['HP','hp'],['Attack','attack'],['Defense','defense'],['Sp. Atk','special-attack'],['Sp. Def','special-defense'],['Speed','speed']];
  const td71StatValues=Object.fromEntries(td76HistoricalStats(pokemon,game).map(r=>[r.stat.name,r.base_stat]));
  const td71Total=td71Stats.reduce((sum,[,key])=>sum+(td71StatValues[key]||0),0);
  const td71StatsHtml=`<section class="td71-base-stats" aria-label="Pokémon base stats"><h3>Base stats</h3>${td71Stats.map(([label,key])=>{const n=td71StatValues[key]||0;return `<div class="td71-stat-row"><span>${safe(label)}</span><b>${n}</b><span class="td71-stat-track"><span style="width:${Math.min(100,n/255*100).toFixed(1)}%"></span></span></div>`}).join('')}<div class="td71-stat-total"><strong>Total BST</strong><strong>${td71Total}</strong></div></section>`;
  const matchupHtml=`<details class="card td66-dex-section td66-type-match" data-dex-section="type" ${tak67DexSectionOpen('type')?'open':''}><summary>Type Strengths &amp; Weaknesses <span>⌄</span></summary><div class="td66-section-body"><h4>Defensive matchups</h4>${matchGroup('Weak to',m=>m>1)}${matchGroup('Resistant to',m=>m>0&&m<1)}${matchGroup('Immune to',m=>m===0)}<details class="td66-neutral"><summary>Neutral attacks</summary>${matchGroup('1× incoming',m=>m===1)}</details><h4>Offensive STAB type coverage</h4>${offenseRows}</div></details>`;
  const abilityGame=game==='All Games'?learnsetReference:game;
  const abilityOptions=new Map();
  for(const entry of historicalAbilities(pokemon,abilityGame)){
   const name=entry.ability?.name;
   if(name&&(!abilityOptions.has(name)||!entry.is_hidden))abilityOptions.set(name,!!entry.is_hidden);
  }
  const onlyAbility=abilityOptions.size===1?[...abilityOptions.keys()][0]:'';
  const abilityHtml=abilityOptions.size?`<div class="td77-dex-ability"><label for="td77DexAbility">Ability</label>
   <select id="td77DexAbility">${onlyAbility?'':'<option value="">Select ability…</option>'}
    ${[...abilityOptions].map(([name,hidden])=>`<option value="${safe(name)}">${safe(pretty(name))}${hidden?' (Hidden)':''}</option>`).join('')}
   </select>${td3AbilityDescriptionHtml(onlyAbility,abilityGame)}<small id="td77HiddenAbility" hidden>Hidden ability · In-game acquisition varies by version.</small></div>`:'';
  result.innerHTML=`<section class="card td66-pokemon-card"><div class="td71-dex-hero"><article class="dex-entry" data-td71-quick-compare="${safe(pokemon.name)}"><img src="${safe(img)}" alt=""><div><h3>${safe(td41PokemonLabel(pokemon.name))}</h3><div class="pills">${dexTypes.map(pill).join('')}</div><p>${safe(game)} · #${pokemon.id}</p></div></article>${td71StatsHtml}${abilityHtml}</div>${matchupHtml}</section><details class="card td66-dex-section" data-dex-section="evolutions" ${tak67DexSectionOpen('evolutions')?'open':''}><summary>Evolutions <span>⌄</span></summary><div class="td66-section-body">${!chain?.chain?'<p class="note">Evolution details unavailable.</p>':visibleEvo.length===1?'<p class="note">Does not evolve in the selected game.</p>':visibleEvo.map(e=>`<div class="evo-line" style="padding-left:${Math.min(e.depth*14,40)}px">${e.depth?'↳ ':''}<button type="button" class="evo-navigate" data-dex-evolution="${safe(e.name)}" data-td71-quick-compare="${safe(e.name)}" data-dex-evolution-id="${e.id}" aria-label="View ${safe(pretty(e.name))} in Pokédex"><img class="evo-art" loading="lazy" decoding="async" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${e.id}.png" alt=""><span class="evo-description"><strong>${safe(pretty(e.name))}</strong><span class="pills evo-types">${(e.types||[]).map(pill).join('')||'<small>Type unavailable offline</small>'}</span>${e.conditions.length?' <small>('+safe(e.conditions.join(' / '))+')</small>':''}</span></button></div>`).join('')}</div></details><details class="card td66-dex-section" data-dex-section="learnset" ${tak67DexSectionOpen('learnset')?'open':''}><summary>Level-up learnset · ${safe(learnsetReference)} <span>⌄</span></summary><div class="td66-section-body">${details.length?details.map(m=>`<div class="td681-move-row td681-learn-row"><div class="td681-move-head${m.requirement||m.level===0?' td77-special-learn':''}">${m.requirement||m.level===0?'':'<b class="td681-level">Lv '+safe(m.level)+'</b>'}<span class="td681-move-name-group"><button type="button" class="td68-move-link" data-td68-move="${safe(m.name)}"${m.requirement?` data-td77-reminder="${safe(m.requirement.text+' · '+td41PokemonLabel(pokemon.name))}"`:''}>${safe(pretty(m.name))}</button>${dexTypes.includes(m.type)&&m.damageClass!=='status'?'<span class="td62-stab td681-stab">STAB</span>':''}</span><span class="td681-type">${m.type?pill(m.type):''}</span></div><div class="td681-move-meta"><span>${safe(m.damageClass==='special'?'Special':m.damageClass==='physical'?'Physical':'Status')}</span><span>${safe(td77MoveStatsText(m))} · PP ${safe(Number.isFinite(m.pp)?m.pp:'—')}</span></div>${m.requirement?td77ReminderRow(m.requirement,game,m.retainFrom):m.level===0?'<small>On evolution</small>':''}</div>`).join(''):'No level-up moves listed for this version.'}</div></details><details class="card td62-smart" id="td62SmartMoves" data-dex-section="advisor" ${tak67DexSectionOpen('advisor')?'open':''}><summary>✦ Smart Move Advisor <span>⌄</span></summary><div id="td62SmartBody" class="td62-body"><p class="note">Expand to check this Pokémon’s learnable moves in ${safe(learnsetReference)}.</p></div></details><details class="card td66-dex-section" id="td56DexEncounters" data-dex-section="encounters" ${tak67DexSectionOpen('encounters')?'open':''}><summary>Encounter &amp; acquisitions · ${safe(game)} <span>⌄</span></summary><div class="td66-section-body"><p class="note">Checking encounter records…</p></div></details>`;
  const abilitySelect=$('td77DexAbility');
  if(abilitySelect){
   const update=()=>{
    td3UpdateAbilityDescription(abilitySelect,abilityGame);
    const hidden=$('td77HiddenAbility');
   hidden.hidden=!abilityOptions.get(abilitySelect.value);
   hidden.textContent=window.takDexAcquisitionV77?.hidden(abilityGame,pokemon.name,abilitySelect.value)||'Hidden ability · In-game acquisition varies by version.';
   };
   abilitySelect.addEventListener('change',update);
   update();
  }
  window.takDexBattleNavigationV73?.mountBack();
  requestAnimationFrame(()=>{if(requestId===takDexDexRequestV56&&!$('dexPage').hidden)result.scrollIntoView({block:'start'});});
  tak62AttachAdvisor(result,pokemon,game==='All Games'?'Scarlet':game,requestId,evolved);
  // V56: render below learnset using a persistent element rather than innerHTML string replacement.
  const renderEncounter=html=>{
   if(requestId!==takDexDexRequestV56)return;
   const host=result.querySelector('#td56DexEncounters');
   if(host){const body=host.querySelector('.td66-section-body');if(body)body.innerHTML=html;}
  };
  const noRecords='<p>Wild encounter timing unverified.</p>';
  const sourceFoot='';
  try{
   const cat=window.takDexEncounterV55;
   // The explorer already downloaded this index; no additional request is necessary.
   const pack=cat&&game!=='All Games'&&await cat.get(game);
   if(pack?.hasSource){
    const records=pack.entries[pokemon.id]||[];
    const engine=window.td62Progress;
    const timing=engine?.acquisition(game,pokemon,pack,[],null);
    const path=timing?.path;
    const source=path?.initial||timing;
    const routes=timing?.confirmed?[timing,...(timing.alternatives||[])]:[];
    const matching=routes.filter(route=>records.some(r=>td77SameAcquisition(r,route,game)));
    const entries=[];
    if(path)entries.push({place:source.place,method:source.method,
     detail:[engine.milestone(source.rank),source.note,path.stage+' → '+pretty(pokemon.name)+' · '+path.requirement].filter(Boolean).join(' · ')});
    for(const route of routes){
     if(matching.includes(route)||path&&route.method==='evolution')continue;
     entries.push({place:route.place,method:route.method,
      detail:[engine.milestone(route.rank),route.note].filter(Boolean).join(' · ')});
    }
    if(!entries.length&&['trade','event','tradePossible'].includes(timing?.kind)){
     entries.push({method:timing.kind==='trade'?'Trade or transfer':timing.kind==='tradePossible'?'Starter choice':'Event requirement',detail:timing.reason});
    }else if(!entries.length&&!matching.length){
     entries.push(...window.takDexAcquisitionV64.details(pack,pokemon.id).notes.filter(n=>n.text)
      .map(n=>({method:n.kind,detail:n.text})));
    }
    const formatted=cat.format(records,game,matching);
    renderEncounter(entries.map(r=>td77AcquisitionEntry(r,game)).join('')+(formatted||(!entries.length?noRecords:''))+sourceFoot);
   }else{
    // An ordinary Pokédex search must not trigger the massive 34-game bulk download.
    const records=game==='All Games'?[]:await api('pokemon/'+pokemon.id+'/encounters');
    const version=game.toLowerCase().replace(/ /g,'-');
    const matches=records.flatMap(row=>(row.version_details||[]).filter(v=>v.version.name===version)
     .flatMap(v=>(v.encounter_details||[]).map(detail=>[row.location_area.name,detail.method.name,
      detail.min_level,detail.max_level,(detail.condition_values||[]).map(c=>c.name)])));
    const content=matches.length?cat.format(matches,game):pack&&!pack.hasSource?
     '<p>No indexed encounters for this game. Availability unknown.</p>':noRecords;
    renderEncounter(game==='All Games'?'<p class="note">Select a game to see its encounter locations. The All Games learnset and advisor use Scarlet/Violet as a reference.</p>':content);
   }
  }catch(e){renderEncounter('<p class="note">Encounter data could not be loaded. Check your connection or download the selected game’s Encounter Locations pack under More → Offline Data. Availability is unverified.</p>')}

 }catch(e){if(requestId===takDexDexRequestV56)result.textContent='Could not load data. Check your connection or Pokémon name.'}
});
$('dexGame').onchange=()=>{refreshTeamMenus()};
function openTool(page,nav){if($('td4TeamPlannerPage'))$('td4TeamPlannerPage').hidden=true;window.td4RememberExplorer?.(page==='dexPage'?2:nav);tdDev1RememberDexScroll();['teamsPage','battlePage','dexPage','morePage','plannerPage','tmPage'].forEach(id=>$(id).hidden=id!==page);['teamsTab','battleTab','dexTab','moreTab'].forEach((id,i)=>$(id).classList.toggle('selected',i===nav));window.scrollTo(0,0)}
$('openPlanner').onclick=()=>{refreshTeamMenus();openTool('plannerPage',3);syncPlanner()};
$('backPlanner').onclick=()=>window.takActivate(3);
// Verified Emerald League data (standard game, NOT ROM hacks). Five or six Pokémon per trainer.
const emeraldLeague={
 Sidney:[['mightyena',46,'roar','double-edge','sand-attack','crunch'],['shiftry',48,'torment','double-team','swagger','extrasensory'],['cacturne',46,'leech-seed','feint-attack','needle-arm','cotton-spore'],['crawdaunt',48,'surf','swords-dance','strength','facade'],['absol',49,'aerial-ace','rock-slide','swords-dance','slash']],
 Phoebe:[['dusclops',48,'shadow-punch','confuse-ray','curse','protect'],['banette',49,'shadow-ball','grudge','will-o-wisp','feint-attack'],['sableye',50,'shadow-ball','double-team','night-shade','feint-attack'],['banette',49,'shadow-ball','psychic','thunderbolt','facade'],['dusclops',51,'shadow-ball','ice-beam','rock-slide','earthquake']],
 Glacia:[['sealeo',50,'encore','body-slam','hail','ice-ball'],['glalie',50,'light-screen','crunch','icy-wind','ice-beam'],['sealeo',52,'attract','double-edge','hail','blizzard'],['glalie',52,'shadow-ball','explosion','hail','ice-beam'],['walrein',53,'surf','body-slam','ice-beam','sheer-cold']],
 Drake:[['shelgon',52,'rock-tomb','dragon-claw','protect','double-edge'],['altaria',54,'double-edge','dragon-breath','dragon-dance','aerial-ace'],['kingdra',53,'smokescreen','dragon-dance','surf','body-slam'],['flygon',53,'flamethrower','crunch','dragon-breath','earthquake'],['salamence',55,'flamethrower','dragon-claw','rock-slide','crunch']],
 Wallace:[['wailord',57,'rain-dance','water-spout','double-edge','blizzard'],['tentacruel',55,'toxic','hydro-pump','sludge-bomb','ice-beam'],['ludicolo',56,'giga-drain','surf','leech-seed','double-team'],['whiscash',56,'earthquake','surf','amnesia','hyper-beam'],['gyarados',56,'dragon-dance','earthquake','hyper-beam','surf'],['milotic',58,'recover','surf','ice-beam','toxic']]
};
// V57: Version-specific verified Gym and League species/levels. Missing trainer moves are intentionally blank.
// Sources: pokemondb.net/emerald/gymleaders-elitefour,
// pokemondb.net/firered-leafgreen/gymleaders-elitefour,
// pokemondb.net/platinum/gymleaders-elitefour.
const trainerRostersV57={"Emerald":{"gym":{"Roxanne":{"v1":[["geodude",12],["geodude",12],["nosepass",15]]},"Brawly":{"v1":[["machop",16],["meditite",16],["makuhita",19]]},"Wattson":{"v1":[["voltorb",20],["electrike",20],["magneton",22],["manectric",24]]},"Flannery":{"v1":[["numel",24],["slugma",24],["camerupt",26],["torkoal",29]]},"Norman":{"v1":[["spinda",27],["vigoroth",27],["linoone",29],["slaking",31]]},"Winona":{"v1":[["swablu",29],["tropius",29],["pelipper",30],["skarmory",31],["altaria",33]]},"Tate & Liza":{"v1":[["claydol",41],["xatu",41],["lunatone",42],["solrock",42]]},"Juan":{"v1":[["luvdisc",41],["whiscash",41],["sealeo",43],["crawdaunt",43],["kingdra",46]]}}},"FireRed":{"gym":{"Brock":{"v1":[["geodude",12],["onix",14]]},"Misty":{"v1":[["staryu",18],["starmie",21]]},"Lt. Surge":{"v1":[["voltorb",21],["pikachu",18],["raichu",24]]},"Erika":{"v1":[["victreebel",29],["tangela",24],["vileplume",29]]},"Koga":{"v1":[["koffing",37],["koffing",37],["muk",39],["weezing",43]]},"Sabrina":{"v1":[["kadabra",38],["mr-mime",37],["venomoth",38],["alakazam",43]]},"Blaine":{"v1":[["growlithe",42],["ponyta",40],["rapidash",42],["arcanine",47]]},"Giovanni":{"v1":[["rhyhorn",45],["dugtrio",42],["nidoqueen",44],["nidoking",45],["rhyhorn",50]]}},"elite":{"Lorelei":{"v1":[["dewgong",52],["cloyster",51],["slowbro",52],["jynx",54],["lapras",54]],"v2":[["dewgong",64],["cloyster",63],["piloswine",63],["jynx",66],["lapras",66]]},"Bruno":{"v1":[["onix",51],["hitmonchan",53],["hitmonlee",53],["onix",54],["machamp",56]],"v2":[["steelix",65],["hitmonchan",65],["hitmonlee",65],["steelix",66],["machamp",68]]},"Agatha":{"v1":[["gengar",54],["golbat",54],["haunter",53],["arbok",56],["gengar",58]],"v2":[["gengar",66],["crobat",66],["misdreavus",65],["arbok",68],["gengar",70]]},"Lance":{"v1":[["gyarados",56],["dragonair",54],["dragonair",54],["aerodactyl",58],["dragonite",60]],"v2":[["gyarados",68],["dragonite",66],["kingdra",66],["aerodactyl",70],["dragonite",72]]},"Blue (your starter: Bulbasaur)":{"v1":[["pidgeot",59],["alakazam",57],["rhydon",59],["exeggutor",59],["gyarados",61],["charizard",63]],"v2":[["heracross",72],["alakazam",73],["tyranitar",72],["exeggutor",73],["gyarados",73],["charizard",75]]},"Blue (your starter: Charmander)":{"v1":[["pidgeot",59],["alakazam",57],["rhydon",59],["arcanine",59],["exeggutor",61],["blastoise",63]],"v2":[["heracross",72],["alakazam",73],["tyranitar",72],["arcanine",73],["exeggutor",73],["blastoise",75]]},"Blue (your starter: Squirtle)":{"v1":[["pidgeot",59],["alakazam",57],["rhydon",59],["gyarados",59],["arcanine",61],["venusaur",63]],"v2":[["heracross",72],["alakazam",73],["tyranitar",72],["gyarados",73],["arcanine",73],["venusaur",75]]}}},"Platinum":{"gym":{"Roark":{"v1":[["geodude",12],["onix",12],["cranidos",14]],"v2":[["aerodactyl",62],["probopass",61],["golem",61],["rampardos",63],["tyranitar",65]]},"Gardenia":{"v1":[["turtwig",20],["cherrim",20],["roserade",22]],"v2":[["jumpluff",61],["bellossom",61],["cherrim",62],["torterra",63],["roserade",65]]},"Fantina":{"v1":[["duskull",24],["haunter",24],["mismagius",26]],"v2":[["banette",62],["mismagius",62],["dusknoir",62],["gengar",63],["drifblim",66]]},"Maylene":{"v1":[["meditite",28],["machoke",29],["lucario",32]],"v2":[["hitmontop",62],["breloom",62],["medicham",63],["machamp",64],["lucario",66]]},"Crasher Wake":{"v1":[["gyarados",33],["quagsire",34],["floatzel",37]],"v2":[["sharpedo",61],["floatzel",63],["quagsire",63],["ludicolo",65],["gyarados",66]]},"Byron":{"v1":[["magneton",37],["steelix",38],["bastiodon",41]],"v2":[["skarmory",61],["steelix",61],["magnezone",62],["bastiodon",63],["aggron",65]]},"Candice":{"v1":[["sneasel",40],["piloswine",40],["abomasnow",42],["froslass",44]],"v2":[["weavile",62],["abomasnow",61],["mamoswine",61],["froslass",63],["glaceon",65]]},"Volkner":{"v1":[["jolteon",46],["raichu",46],["luxray",48],["electivire",50]],"v2":[["jolteon",61],["raichu",61],["luxray",62],["lanturn",63],["electivire",65]]}},"elite":{"Aaron":{"v1":[["yanmega",49],["scizor",49],["vespiquen",50],["heracross",51],["drapion",53]],"v2":[["yanmega",65],["scizor",65],["vespiquen",66],["heracross",67],["drapion",69]]},"Bertha":{"v1":[["whiscash",50],["gliscor",53],["golem",52],["rhyperior",52],["hippowdon",55]],"v2":[["whiscash",66],["gliscor",69],["golem",68],["rhyperior",71],["hippowdon",68]]},"Flint":{"v1":[["houndoom",52],["flareon",55],["rapidash",53],["infernape",55],["magmortar",57]],"v2":[["houndoom",68],["flareon",71],["rapidash",69],["infernape",71],["magmortar",73]]},"Lucian":{"v1":[["mr-mime",53],["espeon",55],["bronzong",54],["alakazam",56],["gallade",59]],"v2":[["mr-mime",69],["espeon",71],["bronzong",70],["alakazam",72],["gallade",75]]},"Cynthia":{"v1":[["spiritomb",58],["roserade",58],["togekiss",60],["lucario",60],["milotic",58],["garchomp",62]],"v2":[["spiritomb",74],["roserade",74],["togekiss",76],["lucario",76],["milotic",74],["garchomp",78]]}}},"LeafGreen":{"gym":{"Brock":{"v1":[["geodude",12],["onix",14]]},"Misty":{"v1":[["staryu",18],["starmie",21]]},"Lt. Surge":{"v1":[["voltorb",21],["pikachu",18],["raichu",24]]},"Erika":{"v1":[["victreebel",29],["tangela",24],["vileplume",29]]},"Koga":{"v1":[["koffing",37],["koffing",37],["muk",39],["weezing",43]]},"Sabrina":{"v1":[["kadabra",38],["mr-mime",37],["venomoth",38],["alakazam",43]]},"Blaine":{"v1":[["growlithe",42],["ponyta",40],["rapidash",42],["arcanine",47]]},"Giovanni":{"v1":[["rhyhorn",45],["dugtrio",42],["nidoqueen",44],["nidoking",45],["rhyhorn",50]]}},"elite":{"Lorelei":{"v1":[["dewgong",52],["cloyster",51],["slowbro",52],["jynx",54],["lapras",54]],"v2":[["dewgong",64],["cloyster",63],["piloswine",63],["jynx",66],["lapras",66]]},"Bruno":{"v1":[["onix",51],["hitmonchan",53],["hitmonlee",53],["onix",54],["machamp",56]],"v2":[["steelix",65],["hitmonchan",65],["hitmonlee",65],["steelix",66],["machamp",68]]},"Agatha":{"v1":[["gengar",54],["golbat",54],["haunter",53],["arbok",56],["gengar",58]],"v2":[["gengar",66],["crobat",66],["misdreavus",65],["arbok",68],["gengar",70]]},"Lance":{"v1":[["gyarados",56],["dragonair",54],["dragonair",54],["aerodactyl",58],["dragonite",60]],"v2":[["gyarados",68],["dragonite",66],["kingdra",66],["aerodactyl",70],["dragonite",72]]},"Blue (your starter: Bulbasaur)":{"v1":[["pidgeot",59],["alakazam",57],["rhydon",59],["exeggutor",59],["gyarados",61],["charizard",63]],"v2":[["heracross",72],["alakazam",73],["tyranitar",72],["exeggutor",73],["gyarados",73],["charizard",75]]},"Blue (your starter: Charmander)":{"v1":[["pidgeot",59],["alakazam",57],["rhydon",59],["arcanine",59],["exeggutor",61],["blastoise",63]],"v2":[["heracross",72],["alakazam",73],["tyranitar",72],["arcanine",73],["exeggutor",73],["blastoise",75]]},"Blue (your starter: Squirtle)":{"v1":[["pidgeot",59],["alakazam",57],["rhydon",59],["gyarados",59],["arcanine",61],["venusaur",63]],"v2":[["heracross",72],["alakazam",73],["tyranitar",72],["gyarados",73],["arcanine",73],["venusaur",75]]}}}};
const trainerSourceV57={Emerald:'https://pokemondb.net/emerald/gymleaders-elitefour',FireRed:'https://pokemondb.net/firered-leafgreen/gymleaders-elitefour',LeafGreen:'https://pokemondb.net/firered-leafgreen/gymleaders-elitefour',Platinum:'https://pokemondb.net/platinum/gymleaders-elitefour'};

// V63 — additional version-accurate trainer Pokémon + levels.
// Sources: https://pokemondb.net/heartgold-soulsilver/gymleaders-elitefour
//          https://pokemondb.net/diamond-pearl/gymleaders-elitefour
//          https://pokemondb.net/black-white/gymleaders-elitefour
// Moves are intentionally unknown unless individually verified.
const TAK63_VERIFIED_ROSTERS={"HeartGold":{"gym":{"Falkner":{"v1":[["pidgey",9],["pidgeotto",13]]},"Bugsy":{"v1":[["metapod",15],["kakuna",15],["scyther",17]]},"Whitney":{"v1":[["clefairy",17],["miltank",19]]},"Morty":{"v1":[["gastly",21],["haunter",21],["haunter",23],["gengar",25]]},"Chuck":{"v1":[["primeape",29],["poliwrath",31]]},"Jasmine":{"v1":[["magnemite",30],["magnemite",30],["steelix",35]]},"Pryce":{"v1":[["seel",30],["dewgong",32],["piloswine",34]]},"Clair":{"v1":[["dragonair",38],["dragonair",38],["gyarados",38],["kingdra",41]]}},"elite":{"Will":{"v1":[["xatu",40],["jynx",41],["exeggutor",41],["slowbro",41],["xatu",42]]},"Koga":{"v1":[["ariados",40],["venomoth",41],["muk",42],["forretress",43],["crobat",44]]},"Bruno":{"v1":[["hitmontop",42],["hitmonlee",42],["hitmonchan",42],["onix",43],["machamp",46]]},"Karen":{"v1":[["umbreon",42],["vileplume",42],["murkrow",44],["gengar",45],["houndoom",47]]},"Lance":{"v1":[["gyarados",44],["dragonite",49],["dragonite",49],["aerodactyl",48],["charizard",48],["dragonite",50]]}},"story":{"Red (Mt. Silver)":{"v1":[["pikachu",88],["venusaur",84],["charizard",84],["blastoise",84],["lapras",80],["snorlax",82]]}}},"SoulSilver":{"gym":{"Falkner":{"v1":[["pidgey",9],["pidgeotto",13]]},"Bugsy":{"v1":[["metapod",15],["kakuna",15],["scyther",17]]},"Whitney":{"v1":[["clefairy",17],["miltank",19]]},"Morty":{"v1":[["gastly",21],["haunter",21],["haunter",23],["gengar",25]]},"Chuck":{"v1":[["primeape",29],["poliwrath",31]]},"Jasmine":{"v1":[["magnemite",30],["magnemite",30],["steelix",35]]},"Pryce":{"v1":[["seel",30],["dewgong",32],["piloswine",34]]},"Clair":{"v1":[["dragonair",38],["dragonair",38],["gyarados",38],["kingdra",41]]}},"elite":{"Will":{"v1":[["xatu",40],["jynx",41],["exeggutor",41],["slowbro",41],["xatu",42]]},"Koga":{"v1":[["ariados",40],["venomoth",41],["muk",42],["forretress",43],["crobat",44]]},"Bruno":{"v1":[["hitmontop",42],["hitmonlee",42],["hitmonchan",42],["onix",43],["machamp",46]]},"Karen":{"v1":[["umbreon",42],["vileplume",42],["murkrow",44],["gengar",45],["houndoom",47]]},"Lance":{"v1":[["gyarados",44],["dragonite",49],["dragonite",49],["aerodactyl",48],["charizard",48],["dragonite",50]]}},"story":{"Red (Mt. Silver)":{"v1":[["pikachu",88],["venusaur",84],["charizard",84],["blastoise",84],["lapras",80],["snorlax",82]]}}},"Diamond":{"gym":{"Roark":{"v1":[["geodude",12],["onix",12],["cranidos",14]]},"Gardenia":{"v1":[["cherubi",19],["turtwig",19],["roserade",22]]},"Maylene":{"v1":[["meditite",27],["machoke",27],["lucario",30]]},"Crasher Wake":{"v1":[["gyarados",27],["quagsire",27],["floatzel",30]]},"Fantina":{"v1":[["drifblim",32],["gengar",34],["mismagius",36]]},"Byron":{"v1":[["bronzor",36],["steelix",36],["bastiodon",39]]},"Candice":{"v1":[["snover",38],["sneasel",38],["medicham",40],["abomasnow",42]]},"Volkner":{"v1":[["raichu",46],["ambipom",47],["octillery",48],["luxray",49]]}},"elite":{"Aaron":{"v1":[["dustox",53],["beautifly",53],["heracross",54],["vespiquen",54],["drapion",57]]},"Bertha":{"v1":[["quagsire",55],["whiscash",55],["golem",56],["sudowoodo",57],["hippowdon",59]]},"Flint":{"v1":[["rapidash",58],["steelix",57],["lopunny",57],["drifblim",58],["infernape",61]]},"Lucian":{"v1":[["mr-mime",59],["girafarig",59],["medicham",60],["alakazam",60],["bronzong",63]]},"Cynthia":{"v1":[["spiritomb",61],["gastrodon",60],["roserade",60],["milotic",63],["lucario",63],["garchomp",66]]}}},"Pearl":{"gym":{"Roark":{"v1":[["geodude",12],["onix",12],["cranidos",14]]},"Gardenia":{"v1":[["cherubi",19],["turtwig",19],["roserade",22]]},"Maylene":{"v1":[["meditite",27],["machoke",27],["lucario",30]]},"Crasher Wake":{"v1":[["gyarados",27],["quagsire",27],["floatzel",30]]},"Fantina":{"v1":[["drifblim",32],["gengar",34],["mismagius",36]]},"Byron":{"v1":[["bronzor",36],["steelix",36],["bastiodon",39]]},"Candice":{"v1":[["snover",38],["sneasel",38],["medicham",40],["abomasnow",42]]},"Volkner":{"v1":[["raichu",46],["ambipom",47],["octillery",48],["luxray",49]]}},"elite":{"Aaron":{"v1":[["dustox",53],["beautifly",53],["heracross",54],["vespiquen",54],["drapion",57]]},"Bertha":{"v1":[["quagsire",55],["whiscash",55],["golem",56],["sudowoodo",57],["hippowdon",59]]},"Flint":{"v1":[["rapidash",58],["steelix",57],["lopunny",57],["drifblim",58],["infernape",61]]},"Lucian":{"v1":[["mr-mime",59],["girafarig",59],["medicham",60],["alakazam",60],["bronzong",63]]},"Cynthia":{"v1":[["spiritomb",61],["gastrodon",60],["roserade",60],["milotic",63],["lucario",63],["garchomp",66]]}}},"Black":{"gym":{"Cilan (starter: Oshawott)":{"v1":[["lillipup",12],["pansage",14]]},"Chili (starter: Snivy)":{"v1":[["lillipup",12],["pansear",14]]},"Cress (starter: Tepig)":{"v1":[["lillipup",12],["panpour",14]]},"Lenora":{"v1":[["herdier",18],["watchog",20]]},"Burgh":{"v1":[["whirlipede",21],["dwebble",21],["leavanny",23]]},"Elesa":{"v1":[["emolga",25],["emolga",25],["zebstrika",27]]},"Clay":{"v1":[["krokorok",29],["palpitoad",29],["excadrill",31]]},"Skyla":{"v1":[["swoobat",33],["unfezant",33],["swanna",35]]},"Brycen":{"v1":[["vanillish",37],["cryogonal",37],["beartic",39]]},"Drayden (Black)":{"v1":[["fraxure",41],["druddigon",41],["haxorus",43]]}},"elite":{"Shauntal":{"v1":[["cofagrigus",48],["jellicent",48],["golurk",48],["chandelure",50]]},"Grimsley":{"v1":[["scrafty",48],["liepard",48],["krookodile",48],["bisharp",50]]},"Caitlin":{"v1":[["reuniclus",48],["musharna",48],["sigilyph",48],["gothitelle",50]]},"Marshal":{"v1":[["throh",48],["sawk",48],["conkeldurr",48],["mienshao",50]]},"Alder (postgame)":{"v1":[["accelgor",75],["bouffalant",75],["druddigon",75],["vanilluxe",75],["escavalier",75],["volcarona",77]]}},"story":{"N (N’s Castle — Black)":{"v1":[["zekrom",52],["carracosta",50],["vanilluxe",50],["archeops",50],["zoroark",50],["klinklang",50]]},"Ghetsis (N’s Castle)":{"v1":[["cofagrigus",52],["bouffalant",52],["seismitoad",52],["bisharp",52],["eelektross",52],["hydreigon",54]]}}},"White":{"gym":{"Cilan (starter: Oshawott)":{"v1":[["lillipup",12],["pansage",14]]},"Chili (starter: Snivy)":{"v1":[["lillipup",12],["pansear",14]]},"Cress (starter: Tepig)":{"v1":[["lillipup",12],["panpour",14]]},"Lenora":{"v1":[["herdier",18],["watchog",20]]},"Burgh":{"v1":[["whirlipede",21],["dwebble",21],["leavanny",23]]},"Elesa":{"v1":[["emolga",25],["emolga",25],["zebstrika",27]]},"Clay":{"v1":[["krokorok",29],["palpitoad",29],["excadrill",31]]},"Skyla":{"v1":[["swoobat",33],["unfezant",33],["swanna",35]]},"Brycen":{"v1":[["vanillish",37],["cryogonal",37],["beartic",39]]},"Iris (White)":{"v1":[["fraxure",41],["druddigon",41],["haxorus",43]]}},"elite":{"Shauntal":{"v1":[["cofagrigus",48],["jellicent",48],["golurk",48],["chandelure",50]]},"Grimsley":{"v1":[["scrafty",48],["liepard",48],["krookodile",48],["bisharp",50]]},"Caitlin":{"v1":[["reuniclus",48],["musharna",48],["sigilyph",48],["gothitelle",50]]},"Marshal":{"v1":[["throh",48],["sawk",48],["conkeldurr",48],["mienshao",50]]},"Alder (postgame)":{"v1":[["accelgor",75],["bouffalant",75],["druddigon",75],["vanilluxe",75],["escavalier",75],["volcarona",77]]}},"story":{"N (N’s Castle — White)":{"v1":[["reshiram",52],["carracosta",50],["vanilluxe",50],["archeops",50],["zoroark",50],["klinklang",50]]},"Ghetsis (N’s Castle)":{"v1":[["cofagrigus",52],["bouffalant",52],["seismitoad",52],["bisharp",52],["eelektross",52],["hydreigon",54]]}}}};
Object.assign(trainerRostersV57,TAK63_VERIFIED_ROSTERS);
// DEV6.1: independent B2/W2 opponent data. v1 normal, v2 normal rematch, v3 first Challenge Mode, v4 Challenge Mode rematch.
for(const g of ['Black 2','White 2']){
 const source=window.takDexB2W2?.rosters;if(!source)continue;
 trainerRostersV57[g]=Object.fromEntries(Object.entries(source).map(([cat,trainers])=>[cat,Object.fromEntries(Object.entries(trainers).map(([name,versions])=>[name,Object.fromEntries(Object.entries(versions).map(([v,rows])=>[v,rows.map(r=>[r.name,r.level,...r.moves])]))]))]));
 trainerSourceV57[g]='https://www.serebii.net/black2white2/gyms.shtml';
}
Object.assign(trainerSourceV57,{
 HeartGold:'https://pokemondb.net/heartgold-soulsilver/gymleaders-elitefour',
 SoulSilver:'https://pokemondb.net/heartgold-soulsilver/gymleaders-elitefour',
 Diamond:'https://pokemondb.net/diamond-pearl/gymleaders-elitefour',
 Pearl:'https://pokemondb.net/diamond-pearl/gymleaders-elitefour',
 Black:'https://pokemondb.net/black-white/gymleaders-elitefour',
 White:'https://pokemondb.net/black-white/gymleaders-elitefour'
});
// Verified Emerald first-challenge Gym Leader moves; roster order follows trainerRostersV57.
// Source: https://www.serebii.net/emerald/gym.shtml
const td65EmeraldGymMoves={
 'Roxanne':[['tackle','defense-curl','rock-throw','rock-tomb'],['tackle','defense-curl','rock-throw','rock-tomb'],['block','harden','tackle','rock-tomb']],
 'Brawly':[['karate-chop','low-kick','seismic-toss','bulk-up'],['focus-punch','light-screen','reflect','bulk-up'],['arm-thrust','vital-throw','reversal','bulk-up']],
 'Wattson':[['rollout','spark','self-destruct','shock-wave'],['shock-wave','leer','quick-attack','howl'],['supersonic','shock-wave','thunder-wave','sonic-boom'],['quick-attack','thunder-wave','shock-wave','howl']],
 'Flannery':[['overheat','take-down','magnitude','sunny-day'],['overheat','smog','light-screen','sunny-day'],['overheat','tackle','sunny-day','attract'],['overheat','sunny-day','body-slam','attract']],
 'Norman':[['teeter-dance','psybeam','facade','encore'],['slash','facade','encore','feint-attack'],['slash','belly-drum','facade','headbutt'],['counter','yawn','facade','feint-attack']],
 'Winona':[['perish-song','mirror-move','safeguard','aerial-ace'],['sunny-day','aerial-ace','solar-beam','synthesis'],['water-gun','supersonic','protect','aerial-ace'],['sand-attack','fury-attack','steel-wing','aerial-ace'],['earthquake','dragon-breath','dragon-dance','aerial-ace']],
 'Tate & Liza':[['earthquake','ancient-power','psychic','light-screen'],['psychic','sunny-day','confuse-ray','calm-mind'],['light-screen','psychic','hypnosis','calm-mind'],['sunny-day','solar-beam','psychic','flamethrower']],
 'Juan':[['water-pulse','attract','sweet-kiss','flail'],['rain-dance','water-pulse','amnesia','earthquake'],['encore','body-slam','aurora-beam','water-pulse'],['water-pulse','crabhammer','taunt','leer'],['water-pulse','double-team','ice-beam','rest']]
};

// V70: Platinum's exact NPC attacks are absent from the normal PokeAPI Pokémon
// records. Use community-extracted Platinum ROM trainer data rather than assuming
// a Pokémon's four most recent level-up moves are the trainer's actual moves.
// Attribution: https://github.com/OttoTonsorialist/pkmn_gen_four_trainer_data
// Cross-reference: https://www.smogon.com/forums/threads/pokemon-platinum-trainer-data.3665884/
const TD70_PLATINUM_TRAINER_SOURCE='https://raw.githubusercontent.com/OttoTonsorialist/pkmn_gen_four_trainer_data/main/platinum_trainers.json';
const TD70_PLATINUM_TRAINER_CACHE='takdex-platinum-trainer-moves-v70';
const TD70_PLATINUM_TRAINER_KEY='https://takdex.invalid/offline/platinum-trainer-moves.json';
let td70TrainerCatalogPromise=null;
function td70MoveSlug(value){return String(value||'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
async function td70PlatinumTrainerCached(){
 if(!('caches'in window))return null;
 try{
  const hit=await(await caches.open(TD70_PLATINUM_TRAINER_CACHE)).match(TD70_PLATINUM_TRAINER_KEY);
  if(!hit)return null;
  return td79Data.read(hit,payload=>payload?.schema===70&&Array.isArray(payload.trainers)&&payload.trainers.length>=13&&
   payload.trainers.every(row=>typeof row?.name==='string'&&Array.isArray(row.pokemon)&&row.pokemon.every(mon=>
    typeof mon?.name==='string'&&Number.isFinite(mon.level)&&Array.isArray(mon.moves)&&mon.moves.every(move=>typeof move==='string'))));
 }catch{return null}
}
async function td70PlatinumTrainerCatalog(){
 if(!td70TrainerCatalogPromise)td70TrainerCatalogPromise=(async()=>{
  const cached=await td70PlatinumTrainerCached();if(cached)return cached;
  const raw=await td79Data.request(TD70_PLATINUM_TRAINER_SOURCE,{},response=>response.json());
  if(!Array.isArray(raw.trainers))throw Error('Platinum trainer source has an unexpected format');
  // Save a compact, source-derived roster (not the multi-megabyte complete dataset).
  const trainers=raw.trainers.filter(t=>/^(Leader |Elite Four |Champion )/.test(t.trainer_class||'')&&Array.isArray(t.pokemon)&&t.pokemon.length>1)
   .map(t=>({name:t.trainer_class,pokemon:t.pokemon.map(m=>({name:td70MoveSlug(m.species),level:Number(m.level),moves:(m.moves||[]).slice(0,4).map(td70MoveSlug)}))}));
  const payload={schema:70,source:TD70_PLATINUM_TRAINER_SOURCE,trainers};
  if(trainers.length<13)throw Error('Platinum trainer source has too few boss rosters');
  if('caches'in window)try{await(await caches.open(TD70_PLATINUM_TRAINER_CACHE)).put(TD70_PLATINUM_TRAINER_KEY,new Response(JSON.stringify(payload),{headers:{'content-type':'application/json'}}))}
  catch(e){console.warn('Platinum trainer moves loaded online but could not be saved offline',e)}
  window.dispatchEvent(new Event('td58-pack-update'));
  return payload;
 })().catch(e=>{td70TrainerCatalogPromise=null;throw e});
 return td70TrainerCatalogPromise;
}
function td70PlatinumTrainerMoves(catalog,trainerName,roster){
 const sourceName=trainerName==='Crasher Wake'?'Leader Wake':trainerName==='Cynthia'?'Champion Cynthia':
  ['Aaron','Bertha','Flint','Lucian'].includes(trainerName)?'Elite Four '+trainerName:'Leader '+trainerName;
 const candidates=catalog.trainers.filter(t=>t.name===sourceName&&t.pokemon.length===roster.length);
 for(const entry of candidates){
  const unused=entry.pokemon.map((p,i)=>({...p,i}));
  const matches=roster.map(([name,level])=>{
   const at=unused.findIndex(p=>p.name===td70MoveSlug(name)&&p.level===Number(level));
   return at<0?null:unused.splice(at,1)[0];
  });
  if(matches.every(Boolean))return matches.map(m=>m.moves);
 }
 return null; // Distinguish unverified from a confirmed empty moveset.
}

// V68 — Additional independently checked Gen I–III gym/league rosters.
// Pokémon + levels only; move slots remain blank when the exact attacks are not confirmed.
// Sources: pokemondb.net/red-blue/gymleaders-elitefour,
// pokemondb.net/yellow/gymleaders-elitefour,
// pokemondb.net/gold-silver/gymleaders-elitefour,
// pokemondb.net/crystal/gymleaders-elitefour,
// pokemondb.net/ruby-sapphire/gymleaders-elitefour.
(function expandVerifiedRostersV68(){
 const build=raw=>Object.fromEntries(Object.entries(raw).map(([name,rows])=>[name,{v1:rows}]));
 const classicLeague={
  'Lorelei':[['dewgong',54],['cloyster',53],['slowbro',54],['jynx',56],['lapras',56]],
  'Bruno':[['onix',53],['hitmonchan',55],['hitmonlee',55],['onix',56],['machamp',58]],
  'Agatha':[['gengar',56],['golbat',56],['haunter',55],['arbok',58],['gengar',60]],
  'Lance':[['gyarados',58],['dragonair',56],['dragonair',56],['aerodactyl',60],['dragonite',62]]
 };
 const redBlueBlue={
  'Blue (your starter: Bulbasaur)':[['pidgeot',61],['alakazam',59],['rhydon',61],['exeggutor',61],['gyarados',63],['charizard',65]],
  'Blue (your starter: Charmander)':[['pidgeot',61],['alakazam',59],['rhydon',61],['arcanine',61],['exeggutor',63],['blastoise',65]],
  'Blue (your starter: Squirtle)':[['pidgeot',61],['alakazam',59],['rhydon',61],['gyarados',61],['arcanine',63],['venusaur',65]]
 };
 const redBlue={gym:trainerRostersV57.FireRed.gym,elite:build({...classicLeague,...redBlueBlue})};
 trainerRostersV57.Red=redBlue;trainerRostersV57.Blue=redBlue;
 trainerSourceV57.Red=trainerSourceV57.Blue='https://pokemondb.net/red-blue/gymleaders-elitefour';
 const yellowGym={
  'Brock':[['geodude',10],['onix',12]],'Misty':[['staryu',18],['starmie',21]],'Lt. Surge':[['raichu',28]],
  'Erika':[['tangela',30],['weepinbell',32],['gloom',32]],
  'Koga':[['venonat',44],['venonat',46],['venonat',48],['venomoth',50]],
  'Sabrina':[['abra',50],['kadabra',50],['alakazam',50]],
  'Blaine':[['ninetales',48],['rapidash',50],['arcanine',54]],
  'Giovanni':[['dugtrio',50],['persian',53],['nidoqueen',53],['nidoking',55],['rhydon',55]]
 };
 const yellowBlue={
  'Blue (Eevee → Vaporeon)':[['sandslash',61],['alakazam',59],['exeggutor',61],['ninetales',61],['magneton',63],['vaporeon',65]],
  'Blue (Eevee → Jolteon)':[['sandslash',61],['alakazam',59],['exeggutor',61],['cloyster',61],['ninetales',63],['jolteon',65]],
  'Blue (Eevee → Flareon)':[['sandslash',61],['alakazam',59],['exeggutor',61],['magneton',61],['cloyster',63],['flareon',65]]
 };
 trainerRostersV57.Yellow={gym:build(yellowGym),elite:build({...classicLeague,...yellowBlue})};
 trainerSourceV57.Yellow='https://pokemondb.net/yellow/gymleaders-elitefour';
 const gsGym={
  'Falkner':[['pidgey',7],['pidgeotto',9]],
  'Bugsy':[['metapod',14],['kakuna',14],['scyther',16]],
  'Whitney':[['clefairy',18],['miltank',20]],
  'Morty':[['gastly',21],['haunter',21],['haunter',23],['gengar',25]],
  'Chuck':[['primeape',27],['poliwrath',30]],
  'Jasmine':[['magnemite',30],['magnemite',30],['steelix',35]],
  'Pryce':[['seel',27],['dewgong',29],['piloswine',31]],
  'Clair':[['dragonair',37],['dragonair',37],['dragonair',37],['kingdra',40]],
  'Brock (Kanto)':[['graveler',41],['rhyhorn',41],['omastar',42],['kabutops',42],['onix',44]],
  'Misty (Kanto)':[['golduck',42],['quagsire',42],['lapras',44],['starmie',47]],
  'Lt. Surge (Kanto)':[['raichu',44],['electrode',40],['electrode',40],['magneton',44],['electabuzz',46]],
  'Erika (Kanto)':[['tangela',42],['victreebel',46],['jumpluff',41],['bellossom',46]],
  'Janine (Kanto)':[['crobat',36],['weezing',36],['weezing',36],['ariados',33],['venomoth',39]],
  'Sabrina (Kanto)':[['espeon',46],['mr-mime',46],['alakazam',48]],
  'Blaine (Kanto)':[['magcargo',45],['magmar',45],['rapidash',50]],
  'Blue (Kanto)':[['pidgeot',56],['alakazam',54],['rhydon',56],['gyarados',58],['exeggutor',58],['arcanine',58]]
 };
 const gsLeague={
  'Will':[['xatu',40],['jynx',41],['slowbro',41],['exeggutor',41],['xatu',42]],
  'Koga':[['ariados',40],['venomoth',41],['forretress',43],['muk',42],['crobat',44]],
  'Bruno':[['hitmontop',42],['hitmonlee',42],['hitmonchan',42],['onix',43],['machamp',46]],
  'Karen':[['umbreon',42],['vileplume',42],['murkrow',44],['gengar',45],['houndoom',47]],
  'Lance':[['gyarados',44],['dragonite',47],['charizard',46],['aerodactyl',46],['dragonite',47],['dragonite',50]]
 };
 const gs={gym:build(gsGym),elite:build(gsLeague)};
 for(const game of ['Gold','Silver','Crystal']){trainerRostersV57[game]=gs;trainerSourceV57[game]=game==='Crystal'?'https://pokemondb.net/crystal/gymleaders-elitefour':'https://pokemondb.net/gold-silver/gymleaders-elitefour'}
 const rsGym={
  'Roxanne':[['geodude',14],['nosepass',15]],'Brawly':[['machop',17],['makuhita',18]],
  'Wattson':[['magnemite',22],['voltorb',20],['magneton',23]],
  'Flannery':[['slugma',26],['slugma',26],['torkoal',28]],
  'Norman':[['slaking',28],['vigoroth',30],['slaking',31]],
  'Winona':[['swellow',31],['pelipper',30],['skarmory',32],['altaria',33]],
  'Tate & Liza':[['lunatone',42],['solrock',42]],
  'Wallace':[['luvdisc',40],['whiscash',42],['sealeo',40],['seaking',42],['milotic',43]]
 };
 const rsElite={
  'Sidney':[['mightyena',46],['cacturne',46],['shiftry',48],['sharpedo',48],['absol',49]],
  'Phoebe':[['dusclops',48],['banette',49],['banette',49],['sableye',50],['dusclops',51]],
  'Glacia':[['glalie',50],['sealeo',50],['glalie',52],['sealeo',52],['walrein',53]],
  'Drake':[['shelgon',52],['altaria',54],['flygon',53],['flygon',53],['salamence',55]],
  'Steven':[['skarmory',57],['cradily',56],['claydol',55],['armaldo',56],['aggron',56],['metagross',58]]
 };
 const rs={gym:build(rsGym),elite:build(rsElite)};
 for(const game of ['Ruby','Sapphire']){trainerRostersV57[game]=rs;trainerSourceV57[game]='https://pokemondb.net/ruby-sapphire/gymleaders-elitefour'}
})();

let plannerOpp=[],plannerOwn=[],td73PlannerSourceTeam='';
// V74 DEV4: Display the six in-game battle stats directly; base stats remain immutable.
const TD74_STAT_KEYS=['hp','attack','defense','special-attack','special-defense','speed'];
function td74StatEstimate(base,level,hp=false,iv=15){const l=Math.max(1,Math.min(100,Number(level)||50));const b=Math.max(1,Number(base)||1);return hp?Math.floor((2*b+iv)*l/100)+l+10:Math.floor((2*b+iv)*l/100)+5;}
// B2W2 Challenge trainer levels are increased after stats have been generated.
// Retain the displayed level for damage; use the original stat level and 30 IVs.
// Nature and EVs remain estimates; manual final-stat overrides take precedence.
function td74ChallengeProfile(game,version,roster){
 if(!['Black 2','White 2'].includes(game)||!['v3','v4'].includes(version))return {};
 const normal=roster?.[version==='v4'?'v2':'v1'],challenge=roster?.[version];
 if(!normal?.length||!challenge?.length)return {};
 const offset=Math.max(...challenge.map(x=>Number(x.level)))-Math.max(...normal.map(x=>Number(x.level)));
 return Number.isInteger(offset)&&offset>=1&&offset<=5?{challengeOffset:offset}:{};
}
function td74EntryStats(base,entry,adjustments=entry?.statAdjustments){
 const imported=entry?.saveStats;
 if(imported?.stats&&!imported.egg){
  const level=tdDev1Level(entry.level,imported.level);
  const at=(key,l)=>{
   if(key==='hp'&&entry.id===292)return 1;
   const term=Math.floor((2*base[key]+imported.ivs[key]+Math.floor(imported.evs[key]/4))*l/100);
   if(key==='hp')return term+l+10;
   const index=['attack','defense','speed','special-attack','special-defense'].indexOf(key);
   const up=Math.floor(imported.nature/5),down=imported.nature%5;
   return Math.floor((term+5)*(up===down?100:index===up?110:index===down?90:100)/100);
  };
  return Object.fromEntries(TD74_STAT_KEYS.map(key=>[key,Math.max(1,imported.stats[key]+
   (level===imported.level||!base?.[key]?0:at(key,level)-at(key,imported.level))+Number(adjustments?.[key]||0))]));
 }
 const offset=Number(entry?.challengeOffset),challenge=Number.isInteger(offset)&&offset>=1&&offset<=5;
 if(!challenge)return td74StatsAt(base,entry?.level,adjustments);
 const level=Math.max(1,Math.min(100,tdDev1Level(entry?.level,50)-offset));
 return Object.fromEntries(TD74_STAT_KEYS.map(k=>[k,Math.max(1,td74StatEstimate(base?.[k],level,k==='hp',30)+Number(adjustments?.[k]||0))]));
}
function td74StatsAt(base,level,adjustments={}){
 return Object.fromEntries(TD74_STAT_KEYS.map(k=>[k,Math.max(1,td74StatEstimate(base?.[k],level,k==='hp')+Number(adjustments?.[k]||0))]));
}
window.takDexBattleStatsV74={keys:TD74_STAT_KEYS,estimate:td74StatEstimate,statsAt:td74StatsAt};
const TD72_LEVELS_KEY='takdex-v72-6v6-levels';
function td77MigrateBattleProfiles(){
 try{
  const raw=localStorage.getItem(TD72_LEVELS_KEY);
  if(!raw||td70TeamRecovery)return;
  const legacy=JSON.parse(raw);
  if(!legacy||typeof legacy!=='object'||Array.isArray(legacy))return;
  const migrated=teams.map(team=>({...team,pokemon:team.pokemon.map((mon,i)=>{
   const row=legacy[team.id]?.[i];
   if(!mon||!td73SamePokemon(row,mon))return mon;
   const actual=mon.saveStats;
   const matchesSnapshot=!actual||row.saveLevel===actual.level;
   return {...mon,level:mon.level??(matchesSnapshot?row.level:actual.level),
    item:actual||mon.level!=null?mon.item??row.item??'':row.item??mon.item??'',
    statAdjustments:mon.statAdjustments??(matchesSnapshot?row.statAdjustments??{}:{})};
  })}));
  teams=migrated;
  save().then(saved=>{if(saved&&localStorage.getItem(TD72_LEVELS_KEY)===raw)localStorage.removeItem(TD72_LEVELS_KEY);});
 }catch(error){console.warn('Could not migrate saved battle profiles',error);}
}
function td77PlannerTeamRows(team){
 return Array.from({length:6},(_,i)=>{
  const mon=team?.pokemon?.[i];
  if(!mon)return {name:'',level:50,moves:[]};
  return {...mon,name:td73IdentityKey(mon),level:tdDev1Level(mon.level,mon.saveStats?.level||50),
   moves:(mon.moves||[]).map(td73MoveKey),savedMoveMeta:(mon.moves||[]).filter(m=>typeof m==='object')};
 });
}

function tdDev1Level(value,fallback=50){const v=String(value??'').trim();return /^\d+$/.test(v)?Math.max(1,Math.min(100,Number(v))):fallback;}
function trainerPresetSet(game,cat){
 if(cat==='custom')return null;
 if(cat==='elite'&&game==='Emerald')return Object.fromEntries(Object.entries(emeraldLeague).map(([n,rows])=>[n,{v1:rows,v2:rows}]));
 return trainerRostersV57[game]?.[cat]||null;
}
function plannerPresetSet(){return trainerPresetSet($('planGame').value,$('planMode').value);}
function syncPlanner(){
 refreshPlannerTeamMenu();
 const oldTrainer=$('planTrainer').value,game=$('planGame').value,mode=$('planMode').value;
 const hasElite=game==='Emerald'||Boolean(trainerRostersV57[game]?.elite);
 const hasGym=Boolean(trainerRostersV57[game]?.gym);
 const hasStory=Boolean(trainerRostersV57[game]?.story);
 const modeSelect=$('planMode');
 modeSelect.querySelector('[value="elite"]').disabled=!hasElite;
 modeSelect.querySelector('[value="gym"]').disabled=!hasGym;
 modeSelect.querySelector('[value="story"]').disabled=!hasStory;
 if((mode==='elite'&&!hasElite)||(mode==='gym'&&!hasGym)||(mode==='story'&&!hasStory))modeSelect.value=hasGym?'gym':hasElite?'elite':hasStory?'story':'custom';
 const custom=modeSelect.value==='custom',rosters=plannerPresetSet();
 $('eliteOptions').hidden=custom;
 const names=rosters?Object.keys(rosters):[];
 $('planTrainer').innerHTML=names.map(n=>`<option value="${safe(n)}">${safe(n)}</option>`).join('');
 if(names.includes(oldTrainer))$('planTrainer').value=oldTrainer;
 const selected=rosters?.[$('planTrainer').value];
 td61SyncVersionOptions(selected);
 $('planVersion').querySelector('[value="v2"]').textContent=game==='Emerald'?'Repeat League challenge (same roster)':'Rematch / second challenge';
 const source=trainerSourceV57[game];
 $('eliteNote').textContent=custom||rosters?'':'No opponent preset for this game.';
 loadPlannerRoster();importPlannerTeam();
}
function importPlannerTeam(){
 const t=selectedTeam('planTeam'),game=$('planGame').value;td73PlannerSourceTeam=t?.id||'';
 if($('planTeam').value===TD74_CUSTOM_TEAM){
  if(td74CustomPlannerGame!==game){td74CustomPlannerGame=game;td74CustomPlannerRows=Array.from({length:6},()=>({name:'',level:50,moves:[],item:''}));}
  plannerOwn=td74CustomPlannerRows;
  renderPlannerSlots('planOwn',plannerOwn,true);return;
 }
 if(t&&t.game!==game){
  $('planTeam').value='';plannerOwn=[];renderPlannerSlots('planOwn',plannerOwn,true);
  $('planResults').textContent='Only '+game+' teams can be used in a '+game+' battle.';return;
 }
 if(!t){plannerOwn=[];renderPlannerSlots('planOwn',plannerOwn,true);return}
 plannerOwn=td77PlannerTeamRows(t);
 renderPlannerSlots('planOwn',plannerOwn,true);
}
function td61SyncVersionOptions(sel){const control=$('planVersion');const options=[...control.options];for(const o of options){if(['v2','v3','v4'].includes(o.value)){o.disabled=!sel?.[o.value];o.hidden=['v3','v4'].includes(o.value)&&!sel?.[o.value];}}if(!sel?.[control.value])control.value='v1';control.disabled=!sel?.v2&&!sel?.v3&&!sel?.v4;}
let td70TrainerRosterToken=0,td77OpponentContext="";
function td79TrainerRecord(game,mode,trainer,version,[name,level,...moves],i){
  const sequel=['Black 2','White 2'].includes(game);
  const exact=sequel?window.takDexB2W2?.rosters?.[mode]?.[trainer]?.[version]?.[i]:(game==='Platinum'&&mode==='elite')?window.takDexPlatinumLeagueV77?.get(trainer,version,name):null;
  const verified=window.takDexUnovaTrainerReference?.(game,trainer,version,td51NameKey(name),level);
  const canonical=td51NameKey(name);
  const ability=window.takDexVerifiedTrainerAbility?.(game,trainer,version,canonical,level)||
   (exact&&(!exact.name||td51NameKey(exact.name)===canonical)?exact.ability:'')||'';
  const challenge=exact?td74ChallengeProfile(game,version,window.takDexB2W2?.rosters?.[mode]?.[trainer]):{};
  if(challenge.challengeOffset&&verified&&level>verified.statLevel&&level-verified.statLevel<=5)challenge.challengeOffset=level-verified.statLevel;
  const [movesSource,attacks]=[
   ['Verified Unova table',verified?.moves],['Bundled trainer variant',exact?.moves],
   ['Bundled BW moves',(game==='Black'||game==='White')?window.takDexBWTrainerMovesV76?.get(trainer,mode,version,name):null],
   ['Bundled Emerald Gym moves',game==='Emerald'&&mode==='gym'&&version==='v1'?td65EmeraldGymMoves[trainer]?.[i]:null],
   ['Bundled preset',moves]
  ].find(([,value])=>value!=null);
  const item=verified?.item??exact?.item;
  return {record:{name,level,...challenge,id:window.takDexBWCoreV75?.ids?.[name]||null,
   moves:attacks,item:item??'',ability,verifiedTrainerMoves:!!verified},
   fields:{moves:attacks.some(Boolean)?movesSource:null,ability:ability?'Bundled ability evidence':null,
    item:typeof item==='string'?(verified?'Verified Unova table':'Bundled trainer variant'):null}};

}
// Read only. Do not start a download from the coverage screen.
async function td79CoverageInventory(){
 const platinum=await td70PlatinumTrainerCached();
 const attempt=call=>Promise.resolve().then(call).catch(()=>null);
 return Promise.all(games.map(async game=>{
  const group=vg[game];
  const [bundle,stored,reference,machines]=await Promise.all([
   attempt(()=>window.takDexDB74?.inventory(game)),
   attempt(()=>window.takDexEncounterV55?.cached(game,{storedOnly:true})),
   attempt(()=>window.takDexReferenceV58?.cached(game,{verify:true})),
   attempt(()=>window.takDexReferenceV58?.machineInventory(game))
  ]);
  const usingStored=stored?.hasSource&&(stored.schema===65||!bundle?.rows);
  const encounter=usingStored?{
   rows:stored.records,groups:Object.values(stored.entries).reduce((sum,rows)=>sum+rows.length,0),
   source:'Downloaded encounter index'
  }:bundle?{rows:bundle.rows,groups:bundle.grouped,source:'Bundled PokéAPI snapshot'}:null;
  const totals={trainers:0,variants:0,entries:0,moves:0,abilities:0,items:0};
  const providers=new Set();
  for(const mode of ['gym','elite','story']){
   const category=trainerPresetSet(game,mode)||{};
   totals.trainers+=Object.keys(category).length;
   for(const [trainer,versions] of Object.entries(category)){
    for(const [version,roster] of Object.entries(versions)){
     if(!Array.isArray(roster)||!roster.length)continue;
     totals.variants++;
     const fallback=game==='Platinum'&&platinum?td70PlatinumTrainerMoves(platinum,trainer,roster):null;
     roster.forEach((entry,i)=>{
      const record=td79TrainerRecord(game,mode,trainer,version,entry,i);
      totals.entries++;
      const movesSource=record.fields.moves||(fallback?.[i]?.some(Boolean)?'Downloaded Platinum trainer source':null);
      totals.moves+=Number(!!movesSource);
      totals.abilities+=Number(!!record.fields.ability);
      totals.items+=Number(!!record.fields.item);
      for(const provider of [movesSource,record.fields.ability,record.fields.item])if(provider)providers.add(provider);
     });
    }
   }
  }
  const maps=window.takDexMapsV73?.inventory(game);
  const tutors=window.takDexTutorV73?.inventory(game);
  return {game,group,shared:games.filter(other=>other!==game&&vg[other]===group),encounter,
   downloadedEncounter:stored?.hasSource?'Saved index':stored?'Stored with no source rows':'No downloaded index',
   downloadedReference:reference?.complete?'Validated download':reference?.invalid?'Missing or invalid dependencies':reference?'Partial download':'No download',
   machines:machines?{count:machines.rows.length,source:machines.source}:null,totals,providers:[...providers],maps,tutors,
   acquisition:window.takDexAcquisitionV77?.coverage(game),progression:window.td62Progress?.coverage(game)};
 }));
}
window.takDexCoverageV79={inventory:td79CoverageInventory};
function loadPlannerRoster(){
 const request=++td70TrainerRosterToken,rosters=plannerPresetSet(),sel=rosters?.[$('planTrainer').value];
 if($('planMode').value!=='custom')td61SyncVersionOptions(sel);
 const row=sel?.[$('planVersion').value]||sel?.v1;
 const game=$('planGame').value,trainer=$('planTrainer').value,mode=$('planMode').value,version=$('planVersion').value;
 const context=game+'|'+mode;
 if(mode==='custom'&&td77OpponentContext===context)return;
 td77OpponentContext=context;
 plannerOpp=row?row.map((entry,i)=>td79TrainerRecord(game,mode,trainer,version,entry,i).record):Array.from({length:6},()=>({name:'',level:50,moves:[]}));
 renderPlannerSlots('planOpp',plannerOpp,false);
 if(mode!=='custom')$('planResults').innerHTML='';
 if(['Black 2','White 2'].includes(game)&&['v3','v4'].includes(version)&&mode!=='custom')$('eliteNote').textContent='Challenge Mode: stats use Normal Mode levels and 30 IVs; displayed levels are used for damage. Nature and EVs remain estimates.';else if(mode!=='custom')$('eliteNote').textContent='';
 if(game==='Platinum'&&mode!=='custom'&&row&&!(mode==='elite'&&version==='v2'&&window.takDexPlatinumLeagueV77?.get(trainer,version,row[0]?.[0]))){
  $('eliteNote').insertAdjacentHTML('beforeend',' <span id="td70TrainerLoadNote">Loading Platinum opponent attacks…</span>');
  td70PlatinumTrainerCatalog().then(catalog=>{
   if(request!==td70TrainerRosterToken)return;
   const verified=td70PlatinumTrainerMoves(catalog,trainer,row);
   const label=$('td70TrainerLoadNote');
   if(!verified){label?.remove();return}
   plannerOpp=plannerOpp.map((p,i)=>({...p,moves:p.moves?.some(Boolean)?p.moves:verified[i]}));
   renderPlannerSlots('planOpp',plannerOpp,false);
   label?.remove();
  }).catch(e=>{
   if(request!==td70TrainerRosterToken)return;
   const label=$('td70TrainerLoadNote');
   label?.remove();
   console.warn('Platinum exact trainer moves unavailable:',e);
  });
 }
}
function tak67PlannerValue(v){const s=String(v??'').trim();return /^(undefined|null)$/i.test(s)?'':s}
// Gen-aware held item options. Some battle effects are tactical but not included
// in approximate on-hit damage (e.g. Quick Claw, Focus Band, Leftovers).
const td74TypeItems={"Black Belt":"fighting","BlackGlasses":"dark","Charcoal":"fire","Dragon Fang":"dragon","Hard Stone":"rock","Magnet":"electric","Metal Coat":"steel","Miracle Seed":"grass","Mystic Water":"water","NeverMeltIce":"ice","Poison Barb":"poison","Sharp Beak":"flying","Silk Scarf":"normal","Soft Sand":"ground","Spell Tag":"ghost","TwistedSpoon":"psychic","Fist Plate":"fighting","Dread Plate":"dark","Flame Plate":"fire","Draco Plate":"dragon","Stone Plate":"rock","Zap Plate":"electric","Iron Plate":"steel","Meadow Plate":"grass","Splash Plate":"water","Icicle Plate":"ice","Toxic Plate":"poison","Sky Plate":"flying","Earth Plate":"ground","Spooky Plate":"ghost","Mind Plate":"psychic","Insect Plate":"bug","Odd Incense":"psychic","Rock Incense":"rock","Rose Incense":"grass","Wave Incense":"water","Sea Incense":"water","Silver Powder":"bug"};
function td74HeldItems(game){const g=gameGeneration(game);
 if(g<2)return [''];
 const core=['Choice Band','Leftovers','Shell Bell','Quick Claw','Scope Lens','BrightPowder','Sitrus Berry','Focus Band','King’s Rock'];
 const later=['Choice Specs','Choice Scarf','Life Orb','Expert Belt','Muscle Band','Wise Glasses','Focus Sash','Power Herb'];
 return ['',...core.filter(item=>g>=3||!['Choice Band','Shell Bell','Sitrus Berry'].includes(item)),...(g>=4?later:[]),...Object.keys(td74TypeItems).filter(x=>g>=4||!x.endsWith('Plate')&&!['Odd Incense','Rock Incense','Rose Incense','Wave Incense'].includes(x)&&(g>=3||x!=='Silk Scarf')),...(g>=3?['Sea Incense','Lax Incense']:[]),...(g>=4?['Full Incense','Luck Incense','Pure Incense']:[])];
}
function plannerMovesFour(e){return Array.from({length:4},(_,i)=>tak67PlannerValue(e?.moves?.[i]))}
async function td2HydrateAbilitySelect(select){if(!select?.isConnected)return;const side=select.dataset.plan,i=Number(select.dataset.i),row=(side==='own'?plannerOwn:plannerOpp)[i],name=row?.name,game=$('planGame').value;if(!name||gameGeneration(game)<3)return;try{const data=await api('pokemon/'+encodeURIComponent(row.id||td73IdentityKey(row)));if(!select.isConnected||row!==(side==='own'?plannerOwn:plannerOpp)[i]||row.name!==name||$('planGame').value!==game)return;row.abilities=historicalAbilities(data,game);row.weight=data.weight??row.weight;row.ability=td2ResolveAbility(row,row.ability);select.innerHTML=td2AbilityOptions(row,row.ability);td3UpdateAbilityDescription(select,game);}catch{if(select.isConnected&&row.name===name){const local=gameGeneration(game)===5&&window.takDexBWCoreV75?.species?.[td73IdentityKey(row)];if(local&&!row.abilities?.length){row.abilities=local.abilities;row.ability=td2ResolveAbility(row,row.ability);select.innerHTML=td2AbilityOptions(row,row.ability);td3UpdateAbilityDescription(select,game);}}}}
function renderPlannerSlots(id,entries,own){
 if(own&&$('planTeam').value!==TD74_CUSTOM_TEAM){$(id).replaceChildren();return;}
 const container=$(id),open=new Set([...container.querySelectorAll('details.td63-slot[open]')].map(d=>Number(d.dataset.i)));
 container.innerHTML=Array.from({length:6},(_,i)=>{
  const e=entries[i]||{name:'',level:50,moves:[]},pokeName=tak67PlannerValue(e.name),name=td41PokemonLabel(pokeName||'Empty slot'),lvl=Number(e.level)||50,filled=plannerMovesFour(e).filter(Boolean).length;
  if(e.name)e.ability=td2ResolveAbility(e,e.ability)||(!td2AllAbilities(e).length?e.ability||'':'');
  const nameEditor=`<div class="search td74-pokemon-search"><input data-plan="${own?'own':'opp'}" data-i="${i}" data-field="name" value="${safe(pretty(pokeName))}" placeholder="Search Pokémon" autocomplete="off" class="td66-pokemon-input"><button type="button" class="td66-pokemon-browse" data-td66-pokemon-browse aria-label="Browse Pokémon">▾</button><div class="suggestions td66-pokemon-options" hidden></div></div>`;
  const movesEditor=plannerMovesFour(e).map((m,j)=>`<div class="td65-move-slot"><span class="td65-move-number">${j+1}</span><div class="search td65-move-search"><input data-plan="${own?'own':'opp'}" data-i="${i}" data-field="move" data-move-index="${j}" autocomplete="off" placeholder="Search move ${j+1}…" value="${safe(pretty(m))}"><button type="button" class="td65-browse" data-move-browse="1" aria-label="Browse moves for slot ${j+1}">▾</button><div class="suggestions td65-move-options" hidden></div></div><button type="button" class="td65-clear" data-plan-clear="1" data-i="${i}" data-own="${own?'own':'opp'}" data-move-index="${j}" aria-label="Clear move">×</button></div>`).join('');
  return `<details class="plan-slot td63-slot" data-i="${i}" ${open.has(i)?'open':''}><summary class="td63-slot-summary"><strong>#${i+1} · <span class="td77-plain-poke-name">${safe(name)}</span></strong><span class="td74-slot-meta">${td3HeaderLevel(e,own?'own':'opp',i)}</span><span class="td63-chevron" aria-hidden="true">⌄</span></summary><div class="td63-slot-fields"><label>Pokémon${nameEditor}</label><div class="td31-item-field"><label for="td31Item-${own?'own':'opp'}-${i}">Held item</label><div class="search battle-search td74-item-search"><input id="td31Item-${own?'own':'opp'}-${i}" type="text" data-plan="${own?'own':'opp'}" data-i="${i}" data-field="item" autocomplete="off" role="combobox" aria-expanded="false" placeholder="Search held item…" value="${safe(e.item||'')}"><button type="button" class="battle-clear td74-item-clear" aria-label="Unequip held item" ${e.item?'':'hidden'}>×</button><div class="suggestions td74-item-options" hidden></div></div></div>${`<label>Known ability<select data-plan="${own?'own':'opp'}" data-i="${i}" data-field="ability">${td2AbilityOptions(e,e.ability)}</select>${td3AbilityDescriptionHtml(td2ActualAbility(e),$('planGame').value)}</label>`}<div class="td65-moves-label">Moves · 4 individual slots</div>${movesEditor}</div></details>`;
 }).join('');
 container.querySelectorAll('[data-td3-ability-description]').forEach(td3FillAbilityDescription);
 for(const select of container.querySelectorAll('select[data-field="ability"]'))if(!select.options.length||select.options.length===1&&!select.options[0].value)td2HydrateAbilitySelect(select);
}
// V72 DEV2 — one 6v6 editor row expands together at multi-column desktop widths.
// Mobile's single-column layout keeps independent controls. Use actual computed
// grid columns instead of a hard-coded viewport width so resize behaves correctly.
for(const id of ['planOwn','planOpp']){
 const host=$(id);
 host.addEventListener('click',e=>{
  const summary=e.target.closest('summary.td63-slot-summary');
  if(!summary||!host.contains(summary)||e.target.closest('.td3-header-level'))return;
  const slot=summary.closest('details.td63-slot');
  if(!slot)return;
  requestAnimationFrame(()=>{
   if(!slot.isConnected)return;
   const cols=getComputedStyle(host).gridTemplateColumns.split(' ').filter(Boolean).length;
   if(cols<=1)return;
   const slots=[...host.querySelectorAll(':scope > details.td63-slot')];
   const index=slots.indexOf(slot);if(index<0)return;
   const start=Math.floor(index/cols)*cols;
   for(const peer of slots.slice(start,start+cols))if(peer!==slot)peer.open=slot.open;
  });
 });
}
function plannerEdit(e){const x=e.target;if(!x.dataset.plan)return;const arr=x.dataset.plan==='own'?plannerOwn:plannerOpp,i=+x.dataset.i;while(arr.length<=i)arr.push({name:'',level:50,moves:[]});const field=x.dataset.field;
 if(field==='item'&&x.dataset.td31Commit!=='1')return;
 if(field==='level'&&e.type==='input'&&!/^\d{1,3}$/.test(x.value))return;
 if(field==='level'&&e.type==='input'&&(Number(x.value)<1||Number(x.value)>100))return;
 if(field==='move') {arr[i].moves=plannerMovesFour(arr[i]);arr[i].moves[Number(x.dataset.moveIndex)]=x.value.trim().toLowerCase().replace(/\s+/g,'-');}
 else {if(field==='name'&&arr[i].name!==x.value.trim().toLowerCase().replace(/\s+/g,'-')){delete arr[i].challengeOffset;arr[i].ability='';arr[i].abilities=[];arr[i].weight=null;arr[i].baseStats=null;arr[i].types=[];arr[i].id=null;arr[i].savedMoveMeta=[];const sel=x.closest('details')?.querySelector('select[data-field="ability"]');if(sel)sel.innerHTML=td2AbilityOptions(arr[i],'');}arr[i][field]=field==='level'?tdDev1Level(x.value,arr[i].level||50):field==='item'?x.value:x.value.trim().toLowerCase().replace(/\s+/g,'-');}
 if(field==='name'&&e.type==='change'){const sel=x.closest('details')?.querySelector('select[data-field="ability"]');if(sel)td2HydrateAbilitySelect(sel);}
 const slot=x.closest('.td63-slot'),summary=slot?.querySelector('.td63-slot-summary');
 if(summary){const item=arr[i],title=summary.querySelector('strong'),meta=summary.querySelector('.td74-slot-meta');
  if(title)title.innerHTML='#'+(i+1)+' · <span class="td77-plain-poke-name">'+safe(td41PokemonLabel(tak67PlannerValue(item.name)||'Empty slot'))+'</span>'; 
  if(meta){const level=meta.querySelector('[data-td2-level]');if(item.name&&!level||!item.name&&level)meta.innerHTML=td3HeaderLevel(item,x.dataset.plan,i);else if(level&&document.activeElement!==level)level.value=tdDev1Level(item.level,50);}
  if(field==='ability')td3UpdateAbilityDescription(x,$('planGame').value);
 }
}
// Lookup is restricted to exact game learnsets. Fallback to free text if no cached game records exist.
(function initPlannerMovePickerV65(){
 const dataCache=new Map();let token=0;
 const clean=s=>String(s||'').trim().toLowerCase().replace(/\s+/g,'-');
 async function validMovesFor(name,game){const k=game+':'+clean(name);if(!name)return [];
  if(!dataCache.has(k))dataCache.set(k,api('pokemon/'+encodeURIComponent(clean(name))).then(p=>p.moves.filter(m=>m.version_group_details.some(d=>d.version_group.name===vg[game])).map(m=>m.move.name).sort()).catch(()=>[]));
  return dataCache.get(k);
 }
 function closeExcept(keep){document.querySelectorAll('#plannerPage .td65-move-options').forEach(b=>{if(b!==keep)b.hidden=true})}
 async function offer(input,browse){const box=input.closest('.td65-move-search')?.querySelector('.td65-move-options');if(!box)return;
  const my=++token,arr=input.dataset.plan==='own'?plannerOwn:plannerOpp,row=arr[+input.dataset.i],game=$('planGame').value,query=clean(input.value);
  closeExcept(box);box.hidden=false;box.innerHTML='<p class="note">Loading compatible moves…</p>';
  const list=await validMovesFor(row?.name,game);if(my!==token||!box.isConnected)return;
  const hit=td78SearchMatches(list,query);const shown=hit.slice(0,browse?60:18);
  box.innerHTML=shown.length?shown.map(n=>`<button type="button" data-td65-pick="${safe(n)}">${safe(td41PokemonLabel(n))}</button>`).join('')+(hit.length>shown.length?'<p class="note">Type to narrow the list.</p>':''):'<p class="note">No verified moves for this game. Manual entry is still allowed.</p>';
 }
 const host=$('plannerPage');
 host.addEventListener('input',e=>{const x=e.target;if(x.matches('input[data-move-index][data-plan]')){if(clean(x.value).length>=1)offer(x,false);else closeExcept();}
  if(x.matches('input[data-field="name"][data-plan]')){for(const [k] of dataCache)if(k.startsWith($('planGame').value+':'))dataCache.delete(k)}
 });
 host.addEventListener('click',e=>{const browse=e.target.closest('[data-move-browse]');if(browse){const input=browse.closest('.td65-move-search').querySelector('input');offer(input,true);return}
  const pick=e.target.closest('[data-td65-pick]');if(pick){const box=pick.closest('.td65-move-options'),input=box.closest('.td65-move-search').querySelector('input');input.value=pretty(pick.dataset.td65Pick);plannerEdit({target:input});input.dispatchEvent(new Event('change',{bubbles:true}));box.hidden=true;return}
  const clear=e.target.closest('[data-plan-clear]');if(clear){const id=clear.dataset.own==='own'?'planOwn':'planOpp',input=$(id)?.querySelector(`input[data-i="${clear.dataset.i}"][data-move-index="${clear.dataset.moveIndex}"]`);if(input){input.value='';plannerEdit({target:input});input.focus()}closeExcept();return}
  if(!e.target.closest('.td65-move-search'))closeExcept();
 });
 host.addEventListener('keydown',e=>{if(e.key==='Escape'){closeExcept();return}if(e.key==='Enter'&&e.target.matches('input[data-move-index][data-plan]')){const b=e.target.closest('.td65-move-search').querySelector('.td65-move-options:not([hidden]) [data-td65-pick]');if(b){e.preventDefault();b.click()}}});
})();
function td77ItemAutocomplete(host,game,committed){
 const cleanItem=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,'');
 function syncClear(input){input.closest('.td74-item-search').querySelector('.td74-item-clear').hidden=!input.value&&!committed(input);}
 function close(keep){host.querySelectorAll('.td74-item-options').forEach(b=>{if(b===keep)return;b.hidden=true;const input=b.parentElement.querySelector('input');input.setAttribute('aria-expanded','false');input.value=committed(input);syncClear(input);});}
 function show(input,all=false){const box=input.closest('.td74-item-search')?.querySelector('.td74-item-options');if(!box)return;close(box);const q=all?'':cleanItem(input.value),options=td74HeldItems(game()),matches=options.filter(v=>!q||cleanItem(v).includes(q)).slice(0,60);box.innerHTML=matches.map(v=>`<button type="button" data-td74-item-choice="${safe(v)}">${safe(v||'None / unknown')}</button>`).join('')||'<p class="note">No matching item.</p>';box.hidden=false;input.setAttribute('aria-expanded','true');syncClear(input);}
 function choose(input,value){input.value=value;input.dataset.td31Commit='1';try{input.dispatchEvent(new Event('change',{bubbles:true}));}finally{delete input.dataset.td31Commit;}close();}
 const isItem=x=>x.matches('.td74-item-search input[data-field="item"]');
 host.addEventListener('focusin',e=>{if(isItem(e.target)){e.target.select();show(e.target,true);}});
 host.addEventListener('input',e=>{if(isItem(e.target))show(e.target);});
 host.addEventListener('click',e=>{const clear=e.target.closest('.td74-item-clear');if(clear){choose(clear.closest('.td74-item-search').querySelector('input'),'');return;}const choice=e.target.closest('[data-td74-item-choice]');if(choice){choose(choice.closest('.td74-item-search').querySelector('input'),choice.dataset.td74ItemChoice);return;}if(isItem(e.target)){if(e.target.getAttribute('aria-expanded')!=='true')show(e.target,true);return;}if(!e.target.closest('.td74-item-search'))close();});
 host.addEventListener('keydown',e=>{if(!isItem(e.target))return;if(e.key==='Escape'){e.preventDefault();close();}if(e.key==='Enter'){const first=e.target.closest('.td74-item-search').querySelector('.td74-item-options:not([hidden]) [data-td74-item-choice]');if(first){e.preventDefault();first.click();}}});
 document.addEventListener('pointerdown',e=>{if(!e.target.closest('.td74-item-search'))close();},true);
}
td77ItemAutocomplete($('plannerPage'),()=>$('planGame').value,input=>(input.dataset.plan==='own'?plannerOwn:plannerOpp)[+input.dataset.i]?.item||'');
$('planOwn').addEventListener('input',plannerEdit);$('planOpp').addEventListener('input',plannerEdit);$('planOwn').addEventListener('change',plannerEdit);$('planOpp').addEventListener('change',plannerEdit);

if(!$('planMode').querySelector('[value="gym"]'))$('planMode').querySelector('[value="elite"]').insertAdjacentHTML('beforebegin','<option value="gym">Gym Leaders</option>');
if(!$('planMode').querySelector('[value="story"]'))$('planMode').querySelector('[value="custom"]').insertAdjacentHTML('beforebegin','<option value="story">Story / Special Battles</option>');
$('planMode').parentElement.firstChild.textContent='Opponent category';
$('planVersion').parentElement.firstChild.textContent='Battle version';
$('planGame').onchange=()=>{td70PlannerRequest++;plannerOwn=[];renderPlannerSlots('planOwn',plannerOwn,true);$('planResults').textContent='Choose an opponent and analyze matchups.';syncPlanner()};$('planMode').onchange=syncPlanner;$('planTrainer').onchange=()=>{loadPlannerRoster();const note=$('eliteNote');if(note){const double=$('planMode').value==='gym'&&$('planTrainer').value==='Tate & Liza';note.dataset.double=String(double);if(double&&!note.textContent.includes('double battle'))note.insertAdjacentHTML('beforeend',' <b>Tate &amp; Liza is a double battle; planner calculations remain individual.</b>')}};$('planVersion').onchange=loadPlannerRoster;$('planTeam').onchange=()=>{const t=selectedTeam('planTeam');if(t&&t.game!==$('planGame').value){refreshPlannerTeamMenu();return}if(t)openTeam(t.id);importPlannerTeam();$('planResults').textContent='Choose an opponent and analyze matchups.'};
// V73 DEV5: load the exact Platinum gym preset straight from a map badge.
// Preserve the player's 6v6 Pokémon and levels when the game is already Platinum.
window.takDexOpenGymFromMapV73=function(trainer,mapGame='Platinum'){
 if(!trainerRostersV57[mapGame]?.gym?.[trainer])return false;
 const sameGame=$('planGame').value===mapGame;
 const owned=sameGame?plannerOwn.map(p=>({...p,moves:[...(p.moves||[])]})):null;
 $('planGame').value=mapGame;
 $('planMode').value='gym';
 $('planVersion').value='v1';
 syncPlanner();
 $('planTrainer').value=trainer;
 loadPlannerRoster();
 if(owned){plannerOwn=owned;renderPlannerSlots('planOwn',plannerOwn,true);}
 $('planResults').innerHTML='';
 openTool('plannerPage',3);
 // Existing stored 6v6 Pokémon are enough to run matchup calculations.
 if(plannerOwn.some(p=>p?.name))$('planAnalyze').click();
 return true;
};
async function loadPlannerPokemon(e,gen,game){
 const name=td73IdentityKey(e);
 const bw=gen===5?window.takDexBWCoreV75:null;
 const local=bw?.species?.[name]||bw?.species?.[td51NameKey(pretty(name))];
 let p=null,error=null;
 // Fast local battle data for independently verified species, especially online
 // connections where PokeAPI is blocked while sprite CDN requests still work.
 try{p=await api('pokemon/'+encodeURIComponent(e.id||name));}catch(err){error=err;}
 if(!p&&local&&(!e.id||Number(e.id)===Number(local.id))&&!e.baseStats){
  p={id:local.id,name,types:local.types.map((t,i)=>({slot:i+1,type:{name:t}})),
    stats:Object.entries(local.baseStats).map(([n,v])=>({stat:{name:n},base_stat:v})),
    weight:local.weight??null,abilities:local.abilities.map((a,i)=>({slot:a==='zen-mode'?3:i+1,ability:{name:a},is_hidden:a==='zen-mode'}))};
 }else if(!p&&e.baseStats&&Object.keys(e.baseStats).length===6&&Array.isArray(e.types)&&e.types.length){
  p={id:e.id||bw?.ids?.[name]||null,name,types:e.types.map((t,i)=>({slot:i+1,type:{name:t}})),
    stats:Object.entries(e.baseStats).map(([n,v])=>({stat:{name:n},base_stat:v})),abilities:e.abilities||[]};
 }else if(!p){
  try{p=await api('pokemon/'+encodeURIComponent(name));}
  catch(err){error=err;}
 }
 if(p&&(!td7PokemonAllowed(p.name,p.id,game)||(e.id&&p.id&&Number(e.id)!==Number(p.id)))){p=null;error=Error('Pokémon form unavailable in selected game');}
 if(!p){
  // One unavailable monster must not blank every other matchup. Do not invent
  // typings, stats or damage for an unverified Pokémon.
  return {name:pretty(name),canonicalName:name,sourceMoves:td73MoveSignature(e.moves),id:e.id||bw?.ids?.[name]||null,level:e.level||50,
    types:[],baseStats:null,battleStats:null,moves:[],abilities:[],heldItem:e.item||'',
    dataMissing:true,missingReason:'Pokémon reference unavailable'+(error?.message?': '+error.message:'')};
 }
 if((local||e.baseStats)&&(!e.weight||!e.abilities?.length||local)){try{const info=await api('pokemon/'+encodeURIComponent(name));if(info?.abilities){p.abilities=info.abilities;p.past_abilities=info.past_abilities;p.weight=info.weight;p.past_types=info.past_types;p.past_stats=info.past_stats;}}catch{}}
 const moves=await Promise.all((e.moves||[]).filter(Boolean).map(async move=>{
  const key=String(move?.name||move).toLowerCase().trim().replace(/\s+/g,'-');
  // Gen 5 fallback holds exact move properties only for audited moves;
  // other moves are explicitly marked unresolved, never assigned fake power.
  const known=bw?.moves?.[key];
  const saved=(e.savedMoveMeta||[]).find(m=>td73MoveKey(m)===key&&m.metaGeneration===gen&&m.historicalRevision===3&&m.historicalGame===game&&m.type&&m.damageClass&&m.power!==undefined&&m.accuracy!==undefined);
  if(saved){const next={...saved};td72MainlineCorrection(next,gen);return next;}
  try{const m=await api('move/'+encodeURIComponent(key));return {name:pretty(m.name),...moveGenerationData(m,gen,game)};}
  catch{return known?{...known,priority:['quick-attack','aqua-jet'].includes(key)?1:0}:{name:pretty(key),type:null,power:null,damageClass:null,unresolved:true};}
 }));
 const baseStats=Object.fromEntries(td76HistoricalStats(p,game).map(s=>[s.stat.name,s.base_stat]));
 const abilities=historicalAbilities(p,game);
 return {weight:p.weight??e.weight??null,id:p.id||e.id||bw?.ids?.[name],canonicalName:name,sourceMoves:td73MoveSignature(e.moves),name:pretty(p.name||name),types:historicalTypes(p,game),baseStats,
   battleStats:td74EntryStats(baseStats,e),currentHP:e.saveStats?.level===e.level?e.saveStats?.currentHP:undefined,friendship:e.saveStats?.friendship,statAdjustments:{...(e.statAdjustments||{})},
   abilities,level:e.level,moves,heldItem:e.item||'',status:td78ImportedStatus(e.saveStats,gen),
   selectedAbility:td2ResolveAbility({abilities},e.ability)||null};
}
function td78ImportedStatus(saved,gen){
 const word=saved?.statusWord;
 if(gen!==5||saved?.egg||!Number.isInteger(word)||word<0)return undefined;
 const flag=word&255;
 if(flag>=1&&flag<=7)return 'sleep';
 return ({0:'none',8:'poison',16:'burn',32:'freeze',64:'paralysis',128:'toxic',136:'toxic'})[flag];
}
function estimateDamage(a,d,m,gen,bound='min'){
 return td78DamageRolls(a,d,m,gen,bound)?.at(-1)??null;
}
const TD78_PERCENT_ROLLS=Array.from({length:16},(_,i)=>85+i);
const TD78_BYTE_ROLLS=Array.from({length:39},(_,i)=>217+i);
const td78Round=value=>Math.ceil(value-.5);
const td78ApplyModifier=(value,modifier)=>td78Round(value*modifier/4096);
function td78ChainModifiers(modifiers){
 return modifiers.reduce((total,modifier)=>Math.floor((total*modifier+2048)/4096),4096);
}
function td78DamageRolls(a,d,m,gen,bound='min',range){
 if(!a||!d||a.dataMissing||d.dataMissing||!m?.type||!['physical','special'].includes(m.damageClass)||!d.types?.length||!a.types?.length)return null;
 const report=td72AbilityReport(m,d,gen,a);
 const eff=report.effective??defensiveEffect(m,d,gen,a);
 if(eff===null||report.possibleImmune.length)return null;
 if(eff===0)return [0];
 const level=tdDev1Level(a.level,50);
 if(['Seismic Toss','Night Shade'].includes(m.name))return [level];
 if(m.name==='Dragon Rage')return [40];
 if(m.name==='Sonic Boom')return [20];
 if(m.name==='Dream Eater'&&d.status!=='sleep')return null;
 range??=td2Power(m,a,d,gen);
 if(!range)return null;
 const power=range[bound];
 if(power<=0)return [0];
 const special=m.damageClass==='special',ak=special?'special-attack':'attack',dk=special&&!['Psyshock','Psystrike','Secret Sword'].includes(m.name)?'special-defense':'defense';
 const atk=(m.name==='Foul Play'?d:a).battleStats?.[ak],def=d.battleStats?.[dk];
 if(!(atk>0&&def>0))return null;
 const stab=td2Stab(m,a,gen),offense=td2OffensiveModifier(m,a,gen,power),held=td77HeldDamage(a,d,m,gen);
 const intimidation=td77Intimidate(a,d,m,gen);
 const base=(bp,attack,defense)=>Math.floor(Math.floor((Math.floor(2*level/5)+2)*bp*attack/defense)/50)+2;
 if(gen!==5){
  // Historical fallback retains the prior maximum estimate. The sampled
  // random factors are verified, but this is not historical formula parity.
  const max=base(power,atk*intimidation*offense,Math.max(1,def))*eff*stab*held;
  return (gen<=2?TD78_BYTE_ROLLS:TD78_PERCENT_ROLLS).map(roll=>Math.max(1,Math.floor(Math.floor(max)*roll/(gen<=2?255:100))));
 }
 const item=td73MoveKey(a.heldItem),ability=td2ActualAbility(a),defenderAbility=report.knownAbility;
 const powerMods=[],attackMods=[],finalMods=[];
 if(['blaze','overgrow','torrent','swarm','huge-power','pure-power'].includes(ability)){
  if(offense!==1)attackMods.push(offense*4096);
 }else if(offense!==1)powerMods.push(offense===1.3?5325:offense===1.2?4915:offense*4096);
 if(!special&&ability==='guts'&&a.status&&a.status!=='none')attackMods.push(6144);
 if(defenderAbility==='thick-fat'&&['fire','ice'].includes(m.type))attackMods.unshift(2048);
 if(defenderAbility==='heatproof'&&m.type==='fire')powerMods.push(2048);
 if(defenderAbility==='dry-skin'&&m.type==='fire')powerMods.push(5120);
 if(item==='choice-band'||item==='choice-specs'){
  if(held>1)attackMods.push(6144);
 }else if(item==='life-orb')finalMods.push(5324);
 else if(item==='expert-belt'){if(held>1)finalMods.push(4915);}
 else if(held>1)powerMods.push(held===1.1?4505:4915);
 const types=report.base??eff;
 if(['filter','solid-rock'].includes(defenderAbility)&&types>1)finalMods.unshift(3072);
 if(defenderAbility==='multiscale'&&(!Number.isFinite(d.currentHP)||d.currentHP>=estimatedHP(d)))finalMods.unshift(2048);
 const final=td78ChainModifiers(finalMods);
 if(m.name==='Solar Beam'&&['rain','sand','hail'].includes(a.weather))powerMods.unshift(2048);
 const adjustedPower=Math.max(1,td78ApplyModifier(power,td78ChainModifiers(powerMods)));
 const attack=Math.max(1,td78ApplyModifier(Math.floor(atk*intimidation),td78ChainModifiers(attackMods)));
 const weather=a.weather;
 const rainSun=weather==='rain'||weather==='sun';
 const strengthened=weather==='rain'?'water':'fire',weakened=weather==='rain'?'fire':'water';
 const weatherMod=rainSun&&m.type===strengthened?6144:rainSun&&m.type===weakened?2048:4096;
 const sandBoost=(weather==='sand'||d.weather==='sand')&&special&&dk==='special-defense'&&d.types.includes('rock');
 const damage=td78ApplyModifier(base(adjustedPower,attack,sandBoost?td78ApplyModifier(def,6144):def),weatherMod);
 const burn=!special&&a.status==='burn'&&ability!=='guts';
 return TD78_PERCENT_ROLLS.map(roll=>{
  const typed=Math.floor(td78Round(Math.floor(damage*roll/100)*stab)*types);
  return td78Round(Math.max(1,(burn?Math.floor(typed/2):typed)*final/4096));
 });
}
function td77Intimidate(a,d,m,gen){
 if(gen<3||m.damageClass!=='physical'||m.name==='Foul Play'||td2ActualAbility(d)!=='intimidate')return 1;
 const ability=td2ActualAbility(a);
 return ['clear-body','white-smoke','hyper-cutter','full-metal-body'].includes(ability)||
  gen>=8&&['inner-focus','own-tempo','oblivious','scrappy'].includes(ability)?1:2/3;
}
function td77HeldDamage(a,d,m,gen){
 const special=m.damageClass==='special';
 const it=String(a.heldItem||'').toLowerCase().replace(/-/g,' ');let item=1;
 if(it==='life orb'&&gen>=4)item=1.3;else if(it==='choice band'&&gen>=3&&!special||it==='choice specs'&&gen>=4&&special)item=1.5;else if(it==='expert belt'&&gen>=4&&matchup(m.type,d.types,gen)>1)item=1.2;else if(it==='muscle band'&&gen>=4&&!special||it==='wise glasses'&&gen>=4&&special)item=1.1;else if(gen>=2&&Object.entries(td74TypeItems).some(([name,type])=>td73MoveKey(name).replace(/-/g,'')===it.replace(/ /g,'')&&type===m.type))item=gen>=4?1.2:1.1;
 return item;
}
function estimatedHP(p){const hp=p.baseStats?.hp||70,level=Math.max(1,Math.min(100,p.level||50));return p.battleStats?.hp||td74StatEstimate(hp,level,true)}
function plannerPotentialStab(attacker,defender,gen){
 return [...new Set(attacker.types||[])].map(t=>({type:t,mult:defensiveEffect({type:t,name:'Potential STAB',damageClass:'physical'},defender,gen,attacker)})).filter(x=>x.mult!==null);
}
let td70PlannerRequest=0;
$('planAnalyze').onclick=async()=>{const request=++td70PlannerRequest,result=$('planResults');const game=$('planGame').value,gen=gameGeneration(game);
 if(!gen){result.textContent='Choose a game before analyzing a battle.';return}
 result.textContent='Loading Pokémon and move data…';try{
 const signature=()=>JSON.stringify([plannerOwn,plannerOpp].map(rows=>rows.map(x=>[td73IdentityKey(x),x.id||null,td73MoveSignature(x.moves),x.level,x.item,x.ability,x.statAdjustments,x.challengeOffset,x.saveStats])));
 const sig=signature(),snapshot=rows=>rows.filter(x=>x.name).map(x=>({...x,moves:[...(x.moves||[])]}));
 const [own,opp]=await Promise.all([snapshot(plannerOwn),snapshot(plannerOpp)].map(rows=>Promise.all(rows.map(x=>loadPlannerPokemon(x,gen,game)))));
 if(request!==td70PlannerRequest||game!==$('planGame').value||sig!==signature())return;
 if(!own.length||!opp.length){result.textContent='Enter at least one Pokémon on each side.';return}
 result.textContent=''; // DEV5: the focused dashboard handles calculated results without 36 duplicate expanded cards.
 const missing=[...own,...opp].filter(p=>p.dataMissing).map(p=>p.name);
 if(missing.length)result.insertAdjacentHTML('afterbegin','<p class="note td75-partial-warning">Some Pokémon data could not load: '+missing.map(safe).join(', ')+'. These matchups are not ranked until reference data becomes available.</p>');
 window.dispatchEvent(new CustomEvent('td74:plan-results',{detail:{own,opp,gen,game}}));
 }catch(e){if(request===td70PlannerRequest){const msg='Battle data could not load. Check the entered Pokémon/moves and offline reference data.';result.textContent=msg;window.dispatchEvent(new CustomEvent('td74:plan-error',{detail:{message:msg}}));}}
};

// V63 — compact editor + results controls; collapsing never clears entered data.
(function installPlannerDisclosures(){
 const style=document.createElement('style');style.id='td63-disclosure-style';style.textContent=`
 #td62SmartMoves{margin-top:15px;margin-bottom:17px}
 #td62SmartMoves .td63-support-desc{font-size:.77rem;line-height:1.55;color:var(--muted);margin-top:5px}
 #td62SmartMoves .td63-support-desc b{color:var(--text,#eee)}
 #plannerPage .td63-slot{display:block;padding:0;min-width:0;overflow:hidden}
 #plannerPage .td63-slot>summary,#plannerPage .td63-opponent>summary,#plannerPage .td63-rank>summary{list-style:none;cursor:pointer;user-select:none}
 #plannerPage .td63-slot>summary::-webkit-details-marker,#plannerPage .td63-opponent>summary::-webkit-details-marker,#plannerPage .td63-rank>summary::-webkit-details-marker{display:none}
 #plannerPage .td63-slot-summary{display:flex;align-items:center;gap:7px;min-height:55px;padding:10px 12px}
 #plannerPage .td63-slot-summary>strong{flex:1;min-width:0;font-size:.91rem}
 #plannerPage .td63-slot-summary>span:not(.td63-chevron){font-size:.72rem;color:var(--muted);text-align:right;max-width:42%}
 #plannerPage .td63-slot-fields{display:grid;gap:10px;padding:0 12px 12px}
 #plannerPage .td63-chevron{font-size:1.15rem;color:var(--muted);transition:transform .17s ease;flex:0 0 auto}
 #plannerPage details[open]>summary>.td63-chevron{transform:rotate(180deg)}
 #plannerPage .td63-opponent{border:1px solid var(--edge);border-radius:12px;padding:0;margin:12px 0;overflow:hidden;background:var(--card)}
 #plannerPage .td63-opponent-heading{padding:9px 12px;display:flex;align-items:center;gap:10px;margin:0}
 #plannerPage .td63-opponent-heading>div:nth-child(3){flex:1;min-width:0}
 #plannerPage .td63-opponent-body{padding:0 10px 12px}
 #plannerPage .td63-rank{padding:0;overflow:hidden}
 #plannerPage .td63-rank>summary{padding:8px 9px;min-height:96px;align-items:center}
 #plannerPage .td63-rank .td63-chevron{margin-left:0}
 #plannerPage .td63-rank-body{padding:0 10px 12px}
 #plannerPage .td70-expanded-matchups{border-top:1px solid var(--edge);margin-top:12px;padding:10px 2px 0}
 #plannerPage .td70-expanded-matchups h4{font-size:.81rem;margin:0 0 8px}
 #plannerPage .td63-tools{display:flex;align-items:center;justify-content:flex-end;gap:7px;margin:5px 0 9px}
 #plannerPage .td63-tools button{font-size:.74rem;min-height:32px;padding:6px 9px}
 #plannerPage .td63-tools .td63-section-label{margin-right:auto;font-size:.74rem;color:var(--muted)}
 #plannerPage .td63-opponent>summary:focus-visible,#plannerPage .td63-rank>summary:focus-visible,#plannerPage .td63-slot>summary:focus-visible{outline:2px solid var(--accent,#ed3044);outline-offset:-2px}
 #plannerPage .td63-rank:not([open]){box-shadow:none}
 #plannerPage .td63-rank:not([open]) .rank-risk{align-self:center}
 #plannerPage .td64-stab{border:1px solid var(--edge);border-radius:10px;padding:9px 11px;margin-top:10px;background:color-mix(in srgb,var(--text) 3%,transparent)}
 #plannerPage .td64-stab h4{font-size:.8rem;margin:0 0 6px}

 #plannerPage .td63-rank .rank-risk{max-width:36%;min-width:0;overflow-wrap:anywhere;font-size:.72rem}
 `;document.head.appendChild(style);
 for(const [id,label] of [['planOwn','Your team'],['planOpp','Opponents']]){
  const node=document.getElementById(id);if(!node)continue;
  if(id==='planOwn')node.insertAdjacentHTML('beforebegin','<p class="note td63-level-note">Levels are saved only in the 6v6 Planner for each team. Tap a level to replace it or use − / +.</p>');
  node.insertAdjacentHTML('beforebegin',`<div class="td63-tools" data-td63-controls="${id}"><span class="td63-section-label">${label}</span><button type="button" data-td63-action="expand" data-td63-for="${id}">Expand all</button><button type="button" data-td63-action="collapse" data-td63-for="${id}">Collapse all</button></div>`);
 }
 document.getElementById('plannerPage').addEventListener('click',event=>{
  const btn=event.target.closest('[data-td63-action]');if(!btn)return;
  const host=document.getElementById(btn.dataset.td63For);if(!host)return;
  const expand=btn.dataset.td63Action==='expand';
  host.querySelectorAll('details.td63-slot,details.td63-opponent,details.td63-rank').forEach(d=>d.open=expand);
 });
})();

// TM/HM compatibility uses exact version-group machine data, not species move presence alone.
let machineEntries=[];
function machineLabel(m){return m.item.toUpperCase()+' — '+pretty(m.move)}
function setMachineResults(open){
 $('tmMoveResults').hidden=!open;
 $('tmMoveSearch').setAttribute('aria-expanded',String(open));
}
function machineMatches(q){
 const compact=q.toLowerCase().replace(/[\s-]/g,'');
 const mode=$('tmPage').dataset.machineFilter;
 const number=compact.match(/^(tm|hm|tr)?(\d+)$/);
 return machineEntries.map((m,i)=>({...m,i})).filter(m=>{
  if(mode&&mode!=='machines'&&!m.item.startsWith(mode)&&!(mode==='tm'&&m.item.startsWith('tr')))return false;
  if(!compact)return true;
  if(number)return (!number[1]||m.item.startsWith(number[1]))&&Number(m.item.slice(2))===Number(number[2]);
  return m.item.includes(compact)||m.move.replace(/-/g,'').includes(compact);
 });
}
function showMachineResults(q='',all=false){
 const results=$('tmMoveResults');const found=machineMatches(q).slice(0,all?machineEntries.length:25);
 results.innerHTML=found.map(m=>`<button type="button" data-machine="${m.i}" data-td77-machine-move="${safe(m.move)}" data-td77-move-label="${safe(machineLabel(m))}"><span class="td774-move-lines"><strong>${safe(machineLabel(m))}</strong></span></button>`).join('')||'<p class="note">No matching TM/HM</p>';
 setMachineResults(true);
 td77HydrateMoveRows(results,'td77MachineMove',$('tmGame').value);
}
function renderMachineOptions(){
 const select=$('tmMove');select.innerHTML=machineEntries.map((m,i)=>`<option value="${i}">${safe(machineLabel(m))}</option>`).join('');
 const chosen=(select.selectedIndex<0?null:machineEntries[Number(select.value)]);$('tmMoveSearch').value=chosen?machineLabel(chosen):'';
 setMachineResults(false);
}
function chooseMachine(i){if(!machineEntries[i])return;$('tmMove').value=String(i);$('tmMoveSearch').value=machineLabel(machineEntries[i]);setMachineResults(false);window.takDexMachineGuideV65?.update();$('tmCheck').click();$('tmPage').dispatchEvent(new CustomEvent('td76:machine',{detail:machineEntries[i]}));}
const machineSearch=$('tmMoveSearch');
let selectMachineOnTap=false;
machineSearch.addEventListener('focus',()=>{
 selectMachineOnTap=true;
 machineSearch.select();
 if(machineEntries.length)showMachineResults('',true);
});
machineSearch.addEventListener('click',()=>{
 if(selectMachineOnTap){machineSearch.select();selectMachineOnTap=false;}
 if($('tmMoveResults').hidden&&machineEntries.length)showMachineResults('',true);
});
machineSearch.addEventListener('input',()=>showMachineResults(machineSearch.value));
$('tmMoveResults').addEventListener('click',e=>{const b=e.target.closest('[data-machine]');if(b)chooseMachine(Number(b.dataset.machine))});
$('tmMoveSearch').addEventListener('keydown',e=>{
 if(e.key==='Escape')setMachineResults(false);
 if(e.key==='ArrowDown'){if($('tmMoveResults').hidden)showMachineResults('',true);$('tmMoveResults').querySelector('[data-machine]')?.focus();e.preventDefault()}
 if(e.key==='Enter'){const b=$('tmMoveResults').querySelector('[data-machine]');if(!$('tmMoveResults').hidden&&b){e.preventDefault();chooseMachine(Number(b.dataset.machine))}}
});
$('tmMoveResults').addEventListener('keydown',e=>{
 const buttons=[...$('tmMoveResults').querySelectorAll('[data-machine]')];
 const index=buttons.indexOf(e.target);
 if(['ArrowUp','ArrowDown'].includes(e.key)&&index>=0){
  e.preventDefault();
  buttons[index+(e.key==='ArrowDown'?1:-1)]?.focus();
 }
 if(e.key==='Escape'){machineSearch.focus();setMachineResults(false);}
});
document.addEventListener('pointerdown',e=>{if(!e.target.closest('.tm-combo'))setMachineResults(false)});
search($('tmPokemon'),$('tmPokemonResults'),name=>{$('tmPokemon').value=name;$('tmCheck').click();});
$('tmPokemon').addEventListener('focus',e=>{e.target.select()});
const emeraldMachines=`focus-punch dragon-claw water-pulse calm-mind roar toxic hail bulk-up bullet-seed hidden-power sunny-day taunt ice-beam blizzard hyper-beam light-screen protect rain-dance giga-drain safeguard frustration solar-beam iron-tail thunderbolt thunder earthquake return dig psychic shadow-ball brick-break double-team reflect shock-wave flamethrower sludge-bomb sandstorm fire-blast rock-tomb aerial-ace torment facade secret-power rest attract thief steel-wing skill-swap snatch overheat`.split(' ');
const emeraldHMs=`cut fly surf strength flash rock-smash waterfall dive`.split(' ');
let td70TMRequest=0;
const td70MachineCache=new Map(),td70MachinePending=new Map();
async function td70LoadMachineIndex(game){
 if(td70MachineCache.has(game))return td70MachineCache.get(game);
 if(td70MachinePending.has(game))return td70MachinePending.get(game);
 const promise=(async()=>{
  const bundled=await window.takDexDB74?.machines(vg[game]).catch(()=>null);if(bundled?.length){td70MachineCache.set(game,bundled);return bundled;}
  const result=[];const page=await api('machine?limit=3000');
  // The full machine endpoint is fetched once, with data records shared between game views.
  for(let i=0;i<(page.results||[]).length;i+=24){
   const batch=await Promise.all(page.results.slice(i,i+24).map(async row=>{
    try{const machine=await api(row.url.replace(API_ROOT,''));return machine.version_group.name===vg[game]?{item:machine.item.name,move:machine.move.name}:null}catch{return null}
   }));
   result.push(...batch.filter(Boolean));
  }
  const sorted=result.sort((a,b)=>a.item.localeCompare(b.item,undefined,{numeric:true}));
  td70MachineCache.set(game,sorted);return sorted;
 })().finally(()=>td70MachinePending.delete(game));
 td70MachinePending.set(game,promise);return promise;
}
async function syncTM(){
 const game=$('tmGame').value,result=$('tmResults'),request=++td70TMRequest;
 if(!games.includes(game)){
  machineEntries=[];renderMachineOptions();result.textContent='Choose a game to load TM/HM data.';return;
 }
 if(['Black 2','White 2'].includes(game)&&window.takDexB2W2?.machines?.length){machineEntries=window.takDexB2W2.machines.map(m=>({item:m.item,move:m.move}));renderMachineOptions();result.textContent='';return;}
 const cached=await window.takDexReferenceV58?.machinesFor(game)||await window.takDexDB74?.machines(vg[game]).catch(()=>null);
 if(request!==td70TMRequest||game!==$('tmGame').value)return;
 if(cached?.length){machineEntries=cached;renderMachineOptions();result.textContent='Loaded game-specific TM/HM records from your offline pack.';return}
 if((game==='Black'||game==='White')&&window.takDexUnovaV74?.machines?.length){machineEntries=window.takDexUnovaV74.machines.map(m=>({item:m.item,move:m.move}));renderMachineOptions();result.textContent='Select a Black/White TM or HM and check compatibility.';return;}
 if(['Emerald','Ruby','Sapphire','FireRed','LeafGreen'].includes(game)){
  const hms=['FireRed','LeafGreen'].includes(game)?emeraldHMs.slice(0,7):emeraldHMs;
  machineEntries=[...emeraldMachines.map((move,i)=>({item:'tm'+String(i+1).padStart(2,'0'),move})),...hms.map((move,i)=>({item:'hm'+String(i+1).padStart(2,'0'),move}))];
  renderMachineOptions();result.textContent='Select a machine and check compatibility.';return;
 }
 result.textContent='Loading game-specific machines… Download the offline pack for faster lookups.';
 try{
  const found=await td70LoadMachineIndex(game);
  if(request!==td70TMRequest||game!==$('tmGame').value)return;
  machineEntries=found;renderMachineOptions();result.textContent=found.length?'Select a machine and check compatibility.':'No machine data found for this game.';
 }catch(e){if(request===td70TMRequest)result.textContent='Could not load machine data. Download Offline Data for this game and retry.'}
}
$('tmGame').onchange=syncTM;$('tmTeam').onchange=()=>{const t=selectedTeam('tmTeam');if(t)openTeam(t.id);syncTM()};
let tak67TMCheckRequest=0;
$('tmCheck').onclick=async()=>{const request=++tak67TMCheckRequest;const game=$('tmGame').value;if(!games.includes(game)){$('tmResults').textContent='Choose a game first.';return}const item=($('tmMove').selectedIndex<0?null:machineEntries[Number($('tmMove').value)]),t=selectedTeam('tmTeam'),individual=$('tmPokemon').value.trim().toLowerCase().replace(/\s+/g,'-');if(!item)return;const names=individual?[individual]:(t?.pokemon||[]).filter(Boolean).map(p=>p.name.toLowerCase().replace(/\s+/g,'-'));if(!names.length){$('tmResults').innerHTML='<h3>'+safe(item.item.toUpperCase())+' · '+safe(pretty(item.move))+'</h3><p class="note">Select a team or enter a Pokémon to check compatibility. Acquisition details are available above under Where to get it.</p>';return}const result=$('tmResults');if(t&&!individual){result.innerHTML='';const bar=$('td74TMTeamBar');if(!bar)return;bar.hidden=false;bar.dataset.team=String(t.id);bar.dataset.game=game;const mons=t.pokemon||[];const render=checks=>{bar.innerHTML='<div class="td74-strip-heading"><strong>Selected team</strong></div><div id="td5TMStrip" class="td74-mon-row">'+td51CompatTiles(mons,checks,item.move,true,item.item)+'</div>'};render([]);const values=await Promise.all(mons.map(m=>m?td51CompatCheck(m,game,true,true):null));if(request===tak67TMCheckRequest&&bar.isConnected&&game===$('tmGame').value&&selectedTeam('tmTeam')?.id===t.id&&!$('tmPokemon').value.trim())render(values);return}if($('td74TMTeamBar'))$('td74TMTeamBar').hidden=true;result.textContent='Checking exact game compatibility…';const checks=await Promise.all(names.map(async name=>{
 const check=await td51CompatCheck({name},game,true,true);
 const status=check.direct.has(item.move)?'now':check.later.has(item.move)?'later':check.unknown?'unknown':'never';
 return {name:pretty(name),status,method:(status==='now'?check.methods:check.laterMethods)?.get(item.move)};
}));if(request!==tak67TMCheckRequest||game!==$('tmGame').value)return;
 const labels={now:'✓ Compatible',later:'↑ After evolution',unknown:'Unknown',never:'✕ Cannot learn'};
 result.innerHTML=`<h3>${safe(machineLabel(item))}</h3>${checks.map(x=>`<div class="card tm-result td5-tm-${x.status}"><strong>${safe(x.name)}</strong> <b>${labels[x.status]}</b>${x.method?` <small>${safe(x.method)}</small>`:''}</div>`).join('')}`;
};
refreshTeamMenus();
// refresh after team creation/edit without changing existing behavior
const previousShowTeams=showTeams;showTeams=function(){previousShowTeams();refreshTeamMenus()};

// V18: select existing opponent text on focus; clear in one tap without deleting character-by-character.
for(const id of ['foeInput','foeInput2']){
 const field=$(id),clear=document.querySelector(`[data-clear-opponent="${id}"]`);
 const update=()=>{clear.hidden=!field.value};
 field.addEventListener('focus',()=>{if(field.value)field.select();update()});
 field.addEventListener('click',()=>{if(field.value)field.select()});
 field.addEventListener('input',update);
 clear.addEventListener('pointerdown',e=>e.preventDefault());
 clear.addEventListener('click',()=>{field.value='';field.dispatchEvent(new Event('input',{bubbles:true}));if(id==='foeInput')foe=null;else foe2=null;showBattle();field.focus();update()});
 update();
}

// V26: resumable complete PokéAPI data download. No full-offline claim until verified.
(function(){
 const btn=document.getElementById('offlineDownload'), status=document.getElementById('offlineStatus');
 const key='takdex-offline-full-v26';
 const origin='https://pokeapi.co/api/v2/';
 const art='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';
 let busy=false;
 const progress=()=>{let p=null;try{p=JSON.parse(localStorage.getItem(key)||'null')}catch{}
  status.textContent=p?.complete?'🟢 Offline records downloaded · '+new Date(p.date).toLocaleDateString():p?.done?'🔵 Partial database · '+p.done+' / '+p.total+' files. Tap to resume.':'⚪ Offline database not downloaded';
  btn.textContent=p?.complete?'Update offline database':p?.done?'Resume offline download':'Download offline database';
 };
 const download=async url=>{
  const library=url.startsWith(origin),cache=await caches.open(library?OFFLINE_CACHE:'takdex-artwork-v26');
  if(library)return td79Data.ensure(cache,url,data=>td79Data.apiShape(url.slice(origin.length),data));
  const valid=r=>r?.ok&&/^image\//i.test(r.headers.get('content-type')||'');
  if(valid(await cache.match(url)))return;
  await td79Data.request(url,{cache:'no-store'},async response=>{
   if(!valid(response)||!(await response.clone().blob()).size)throw Error('Invalid artwork response');
   await cache.put(url,response);
  });
 };
 const getList=async path=>(await download(origin+path)).results;
 btn.addEventListener('click',async()=>{
  if(busy)return;
  if(!('caches' in window)){status.textContent='Offline storage unsupported';return}
  busy=true;btn.disabled=true;
  try{
   status.textContent='Getting complete Pokémon, move, species and machine lists…';
   const lists=['pokemon?limit=2000','move?limit=2000','pokemon-species?limit=2000','evolution-chain?limit=1000','machine?limit=3000'];
   const results=await Promise.all(lists.map(getList));
   const paths=new Set(lists);
   results.forEach((list,i)=>list.forEach(item=>{const path=item.url.replace(origin,'');if(path!==item.url)paths.add(path)}));
   // Explicitly include machine details for every supported game/version group.
   const urls=[...paths].map(p=>origin+p);
   // Artwork is a separate cache, and is served by the service worker while offline.
   for(const item of results[0]){const id=item.url.match(/\/(\d+)\/$/)?.[1];if(id)urls.push(art+id+'.png')}
   let done=0,failed=0;const failures=[];let next=0;
   const update=()=>{status.textContent=`Downloading ${done} / ${urls.length} · ${failed} failed`;if(done%30===0)localStorage.setItem(key,JSON.stringify({complete:false,done,total:urls.length,date:new Date().toISOString()}))};
   const worker=async()=>{while(next<urls.length){const url=urls[next++];try{await download(url)}catch(e){failed++;failures.push(url)}done++;if(done%5===0||done===urls.length)update()}};
   await Promise.all(Array.from({length:5},worker));
   const complete=failed===0;
   localStorage.setItem(key,JSON.stringify({complete,done,total:urls.length,failed,date:new Date().toISOString()}));
   if(complete){progress()}else{status.textContent=`🟠 ${done-failed} / ${urls.length} cached · ${failed} failed. Tap to retry.`;btn.textContent='Retry incomplete download'}
  }catch(e){status.textContent='⚠ Download paused: '+(e?.message||'network/storage error')+' · retry when online';progress()}
  finally{busy=false;btn.disabled=false}
 });
 progress();
})();


// V40 — Type Matchup Checker (added without modifying existing battle features).
(function initTypeChecker(){
 const more=document.getElementById('morePage');
 if(!more || document.getElementById('typeCheckerPage'))return;
 const trigger=document.createElement('button');
 trigger.type='button';trigger.id='openTypeChecker';trigger.className='tool-link';
 trigger.textContent='◈ Type Matchup Checker ›';
 const toolGroup=more.querySelector('.tool-card');
 if(toolGroup)toolGroup.appendChild(trigger);else more.appendChild(trigger);
 const page=document.createElement('section');page.id='typeCheckerPage';page.hidden=true;
 page.innerHTML=`<div class="bar"><h2>Type Matchup Checker</h2><button type="button" id="backTypeChecker">← More</button></div>
 <div class="tool-card"><label>Game<select id="typeCheckGame"></select></label>
 <div class="tc-picker-label">Select up to two types <span id="tcSelectionCount">(0/2)</span></div>
 <div id="typeCheckGrid" class="tc-type-grid td72-move-types" role="group" aria-label="Select up to two Pokémon types"></div></div>
 <div id="typeCheckResults" aria-live="polite"></div>`;
 document.querySelector('main').appendChild(page);
 const css=document.createElement('style');css.textContent=`
 #typeCheckerPage .tc-picker-label{font-weight:700;margin:12px 0 10px}
 #typeCheckerPage .tc-picker-label span{opacity:.7;font-weight:500}
 #typeCheckerPage .tc-type-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
 #typeCheckerPage .tc-type-button{min-width:0;min-height:42px;border:2px solid transparent;border-radius:9px;background:var(--type-color);color:#fff;font-weight:800;font-size:.82rem;letter-spacing:.02em;text-shadow:0 1px 3px rgba(0,0,0,.6);box-shadow:inset 0 -2px 0 rgba(0,0,0,.15);cursor:pointer;opacity:.76;transition:opacity .15s,border-color .15s,transform .15s}
 #typeCheckerPage .tc-type-button[aria-pressed="true"]{opacity:1;border-color:var(--text,#fff);box-shadow:0 0 0 2px var(--type-color),0 2px 9px rgba(0,0,0,.22);transform:translateY(-1px)}
 #typeCheckerPage .tc-type-button:focus-visible{outline:3px solid var(--type-color);outline-offset:3px}
 #typeCheckerPage .tc-type-button:disabled{opacity:.24;cursor:not-allowed}
 @media(min-width:580px){#typeCheckerPage .tc-type-grid{grid-template-columns:repeat(6,minmax(0,1fr))}}
 #typeCheckerPage .tc-group{margin:12px 0 20px}
 #typeCheckerPage .tc-group h3{margin:0 0 9px;font-size:1rem}
 #typeCheckerPage .tc-chips{display:flex;flex-wrap:wrap;gap:7px}
 #typeCheckerPage .tc-chip{display:inline-flex;align-items:center;gap:6px;padding:7px 10px;border-radius:9px;background:var(--card-bg,rgba(125,125,125,.1));border:1px solid rgba(140,140,140,.25);font-weight:600}
 #typeCheckerPage .tc-chip small{opacity:.8}
 #typeCheckerPage .tc-explain{line-height:1.5}
 `;document.head.appendChild(css);
 const g=document.getElementById('typeCheckGame'),grid=document.getElementById('typeCheckGrid'),count=document.getElementById('tcSelectionCount'),results=document.getElementById('typeCheckResults');
 g.innerHTML=games.map(x=>`<option value="${safe(x)}">${safe(x)}</option>`).join('');
 g.value='';
 const allTypes=Object.keys(chart);
 let selected=[];
 const typesForGen=gen=>allTypes.filter(t=>gen>=6||t!=='fairy').filter(t=>gen>=2||(t!=='dark'&&t!=='steel'));
 const chip=(t,m)=>`<span class="tc-chip">${pill(t)} <small>${effectText(m)}</small></span>`;
 function group(title,items,empty='None'){
  return `<div class="tc-group"><h3>${title}</h3><div class="tc-chips">${items.length?items.map(x=>chip(x.t,x.m)).join(''):`<span class="note">${empty}</span>`}</div></div>`;
 }
 function render(){
  const gen=gameGeneration(g.value);
  if(!gen){selected=[];count.textContent='(0/2)';grid.innerHTML='<p class="note">Choose game to view type matchups.</p>';results.innerHTML='';return}
  const valid=typesForGen(gen);
  selected=selected.filter(t=>valid.includes(t)).slice(0,2);
  count.textContent=`(${selected.length}/2)`;
  grid.innerHTML=allTypes.map(t=>{
   const active=selected.includes(t),available=valid.includes(t);
   return `<button type="button" class="tc-type-button ${active?'selected':''}" data-tc-type="${t}" style="--type-color:${colors[t]};--td72-color:${colors[t]}" aria-pressed="${active}" ${available?'':'disabled'}>${pretty(t)}</button>`;
  }).join('');
  if(!selected.length){results.innerHTML='<article class="card"><p class="note">Tap a type above to see its matchups.</p></article>';return;}
  const defense=valid.map(t=>({t,m:matchup(t,selected,gen)}));
  // Offensive results describe either selected type used individually, not a combined attack.
  const offense=selected.map(t=>({type:t,rows:valid.map(d=>({t:d,m:matchup(t,[d],gen)}))}));
  const select=(rows,test)=>rows.filter(x=>test(x.m)).sort((a,b)=>a.t.localeCompare(b.t));
  const defenseExplanation=selected.length===1
   ? `When a ${pretty(selected[0])}-type Pokémon is attacked, damage depends on the attacking move's type.`
   : `When a ${selected.map(pretty).join(' / ')}-type Pokémon is attacked, the effectiveness multipliers for both defending types combine.`;
  const multiplierLabel=(rows,filter)=>[...new Set(rows.filter(x=>filter(x.m)).map(x=>effectText(x.m)))].sort((a,b)=>parseFloat(b)-parseFloat(a)).join(' / ');
  results.innerHTML=`<article class="card"><h3>Defensive matchups</h3><p class="note tc-explain">${defenseExplanation}</p>
   ${group(`Weak to · ${multiplierLabel(defense,m=>m>1)||'None'}`,select(defense,m=>m>1))}
   ${group(`Resists · ${multiplierLabel(defense,m=>m>0&&m<1)||'None'}`,select(defense,m=>m>0&&m<1))}
   ${group('Immune · 0×',select(defense,m=>m===0))}
   <details><summary>Neutral incoming attacks</summary>${group('Normal damage · 1×',select(defense,m=>m===1))}</details>
  </article>
  <article class="card"><h3>Offensive matchups</h3><p class="note tc-explain">Each move has one attacking type. These results show which single-type opponents each of your selected STAB types hits super effectively; dual-type opponents can have different multipliers.</p>
  ${offense.map(o=>`<h3>${pill(o.type)} attacks</h3>
  ${group('Strong against · 2×',select(o.rows,m=>m>1))}
  ${group('Not very effective · ½×',select(o.rows,m=>m>0&&m<1))}
  ${group('No effect · 0×',select(o.rows,m=>m===0))}`).join('')}</article>
  <p class="note tc-explain">Type chart only: abilities (such as Levitate), items, weather, Terastallization and move-specific exceptions can change the result. Generation-specific type rules are used for the selected game. STAB usually boosts a same-type attack by 1.5×, but does not change type effectiveness.</p>`;
 }
 g.addEventListener('change',render);
 grid.addEventListener('click',event=>{
  const button=event.target.closest('button[data-tc-type]');
  if(!button||button.disabled)return;
  const t=button.dataset.tcType;
  if(selected.includes(t))selected=selected.filter(x=>x!==t);
  else if(selected.length<2)selected.push(t);
  else return;
  render();
 });
 function hide(){page.hidden=true}
 ['teamsTab','battleTab','dexTab','moreTab','openPlanner','backPlanner'].forEach(id=>document.getElementById(id)?.addEventListener('click',hide,true));
 trigger.addEventListener('click',()=>{
  document.querySelectorAll('main > section').forEach(el=>el.hidden=el!==page);
  document.querySelectorAll('.main-tabs button').forEach(b=>b.classList.toggle('selected',b.id==='moreTab'));
  selected=[];page.hidden=false;render();window.scrollTo(0,0);
 });
 document.getElementById('backTypeChecker').addEventListener('click',()=>{hide();window.takActivate(3)});
 render();
})();


// V65 — acquisition guidance lives ONLY in the TM/HM Checker, not Smart Move Advisor.
// Curated locations from Smogon (Emerald/Platinum), Pokémon Database (FRLG).
(function initMachineAcquisitionV65(){
 const emeraldTM=`Route 115|Meteor Falls · needs Surf and Waterfall|Sootopolis Gym · defeat Juan|Mossdeep Gym · defeat Tate & Liza|Route 114 · NPC gift|Fiery Path · needs Strength|Shoal Cave|Dewford Gym · defeat Brawly|Route 104 · NPC gift|Fortree City · coin-hand NPC; also Slateport market|Scorched Slab · needs Surf|Trick House · fifth challenge|Abandoned Ship · Storage Key; or Mauville Game Corner (4,000 coins)|Lilycove Dept. Store · ₽5,500|Lilycove Dept. Store · ₽7,500|Lilycove Dept. Store · ₽3,000|Lilycove Dept. Store · ₽3,000|Abandoned Ship · Dive needed|Route 123 · NPC gift|Lilycove Dept. Store · ₽3,000|Pacifidlog Town · low friendship gift|Safari Zone · Mach Bike area|Meteor Falls|Wattson · finish New Mauville; or Game Corner (4,000 coins)|Lilycove Dept. Store · ₽5,500|Seafloor Cavern · Dive, Surf, Strength, Rock Smash|Fallarbor Town · return Meteorite to Prof. Cozmo; Pacifidlog friendship gift|Route 114 · Fossil Maniac's house|Victory Road; or Game Corner (3,500 coins)|Mt. Pyre · upper floors|Sootopolis City · NPC gift|Route 113 · hidden; or Game Corner|Lilycove Dept. Store · ₽3,000|Mauville Gym · defeat Wattson|Mauville Game Corner · 4,000 coins|Dewford Town · NPC gift after Norman|Route 111 desert · Go-Goggles|Lilycove Dept. Store · ₽5,500|Rustboro Gym · defeat Roxanne|Fortree Gym · defeat Winona|Slateport Battle Tent · NPC gift|Petalburg Gym · defeat Norman|Route 111 · NPC gift; also Slateport market|Lilycove City · house near Move Deleter|Verdanturf Battle Tent · prize|Slateport City · NPC gift|Granite Cave · NPC gift|Mt. Pyre|S.S. Tidal|Lavaridge Gym · defeat Flannery`.split('|');
 const emeraldHM=`Rustboro City · Cutter's House|Route 119 · rival battle after Weather Institute|Petalburg City · Wally's family, after Norman|Rusturf Tunnel · clear rocks with Rock Smash|Granite Cave · Hiker gift|Mauville City · NPC house|Sootopolis City · Wallace after Rayquaza|Mossdeep City · Steven's house`.split('|');
 const platinum={
  tm01:"Oreburgh Gate B1F · Surf, Strength, Rock Smash",
  tm02:"Mt. Coronet summit route · Rock Climb",
  tm03:"Ravaged Path northeast · Surf, Rock Smash",
  tm04:"Battle Frontier · 48 BP · postgame",
  tm05:"Route 213 northwest cliffs · Rock Climb",
  tm06:"Route 212 southeast swamp; Battle Frontier · 32 BP",
  tm07:"Route 217 · snow near Hiker house",
  tm08:"Battle Frontier · 48 BP · postgame",
  tm09:"Route 204 northwest",
  tm10:"Veilstone Game Corner · 6,000 coins",
  tm11:"Route 212 · west of Pokémon Mansion · Cut or Surf",
  tm12:"Route 211 · southern bridge · Rock Smash",
  tm13:"Route 216 · Rock Climb; Veilstone Game Corner · 10,000 coins",
  tm14:"Lake Acuity · Surf, Rock Climb; Veilstone Dept. Store · ₽5,500",
  tm15:"Veilstone Department Store 3F · ₽7,500",
  tm16:"Veilstone Department Store 3F · ₽2,000",
  tm17:"Veilstone Department Store 3F · ₽2,000",
  tm18:"Route 223 · small Surf-access island",
  tm19:"Route 209 · Surf to hidden patch of land",
  tm20:"Veilstone Department Store 3F · ₽2,000",
  tm21:"Galactic Warehouse/HQ; Veilstone Game Corner · 8,000 coins",
  tm22:"Veilstone Department Store 3F · ₽3,000",
  tm23:"Iron Island B2F · east cave section",
  tm24:"Valley Windworks · Surf behind building; Veilstone Game Corner · 10,000 coins",
  tm25:"Lake Valor · Surf; Veilstone Dept. Store · ₽5,500",
  tm26:"Wayward Cave · hidden Cycling Road entrance; Battle Frontier · 80 BP",
  tm27:"Prof. Rowan in Sandgem; Lost Tower 4F; Veilstone Game Corner · 8,000 coins",
  tm28:"Ruin Maniac Tunnel · Route 214 entrance",
  tm29:"Route 211 (Celestic side) · Rock Climb, Rock Smash; Veilstone Game Corner · 10,000 coins",
  tm30:"Route 210 foggy section · bike logs; Battle Frontier · 64 BP",
  tm31:"Oreburgh Gate B1F; Battle Frontier · 40 BP",
  tm32:"Wayward Cave main entrance; Veilstone Game Corner · 4,000 coins",
  tm33:"Veilstone Department Store 3F · ₽2,000",
  tm34:"Route 215 · southern area",
  tm35:"Fuego Ironworks · inside; Veilstone Game Corner · 10,000 coins",
  tm36:"Galactic Warehouse; Battle Frontier · 80 BP",
  tm37:"Route 228 · central sandstorm area",
  tm38:"Lake Verity · Surf; Veilstone Dept. Store · ₽5,500",
  tm39:"Ravaged Path · western rocks · Rock Smash",
  tm40:"Route 213 · near Dr. Footstep · Rock Smash; Battle Frontier · 40 BP",
  tm41:"Victory Road · first floor",
  tm42:"Survival Area · house in southern part",
  tm43:"Amity Square · southern section",
  tm44:"Veilstone Game Corner · 6,000 coins; Pickup",
  tm45:"Amity Square; Battle Frontier · 32 BP",
  tm46:"Eterna City · by Galactic Building · Cut",
  tm47:"Route 209 · near Lost Tower · Cut",
  tm48:"Canalave City · resident near Route 218",
  tm49:"Galactic Warehouse · Storage Key required",
  tm50:"Stark Mountain · main cavern · Strength",
  tm51:"Route 210 · gift from girl on hill",
  tm52:"Veilstone Department Store 3F · ₽5,500",
  tm53:"Route 226 · Rock Climb; Battle Frontier · 64 BP",
  tm54:"Veilstone Department Store 3F · ₽2,000",
  tm55:"Pastoria Gym · defeat Crasher Wake",
  tm56:"Route 222 · gift from man on hill",
  tm57:"Sunyshore Gym · defeat Volkner",
  tm58:"Veilstone Game Corner · 2,000 coins",
  tm59:"Victory Road · waterfall area; Battle Frontier · 80 BP",
  tm60:"Veilstone Gym · defeat Maylene",
  tm61:"Battle Frontier · 32 BP · postgame",
  tm62:"Route 212 · platform near fishermen",
  tm63:"Veilstone City · gift near Pokémon Center",
  tm64:"Veilstone Game Corner · bonus-round reward",
  tm65:"Hearthome Gym · defeat Fantina",
  tm66:"Route 215 · gift from Black Belt",
  tm67:"Eterna Condominiums 2F · elderly resident",
  tm68:"Veilstone Game Corner · 20,000 coins",
  tm69:"Mt. Coronet · Route 211 entrance · Strength, Rock Smash",
  tm70:"Oreburgh Gate B1F; Veilstone Dept. Store · ₽1,000",
  tm71:"Victory Road · bike ramp area; Battle Frontier · 80 BP",
  tm72:"Snowpoint Gym · defeat Candice",
  tm73:"Battle Frontier · 32 BP · postgame",
  tm74:"Veilstone Game Corner · 15,000 coins",
  tm75:"Veilstone Game Corner · 4,000 coins",
  tm76:"Oreburgh Gym · defeat Roark",
  tm77:"Route 211 · gift from trainer",
  tm78:"Route 204 northeast · Cut",
  tm79:"Victory Road 2F · Strength, Rock Climb",
  tm80:"Mt. Coronet 2F · Surf, Rock Climb",
  tm81:"Route 221; Battle Frontier · 64 BP",
  tm82:"Eterna Forest exterior · Cut",
  tm83:"Veilstone Department Store · ₽2,000",
  tm84:"Route 212 · swamp area · Surf",
  tm85:"Valor Lakefront · Rock Climb",
  tm86:"Eterna Gym · defeat Gardenia",
  tm87:"Pokémon Mansion · Mr. Backlot’s office",
  tm88:"Floaroma Town · gift from girl in house",
  tm89:"Canalave City · Surf southwest; Veilstone Game Corner · 6,000 coins",
  tm90:"Old Chateau 2F; Veilstone Game Corner · 2,000 coins",
  tm91:"Canalave Gym · defeat Byron",
  tm92:"Route 213 · gift from Clown near hotel",
  hm01:"Eterna City · Cynthia after defeating Gardenia · Forest Badge to use",
  hm02:"Veilstone Galactic Warehouse · after Maylene · Cobble Badge to use",
  hm03:"Celestic Town ruins · Cynthia’s grandmother · Fen Badge to use",
  hm04:"Iron Island · Riley after exploring together · Mine Badge to use",
  hm05:"Solaceon Ruins · deepest floor · Relic Badge to use",
  hm06:"Oreburgh Gate · first-visit Hiker gift · Coal Badge to use",
  hm07:"Sunyshore City · Jasmine after Volkner · Beacon Badge to use",
  hm08:"Route 217 · near Hiker house · Icicle Badge to use",
 };
 const frlg={tm03:'Cerulean Gym · defeat Misty',tm04:'Saffron Gym · defeat Sabrina',tm06:'Fuchsia Gym · defeat Koga',tm13:'Celadon Game Corner · 4,000 coins',tm24:'Celadon Game Corner · 4,000 coins',tm26:'Viridian Gym · defeat Giovanni',tm28:'Cerulean City · robbed house; or Celadon Department Store',tm29:'Saffron City · Mr. Psychic',tm30:'Celadon Game Corner · 4,500 coins',tm31:'S.S. Anne; or Celadon Department Store',tm35:'Celadon Game Corner · 4,000 coins',tm39:'Pewter Gym · defeat Brock',tm19:'Celadon Gym · defeat Erika',tm34:'Vermilion Gym · defeat Lt. Surge',tm44:'Route 9'};
 const reference={Emerald:'https://www.smogon.com/ingame/guides/emerald_itemlocations',Platinum:'https://www.smogon.com/ingame/guides/plat-tms',FireRed:'https://pokemondb.net/firered-leafgreen/tms',LeafGreen:'https://pokemondb.net/firered-leafgreen/tms',Black:'https://bulbapedia.bulbagarden.net/wiki/List_of_TM_and_HM_locations_in_Generation_V',White:'https://bulbapedia.bulbagarden.net/wiki/List_of_TM_and_HM_locations_in_Generation_V'};
 reference['Black 2']=reference['White 2']='https://pokemondb.net/black-white-2/tms';
 reference.X=reference.Y='https://bulbapedia.bulbagarden.net/wiki/List_of_TM_and_HM_locations_in_Generation_VI';
 reference.Red=reference.Blue=reference.Yellow='https://bulbapedia.bulbagarden.net/wiki/List_of_TM_and_HM_locations_in_Generation_I';
 reference.Gold=reference.Silver=reference.Crystal='https://bulbapedia.bulbagarden.net/wiki/List_of_TM_and_HM_locations_in_Generation_II';
 function label(game,item){const key=String(item||'').toLowerCase();if(['Black 2','White 2'].includes(game))return window.takDexB2W2?.machines?.find(m=>m.item===key)?.location||null;if(['Black','White'].includes(game))return window.takDexUnovaV74?.machines?.find(m=>m.item===key)?.location||null;if(game==='Emerald'){const n=+key.slice(2);return key.startsWith('tm')?emeraldTM[n-1]||null:key.startsWith('hm')?emeraldHM[n-1]||null:null}if(game==='Platinum')return platinum[key]||null;if(game==='FireRed'||game==='LeafGreen')return frlg[key]||null;return window.takDexAcquisitionV77?.machineLocation(game,key)||null}
 function reuse(game,item){if(String(item).startsWith('hm'))return 'HM · reusable in games with HMs';if(['Brilliant Diamond','Shining Pearl','Scarlet','Violet'].includes(game))return 'Single-use copy · obtainable again through game systems';if(gameGeneration(game)<=4)return 'TM · single-use';if(game==='Sword'||game==='Shield')return String(item).startsWith('tr')?'TR · single-use':'TM · reusable';return 'TM · reusable (where the game has TMs)'}
 const tm=$('tmPage'),box=document.createElement('details');box.id='td65MachineGuide';box.className='card';box.style.cssText='margin:12px 0';
 $('tmResults').parentNode.insertBefore(box,$('tmResults'));
 function update(){const game=$('tmGame').value,item=($('tmMove').selectedIndex<0?null:machineEntries[Number($('tmMove').value)]);if(!item){box.innerHTML='<summary>Where to get it</summary><div class="td66-section-body"><p class="note">Choose a TM/HM to see acquisition information.</p></div>';return}
  const source=reference[game],where=label(game,item.item),how=reuse(game,item.item);
  const gates=window.td62Progress?.moveAccess(game,item.move,'machine')||[];
  const mapped=['Emerald','Platinum','Black','White','Black 2','White 2'].includes(game)&&where?(window.takDexMapsV73?.resolveLocation?.(where,game)||where):null;
  box.innerHTML=`<summary>Where to get ${safe(String(item.item).toUpperCase())} · ${safe(pretty(item.move))} <span>⌄</span></summary><div class="td66-section-body"><p><b>${where?safe(where):'Location not yet verified for '+safe(game)}</b></p>${mapped?`<button type="button" class="td74-tm-map-link" data-td74-tm-map="${safe(mapped)}" data-td74-tm-game="${safe(game)}">⌖ Show on map</button>`:''}<p class="note">${safe(how)}</p>${gates.map(gate=>`<small>${safe(gate)}</small>`).join('')}`+(source?`<p class="note"><a href="${safe(source)}" target="_blank" rel="noopener noreferrer">Location reference ↗</a> · Select another machine to update.</p>`:'<p class="note">Unverified location; no location is invented for this game.</p>')+'</div>';
 }
 box.addEventListener('click',e=>{const b=e.target.closest('[data-td74-tm-map]');if(!b)return;e.preventDefault();e.stopPropagation();window.takDexMapsV73?.open(b.dataset.td74TmGame||$('tmGame').value,b.dataset.td74TmMap);},true);
 $('tmMoveResults').addEventListener('click',()=>setTimeout(update,0));$('tmMoveSearch').addEventListener('keydown',()=>setTimeout(update,0));
 $('tmGame').addEventListener('change',()=>setTimeout(update,800));$('tmTeam').addEventListener('change',()=>setTimeout(update,800));$('tmCheck').addEventListener('click',()=>setTimeout(update,0));
 // Observe the hidden TM select, which is populated asynchronously by the existing loader.
 const obs=new MutationObserver(()=>update());obs.observe($('tmMove'),{childList:true,attributes:true,subtree:false});
 async function findMoveLocation(game,move,data){
  if(!game || !move)return null;

  let machines=null;
  try{
    machines=await window.takDexReferenceV58?.machinesFor?.(game);
  }catch{}

  let item=machines?.find(m=>m.move===move)?.item;

  if(!item&&['Black 2','White 2'].includes(game))item=window.takDexB2W2?.machines?.find(m=>m.move===move)?.item||null;
  if(!item && ['Black','White'].includes(game)){item=window.takDexUnovaV74?.moveLocation(move)?.item||null;}
  if(!item && game==='Emerald'){
    const n=emeraldMachines.indexOf(move);
    const h=emeraldHMs.indexOf(move);
    if(n>=0)item='tm'+String(n+1).padStart(2,'0');
    else if(h>=0)item='hm'+String(h+1).padStart(2,'0');
  }

  if(!item && vg[game]){
    const match=(data?.machines||[]).find(
      m=>m.version_group?.name===vg[game]
    );
    if(match){
      try{
        const machine=await api(
          match.machine.url.replace(API_ROOT,'')
        );
        item=machine.item?.name||null;
      }catch{}
    }
  }

  if(!item)return null;

  return {
    item,
    location:label(game,item)||null,
    reuse:reuse(game,item),
    reference:reference[game]||null
  };
}

window.takDexMachineGuideV65={
  label,reuse,update,reference,findMoveLocation,
  allLocations:game=>['Black 2','White 2'].includes(game)?(window.takDexB2W2?.machines||[]):game==='Platinum'?Object.entries(platinum).map(([item,location])=>({item,location})):['Black','White'].includes(game)?(window.takDexUnovaV74?.machines||[]):[],
  platinumMachines:()=>{const names=['Focus Punch', 'Dragon Claw', 'Water Pulse', 'Calm Mind', 'Roar', 'Toxic', 'Hail', 'Bulk Up', 'Bullet Seed', 'Hidden Power', 'Sunny Day', 'Taunt', 'Ice Beam', 'Blizzard', 'Hyper Beam', 'Light Screen', 'Protect', 'Rain Dance', 'Giga Drain', 'Safeguard', 'Frustration', 'Solar Beam', 'Iron Tail', 'Thunderbolt', 'Thunder', 'Earthquake', 'Return', 'Dig', 'Psychic', 'Shadow Ball', 'Brick Break', 'Double Team', 'Reflect', 'Shock Wave', 'Flamethrower', 'Sludge Bomb', 'Sandstorm', 'Fire Blast', 'Rock Tomb', 'Aerial Ace', 'Torment', 'Facade', 'Secret Power', 'Rest', 'Attract', 'Thief', 'Steel Wing', 'Skill Swap', 'Snatch', 'Overheat', 'Roost', 'Focus Blast', 'Energy Ball', 'False Swipe', 'Brine', 'Fling', 'Charge Beam', 'Endure', 'Dragon Pulse', 'Drain Punch', 'Will-O-Wisp', 'Silver Wind', 'Embargo', 'Explosion', 'Shadow Claw', 'Payback', 'Recycle', 'Giga Impact', 'Rock Polish', 'Flash', 'Stone Edge', 'Avalanche', 'Thunder Wave', 'Gyro Ball', 'Swords Dance', 'Stealth Rock', 'Psych Up', 'Captivate', 'Dark Pulse', 'Rock Slide', 'X-Scissor', 'Sleep Talk', 'Natural Gift', 'Poison Jab', 'Dream Eater', 'Grass Knot', 'Swagger', 'Pluck', 'U-turn', 'Substitute', 'Flash Cannon', 'Trick Room'];const hms=['Cut', 'Fly', 'Surf', 'Strength', 'Defog', 'Rock Smash', 'Waterfall', 'Rock Climb'];return [...names.map((move,i)=>({item:'tm'+String(i+1).padStart(2,'0'),move:move.toLowerCase().replace(/[^a-z0-9]+/g,'-')})),...hms.map((move,i)=>({item:'hm'+String(i+1).padStart(2,'0'),move:move.toLowerCase().replace(/[^a-z0-9]+/g,'-')}))];}
};
update();
})();

// V55 — version-indexed encounter catalog. PokéAPI CSV data is parsed locally on demand.
// Verified records do NOT constitute a complete obtainable-Pokémon roster.
(function initEncounterCatalogV55(){
 const ROOT='https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/';
 const CACHE='takdex-encounter-catalog-v55';
 const SOURCE=['versions','pokemon','pokemon_types','pokemon_types_past','types','pokedex_version_groups','pokemon_dex_numbers','encounters','encounter_slots','encounter_methods','encounter_condition_value_map','encounter_condition_values','location_areas','locations','pokemon_species'];
 const MEM=new Map(), IN_FLIGHT=new Map();let lastProgress=()=>{};const TABLES=new Map();
 const key=game=>new URL('takdex-encounters-v55/'+game.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'.json',/^https?:/.test(location.href)?location.href:'https://takdex.invalid/').href;
 const REQUIRED={versions:['id','identifier','version_group_id'],pokemon:['id','identifier','species_id','is_default'],pokemon_types:['pokemon_id','type_id','slot'],pokemon_types_past:['pokemon_id','type_id','slot','generation_id'],types:['id','identifier'],pokedex_version_groups:['pokedex_id','version_group_id'],pokemon_dex_numbers:['species_id','pokedex_id'],encounters:['id','version_id','pokemon_id','location_area_id','encounter_slot_id','min_level','max_level'],encounter_slots:['id','encounter_method_id'],encounter_methods:['id','identifier'],encounter_condition_value_map:['encounter_id','encounter_condition_value_id'],encounter_condition_values:['id','identifier'],location_areas:['id','location_id','identifier'],locations:['id','identifier'],pokemon_species:['id','evolves_from_species_id']};
 // DEV7.4: reject malformed/truncated source tables instead of caching false empty indexes.
 function csv(text,table){
  const rows=[];let row=[],field='',quoted=false,closed=false;
  const emitField=()=>{row.push(field.trim());field='';closed=false};
  const emitRow=()=>{emitField();if(row.some(Boolean))rows.push(row);row=[]};
  text=String(text).replace(/^\uFEFF/,'');
  for(let i=0;i<text.length;i++){const c=text[i];if(quoted){if(c==='"'){if(text[i+1]==='"'){field+='"';i++}else{quoted=false;closed=true}}else field+=c;continue;}
   if(c===','){emitField();continue}if(c==='\n'||c==='\r'){if(c==='\r'&&text[i+1]==='\n')i++;emitRow();continue}if(closed&&c.trim())throw Error('Malformed CSV field: '+table);if(c==='"'&&!field){quoted=true;continue}field+=c;
  }
  if(quoted)throw Error('Truncated quoted CSV: '+table);if(field||row.length)emitRow();
  const names=rows.shift()||[];if(!names.length||new Set(names).size!==names.length||!(REQUIRED[table]||[]).every(x=>names.includes(x)))throw Error('Unexpected source columns: '+table);
  if(!rows.length||rows.some(r=>r.length!==names.length))throw Error('Incomplete or malformed source table: '+table);
  return rows.map(parts=>Object.fromEntries(names.map((name,i)=>[name,parts[i]])));
 }
 function index(rows,field){return new Map(rows.map(x=>[x[field],x]))}
 const maxIds=[151,251,386,493,649,721,809,905,1025];
 async function cached(game,{storedOnly=false}={}){if(!storedOnly&&MEM.has(game))return MEM.get(game);if(!('caches'in window))return null;const r=await(await caches.open(CACHE)).match(key(game));if(!r)return null;const p=await td79Data.read(r,p=>p.game===game&&td79Data.encounterShape(p));if(p&&!storedOnly)MEM.set(game,p);return p}
 async function fetchTable(name){if(!TABLES.has(name))TABLES.set(name,(async()=>{return td79Data.request(ROOT+name+'.csv',{},async res=>csv(await res.text(),name))})().catch(e=>{TABLES.delete(name);throw e}));return TABLES.get(name)}
 async function buildSelected(selected,progress,signal){
  const data={};let done=0;
  // Grouped fetches avoid saturating mobile connections, while retaining usable progress updates.
  for(let i=0;i<SOURCE.length;i+=4){if(signal?.aborted)throw signal.reason;const batch=SOURCE.slice(i,i+4);await Promise.all(batch.map(async n=>{data[n]=await fetchTable(n);done++;progress('Downloading source tables · '+done+' / '+SOURCE.length)}))}
  progress('Indexing version-specific encounters…');
  const versions=data.versions,vsByName=index(versions,'identifier'),pokemon=index(data.pokemon,'id'),speciesById=index(data.pokemon_species,'id');
  const typeName=index(data.types,'id'),methods=index(data.encounter_methods,'id'),slot=index(data.encounter_slots,'id');
  const areas=index(data.location_areas,'id'),locs=index(data.locations,'id');
  const conditionName=index(data.encounter_condition_values,'id');
  const conditions=new Map();
  for(const r of data.encounter_condition_value_map){let a=conditions.get(r.encounter_id);if(!a)conditions.set(r.encounter_id,a=[]);a.push(r.encounter_condition_value_id)}
  const types=new Map(),past=new Map();
  for(const r of data.pokemon_types){let t=types.get(r.pokemon_id);if(!t)types.set(r.pokemon_id,t=[]);t.push([+r.slot,typeName.get(r.type_id)?.identifier||''])}
  for(const r of data.pokemon_types_past){let t=past.get(r.pokemon_id);if(!t)past.set(r.pokemon_id,t=new Map());let g=t.get(+r.generation_id);if(!g)t.set(+r.generation_id,g=[]);g.push([+r.slot,typeName.get(r.type_id)?.identifier||''])}
  function historical(id,gen){let t=types.get(String(id))||[];const history=past.get(String(id));if(history){const applicable=[...history.keys()].filter(g=>gen<=g).sort((a,b)=>a-b);if(applicable.length)t=history.get(applicable[0])}return t.slice().sort((a,b)=>a[0]-b[0]).map(x=>x[1]).filter(Boolean)}
  const regionDex=new Map(),regionByVersion=new Map();
  for(const row of data.pokedex_version_groups){let a=regionDex.get(row.version_group_id);if(!a)regionDex.set(row.version_group_id,a=new Set());a.add(row.pokedex_id)}
  for(const row of data.pokemon_dex_numbers){for(const [group,dexes] of regionDex)if(dexes.has(row.pokedex_id)){let set=regionByVersion.get(group);if(!set)regionByVersion.set(group,set=new Set());set.add(+row.species_id)}}
  const supported=new Map(selected.map(g=>[g.toLowerCase().replace(/ /g,'-'),g]));
  const packs={};const rawByVersion={};
  for(const [apiName,game] of supported){const v=vsByName.get(apiName);if(!v)continue;rawByVersion[v.id]={game,ids:new Map(),count:0,version:v}}
  for(const row of data.encounters){
   const bucket=rawByVersion[row.version_id];if(!bucket)continue;
   const mon=pokemon.get(row.pokemon_id);if(!mon)continue;
   const id=+mon.species_id;if(!Number.isInteger(id)||id<1||id>1025)continue;
   bucket.count++;
   const area=areas.get(row.location_area_id),locationRec=area&&locs.get(area.location_id);
   const place=[locationRec?.identifier||'Unknown location',area?.identifier||''].filter(Boolean).join(' · ');
   const method=methods.get(slot.get(row.encounter_slot_id)?.encounter_method_id)?.identifier||'unspecified';
   const cond=(conditions.get(row.id)||[]).map(n=>conditionName.get(n)?.identifier).filter(Boolean).sort();
   const condKey=cond.join(',');
   let byMon=bucket.ids.get(id);if(!byMon)bucket.ids.set(id,byMon=new Map());
   const groupKey=[place,method,condKey].join('|');let item=byMon.get(groupKey);
   if(!item){item=[place,method,+row.min_level,+row.max_level,cond];byMon.set(groupKey,item)}
   else{item[2]=Math.min(item[2],+row.min_level);item[3]=Math.max(item[3],+row.max_level)}
  }
  for(const g of selected){
   const name=g.toLowerCase().replace(/ /g,'-'),version=vsByName.get(name),bucket=version&&rawByVersion[version.id];
   const gen=gameGeneration(g),max=maxIds[gen-1]||1025,regional=regionByVersion.get(version?.version_group_id)||new Set();
   const mons=data.pokemon.filter(p=>p.is_default==='1'&&+p.id<=max&&+p.id<=1025).map(p=>[+p.id,p.identifier,historical(p.id,gen),regional.has(+p.species_id)?1:0,+(speciesById.get(p.species_id)?.evolves_from_species_id||0)]);
   const entries={};if(bucket)for(const [id,rec] of bucket.ids)entries[id]=[...rec.values()].sort((a,b)=>a[0].localeCompare(b[0]));
   packs[g]={schema:64,game:g,version:name,source:'PokéAPI encounters, regional dex and species lineage; curated starter/special records',sourceDate:new Date().toISOString().slice(0,10),records:bucket?.count||0,mons,entries,hasSource:!!bucket&&bucket.count>0};
  }
  if(signal?.aborted)throw signal.reason;
  progress('Saving indexed game packs…');
  if(!('caches' in window))throw Error('Offline CacheStorage is unavailable in this browser');
  const cache=await caches.open(CACHE);
  for(let i=0;i<selected.length;i++){
   const game=selected[i],pack=packs[game],prior=await cached(game);
   if(prior?.hasSource&&!pack.hasSource)throw Error('Encounter source returned no records for '+game+'; previous index retained.');
   await cache.put(key(game),new Response(JSON.stringify(pack),{headers:{'content-type':'application/json'}}));MEM.set(game,pack);
   if(i%5===0)progress('Saving encounter packs · '+(i+1)+' / '+selected.length);
  }
  progress('Encounter index downloaded for '+selected.length+' selected game(s)');window.dispatchEvent(new Event('td58-pack-update'));return packs;
 }
 async function get(game,cb){
  const ready=await cached(game);if(ready?.schema===65&&ready.hasSource)return ready;
  try{const local=await window.takDexDB74?.encounter(game);if(local?.hasSource||local&&!ready?.hasSource){MEM.set(game,local);return local}}catch(e){console.warn('Bundled encounter fallback:',e.message)}
  if(ready)return ready;
  if(!games.includes(game))throw Error('Unsupported game: '+game);
  if(!IN_FLIGHT.has(game))IN_FLIGHT.set(game,buildSelected([game],m=>{lastProgress(m);if(cb)cb(m)}).finally(()=>IN_FLIGHT.delete(game)));
  await IN_FLIGHT.get(game);const pack=await cached(game);if(!pack)throw Error('No encounter pack for '+game);return pack;
 }
 async function refresh(game,cb,signal){if(!games.includes(game))throw Error('Select a supported game');
  const local=await window.takDexDB74?.encounter(game).catch(()=>null);if(signal?.aborted)throw signal.reason;if(local?.hasSource){const cache=await caches.open(CACHE);await cache.put(key(game),new Response(JSON.stringify(local),{headers:{'content-type':'application/json'}}));MEM.set(game,local);window.dispatchEvent(new Event('td58-pack-update'));return local;}
  if(!IN_FLIGHT.has(game))IN_FLIGHT.set(game,buildSelected([game],m=>{lastProgress(m);if(cb)cb(m)},signal).finally(()=>IN_FLIGHT.delete(game)));
  await IN_FLIGHT.get(game);return cached(game);
 }
 async function remove(game){MEM.delete(game);if('caches' in window){const cache=await caches.open(CACHE);await cache.delete(key(game))}window.dispatchEvent(new Event('td58-pack-update'))}
 async function clearAll(){MEM.clear();if('caches' in window)await caches.delete(CACHE);window.dispatchEvent(new Event('td58-pack-update'))}
 async function count(){let total=0;for(const g of games)if(await cached(g))total++;return total}
 function format(records,game,routes=[]){
  return (records||[]).map(r=>{
   const progress=window.td62Progress;
   const audited=routes.find(route=>td77SameAcquisition(r,route,game));
   const detail=audited?[progress.milestone(audited.rank),audited.note].filter(Boolean).join(' · '):
    game&&progress?.encounterAccess(game,r)||'Encounter timing unverified';
   return td77AcquisitionEntry({
    location:r[0],place:window.takDexAcquisitionV77?.placeName(r[0],game)||pretty(r[0]),
    method:audited?audited.method:r[1],levels:r[2]>0?'Lv '+r[2]+(r[3]!==r[2]?'–'+r[3]:''):'',
    detail:[detail,...(r[4]||[]).map(pretty).filter(condition=>
     !detail.toLowerCase().replace(/[:.]/g,'').includes(condition.toLowerCase()))].join(' · ')
   },game);
  }).join('');
 }

 window.takDexEncounterV55={get,cached,count,format,refresh,remove,clearAll};
})();

const TD77_ACQUISITION_METHOD_LABELS={walk:'Walking','grass-spots':'Rustling grass','surf-spots':'Rippling water (Surf)',
 'super-rod-spots':'Super Rod (rippling water)','bridge-spots':'Bridge shadows','cave-spots':'Dust cloud','npc-trade':'In-game trade'};
function td77SameAcquisition(row,timing,game){
 const label=value=>(window.takDexAcquisitionV77?.placeName(value,game)||value||'').split(' · ')[0].toLowerCase();
 const method=value=>({'npc-trade':'in-game trade',purchase:'gift',fossil:'gift'})[value]||value;
 return label(row[0])===label(timing.place)&&method(row[1])===method(timing.method);
}
function td77AcquisitionEntry({location,place,method,levels,detail},game){
 method=TD77_ACQUISITION_METHOD_LABELS[method]||pretty(method||'');
 const map=place&&window.takDexMapsV73?.resolveLocation(location||place,game);
 const title=map?`<button type="button" class="td74-dex-map-link" data-td74-dex-map="${safe(map)}">${safe(place)} <span aria-hidden="true">⌖</span></button>`:safe(place||'');
 return `<p class="td77-acquisition-entry"><b>${title||safe(method||'')}</b>${[title&&method,levels].filter(Boolean).map(value=>' · '+safe(value)).join('')}${detail?`<small class="td77-encounter-access">${td77AcquisitionLinks(detail,game)}</small>`:''}</p>`;
}

// V64 — Shared, game-specific acquisition evidence. This supplements, never replaces,
// version-specific encounter records; unknown isn't the same as unobtainable.
(function initAcquisitionV64(){
 const starters={
  'Red':'bulbasaur charmander squirtle','Blue':'bulbasaur charmander squirtle',
  'Yellow':'pikachu','Gold':'chikorita cyndaquil totodile','Silver':'chikorita cyndaquil totodile','Crystal':'chikorita cyndaquil totodile',
  'Ruby':'treecko torchic mudkip','Sapphire':'treecko torchic mudkip','Emerald':'treecko torchic mudkip',
  'FireRed':'bulbasaur charmander squirtle','LeafGreen':'bulbasaur charmander squirtle',
  'Diamond':'turtwig chimchar piplup','Pearl':'turtwig chimchar piplup','Platinum':'turtwig chimchar piplup',
  'HeartGold':'chikorita cyndaquil totodile','SoulSilver':'chikorita cyndaquil totodile',
  'Black':'snivy tepig oshawott','White':'snivy tepig oshawott',
  'Black 2':'snivy tepig oshawott','White 2':'snivy tepig oshawott',
  'X':'chespin fennekin froakie','Y':'chespin fennekin froakie',
  'Omega Ruby':'treecko torchic mudkip','Alpha Sapphire':'treecko torchic mudkip',
  'Sun':'rowlet litten popplio','Moon':'rowlet litten popplio',
  'Ultra Sun':'rowlet litten popplio','Ultra Moon':'rowlet litten popplio',
  'Sword':'grookey scorbunny sobble','Shield':'grookey scorbunny sobble',
  'Brilliant Diamond':'turtwig chimchar piplup','Shining Pearl':'turtwig chimchar piplup',
  'Scarlet':'sprigatito fuecoco quaxly','Violet':'sprigatito fuecoco quaxly'
 };
 const special={
  Platinum:{
   darkrai:['Event-only · Member Card','Newmoon Island · limited Wi-Fi Member Card distribution; not a normal encounter'],
   shaymin:["Event-only · Oak's Letter","Flower Paradise via Route 224 · limited Oak's Letter distribution required"],
   arceus:['Event-only · distribution','Only official event-gift Arceus could be obtained; the in-game Azure Flute was never officially distributed'],
   manaphy:['Event-only · Pokémon Ranger transfer','Requires a Manaphy Egg transferred from a compatible Pokémon Ranger special mission; unavailable in ordinary wild encounters']
  },
  Emerald:{lugia:['Event-only · MysticTicket','Navel Rock · access requires the event-distributed MysticTicket; not normally obtainable without event access'], 'ho-oh':['Event-only · MysticTicket','Navel Rock · access requires the event-distributed MysticTicket; not normally obtainable without event access'],sudowoodo:['Static encounter','Battle Frontier · use Wailmer Pail · Lv 40 (postgame)'],meowth:['In-game trade','Battle Frontier · trade Skitty for Meowth (postgame)'],chikorita:['Postgame gift','Professor Birch · choose one Johto starter after completing Hoenn Pokédex'],cyndaquil:['Postgame gift','Professor Birch · choose one Johto starter after completing Hoenn Pokédex'],totodile:['Postgame gift','Professor Birch · choose one Johto starter after completing Hoenn Pokédex']},
  Yellow:{bulbasaur:['Gift','Cerulean City · NPC gift'],charmander:['Gift','Route 24 · NPC gift'],squirtle:['Gift','Vermilion City · NPC gift']}
 };
 // Known evolutionary steps that require trading with another save/cartridge.
 const tradeEvolutions=new Set('alakazam machamp golem gengar politoed slowking steelix scizor kingdra porygon2 porygon-z huntail gorebyss dusknoir rhyperior electivire magmortar gigalith conkeldurr escavalier accelgor aromatisse slurpuff trevenant gourgeist'.split(' '));
 const evidenceMemo=new WeakMap();
 const knownExternal={
  Black:'rufflet braviary',White:'vullaby mandibuzz','Black 2':'rufflet braviary','White 2':'vullaby mandibuzz',
  Emerald:'bulbasaur ivysaur venusaur charmander charmeleon charizard squirtle wartortle blastoise',
  Ruby:'bulbasaur ivysaur venusaur charmander charmeleon charizard squirtle wartortle blastoise',
  Sapphire:'bulbasaur ivysaur venusaur charmander charmeleon charizard squirtle wartortle blastoise'
 };
 const externalNames=game=>new Set((knownExternal[game]||'').split(' ').filter(Boolean));

 function allEvidence(pack){let memo=evidenceMemo.get(pack);if(memo)return memo;
  const byId=new Map((pack.mons||[]).map(m=>[m[0],m]));memo=new Map();
  function walk(id,visiting=new Set()){
   if(memo.has(id))return memo.get(id);
   const m=byId.get(Number(id));if(!m||visiting.has(id))return {kind:'Unknown',native:false,externalTrade:false};
   const rec=pack.entries?.[id]||[];
   if(special[pack.game]?.[m[1]]?.[0].startsWith('Event-only')){const r={kind:'Event-only',native:false,externalTrade:false,source:pretty(m[1])};memo.set(id,r);return r;}
   if(externalNames(pack.game).has(m[1])){const r={kind:'External trade',native:false,externalTrade:true};memo.set(id,r);return r;}
   if(rec.length){const r={kind:'Recorded encounter',native:true,externalTrade:false,source:pretty(m[1])};memo.set(id,r);return r;}
   if((starters[pack.game]||'').split(' ').includes(m[1])){const r={kind:'Starter',native:true,externalTrade:false,source:pretty(m[1])};memo.set(id,r);return r;}
   if(special[pack.game]?.[m[1]]){const r={kind:special[pack.game][m[1]][0],native:true,externalTrade:false,source:pretty(m[1])};memo.set(id,r);return r;}
   if(m[4]){
    const parent=walk(m[4],new Set([...visiting,id]));
    if(parent.native){const traded=tradeEvolutions.has(m[1])||(pack.game==='Yellow'&&m[1]==='raichu');const r={kind:traded?'Trade evolution':'Evolution route',native:!traded,externalTrade:traded,source:parent.source||pretty(byId.get(m[4])?.[1]||'')};memo.set(id,r);return r;}
   }
   const external=externalNames(pack.game).has(m[1]);const r={kind:external?'External trade':'Unknown',native:false,externalTrade:external};memo.set(id,r);return r;
  }
  for(const id of byId.keys())walk(id);
  evidenceMemo.set(pack,memo);return memo;
 }
 function details(pack,id){
  if(!pack)return {label:'Coverage unknown',notes:[],verified:false};
  const mon=(pack.mons||[]).find(p=>p[0]===Number(id));
  if(!mon)return {label:'Not indexed',notes:[],verified:false};
  const notes=[],enc=externalNames(pack.game).has(mon[1])?[]:(pack.entries?.[id]||[]);
  if(enc.length)notes.push({kind:'Recorded encounter',text:'',verified:true});
  if((starters[pack.game]||'').split(' ').includes(mon[1]))notes.push({kind:'Starter',text:pack.game==='Yellow'?'Professor Oak gives you Pikachu':'Choose one starter; other starter choices require another acquisition method',verified:true});
  if(special[pack.game]?.[mon[1]]){const [kind,text]=special[pack.game][mon[1]];notes.push({kind,text,verified:true,eventOnly:kind.startsWith('Event-only')});}
  const state=allEvidence(pack).get(Number(id))||{kind:'Unknown',native:false,externalTrade:false};
  if(!notes.length&&state.kind==='Evolution route')notes.push({kind:'Evolution route',text:'Evolves from the '+state.source+' family. Check its evolution method and location.',verified:true});
  if(!notes.length&&state.externalTrade){const opposite={Black:'White',White:'Black','Black 2':'White 2','White 2':'Black 2'}[pack.game];notes.push({kind:'External trade required',text:opposite&&externalNames(pack.game).has(mon[1])?'Version exclusive to '+opposite+' in this pair; trade required.':'Requires Pokémon from another compatible game or an external trade. Not found through this game’s own acquisitions.',verified:false});}
  const verified=notes.some(x=>x.verified);
  return {label:state.kind==='Event-only'?(special[pack.game]?.[mon[1]]?.[0]||'Event-only'):verified?notes.find(x=>x.verified).kind:state.externalTrade?'External trade required':mon[3]?'Regional Pokédex · acquisition unverified':'Availability unverified',notes,verified,regional:!!mon[3],encCount:enc.length,nativeEvolution:state.kind==='Evolution route'&&state.native,externalTrade:state.externalTrade};
 }
 function html(pack,id){
  return details(pack,id).notes.filter(n=>n.text).map(n=>`<p><b>${safe(n.kind)}:</b> ${td77AcquisitionLinks(n.text,pack.game)}</p>`).join('');
 }

 window.takDexAcquisitionV64={details,html};
})();

// V43 — separate, on-demand Pokédex type explorer. Encounter-backed results only.
function td77TypeTiles(gen,attribute,isSelected){
 return Object.entries(colors).map(([type,color])=>{
  const hidden=(gen<6&&type==='fairy')||(gen<2&&['dark','steel'].includes(type));
  const selected=isSelected(type);
  return `<button type="button" ${attribute}="${type}" class="${selected?'selected':''}" ${hidden?'hidden disabled':''} aria-pressed="${selected}" style="--td72-color:${color}">${pretty(type)}</button>`;
 }).join('');
}
function td772FilterButton(id,label,panel){
 return `<button id="${id}" class="td772-filter-button" type="button" aria-label="${label}" aria-expanded="false" aria-controls="${panel}"><svg aria-hidden="true" viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M3 4h18l-7 8v6l-4 2v-8z"/></svg></button>`;
}
function td78FilterHeader(count=0){
 return `<div class="td78-filter-header"><button type="button" class="td774-secondary" data-td78-clear-filters ${count?'':'disabled'}>Clear filters</button></div>`;
}
function td78FilterBadges(types,classes=[]){
 return [...Array.from(types,type=>[type,'type']),...Array.from(classes,kind=>[kind,'class'])].map(([value,group])=>
  `<span class="td78-filter-chip${group==='type'?' pill':''}"${group==='type'?` style="--c:${colors[value]}"`:''}>
   ${safe(pretty(value))}<button type="button" data-td78-filter-value="${safe(value)}" data-td78-filter-group="${group}" aria-label="Clear ${safe(pretty(value))} filter">×</button></span>`).join('');
}
function td78FilterState(button,panel,count){
 button.classList.toggle('selected',count>0);
 panel.querySelector('.td78-filter-header')?.remove();
 panel.insertAdjacentHTML('afterbegin',td78FilterHeader(count));
}
function td772BindFilter(button,panel,clear){
 const open=value=>{panel.hidden=!value;button.setAttribute('aria-expanded',String(value));};
 button.onclick=()=>open(panel.hidden);
 panel.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();open(false);button.focus();}});
 panel.addEventListener('click',event=>{
  if(!event.target.closest('[data-td78-clear-filters]'))return;
  clear?.();
  button.focus({preventScroll:true});
 });
 td78FilterState(button,panel,0);
}
(function initTypeExplorer(){
 const dex=$('dexPage');if(!dex||$('typeExplorerPage'))return;
 const btn=document.createElement('button');btn.type='button';btn.id='openTypeExplorer';btn.textContent='◈ By Type';btn.style.cssText='width:auto;display:inline-block;margin:0;padding:7px 13px;border-radius:9px;font-size:.9rem;font-weight:700;cursor:pointer';
 const byTypeRow=document.createElement('div');byTypeRow.id='dexByTypeRow';byTypeRow.style.cssText='display:flex;justify-content:flex-end;align-items:center;flex:0 0 auto;margin:0';byTypeRow.appendChild(btn);const dexHeading=dex.querySelector('h2');if(dexHeading){const header=document.createElement('div');header.id='dexTitleRow';header.style.cssText='display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 12px';dexHeading.parentNode.insertBefore(header,dexHeading);header.appendChild(dexHeading);dexHeading.style.cssText='margin:0;min-width:0';header.appendChild(byTypeRow)}else{dex.insertBefore(byTypeRow,dex.firstChild)}
 const page=document.createElement('section');page.id='typeExplorerPage';page.hidden=true;
 page.innerHTML='<div class="bar td772-context-heading"><h2>Pokémon by Type</h2><button id="typeExplorerBack" type="button">← Back to Pokédex</button></div><div class="td772-filter-line"><select id="typeExplorerGame" aria-label="Game"></select>'+td772FilterButton('td772ExplorerFilters','Acquisition filters','td65ProgressFilter')+'</div><div id="typeExplorerTypes" class="td72-move-types"></div><div id="typeExplorerStatus" class="note" role="status"></div><div id="typeExplorerResults"></div>';
 dex.parentNode.appendChild(page);
 const td61Style=document.createElement('style');
 td61Style.textContent=`
 #typeExplorerResults .td61-entry{margin:9px 0;padding:12px;background:var(--card);border:1px solid var(--edge)}
 #typeExplorerResults .td61-entry-open{display:flex;align-items:center;gap:12px;width:100%;min-height:72px;text-align:left;padding:3px!important;border:0!important;border-radius:10px;background:transparent!important;color:var(--text)!important;box-shadow:none!important;text-shadow:none!important;cursor:pointer}
 #typeExplorerResults .td61-entry-open:hover{background:color-mix(in srgb,var(--text) 5%,transparent)!important}
 #typeExplorerResults .td61-entry-open:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
 #typeExplorerResults .td61-thumb{width:70px;height:70px;flex:0 0 70px;display:grid;place-items:center;border-radius:10px;background:color-mix(in srgb,var(--text) 5%,transparent)}
 #typeExplorerResults .td61-thumb img{width:64px;height:64px;object-fit:contain}
 #typeExplorerResults .td61-entry-info{display:grid;gap:3px;min-width:0;flex:1}
 #typeExplorerResults .td61-entry-info strong{font-size:.96rem;color:var(--text)}
 #typeExplorerResults .td61-entry-info .pills{margin:3px 0}
 #typeExplorerResults .td61-entry-info small{font-size:.78rem;color:var(--muted)}
 #typeExplorerResults .td61-entry-chevron{flex:0 0 auto;font-size:1.2rem;font-weight:700;color:var(--muted)}
 #typeExplorerResults .td61-entry-details{border-top:1px solid var(--edge);margin-top:8px;padding-top:9px}
 #typeExplorerResults .td61-entry-details summary{color:var(--muted);font-size:.84rem;cursor:pointer;padding:2px 0}
 `;
 document.head.appendChild(td61Style);
 const gameEl=page.querySelector('#typeExplorerGame'),typeEl=page.querySelector('#typeExplorerTypes'),status=page.querySelector('#typeExplorerStatus'),results=page.querySelector('#typeExplorerResults');
 gameEl.innerHTML='<option value="">Choose game…</option><option value="All Games">All Games · National catalog</option>'+gameOptions;let selected=null,request=0,explorerScroll=0,fromExplorer=false;
 let onlyRecorded=false,includeUnverified=false,includeTrades=false;
 const filterBox=document.createElement('div');filterBox.id='td65ProgressFilter';filterBox.className='td772-filter-panel';filterBox.hidden=true;
 const filterButton=$('td772ExplorerFilters');
 filterBox.innerHTML=`<label><input type="checkbox" id="td65Recorded"> Only recorded wild encounters</label><label><input type="checkbox" id="td65Unverified"> Include unverified Pokémon</label><label><input type="checkbox" id="td66Trades"> Include Pokémon requiring external trades</label>`;
 typeEl.before(filterBox);
 td772BindFilter(filterButton,filterBox,()=>{
  for(const input of filterBox.querySelectorAll('input'))input.checked=false;
  filterBox.dispatchEvent(new Event('change'));
 });
 filterBox.addEventListener('change',()=>{
  onlyRecorded=$('td65Recorded').checked;
  includeUnverified=$('td65Unverified').checked;
  includeTrades=$('td66Trades').checked;
  td78FilterState(filterButton,filterBox,Number(onlyRecorded)+Number(includeUnverified)+Number(includeTrades));
  show();
 });
 function go(back,restore=false){dex.hidden=!back;page.hidden=back;if(!back)window.scrollTo(0,restore?explorerScroll:0);else window.scrollTo(0,0)}
 let suspendedExplorer=null;
 window.td4RememberExplorer=index=>{if(index!==2&&!page.hidden)suspendedExplorer={scroll:window.scrollY};};
 window.td4RestoreExplorer=()=>{if(!suspendedExplorer)return false;const old=suspendedExplorer;suspendedExplorer=null;requestAnimationFrame(()=>{if(!$('dexTab').classList.contains('selected'))return;dex.hidden=true;page.hidden=false;window.scrollTo(0,old.scroll);});return true;};
 window.td4HasExplorer=()=>!!suspendedExplorer;
 for(const tab of ['teamsTab','battleTab','moreTab'])$(tab).addEventListener('click',()=>window.td4RememberExplorer(3),true);

 function clearOrigin(){fromExplorer=false;window.takDexBattleNavigationV73?.clearBack('type-explorer');}
 $('dexTab').addEventListener('click',clearOrigin);for(const tab of ['teamsTab','battleTab','dexTab','moreTab'])$(tab).addEventListener('click',()=>{if(!page.hidden){page.hidden=true;dex.hidden=tab!=='dexTab';clearOrigin()}});$('dexInput').addEventListener('input',()=>{if(fromExplorer)clearOrigin();suspendedExplorer=null});
 $('dexInput').addEventListener('takdex:pokedex-search',()=>{suspendedExplorer=null},true);
 $('dexGame').addEventListener('change',()=>{if(fromExplorer)clearOrigin()});
 btn.onclick=()=>{clearOrigin();gameEl.value=$('dexGame').value;selected=null;drawTypes();results.innerHTML='';status.textContent='Choose a type to explore.';go(false)};
 page.querySelector('#typeExplorerBack').onclick=()=>{suspendedExplorer=null;go(true)};
 function drawTypes(){typeEl.innerHTML=td77TypeTiles(gameEl.value==='All Games'?9:gameGeneration(gameEl.value),'data-explore-type',type=>selected===type);}
 function label(name){return pretty(name).replace(/\bArea\b$/,'').trim()}
 const intro=page.querySelector('.note');if(intro)intro.textContent='A selected game lists confirmed wild, starter, gift or special evidence and potential evolutions. Unknown entries can be included in Filters; All Games shows a broader species catalog.';
 function itemHtml(m,hasSource){
  const found=m.rec||[],has=found.length>0;
  const evidence=m.acquisition?.label||(has?'Recorded encounter'+(found.length>1?'s':''):m.regional?'Regional Pokédex · availability unverified':'Availability unverified');
  return `<article class="card td61-entry"><button class="td61-entry-open" type="button" data-explore-pokemon="${safe(m.name)}"><span class="td61-thumb"><img loading="lazy" width="64" height="64" alt="" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${m.id}.png"></span><span class="td61-entry-info"><strong>#${m.id} ${safe(td41PokemonLabel(m.name))}</strong><span class="pills">${m.types.map(pill).join('')}</span><small>${safe(evidence)}</small></span><span class="td61-entry-chevron" aria-hidden="true">›</span></button><details class="td61-entry-details"><summary>${has?'Encounter records ('+found.length+')':hasSource?'No encounter records':'Coverage unknown'}</summary>${has?window.takDexEncounterV55.format(found):'<p class="note">'+(hasSource?'No matching records in the encounter source; this does not mean unobtainable.':'The source has no recorded encounters for this version.')+'</p>'}${m.acquisition?window.takDexAcquisitionV64.html(m.pack,m.id):''}</details></article>`
 }
 async function show(scrollToFirst=false){const token=++request;results.innerHTML='';if(!selected){status.textContent='Choose a type to explore.';return}
  const game=gameEl.value;
 if(!game){status.textContent='Choose a game (or All Games) first.';results.innerHTML='';return}
 const gen=game==='All Games'?9:gameGeneration(game);status.textContent='Loading '+pretty(selected)+' Pokémon for '+game+'…';
  if(game==='All Games'){
   try{const type=await api('type/'+selected);if(token!==request)return;
    const ids=new Map();for(const row of type.pokemon||[]){const id=+(row.pokemon.url.match(/\/(\d+)\/?$/)||[])[1];if(id>0&&id<=1025&&!ids.has(id))ids.set(id,{id,name:row.pokemon.name,types:[selected],rec:[],acquisition:null,pack:null});}
    const list=[...ids.values()].sort((a,b)=>a.id-b.id);
    results.innerHTML=list.map(m=>itemHtml(m,false)).join('')||'<div class="card">No matching Pokémon.</div>';
    status.textContent=list.length+' national-catalog Pokémon matching '+pretty(selected)+'. Uses current type data; encounter availability differs by game.';
   }catch{if(token===request)status.textContent='All Games catalog unavailable offline. Connect once to load the type catalog.'}
   if(scrollToFirst&&token===request)scrollFirst();
   return;
  }
  try{
   const cat=window.takDexEncounterV55,pack=await cat.get(game,msg=>{if(token===request)status.textContent=msg});if(token!==request)return;
   const matched=pack.mons.filter(m=>m[2].includes(selected)).map(m=>({id:m[0],name:m[1],types:m[2],regional:!!m[3],rec:pack.entries[m[0]]||[],acquisition:window.takDexAcquisitionV64.details(pack,m[0]),pack}));
   // Wild encounters and curated starter/gift/static records count as positive evidence.
   // Evolution paths derived from these records are possible, but may require progression or trading.
   const hasEvidence=m=>m.rec.length>0||Boolean(m.acquisition?.verified||m.acquisition?.nativeEvolution);
   let shown=matched.filter(m=>(includeUnverified||hasEvidence(m)||(includeTrades&&m.acquisition?.externalTrade))&&(!onlyRecorded||m.rec.length)&&(!m.acquisition?.externalTrade||m.rec.length||includeTrades));
   results.innerHTML=shown.map(m=>itemHtml(m,pack.hasSource)).join('')||'<div class="card">No documented matches with these filters. Try including unverified availability or changing the game.</div>';
   if(scrollToFirst)scrollFirst();
   const seen=matched.filter(m=>m.rec.length).length,confirmed=matched.filter(hasEvidence).length;
   status.textContent=shown.length+' shown · '+confirmed+' with acquisition evidence · '+seen+' with wild records · '+matched.length+' matching species. This is an evidence-backed list, not a complete guarantee of obtainability.';
  }catch(e){if(token===request){status.textContent='Game-specific records unavailable. Download a game pack or connect online. No generation-wide fallback is displayed as verified availability.'}}
 }
 function scrollFirst(){
  const first=results.querySelector('.td61-entry');
  if(!first||page.hidden)return;
  first.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 }
 typeEl.onclick=e=>{const b=e.target.closest('[data-explore-type]');if(!b||b.disabled)return;selected=selected===b.dataset.exploreType?null:b.dataset.exploreType;drawTypes();show(!!selected)};
 gameEl.onchange=()=>{request++;if(!gameEl.value){selected=null;results.innerHTML='';status.textContent='Choose a game to explore types.';drawTypes();return}const gen=gameEl.value==='All Games'?9:gameGeneration(gameEl.value);if((gen<6&&selected==='fairy')||(gen<2&&['dark','steel'].includes(selected)))selected=null;filterBox.open=false;drawTypes();results.innerHTML='';if(selected)show();else status.textContent='Choose a type to explore.'};
 results.onclick=e=>{const b=e.target.closest('[data-explore-pokemon]');if(!b)return;if(gameEl.value!=='All Games')$('dexGame').value=gameEl.value;$('dexInput').value=pretty(b.dataset.explorePokemon);explorerScroll=window.scrollY;fromExplorer=true;window.takDexBattleNavigationV73?.setBack('type-explorer',()=>{fromExplorer=false;go(false,true)});go(true);td77SearchDex()};
 drawTypes();
})();

// V47 — approved navigation artwork. Icons inherit the existing selected tab color.
(function(){
 const style=document.createElement('style');
 style.textContent=`#teamsTab .takdex-nav-art,#battleTab .takdex-nav-art,#dexTab .takdex-nav-art{display:block;width:24px;height:24px;flex:0 0 24px;margin:0 auto;background-color:currentColor;mask-position:center;mask-repeat:no-repeat;mask-size:contain;-webkit-mask-position:center;-webkit-mask-repeat:no-repeat;-webkit-mask-size:contain}#teamsTab .takdex-nav-art{transform-origin:center;mask-image:url('takdex-team-nav.png');-webkit-mask-image:url('takdex-team-nav.png')}#battleTab .takdex-nav-art{mask-image:url('takdex-battle-nav.png');-webkit-mask-image:url('takdex-battle-nav.png')}#dexTab .takdex-nav-art{mask-image:url('takdex-pokedex-nav.png');-webkit-mask-image:url('takdex-pokedex-nav.png')}#teamsTab .takdex-nav-art,#battleTab .takdex-nav-art,#dexTab .takdex-nav-art{transform-origin:center}#teamsTab .takdex-nav-art{transform:translateY(-3px) scale(1.92)}#battleTab .takdex-nav-art{transform:translateY(-3px) scale(1.40)}#dexTab .takdex-nav-art{transform:translateY(-3px) scale(1.52)}`;
 document.head.appendChild(style);
 for(const id of ['teamsTab','battleTab','dexTab']){const tab=document.getElementById(id);if(!tab)continue;const old=tab.querySelector('svg');if(!old)continue;const icon=document.createElement('span');icon.className='takdex-nav-art';icon.setAttribute('aria-hidden','true');old.replaceWith(icon)}
})();


// V56 — Pokémon Comparison. Independent More tool with auto-complete + browse,
// generation-specific typing, base-stat comparisons, weaknesses and encounter-index context.
(function initPokemonComparisonV56(){
 const more=$('morePage');if(!more||$('td56ComparePage'))return;
 const launch=document.createElement('button');launch.id='td56OpenCompare';launch.type='button';launch.className='tool-link';launch.textContent='⚖ Pokémon Comparison ›';
 const tools=more.querySelector('.tool-card');if(tools)tools.appendChild(launch);else more.insertBefore(launch,more.firstChild);
 const page=document.createElement('section');page.id='td56ComparePage';page.hidden=true;
 page.innerHTML=`<div class="bar"><h2>Pokémon Comparison</h2><button id="td56Back" type="button">← More</button></div>
  <div class="tool-card"><label>Game<select id="td56Game"></select></label>
  <div class="td56-select-grid"><div class="td57-picker"><label for="td56A">Pokémon 1</label><div class="search td56-combo"><input type="text" id="td56A" autocomplete="off" placeholder="Search Pokémon…" aria-expanded="false" aria-controls="td56SuggestionsA"><button type="button" class="td56-arrow" data-picker="A" aria-label="Browse Pokémon 1">▾</button><div class="suggestions" id="td56SuggestionsA" hidden></div></div><div class="td57-evolutions" id="td57StagesA" hidden></div></div>
  <div class="td57-picker"><label for="td56B">Pokémon 2</label><div class="search td56-combo"><input type="text" id="td56B" autocomplete="off" placeholder="Search Pokémon…" aria-expanded="false" aria-controls="td56SuggestionsB"><button type="button" class="td56-arrow" data-picker="B" aria-label="Browse Pokémon 2">▾</button><div class="suggestions" id="td56SuggestionsB" hidden></div></div><div class="td57-evolutions" id="td57StagesB" hidden></div></div></div>
  <button type="button" id="td56Run" hidden>Compare Pokémon</button></div>
  <div id="td56Output" aria-live="polite"><p class="note">Choose two Pokémon to compare.</p></div>`;
 document.querySelector('main').appendChild(page);
 const st=document.createElement('style');st.textContent=`
 #td56ComparePage .td56-select-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;align-items:start}
 #td56ComparePage .td57-picker{min-width:0}
 #td56ComparePage .td57-picker>label{display:block;margin:0 0 7px}
 #td56ComparePage .td56-combo{display:grid;grid-template-columns:minmax(0,1fr) 40px;align-items:stretch;position:relative;min-width:0;overflow:visible;border:1px solid var(--edge);border-radius:11px;background:var(--bg);min-height:51px}
 #td56ComparePage .td56-combo input{min-width:0;width:100%;max-width:100%;height:50px;margin:0;padding:10px 6px 10px 11px;border:0!important;border-radius:11px 0 0 11px;background:transparent!important;color:var(--text);box-shadow:none!important;font-size:.86rem;text-overflow:ellipsis;outline-offset:-2px}
 #td56ComparePage .td56-combo input::placeholder{font-size:.78rem}
 #td56ComparePage .td56-combo .td56-arrow{position:static!important;display:flex;align-items:center;justify-content:center;width:40px;min-width:40px;height:50px;margin:0;padding:0!important;border:0!important;border-left:1px solid var(--edge)!important;border-radius:0 10px 10px 0!important;background:transparent!important;color:var(--text)!important;box-shadow:none!important;font-size:1.2rem;line-height:1}
 #td56ComparePage .td56-combo:focus-within{outline:1px solid var(--accent);outline-offset:0}
 #td56ComparePage .td57-evolutions{margin-top:8px;min-width:0}
 #td56ComparePage .td57-evolutions p{font-size:.75rem;margin:0 0 5px}
 #td56ComparePage .td57-stage-options{display:flex;flex-wrap:wrap;gap:5px}
 #td56ComparePage .td57-stage-options button{background:var(--bg);border:1px solid var(--edge);color:var(--text);box-shadow:none;font-size:.75rem;font-weight:600;padding:5px 7px;max-width:100%;border-radius:7px;white-space:normal}
 #td56ComparePage .td57-stage-options button[aria-pressed="true"]{border-color:var(--accent);color:var(--accent);background:color-mix(in srgb,var(--accent) 9%,var(--bg))}
 #td56ComparePage .suggestions{max-height:235px;z-index:50}
 #td56ComparePage .suggestions button{width:100%;padding:9px 10px}
 #td56ComparePage .td56-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:12px}
 #td56ComparePage .td56-mon{min-width:0;text-align:center;padding:12px 8px}
 #td56ComparePage .td56-mon img{width:100px;height:100px;max-width:95%;object-fit:contain;display:block;margin:0 auto 6px}
 #td56ComparePage .td56-mon h3{margin:4px 0;font-size:1rem}
 #td56ComparePage .td56-stat-row{display:grid;grid-template-columns:minmax(0,1fr) 85px minmax(0,1fr);align-items:center;gap:6px;padding:9px 5px;border-bottom:1px solid var(--edge)}
 #td56ComparePage .td56-stat-row strong{text-align:center;font-size:.79rem;color:var(--muted)}
 #td56ComparePage .td56-stat-row .td56-left{text-align:right;font-variant-numeric:tabular-nums}
 #td56ComparePage .td56-stat-row .td56-right{text-align:left;font-variant-numeric:tabular-nums}
 #td56ComparePage .td56-win{color:var(--accent);font-weight:800}
 #td56ComparePage .td56-match{text-align:left}
 #td56ComparePage .td56-match p{margin:5px 0}
 #td56ComparePage .td56-match h4{margin:12px 0 5px}
 @media(max-width:390px){#td56ComparePage .td56-stat-row{grid-template-columns:minmax(0,1fr) 69px minmax(0,1fr)}#td56ComparePage .td56-mon img{width:80px;height:80px}}
 `;document.head.appendChild(st);
 const game=$('td56Game'),output=$('td56Output'),values={A:null,B:null};let revision=0,open=false,td73CompareReturn=null;
 game.innerHTML='<option value="">Choose game…</option>'+gameOptions;game.value=td66SavedGame()||'';
 function closeSuggestions(){for(const k of ['A','B']){$('td56Suggestions'+k).hidden=true;$('td56'+k).setAttribute('aria-expanded','false')}}
 function maxPokemon(){return [151,251,386,493,649,721,809,905,1025][gameGeneration(game.value)-1]||1025}
 function ident(name){return name.trim().toLowerCase().replace(/\s+/g,'-')}
 async function suggestions(k,browse){
  const input=$('td56'+k),box=$('td56Suggestions'+k),q=ident(input.value),mine=++revision;
  closeSuggestions();box.hidden=false;input.setAttribute('aria-expanded','true');box.innerHTML='<p class="note">Loading Pokémon list…</p>';
  try{
   const rows=(await api('pokemon?limit=2000')).results||[];
   if(mine!==revision||page.hidden)return;
   // Numeric Pokémon IDs (not list positions) guard against names from later generations.
   // This is a generation filter, NOT proof of in-game obtainability.
   const max=maxPokemon();
   const pool=rows.filter(r=>td7PokemonAllowed(r.name,Number(r.url?.match(/\/(\d+)\/?$/)?.[1]),game.value)).map(r=>r.name);
   const found=td78SearchMatches(pool,q).slice(0,45);
   box.innerHTML=found.length?found.map(n=>`<button type="button" data-compare-name="${safe(n)}">${safe(td41PokemonLabel(n))}</button>`).join('')+'<p class="note" style="padding:3px 8px">'+(q?'Type more to narrow results.':'Type to search the full Pokédex.')+'</p>':'<p class="note">No matching Pokémon.</p>';
  }catch{if(mine===revision)box.innerHTML='<p class="note">Pokémon list unavailable. Connect to the internet or download Offline Data.</p>'}
 }
 const evolutionCache=new Map(),stageRun={A:0,B:0};
 function td52EvolutionPaths(root,target,max){const paths=[];function walk(n,prefix){if(!n?.species?.name)return;const id=Number((n.species.url||'').match(/\/(\d+)\/?$/)?.[1]||0);if(id>max)return;const path=[...prefix,{name:n.species.name,id}];const children=(n.evolves_to||[]).filter(c=>Number((c.species?.url||'').match(/\/(\d+)\/?$/)?.[1]||0)<=max);if(children.length)children.forEach(c=>walk(c,path));else if(path.some(x=>x.name===target))paths.push(path);}walk(root,[]);return paths;}

 function clearStages(k){stageRun[k]++;const box=$('td57Stages'+k);box.hidden=true;box.innerHTML=''}
 async function loadEvolutionStages(k,name){
  const token=++stageRun[k],box=$('td57Stages'+k);
  box.innerHTML='<p class="note">Loading evolution stages…</p>';box.hidden=false;
  try{
   const species=await api('pokemon-species/'+encodeURIComponent(name)).catch(async()=>{const p=await api('pokemon/'+encodeURIComponent(name));return api('pokemon-species/'+encodeURIComponent(p.species?.name||p.id))});
   const url=species.evolution_chain?.url;
   if(!url)throw Error('No chain');
   let tree=evolutionCache.get(url);
   if(!tree){const chain=await api(url.replace('https://pokeapi.co/api/v2/',''));tree=chain.chain;evolutionCache.set(url,tree);}
   const paths=td52EvolutionPaths(tree,species.name||name,maxPokemon());
   if(token!==stageRun[k])return;
   if(!paths.some(a=>a.length>1)){box.hidden=true;return}
   box.innerHTML='<p class="note">Evolution forms · tap to compare</p>'+paths.map((available,i)=>`<div class="td57-stage-options td52-evo-path">${paths.length>1?`<small>Branch ${i+1}</small>`:''}${available.map(e=>`<button type="button" data-evo-name="${safe(e.name)}" data-evo-side="${k}" aria-pressed="${String(e.name===species.name||e.name===values[k])}">${safe(pretty(e.name))}</button>`).join('')}</div>`).join('');
  }catch{if(token===stageRun[k])box.hidden=true}
 }
 async function pick(k,name){
  values[k]=name;const input=$('td56'+k);input.value=pretty(name);closeSuggestions();
  loadEvolutionStages(k,name);if(values.A&&values.B)await compare();
 }
 for(const k of ['A','B'])$('td57Stages'+k).addEventListener('click',e=>{const b=e.target.closest('[data-evo-name]');if(b)pick(k,b.dataset.evoName)});

 for(const k of ['A','B']){
  const input=$('td56'+k),box=$('td56Suggestions'+k);
  input.addEventListener('input',()=>{run++;values[k]=null;clearStages(k);output.innerHTML='<p class="note">Select two Pokémon to compare.</p>';if(input.value.trim().length>=2)suggestions(k,false);else{revision++;closeSuggestions()}});
  input.addEventListener('focus',()=>{if(input.value)input.select();if(input.value.length>=2)suggestions(k,false)});
  input.addEventListener('keydown',e=>{if(e.key==='Escape'){revision++;closeSuggestions()}if(e.key==='Enter'){const first=box.querySelector('[data-compare-name]');if(!box.hidden&&first){e.preventDefault();pick(k,first.dataset.compareName)}else{e.preventDefault();compare()}}});
  box.addEventListener('click',e=>{const b=e.target.closest('[data-compare-name]');if(b)pick(k,b.dataset.compareName)});
  page.querySelector('[data-picker="'+k+'"]').addEventListener('click',()=>{if(!box.hidden){revision++;closeSuggestions()}else suggestions(k,true)});
 }
 document.addEventListener('pointerdown',e=>{if(open&&!page.hidden&&!e.target.closest('#td56ComparePage .td56-combo')){revision++;closeSuggestions()}});
 const stats=[['HP','hp'],['Attack','attack'],['Defense','defense'],['Sp. Atk','special-attack'],['Sp. Def','special-defense'],['Speed','speed']];
 const statMap=(p,g)=>Object.fromEntries(td76HistoricalStats(p,g).map(x=>[x.stat.name,x.base_stat]));
 function defensive(types,gen){const t=Object.keys(colors).filter(t=>gen>=6||t!=='fairy').filter(t=>gen>=2||!['dark','steel'].includes(t));return t.map(x=>({name:x,value:matchup(x,types,gen)})).filter(x=>x.value!==null)}
 function group(types,gen){const effects=defensive(types,gen);return {weak:effects.filter(x=>x.value>1),resist:effects.filter(x=>x.value>0&&x.value<1),immune:effects.filter(x=>x.value===0)}}
 function chips(list){return list.length?list.map(x=>`<span style="display:inline-block;margin:3px">${pill(x.name)} <b>${effectText(x.value)}</b></span>`).join(''):'<span class="note">None</span>'}
 function abilityLabel(p,g){const found=historicalAbilities(p,g).map(a=>pretty(a.ability?.name||'')).filter(Boolean);return found.length?found.map(safe).join(' · '):'Not listed'}
 function header(p,types){const img=p.sprites?.other?.['official-artwork']?.front_default||p.sprites?.front_default||'';
  return `<article class="card td56-mon td73-poke-link" role="button" tabindex="0" data-td73-mon="${safe(p.name)}" data-td73-id="${p.id}" data-td73-context="comparison" title="Open Pokédex"><img loading="lazy" src="${safe(img)}" alt=""><h3>${safe(td41PokemonLabel(p.name))}</h3><div class="pills" style="justify-content:center">${types.map(pill).join('')}</div><p class="note">#${p.id}</p></article>`;
 }
 let run=0;
 async function compare(){const mine=++run;const n1=values.A||ident($('td56A').value),n2=values.B||ident($('td56B').value);
  closeSuggestions();if(!n1||!n2){output.innerHTML='<p class="note">Choose two Pokémon first.</p>';return}
  const selectedGame=game.value;
  if(!games.includes(selectedGame)){output.textContent='Choose a game before comparing Pokémon.';return}
  output.innerHTML='<p class="note">Loading Pokémon stats and types…</p>';
  try{
   const [p1,p2]=await Promise.all([api('pokemon/'+encodeURIComponent(n1)),api('pokemon/'+encodeURIComponent(n2))]);if(mine!==run||selectedGame!==game.value)return;
   if(!td7PokemonAllowed(p1.name,p1.id,selectedGame)||!td7PokemonAllowed(p2.name,p2.id,selectedGame)){output.innerHTML='<p class="note">A selected Pokémon was introduced after this generation. Choose an older Pokémon.</p>';return}
   const prevA=values.A,prevB=values.B;values.A=p1.name;values.B=p2.name;$('td56A').value=pretty(p1.name);$('td56B').value=pretty(p2.name);if(prevA!==p1.name)loadEvolutionStages('A',p1.name);if(prevB!==p2.name)loadEvolutionStages('B',p2.name);
   const gen=gameGeneration(selectedGame),t1=historicalTypes(p1,selectedGame),t2=historicalTypes(p2,selectedGame),s1=statMap(p1,selectedGame),s2=statMap(p2,selectedGame);
   let html='<div class="td56-cards">'+header(p1,t1)+header(p2,t2)+'</div><article class="card"><h3>Base stat comparison</h3>';
   for(const [label,key] of stats){const a=s1[key]??0,b=s2[key]??0;html+=`<div class="td56-stat-row"><span class="td56-left ${a>b?'td56-win':''}">${a}</span><strong>${label}</strong><span class="td56-right ${b>a?'td56-win':''}">${b}</span></div>`}
   const total1=stats.reduce((a,[,k])=>a+(s1[k]||0),0),total2=stats.reduce((a,[,k])=>a+(s2[k]||0),0);
   html+=`<div class="td56-stat-row"><span class="td56-left ${total1>total2?'td56-win':''}">${total1}</span><strong>Total</strong><span class="td56-right ${total2>total1?'td56-win':''}">${total2}</span></div></article>`;
   const g1=group(t1,gen),g2=group(t2,gen);
   html+='<div class="td56-cards">'+[[p1,g1],[p2,g2]].map(([p,g])=>`<article class="card td56-match"><h3>${safe(td41PokemonLabel(p.name))}</h3><p class="note">Type-chart matchups only. Abilities can alter immunities.</p><h4>Weak to</h4>${chips(g.weak)}<h4>Resists</h4>${chips(g.resist)}<h4>Immune to</h4>${chips(g.immune)}<h4>Abilities · ${safe(selectedGame)}</h4><p class="note">${abilityLabel(p,selectedGame)}</p></article>`).join('')+'</div>';
   const win=(key)=>s1[key]===s2[key]?'Tied':s1[key]>s2[key]?pretty(p1.name):pretty(p2.name);
   html+=`<article class="card"><h3>Quick takeaways</h3><p><b>Faster:</b> ${safe(win('speed'))} · <b>Higher Attack:</b> ${safe(win('attack'))} · <b>Higher Sp. Atk:</b> ${safe(win('special-attack'))}</p><p class="note">Base stats are current PokéAPI values and may have changed in older games; this is not a full battle simulation. Abilities are generation-adjusted when the API provides historical data. Compare actual moves and evolution requirements before committing to training.</p></article>`;
   output.innerHTML=html;
  }catch(e){if(mine===run)output.innerHTML='<p class="note">Unable to load a Pokémon. Check spelling and your internet/offline database.</p>'}
 }
 function scrollToComparison(){
  const result=output.querySelector('.td56-cards');
  if(result)requestAnimationFrame(()=>{if(result.isConnected&&!page.hidden)result.scrollIntoView({block:'start'});});
 }
 let quickGame='';
 window.takDexCompareV71={openPair:async(a,b,g,scroll=window.scrollY)=>{launch.click();if(game.value!==g){game.value=g;game.onchange?.()}td73CompareReturn={origin:'team-planner',scroll};$('td56Back').textContent='← Team Planner';await pick('A',a);await pick('B',b);scrollToComparison();},getSlots:()=>({...values}),replace:async(side,name,chosenGame)=>{if(!['A','B'].includes(side))return;const g=chosenGame||$('dexGame').value,other=side==='A'?'B':'A',retained=values[other];if(games.includes(g)&&game.value!==g){game.value=g;game.onchange?.();if(retained)await pick(other,retained);}quickGame=games.includes(g)?g:game.value;await pick(side,name);},
  openFromDex:async(chosenGame,scroll,context)=>{
   const pair={...values};
   const g=games.includes(chosenGame)?chosenGame:game.value;
   if(!pair.A||!pair.B||!games.includes(g))return;
   quickGame=g;launch.click();
   td73CompareReturn={origin:context==='type-explorer'?'dex-type':'dex',scroll};
   $('td56Back').textContent='← Back';await pick('A',pair.A);await pick('B',pair.B);scrollToComparison();
  },
  openForBattle:async(name,chosenGame,origin,side='A',scroll=window.scrollY)=>{if(!['A','B'].includes(side))return;const other=side==='A'?'B':'A',retained=values[other];launch.click();if(games.includes(chosenGame)&&game.value!==chosenGame){game.value=chosenGame;game.onchange?.()}td73CompareReturn={origin,scroll};if(retained&&values[other]!==retained)await pick(other,retained);await pick(side,name);}
 };
 $('td56Run').onclick=compare;
 game.onchange=()=>{run++;revision++;closeSuggestions();for(const k of ['A','B']){values[k]=null;$('td56'+k).value='';clearStages(k)}output.innerHTML='<p class="note">Choose Pokémon for the selected game. Evolution stages reflect that game’s generation.</p>'};
 launch.onclick=()=>{td73CompareReturn=null;$('td56Back').textContent='← More';window.takActivate(3);more.hidden=true;page.hidden=false;open=true;const g=quickGame||td66SavedGame()||'';quickGame='';if(game.value!==g){game.value=g;game.onchange?.()}window.scrollTo(0,0)};
 $('td56Back').onclick=()=>{page.hidden=true;open=false;revision++;run++;closeSuggestions();const back=td73CompareReturn;td73CompareReturn=null;$('td56Back').textContent='← More';if(back?.origin==='team-planner'){window.td5ReturnTeamPlanner?.(back.scroll);}else if(back?.origin==='dex'||back?.origin==='dex-type'){
  window.takActivate(2);
  if(back.origin==='dex-type')window.td4RestoreExplorer?.();
  requestAnimationFrame(()=>window.scrollTo(0,back.scroll));
 }else if(back?.origin==='planner'){openTool('plannerPage',3);requestAnimationFrame(()=>window.scrollTo(0,back.scroll));}else if(back?.origin==='battle'){window.takActivate(1);requestAnimationFrame(()=>window.scrollTo(0,back.scroll));}else if(window.td4HasExplorer?.()){window.takActivate(2);window.td4RestoreExplorer?.();}else window.takActivate(3)};
 for(const tab of ['teamsTab','battleTab','dexTab','moreTab'])$(tab).addEventListener('click',()=>{page.hidden=true;open=false;td73CompareReturn=null;revision++;run++;closeSuggestions()});
})();
// V60 — one game pack now includes artwork for offline Pokédex and battles.
// V59 — one selectable game, one consolidated data download; safe cleanup.
// Keep existing reference and encounter cache formats for backwards compatibility.
(function initOfflineDataV59(){
 const more=$('morePage');if(!more||document.getElementById('td59OfflinePage'))return;
 const REF_PREFIX='takdex-reference-v58-',ART_PREFIX='takdex-artwork-v60-',BASE='https://pokeapi.co/api/v2/';
 const SPRITES_ROOT='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';
 const CSV_ROOT='https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/';
 const LEGACY=more.querySelector('.offline-card');if(LEGACY)LEGACY.remove();
 const launch=document.createElement('button');launch.type='button';launch.className='tool-link';launch.id='td59OpenOffline';launch.textContent='↓ Offline Data ›';
 (more.querySelector('.tool-card')||more).appendChild(launch);
 const footer=document.querySelector('footer');if(footer&&footer.textContent.includes('optional full download'))footer.textContent=footer.textContent.replace('offline requires the optional full download','choose your game under More → Offline Data');
 const page=document.createElement('section');page.id='td59OfflinePage';page.hidden=true;
 page.innerHTML=`<div class="bar"><h2>Offline Data</h2><button type="button" id="td59Back">← More</button></div>
 <div class="tool-card"><label for="td59Game">Choose game<select id="td59Game"><option value="">Choose game…</option>${gameOptions}</select></label>
 <ul class="note" id="td59Legend" aria-label="Pack status legend"></ul></div>
 <div class="card td59-card"><h3 id="td59Name">Game data pack</h3>

 <p id="td59State" class="note" aria-live="polite">Checking downloaded data…</p>
 <p id="td59Progress" class="note" aria-live="polite"></p>
 <div class="td59-actions"><button type="button" class="td774-secondary" id="td59Download">Download pack</button><button type="button" class="td774-secondary" id="td59Delete">Remove pack</button></div></div>
 <div class="card td59-card">
 <button type="button" class="td59-delete td59-clear" id="td59Clear">Clear all downloaded packs and old offline data</button></div>
 <p class="note">Artwork downloads can use significant storage.</p>`;
 document.querySelector('main').appendChild(page);
 const css=document.createElement('style');css.textContent=`
 #td59OfflinePage .td59-card{margin:13px 0;padding:16px}
 #td59OfflinePage .td59-card h3{margin:0 0 9px;font-size:1.05rem}
 #td59OfflinePage .td59-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;align-items:stretch}
 #td59OfflinePage .td59-actions button{width:100%;min-width:0;height:44px;padding:8px;font-size:.9rem}
 #td59OfflinePage .td59-delete{background:transparent!important;color:var(--text,#eee)!important;border:1px solid var(--edge,#555)!important;box-shadow:none!important}
 #td59OfflinePage .td59-delete:disabled{opacity:.35}
 #td59OfflinePage .td59-card .note{overflow-wrap:anywhere}
 #td59OfflinePage #td59Saved>div{padding:7px 0;border-bottom:1px solid var(--edge,#444)}
 #td59OfflinePage .td59-clear{width:100%;margin-top:12px;padding:11px 9px;font-size:.9rem}
 `;document.head.appendChild(css);
 const game=$('td59Game'), state=$('td59State'), progress=$('td59Progress');
 const downloadBtn=$('td59Download'),deleteBtn=$('td59Delete'),clearBtn=$('td59Clear');
 const slug=g=>g.toLowerCase().replace(/[^a-z0-9]+/g,'-');
 const refCacheName=g=>REF_PREFIX+slug(g);
 const refKey=g=>new URL('takdex-reference-v58/'+slug(g)+'.json',/^https?:/.test(location.href)?location.href:'https://takdex.invalid/').href;
 const caps=[151,251,386,493,649,721,809,905,1025];
 const maxFor=g=>caps[gameGeneration(g)-1]||1025;
 const artCacheName=g=>ART_PREFIX+slug(g);
 const artKey=g=>new URL('takdex-artwork-v60/'+slug(g)+'.json',/^https?:/.test(location.href)?location.href:'https://takdex.invalid/').href;
 async function cachedArtwork(g){
  if(!('caches' in window)||!(await caches.keys()).includes(artCacheName(g)))return null;
  try{const r=await(await caches.open(artCacheName(g))).match(artKey(g));if(!r)return null;
   const meta=await td79Data.read(r,m=>m?.schema===60&&m.game===g&&typeof m.complete==='boolean'&&Number.isInteger(m.expected));
   if(!meta)return {complete:false,invalid:true};
   if(meta.complete){
    const cache=await caches.open(artCacheName(g)),keys=new Set((await cache.keys()).map(request=>request.url));
    for(let id=1;id<=maxFor(g);id++){
     if(!keys.has(SPRITES_ROOT+'other/official-artwork/'+id+'.png')||!keys.has(SPRITES_ROOT+id+'.png'))return {...meta,complete:false,invalid:true};
    }
   }
   return meta;
  }catch{return null}
 }
 // Pack artwork is intentionally stored under the ORIGINAL image URLs, so all screens
 // (Pokédex, evolutions, Battle, 6v6, comparison and explorer) share one image cache.
 async function downloadArtwork(g,report,signal){
  if(!('caches' in window))throw Error('Offline image storage unavailable');
  const store=await caches.open(artCacheName(g));
  const sharedStores=await Promise.all((await caches.keys()).filter(k=>k.startsWith(ART_PREFIX)&&k!==artCacheName(g)).map(k=>caches.open(k)));
  const cap=maxFor(g),urls=[];
  for(let id=1;id<=cap;id++){
   urls.push(SPRITES_ROOT+'other/official-artwork/'+id+'.png');
   urls.push(SPRITES_ROOT+id+'.png');
  }
  let completed=0,failed=0,saved=0,bytes=0,next=0;
  await store.put(artKey(g),new Response(JSON.stringify({schema:60,game:g,complete:false,expected:urls.length,completed:0,saved:0,failed:0}),{headers:{'Content-Type':'application/json'}}));
  const progress=()=>report('Artwork '+completed+'/'+urls.length+' images · '+failed+' unavailable');
  progress();
  async function worker(){
   while(next<urls.length&&!signal?.aborted){const url=urls[next++];let hit=false;
    try{
     const old=await store.match(url);
     const valid=response=>response?.ok&&/^image\//i.test(response.headers.get('content-type')||'');
     if(valid(old)){hit=true;saved++}
     else {
      // Existing downloaded game artwork can be copied locally, without redownloading.
      for(const shared of sharedStores){const copy=await shared.match(url);if(valid(copy)){await store.put(url,copy.clone());saved++;hit=true;break}}
      let lastError;
      for(let attempt=0;attempt<2&&!hit&&!signal?.aborted;attempt++){
       try{
        await td79Data.request(url,{mode:'cors',cache:'no-store',signal},async response=>{
         if(!valid(response))throw Error('Not an image');
         const body=await response.clone().blob();
         if(!body.size)throw Error('Empty artwork');
         await store.put(url,response);bytes+=body.size;
        });
        saved++;hit=true;
       }catch(e){lastError=e}
      }
      if(!hit)throw lastError||Error('Image unavailable');
     }
    }catch(e){failed++}
    completed++;
    if(completed%12===0||completed===urls.length)progress();
   }
  }
  await Promise.all(Array.from({length:Math.min(5,urls.length)},worker));
  const meta={schema:60,game:g,complete:!signal?.aborted&&completed===urls.length&&failed===0,expected:urls.length,completed,saved,failed,bytes,created:new Date().toISOString()};
  await store.put(artKey(g),new Response(JSON.stringify(meta),{headers:{'Content-Type':'application/json'}}));
  window.dispatchEvent(new Event('td58-pack-update'));
  if(failed)throw Error(failed+' image files could not be downloaded. Retry to resume.');
  return meta;
 }
 async function removeArtwork(g){if('caches' in window)await caches.delete(artCacheName(g));window.takDexArtV60?.reset?.();}
 const taskState={busy:false,token:0};let visible=false;
 const OFFLINE_PROGRESS_KEY='takdex-v70-pack-progress';
 let lastProgressWrite=0;
 function setProgress(g,message,force=false){
  progress.textContent=message;
  if(!games.includes(g))return;
  const now=Date.now();if(!force&&now-lastProgressWrite<1200)return;
  lastProgressWrite=now;
  try{localStorage.setItem(OFFLINE_PROGRESS_KEY,JSON.stringify({game:g,message,time:now}))}catch{}
 }
 function restoreProgress(g){try{const p=JSON.parse(localStorage.getItem(OFFLINE_PROGRESS_KEY)||'null');return p?.game===g?p.message:''}catch{return ''}}


 const rows=text=>{const lines=text.trim().split(/\r?\n/),head=lines.shift().split(',');return lines.filter(Boolean).map(line=>{const parts=line.split(',');return Object.fromEntries(head.map((h,i)=>[h,(parts[i]||'').trim()]))})};
 const referenceLists=['pokemon?limit=2000','pokemon-species?limit=2000','move?limit=2000','evolution-chain?limit=1000'];
 const referencePath=(kind,id)=>BASE+kind+'/'+id+'/';
 const referenceRecord=(store,url)=>store.match(url).then(response=>
  td79Data.read(response,data=>td79Data.apiShape(url.slice(BASE.length),data)));
 async function verifyReference(store,g){
  const keys=new Set((await store.keys()).map(request=>request.url)),cap=maxFor(g),dependents=new Set();
  const planned=referenceLists.map(path=>BASE+path);
  for(let id=1;id<=cap;id++)planned.push(referencePath('pokemon',id),referencePath('pokemon-species',id));
  if(planned.some(url=>!keys.has(url)))return false;
  let next=0,valid=true;
  async function check(urls,inspect){
   next=0;
   await Promise.all(Array.from({length:5},async()=>{
    while(valid&&next<urls.length){
     const url=urls[next++],data=await referenceRecord(store,url);
     if(!data)valid=false;else if(inspect)inspect(url,data);
    }
   }));
  }
  await check(planned,(url,data)=>{
   if(url.startsWith(BASE+'pokemon/'))for(const move of data.moves){
    if(move.version_group_details.some(v=>v.version_group.name===vg[g]))dependents.add(move.move.url);
   }
   if(url.startsWith(BASE+'pokemon-species/'))dependents.add(data.evolution_chain.url);
  });
  if(!valid||[...dependents].some(url=>!keys.has(url)))return false;
  await check([...dependents]);
  return valid;
 }
 async function cachedReference(g,{verify=false}={}){
  if(!('caches'in window)||!(await caches.keys()).includes(refCacheName(g)))return null;
  const store=await caches.open(refCacheName(g));
  const data=await td79Data.read(await store.match(refKey(g)),d=>d?.schema===58&&d.game===g&&
   typeof d.complete==='boolean'&&td79Data.machineRows(d.machines));
  if(!data)return {complete:false,invalid:true,machines:[]};
  if(data.complete&&verify&&(!data.machines.length||!await verifyReference(store,g)))return {...data,complete:false,invalid:true};
  return {...data,verified:verify&&data.complete};
 }
 async function machineInventory(g){
  try{const local=await window.takDexDB74?.machines(vg[g]);if(local?.length)return {rows:local,source:'Bundled PokéAPI snapshot'};}catch{}
  const meta=await cachedReference(g);
  return meta?.machines?.length?{rows:meta.machines,source:'Downloaded TM/HM catalog'}:null;
 }
 async function machinesFor(g){return (await machineInventory(g))?.rows||null;}
 window.takDexReferenceV58={machinesFor,machineInventory,cached:cachedReference};
 async function downloadReference(g,report,signal){
  if(!('caches' in window))throw Error('Offline storage not supported by this browser');
  const store=await caches.open(refCacheName(g));
  const prior=await cachedReference(g,{verify:true});
  let saved=0,failed=0,requests=0;const failures=[];
  if(!prior?.complete)await store.put(refKey(g),new Response(JSON.stringify({schema:58,game:g,complete:false,created:new Date().toISOString(),saved:0,requests:0,failed:0,machines:[]}),{headers:{'content-type':'application/json'}}));
  const progress=msg=>report(msg+' · '+saved+' saved / '+requests+' checked'+(failed?' · '+failed+' failed':''));
  const names=(await caches.keys()).filter(name=>name!==refCacheName(g)&&name.startsWith(REF_PREFIX));
  const sharedStores=await Promise.all(names.map(name=>caches.open(name)));
  async function shared(url){
   for(const cache of sharedStores){
    const hit=await cache.match(url);
    if(await td79Data.read(hit?.clone(),data=>td79Data.apiShape(url.slice(BASE.length),data)))return hit;
   }
   return null;
  }
  async function put(url){
   if(signal?.aborted)throw signal.reason;
   requests++;
   try{
    const data=await td79Data.ensure(store,url,data=>td79Data.apiShape(url.slice(BASE.length),data),{shared,signal});
    saved++;return data;
   }catch(error){
    if(signal?.aborted)throw error;
    failed++;failures.push(url);return null;
   }
  }
  async function work(urls,label,process){
   let done=0,next=0;progress(label);
   const unique=[...new Set(urls)];
   async function run(){
    while(next<unique.length&&!signal?.aborted){
     const data=await put(unique[next++]);
     if(data&&process)process(data);
     done++;
     if(done%15===0||done===unique.length)progress(label+' · '+done+'/'+unique.length);
    }
   }
   const results=await Promise.allSettled(Array.from({length:Math.min(5,unique.length||1)},run));
   if(signal?.aborted)throw signal.reason;
   const failure=results.find(result=>result.status==='rejected');
   if(failure)throw failure.reason;
  }
  progress('Saving Pokémon search indexes');
  for(const path of referenceLists)await put(BASE+path);
  const cap=maxFor(g),moveLinks=new Set(),evoLinks=new Set(),chosenGroup=vg[g];
  const pokemonUrls=Array.from({length:cap},(_,i)=>BASE+'pokemon/'+(i+1)+'/');
  await work(pokemonUrls,'Pokémon details',p=>{
   for(const x of p.moves||[])if(x.version_group_details?.some(v=>v.version_group?.name===chosenGroup))moveLinks.add(x.move.url);
  });
  const speciesUrls=Array.from({length:cap},(_,i)=>BASE+'pokemon-species/'+(i+1)+'/');
  await work(speciesUrls,'Species and evolutions',p=>{if(p.evolution_chain?.url)evoLinks.add(p.evolution_chain.url)});
  await work([...evoLinks],'Evolution chains');
  await work([...moveLinks],'Moves available in this version group');
  // CSV machine numbers allow us to avoid downloading every other game's machine records.
  let machines=[];
  try{
   report('Building game-specific TM/HM catalog…');
   const local=await window.takDexDB74?.machines(chosenGroup).catch(()=>null);
   if(local?.length){machines=local;}else{
   const files=await Promise.all(['machines','version_groups','items','moves'].map(async n=>{
    return td79Data.request(CSV_ROOT+n+'.csv',{signal},async res=>rows(await res.text()));
   }));
   const [machineRows,versionGroups,items,moves]=files;
   const correctedGroup=chosenGroup==='brilliant-diamond-and-shining-pearl'?'brilliant-diamond-shining-pearl':chosenGroup;
   const groupId=versionGroups.find(x=>x.identifier===correctedGroup)?.id;
   if(!groupId)throw Error('No TM/HM group for '+g);
   const itemMap=new Map(items.map(x=>[x.id,x.identifier]));const moveMap=new Map(moves.map(x=>[x.id,x.identifier]));
   machines=machineRows.filter(x=>x.version_group_id===groupId).map(x=>({item:itemMap.get(x.item_id),move:moveMap.get(x.move_id)})).filter(x=>x.item&&x.move);
   machines.sort((a,b)=>a.item.localeCompare(b.item,undefined,{numeric:true}));
   if(!machines.length)throw Error('Game-specific TM/HM list unavailable in PokéAPI CSV');
   }
  }catch(e){failed++;failures.push('TM/HM catalog: '+e.message)}
  if(signal?.aborted)throw signal.reason;
  const previous=await cachedReference(g,{verify:true});
  const meta={schema:58,game:g,complete:failed===0,created:new Date().toISOString(),saved,requests,failed,machines,
   note:'Generation-filtered reference records, not verified game-specific obtainable roster'};
  // Never replace a previously complete manifest with an incomplete retry.
  if(!previous?.complete||meta.complete)await store.put(refKey(g),new Response(JSON.stringify(meta),{headers:{'content-type':'application/json'}}));
  window.dispatchEvent(new Event('td58-pack-update'));
  if(failed)throw Error(failed+' records could not be saved. Retry to resume; existing records are preserved.');
  return meta;
 }
 async function removeReference(g){if('caches' in window)await caches.delete(refCacheName(g));window.dispatchEvent(new Event('td58-pack-update'))}

 const iconFor={ready:'🟢',partial:'🟠',missing:'⚪'};
 $('td59Legend').innerHTML=Object.entries(iconFor).map(([status,icon])=>
  `<li><span aria-hidden="true">${icon}</span><span>${word(status)}</span></li>`).join('');
 const packStates=new Map();
 const gameSelectIds=['game','editTeamGame','dexGame','planGame','tmGame','typeCheckGame','typeExplorerGame','td56Game','td59Game'];
 // Explicit option.value is critical: Team dialog options used to derive their value from text.
 function decorateGameSelects(){
  for(const id of gameSelectIds){const select=$(id);if(!select)continue;
   for(const option of select.options){const name=option.dataset.td59Game||option.value;
    if(!games.includes(name))continue;
    if(!option.dataset.td59Game){option.value=name;option.dataset.td59Game=name}
    const model=packStates.get(name);
    const label=id==='td59Game'&&model?iconFor[model.status]+' '+name+' · '+word(model.status):name;
    if(option.textContent!==label)option.textContent=label;
   }
  }
 }
 async function packStores(names,accept){
  return Promise.all(names.filter(accept).map(name=>caches.open(name)));
 }
 async function inspectPack(g,names){
  const cap=maxFor(g),refs=await packStores(names,name=>name.startsWith(REF_PREFIX)||name===OFFLINE_CACHE);
  const artwork=await packStores(names,name=>name.startsWith(ART_PREFIX)||name==='takdex-artwork-v26');
  const refKeys=new Set((await Promise.all(refs.map(store=>store.keys()))).flat().map(key=>key.url));
  const artKeys=new Set((await Promise.all(artwork.map(store=>store.keys()))).flat().map(key=>key.url));
  const read=async url=>{
   for(const store of refs){
    const record=await referenceRecord(store,url);
    if(record)return record;
   }
   return null;
  };
  const required=referenceLists.map(path=>BASE+path),images=[];
  for(let id=1;id<=cap;id++){
   required.push(referencePath('pokemon',id),referencePath('pokemon-species',id));
   images.push(SPRITES_ROOT+id+'.png',SPRITES_ROOT+'other/official-artwork/'+id+'.png');
  }
  let usableRef=false;
  const deps=new Set();
  const hasCore=required.every(url=>refKeys.has(url));
  async function validReferences(urls,discover){
   let next=0,complete=true;
   await Promise.all(Array.from({length:5},async()=>{
    while(next<urls.length){
     const url=urls[next++],data=await read(url);
     if(!data){complete=false;continue;}
     usableRef=true;
     if(!discover)continue;
     if(url.startsWith(BASE+'pokemon/'))for(const move of data.moves){
      if(move.version_group_details.some(v=>v.version_group.name===vg[g]))deps.add(move.move.url);
     }
     if(url.startsWith(BASE+'pokemon-species/'))deps.add(data.evolution_chain.url);
    }
   }));
   return complete;
  }
  let core=false;
  if(hasCore)core=await validReferences(required,true);
  if(!core&&!usableRef)for(const url of required){
   if(refKeys.has(url)&&await read(url)){usableRef=true;break;}
  }
  const artValid=async url=>{
   if(!artKeys.has(url))return false;
   for(const store of artwork){
    const hit=await store.match(url);
    if(hit?.ok&&/^image\//i.test(hit.headers.get('content-type')||'')&&(await hit.blob()).size)return true;
   }
   return false;
  };
  let usableArt=false,completeArt=images.every(url=>artKeys.has(url));
  for(const url of images){
   if(await artValid(url))usableArt=true;
   else completeArt=false;
   if(usableArt&&!completeArt)break;
  }
  const [enc,trainers,machines]=await Promise.all([
   window.takDexEncounterV55.cached(g,{storedOnly:true}),
   g==='Platinum'?td70PlatinumTrainerCached():true,
   Promise.all(games.filter(other=>vg[other]===vg[g]).map(other=>cachedReference(other)))
  ]);
  const hasMachines=machines.some(meta=>meta?.machines?.length);
  const completeRef=core&&hasMachines&&await validReferences([...deps],false);
  const completeEncounter=!!enc?.hasSource&&enc.schema>=64;
  const status=completeRef&&completeEncounter&&completeArt&&trainers?'ready':
   usableRef||hasMachines||usableArt||enc?.hasSource||g==='Platinum'&&trainers?'partial':'missing';
  return {status,ref:{complete:completeRef},enc,art:{complete:completeArt},trainers,
   local:names.includes(refCacheName(g))||names.includes(artCacheName(g))||!!enc||g==='Platinum'&&!!trainers};
 }
 async function getState(g){return inspectPack(g,'caches'in window?await caches.keys():[]);}
 function refreshStatusMap(){decorateGameSelects();return Promise.resolve();}
 document.addEventListener('focusin',e=>{if(e.target?.tagName==='SELECT')decorateGameSelects()},true);
 document.addEventListener('pointerdown',e=>{if(e.target?.closest?.('select'))decorateGameSelects()},true);
 window.takDexOfflineV59={refreshIndicators:refreshStatusMap};
 function word(status){return {ready:'Downloaded',partial:'Partial download',missing:'Not downloaded'}[status]}
 async function hasLegacyCache(){
  try{const keys=await caches.keys();if(keys.some(k=>['takdex-pokeapi-records-v1','takdex-artwork-v26'].includes(k)))return true}catch{}
  try{if(localStorage.getItem('takdex-offline-full-v26'))return true;for(let i=0;i<localStorage.length;i++)if(localStorage.key(i)?.startsWith('pt-v2:'))return true}catch{}
  return td70HasAPICache();
 }
 async function update(){
  const g=game.value,token=++taskState.token;
  try{
   await refreshStatusMap();
   if(games.includes(g)){
    const selected=await getState(g,true);
    if(token!==taskState.token)return;
    packStates.set(g,selected);decorateGameSelects();
   }
  }catch(e){
   if(token===taskState.token)state.textContent='Pack status unavailable.';
   return;
  }
  if(token!==taskState.token)return;
  const model=packStates.get(g);
  $('td59Name').textContent='Game pack';
  if(model){
   const {status}=model;
   state.textContent=iconFor[status]+' '+word(status);
   downloadBtn.textContent=taskState.download?'Cancel download':status==='ready'?'✓ Downloaded':status==='partial'?'Resume download':'Download pack';
   downloadBtn.disabled=!taskState.download&&(taskState.busy||status==='ready');
   deleteBtn.disabled=taskState.busy||!model.local;
  }else{
   state.textContent='Choose a game to manage its pack.';
   downloadBtn.textContent='Download pack';
   downloadBtn.disabled=true;deleteBtn.disabled=true;
  }
  const hasData=('caches'in window&&(await caches.keys()).some(name=>name.startsWith(REF_PREFIX)||name.startsWith(ART_PREFIX)||name==='takdex-encounter-catalog-v55'||name===TD70_PLATINUM_TRAINER_CACHE))||await hasLegacyCache();
  if(token===taskState.token)clearBtn.disabled=taskState.busy||!hasData;
 }
 function setBusy(busy){taskState.busy=busy;game.disabled=busy;downloadBtn.disabled=busy;deleteBtn.disabled=busy;clearBtn.disabled=busy;}
 async function downloadGame(){
  if(taskState.busy){taskState.download?.abort();return;}
  const g=game.value;if(!games.includes(g)){progress.textContent='Choose a game first.';return}
  setBusy(true);const controller=new AbortController(),signal=controller.signal;taskState.download=controller;
  downloadBtn.disabled=false;downloadBtn.textContent='Cancel download';let errors=[];
  setProgress(g,'Starting '+g+' pack download…',true);
  try{
   const existing=await getState(g,true);
   if(!existing.ref?.complete){
    setProgress(g,'Downloading '+g+' reference data…',true);
    try{await downloadReference(g,txt=>setProgress(g,'↻ '+txt),signal)}catch(e){errors.push('Reference: '+(e.message||e))}
   }
   if(!signal.aborted&&(!existing.enc?.hasSource||existing.enc?.schema<64)){
    setProgress(g,'Downloading '+g+' encounter locations…',true);
    try{await window.takDexEncounterV55.refresh(g,txt=>setProgress(g,'↻ '+txt),signal)}catch(e){errors.push('Encounters: '+(e.message||e))}
   }
   if(!signal.aborted&&!existing.art?.complete){
    setProgress(g,'Downloading '+g+' Pokémon artwork…',true);
    try{await downloadArtwork(g,txt=>setProgress(g,'↻ '+txt),signal)}catch(e){errors.push('Artwork: '+(e.message||e))}
   }
   if(!signal.aborted&&g==='Platinum'&&!(await td70PlatinumTrainerCached())){
    setProgress(g,'Downloading verified Platinum trainer moves…',true);
    try{await td70PlatinumTrainerCatalog()}catch(e){errors.push('Trainer moves: '+(e.message||e))}
   }
   const final=await getState(g,true);
   setProgress(g,signal.aborted?'Download cancelled. Saved records can be reused.':errors.length?'⚠ '+errors.join(' | '):final.status==='ready'?'':'⚠ Pack is partial; some source data is missing. Retry to resume.',true);
  }finally{taskState.download=null;setBusy(false);await update()}
 }
 async function removeGame(){
  if(taskState.busy)return;
  const g=game.value;if(!games.includes(g))return;const existing=await getState(g);
  if(!existing.local)return;
  if(!await td78Confirmation('Remove the '+g+' offline pack?','This removes its reference and encounter records.','Remove'))return;
  setBusy(true);
  try{await removeReference(g);await window.takDexEncounterV55.remove(g);await removeArtwork(g);if(g==='Platinum'){await caches.delete(TD70_PLATINUM_TRAINER_CACHE);td70TrainerCatalogPromise=null}setProgress(g,'Pack removed.',true)}
  catch(e){progress.textContent='⚠ Could not remove '+g+': '+(e.message||e)}
  finally{setBusy(false);await update()}
 }
 async function clearAll(){
  if(taskState.busy)return;
  const msg='Delete ALL downloaded game packs AND older offline databases?\n\nSaved teams, nicknames, movesets and preferences will NOT be deleted.\n\nThis cannot be undone.';
  if(!await td78Confirmation('Delete offline packs?',msg,'Delete'))return;
  setBusy(true);progress.textContent='Removing game packs and old offline records…';
  try{
   // Clearing the catalog's in-memory map matters: otherwise removed games remain usable until reload.
   await window.takDexEncounterV55.clearAll();
   if('caches' in window){for(const k of await caches.keys()){
    if(k.startsWith(REF_PREFIX)||k.startsWith(ART_PREFIX)||['takdex-encounter-catalog-v55','takdex-pokeapi-records-v1','takdex-artwork-v26'].includes(k))await caches.delete(k);
   }}
   try{for(let i=localStorage.length-1;i>=0;i--){const key=localStorage.key(i);if(key&&(key.startsWith('pt-v2:')||key==='takdex-offline-full-v26'))localStorage.removeItem(key)}}catch{}
   await td70ClearAPICache();
   if('caches'in window)await caches.delete(TD70_PLATINUM_TRAINER_CACHE);
   td70TrainerCatalogPromise=null;
   window.takDexArtV60?.reset?.();
   progress.textContent='✓ Downloaded data and artwork cleared. Your saved teams and preferences were kept.';
  }catch(e){progress.textContent='⚠ Cleanup was incomplete: '+(e.message||e)}
  finally{setBusy(false);await update()}
 }
 downloadBtn.addEventListener('click',downloadGame);
 deleteBtn.addEventListener('click',removeGame);
 clearBtn.addEventListener('click',clearAll);
 game.onchange=()=>{progress.textContent=restoreProgress(game.value);update()};
 launch.onclick=()=>{window.takActivate(3);more.hidden=true;page.hidden=false;visible=true;
  if(!taskState.busy)game.value=td66SavedGame()||'';
  progress.textContent=taskState.busy?progress.textContent:restoreProgress(game.value);
  update();window.scrollTo(0,0)};
 $('td59Back').onclick=()=>{page.hidden=true;visible=false;window.takActivate(3)};
 for(const tab of ['teamsTab','battleTab','dexTab','moreTab'])$(tab).addEventListener('click',()=>{page.hidden=true;visible=false});
 window.addEventListener('td58-pack-update',async()=>{
  if(taskState.busy)return;
  try{
   if(visible)await update();else await refreshStatusMap();
  }catch(e){console.warn('Game pack status:',e)}
 });
 decorateGameSelects();refreshStatusMap().catch(e=>console.warn('Game pack status:',e));
})();


// V60 — retrieve per-game downloaded images for all Pokémon views in airplane mode.
// A normal <img> tag cannot directly read CacheStorage; a cached Response is converted
// to an object URL and swapped into the image when offline (or after network failure).
(function initOfflineArtworkV60(){
 const blobURLs=new Map(),pending=new Map(),rejected=new Set();let artEpoch=0;
 const allowed=url=>{try{const u=new URL(url,location.href);return u.hostname==='raw.githubusercontent.com'&&u.pathname.startsWith('/PokeAPI/sprites/master/sprites/pokemon/')&&u.pathname.endsWith('.png')}catch{return false}};
 function reset(){++artEpoch;for(const img of document.images){if(img.src.startsWith("blob:")&&img.dataset.td60Original)img.src=img.dataset.td60Original;}for(const url of blobURLs.values())URL.revokeObjectURL(url);blobURLs.clear();pending.clear();rejected.clear()}
 async function resolve(src){
  if(!allowed(src)||rejected.has(src))return null;
  if(blobURLs.has(src))return blobURLs.get(src);
  if(pending.has(src))return pending.get(src);
  const epoch=artEpoch;const task=(async()=>{
   if(!('caches' in window))return null;
   const alternate=src.includes('/other/official-artwork/')?src.replace('/other/official-artwork/','/'):src.replace('/sprites/pokemon/','/sprites/pokemon/other/official-artwork/');
   // CacheStorage.match checks all existing game packs; no per-image enumeration of
   // thousands of image records or sequential open() of every game cache.
   let preferred=null;
   try{const selectedId=localStorage.getItem('takdex-v71-active-team');const t=td78Store.entry(td78Store.read().state,'teams',selectedId).value;const g=t?.game||localStorage.getItem('takdex-v66-game')||'';
    if(g)preferred=await caches.open('takdex-artwork-v60-'+String(g).toLowerCase().replace(/[^a-z0-9]+/g,'-'));
   }catch{}
   for(const candidate of [src,alternate]){
    const response=await preferred?.match(candidate)||await caches.match(candidate);
    if(!response||response.type==='opaque'||!response.ok)continue;
    const blob=await response.blob();if(!blob.size||!blob.type.startsWith('image/')||epoch!==artEpoch)continue;
    const url=URL.createObjectURL(blob);blobURLs.set(src,url);return url;
   }
   return null;
  })().catch(()=>null).finally(()=>pending.delete(src));
  pending.set(src,task);return task;
 }
 async function replace(img){
  if(!img||img.tagName!=='IMG'||!img.isConnected)return;
  const original=img.getAttribute('src')||'';
  if(!allowed(original)||img.dataset.td60Pending===original)return;
  img.dataset.td60Pending=original;
  const local=await resolve(original);
  if(img.isConnected&&(img.getAttribute('src')||'')===original&&local){img.dataset.td60Original=original;img.style.visibility='';img.src=local}
  if(img.dataset.td60Pending===original)delete img.dataset.td60Pending;
 }
 function scan(node){if(node.nodeType!==1)return;
  if(node.tagName==='IMG')replace(node);
  if(node.querySelectorAll)node.querySelectorAll('img').forEach(replace);
 }
 document.addEventListener('error',e=>{const img=e.target;if(img?.tagName!=='IMG')return;if(img.src.startsWith('blob:')&&img.dataset.td60Original){const src=img.dataset.td60Original;rejected.add(src);const bad=blobURLs.get(src);blobURLs.delete(src);if(bad)URL.revokeObjectURL(bad);return;}replace(img)},true);
 const observer=new MutationObserver(records=>{
  for(const r of records){if(r.type==='attributes')scan(r.target);else for(const n of r.addedNodes)scan(n)}
 });
 observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['src']});
 scan(document.body);
 window.addEventListener('offline',()=>scan(document.body));
 window.addEventListener('pageshow',e=>{if(e.persisted){reset();scan(document.body);}});
 window.addEventListener('td58-pack-update',()=>{reset();scan(document.body)});
 window.takDexArtV60={reset,resolve};
})();

// V65 mobile polish: four-slot editor and consistent two-line attack rows.
(function(){const s=document.createElement('style');s.id='td65-style';s.textContent=`
 #plannerPage .td65-moves-label{font-weight:700;font-size:.86rem;color:var(--text)}
 #plannerPage .td65-move-slot{display:grid;grid-template-columns:22px minmax(0,1fr) 28px;align-items:start;gap:8px;min-width:0}
 #plannerPage .td65-move-number{padding-top:13px;font-weight:700;color:var(--muted);text-align:center}
 #plannerPage .td65-move-search{display:grid;grid-template-columns:minmax(0,1fr) 39px;position:relative;border:1px solid var(--edge);border-radius:10px;min-width:0;overflow:visible;background:var(--bg)}
 #plannerPage .td65-move-search input{min-width:0;width:100%;height:44px;margin:0;padding:7px 9px;border:0!important;box-shadow:none!important;background:transparent!important;color:var(--text)!important;font-size:.86rem}
 #plannerPage .td65-browse{width:39px;height:44px;margin:0;padding:0!important;background:transparent!important;color:var(--text)!important;border:0!important;border-left:1px solid var(--edge)!important;border-radius:0!important;box-shadow:none!important}
 #plannerPage .td65-clear{padding:0!important;width:28px;height:44px;background:transparent!important;color:var(--muted)!important;box-shadow:none!important;border:0!important}
 #plannerPage .td65-move-options{grid-column:1/-1;position:absolute;z-index:90;top:100%;left:0;right:0;max-height:210px;overflow-y:auto;background:var(--card);border:1px solid var(--edge);border-radius:9px}
 #plannerPage .td65-move-options button{display:block;width:100%;padding:9px 11px;text-align:left;font-size:.85rem}
 #plannerPage .td65-attackline{display:grid!important;grid-template-columns:1fr!important;gap:5px!important;padding:10px 5px!important;min-width:0}
 #plannerPage .td65-attackline .td65-attackhead{display:flex;align-items:center;gap:7px;min-width:0}
 #plannerPage .td65-attackline .td65-attackhead b{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1}
 #plannerPage .td65-attackline .td65-attackhead .pill{flex:none}
 #plannerPage .td65-attackline .td65-attackdetail{display:block;line-height:1.5;font-size:.79rem;color:var(--muted)}
 #plannerPage .td65-defense-tag{font-size:.72rem;line-height:1.4;font-weight:750}
 `;document.head.appendChild(s)})();

(function(){const el=document.createElement('style');el.textContent=`#plannerPage .td65-head-move{display:flex;align-items:center;gap:8px;flex-wrap:wrap;min-width:0}#plannerPage .td65-rank-clarity{font-size:.72rem}`;document.head.appendChild(el)})();

// V66: The unfinished team optimizer is intentionally removed. Revisit only after move/obtainability data is reliable.
// V66 — Game selector preference shared across the app; no silent reset to Emerald.
(function initGlobalGameV70(){
 const ids=['game','editTeamGame','dexGame','planGame','tmGame','typeCheckGame','typeExplorerGame','td56Game','td59Game'];
 const saved=td66SavedGame();
 for(const id of ids){
  const el=$(id);if(!el)continue;
  el.dataset.td66GlobalGame='1';
  const previous=el.value;
  if(![...el.options].some(o=>o.value===''))el.insertAdjacentHTML('afterbegin','<option value="">Choose game…</option>');
  if(id==='dexGame'&&![...el.options].some(o=>o.value==='All Games'))el.insertAdjacentHTML('beforeend','<option value="All Games">All Games · Complete Pokédex</option>');
  el.value=id==='editTeamGame'&&current?.game?current.game:(saved||'');
  el.addEventListener('change',()=>{
   if(el.value==='All Games'&&(id==='dexGame'||id==='typeExplorerGame')){td66RememberDexChoice('All Games');refreshTeamMenus();return}
   if(!games.includes(el.value)||['game','editTeamGame'].includes(id))return;
   if(current&&current.game!==el.value){current=null;$('editor').hidden=true;try{localStorage.removeItem('takdex-v71-active-team')}catch{}}
   td66RememberGame(el.value);
   refreshTeamMenus();
  });
 }
 const oldOpenPlanner=$('openPlanner').onclick;
 $('openPlanner').onclick=function(e){oldOpenPlanner?.call(this,e);const g=td66SavedGame();if(g&&$('planGame').value!==g){$('planGame').value=g;syncPlanner()}};
 // Each game selector is handled above; do not override New Team's uncommitted choice.
})();
// V66 — Matchup, planner and Pokédex presentation (uses existing type mechanics).
(function(){const style=document.createElement('style');style.textContent=`
 #dexResult .td66-pokemon-card{padding:10px 12px;margin:12px 0}
 #dexResult .td66-pokemon-card .dex-entry{border:0;box-shadow:none;background:transparent;padding:6px 3px}
 #dexResult .td66-pokemon-card .td66-type-match{margin:10px 0 0}
 #dexResult .td66-dex-section{padding:0;overflow:hidden;margin:12px 0}
 #dexResult .td66-dex-section>summary,#td65MachineGuide>summary{cursor:pointer;list-style:none;padding:13px 15px;font-weight:750;display:flex;align-items:center;justify-content:space-between;gap:9px}
 #dexResult .td66-dex-section>summary::-webkit-details-marker,#td65MachineGuide>summary::-webkit-details-marker{display:none}
 #dexResult .td66-section-body,#td65MachineGuide .td66-section-body{padding:0 14px 13px}
 #dexResult .td66-match-row{padding:10px 0;border-top:1px solid var(--edge)}
 #dexResult .td66-match-row>strong{display:block;margin-bottom:7px}
 #dexResult .td66-match-pills{display:flex;gap:7px;align-items:center;flex-wrap:wrap}
 #dexResult .td66-mult{font-size:.78rem;opacity:.8;margin-right:9px}
 #dexResult .td66-neutral{margin-top:10px}
 #plannerPage .rank-risk.td66-defense{font-size:.79rem;font-weight:800;line-height:1.3;text-align:right}
 #plannerPage .td70-defense-verdict{display:block;font-weight:850;white-space:normal}
 #plannerPage .td70-defense-source{display:block;font-weight:650;font-size:.74rem;line-height:1.35;opacity:.85;margin-top:3px;overflow-wrap:anywhere}
 #plannerPage .td66-defense-weak{color:#ff6b6b!important}
 #plannerPage .td66-defense-safe{color:#55d990!important}
 #plannerPage .td66-defense-neutral{color:var(--muted)!important}
 #plannerPage .td63-slot-fields label:has(.td66-pokemon-input){position:relative;display:block}
 #plannerPage .td66-pokemon-input{padding-right:45px}
 #plannerPage .td66-pokemon-browse{position:absolute;top:24px;right:0;width:42px;padding:4px;background:transparent;color:var(--text);box-shadow:none;border:0}
 #plannerPage .td66-pokemon-options{position:absolute;top:100%;left:0;right:0;z-index:115;max-height:240px;overflow:auto;background:var(--card);border:1px solid var(--edge)}
 #plannerPage .td66-pokemon-options button{display:block;width:100%;text-align:left;padding:9px 11px}
 `;document.head.appendChild(style)})();
// V66 — Search/browse all Pokémon from the existing offline-compatible species list.
(function initPlannerPokemonPickerV66(){
 const host=$('plannerPage');let seq=0;
 const close=()=>host.querySelectorAll('.td66-pokemon-options').forEach(e=>e.hidden=true);
 async function suggest(input,browse){const box=input.parentElement?.querySelector('.td66-pokemon-options');if(!box)return;const mine=++seq;
  close();box.hidden=false;box.innerHTML='<p class="note">Loading Pokémon…</p>';
  try{const entries=await listNames($('planGame').value);if(mine!==seq||!box.isConnected)return;
   const gen=gameGeneration($('planGame').value),limit=[151,251,386,493,649,721,809,905,1025][gen-1]||1025;
   const q=input.value.trim().toLowerCase().replace(/\s+/g,'-');const hits=td78SearchMatches(entries,q);
   box.innerHTML=(hits.length?hits.slice(0,browse?65:16).map(n=>`<button type="button" data-td66-pokemon="${safe(n)}">${safe(td41PokemonLabel(n))}</button>`).join(''):'<p class="note">No matching Pokémon.</p>')+(hits.length>65?'<p class="note">Type to narrow the list.</p>':'');
  }catch{box.innerHTML='<p class="note">Search index unavailable; enter Pokémon manually.</p>'}
 }
 host.addEventListener('input',e=>{if(e.target.matches('input.td66-pokemon-input')){if(e.target.value.trim())suggest(e.target,false);else close()}});
 host.addEventListener('click',e=>{
  const arrow=e.target.closest('[data-td66-pokemon-browse]');if(arrow){suggest(arrow.parentElement.querySelector('input'),true);return}
  const button=e.target.closest('[data-td66-pokemon]');if(button){const input=button.closest('label').querySelector('input.td66-pokemon-input');input.value=pretty(button.dataset.td66Pokemon);plannerEdit({target:input});input.dispatchEvent(new Event('change',{bubbles:true}));close();return}
  if(!e.target.closest('.td66-pokemon-options')&&!e.target.closest('input.td66-pokemon-input'))close();
 });
 host.addEventListener('keydown',e=>{if(e.key==='Escape')close();if(e.key==='Enter'&&e.target.matches('input.td66-pokemon-input')){const b=e.target.closest('label').querySelector('.td66-pokemon-options:not([hidden]) [data-td66-pokemon]');if(b){e.preventDefault();b.click()}}});
})();


// V68.1 — minimal saved-team chooser on the quick Battle page.
(function initQuickBattleTeamV681(){
 const battle=$('battlePage'), opponent=$('foeInput')?.closest('label');
 if(!battle||!opponent||$('td681BattleTeam'))return;
 const label=document.createElement('label');
 label.id='td681BattleTeamLabel';label.textContent='Choose your team';
 const select=document.createElement('select');select.id='td681BattleTeam';label.appendChild(select);
 $('td76BattleStrip').before(label);
 const style=document.createElement('style');style.id='td681-style';style.textContent=`
 #td681BattleTeamLabel{display:block;margin:12px 0 14px}
 #td681BattleTeam{display:block;width:100%;margin-top:6px}
 #dexResult .td681-move-row{padding:11px 0;border-bottom:1px solid var(--edge,#40434a);min-width:0}
 #dexResult .td681-move-row:last-child{border-bottom:0}
 #dexResult .td681-move-head{display:grid;grid-template-columns:44px minmax(0,1fr) auto;gap:8px;align-items:center;min-width:0}
 #dexResult .td681-move-head--advisor{grid-template-columns:minmax(0,1fr) auto}
 #dexResult .td681-level{font-size:.78rem;white-space:nowrap;color:var(--muted,#999)}
 #dexResult .td681-move-name-group{display:inline-flex;align-items:center;gap:5px;min-width:0;max-width:100%;white-space:nowrap;overflow:hidden}
 #dexResult .td681-move-name-group .td68-move-link{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:0 1 auto}
 /* Smart Move Advisor: keep full names visible beside STAB on narrow screens. */
 #dexResult .td681-move-head--advisor .td681-move-name-group{white-space:normal;overflow:visible;flex-wrap:wrap;max-width:none}
 #dexResult .td681-move-head--advisor .td681-move-name-group .td68-move-link{white-space:normal;overflow:visible;text-overflow:clip;overflow-wrap:normal;word-break:normal;flex:0 0 auto;max-width:100%}
 #dexResult .td681-stab{display:inline-flex;flex:none;white-space:nowrap;border:1px solid currentColor;border-radius:12px;font-size:.65rem;line-height:1.15;opacity:.85;padding:2px 5px}
 #dexResult .td681-type{white-space:nowrap;justify-self:end;min-width:0}
 #dexResult .td681-move-meta{display:flex;align-items:center;justify-content:space-between;gap:8px;min-width:0;margin-top:6px;font-size:.76rem;color:var(--muted,#aaa)}
 #dexResult .td681-move-meta>span:last-child{white-space:nowrap;text-align:right;font-variant-numeric:tabular-nums;font-size:.75rem}
 #dexResult .td681-learn-row .td681-move-meta{padding-left:52px}
 #dexResult .td681-move-row .td62-method{margin-top:6px;opacity:.85;font-size:.76rem}
 #dexResult .td62-row.td681-move-row{padding:11px 0}
 @media(max-width:360px){#dexResult .td681-move-head{grid-template-columns:38px minmax(0,1fr) auto;gap:5px}#dexResult .td681-move-head--advisor{grid-template-columns:minmax(0,1fr) auto;gap:8px}#dexResult .td681-learn-row .td681-move-meta{padding-left:43px}#dexResult .td681-move-meta{font-size:.71rem}#dexResult .td681-move-meta>span:last-child{font-size:.68rem}}
 `;document.head.appendChild(style);
 function refresh(){
  // V71 DEV3: Battle must supply a game to the game-filtered team options.
  // A manually selected game takes precedence; an opened team is the fallback.
  const game=td66SavedGame()||current?.game||'';
  const available=td71TeamForGame(game);
  const previous=select.value;
  select.innerHTML=teamOptions(game);
  // Prefer the opened team (if it belongs to this game), then the previous choice.
  const active=current?.game===game?current.id:'';
  select.value=available.some(t=>t.id===active)?active:
   available.some(t=>t.id===previous)?previous:'';
 }
 select.addEventListener('change',async()=>{
  const game=td66SavedGame()||current?.game||'';
  const chosenTeam=td71TeamForGame(game).find(t=>t.id===select.value);
  if(!chosenTeam){refresh();return}
  // Opening through Battle must persist to Pokédex, Planner and Team Builder too.
  openTeam(chosenTeam.id);
  refresh();
  // Preserve the opponent while recalculating its historical typing for this game.
  try{
   const [first,second]=await Promise.all([foe,foe2].map(p=>p?td76QuickOpponent(p,chosenTeam.game):null));
   if(current!==chosenTeam)return;
   foe=first;foe2=second;
  }catch{
   if(current!==chosenTeam)return;
   foe=null;foe2=null;$('foeInput').value='';$('foeInput2').value='';
  }
  showBattle();enrichTeamMoves();
 });
 $('battleTab').addEventListener('click',refresh);
 $('teams').addEventListener('click',()=>{if(!$('battlePage').hidden)refresh()});
 refresh();
})();

// DEV5.1 — a single compatibility tile renderer shared by both tools.
function td51Methods(p,name,g){const ds=takMoveMethodsForGame(p,name,g);return [...new Set(ds.map(d=>{const m=d.move_learn_method?.name;return m==='level-up'?(d.level_learned_at===0?'Start / evolution':Number.isInteger(d.level_learned_at)?'LVL '+d.level_learned_at:'Level-up'):m==='machine'?'TM/HM':m==='tutor'?'Tutor':m==='egg'?'Egg':pretty(m)}).filter(Boolean))].join(' · ');}
function td51CompatTiles(mons,checks,name,methods=false,machine=''){return Array.from({length:6},(_,i)=>{const m=mons[i],c=checks[i],status=!m?'unknown':c?.direct?.has(name)?'now':c?.later?.has(name)?'later':c&&!c.unknown?'never':'unknown';const label=status==='now'?c?.methods?.get(name)||'':status==='later'?'↑ '+(c?.laterMethods?.get(name)||'Evolution'):status==='unknown'&&m?'?':'';return `<span class="td74-mon-chip td5-tm-${status}" title="${status==='now'?'Compatible now':status==='later'?'After evolution':status==='never'?'Incompatible':'Unknown'}"><span class="td74-mon-art">${m?`<img alt="" loading="lazy" src="${safe(m.image||'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'+m.id+'.png')}">`:'+'}</span><span class="td74-mon-name">${safe(m?td41PokemonLabel(m.nickname||m.name):'Empty')}</span>${methods&&label?`<small class="td51-learn-method">${safe(machine?label.replace(/TM\/HM/g,machine.toUpperCase()):label)}</small>`:status==='later'?'<small>↑</small>':''}</span>`}).join('')}
async function td51CompatCheck(mon,game,evolve=true,machineOnly=false){try{return await td5LearnRecords(mon,game,evolve,machineOnly)}catch{return {direct:new Set(),later:new Set(),unknown:true}}}
// DEV5 — shared game-specific move compatibility. Evolution data is not a badge/progression guarantee.
const td5LearnCache=new Map();
async function td5LearnRecords(mon,game,evolve=true,machineOnly=false){const key=game+':'+(mon.id||mon.name)+':'+evolve+':'+machineOnly;if(td5LearnCache.has(key))return td5LearnCache.get(key);const task=(async()=>{const moves=p=>new Set((p.moves||[]).filter(m=>(m.version_group_details||[]).some(d=>d.version_group?.name===vg[game]&&(!machineOnly||d.move_learn_method?.name==='machine'))).map(m=>m.move.name));const keyName=String(mon.name||'').toLowerCase().replace(/ /g,'-');let p;try{p=await api('pokemon/'+encodeURIComponent(mon.id||keyName))}catch(e){if(mon.id)throw e;const sp=await api('pokemon-species/'+encodeURIComponent(keyName));const ref=sp.varieties?.find(v=>v.is_default)?.pokemon?.name||sp.id;if(!ref)throw e;p=await api('pokemon/'+ref)}if(!td7PokemonAllowed(p.name,p.id,game))throw Error('Pokémon form unavailable in selected game');const direct=moves(p),later=new Set(),methods=new Map([...direct].map(n=>[n,td51Methods(p,n,game)])),laterMethods=new Map();let unknown=false;if(evolve){try{const queue=[{id:p.id}],seen=new Set([p.id]);while(queue.length){const x=queue.shift();const evolutions=await tdDev1EvolutionOptions(x,game).catch(async()=>{
  unknown=true;
  const pack=await window.takDexDB74?.encounter(game);
  const descendants=(pack?.mons||[]).filter(row=>row[4]===x.id);
  return Promise.all(descendants.map(async ([id])=>({candidate:await api('pokemon/'+id)})));
 });for(const {candidate} of evolutions){if(seen.has(candidate.id))continue;seen.add(candidate.id);queue.push({id:candidate.id});for(const m of moves(candidate))if(!direct.has(m)){later.add(m);const text=td51Methods(candidate,m,game);if(!laterMethods.has(m))laterMethods.set(m,td41PokemonLabel(candidate.name||'Evolution')+(text?' · '+text:''))}}}}catch{unknown=true}}return {direct,later,unknown,methods,laterMethods}})();td5LearnCache.set(key,task);try{const r=await task;if(r.unknown)td5LearnCache.delete(key);return r}catch(e){td5LearnCache.delete(key);throw e}}
// V68 — Move Checker. Shared PokeAPI move database, with explicit cross-generation differences.
(function installMoveCheckerV68(){
 const main=document.querySelector('main'),more=$('morePage');if(!main||!more)return;
 const button=document.createElement('button');button.id='td68OpenMove';button.type='button';button.className='tool-link';button.textContent='✦ Move Checker ›';
 more.querySelector('.tool-card')?.appendChild(button);
 // V70: Database Coverage belongs under More → About, not on the More root.
 const aboutButton=document.createElement('button');aboutButton.id='td70OpenAbout';aboutButton.type='button';aboutButton.className='tool-link';aboutButton.textContent='ⓘ About Tak-Dex ›';
 const moreTools=more.querySelector('.tool-card'),offlineLink=$('td59OpenOffline');
 if(moreTools)moreTools.append(aboutButton);
 if(moreTools&&offlineLink)moreTools.append(offlineLink,aboutButton);
 const aboutPage=document.createElement('section');aboutPage.id='td70AboutPage';aboutPage.hidden=true;
 aboutPage.innerHTML=`<div class="bar"><h2>About Tak-Dex</h2><button type="button" id="td70AboutBack">← More</button></div>
 <div class="card td70-about-card"><h3>Tak-Dex</h3>
 <p><strong>Web version:</strong> V78 DEV3 RC1</p><p><strong>Android:</strong> ${window.Capacitor?.isNativePlatform?.() ? "Native build version may differ" : "Released separately"}</p>
</div>
 <div class="card td70-about-card"><h3>Storage &amp; offline reference</h3><p class="note" id="td70AboutStorage">Checking local storage…</p></div>
 <div class="tool-card"><button type="button" id="td68OpenCoverage" class="tool-link">▦ Database Coverage ›</button></div>
`;
 main.appendChild(aboutPage);
 const covButton=$('td68OpenCoverage');
 let aboutStorageToken=0;
 async function updateAboutStorage(){
  const token=++aboutStorageToken,host=$('td70AboutStorage');host.textContent='Checking local storage…';
  try{
   let legacy=0,bytes=0;
   for(let i=0;i<localStorage.length;i++){
    const k=localStorage.key(i),v=localStorage.getItem(k)||'';
    if(k.startsWith('pt-v2:'))legacy++;
    bytes+=(k.length+v.length)*2;
   }
   const [dbCount,packs,trainer]=await Promise.all([
    td70IDB('count').catch(()=>null),
    Promise.all(games.map(g=>window.takDexReferenceV58?.cached?.(g).catch(()=>null))).then(rows=>rows.filter(x=>x?.complete).length),
    td70PlatinumTrainerCached()
   ]);
   if(token!==aboutStorageToken)return;
   host.textContent='Saved reference packs: '+packs+' / '+games.length+
    ' · Pokémon/move records in IndexedDB: '+(dbCount===null?'unavailable':dbCount)+
    ' · Legacy cache records awaiting migration: '+legacy+
    ' · localStorage estimate: '+(bytes/1048576).toFixed(2)+' MiB'+
    ' · Platinum opponent moves: '+(trainer?'saved offline':'not downloaded');
  }catch(e){if(token===aboutStorageToken)host.textContent='Local storage status unavailable: '+e.message}
 }
 aboutButton.addEventListener('click',()=>{window.takActivate(3);more.hidden=true;aboutPage.hidden=false;updateAboutStorage();window.scrollTo(0,0)});
 $('td70AboutBack').addEventListener('click',()=>{aboutStorageToken++;aboutPage.hidden=true;window.takActivate(3)});
 for(const id of ['teamsTab','battleTab','dexTab','moreTab'])$(id).addEventListener('click',()=>{aboutPage.hidden=true},true);
 const page=document.createElement('section');page.id='td68MovePage';page.hidden=true;
 page.innerHTML=`<div class="bar td772-context-heading"><h2 id="td774CheckerHeading">Move Checker</h2><div class="td72-move-header-actions"><button type="button" id="td72MoveTypeToggle" aria-pressed="false">◈ By Type</button><button type="button" id="td68MoveBack">← More</button></div></div>
 <div class="td76-move-filters td77-planning-tabs" role="tablist" aria-label="Move catalog"><button type="button" role="tab" data-move-catalog="" aria-selected="true">All Moves</button><button type="button" role="tab" data-move-catalog="machines" aria-selected="false">TM / HM</button></div>
 <div id="td68MoveSearchPanel" class="tool-card"><label>Search any move<div class="search td68-search"><input type="text" id="td68MoveInput" placeholder="Future Sight, Rollout, Earthquake…" autocomplete="off"><div id="td68MoveSuggest" class="suggestions" hidden></div></div></label></div>
 <div id="td68MoveResult" aria-live="polite"><p class="note">Select a move to see its power, accuracy, PP, effect, and generation changes.</p></div>
 <div id="td72MoveTypePanel" hidden><div class="td772-filter-line"><select id="td72MoveTypeGame" aria-label="Game"><option value="">Choose game…</option></select>${td772FilterButton('td72MoveFilters','Move filters','td72MoveFilterPanel')}</div><div id="td72MoveTypeChoices" class="td72-move-types"></div><p id="td72MoveTypeStatus" class="note">Choose a game and type to browse moves.</p><div id="td72MoveTypeResults"></div></div>`;
 const machinePanel=$('tmPage');
 page.insertBefore(machinePanel,page.querySelector('#td68MoveResult'));
 main.appendChild(page);
 const report=document.createElement('section');report.id='td68CoveragePage';report.hidden=true;
 report.innerHTML=`<div class="bar"><h2>Database Coverage</h2><button type="button" id="td68CoverageBack">← About</button></div><p class="note">Actual coverage from built-in trainer rosters and locally downloaded data. A game with an indexed encounter list is not necessarily complete for gifts or special acquisitions. Unknown does not mean unobtainable.</p><div id="td68CoverageResults"></div>`;
 main.appendChild(report);
 const css=document.createElement('style');css.id='td68-style';css.textContent=`
 #td68CoveragePage[hidden],#td68MovePage[hidden],#td70AboutPage[hidden]{display:none!important}
 #td70AboutPage .td70-about-card{padding:16px;margin:13px 0}#td70AboutPage .td70-about-card h3{margin:0 0 10px}#td70AboutPage .td70-about-card p{margin:8px 0}
 #td68MovePage .td68-search{position:relative}#td68MovePage #td68MoveSuggest{max-height:260px;overflow-y:auto;z-index:400;background:var(--card,#191c24)}
 #td68MovePage .td68-facts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:12px 0}#td68MovePage .td68-fact{text-align:center;border:1px solid var(--edge,#444);border-radius:11px;padding:10px 4px;min-width:0}
 #td68MovePage .td68-fact strong{font-size:1.2rem;display:block}#td68MovePage .td68-fact small{color:var(--muted,#999)}
 #td68MovePage .td68-history{width:100%;border-collapse:collapse;font-size:.86rem}#td68MovePage .td68-history td,#td68MovePage .td68-history th{padding:8px 5px;border-bottom:1px solid var(--edge,#444);text-align:left}#td68MovePage .td68-current{border-left:3px solid var(--accent,#e33);background:rgba(110,140,200,.09)}
 #td68MovePage .td68-effect{line-height:1.6}#td68MovePage .td68-minor{font-size:.83rem;color:var(--muted,#aaa)}
 #dexResult .td68-move-link{display:inline-block;vertical-align:middle;background:transparent!important;border:0!important;box-shadow:none!important;border-radius:0!important;padding:2px 1px!important;margin:0!important;color:var(--text)!important;font-weight:750!important;text-decoration:underline;text-decoration-style:dotted;text-underline-offset:3px;text-align:left;cursor:pointer}
 #dexResult .td68-move-link:focus-visible{outline:2px solid var(--accent,#e33);outline-offset:2px}
 #td68CoveragePage .td68-coverage-row{padding:12px 13px;border-bottom:1px solid var(--edge,#444)}#td68CoveragePage .td68-coverage-row strong{display:block;margin-bottom:5px}#td68CoveragePage .td68-coverage-row small{display:block;line-height:1.5;color:var(--muted,#aaa)}
 /* Dropdowns are permitted to extend beyond the bottom of all six editor cards. */
 #plannerPage .planner-grid,#plannerPage .td63-slot,#plannerPage .plan-slot,#plannerPage .td63-slot-fields,#plannerPage .td65-move-slot,#plannerPage .td65-move-search,#plannerPage .td63-slot-fields label{overflow:visible!important}
 #plannerPage .td63-slot{position:relative;isolation:auto}
 #plannerPage .td63-slot:has(.suggestions:not([hidden])){z-index:10050!important}
 #plannerPage .td65-move-slot:has(.suggestions:not([hidden])),#plannerPage .td63-slot-fields label:has(.suggestions:not([hidden])){position:relative;z-index:10060!important}
 #plannerPage .td65-move-options:not([hidden]),#plannerPage .td66-pokemon-options:not([hidden]){z-index:10070!important;max-height:min(260px,48vh)!important;overflow-y:auto!important;box-shadow:0 12px 24px rgba(0,0,0,.45)!important;background:var(--card,#191c24)!important}
 #plannerPage .td68-open-up.td65-move-options,#plannerPage .td68-open-up.td66-pokemon-options{top:auto!important;bottom:calc(100% + 4px)!important}
 `;document.head.appendChild(css);
 const query=$('td68MoveInput'),suggest=$('td68MoveSuggest'),res=$('td68MoveResult');let source='more',savedScroll=0,req=0,searchReq=0,list=null,moveAcquisitionContext='';
 const catalog=page.querySelector('.td76-move-filters');
 async function showCatalog(kind,byNumber=false){
  const showMachines=Boolean(kind)||byNumber;
  ++req;++searchReq;suggest.hidden=true;
  machinePanel.dataset.machineFilter=kind;machinePanel.hidden=!showMachines;
  catalog.querySelectorAll('button').forEach(b=>{
   const selected=b.dataset.moveCatalog===(showMachines?'machines':'');
   b.setAttribute('aria-selected',String(selected));
  });
  td72SwitchMoveView(false);
  $('td68MoveSearchPanel').hidden=showMachines;
  $('td72MoveTypeToggle').hidden=showMachines;
  res.innerHTML='';
  if(!showMachines)return;
  if(!$('tmGame').value)$('tmGame').value=td72MoveGameOverride||current?.game||td66SavedGame()||'';
  refreshTeamMenus();
  await syncTM();
  if(!machinePanel.hidden&&machinePanel.dataset.machineFilter===kind)$('tmMoveSearch').value='';
 }
 catalog.addEventListener('click',e=>{const b=e.target.closest('[data-move-catalog]');if(b)showCatalog(b.dataset.moveCatalog);});
 machinePanel.addEventListener('td76:machine',e=>{
  td72MoveGameOverride=$('tmGame').value;
  load(e.detail.move);
 });
 $('tmGame').addEventListener('change',()=>{++req;res.innerHTML='';});
 async function submitMove(value){
  const key=value.trim().replace(/[\s-]/g,'').toLowerCase();
  if(/^(?:(?:tm|hm)?\d+)$/.test(key)){
   const kind=/^\d/.test(key)?'':key.slice(0,2);
   await showCatalog(kind,true);
   $('tmMoveSearch').value=value.trim();
   if($('tmGame').value)showMachineResults(value);
   $('tmMoveSearch').focus();
  }else load(value);
 }
 // V72 — same view-toggle pattern as Pokédex By Type, within existing Move Checker.
 const td72TypeToggle=$('td72MoveTypeToggle'),td72TypePanel=$('td72MoveTypePanel'),td72Game=$('td72MoveTypeGame');
 const td72Types=$('td72MoveTypeChoices'),td72TypeStatus=$('td72MoveTypeStatus'),td72TypeResults=$('td72MoveTypeResults');
 let td72TypeMode=false,td72Type=null,td72TypeRequest=0,td72MoveGameOverride=null,td72DetailOrigin=null,td72DetailScroll=0;
 const filter=document.createElement('div');filter.className='td772-filter-panel td5-filter';filter.id='td72MoveFilterPanel';
 filter.innerHTML=`<label><span class="td773-sr-only">Filter by</span><select id="td5FilterMode"><option value="">All moves</option><option value="mon">Pokémon</option><option value="team">Saved team</option></select></label><div id="td5FilterFields" hidden><label id="td5MonWrap">Pokémon<div class="search battle-search"><input id="td5MonInput" autocomplete="off" placeholder="Search Pokémon…"><button type="button" class="battle-clear td61-mon-clear" id="td61MonClear" aria-label="Clear Pokémon" hidden>×</button><div id="td5MonResults" class="suggestions" hidden></div></div></label><label id="td5TeamWrap" hidden>Saved team<select id="td5FilterTeam"></select></label><small id="td5FilterStatus"></small></div>`;filter.hidden=true;td72Types.before(filter);
 const filterButton=$('td72MoveFilters');
 td772BindFilter(filterButton,filter,()=>{
  $('td5FilterMode').value='';filterMon='';$('td5MonInput').value='';$('td5MonResults').hidden=true;
  $('td61MonClear').hidden=true;$('td5FilterTeam').value='';filterChanged();
 });
 let filterMon='',filterRequest=0;
 function filterMenus(){const g=td72Game.value,sel=$('td5FilterTeam'),old=sel.value;sel.innerHTML='<option value="">Choose team…</option>'+teams.filter(t=>t.game===g).map(t=>`<option value="${safe(t.id)}">${safe(t.name)}</option>`).join('');const matching=teams.filter(t=>t.game===g);if(matching.length===1)sel.value=matching[0].id;else if(old&&matching.some(t=>String(t.id)===old))sel.value=old;else if(current?.game===g&&matching.some(t=>t.id===current.id))sel.value=current.id;}
 async function filterRecords(){if(!td72TypeMode)return null;const mode=$('td5FilterMode').value;if(!mode)return null;const g=td72Game.value,mons=mode==='mon'?(filterMon?[{name:filterMon}]:[]):(teams.find(t=>t.id===$('td5FilterTeam').value)?.pokemon||[]).filter(Boolean);if(!games.includes(g)||!mons.length)return [];return Promise.all(mons.map(async mon=>{try{return {mon,...await td5LearnRecords(mon,g,true)}}catch{return {mon,direct:new Set(),later:new Set(),unknown:true}}}))}
 function filterNames(rows,name){return rows===null||rows.some(r=>r.direct.has(name)||r.later.has(name))}
 function td52EvolutionOnly(rows,name){return !!rows?.length&&!rows.some(r=>r.direct.has(name))&&rows.some(r=>r.later.has(name))}
 function filterLabel(rows,name){if(!rows)return '';if($('td5FilterMode').value==='mon')return rows.some(r=>!r.direct.has(name)&&r.later.has(name))?'↑ After evolution':'';return rows.filter(r=>r.direct.has(name)||r.later.has(name)).map(r=>td41PokemonLabel(r.mon.name)+(r.direct.has(name)?'':' ↑')).join(', ')}
 function td52FilterMarkup(rows,name){if(!rows)return '';if($('td5FilterMode').value==='mon')return td52EvolutionOnly(rows,name)?'<span class="td52-evo-member">↑ '+safe(rows.map(r=>r.laterMethods?.get(name)).filter(Boolean).join(', ')||'Evolution')+'</span>':'';return rows.filter(r=>r.direct.has(name)||r.later.has(name)).map(r=>`<span class="${r.direct.has(name)?'':'td52-evo-member'}">${safe(td41PokemonLabel(r.mon.name))}${r.direct.has(name)?'':' ↑ '+safe(r.laterMethods?.get(name)||'Evolution')}</span>`).join(', ')}
 function filterChanged(){++filterRequest;++searchReq;const mode=$('td5FilterMode').value;$('td5FilterFields').hidden=!mode;$('td5MonWrap').hidden=mode!=='mon';$('td5TeamWrap').hidden=mode!=='team';td78FilterState(filterButton,filter,Number(Boolean(mode)));
 td72MoveGameOverride=mode&&games.includes(td72Game.value)?td72Game.value:null;const stamp=filterRequest;filterRecords().then(rows=>{if(stamp===filterRequest)$('td5FilterStatus').textContent=rows===null?'':!rows.length?($('td5FilterMode').value==='team'&&$('td5FilterTeam').value?'No Pokémon in selected team.':$('td5FilterMode').value==='mon'&&filterMon?'Learnset unavailable.':'Choose Pokémon or team.'):rows.some(r=>r.unknown)?'Some evolution or learnset data unavailable.':''});if(td72TypeMode)td72LoadType();else if(query.value.length>=2)findSuggestions();}
 search($('td5MonInput'),$('td5MonResults'),n=>{filterMon=n;$('td61MonClear').hidden=false;filterChanged()});$('td5MonInput').addEventListener('focus',e=>e.target.select());$('td5MonInput').addEventListener('input',()=>{filterMon='';$('td61MonClear').hidden=!$('td5MonInput').value;++searchReq});$('td61MonClear').onclick=()=>{filterMon='';$('td5MonInput').value='';$('td61MonClear').hidden=true;$('td5MonResults').hidden=true;filterChanged();$('td5MonInput').focus()};$('td5FilterMode').onchange=()=>{if(!td72Game.value)td72Game.value=td72Game.value||current?.game||td66SavedGame()||'';filterMenus();filterChanged()};$('td5FilterTeam').onchange=filterChanged;window.addEventListener('td5:team-context',e=>{const g=e.detail?.game;if(!games.includes(g))return;td72Game.value=g;filterMenus();if($('td5FilterMode').value==='team'&&teams.some(t=>t.game===g&&t.id===e.detail.teamId))$('td5FilterTeam').value=e.detail.teamId;if(!page.hidden)filterChanged()});
 td72Game.insertAdjacentHTML('beforeend',gameOptions);
 td72Types.innerHTML=Object.keys(colors).map(t=>`<button type="button" data-td72-move-type="${safe(t)}" style="--td72-color:${colors[t]}">${safe(pretty(t))}</button>`).join('');
 // The normal Move Checker deliberately searches every generation. Only By Type filters.
 function td72SyncGameTypes(){
  const gen=games.includes(td72Game.value)?gameGeneration(td72Game.value):null;
  let stillValid=false;
  td72Types.querySelectorAll('[data-td72-move-type]').forEach(b=>{
   const type=b.dataset.td72MoveType;
   const allowed=gen!==null&&!(gen<6&&type==='fairy')&&!(gen<2&&(type==='steel'||type==='dark'));
   b.hidden=!allowed;b.disabled=!allowed;
   if(allowed&&type===td72Type)stillValid=true;
  });
  if(!stillValid){td72Type=null;td72TypeResults.innerHTML='';}
  return stillValid;
 }
 function td72SwitchMoveView(byType){
  td72TypeMode=Boolean(byType);$('td774CheckerHeading').textContent=td72TypeMode?'Moves by Type':'Move Checker';td72TypeToggle.setAttribute('aria-pressed',String(td72TypeMode));
  td72TypeToggle.textContent=td72TypeMode?'⌕ Search Moves':'◈ By Type';
  $('td68MoveSearchPanel').hidden=td72TypeMode;res.hidden=td72TypeMode;td72TypePanel.hidden=!td72TypeMode;
  if(td72TypeMode){td72Game.value=td72Game.value||current?.game||td66SavedGame()||'';filterMenus();td72SyncGameTypes();if(td72Type)td72LoadType();else td72TypeStatus.textContent='Select a game and a move type.'}
  else ++td72TypeRequest;
 }
 td72TypeToggle.addEventListener('click',()=>{td72MoveGameOverride=null;td72DetailOrigin=null;td72SwitchMoveView(!td72TypeMode)});
 td72Game.addEventListener('change',()=>{filterMenus();filterChanged()});
 td72Types.addEventListener('click',e=>{const btn=e.target.closest('[data-td72-move-type]');if(!btn)return;td72Type=btn.dataset.td72MoveType;td72LoadType()});
 td72TypeResults.addEventListener('click',e=>{
  const btn=e.target.closest('[data-td72-type-move]');if(!btn)return;
  td72DetailOrigin='type';td72DetailScroll=window.scrollY;
  td72MoveGameOverride=td72Game.value;
  // Preserve the entire By Type DOM, selection and search results in place for Back.
  td72TypePanel.hidden=true;$('td68MoveSearchPanel').hidden=true;res.hidden=false;
  td72TypeToggle.hidden=true;$('td774CheckerHeading').textContent='Move Checker';
  query.value=pretty(btn.dataset.td72TypeMove);load(btn.dataset.td72TypeMove);
  window.scrollTo(0,0);
 });
 async function td72LoadType(){
  const game=td72Game.value,type=td72Type,request=++td72TypeRequest;
  td72SyncGameTypes();
  [...td72Types.querySelectorAll('button')].forEach(b=>{const selected=b.dataset.td72MoveType===type;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected))});
  td72TypeResults.innerHTML='';
  if(!games.includes(game)||!type||td72Type!==type){td72TypeStatus.textContent='Choose a game and a type first.';return}
  const gen=gameGeneration(game);
  td72TypeStatus.textContent=`Loading ${pretty(type)} moves for ${game}…`;
  try{
   const compatible=await filterRecords();const response=await api('type/'+encodeURIComponent(type));
   if(request!==td72TypeRequest)return;
   const names=[...new Set((response.moves||[]).map(x=>x.name))].filter(n=>filterNames(compatible,n)).sort();
   const collected=[],missing=[];let cursor=0,done=0;
   const introduced=d=>({ 'generation-i':1,'generation-ii':2,'generation-iii':3,'generation-iv':4,'generation-v':5,'generation-vi':6,'generation-vii':7,'generation-viii':8,'generation-ix':9 })[d.generation?.name]||99;
   async function worker(){while(cursor<names.length&&request===td72TypeRequest){const name=names[cursor++];
     try{const d=await api('move/'+encodeURIComponent(name));if(introduced(d)<=gen){const h=moveGenerationData(d,gen,game);if(h.type===type)collected.push({name,...h})}}
     catch{missing.push(name)}
     done++;if(done%12===0&&request===td72TypeRequest)td72TypeStatus.textContent=`Checking ${done}/${names.length} moves for ${game}…`;
   }}
   await Promise.all(Array.from({length:Math.min(7,names.length)},worker));
   if(request!==td72TypeRequest)return;
   collected.sort((a,b)=>a.name.localeCompare(b.name));
   td72TypeStatus.textContent=`${collected.length} ${pretty(type)} move${collected.length===1?'':'s'} · ${game} (Gen ${gen})${missing.length?' · '+missing.length+' records unavailable offline':''}. Generation-valid move catalog; learnability and in-game acquisition still depend on the selected version.`;
   td72TypeResults.innerHTML=collected.length?collected.map(m=>`<button type="button" class="td72-type-move ${td52EvolutionOnly(compatible,m.name)?'td52-evo-only':''}" data-td72-type-move="${safe(m.name)}"><span class="td774-move-lines">${compactMoveLines(m)}</span>${filterLabel(compatible,m.name)?`<small class="td51-filter-members">${td52FilterMarkup(compatible,m.name)}</small>`:''}</button>`).join(''):'<p class="note">No confirmed moves in the available records for this generation. This is not proof the game has none.</p>';
  }catch(e){if(request===td72TypeRequest)td72TypeStatus.textContent='Could not load this type. Download its data or reconnect.'}
 }
 async function td72RenderMoveTeamCompatibility(moveName,teamId,request){
  const team=teams.find(t=>t.id===teamId),box=document.getElementById('td72MoveCompatibility');
  if(!team||!box)return;
  const mons=team.pokemon||[];
  if(!mons.some(Boolean)){box.innerHTML='<h3>Who can learn it in my team?</h3>';return}
  const checks=await Promise.all(mons.map(m=>m?td51CompatCheck(m,team.game,true):null));
  if(request!==req||!box.isConnected)return;
  box.innerHTML=`<h3>Who can learn ${safe(pretty(moveName))} in my team?</h3><div class="td74-mon-row td51-compat-strip">${td51CompatTiles(mons,checks,moveName,true)}</div>`;

 }

 function normal(s){return String(s||'').trim().toLowerCase().replace(/\s+/g,'-')}
 function openPage(which){['teamsPage','battlePage','dexPage','morePage','plannerPage','tmPage','mapsPage'].forEach(id=>$(id).hidden=true);aboutPage.hidden=true;page.hidden=which!=='move';report.hidden=which!=='coverage';['teamsTab','battleTab','dexTab','moreTab'].forEach((id,i)=>$(id).classList.toggle('selected',i===(source==='dex'?2:source==='team'?0:source==='battle'?1:3)));window.scrollTo(0,0)}
 function back(){
  if(td72DetailOrigin==='type'){
   ++req;td72DetailOrigin=null;td72MoveGameOverride=$('td5FilterMode').value?td72Game.value:null;
   td72TypePanel.hidden=false;$('td774CheckerHeading').textContent='Moves by Type';$('td68MoveSearchPanel').hidden=true;res.hidden=true;
   td72TypeToggle.hidden=false;td72TypeMode=true;
   requestAnimationFrame(()=>window.scrollTo(0,td72DetailScroll));
   return;
  }
  page.hidden=true;report.hidden=true;
  if(source==='dex'){$('dexPage').hidden=false;['teamsTab','battleTab','dexTab','moreTab'].forEach((id,i)=>$(id).classList.toggle('selected',i===2));requestAnimationFrame(()=>window.scrollTo(0,savedScroll))}
  else if(source==='team'){$('teamsPage').hidden=false;['teamsTab','battleTab','dexTab','moreTab'].forEach((id,i)=>$(id).classList.toggle('selected',i===0));requestAnimationFrame(()=>window.scrollTo(0,savedScroll))}
  else if(source==='battle'||source==='planner'){
   $(source==='battle'?'battlePage':'plannerPage').hidden=false;
   ['teamsTab','battleTab','dexTab','moreTab'].forEach((id,i)=>$(id).classList.toggle('selected',i===(source==='battle'?1:3)));
   requestAnimationFrame(()=>window.scrollTo(0,savedScroll));
  }else if(source==='team-planner'){window.td5ReturnTeamPlanner?.(savedScroll);}
  else if(source==='maps'){
   $('mapsPage').hidden=false;
   ['teamsTab','battleTab','dexTab','moreTab'].forEach((id,i)=>$(id).classList.toggle('selected',i===3));
   requestAnimationFrame(()=>window.scrollTo(0,savedScroll));
  }else window.takActivate(3);
 }
 function launch(m,origin,gameOverride,acquisitionContext=''){
  savedScroll=window.scrollY;
  moveAcquisitionContext=acquisitionContext;
  showCatalog('');
  source=origin||'more';$('td68MoveBack').hidden=source!=='more';
  if(source!=='more'){
   $('td5FilterMode').value='';$('td5FilterFields').hidden=true;filter.hidden=true;
   td78FilterState(filterButton,filter,0);filterButton.setAttribute('aria-expanded','false');
  }
  td72DetailOrigin=null;td72DetailScroll=0;td72TypeToggle.hidden=false;
  ++searchReq;
  ++req;
  query.value='';
  suggest.hidden=true;
  suggest.innerHTML='';
  openPage('move');
  if(source==='more'&&$('td5FilterMode').value){td72Game.value=td72Game.value||current?.game||td66SavedGame()||'';filterMenus();td72MoveGameOverride=td72Game.value||null;$('td5FilterStatus').textContent='';filterChanged();}else td72MoveGameOverride=games.includes(gameOverride)?gameOverride:null;td72SwitchMoveView(false);

  if(m){
    query.value=pretty(m);
    load(m);
  }else{
    res.innerHTML='<p class="note">Choose or search for a move above.</p>';
  }
}
 window.takDexOpenMoveFromMapsV73=(move,game)=>launch(move,'maps',game);
 button.addEventListener('click',()=>launch('', 'more'));
 $('td68MoveBack').addEventListener('click',()=>{++req;++searchReq;page.hidden=true;window.takActivate(3);});
 ['teamsTab','battleTab','dexTab','moreTab'].forEach(id=>$(id).addEventListener('click',()=>{page.hidden=true;report.hidden=true},true));
 $('dexResult').addEventListener('click',e=>{const b=e.target.closest('[data-td68-move]');if(!b)return;e.preventDefault();tak67CaptureDexSections();launch(b.dataset.td68Move,'dex',$('dexGame').value,b.dataset.td77Reminder)});
 $('moveFields').addEventListener('click',e=>{const b=e.target.closest('[data-td74-builder-move]');if(b){e.preventDefault();launch(b.dataset.td74BuilderMove,'team',current?.game)}});$('slots').addEventListener('click',e=>{const b=e.target.closest('[data-td5-team-move]');if(b){e.preventDefault();launch(b.dataset.td5TeamMove,'team',current?.game)}});$('slots').addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)&&e.target.matches('[data-td5-team-move]')){e.preventDefault();e.target.click()}});
 res.addEventListener('click',event=>{
  const link=event.target.closest('[data-td78-move-map]');
  if(link)window.takDexMapsV73?.open(link.dataset.td78MoveGame,link.dataset.td78MoveMap);
 });
 async function moveList(){if(!list){list=api('move?limit=2000').then(x=>(x.results||[]).map(v=>v.name)).catch(e=>{list=null;throw e});}return list}
 async function findSuggestions(){const token=++searchReq,q=normal(query.value);if(q.length<2||/^(?:(?:tm|hm)?-?\d+)$/.test(q)){suggest.hidden=true;return}suggest.hidden=false;suggest.innerHTML='<p class="note">Looking up moves…</p>';try{const compatible=await filterRecords();const values=td78SearchMatches((await moveList()).filter(n=>filterNames(compatible,n)),q).slice(0,30);if(token!==searchReq)return;suggest.innerHTML=values.map(n=>`<button type="button" class="${td52EvolutionOnly(compatible,n)?'td52-evo-only':''}" data-td68-select="${safe(n)}"><span class="td774-move-lines"><strong>${safe(pretty(n))}</strong></span>${filterLabel(compatible,n)?`<small class="td51-search-members">${td52FilterMarkup(compatible,n)}</small>`:''}</button>`).join('')||'<p class="note">No matching compatible move.</p>';td77HydrateMoveRows(suggest,'td68Select',td72MoveGameOverride||current?.game||td66SavedGame());}catch{if(token===searchReq)suggest.innerHTML='<p class="note">Move list unavailable. Try entering the exact move name.</p>'}}
 query.addEventListener('click',()=>{if(query.value)query.select()});
 query.addEventListener('input',findSuggestions);query.addEventListener('focus',()=>{if(query.value.length>=2)findSuggestions()});
 suggest.addEventListener('click',e=>{const b=e.target.closest('[data-td68-select]');if(!b)return;query.value=pretty(b.dataset.td68Select);suggest.hidden=true;++searchReq;load(b.dataset.td68Select)});
 query.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();const first=suggest.querySelector('[data-td68-select]');const name=!suggest.hidden&&first?first.dataset.td68Select:query.value;suggest.hidden=true;++searchReq;submitMove(name)}if(e.key==='Escape'){++searchReq;suggest.hidden=true;}});
 const generationNames=['','Red/Blue/Yellow','Gold/Silver/Crystal','Ruby/Sapphire/Emerald/FRLG','Diamond/Pearl/Platinum/HGSS','Black/White/B2W2','X/Y/ORAS','Sun/Moon/USUM','Sword/Shield/BDSP','Scarlet/Violet'];
 function statsAt(data,g,game){const hist=moveGenerationData(data,g,game),intro=generationFromName(data.generation?.name?.replace('generation-','')||'');return {...hist,pp:hist.pp??data.pp}}
 function statDesc(n){return Number.isFinite(n)?String(n):'—'}
 function english(rows){return (rows||[]).find(r=>r.language?.name==='en')||null}
 function paragraphs(s){return String(s||'').split(/\n+/).map(t=>t.trim()).filter(Boolean).map(t=>`<p>${safe(t)}</p>`).join('')}
 const guidance={
  'future-sight':'Deals delayed damage two turns after it is used. Switching the target before impact does not cancel the attack. In Generations 2–4, delayed damage is typeless and ignores STAB/type effectiveness, including Dark immunity; from Generation 5 onward it uses Psychic effectiveness.',
  'rollout':'Attacks up to five turns in a row. Base power starts at 30, then doubles to 60, 120, 240 and 480 only if every preceding hit connects. A miss or interruption ends the sequence. Defense Curl doubles that power while the user remains in battle.',
  'ice-ball':'Ice-type counterpart of Rollout: five successive turns, power doubles only after a successful preceding hit. A miss ends the sequence.',
  'fury-cutter':'Consecutive successful uses increase the power; a miss or interruption resets the chain. Its precise power progression differs by generation.',
  'solar-beam':'Normally charges on the first turn and attacks on the second. Strong sunlight removes the charging turn; other weather can reduce its damage.',
  'return':'Base power depends on how friendly the Pokémon is toward its trainer. Higher friendship increases power, up to 102 in games where this move is available.',
  'earthquake':'Damages grounded Pokémon with a Ground-type attack. Flying types and Levitate users are normally immune. It also strikes adjacent allies in most Double Battles.',
  'double-edge':'Deals damage and also inflicts recoil on the user, unless a relevant ability prevents it.'
 };
 async function load(value){const name=normal(value),mine=++req;if(!name)return;query.value=pretty(name);res.innerHTML='<p class="note">Loading move details…</p>';
  try{const compatible=await filterRecords();if(mine!==req)return;if(!filterNames(compatible,name)){res.textContent='No confirmed compatible move for this filter.';return}const data=await api('move/'+encodeURIComponent(name));if(mine!==req)return;const game=td72MoveGameOverride||current?.game||td66SavedGame()||null,selectedGen=game ? gameGeneration(game) : null,intro=generationFromName(data.generation?.name?.replace('generation-','')||'');
   const introduced=({'generation-i':1,'generation-ii':2,'generation-iii':3,'generation-iv':4,'generation-v':5,'generation-vi':6,'generation-vii':7,'generation-viii':8,'generation-ix':9})[data.generation?.name]||1;
   const globalLatest={power:data.power,accuracy:data.accuracy,pp:data.pp,damageClass:data.damage_class?.name,type:data.type?.name};
   const introducedYet=!selectedGen||selectedGen>=introduced;
   const present=introducedYet?(selectedGen?statsAt(data,selectedGen,game):globalLatest):{power:null,accuracy:null,pp:null,damageClass:null,type:null};
   const rows=[];for(let g=introduced;g<=9;g++){const item=statsAt(data,g);rows.push({...item,g})}
   const desc=english(data.effect_entries),flavor=english([...(data.flavor_text_entries||[])].reverse());
   let effectText=guidance[data.name]||desc?.short_effect||flavor?.flavor_text||'A verified effect description is not available in this record.';
   // PokeAPI's effect placeholders must never be displayed literally as numbers.
   effectText=effectText.replace(/\$effect_chance/g,Number.isFinite(data.effect_chance)?String(data.effect_chance)+'%':'a conditional chance').replace(/\$min_hits|\$max_hits|\$min_turns|\$max_turns|\$chance/g,'a variable number');
   const selected=rows.find(x=>x.g===selectedGen);const differences=rows.filter((x,i)=>i===0||x.power!==rows[i-1].power||x.accuracy!==rows[i-1].accuracy||x.pp!==rows[i-1].pp||x.type!==rows[i-1].type||x.damageClass!==rows[i-1].damageClass);
   const changes=differences.length>1?'Historical values differ between generations.':'No numerical stat changes are recorded for this move.';
   const historicEffects=(data.effect_changes||[]).map(x=>({version:x.version_group?.name,text:english(x.effect_entries)?.effect||english(x.effect_entries)?.short_effect||''})).filter(x=>x.text);
   const extra=historicEffects.length?'<h4>Older effect descriptions</h4>'+historicEffects.map(x=>`<p class="td68-minor"><b>${safe(pretty(x.version||'Historical version'))}:</b> ${safe(x.text.replace(/\$effect_chance/g,Number.isFinite(data.effect_chance)?data.effect_chance+'%':'conditional chance'))}</p>`).join(''):'';
   const contact=(data.flags||[]).some(f=>f.name==='contact');
   res.innerHTML=`<article class="card"><h2>${safe(pretty(data.name))} ${pill(present.type)}</h2>${introducedYet?'':`<p class="note">${safe(game)} · Not yet introduced</p>`}<div class="td68-facts">${[['Power',statDesc(present.power)],['Accuracy',Number.isFinite(present.accuracy)?present.accuracy+'%':'—'],['PP',statDesc(present.pp)]].map(([label,val])=>`<div class="td68-fact"><strong>${val}</strong><small>${label}</small></div>`).join('')}</div><h3>What it does</h3><div class="td68-effect">${paragraphs(effectText)}</div>${extra}<p class="td68-minor">Target: ${safe(pretty(data.target?.name||'Unknown'))} · Priority: ${Number(data.priority)||0} · Contact: ${contact?'Yes':'No / unlisted'}</p><h3>Changes between generations</h3><div style="overflow-x:auto"><table class="td68-history"><thead><tr><th>Generation</th><th>PWR</th><th>ACC</th><th>PP</th><th>Category</th><th>Type</th></tr></thead><tbody>${rows.map(row=>`<tr class="${row.g===selectedGen?'td68-current':''}"><td>${row.g} ${row.g===selectedGen?'· '+safe(game):''}</td><td>${statDesc(row.power)}</td><td>${Number.isFinite(row.accuracy)?row.accuracy+'%':'—'}</td><td>${statDesc(row.pp)}</td><td>${safe(pretty(row.damageClass))}</td><td>${safe(pretty(row.type))}</td></tr>`).join('')}</tbody></table></div></article>`;

    // Move acquisition guide — reuse verified TM/HM locations.
    const locationBox = document.createElement('details');
    locationBox.className = 'card';
    locationBox.style.margin = '12px 0';
    locationBox.innerHTML = `
      <summary><b>Where to get ${safe(pretty(data.name))}</b></summary>
      <div class="td66-section-body">
        <p class="note">Looking up acquisition information…</p>
      </div>`;
    res.appendChild(locationBox);
    if(td72DetailOrigin||['dex','team','maps','battle','planner','team-planner'].includes(source)){const heading=res.querySelector('article h2');if(heading){const row=document.createElement('div');row.className='td64-move-heading';heading.before(row);row.append(heading);const backButton=document.createElement('button');backButton.type='button';backButton.className='td64-move-back';backButton.textContent='← Back';backButton.onclick=back;row.append(backButton);}}
    requestAnimationFrame(()=>{if(mine===req&&!page.hidden&&machinePanel.hidden)res.scrollIntoView({block:'start'})});
    if(!machinePanel.hidden){/* The machine panel already displays compatibility for the selected species or team. */}else if(compatible){const mode=$('td5FilterMode').value,team=teams.find(t=>t.id===$('td5FilterTeam').value);if(mode==='team'&&team){const compat=document.createElement('section');compat.className='card td72-move-compat';compat.innerHTML=`<h3>Who can learn ${safe(pretty(name))} in my team?</h3><div class="td74-mon-row td51-compat-strip">${td51CompatTiles(team.pokemon||[],(team.pokemon||[]).map(m=>compatible.find(r=>r.mon===m)),name,true)}</div>`;res.appendChild(compat)}else if(compatible.some(r=>r.later.has(name)&&!r.direct.has(name))){const compat=document.createElement('section');compat.className='card';compat.textContent='↑ After evolution';res.appendChild(compat)}}else if(current?.id&&(!td72MoveGameOverride||td72MoveGameOverride===current.game)){const teamId=current.id,compat=document.createElement('section');compat.id='td72MoveCompatibility';compat.className='card td72-move-compat';compat.innerHTML='<h3>Who can learn it in my team?</h3><p class="note">Checking game-specific compatibility…</p>';res.appendChild(compat);td72RenderMoveTeamCompatibility(data.name,teamId,mine).catch(error=>{if(mine===req&&compat.isConnected)compat.textContent='Team compatibility data unavailable.';console.warn('Move compatibility unavailable',error)})}

    // A loaded team limits the guide to its game. Without one, show every
    // game for which the existing acquisition guide has a verified location.
    const locationGames = game
      ? [game]
      : ['Emerald', 'Platinum', 'FireRed', 'LeafGreen', 'Black', 'White', 'Black 2', 'White 2'];
    const guide = window.takDexMachineGuideV65;
    const locations = await Promise.all(locationGames.map(async (locationGame) => {
      if (introduced > gameGeneration(locationGame)) return null;
      try {
        const acquisition = await guide?.findMoveLocation(locationGame, data.name, data);
        return acquisition?.location ? {game: locationGame, ...acquisition} : null;
      } catch (error) {
        console.warn('Move location lookup failed for '+locationGame+':', error);
        return null;
      }
    }));

    if (mine !== req) return;

    const known = locations.filter(Boolean);
    const body = locationBox.querySelector('.td66-section-body');
    const td73Tutors = window.takDexTutorV73?.find(game, data.name)||[];
    body.innerHTML = known.length
      ? known.map(acquisition => `
          <div style="margin-bottom:14px">
            <p><b>${safe(acquisition.game)}</b></p>
            <p>${safe(String(acquisition.item).toUpperCase())} ·
              ${['Emerald','Platinum','Black','White','Black 2','White 2'].includes(acquisition.game)?
                `<button type="button" class="td74-dex-map-link" data-td74-machine-location="${safe(acquisition.location)}" data-td74-machine-game="${safe(acquisition.game)}">${safe(acquisition.location)} <span aria-hidden="true">⌖</span></button>`:safe(acquisition.location)}</p>
            <p class="note">${safe(acquisition.reuse)}</p>
            ${window.td62Progress?.moveAccess(acquisition.game,data.name,'machine').map(note=>`<small>${safe(note)}</small>`).join('')||''}
          </div>
        `).join('')
      : `<div class="td68-acquisition-empty" role="status" style="padding:6px 0 3px">
           <p style="margin:0 0 6px"><strong>No acquisition information available yet.</strong></p>
           <p class="note" style="margin:0">${game
             ? 'We don\'t have a verified location for this move in the selected game.'
             : 'No verified acquisition locations are currently available for this move.'}</p>
         </div>`;
    if(td73Tutors.length){
      if(!known.length)body.innerHTML='';
      body.insertAdjacentHTML('beforeend',td73Tutors.map(tutor=>`<div class="td73-move-tutor"><p><b>${safe(tutor.game)} · Move Tutor</b></p><p><button type="button" class="td74-dex-map-link" data-td73-map-link="${safe(tutor.place)}" data-td73-map-game="${safe(tutor.game)}">${safe(tutor.place)} <span aria-hidden="true">⌖</span></button> · ${safe(tutor.detail)}</p><p class="note">Cost: ${safe(tutor.cost)}${tutor.condition?' · '+safe(tutor.condition):''}</p></div>`).join(''));
    }

    if(moveAcquisitionContext&&!body.textContent.includes(moveAcquisitionContext))
      body.insertAdjacentHTML('afterbegin','<p class="note">'+td77AcquisitionLinks(moveAcquisitionContext,game).replaceAll('data-td74-dex-map=',
       'data-td78-move-game="'+safe(game)+'" data-td78-move-map=')+'</p>');
  }catch(e){if(mine===req)res.innerHTML='<p class="error">Could not load that move. Check spelling or reconnect to download its record.</p>'}
 }
  let coverageRequest=0;
 async function showCoverage(){
  source='more';openPage('coverage');
  const host=$('td68CoverageResults'),request=++coverageRequest;
  host.innerHTML='<p class="note">Reading reference sources…</p>';
  try{
   const games=await td79CoverageInventory();
   if(report.hidden||request!==coverageRequest)return;
   const line=(name,value)=>`<small><b>${name}</b> · ${safe(value)}</small>`;
   host.innerHTML=`<div class="card" style="padding:0">${games.map(x=>{
    const t=x.totals;
    return `<div class="td68-coverage-row"><strong>${safe(x.game)}</strong>
     ${line('Version group',x.group+(x.shared.length?' · Shared reference with '+x.shared.join(', '):''))}
     ${line('Reference storage',x.downloadedReference)}
     ${line('Encounters',x.encounter?.rows?`${x.encounter.rows.toLocaleString()} source rows · ${x.encounter.groups.toLocaleString()} merged groups · ${x.encounter.source}`:
      x.encounter?'No encounter records in the indexed source · Availability unknown':'Encounter source unavailable · Availability unknown')}
     ${line('Encounter storage',x.downloadedEncounter)}
     ${line('TM/HM assignments',x.machines?`${x.machines.count} assignments · ${x.machines.source}`:'Unverified')}
     ${line('Trainer presets',t.trainers?`${t.trainers} trainers · ${t.variants} variants · ${t.entries} Pokémon entries`:'No indexed preset')}
     ${t.entries?line('Trainer fields',`Moves ${t.moves}/${t.entries} · Abilities ${t.abilities}/${t.entries} · Item status ${t.items}/${t.entries} · Other entries unverified`):''}
     ${x.providers.length?line('Trainer sources',x.providers.join(' · ')):''}
     ${line('Acquisition',x.acquisition||'Game-specific milestones unverified')}
     ${line('Events',x.maps?.events?`${x.maps.events} indexed map events/services · Partial`:'Unverified')}
     ${line('Tutors',x.tutors?`${x.tutors} referenced tutor entries · Partial, bundled`:'Unverified')}
     ${line('Map',x.maps?`${x.maps.places} indexed places · ${x.maps.source}`:'No interactive map')}
     ${line('Progression',x.progression||'Save progression unverified')}
    </div>`;
   }).join('')}</div>`;
  }catch{if(request===coverageRequest&&!report.hidden)host.textContent='Coverage sources could not be read. Try again.';}
 }
 covButton.addEventListener('click',showCoverage);$('td68CoverageBack').addEventListener('click',()=>{report.hidden=true;window.takActivate(3);more.hidden=true;aboutPage.hidden=false;window.scrollTo(0,0)});
 ['teamsTab','battleTab','dexTab','moreTab'].forEach(id=>$(id).addEventListener('click',()=>{report.hidden=true}));
 // Raise the currently open autocomplete above adjacent rows; flip upward near viewport bottom.
 function placePopup(box){if(!box||box.hidden||!box.isConnected)return;const input=box.closest('.td65-move-search')?.querySelector('input')||box.closest('label')?.querySelector('input.td66-pokemon-input');if(!input)return;const r=input.getBoundingClientRect();const below=innerHeight-r.bottom;const above=r.top;box.classList.toggle('td68-open-up',below<175&&above>below);}
 const observer=new MutationObserver(records=>{for(const r of records){const e=r.target;if(e?.matches?.('#plannerPage .td65-move-options,#plannerPage .td66-pokemon-options'))placePopup(e);}});
 observer.observe($('plannerPage'),{subtree:true,attributes:true,attributeFilter:['hidden']});
 $('plannerPage').addEventListener('focusin',e=>{const host=e.target.closest('.td65-move-search, .td63-slot-fields label');if(host)requestAnimationFrame(()=>placePopup(host.querySelector('.td65-move-options,.td66-pokemon-options')))});
 window.addEventListener('resize',()=>document.querySelectorAll('#plannerPage .td65-move-options:not([hidden]),#plannerPage .td66-pokemon-options:not([hidden])').forEach(placePopup));
 window.takDexMoveV68={open:launch,back,load};
})();

// V71: restore only an explicitly selected team, never invent an Emerald default.
queueMicrotask(()=>{try{const id=localStorage.getItem('takdex-v71-active-team');if(id&&teams.some(t=>t.id===id))openTeam(id);else refreshTeamMenus()}catch(error){console.warn('V71 team restore failed',error)}});

// Use the same pointer gesture for Pokémon actions in all screens.
const td77HoldTargets=new Map();
let td77HoldPress=null,td77HoldRelease=false;
function td77RegisterHold(selector,action,duration=500){td77HoldTargets.set(selector,{action,duration});}
function td77HoldTarget(target){
 for(const [selector,options] of td77HoldTargets){
  const element=target?.closest?.(selector);
  if(element)return {element,...options};
 }
 return null;
}
const td77IsEditable=element=>element?.closest?.('input,textarea,select,[contenteditable="true"]');
function td77CancelHold(){if(td77HoldPress)clearTimeout(td77HoldPress.timer);td77HoldPress=null;}
document.addEventListener('pointerdown',event=>{
 td77HoldRelease=false;
 if(event.button!==0||event.isPrimary===false||td77IsEditable(event.target)){td77CancelHold();return;}
 const target=td77HoldTarget(event.target);
 if(!target)return;
 const press={...target,id:event.pointerId,x:event.clientX,y:event.clientY};
 td77HoldPress=press;
 press.timer=setTimeout(()=>{
  if(td77HoldPress!==press||!press.element.isConnected)return;
  td77HoldRelease=true;
  navigator.vibrate?.(22);
  press.action(press.element);
 },press.duration);
},true);
document.addEventListener('pointermove',event=>{
 const press=td77HoldPress;
 if(press&&press.id===event.pointerId&&Math.hypot(event.clientX-press.x,event.clientY-press.y)>12)td77CancelHold();
},true);
for(const type of ['pointerup','pointercancel'])document.addEventListener(type,event=>{
 if(td77HoldPress?.id===event.pointerId)td77CancelHold();
},true);
document.addEventListener('scroll',td77CancelHold,{capture:true,passive:true});
document.addEventListener('click',event=>{
 if(!td77HoldRelease||event.detail===0)return;
 td77HoldRelease=false;event.preventDefault();event.stopImmediatePropagation();
},true);
document.addEventListener('contextmenu',event=>{
 if(!td77IsEditable(event.target))event.preventDefault();
},true);
document.addEventListener('selectstart',event=>{
 if(!td77IsEditable(event.target))event.preventDefault();
},true);
document.addEventListener('dragstart',event=>{
 if(td77HoldTarget(event.target))event.preventDefault();
},true);
document.addEventListener('keydown',event=>{
 const target=event.shiftKey&&['Enter',' '].includes(event.key)&&td77HoldTarget(event.target);
 if(target){event.preventDefault();event.stopImmediatePropagation();target.action(target.element);}
},true);

(function td71QuickCompare(){
 const panel=document.createElement('dialog');
 panel.id='td71CompareQuick';panel.className='td71-quick-dialog';
 panel.innerHTML='<h3>Quick compare</h3><p id="td71QuickName"></p><div id="td71QuickSlots"></div><div class="td77-quick-actions"><button type="button" id="td71QuickClose">Close</button><button type="button" id="td77QuickOpen">Open Compare</button></div>';
 document.body.append(panel);
 const slots=$('td71QuickSlots'),open=$('td77QuickOpen');
 function render(){
  const selection=window.takDexCompareV71.getSlots();
  slots.innerHTML=['A','B'].map((side,i)=>`<div class="td71-quick-slot"><span><small>Pokémon ${i+1}</small><strong>${safe(pretty(selection[side]||'Empty slot'))}</strong></span><button type="button" data-td71-quick-side="${side}">Replace</button></div>`).join('');
  open.disabled=!selection.A||!selection.B;
 }
 $('td71QuickClose').onclick=()=>panel.close();
 open.onclick=()=>{
  const {game,scroll,context}=panel.dataset;
  panel.close();window.takDexCompareV71.openFromDex(game,Number(scroll),context);
 };
 window.tdDev2QuickCompare=(name,game='',context='')=>{
  if(!window.takDexCompareV71||panel.open)return;
  $('td71QuickName').textContent=pretty(name);
  Object.assign(panel.dataset,{pokemon:name,game,context,scroll:String(window.scrollY)});
  render();panel.showModal();
 };
 slots.addEventListener('click',async event=>{
  const button=event.target.closest('[data-td71-quick-side]');
  if(!button)return;
  const {pokemon,game}=panel.dataset;
  const result=window.takDexCompareV71.replace(button.dataset.td71QuickSide,pokemon,game);
  render();
  try{await result;}finally{if(panel.open)render();}
 });
})();

// V74 DEV4: saved custom opponent lineups, separate from player teams.
(function td4OpponentPresets(){
 const key='takdex-v74-opponent-presets',clone=x=>JSON.parse(JSON.stringify(x));
 const read=()=>{try{const x=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(x)?x.filter(p=>p&&typeof p.id==='string'&&games.includes(p.game)&&Array.isArray(p.rows)):[]}catch{return []}};
 const host=document.createElement('div');host.id='td4OpponentPresets';host.innerHTML=`<label>Saved custom opponent<select id="td4OpponentSelect"></select></label><label>Preset name<input id="td4OpponentName" maxlength="80" placeholder="Name your opponent team"></label><div class="bar td4-actions"><button type="button" id="td4OpponentSave">Save</button><button type="button" id="td4OpponentDelete">Delete</button></div><small id="td4OpponentStatus" role="status"></small>`;
 $('eliteOptions').after(host);
 let selected='',previousGame='';
 function message(t){$('td4OpponentStatus').textContent=t;}
 function render(){const g=$('planGame').value;host.hidden=$('planMode').value!=='custom';if(g!==previousGame){selected='';$('td4OpponentName').value='';previousGame=g;}const rows=read().filter(x=>x.game===g);if(!rows.some(x=>x.id===selected))selected='';$('td4OpponentSelect').innerHTML='<option value="">New / select saved opponent…</option>'+rows.map(x=>`<option value="${safe(x.id)}">${safe(x.name)}</option>`).join('');$('td4OpponentSelect').value=selected;$('td4OpponentDelete').disabled=!selected;}
 function write(rows){try{localStorage.setItem(key,JSON.stringify(rows));return true}catch{message('Could not save opponent. Storage unavailable.');return false}}
 function load(id){const r=read().find(p=>p.id===id&&p.game===$('planGame').value);if(!r)return;selected=id;$('td4OpponentName').value=r.name;++td70TrainerRosterToken;++td70PlannerRequest;plannerOpp=clone(r.rows);renderPlannerSlots('planOpp',plannerOpp,false);render();message('Loaded '+r.name);$('planAnalyze').click();}
 function commit(){const name=$('td4OpponentName').value.trim(),game=$('planGame').value;if(!games.includes(game)||!name||!plannerOpp.some(x=>x?.name)){message('Choose a game, name and at least one Pokémon.');return;}const list=read(),old=list.find(x=>x.id===selected&&x.game===game);const update=!!old;if(list.some(x=>x.game===game&&x.name.toLowerCase()===name.toLowerCase()&&(!update||x.id!==selected))){message('That preset name already exists.');return;}const id=update?old.id:td71NewTeamId();const next={id,game,name,rows:clone(plannerOpp.slice(0,6)),updated:Date.now()};const all=update?list.map(x=>x.id===id?next:x):[...list,next];if(write(all)){selected=id;render();message('Saved '+name);}}
 $('td4OpponentSelect').onchange=()=>{const id=$('td4OpponentSelect').value;if(id)load(id);else{selected='';$('td4OpponentName').value='';render();}};
 $('td4OpponentSave').onclick=commit;
 $('td4OpponentDelete').onclick=async()=>{const old=read().find(x=>x.id===selected);if(!old||!await td78Confirmation('Delete '+old.name+'?','','Delete'))return;if(write(read().filter(x=>x.id!==old.id))){selected='';$('td4OpponentName').value='';render();message('Preset deleted.');}};
 for(const id of ['planGame','planMode'])$(id).addEventListener('change',()=>{selected='';$('td4OpponentName').value='';message('');render()});
 $('openPlanner').addEventListener('click',()=>{selected='';$('td4OpponentName').value='';render()});
 window.addEventListener('td75:active-game',render);new MutationObserver(()=>{host.hidden=$('planMode').value!=='custom';if(previousGame!==$('planGame').value)render()}).observe($('planOpp'),{childList:true});
 render();
})();

// DEV6.2: conservative story gates. References: Bulbapedia BW/B2W2 walkthroughs,
// Pokémon Database HM locations, Smogon BW key items, Bulbapedia Move Deleter.
// A location gate is a lower bound, not a claim that every encounter/item there is accessible.
(function(){
 const norm=v=>String(v||'').toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 const bw=g=>g==='Black'||g==='White', sequel=g=>g==='Black 2'||g==='White 2',unova=g=>bw(g)||sequel(g);
 const rank=id=>id==='start'?0:/^badge-[1-8]$/.test(id)?Number(id.slice(6)):id==='pre-league'?9:['post-league','postgame'].includes(id)?10:null;
 const milestone=n=>n===0?'Start of game':n===9?'Before Elite Four':n===10?'Postgame':`After badge ${n}`;
 const groups=(arr)=>Object.fromEntries(arr.flatMap(([n,places])=>places.split('|').map(p=>[norm(p),n])));
 const original=groups([[0,'Nuvema Town|Route 1|Accumula Town|Route 2|Striaton City|Dreamyard'],[1,'Route 3|Wellspring Cave|Nacrene City|Pinwheel Forest'],[2,'Skyarrow Bridge|Castelia City'],[2,'Route 4'],[3,'Desert Resort|Relic Castle|Nimbasa City|Route 16|Lostlorn Forest|Anville Town'],[4,'Route 5|Driftveil Drawbridge|Driftveil City|Cold Storage'],[5,'Route 6|Chargestone Cave|Mistralton City|Route 7|Celestial Tower'],[6,'Twist Mountain|Icirrus City|Moor of Icirrus|Dragonspiral Tower|Route 17|Route 18|P2 Laboratory|Mistralton Cave'],[7,'Route 8|Tubeline Bridge|Route 9|Opelucid City'],[8,'Route 10|Victory Road'],[10,'Challengers Cave|Route 11|Village Bridge|Route 12|Lacunosa Town|Route 13|Giant Chasm|Undella Town|Undella Bay|Route 14|Abundant Shrine|Black City|White Forest|Route 15|Marvelous Bridge|Abyssal Ruins']]);
 const later=groups([[0,'Aspertia City|Route 19|Floccesy Town|Route 20|Floccesy Ranch'],[1,'Virbank City|Virbank Complex'],[2,'Castelia City|Castelia Sewers|Relic Passage'],[2,'Route 4'],[3,'Desert Resort|Relic Castle|Join Avenue|Nimbasa City|Route 16|Lostlorn Forest|Anville Town'],[4,'Route 5|Driftveil Drawbridge|Driftveil City'],[5,'Pokemon World Tournament|Route 6|Mistralton Cave|Chargestone Cave|Mistralton City|Route 7|Celestial Tower'],[6,'Lentimas Town|Strange House|Reversal Mountain|Undella Town|Undella Bay|Route 13|Lacunosa Town|Route 12|Village Bridge|Route 11|Opelucid City|Route 9'],[7,'Marine Tube|Humilau City'],[8,'Route 22|Route 21|Seaside Cave|Giant Chasm|Plasma Frigate'],[9,'Route 23|Victory Road'],[10,'Cave of Being|Clay Tunnel|Underground Ruins|Abyssal Ruins|Route 14|Abundant Shrine|Black City|White Forest|Route 15|Marvelous Bridge|Tubeline Bridge|Route 8|Moor of Icirrus|Icirrus City|Dragonspiral Tower|Skyarrow Bridge|Pinwheel Forest|Nacrene City|Route 3|Wellspring Cave|Striaton City|Dreamyard|Route 2|Accumula Town|Route 1|Route 17|Route 18|P2 Laboratory|Nuvema Town|Nature Preserve']]);
 function location(g,place){if(!unova(g))return null;const map=bw(g)?original:later,raw=norm(String(place||'').split('·')[0]).replace(/^unova-/,'');const key=Object.keys(map).sort((a,b)=>b.length-a.length).find(k=>raw===k||raw.startsWith(k+'-'));return key?map[key]:null;}
 const hmData={bw:{cut:[1,'Striaton City / Dreamyard'],fly:[5,'Driftveil City'],surf:[6,'Alder near Twist Mountain'],strength:[3,'Nimbasa City'],waterfall:[6,'Route 18 (Surf)'],dive:[10,'Undella Town']},b2:{cut:[2,'Virbank City'],fly:[4,'Route 5'],surf:[5,'Route 6 · Cheren after the Plasma Frigate incident at the PWT'],strength:[2,'Castelia Sewers'],waterfall:[9,'Victory Road'],dive:[10,'Undella Town']}};
 function hm(g,h,progress){const r=(bw(g)?hmData.bw:sequel(g)?hmData.b2:null)?.[h];if(!r)return null;const now=rank(progress),used=bw(g)&&h==='cut'&&now!==null&&now>=2;return {rank:r[0],place:r[1],used,text:`${r[1]} · ${milestone(r[0])}${now===null?'':now<r[0]?' · Not yet obtainable':used?' · Mandatory use completed':' · HM obtainable'}`};}
 function hmRemoval(g,h){if(!unova(g))return null;if(bw(g))return h==='cut'?'Mandatory Dreamyard use ends after badge 1; remove in Mistralton City after badge 5 if no longer needed.':'Move Deleter: Mistralton City · after badge 5';return ['surf','strength'].includes(h)?'Required for main story; retain through Victory Road. Move Deleter: Pokémon World Tournament.':'Move Deleter: Pokémon World Tournament · after badge 5';}
 function encounter(g,row){
  const place=window.takDexAcquisitionV77?.placeName(row[0],g)||row[0],method=norm(row[1]),areaRank=location(g,row[0]);
  if(areaRank==null)return null;
  let requirement=null, methodRank=areaRank;
  if(/rod|fish/.test(method)){requirement='Super Rod';methodRank=10;}
  else if(/surf/.test(method)){requirement='Surf';methodRank=bw(g)?6:5;}
  else if(!/^(walk|grass|dark-grass|yellow-flowers|purple-flowers|red-flowers|rough-terrain|cave|rock-smash|shaking-grass|rustling-grass|grass-spots|cave-spots|bridge-spots)$/.test(method))return null;
  return {rank:Math.max(areaRank,methodRank),areaRank,place,method,requirement};
 }
 function detected(progress){return progress?.postgame?'postgame':Number.isInteger(progress?.badgeCount)?(progress.badgeCount?'badge-'+progress.badgeCount:'start'):'';}
 function actualProgress(game){return current?.game===game?current.saveLink?.progression:null;}
 function encounterAccess(game,row){
  const conditional=window.takDexAcquisitionV77?.conditionalEncounterNote(game,row);
  if(conditional)return conditional;
  const gate=encounter(game,row),verified=window.takDexAcquisitionV77?.encounterRoute(game,row);
  if(verified)return [milestone(verified.rank),verified.note].filter(Boolean).join(' · ');
  if(!gate)return '';
  const progress=actualProgress(game),now=rank(detected(progress));
  const needsSurf=gate.requirement==='Surf'&&Array.isArray(progress?.hms)&&!progress.hms.includes('surf');
  return ['Area: '+milestone(gate.areaRank)+' or later',gate.requirement&&('Requires '+gate.requirement),
   needsSurf?'Surf missing':now!=null&&now<gate.rank?'Later · '+milestone(gate.rank):'Exact access unverified'].filter(Boolean).join(' · ');
 }
 const starterFamilies=[['snivy','servine','serperior'],['tepig','pignite','emboar'],['oshawott','dewott','samurott']];
 function starterFamily(g,n){return unova(g)?starterFamilies.find(f=>f.includes(norm(n))):null;}
 function starterChoice(g,n,owned){const family=starterFamily(g,n);if(!family)return null;const matching=owned.some(p=>p&&family.includes(norm(p.name)));if(matching)return null;const others=starterFamilies.filter(f=>f!==family&&owned.some(p=>p&&f.includes(norm(p.name))));return {kind:'tradePossible',reason:others.length?'Other starter family on team · alternative starter choice requires trade/import':'One starter choice per playthrough · verify chosen starter'};}
 const directOverrides={Black:{rufflet:'White exclusive',braviary:'White exclusive'},White:{vullaby:'Black exclusive',mandibuzz:'Black exclusive'},'Black 2':{rufflet:'White 2 exclusive',braviary:'White 2 exclusive'},'White 2':{vullaby:'Black 2 exclusive',mandibuzz:'Black 2 exclusive'}};
 function acquisition(g,slot,pack,owned,evidence){const name=norm(slot?.name),id=Number(slot?.id);if(!slot)return {kind:'unknown'};if(owned.some(p=>p&&(norm(p.name)===name||id&&Number(p.id)===id)))return {kind:'owned'};const starter=starterChoice(g,name,owned);if(starter)return starter;if(directOverrides[g]?.[name])return {kind:'trade',reason:directOverrides[g][name]};const audited=window.takDexAcquisitionV77?.lookup(g,name,pack?.entries?.[id]);if(audited?.confirmed||['trade','event','tradePossible'].includes(audited?.kind))return audited;const inherited=window.takDexAcquisitionV77?.levelPath(g,id,pack,owned);if(inherited)return inherited;if(audited)return audited;const documented=window.takDexAcquisitionV77?.documentedUnovaAlternative(g,name,pack);if(documented)return documented;const transfer=window.takDexAcquisitionV77?.transferOnly(g,id,name);if(transfer&&!pack?.entries?.[id]?.length)return transfer;if(bw(g)&&['poliwag','poliwhirl','poliwrath','politoed'].includes(name)&&!owned.some(p=>p&&(['poliwag','poliwhirl'].includes(norm(p.name))))){return {kind:'timed',confirmed:true,rank:10,place:'Super Rod / fishing',method:'postgame fishing',note:name==='politoed'?'Evolution also requires a trade with King’s Rock.':''};}if(!pack||pack.game!==g||!id)return {kind:'unknown'};const rec=pack.entries?.[id]||[],gates=rec.map(r=>encounter(g,r)).filter(Boolean).sort((a,b)=>a.rank-b.rank);if(gates.length&&gates.length===rec.length){const first=gates[0],mon=pack.mons?.find(x=>x[0]===id),confirmed=false;return {kind:'timed',...first,confirmed,note:mon?.[4]?'Recorded wild encounter; evolution may be available earlier.':'Recorded encounter; method and other conditions apply.'};}if(evidence?.externalTrade&&pack.hasSource&&!evidence.verified)return {kind:'trade',reason:'Known external trade or trade evolution requirement'};if(evidence?.notes?.some(n=>n.eventOnly))return {kind:'event',reason:'Event-only acquisition'};const parents=new Set();let v=id;while(v&&!parents.has(v)){parents.add(v);v=pack.mons?.find(x=>x[0]===v)?.[4]||0;}const parent=owned.find(p=>p&&parents.has(Number(p.id)));if(parent)return {kind:'evolution',reason:'Earlier evolution on team · evolution requirements not verified'};if(evidence?.nativeEvolution)return {kind:'evolution',reason:'Evolution route · level, item, or trade requirement still unverified'};if(gates.length)return {kind:'partial',...gates[0]};if(rec.length)return {kind:'recorded',place:window.takDexAcquisitionV77?.placeName(rec[0][0],g)||rec[0][0]};return {kind:'unknown',reason:evidence?.label};}
 const late=(r,id)=>r?.kind==='timed'&&rank(id)!=null&&r.rank>rank(id);
 function tone(r,current,target){if(r.kind==='owned')return 'td41-good';if(['trade','event'].includes(r.kind)||late(r,target))return 'td63-danger';if(r.kind==='timed'&&rank(current)!=null){if(r.rank>rank(current))return 'td63-danger';if(r.confirmed)return 'td41-good';}return '';}
 function describe(r,current,target){const now=rank(current);if(r.kind==='owned')return 'Already on team';if(r.kind==='trade')return 'Trade or import required · '+r.reason;if(r.kind==='tradePossible')return r.reason+' · Trade/import may be required; coverage incomplete';if(r.kind==='event')return r.reason+' · Event availability not verified';if(r.kind==='evolution')return r.reason;if(r.kind==='timed'){const status=r.rank===10?(now>=10?(r.confirmed?'Available now · Postgame':'Recorded encounter: postgame'):(r.confirmed?'Postgame only':'Recorded encounter: postgame')):now==null?'Acquisition from '+milestone(r.rank):now>=r.rank?(r.confirmed?'Available now':'Area access estimated'):'Available later · '+milestone(r.rank);return [status,r.place?.replace(/-/g,' '),r.note,late(r,target)?(r.confirmed?'After planning deadline.':'Recorded encounter is later than target; check alternative acquisition.') :''].filter(Boolean).join(' · ');}if(r.kind==='partial'&&r.note)return r.note+' · '+r.place+' · '+milestone(r.rank);if(r.kind==='partial')return 'Recorded encounter · '+String(r.place).replace(/-/g,' ')+' · Earliest access not fully verified';if(r.kind==='recorded')return 'Recorded encounter · '+String(r.place).replace(/-/g,' ')+' · Timing unverified';return r.reason&&r.reason!=='Not indexed'?r.reason+' · Timing unverified':'Acquisition timing unverified';}
 function moveTiming(g,name,methods){if(!Array.isArray(methods)||!methods.length)return null;if(!unova(g))return window.takDexAcquisitionV77?.johtoMoveTiming(g,norm(name),methods)||null;const level=methods.filter(m=>m[0]==='level-up').map(m=>+m[1]).filter(n=>n>0),options=[],verified=[],requirements=[],displayRoutes=[];
 if(level.length){const best=Math.min(...level);options.push('Level '+best);displayRoutes.push({label:'Level up',level:best});}if(level.includes(1)){const reminder=window.takDexAcquisitionV77?.moveReminder(g);if(reminder){options.push(reminder.text);displayRoutes.push(td773ReminderRoute(reminder));}}if(methods.some(m=>m[0]==='egg')){options.push('Egg move');displayRoutes.push({label:'Egg move'});}if(methods.some(m=>m[0]==='tutor')){const tutors=window.takDexTutorV73?.find(g,name)||[];if(tutors.length){for(const t of tutors){const place=norm(t.place.normalize('NFD').replace(/[\u0300-\u036f]/g,''));const gate=sequel(g)?({'driftveil-city':4,'lentimas-town':6,'humilau-city':7,'nacrene-city':10,'pokemon-world-tournament':5,'opelucid-city':7,'cafe-sonata':2,'pledge-grove':0})[place]:
   ({'driftveil-city':4,'route-13':10,'opelucid-city':7,'cafe-sonata':2,'moor-of-icirrus':7})[place];options.push('Tutor · '+t.place+' · '+t.cost+(gate==null?'':' · '+milestone(gate))+(t.condition?' · '+t.condition:''));displayRoutes.push({label:'Tutor',place:t.place,resource:t.cost,rank:gate,details:t.condition?[t.condition]:[],uncertain:gate==null});
 if(gate!=null)verified.push(gate);}}else{options.push('Tutor timing unverified');displayRoutes.push({label:'Tutor',uncertain:true});}}const machine=(bw(g)?window.takDexUnovaV74:window.takDexB2W2)?.machines?.find(m=>norm(m.move)===norm(name));if(methods.some(m=>m[0]==='machine')){if(machine){const h=hm(g,name,''),shop=machine.location.match(/^(.*?) (?:Poké Mart|· shop)(?:,|$)/)?.[1];
 const audited=window.takDexAcquisitionV77?.machineGate(g,machine.item);
 const bp=sequel(g)&&machine.location.startsWith('Pokémon World Tournament ·')?5:bw(g)&&machine.location.startsWith('Battle Subway ·')?3:null;
 const specific=(bw(g)?{'ice-beam':10,earthquake:10,'work-up':1,retaliate:2,'struggle-bug':3,'volt-switch':4,bulldoze:5,acrobatics:6,'frost-breath':7,'dragon-tail':8,dig:2,scald:4,'rock-tomb':3}: {'ice-beam':8,earthquake:10,'energy-ball':5,'rock-slide':5,'wild-charge':9,'thunderbolt':9,'false-swipe':6,retaliate:8,'work-up':1,return:1,venoshock:2,'struggle-bug':3,'volt-switch':4,bulldoze:5,acrobatics:6,'dragon-tail':7,scald:8,dig:2,frustration:0,thief:1,'rock-smash':1})[norm(name)],gate=h?.rank??audited?.[0]??specific??bp??(shop?location(g,shop):null);options.push(machine.item.toUpperCase()+' · '+machine.location+(gate!=null?' · '+milestone(gate):' · location access '+(location(g,machine.location)==null?'unverified':milestone(location(g,machine.location)))));if(audited?.[1])requirements.push(audited[1]);if(bw(g)&&machine.item==='tm95')requirements.push('Lock Capsule was never distributed');if(gate!=null)verified.push(gate);
 const [heading,...subareas]=machine.location.split(' · ');
 const place=machine.place||shop||heading.trim().split(',')[0];
 const locationNote=(heading.startsWith(place)?heading.slice(place.length):heading).replace(/^[, ·]+/,'').trim();
 const notes=[...new Set([...subareas,locationNote,...requirements].filter(Boolean))];
 const cost=notes.find(note=>/^(?:[₽$]\s*\d|\d[\d,]*\s*(?:BP|coins|shards?)\b|shop,\s*\d)/i.test(note));
 displayRoutes.push({label:machine.item.toUpperCase(),place,resource:cost?.replace(/^shop,\s*/i,''),rank:gate,
  details:notes.filter(note=>note!==cost),uncertain:gate==null});
 }else displayRoutes.push({label:'Machine',uncertain:true});}
 return options.length?{text:options.join(' / ')+(requirements.length?' · '+requirements.join(' · '):''),rank:verified.length?Math.min(...verified):null,requirements,displayRoutes}:null;
 }

 function moveAccess(game,name,method){
  const timing=moveTiming(game,name,[[method,0]]);
  if(!timing)return [];
  const current=rank(detected(actualProgress(game)));
  return [...(timing.rank!=null?[milestone(timing.rank)+(current!=null&&current<timing.rank?' · Later in story':'')]:[]),...timing.requirements];
 }

 window.td62Progress={coverage:game=>unova(game)?'Badge and story-event gates · Gen V save observation':'Planning milestones only; save progression unverified',rank,milestone,location,hm,hmRemoval,encounter,acquisition,describe,late,tone,moveTiming,starterChoice,detected,actualProgress,encounterAccess,moveAccess};
})();

// V74 DEV4: playthrough Team Planner. Planned slots are saved independently of actual teams.
(function td4TeamPlanner(){
 const clean=x=>String(x||'').trim().toLowerCase().replace(/\s+/g,'-');
 const six=()=>Array.from({length:6},()=>null);
 const planWrites=new Map();
 const records=new Map();let state=null,pack=null,token=0,rankRun=0,ranked=[],chosenSlot=0,lookup=null,manualCandidate=null,manualRun=0; const moveInfo=new Map(),leagueInfo=new Map(),temporaryHmCache=new Map(); let moveRun=0;
 const more=$('morePage'),page=document.createElement('section');page.id='td4TeamPlannerPage';page.hidden=true;
 more.after(page);
 page.innerHTML=`<div class="bar"><h2>Team Planner</h2><button type="button" id="td4Back">← My Team</button></div><div class="tool-card"><h3 id="td41TeamTitle"></h3><div hidden><select id="td4Game"><option value="">Choose game…</option>${gameOptions}</select><select id="td4Team"></select></div><small id="td77ActualProgress" hidden></small><label>Planning deadline<select id="td77Availability"></select></label><div class="td44-reset"><button id="td4Seed" class="delete-team-link" type="button">Reset plan</button></div><small id="td4Status" role="status"></small></div><div id="td77MoveViews" class="bar" role="tablist" aria-label="Planning mode"><button type="button" role="tab" data-view="during">During game</button><button type="button" role="tab" data-view="final">Final</button></div><div class="card"><h3>Planned team</h3><div id="td4Slots" class="td4-plan-grid"></div><div id="td4PlanProgress"></div></div><div id="td4Edit" class="card" hidden><div id="td72MoveHeading" hidden><h4 id="td72MoveTitle"></h4><div class="td7-reset-top"><button type="button" id="td77Lock" aria-pressed="false" hidden>Lock Pokémon</button><button type="button" class="td774-secondary" id="td4Clear">Reset</button><button type="button" class="td774-secondary td78-remove-stage" id="td78RemovePlan" data-td78-remove-stage hidden>Remove</button></div></div><div id="td77FinalForm" hidden></div><div id="td77SlotRoute"></div><div id="td41MoveSlots"></div><details class="td42-settings"><summary><span>Change Pokémon</span><span id="td63SelectedReplacement"></span></summary><small id="td775ReplacementLocked" hidden></small><div class="td77-candidate-search td772-filter-line"><div class="search"><input id="td4Search" autocomplete="off" placeholder="Search Pokémon…"></div>${td772FilterButton("td77TypeFilter","Filter Pokémon by type","td77TypeOptions")}<span id="td77ActiveTypes"></span><div id="td4SearchResults" class="suggestions" hidden></div><div id="td78AddOwned"></div><div id="td77TypeOptions" class="td772-filter-panel" role="group" aria-label="Pokémon type filter" hidden></div></div><div id="td63ManualCandidate"></div><label class="td77-inline-check"><input id="td77Legendary" type="checkbox"> <span>Include Legendary and Mythical Pokémon</span></label><div id="td4CandidateStatus" role="status"></div><div id="td4Candidates"></div><button type="button" class="td774-secondary" id="td79SearchReturn" aria-label="Return to Pokémon search" hidden>⌃</button></details><details id="td5TeamOptimize" class="td42-settings" hidden><summary id="td77SuggestMoves">Suggested moves</summary><div id="td5TeamProposals" hidden></div></details></div><details class="card"><summary class="td77-analysis-summary"><strong>Recommended improvements</strong><small id="td77ImprovementSummary">Review team changes</small></summary><div id="td77Improvements"></div></details><details class="card"><summary class="td77-analysis-summary"><strong>Team coverage</strong><small id="td77CoverageSummary"></small></summary><div id="td4Coverage"></div></details><details class="card"><summary class="td77-analysis-summary"><strong>HM overview</strong><small id="td77HmSummary"></small></summary><div id="td4HM"></div></details><details class="card"><summary class="td77-analysis-summary"><strong>Gym readiness</strong><small id="td77GymSummary"></small></summary><div id="td77Gyms"></div></details><details class="card"><summary class="td77-analysis-summary"><strong>Elite Four readiness</strong><small id="td77LeagueSummary"></small></summary><div id="td4League"></div></details>`;
 const actual=()=>teams.find(t=>t.id===$('td4Team').value&&t.game===$('td4Game').value);
 const effectiveProgress=()=>window.td62Progress.detected(actual()?.saveLink?.progression);
 function renderActualProgress(){
  const badge=$('td77ActualProgress'),progress=actual()?.saveLink?.progression;
  badge.hidden=false;
  badge.textContent='Actual story progression: '+(progress?.postgame?'Postgame unlocked':Number.isInteger(progress?.badgeCount)?progress.badgeCount+'/8 badges':'Not synchronized · import a save in Team Builder')+(actual()?.saveLink?.exportedSnapshot?' · Exported snapshot':'');
 }
 const planKey=()=>[$('td4Game').value,$('td4Team').value||'standalone'].join(':');
 function say(t){$('td4Status').textContent=t;}
 function captureStage(){
  for(const [i,stages] of Object.entries(state.independentSlots||{}))stages[movesetView]=state.slots[i];
 }
 function projectStage(){
  for(const [i,stages] of Object.entries(state.independentSlots||{}))state.slots[i]=stages[movesetView];
 }
 function stageDisplay(i){
  const active=state.slots[i],pair=state.independentSlots?.[i];
  const other=pair?.[movesetView==='during'?'final':'during'];
  const assigned=ownedAssignments();
  const party=actual()?.pokemon||[];
  const member=party[assigned[i]]||(pair?[pair.during,pair.final].map(plan=>matchingIdentity(plan,party)).find(Boolean):null);
  return {active,pair,other,member:member||(!active&&!other&&!assigned.includes(i)?party[i]:null)};
 }
 function separateStages(i,during,final){
  (state.independentSlots??={})[i]={during,final};
  state.slots[i]=state.independentSlots[i][movesetView];
 }
 function persist(){
  if(!state||!games.includes(state.game))return;
  captureStage();
  const proposed=td78Store.copy(state),key=planKey(),id=$('td4Team').value;
  for(const [i,stages] of Object.entries(proposed.independentSlots||{})){
   proposed.slots[i]=stages.final;
   delete stages.final;
  }
  const before=planWrites.get(key);
  if(!before||td78Store.same(before.proposed,proposed))return;
  const write={proposed};
  planWrites.set(key,write);
  const operation=Promise.resolve(before.pending||before.row).then(expected=>td78Store.commit(snapshot=>{
   td78Store.expect(snapshot,'plans',key,expected);
   if(id&&td78Store.entry(snapshot,'teams',id).value?.game!==proposed.game)
    throw td78Store.fault('CONFLICT','The team changed or was deleted. The plan was not saved.');
   td78Store.replace(snapshot,'plans',key,proposed);
  }));
  write.pending=operation.then(result=>td78Store.entry(result.state,'plans',key));
  operation.then(result=>{write.row=td78Store.entry(result.state,'plans',key);write.pending=null;td78ProjectionWarning(result);},error=>{
   write.pending?.catch(()=>{});
   say(error.message);td78WriteWarning(error,{key,plan:proposed});
  });
 }
 function teamMenu(){const g=$('td4Game').value,old=$('td4Team').value;$('td4Team').innerHTML='<option value="">Standalone plan</option>'+teams.filter(t=>t.game===g).map(t=>`<option value="${safe(t.id)}">${safe(t.name)}</option>`).join('');if([...$('td4Team').options].some(o=>o.value===old))$('td4Team').value=old;}
 function load(){++token;++rankRun;manualCandidate=null;++manualRun;$('td63ManualCandidate').innerHTML='';closeMoveSuggestions();$('td5TeamProposals').innerHTML='';ranked=[];pack=null;lookup=null;$('td4Edit').hidden=true;$('td4Candidates').innerHTML='';const g=$('td4Game').value;filterTypes.clear();$('td77TypeOptions').hidden=true;$('td77TypeFilter').setAttribute('aria-expanded','false');const key=planKey(),pending=planWrites.get(key),row=td78Store.entry(td78Store.read().state,'plans',key);const saved=td78Store.copy(pending?.pending?pending.proposed:row.value);if(!pending?.pending)planWrites.set(key,{row,proposed:td78Store.copy(saved)});state=saved?.game===g&&Array.isArray(saved.slots)?saved:{game:g,slots:six(),approved:false,progress:''};state.approved=false;delete state.manualAcquired;
  movesetView=state.mode==='during'?'during':'final';
  for(const [i,stages] of Object.entries(state.independentSlots||{}))stages.final=state.slots[i]??null;
  projectStage();
  state.slots=Array.from({length:6},(_,i)=>{const stored=state.slots[i];
  if(!stored)return null;
  const {finalTarget,imported,...source}=stored;
  const migrated=Number.isInteger(finalTarget?.id)&&finalTarget.id!==stored.id&&
   typeof finalTarget.name==='string'&&Array.isArray(finalTarget.types);
  const p=migrated?{...source,...finalTarget,ability:finalTarget.ability||'',finalLearnset:learnsetFor(finalTarget)}:source;
  p.duringMoves=moveSlots({plannedMoves:p.duringMoves??moveSlots(p).map(m=>({...m,purpose:'keep',replacement:''}))});
  p.milestoneId=milestoneOptions(g).find(x=>x[1]===p.milestone)?.[0]||'';
  return p;});migrateMoves();$('td41MoveSlots').innerHTML='';$('td41TeamTitle').textContent=(actual()?.name||'')+' · '+g;setDeadlineOptions(g);updateTypeFilter();state.progressId=milestoneOptions(g).find(x=>x[1]===state.progress)?.[0]||'';movesetView=state.mode==='during'?'during':'final';say('');persist();render();if(Number.isInteger(state.editorSlot)&&state.editorSlot>=0&&state.editorSlot<6)$('td4Slots').querySelector('[data-td4-slot="'+state.editorSlot+'"]')?.click();refreshMoveInfo();if(g)hydrate(!saved);}
 let plannerActive=false,plannerScroll=0,plannerDirty=false,checkerEditor=null;
 window.td77RememberPlan=()=>{if(plannerActive&&!page.hidden)plannerScroll=window.scrollY;};
 window.td77RestorePlan=()=>{
  if(!plannerActive||!state)return;
  $('teamsPage').hidden=true;page.hidden=false;
  if(plannerDirty){plannerDirty=false;render();if(!$('td4Edit').hidden){renderMoveSlots();if(settings.open)findCandidates();}refreshMoveInfo();}
  const saved=checkerEditor;
  checkerEditor=null;
  if(saved?.token===token&&saved.slot===chosenSlot&&!$('td4Edit').hidden){
   const input=$('td41MoveSlots').querySelector(`[data-td45-move="${saved.field}"]`);
   if(input){
    const box=moveBox(input);
    if(box.hidden||input.value!==saved.search){
     input.value=saved.search;
     moveFilters.set(input,saved.filters);
     showMoveOptions(input,clean(saved.search),saved.scroll);
    }else box.querySelector('.td78-move-results').scrollTop=saved.scroll;
   }
  }
  requestAnimationFrame(()=>{if(!page.hidden)window.scrollTo(0,plannerScroll);});
 };
 function open(id){
  const t=teams.find(t=>t.id===id);if(!t)return;
  if(current?.id!==id)openTeam(id);
  plannerActive=false;window.takActivate(0);$('teamsPage').hidden=true;page.hidden=false;
  $('td4Game').value=t.game;teamMenu();$('td4Team').value=t.id;load();
  plannerActive=true;plannerScroll=0;plannerDirty=false;checkerEditor=null;window.scrollTo(0,0);
 }
 window.td5ReturnTeamPlanner=scroll=>{
  plannerActive=true;window.takActivate(0);plannerScroll=scroll;window.td77RestorePlan();
 };
 window.td41OpenTeamPlan=open;
 $('td4Back').onclick=()=>{plannerActive=false;page.hidden=true;window.takActivate(0);showTeams();};
 $('td4Game').onchange=()=>{teamMenu();load()};$('td4Team').onchange=load;// DEV5.2: bounded milestone vocabulary. Location-specific availability is DEV6.
 function milestoneOptions(g){const out=[['start','Start of game']];if(g==='Black'||g==='White'||g==='Black 2'||g==='White 2'){const gyms=g==='Black'||g==='White'?['Striaton City','Nacrene City','Castelia City','Nimbasa City','Driftveil City','Mistralton City','Icirrus City','Opelucid City']:['Aspertia City','Virbank City','Castelia City','Nimbasa City','Driftveil City','Mistralton City','Opelucid City','Humilau City'];gyms.forEach((city,i)=>out.push(['badge-'+(i+1),(i+1)+' badge'+(i?'s':'')+' · After '+city+' Gym']));}else if(!['Sun','Moon','Ultra Sun','Ultra Moon'].includes(g)){for(let i=1;i<=8;i++)out.push(['badge-'+i,i+' badge'+(i===1?'':'s')]);}out.push(['pre-league','Before Elite Four'],['post-league','After first Pokémon League'],['postgame','Postgame']);return out;}
 function moveKey(m){return clean(typeof m==='string'?m:m?.name||m?.move);}
 function moveSlots(p){return Array.from({length:4},(_,i)=>{const m=p?.plannedMoves?.[i];return m&&typeof m==='object'?{move:moveKey(m.move),purpose:['keep','temporary'].includes(m.purpose)?m.purpose:'review',replacement:moveKey(m.replacement),milestone:String(m.milestone||''),usefulness:['needed','not-needed'].includes(m.usefulness)?m.usefulness:'unknown',warningFrom:moveKey(m.warningFrom),warningTarget:moveKey(m.warningTarget),reminderFor:moveKey(m.reminderFor)}:{move:moveKey(p?.moves?.[i]),purpose:'review',replacement:'',milestone:'',usefulness:'unknown'};});}
 function fromTeam(p,i){return p?{originPid:p.saveStats?.pid,originName:td73IdentityKey(p),originSlot:i,autoOwnedPending:true,id:p.id,name:clean(p.name),types:p.types||[],baseStats:p.baseStats||{},abilities:p.abilities||[],ability:p.ability||'',image:td71StoredArt(p),imported:false,plannedMoves:moveSlots(p)}:null}
 function migrateMoves(){state.slots=state.slots.map((p,i)=>{if(!p)return null;const a=ownedFor(p,i);const planned=Array.isArray(p.plannedMoves)?moveSlots(p):moveSlots(a||p);return {...p,plannedMoves:planned}});const legacy=state.hmAssignments||{};for(const [hm,carrier] of Object.entries(legacy)){if(!carrier)continue;const p=state.slots.find(x=>x?.name===carrier);if(!p||p.plannedMoves.some(m=>m.move===hm))continue;const free=p.plannedMoves.find(m=>!m.move);if(free)free.move=hm;else{state.legacyHmReview=state.legacyHmReview||{};state.legacyHmReview[hm]=carrier;}}delete state.hmAssignments;}

 $('td4Seed').onclick=async()=>{const t=actual();if(!t||state.approved)return;if(!await td78Confirmation('Reset this plan to your current team?','','Reset'))return;++token;++rankRun;state.slots=Array.from({length:6},(_,i)=>fromTeam(t.pokemon[i],i));delete state.independentSlots;delete state.legacyHmReview;delete state.editorSlot;$('td4Edit').hidden=true;$('td41MoveSlots').innerHTML='';persist();render();hydrate();};
 let lineagePack,parentsById,terminalSpecies;
 function buildLineageIndex(){
  if(lineagePack===pack&&parentsById)return;
  lineagePack=pack;
  parentsById=new Map((pack?.mons||[]).map(([id,,,,parent])=>[id,parent]));
  const parents=new Set(parentsById.values());
  terminalSpecies=(pack?.mons||[]).filter(([id])=>!parents.has(id));
 }
 function lineage(id){
  buildLineageIndex();
  const seen=new Set();
  for(let v=Number(id);v&&!seen.has(v);v=parentsById.get(v))seen.add(v);
  return seen;
 }
 function progressFor(slot){
  if(!slot)return '';
  const member=ownedFor(slot,state.slots.indexOf(slot)),ps=member?[member]:[],target=slot;
  const route=chosenRoute(slot);
  if(slot.fulfilledPid!=null&&!member)return 'Previously matched · Not in party';
  if(slot.fulfilledPid==null&&(route&&route.initial.kind!=='owned'||!route&&slot.acquisitionRoute))return 'Planned';
  if(ps.some(p=>sameMon(p,target)))return 'On team';
  const ids=route?new Set([route.startId,...route.steps.map(step=>step.id)]):lineage(slot.id);
  return ps.some(p=>ids.has(Number(p.id)))?'Earlier evolution on team':'Planned';
 }
 const hmsByGen={1:['cut','fly','surf','strength','flash'],2:['cut','fly','surf','strength','flash','whirlpool','waterfall'],3:['cut','fly','surf','strength','flash','rock-smash','waterfall','dive'],4:['cut','fly','surf','strength','rock-smash','waterfall','rock-climb','defog'],5:['cut','fly','surf','strength','waterfall','dive'],6:['cut','fly','surf','strength','waterfall','rock-smash','dive']};
 function hms(game){if(game==='HeartGold'||game==='SoulSilver')return ['cut','fly','surf','strength','whirlpool','rock-smash','waterfall','rock-climb'];if(game==='FireRed'||game==='LeafGreen')return ['cut','fly','surf','strength','flash','rock-smash','waterfall'];if(game==='X'||game==='Y')return ['cut','fly','surf','strength','waterfall'];if(game==='Omega Ruby'||game==='Alpha Sapphire')return ['cut','fly','surf','strength','waterfall','rock-smash','dive'];if(game==='Brilliant Diamond'||game==='Shining Pearl')return [];return hmsByGen[gameGeneration(game)]||[]}
 async function details(name,game){const k=game+':'+clean(name);if(records.has(k))return records.get(k);const n=clean(name);let p;try{p=await api('pokemon/'+encodeURIComponent(n))}catch{const id=window.takDexBWCoreV75?.ids?.[n]||window.takDexSpriteIdsV77?.[n]||(n==='jellicent'?593:0);if(id){p=await api('pokemon/'+id).catch(()=>null)}if(!p){const species=await api('pokemon-species/'+encodeURIComponent(n));const variety=species.varieties?.find(v=>v.is_default)?.pokemon;const ref=variety?.name||species.id;if(!ref)throw Error('Species form unavailable');p=await api('pokemon/'+ref)}}const types=historicalTypes(p,game);const stats=Object.fromEntries(td76HistoricalStats(p,game).map(x=>[x.stat.name,x.base_stat]));const compatible=hms(game).filter(h=>(p.moves||[]).some(m=>m.move.name===h&&m.version_group_details.some(d=>d.version_group.name===vg[game]&&d.move_learn_method.name==='machine')));const v={id:p.id,name:clean(p.name),types,baseStats:stats,abilities:historicalAbilities(p,game),image:p.sprites?.other?.['official-artwork']?.front_default||p.sprites?.front_default||'',hms:compatible,learnMethods:Object.fromEntries((p.moves||[]).map(m=>[m.move.name,(m.version_group_details||[]).filter(d=>d.version_group.name===vg[game]).map(d=>[d.move_learn_method.name,d.level_learned_at])]).filter(([,v])=>v.length)),legalMoves:(p.moves||[]).filter(m=>m.version_group_details.some(d=>d.version_group.name===vg[game])).map(m=>m.move.name).sort()};records.set(k,v);return v;}
 const typesFor=game=>Object.keys(colors).filter(t=>matchup(t,['normal'],gameGeneration(game))!==null);
 function matchupDefense(p,type,gen){
  const move={type,damageClass:'physical'};
  return defensiveEffect(move,p,gen);
 }
 function metrics(slots,game,typeOnly=false){
  const gen=gameGeneration(game),ts=typesFor(game),filled=slots.filter(p=>p?.types?.length);
  const weak=ts.map(type=>{
   const effects=filled.map(p=>({p,m:typeOnly?matchup(type,p.types,gen):matchupDefense(p,type,gen)}));
   const vulnerable=effects.filter(({m})=>m>1);
   const resistant=effects.filter(({m})=>m>0&&m<1);
   const immune=effects.filter(({m})=>m===0);
   const need=vulnerable.reduce((sum,{m})=>sum+(m>=4?1.5:1),0);
   const capacity=immune.length*1.5+resistant.reduce((sum,{p,m})=>{
    const b=p.baseStats||{};
    // Count a normal resistance at face value unless either side is notably frail.
    const bulk=Math.sqrt((b.hp||70)*Math.min(b.defense||70,b['special-defense']||70));
    const weight=bulk<55?.75:bulk>=100?1.15:1;
    return sum+(m<=.25?1.35:1)*weight;
   },0);
   return {type,members:vulnerable.map(({p})=>p),weak:vulnerable.length,resist:resistant.length+immune.length,immune:immune.length,
    gap:Math.max(0,need-capacity),severity:need?capacity===0?'uncovered':capacity<need?'partial':'compensated':'covered'};
  }).filter(row=>row.weak);
  return {covered:ts.filter(t=>filled.some(p=>p.types.some(a=>matchup(a,[t],gen)>1))),weak,filled};
 }
 function leagueTargets(game){const catalog=pack?.game===game?pack.mons:[];const elite=game==='Emerald'?Object.fromEntries(Object.entries(emeraldLeague).map(([k,v])=>[k,{v1:v}])):trainerRostersV57[game]?.elite||{};const gyms=trainerRostersV57[game]?.gym||{};
 const firstLeague=Object.fromEntries(Object.entries(elite).filter(([name])=>!/(postgame|rematch)/i.test(name)));
 const trainers={...gyms,...firstLeague};return Object.entries(trainers).map(([name,preset])=>({name,gym:Object.hasOwn(gyms,name),rows:(preset.v1||[]).map(r=>{const n=clean(r[0]),id=window.takDexBWCoreV75?.ids?.[n]||window.takDexSpriteIdsV77?.[n]||(n==='jellicent'?593:0),rec=catalog.find(p=>clean(p[1])===n)||catalog.find(p=>id&&Number(p[0])===Number(id)),extra=leagueInfo.get(game+':'+n);return {name:r[0],id:extra?.id||rec?.[0]||id,types:extra?.types||rec?.[2]||(n==='jellicent'?['water','ghost']:null),image:extra?.image||'',level:r[1]}})}));}
 function leagueCoverage(slots,game){const gen=gameGeneration(game);return leagueTargets(game).map(t=>({name:t.name,total:t.rows.length,known:t.rows.filter(r=>r.types?.length).length,covered:t.rows.filter(r=>r.types?.length&&slots.some(p=>p?.types?.some(a=>matchup(a,r.types,gen)>1))).length}));}
 function acquisitionEffort(candidate,timing,member){
  if(!member||timing.kind==='owned')return 0;
  if(!lineage(candidate.id).has(Number(member.id)))return timing.rank==null?4:3+Math.min(4,timing.rank*.6);
  if(!timing.confirmed)return 0;
  const level=+(timing.path?.requirement?.match(/^Level (\d+)$/)?.[1]||0);
  return level?2-Math.min(4,Math.max(0,level-(member.level||1))*.2):timing.path?-1:0;
 }
 function roleTags(p){const b=p?.baseStats||{},out=[];if((b.attack||0)>=90)out.push('Physical');if((b['special-attack']||0)>=90)out.push('Special');if((b.speed||0)>=90)out.push('Fast');if((b.defense||0)>=90||(b['special-defense']||0)>=90)out.push('Defensive');return out;}
 function acquisition(slot,includeOwned=true){if(slot?.acquisitionRoute){const route=chosenRoute(slot);if(route)return route;if(pack&&includeOwned)return {kind:'unknown',reason:'Selected acquisition route needs review'};}let evidence=null;try{if(pack&&slot?.id)evidence=window.takDexAcquisitionV64.details(pack,slot.id)}catch{}return window.td62Progress.acquisition(state.game,slot,pack,includeOwned?[ownedFor(slot,chosenSlot)].filter(Boolean):[],evidence);}
 function routeOptions(slot,includeOwned=true,index=chosenSlot,matched){
  const g=state.game,member=matched===undefined?includeOwned&&ownedFor(slot,index):matched,owned=member?[member]:[];
  const previous=slot?.acquisitionRoute;
  if(previous&&member?.saveStats?.pid!=null&&member.id!==previous.startId&&
     previous.id===previous.startId+'|owned|'+member.saveStats.pid&&lineage(member.id).has(previous.startId)){
   owned.push({...member,id:previous.startId,level:previous.startLevel||1});
  }
  return window.takDexAcquisitionV77.plannerRoutes(g,slot,pack,owned,(game,name,encounters,id)=>{
   const native=window.takDexAcquisitionV77.lookup(game,name,encounters);
   return native||window.td62Progress.acquisition(game,{id,name},pack,[],null);
  });
 }
 function chosenRoute(slot,includeOwned=true,index=chosenSlot){
  const options=routeOptions(slot,includeOwned,index);
  const member=includeOwned&&slot?.fulfilledPid!=null&&ownedFor(slot,index);
  if(member)return options.find(route=>route.initial.kind==='owned'&&route.startId===member.id);
  if(!slot?.acquisitionRoute)return options[0];
  return options.find(r=>r.id===slot.acquisitionRoute.id&&r.startId===slot.acquisitionRoute.startId);
 }
 function routeChoice(r){
  const name=td41PokemonLabel(r.startName);
  if(r.initial.kind==='owned')return 'Use owned '+name;
  if(r.initial.kind==='link-trade')return 'Trade '+name;
  return 'Obtain '+name+(r.steps.length?'':' directly')+' · '+[r.initial.place,pretty(r.initial.method)].filter(Boolean).join(' · ');
 }
 function routeStore(r){return r&&{id:r.id,startId:r.startId,...(r.initial.kind==='owned'&&r.initial.minLevel?{startLevel:r.initial.minLevel}:{})};}
 function routeDescription(r,showPath=true,history=false){
  const {initial}=r,now=window.td62Progress.rank(effectiveProgress()),limit=deadlineRank();
  const place=td77AcquisitionLinks(initial.place,state.game);
  const levels=initial.minLevel?('Lv '+initial.minLevel+(initial.maxLevel&&initial.maxLevel!==initial.minLevel?'–'+initial.maxLevel:'')):'';
  const method=({walk:'Wild encounter','dark-grass':'Dark grass','grass-spots':'Rustling grass'})[initial.method]||pretty(initial.method);
  const gate=rank=>rank===0?'Start of game':rank===10?'Postgame':milestoneOptions(state.game).find(([key])=>window.td62Progress.rank(key)===rank)?.[1];
  const access=initial.kind==='owned'?'Already on team':initial.kind==='link-trade'?'Local link trade':
   now!=null&&now>=initial.rank?'Available now':gate(initial.rank);
  const evolutionGate=r.rank>initial.rank?'Evolution from '+gate(r.rank):'';
  const details=[method,levels].filter(Boolean).join(' · ');
  const deadlineWarning=!history&&limit!=null&&!routeFits(r);
  return '<div class="td77-evolution-path">'+(showPath?'<strong>'+safe(evolutionPath(r,{levels:true}))+'</strong>'+[evolutionRequirements(r,{omitLevel:true})].filter(Boolean).map(value=>'<small>'+value+'</small>').join(''):'')+[
     place,
     [access,evolutionGate].filter(Boolean).map(safe).join(' · '),
     [safe(details),td77AcquisitionLinks(initial.note,state.game)].filter(Boolean).join(' · ')
    ].filter(Boolean).map(line=>'<small>'+line+'</small>').join('')+
    (deadlineWarning?'<small class="td63-danger">'+safe(routeRestriction(r))+'</small>':'')+'</div>';
 }
 function evolutionPath(route,{levels=false}={}){
  return [td41PokemonLabel(route.startName),...route.steps.map(step=>{
   const name=td41PokemonLabel(step.name),level=step.requirement.match(/^Level (\d+)$/i)?.[1];
   return levels&&level?name+' (Lv. '+level+')':name;
  })].join(' → ');
 }
 function evolutionRequirements(route,{omitLevel=false}={}){
  return route.steps.filter(step=>!omitLevel||!/^Level \d+$/i.test(step.requirement))
   .map(step=>td77AcquisitionLinks(step.requirement,state.game)).join(' · ');
 }
 function fulfilledCapture(slot){
  const member=ownedFor(slot,chosenSlot);
  return slot.fulfilledPid!=null||!!member&&slot.explicitOwned&&
   (!slot.acquisitionRoute||chosenRoute(slot)?.initial.kind==='owned');
 }
 function routeEditor(slot,context){
  const rows=routeOptions(slot).filter(path=>!slot.duringTargetId||routeIncludesStage(path,slot.duringTargetId));
  const fulfilled=context!=='preview'&&fulfilledCapture(slot);
  const r=fulfilled&&slot.acquisitionRoute?(chosenRoute(slot,false)||chosenRoute(slot)):chosenRoute(slot);
  if(fulfilled){
   const member=ownedFor(slot,chosenSlot),stage=member?.id??slot.fulfilledStage;
   const pending=r?.steps.filter(step=>!stage||!lineage(stage).has(step.id))||[];
   const requirement=step=>{
    const level=step.requirement.match(/^Level (\d+)$/i);
    const target=safe(td41PokemonLabel(step.name));
    return level?target+' at Lv. '+level[1]:target+' · '+td77AcquisitionLinks(step.requirement,state.game);
   };
   if(!member&&!pending.length)return '';
   return '<div class="td78-owned-route">'+(member?'<small class="td41-good">On team'+(Number.isInteger(member.level)?' · Lv. '+member.level:'')+'</small>':'')+
    (pending.length?`<small>Evolution remaining · ${pending.map(requirement).join(' · ')}</small>`:'')+'</div>';
  }
  const [method,location]=r?routeChoice(r).split(' · '):['Saved route needs review',''];
  const requirement=r?.steps.map(step=>step.requirement).join(' · ').replace(/^Level (\d+)$/i,'Evolve at Lv. $1');
  const groups=[
   ['Before planning deadline','td41-good',[]],
   ['After planning deadline','td63-danger',[]],
   ['Other acquisition methods','',[]]
  ];
  const external=row=>row.initial.kind==='link-trade';
  const other=row=>external(row)||row.initial.kind==='owned';
  for(const row of rows)groups[other(row)?2:routeFits(row)?0:1][2].push(row);
  const methodName=value=>({'dark-grass':'Dark Grass','grass-spots':'Rustling Grass'})[value]||pretty(value);
  const choice=(row,label)=>'<button type="button" class="td774-secondary'+(external(row)?' td5-evo-text':'')+
   '" data-td77-route="'+context+'" data-route-id="'+safe(row.id)+'" aria-pressed="'+(row.id===r?.id)+'">'+safe(label)+'</button>';
  const sameArea=row=>row.initial.method==='hidden-grotto'?row.initial.place?.split(' · ')[0]:row.initial.place;
  const options=groups.filter(([, , routes])=>routes.length).map(([title,tone,routes])=>{
   const paths=new Map();
   for(const row of routes){
    const key=other(row)?row.id:JSON.stringify([row.startId,sameArea(row),row.initial.rank,row.rank]);
    if(!paths.has(key))paths.set(key,[]);
    paths.get(key).push(row);
   }
   return '<div class="td78-route-group"><b class="'+tone+'">'+title+'</b>'+[...paths.values()].map(area=>{
    const selected=area.find(row=>row.id===r?.id);
    const walk=area.find(row=>row.initial.method==='walk'&&!row.initial.note&&!row.initial.conditions?.length);
    const first=selected||walk||area[0];
    const level=first.steps.map(step=>step.requirement).join(' · ').replace(/^Level (\d+)$/i,'evolves at Lv. $1');
    if(other(first))return choice(first,[routeChoice(first),level,!routeFits(first)?routeRestriction(first):''].filter(Boolean).join(' · '));
    const label='Obtain '+td41PokemonLabel(first.startName)+(first.steps.length?'':' directly');
    const methods=[...new Set(area.map(row=>row.initial.method))];
    const preferred=['walk','dark-grass','hidden-grotto'];
    const methodLabel=[...preferred.filter(key=>methods.includes(key)),...methods.filter(key=>!preferred.includes(key))]
     .map(methodName).join(', ');
    const requirements=row=>{
     // The standard grotto spawn note adds no route gate if unrestricted walking is available.
     const grotto=walk&&row.initial.method==='hidden-grotto'&&
      row.initial.note==='Hidden Grotto encounter. Check after the Route 5 tutorial; spawns are random.';
     return JSON.stringify([grotto?'':row.initial.note||'',row.initial.conditions||[],
      row.steps.filter(step=>step.level>0&&row.initial.minLevel>=step.level).map(step=>step.id)]);
    };
    const needsMethod=area.length>1&&new Set(area.map(requirements)).size>1;
    const exactMethod=needsMethod?`<select data-td77-route="${context}" aria-label="Encounter method at ${safe(sameArea(first))}">
     <option value="" ${selected?'':'selected'} disabled>Choose encounter method</option>
     ${area.map(row=>`<option value="${safe(row.id)}" ${row.id===selected?.id?'selected':''}>${safe([
      methodName(row.initial.method),row.initial.minLevel?'Lv. '+row.initial.minLevel+(row.initial.maxLevel!==row.initial.minLevel?'–'+row.initial.maxLevel:''):'',
      row.initial.conditions?.join(', '),row.initial.note].filter(Boolean).join(' · '))}</option>`).join('')}</select>`:'';
    return `<div class="td78-route-area">
     ${needsMethod?`<strong>${safe(label)}</strong>`:choice(first,label)}
     <div class="td78-route-location">${td77AcquisitionLinks(sameArea(first),state.game)} · ${safe(methodLabel)}</div>
     ${level?`<small>${safe(level)}</small>`:''}${exactMethod}</div>`;
   }).join('')+'</div>';
  }).join('');
  const selector=rows.length?`<details class="td773-disclosure td78-route-picker"><summary class="td774-route-choice"><span>${safe(method)}
   ${requirement||location?`<small>${safe(location||requirement)}</small>`:''}</span></summary><div class="td78-route-options">${options}</div></details>`:'';
  return selector+(r?`<details class="td78-disclosure td773-disclosure td774-route-details"><summary>Acquisition details</summary>${routeDescription(r,r.steps.length>0)}</details>${routeFits(r)?'':`<small class="td63-danger">${safe(routeRestriction(r))}</small>`}`:
   `<small class="note">${td77AcquisitionLinks(availability(slot),state.game)}</small>`);

 }
 function candidateAcquisition(slot,open=false){
  const game=state.game,progress=window.td62Progress;
  const route=chosenRoute(slot),timing=route||acquisition(slot);
  const target=$('td77Availability').value, deadline=deadlineRank();
  const description=progress.describe(timing,effectiveProgress(),target);
  const heading=route?.steps.length?evolutionPath(route,{levels:true}):route?.initial.place||timing.place||
   (timing.kind==='owned'?'On team':'Acquisition details');
  const rank=timing.rank;
  const now=progress.rank(effectiveProgress());
  const status=route?.initial.kind==='link-trade'?'Local link trade':timing.kind==='owned'?'Already on team':rank==null||!timing.confirmed&&!route?description.split(' · ')[0]:
   now!=null&&rank<=now?'Available now':rank===9?'Before Elite Four':rank===10?'Postgame':rank===0?'Start of game':'Available after badge '+rank;
  const restriction=route&&!routeFits(route)?routeRestriction(route):deadline!=null&&rank>deadline?'After planning deadline':'';
  const tone=route?.initial.kind==='link-trade'?'td5-evo-text':restriction?'td63-danger':rank!=null?'td41-good':'';
  const initial=route?.initial;
  const method=initial&&({walk:'Wild encounter','dark-grass':'Dark grass','grass-spots':'Rustling grass'}[initial.method]||pretty(initial.method));
  const levels=initial?.minLevel?'Lv '+initial.minLevel+(initial.maxLevel&&initial.maxLevel!==initial.minLevel?'–'+initial.maxLevel:''):'';
  const gate=rank=>milestoneOptions(game).find(([key])=>progress.rank(key)===rank)?.[1];
  const lines=initial?[initial.place,initial.rank!==rank?gate(initial.rank):'',[method,levels,initial.note].filter(Boolean).join(' · '),
   rank>initial.rank?'Evolution: '+gate(rank):'']:[description];
  return `<details class="td78-disclosure td80-candidate-acquisition td773-disclosure"${open?' open':''}><summary><span>${safe(heading)}<small class="${tone}">${safe(status)}${restriction?' · '+safe(restriction):''}</small></span></summary>
   ${[route?.steps.length?evolutionRequirements(route,{omitLevel:true}):'',...lines.map(line=>td77AcquisitionLinks(line,game))].filter(Boolean)
    .map(line=>`<small>${line}</small>`).join('')}</details>`;
 }
 function availability(slot){if(!slot)return '';return window.td62Progress.describe(acquisition(slot),effectiveProgress(),$('td77Availability').value);}
 function refreshAcquisition(){
  const p=state?.slots[chosenSlot],a=ownedFor(p,chosenSlot);
  $('td77SlotRoute').innerHTML=p?routeEditor(p,'slot'):'';
  $('td77SlotRoute').hidden=Boolean(settings.open&&manualCandidate?.confirmed);
  const indicator=$('td63SelectedReplacement');
  if(indicator)indicator.textContent=p&&!manualCandidate?.confirmed&&!sameMon(a,p)?'Planned: '+td41PokemonLabel(p.name):'';
 }
 function rememberMoveEditor(){
  const box=$('td41MoveSlots').querySelector('.suggestions:not([hidden])');
  const input=box?.closest('.td78-editor-shell').querySelector('input');
  clearTimeout(moveBlurTimer);
  checkerEditor=input?{token,slot:chosenSlot,field:input.dataset.td45Move,search:input.value,
   scroll:box.querySelector('.td78-move-results').scrollTop,filters:moveFilters.get(input)}:null;
 }
 page.addEventListener('click',e=>{
  const link=e.target.closest('[data-td74-dex-map]');
  if(link){
   e.preventDefault();
   rememberMoveEditor();
   window.takDexMapsV73?.open(state.game,link.dataset.td74DexMap);
  }
  const move=e.target.closest('[data-td77-plan-move]');
  if(move){
   e.preventDefault();
   rememberMoveEditor();
   window.takDexMoveV68?.open(move.dataset.td77PlanMove,'team-planner',state.game,move.dataset.td77Reminder);
   page.hidden=true;
  }
 });
 function plannerMoveTiming(p,name){
  const game=state.game,methods=p.learnMethods?.[name]||[],data=window.takDexAcquisitionV77;
  const evolved=lineage(p.id).size>1&&!p.learnBefore?.[name];
  const reminder=evolved&&methods.some(([kind,level])=>kind==='level-up'&&level===1)?data.moveReminder(game):null;
  const regular=reminder?methods.filter(([kind,level])=>kind!=='level-up'||level!==1):methods;
  const timing=hms(game).includes(name)?window.td62Progress.hm(game,name,effectiveProgress()):window.td62Progress.moveTiming(game,name,regular);
  if(!reminder)return timing;
  return {rank:Math.min(timing?.rank??Infinity,reminder.rank),text:[timing?.text,reminder.text].filter(Boolean).join(' · '),
   displayRoutes:[...(timing?.displayRoutes||[]),td773ReminderRoute(reminder)]};
 }
 function moveTimingMarkup(p,target){
  const plan=state.slots[chosenSlot];
  if(!target||retainsMove(plan,p,target,chosenSlot))return '';
  const game=state.game,before=p.learnBefore?.[target],timing=plannerMoveTiming(p,target);
  const member=ownedFor(plan,chosenSlot);
  const level=member&&sameMon(member,p)&&!before?Number(member.level)||null:null;
  const methods=p.learnMethods?.[target]||[];
  const routes=[...(timing?.displayRoutes||[])];
  const availableHM=hms(game).includes(target)&&window.td62Progress.hm(game,target,effectiveProgress());
  if(availableHM){
   const item=(['Black','White'].includes(game)?window.takDexUnovaV74:window.takDexB2W2)?.machines
    ?.find(row=>moveKey(row.move)===target&&/^hm/i.test(row.item));
   const [place,...requirements]=availableHM.place.split(' · ');
   routes.push({label:item?.item.toUpperCase()||'HM',place,rank:availableHM.rank,
    details:availableHM.used?[...requirements,'Mandatory use completed']:requirements});
  }
  if(!routes.length){
   const best=Math.min(...methods.filter(([method,n])=>method==='level-up'&&n>0).map(([,n])=>n));
   if(Number.isFinite(best))routes.push({label:'Level up',level:best});
   if(timing?.text)routes.push({label:'Acquisition requirements',rank:timing.rank,details:timing.requirements||[timing.text]});
   if(!routes.length&&methods.length)routes.push({label:'Acquisition timing unverified'});
  }
  if(methods.some(([method,n])=>method==='level-up'&&n===0)&&lineage(p.id).size>1)
   routes.push({label:'Learns upon evolution'});
  if(!routes.length&&!before)return '';
  const index=routes.findIndex(route=>/^(?:TM|HM)\d*\b/.test(route.label)||route.label==='Learns upon evolution');
  if(index>0)routes.unshift(...routes.splice(index,1));
  const heading=route=>{
   if(route.label==='Tutor')return 'Move Tutor';
   if(route.label==='Move Reminder')return route.label;
   if(!route.level)return [route.label,route.place].filter(Boolean).join(' · ');
   if(level!=null&&level>=route.level)return 'Level-up at Lv. '+route.level+' · Level reached';
   return 'Learns at Lv. '+route.level+(level!=null?' · '+(route.level-level)+' to go':'');
  };
  const current=window.td62Progress.rank(effectiveProgress()),deadline=deadlineRank();
  const late=rank=>rank!=null&&(current!=null&&rank>current||deadline!=null&&rank>deadline);
  const extra=before?'Learn as '+pretty(before)+' before evolving':'';
  const lead=routes[0];
  const title=lead?heading(lead):extra;
  const tone=late(lead?.rank)?'td63-danger':'';
  const line=text=>`<small>${td77AcquisitionLinks(text,game)}</small>`;
  const detail=routes.map((route,i)=>{
   const shown=i||route.place||route.resource||route.rank!=null||route.uncertain||route.details?.length;
   if(!shown)return '';
   const place=[route.place,route.resource].filter(Boolean).join(' · ');
   const gate=route.rank!=null?window.td62Progress.milestone(route.rank):route.uncertain?'Timing unverified':'';
   const requirements=route.details||[];
   return `<div class="td773-move-route">${i?line(route.level?heading(route):route.label):''}${place?line(place):''}
    ${gate?line(gate):''}${requirements.map(line).join('')}
    ${route.rank!=null&&deadline!=null&&route.rank>deadline?'<small class="td63-danger">After planning deadline</small>':''}</div>`;
  }).join('')+(lead&&extra?line(extra):'');
  return detail?`<details class="td78-disclosure td62-move-timing td773-disclosure"><summary class="${tone}"><span>${safe(title)}</span></summary>${detail}</details>`:
   `<small class="${tone} td62-move-timing">${safe(title)}</small>`;
 }

 function goal(m){return m?.purpose==='temporary'?(m.replacement||''):(m?.move||'')}
 function eligibleAcquisition(plan,member){
  if(!plan?.confirmedCandidate||!member||!lineage(plan.id).has(Number(member.id)))return false;
  const start=plan.acquisitionRoute?.startId||plan.duringTargetId||plan.id;
  return lineage(member.id).has(Number(start));
 }
 function matchingIdentity(plan,party){
  if(!plan)return null;
  const pid=plan.fulfilledPid??plan.originPid;
  const name=plan.originName||(!plan.confirmedCandidate&&plan.name);
  const matches=party.filter(member=>member&&(pid!=null?member.saveStats?.pid===pid:
   name&&td73IdentityKey(member)===name));
  if(matches.length!==1)return null;
  const member=matches[0];
  if(plan.fulfilledPid!=null&&!eligibleAcquisition(plan,member))return null;
  if(plan.explicitOwned&&pid!=null&&!lineage(member.id).has(plan.id)&&!lineage(plan.id).has(member.id))return null;
  return member;
 }
 function ownedAssignments(){
  const party=actual()?.pokemon||[],slots=state?.slots||[];
  const candidates=slots.map(plan=>matchingIdentity(plan,party));
  return candidates.map(member=>member&&candidates.filter(candidate=>candidate===member).length===1?party.indexOf(member):-1);
 }
 function ownedFor(p,i){
  const index=p?state?.slots.indexOf(p):-1,slot=index>=0?index:i;
  const assigned=ownedAssignments()[slot];
  return actual()?.pokemon?.[assigned]||null;
 }
 function acquisitionMatches(){
  const party=actual()?.pokemon||[],assigned=ownedAssignments();
  return (state?.slots||[]).map((plan,i)=>plan?.fulfilledPid!=null?[]:party.filter((member,index)=>
   eligibleAcquisition(plan,member)&&(!assigned.includes(index)||assigned[i]===index)
  ));
 }
 function bindable(member){
  const pid=member?.saveStats?.pid;
  return pid!=null&&actual()?.pokemon.filter(p=>p?.saveStats?.pid===pid).length===1;
 }
 function reconcileOwnership(){
  const matches=acquisitionMatches();
  const claims=new Map();
  matches.flat().forEach(member=>claims.set(member,(claims.get(member)||0)+1));
  let changed=false;
  const assigned=ownedAssignments(),party=actual()?.pokemon||[];
  state.slots.forEach((plan,i)=>{
   const member=party[assigned[i]];
   if(plan?.fulfilledPid==null||!member||plan.fulfilledStage===member.id)return;
   plan.fulfilledStage=member.id;
   changed=true;
  });
  matches.forEach((members,i)=>{
   if(members.length!==1||!bindable(members[0])||claims.get(members[0])!==1)return;
   state.slots[i].fulfilledPid=members[0].saveStats.pid;
   state.slots[i].fulfilledStage=members[0].id;
   changed=true;
  });
  if(changed)persist();
 }
 function ownershipReview(){
  const matches=acquisitionMatches()[chosenSlot]||[],candidates=matches.filter(bindable),p=state.slots[chosenSlot];
  if(!candidates.length)return matches.length?'<small>Party match needs a unique saved identity.</small>':'';
  const signature=candidates.map(member=>member.saveStats.pid).sort((a,b)=>a-b).join(',');
  if(p.ownershipReviewDismissed===signature)return '';
  return '<div class="td774-preview-actions"><small>Confirm the Pokémon for this plan</small>'+
   candidates.map(member=>`<button type="button" class="td774-secondary" data-td7721-bind="${member.saveStats.pid}">${safe(td41PokemonLabel(member.name))} · Lv. ${member.level} · Party ${actual().pokemon.indexOf(member)+1}</button>`).join('')+
   `<button type="button" class="td774-secondary" data-td7721-dismiss="${signature}">Dismiss</button></div>`;
 }
 function ownershipConflict(target,i=chosenSlot){
  const party=actual()?.pokemon||[],parents=lineage(target.id);
  if(parents.has(Number(ownedFor(state.slots[i],i)?.id)))return null;
  return ownedAssignments().map((index,slot)=>({slot,member:party[index]})).find(({slot,member})=>slot!==i&&member&&parents.has(Number(member.id)));
 }

 function sameMon(a,p){return !!a&&!!p&&(Number(a.id)===Number(p.id)||clean(a.name)===p.name)}
 function sprite(p){return p?.image|| (p?.id?`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`:'')}
 function info(name){return moveInfo.get(state.game+':'+moveKey(name))}
 function moveChip(name,detailed=false,against,learner){if(!name)return '<span class="td42-empty-move">—</span>';const m=info(name);if(detailed&&m){
  const timing=learner&&plannerMoveTiming(learner,moveKey(name));
  const infoContext=timing?' data-td77-reminder="'+safe(timing.text)+'"':'';
  return '<button type="button" class="td77-planner-move-info" data-td77-plan-move="'+safe(moveKey(name))+'"'+infoContext+'>'+
   td77MoveResultLines({...m,name:moveKey(name)},pretty(moveKey(name)),against?info(against):null)+'</button>';
 }return `<span class="movechip td72-move-name td75-team-move" style="--c:${colors[m?.type]||'#626774'}"><span>${safe(pretty(moveKey(name)))}</span></span>`}
 function tileMove({from,move,retained}){
  const target=goal(move);
  if(retained)return '<span data-td77-retained="true">'+moveChip(target)+'</span>';
  const empty='<span class="td77-no-actual" aria-label="No move">×</span>';
  if(from||target)return `<span class="td43-tile-flow${from?'':' td77-missing-actual'}">${from?moveChip(from):empty}<span class="td42-arrow">→</span>${target?moveChip(target):empty}</span>`;
  return moveChip('');
 }
 function routeIncludesStage(route,id){
  return route?.startId===id||route?.steps.some(step=>step.id===id);
 }
 function duringSpecies(p,slot){
  const member=ownedFor(p,slot);
  const target=p;
  const route=chosenRoute(p,true,slot);
  if(state.independentSlots?.[slot]?.during===p&&member&&lineage(member.id).has(p.id))return moveKey(member.name);
  const chosen=p.duringTargetId||pack?.mons?.find(([,name])=>name===p.duringSpecies)?.[0];
  if(chosen&&lineage(p.id).has(chosen))return pack?.mons?.find(([id])=>id===chosen)?.[1]||p.duringSpecies||p.name;
  if(route?.initial.kind!=='owned'&&route)return route.startName;
  return member&&lineage(target.id).has(Number(member.id))?moveKey(member.name):route?.startName||p.duringSpecies||p.name;
 }
 function duringLearner(p,slot){
  const name=duringSpecies(p,slot);
  const record=records.get(state.game+':'+name);
  if(record||name===p.name)return record||p;
  const row=pack?.mons?.find(([,species])=>species===name);
  return row?{id:row[0],name,types:row[2]}:p;
 }
 function displayedMoves(p){return movesetView==='during'?(p?.duringMoves||[]):(p?.plannedMoves||[]);}
 function activeMoves(){return state.slots.flatMap(p=>displayedMoves(p).map(goal)).filter(Boolean);}
 function knownMoves(){return state.slots.flatMap(p=>(p?.plannedMoves||[]).map(goal)).filter(Boolean)}
 function damaging(m){return m?.damageClass&&m.damageClass!=='status'&&m.type&&((Number(m.power)>0)||m.power===null)}
 function coverageFor(names){const gen=gameGeneration(state.game),data=names.map(info),known=data.filter(damaging);return {types:typesFor(state.game).filter(t=>known.some(m=>matchup(m.type,[t],gen)>1)),incomplete:data.some(m=>!m?.damageClass||!m?.type)};}
 function coveragePair(title,a,b){const ts=typesFor(state.game),col=(label,c)=>{const missing=ts.filter(x=>!c.types.includes(x));return `<div class="td44-cover-col${missing.length===0?' td45-complete':''}"><small>${label}</small><strong>${c.types.length}/${ts.length}</strong><div class="td44-cover-track"><span style="width:${100*c.types.length/ts.length}%"></span></div><small>${c.incomplete?'Not verified / missing':missing.length?'Missing':'Complete coverage'}</small><div class="pills">${missing.map(pill).join('')}</div></div>`};return `<div class="td42-coverage"><b>${title}</b><div class="td44-cover-pair">${col('Actual team',a)}<span class="td42-arrow">→</span>${col('Planned team',b)}</div></div>`;}
 function leagueHits(rows,r,planned){const gen=gameGeneration(state.game),hits=[];let unknown=!r.types?.length;for(const p of rows.filter(Boolean)){if(p.partialReadiness||p.unverifiedReadiness?.some(name=>{
  const move=info(name);
  return !move?.type||!move?.damageClass||r.types?.length&&damaging(move)&&defensiveEffect(move,{types:r.types},gen,p)>1;
 }))unknown=true;const names=planned?(p.plannedMoves||[]).map(goal):(p.moves||[]).map(moveKey);for(const n of names.filter(Boolean)){const m=info(n);if(!m?.type||!m?.damageClass){unknown=true;continue;}if(r.types?.length&&damaging(m)&&defensiveEffect(m,{types:r.types},gen,p)>1){if(!p.types?.length)unknown=true;hits.push({label:td41PokemonLabel(p.name)+' · '+pretty(n),stab:p.types?.includes(m.type)});}}}return {hits,status:hits.some(h=>h.stab)?'good':planned&&hits.length?'nonstab':unknown?'unknown':hits.length?'nonstab':'bad'};}
 function gymBefore(game,index){
  return ['Black','White'].includes(game)?Math.max(0,index-2):index;
 }
 function readinessPlan(t,before,gym){
  const checkpoint=Math.min(gym?before:9,deadlineRank()??9);
  const levelCap=Math.min(Math.max(gym?0:60,...t.rows.map(mon=>mon.level||0)),deadlineLevel());
  return state.slots.flatMap((p,slot)=>{
   if(!p)return [];
   const member=ownedFor(p,slot);
   const historicalDuring=movesetView==='during'&&p.fulfilledPid!=null&&member&&
    p.duringTargetId&&!lineage(p.duringTargetId).has(Number(member.id));
   const route=chosenRoute(p,!historicalDuring,slot),timing=route||acquisition(p,false);
   if(!route&&(p.acquisitionRoute||!timing.confirmed&&!sameMon(member,p)))return ['trade','event'].includes(timing.kind)?[]:[{partialReadiness:true}];
   if(route?.initial.rank>checkpoint||!route&&timing.rank>checkpoint)return [];
   let name=route?.startName||p.name;
   for(const step of route?.steps||[]){
    if(movesetView==='during'&&name===duringSpecies(p,slot)||step.rank>checkpoint||step.level>Math.max(levelCap,route.initial.minLevel||1))break;
    name=step.name;
   }
   const routeNames=route?[route.startName,...route.steps.map(step=>step.name)]:[p.name];
   const last=routeNames.indexOf(name);
   const first=route?.initial.kind==='owned'?Math.max(0,routeNames.indexOf(moveKey(member?.name))):0;
   const stages=routeNames.slice(first,last+1).map(species=>records.get(state.game+':'+species)||(species===p.name&&p.legalMoves?p:null));
   if(last<first)return [];
   if(!stages.length||stages.some(stage=>!stage))return [{partialReadiness:true}];
   const stage=stages.at(-1),source=movesetView==='final'?[...new Map([
    ...(name===p.name?[]:p.duringMoves||[]),...p.plannedMoves||[]
   ].map(move=>[goal(move),move])).values()]:p.duringMoves;
   const projected=route&&{...route,rank:route.initial.rank,steps:route.steps.slice(0,last)};
   const pool=collectMoveRoutes(stage,slot,state.game,movesetView==='during',stages.slice(0,-1),projected,checkpoint,{levelLimit:levelCap,wanted:new Set((source||[]).map(goal).filter(Boolean))});
   if(!pool)return [];
   const data=window.takDexAcquisitionV77,choices=(source||[]).filter(entry=>goal(entry)&&pool.routes.has(goal(entry)));
   // Count only a jointly obtainable set, including pre-evolution learning.
   const moves=[];
   for(const entry of choices){
    const options=[...moves,entry].map(move=>pool.routes.get(goal(move)));
    if(data.scheduleEvolutionMoves(pool.stageMinimums,pool.startingLevel,pool.practicalLevel,options))moves.push(entry);
   }
   return [{...stage,plannedMoves:moves,
    unverifiedReadiness:[...pool.unverified].filter(name=>!pool.routes.has(name))}];
  });
 }
 function readinessStatus(results){
  if(results.includes('bad'))return 'bad';
  if(!results.length||results.includes('unknown'))return 'unknown';
  return results.includes('nonstab')?'nonstab':'good';
 }
 const readinessLabels={good:'All opponents have a super-effective STAB answer',
  nonstab:'Every opponent covered · includes non-STAB',bad:'An opponent has no super-effective answer',unknown:'Coverage unverified'};
 function readinessAttributes(status){
  return `data-readiness-status="${status}" title="${readinessLabels[status]}"`;
 }
 function gymReadinessHeader(name,before,game){
  const sequel=['Black 2','White 2'].includes(game);
  const original=['Black','White'].includes(game);
  const catalog=sequel?window.takDexB2W2:original?window.takDexUnovaV74:null;
  const city= catalog?milestoneOptions(game).find(([key])=>key==='badge-'+(before+1))?.[1].split(' · After ')[1]?.replace(/ Gym$/,''):'';
  const title=city?.replace(/ (City|Town)$/,'')+' Gym · ';
  const leaders=['Cheren','Roxie','Burgh','Elesa','Clay','Skyla','Drayden','Marlon'];
  const record=catalog?.places.find(place=>place.kind==='gym'&&(sequel?
   leaders[before]===name&&place.name.startsWith(title):
   place.city===city&&place.leader?.split(' / ').includes(name)));
  const badge=record?.badge||record?.name.split(' · ')[1];
  const count=actual()?.saveLink?.progression?.badgeCount;
  const status=count==null?'':before<count?'Completed':before===count?'Next Gym':'Upcoming';
  return `<div class="td775-gym-header"><span><b>${safe(name)}</b>${record&&city?`<small>${td77AcquisitionLinks(city,game)}</small>`:''}</span><span>${status?`<small>${status}</small>`:''}${badge?`<small>#${before+1} · ${safe(badge)}</small>`:''}</span></div>`;
 }
 function renderReadiness(host,gym){const prefix=gym?'td77Gym':'td43League',selected=[...host.querySelectorAll('[data-td43-league][aria-expanded="true"]')].map(b=>b.dataset.td43League);const trainers=leagueTargets(state.game).filter(t=>t.gym===gym),legend='<div class="td64-league-legend">Coverage within the planning deadline · A Actual · P Planned · Green STAB · Orange non-STAB · Red no super-effective move · Gray unknown</div>',desc={good:'Super-effective STAB',nonstab:'Super-effective non-STAB',bad:'No super-effective move',unknown:'Unverified'};const indicators=(a,p)=>`<span class="td64-league-pair"><span class="td64-cover-${a.status}" title="Actual: ${desc[a.status]}">A</span><span class="td64-cover-${p.status}" title="Planned: ${desc[p.status]}">P</span></span>`;const section=(label,x)=>`<div class="td64-league-detail"><strong>${label}${x.hits.length?'':' · '+(x.status==='unknown'?'Unverified':'None')}</strong>${(x.hits.length?x.hits.map(h=>`<div>${safe(h.label)}${h.stab?' <span class="td45-league-stab">STAB</span>':''}</div>`).join(''):'')}</div>`;host.innerHTML=trainers.length?legend+trainers.map((t,ti)=>{const before=gymBefore(state.game,ti);
  const planned=readinessPlan(t,before,gym);
  const tiles=t.rows.map((r,ri)=>{const a=leagueHits(actual()?.pokemon||[],r,false),p=leagueHits(planned,r,true),label=td41PokemonLabel(r.name),src=sprite(r)||`https://play.pokemonshowdown.com/sprites/gen5/${clean(r.name)}.png`;return {button:`<button type="button" class="td74-mon-chip td42-league-tile td42-${p.status}" data-td43-league="${ti}:${ri}" aria-expanded="false" aria-label="${safe(label)}: Actual ${desc[a.status]}, Planned ${desc[p.status]}"><span class="td74-mon-art"><img alt="" src="${safe(src)}" loading="lazy"></span><span class="td74-mon-name">${safe(label)}</span>${r.level?`<small>Lv ${safe(r.level)}</small>`:''}${indicators(a,p)}</button>`,detail:`<div class="td43-league-detail" id="${prefix}${ti}_${ri}" hidden><b>${safe(label)}</b><div class="pills">${(r.types||[]).map(pill).join('')}</div><h4>Super-effective moves</h4>${section('Actual',a)}${a.status===p.status&&JSON.stringify(a.hits.map(h=>h.label+'|'+!!h.stab).sort())===JSON.stringify(p.hits.map(h=>h.label+'|'+!!h.stab).sort())?'':section('Planned',p)}</div>`}});return `<div class="td42-league-group" ${readinessAttributes(readinessStatus(t.rows.map(row=>leagueHits(planned,row,true).status)))}>${gym?gymReadinessHeader(t.name,before,state.game):`<div class="bar"><b>${safe(t.name)}</b></div>`}<div class="td74-mon-row">${tiles.map(x=>x.button).join('')}</div>${tiles.map(x=>x.detail).join('')}</div>`}).join(''):'No indexed League roster available.';for(const key of selected){const b=host.querySelector(`[data-td43-league="${key}"]`),d=$(prefix+key.replace(':','_'));if(b&&d){b.setAttribute('aria-expanded','true');d.hidden=false}}}
 for(const [host,prefix] of [[$('td4League'),'td43League'],[$('td77Gyms'),'td77Gym']])host.addEventListener('click',e=>{const b=e.target.closest('[data-td43-league]');if(!b)return;const group=b.closest('.td42-league-group'),d=$(prefix+b.dataset.td43League.replace(':','_'));const open=d.hidden;group.querySelectorAll('.td43-league-detail').forEach(x=>x.hidden=true);group.querySelectorAll('[data-td43-league]').forEach(x=>x.setAttribute('aria-expanded','false'));d.hidden=!open;b.setAttribute('aria-expanded',String(open));});
 function placeInlineEditor(){const grid=$('td4Slots'),edit=$('td4Edit');const tiles=[...grid.querySelectorAll(':scope > [data-td4-slot]')];tiles.forEach((t,i)=>{t.classList.toggle('td64-selected',!edit.hidden&&i===chosenSlot);t.setAttribute('aria-expanded',String(!edit.hidden&&i===chosenSlot));});if(!edit.hidden){const columns=Math.max(1,getComputedStyle(grid).gridTemplateColumns.split(' ').length);const last=tiles[Math.min(tiles.length-1,Math.floor(chosenSlot/columns)*columns+columns-1)];if(last)last.after(edit);}else grid.after(edit);}
 let improvementIndex=null,improvementMove=[];
 function loadImprovementIndex(){
  if(improvementIndex)return;
  plannerIndex().then(index=>{
   if(improvementIndex)return;
   improvementIndex=index;
   if(state&&!page.hidden)renderImprovements(metrics(intendedTeam(),state.game));
  }).catch(()=>{});
 }
 function improvementTypes(label,types,lost=false){
  return types.length?`<div class="td79-coverage ${lost?'td63-danger':''}"><small>${label}</small><div class="pills">${types.map(pill).join('')}</div></div>`:'';
 }
 function improvementBaseStats(source,target){
  const keys=[['HP','hp'],['Attack','attack'],['Defense','defense'],['Sp. Atk','special-attack'],['Sp. Def','special-defense'],['Speed','speed']];
  const rows=keys.map(([label,key])=>[label,source.baseStats?.[key],target.baseStats?.[key]]);
  if(rows.some(([,before,after])=>!Number.isFinite(before)||!Number.isFinite(after)))return '';
  const total=index=>rows.reduce((sum,row)=>sum+row[index],0);
  const before=total(1),after=total(2),signed=n=>n>0?'+'+n:String(n);
  return `<details class="td82-base-stats"><summary>Base stats · BST <span class="${after>before?'td41-good':after<before?'td63-danger':''}">${signed(after-before)}</span></summary>
   <table><thead><tr><th>Stat</th><th>Before</th><th>After</th><th>Δ</th></tr></thead><tbody>${[...rows,['BST',before,after]].map(([label,x,y])=>
    `<tr><th scope="row">${label}</th><td>${x}</td><td>${y}</td><td class="${y>x?'td41-good':y<x?'td63-danger':''}">${signed(y-x)}</td></tr>`).join('')}</tbody></table></details>`;
 }
 function improvementMoveCard(name,against){
  const move=info(name);
  if(!move)return moveChip(name,true);
  return `<button type="button" class="td77-planner-move-info td774-move-lines" data-td77-plan-move="${safe(name)}">${compactMoveLines({...move,name},pretty(name),against?info(against):null)}</button>`;
 }
 function renderImprovements(profile){
  const host=$('td77Improvements'),proposals=[],gen=gameGeneration(state.game),g=state.game;
  const selected=host.querySelector('[data-td77-apply-move]:focus')?.dataset.td77ApplyMove;
  const open=[...host.querySelectorAll('details[open] > summary')].map(el=>el.textContent);
  if(pack)loadImprovementIndex();
  const result=moveRecommendations();
  improvementMove=result?.proposals||[];
  for(const [index,r] of improvementMove.entries()){
   const reason=r.utility?'Story HM':'';
   const move=(r.prev?safe(pretty(r.prev))+' → ':'Add ')+safe(pretty(r.name));
   proposals.push({kind:"move",replaces:Boolean(r.prev),score:r.score+2,html:`<details><summary>${safe(td41PokemonLabel(r.p.name))} · ${move}</summary>
    <div class="td79-move-compare">
     ${improvementMoveCard(r.prev)}<span aria-hidden="true">→</span>${improvementMoveCard(r.name,r.prev)}
    </div>
    ${improvementTypes('Coverage gained',r.added)}${improvementTypes('Coverage lost',r.lost,true)}
    ${reason?`<small>${safe(reason)}</small>`:''}
    ${moveDrawback(info(r.name))!=='—'?`<small>${safe(moveDrawback(info(r.name)))}</small>`:''}
    <small>${td77AcquisitionLinks(r.timing,g)}</small>
    <button type="button" class="td774-secondary" data-td77-apply-move="${index}" data-score="${r.score.toFixed(2)}">Apply to ${movesetView==='during'?'During game':'Final'} moveset</button></details>`});
  }
  const proposalsForTeam=intendedTeam();
  if(pack&&improvementIndex){
   const baseline=compositionValue(proposalsForTeam,g),cap=deadlineLevel();
   const slotProposals=[];
   buildLineageIndex();
   const empty=state.slots.indexOf(null);
   for(const [i,planned] of state.slots.entries()){
    if(planned?.locked||!planned&&i!==empty)continue;
    const p=planned&&(movesetView==='during'?duringLearner(planned,i):planned);
    const rest=state.slots.flatMap((q,j)=>q&&j!==i?[movesetView==='during'?duringLearner(q,j):q]:[]),used=new Set(proposalsForTeam.map(q=>q.id));
    let evolution=null,replacement=null;
    for(const [id,name,types] of terminalSpecies){
     if(!td7PokemonAllowed(name,id,g)||used.has(id)||!types?.length||!improvementIndex[id]||improvementIndex[id][0]&&!state.includeLegendary)continue;
     const evolves=Boolean(p&&lineage(id).has(p.id));
     const candidate={id,name,types,baseStats:indexedStats(improvementIndex[id],gen)};
     if(redundantDowngrade(candidate,p)||rest.some(q=>redundantFamily(candidate,q))||alreadyClaimsSpecies(candidate,rest,g))continue;
     const improvement=compositionValue([...rest,candidate],g)-baseline;
     if(improvement+2<=Math.max(2,(evolves?evolution:replacement)?.gain??0))continue;
     const routes=routeOptions(candidate,true,i);
     const route=routes.find(row=>routeFits(row,cap));
     const timing=route||acquisition(candidate,false);
     if(routes.length&&!route||!timing.confirmed||!candidateInWindow(timing))continue;
     candidate.timing=timing;
     const gain=improvement-(timing.rank??8)*.35-acquisitionEffort(candidate,timing,ownedFor(p,i));
     if(evolves&&(!evolution||gain>evolution.gain))evolution={...candidate,gain,evolves};
     if(!evolves&&(!replacement||gain>replacement.gain))replacement={...candidate,gain,evolves};
    }
    const best=[evolution,replacement].filter(Boolean).sort((a,b)=>b.gain-a.gain)[0];
    if(best&&(!p||best.gain>2))slotProposals.push({i,p,best,evolution,replacement});
   }
   for(const {i,p,best} of slotProposals){
    const coverage=coverageSnapshot(proposalsForTeam,g).stabCoverage;
    const next=coverageSnapshot(state.slots.flatMap((p,j)=>i===j?[best]:p?[movesetView==='during'?duringLearner(p,j):p]:[]),g).stabCoverage;
    const comparison={added:next.filter(t=>!coverage.includes(t)),lost:coverage.filter(t=>!next.includes(t))};
    const benefits=improvementTypes('Potential super-effective STAB gained',comparison.added)+
     improvementTypes('Potential super-effective STAB lost',comparison.lost,true);
    const route=best.timing;
    const initial=route.initial;
    const levels=(route.steps||[]).map(step=>step.requirement.match(/^Level (\d+)$/i)?.[1]).filter(Boolean);
    const place=[initial?.place,...(levels.length?['Lv. '+levels.join(' → Lv. ')]:[])].filter(Boolean).join(' · ');
    const timing=initial?[
     routeChoice(route).split(' · ')[0],place,
     initial.kind!=='owned'&&Number.isInteger(initial.rank)?window.td62Progress.milestone(initial.rank):'',
     initial.note,...(route.steps||[]).map(step=>/^Level \d+$/i.test(step.requirement)?'':step.requirement)
    ]:[window.td62Progress.describe(route,effectiveProgress(),$('td77Availability').value)];
    const timingMarkup=timing.filter(Boolean).map(line=>`<small class="${initial&&initial.rank>(deadlineRank()??Infinity)&&line===window.td62Progress.milestone(initial.rank)?'td63-danger':''}">${td77AcquisitionLinks(line,g)}</small>`).join('');
    const monCard=mon=>`<div><img src="${safe(sprite(mon))}" alt=""><strong>${safe(td41PokemonLabel(mon.name))}</strong><div class="pills">${mon.types.map(pill).join('')}</div></div>`;
    const title=p?`${best.evolves?'Evolve ':''}${td41PokemonLabel(p.name)} → ${td41PokemonLabel(best.name)}`:'Add '+td41PokemonLabel(best.name)+' · Slot '+(i+1);
    proposals.push({score:best.gain,html:`<details class="td772-team-proposal" data-score="${best.gain.toFixed(2)}"><summary><span>${safe(title)}</span></summary><div class="td79-pokemon-compare">${p?monCard(p)+'<span aria-hidden="true">→</span>':''}${monCard(best)}</div>${p?improvementBaseStats(p,best):''}<div class="td78-benefits">${benefits}</div><div class="td775-improvement-route">${timingMarkup}</div><button type="button" class="td774-secondary" data-td77-improve="${i}" data-target="${safe(best.name)}">Preview  ${!p?'addition':best.evolves?'evolution':'replacement'}</button></details>`});
   }
  }
  const shared=profile.weak.filter(r=>r.weak>1&&r.severity==='uncovered').sort((a,b)=>b.gap-a.gap)[0];
  if(shared){
    const affected=shared.members;
   const open=affected.find(member=>!state.slots[member.planSlot]?.locked);
   proposals.push({score:shared.weak*3,html:`<details data-td774-shared-weakness="${safe(shared.type)}"><summary>Shared ${safe(pretty(shared.type))} weakness</summary><div class="td79-coverage">${pill(shared.type)} <small>${shared.weak} weak · ${affected.map(member=>safe(td41PokemonLabel(member.name))).join(', ')}</small></div>${open?`<button type="button" class="td774-secondary" data-td77-improve="${open.planSlot}" data-resist="${safe(shared.type)}">Review resistant replacements</button>`:''}</details>`});
  }
  const resourceNotes=[];
  for(const [name,users] of plannedMachineCopies(g)){
   if(users.length<2||users.every(user=>user.known))continue;
   const known=window.takDexAcquisitionV77?.limitedMachine(g,name);
   resourceNotes.push(known
    ? `${pretty(name)}: one TM copy in ${g}, planned for ${users.map(({p})=>pretty(p.name)).join(' and ')}. Change a move or transfer another copy.`
    : `${pretty(name)}: ${users.length} machine-only learners. Check available TM copies.`);
  }
  for(const {rule,members} of limitedSpeciesClaims(state.slots,g)){
   if(members.length>1&&members.some(p=>progressFor(p)!=='On team')){
    resourceNotes.push(rule.name+': '+members.map(p=>pretty(p.name)).join(' and ')+'. '+rule.alternative);
   }
  }

  proposals.sort((a,b)=>b.score-a.score);
  const pokemon=proposals.filter(p=>!p.kind),moves=proposals.filter(p=>p.kind==='move').sort((a,b)=>Number(a.replaces)-Number(b.replaces)||b.score-a.score);
  const resources=unovaResourceSummary(g);
  const resourceCount=(resources.match(/data-td77-resource=/g)||[]).length+resourceNotes.length;
  const category=(title,count,content)=>`<details class="td42-settings td78-category"><summary>${title} <small>(${count})</small></summary>${content||'<small>None identified</small>'}</details>`;
  $('td77ImprovementSummary').textContent=(!pack||!improvementIndex||!result.ready)?'Checking improvements…':proposals.length?proposals.length+' to review':'Review team changes';
  host.innerHTML=category('Pokémon improvements',pokemon.length,pokemon.map(p=>p.html).join(''))+
   category('Move improvements',moves.length,result&&!result.ready?'<small>Evaluating Pokémon moves…</small>':moves.map(p=>p.html).join(''))+
   category('Required resources',resourceCount,resources+resourceNotes.map(note=>`<details><summary class="td41-warn">${safe(note.split(': ')[0])} · allocation conflict</summary><small>${safe(note)}</small></details>`).join(''));
  for(const summary of host.querySelectorAll('details > summary')){
   if(open.includes(summary.textContent)||summary.parentElement.matches('.td78-category')&&open.some(value=>value.split(' (')[0]===summary.textContent.split(' (')[0]))summary.parentElement.open=true;
  }
  if(selected!=null)host.querySelector(`[data-td77-apply-move="${selected}"]`)?.focus({preventScroll:true});
 }
 let improvementType='';
 $('td77Improvements').onclick=e=>{
  const moveButton=e.target.closest('[data-td77-apply-move]');
  if(moveButton){applyMoveImprovement(improvementMove[+moveButton.dataset.td77ApplyMove]);return;}
  const button=e.target.closest('[data-td77-improve]');
  if(!button)return;
  const {target,resist}=button.dataset,index=Number(button.dataset.td77Improve);
  if(state.slots[index]?.locked)return;
  if(chosenSlot!==index||$('td4Edit').hidden)$('td4Slots').querySelector(`[data-td4-slot="${index}"]`).click();
  improvementType=resist||'';
  $('td4Edit').querySelector(':scope > .td42-settings').open=true;
  if(target)stageCandidate(target);
  else findCandidates();
  $('td4Edit').scrollIntoView({block:'nearest'});
 };

 function countTone(covered,total){return !total?'':covered===total?'td41-good':covered?'td41-warn':'td63-danger';}
 function intendedTeam(){
  return state.slots.flatMap((p,i)=>{
   if(!p)return [];
   const learner=movesetView==='during'?duringLearner(p,i):p;
   const member=ownedFor(p,i);
   const planned={...learner,planSlot:i};
   if(chosenRoute(p,true,i)?.initial.kind==='owned'&&sameMon(member,learner)){
    planned.ability=member.ability;planned.baseStats=learner.baseStats||member.baseStats;
   }
   return [planned];
  });
 }
 const moveNameWidth=document.createElement('canvas').getContext('2d');
 function fitTileMoves(){
  const grid=$('td4Slots');
  const widths=new Map();
  for(const chip of grid.querySelectorAll('.td42-tile-moves .movechip')){
   const label=chip.firstElementChild;
   if(!label||!chip.clientWidth)continue;
   label.style.removeProperty('font-size');label.classList.remove('td774-single-line');
   const css=getComputedStyle(label),box=getComputedStyle(chip);
   const fontSize=parseFloat(css.fontSize),padding=parseFloat(box.paddingLeft)+parseFloat(box.paddingRight);
   moveNameWidth.font=`${css.fontWeight} ${fontSize}px ${css.fontFamily}`;
   widths.set(chip,{label,fontSize,padding,required:moveNameWidth.measureText(label.textContent).width});
  }
  for(const row of grid.querySelectorAll('.td43-tile-flow')){
   const [from,to]=[row.firstElementChild,row.lastElementChild].map(chip=>widths.get(chip));
   if(!from||!to)continue;
   const share=Math.max(.32,Math.min(.68,(from.required+4)/(from.required+to.required+8)));
   row.style.setProperty('--td774-from',share+'fr');
   row.style.setProperty('--td774-to',1-share+'fr');
  }
  for(const [chip,{label,fontSize,padding,required}] of widths){
   const width=chip.clientWidth-padding;
   if(required<=width){label.classList.add('td774-single-line');continue;}
   const fitted=Math.floor(fontSize*(width-1)/required*10)/10;
   if(fitted>=10){label.style.fontSize=fitted+'px';label.classList.add('td774-single-line');}
  }
 }
 new ResizeObserver(fitTileMoves).observe($('td4Slots'));
 function evolutionArrow(from,to,route){
  const steps=route?.steps||[];
  const path=[{id:route?.startId},...steps];
  const start=path.findIndex(stage=>stage.id===Number(from.id));
  const end=path.findIndex(stage=>stage.id===Number(to.id));
  const relevant=start>=0&&end>start?steps.slice(start,end):[];
  if(!relevant.length)return '<span class="td42-arrow" aria-hidden="true">→</span>';
  const requirement=relevant.at(-1).requirement;
  const level=requirement.match(/^Level (\d+)$/i)?.[1];
  const short=level?'Lv. '+level:/friendship/i.test(requirement)?'Friendship':/trade/i.test(requirement)?'Trade':/stone/i.test(requirement)?'Stone':'';
  const full=[td41PokemonLabel(from.name),...relevant.map(step=>td41PokemonLabel(step.name)+' ('+step.requirement+')')].join(' → ');
  return `<span class="td42-arrow td774-evolution-arrow" title="${safe(full)}">${short?`<small aria-hidden="true">${safe(short)}</small>`:''}<span aria-hidden="true">→</span><span class="td773-sr-only">${safe(full)}</span></span>`;
 }
 function plannerLockIcon(classes=''){
  return `<svg class="${classes}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>`;
 }
 function planArtwork(mon,active=false){
  return `<span class="td772-stage${active?' td772-active-stage':''}"${active?' aria-current="true"':''}><img alt="" src="${safe(sprite(mon))}"><strong>${safe(td41PokemonLabel(mon.name))}</strong><span class="pills">${(mon.types||[]).map(pill).join('')}</span></span>`;
 }
 function render(){if(!state)return;renderActualProgress();for(const button of $('td77MoveViews').querySelectorAll('button'))button.setAttribute('aria-selected',String(button.dataset.view===movesetView));const edit=$('td4Edit');$('td4Slots').after(edit);$('td4Seed').disabled=!actual();
 $('td4Slots').innerHTML=state.slots.map((p,i)=>{
  const {pair,other,member:owned}=stageDisplay(i),isDuring=movesetView==='during';
  if(!p&&!other&&!owned)return `<button type="button" class="td4-planned-slot td42-plan-tile" data-td4-slot="${i}"><strong>＋ Slot ${i+1}</strong></button>`;
  const during=pair?(pair.during&&(p===pair.during?duringLearner(p,i):records.get(state.game+':'+pair.during.duringSpecies)||pair.during)):
   p&&duringLearner(p,i);
  const final=pair?pair.final:p;
  const display=p?(isDuring?during:p):(isDuring?final:during)||owned;
  const route=p&&chosenRoute(p,true,i),transition=p&&owned&&!sameMon(owned,display);
  const explicit=Boolean(pair||p?.duringTargetId),dual=explicit&&during&&final&&!sameMon(during,final);
  const artwork=dual?planArtwork(during,isDuring)+evolutionArrow(during,final,route)+planArtwork(final,!isDuring):
   transition&&!explicit?planArtwork(owned)+evolutionArrow(owned,display,route)+planArtwork(display,true):
   planArtwork(display,Boolean(p));
  const actualCue=owned&&(dual?!sameMon(owned,during)&&!sameMon(owned,final):transition&&explicit)?
   '<small class="td78-actual-stage">Actual · '+safe(td41PokemonLabel(owned.name))+'</small>':'';
  if(!p)return `<button type="button" class="td4-planned-slot td42-plan-tile" data-td4-slot="${i}"><div class="td42-mon-pair">${artwork}</div><div class="td772-plan-status">${actualCue}<small>${other?'＋ Plan '+(isDuring?'During game':'Final'):'＋ Plan slot '+(i+1)}</small></div><div class="td42-tile-moves">${Array(4).fill(moveChip('')).join('')}</div></button>`;
  const lock=p.locked?plannerLockIcon('td81-plan-lock')+'<span class="td773-sr-only">Locked</span>':'';
  const status=transition?(lineage(display.id).has(Number(owned.id))?'Planned evolution':p.fulfilledPid!=null?'Selected earlier stage':'Planned replacement'):safe(progressFor(p));
  return `<button type="button" class="td4-planned-slot td42-plan-tile" data-td4-slot="${i}" data-td77-hold>${lock}<div class="td42-mon-pair">${artwork}</div><div class="td772-plan-status">${actualCue}<small>${status}</small>${p.fulfilledPid==null&&route?.steps.length&&route.initial.kind!=='owned'?`<small>Obtain ${safe(td41PokemonLabel(route.startName))}</small>`:''}${p.fulfilledPid==null&&(route||acquisition(p)).rank>(deadlineRank()??10)?'<small class="td63-danger">After planning deadline</small>':''}</div><div class="td42-tile-moves">${alignedMoves(p,i).map(tileMove).join('')}</div></button>`;
 }).join('');
 fitTileMoves();
 const filled=state.slots.filter(Boolean);
 const count=filled.filter((p)=>progressFor(p)==='On team').length;
 const acquired=filled.filter(p=>progressFor(p)!=='Planned').length;
 const learned=state.slots.reduce((n,p,i)=>n+(p?alignedMoves(p,i).filter(row=>row.retained).length:0),0);
 const plannedMoveCount=activeMoves().length;
 const counter=(label,n,total)=>`<span><strong class="${countTone(n,total)}">${n}/${total}</strong><small>${label}</small></span>`;
 $('td4PlanProgress').innerHTML='<h4>Team Progress</h4><div>'+counter('Planned',filled.length,6)+counter('Acquired',acquired,6)+counter('Final forms',count,6)+'</div><div>'+counter('Moves planned',plannedMoveCount,24)+counter('Planned moves already known',learned,plannedMoveCount)+'</div>';
 const m=metrics(intendedTeam(),state.game),potentialStab=m.covered;$('td4Coverage').innerHTML=state.game?`${coveragePair('Potential STAB coverage',{types:metrics(actual()?.pokemon||[],state.game).covered},{types:potentialStab})}${coveragePair('Moveset coverage',coverageFor((actual()?.pokemon||[]).flatMap(p=>(p?.moves||[]).map(moveKey)).filter(Boolean)),coverageFor(activeMoves()))}<section class="td774-defensive"><h4>Planned team · Defensive coverage</h4>${['uncovered','partial','compensated'].map((status,index)=>{
 const rows=m.weak.filter(x=>x.weak>1&&x.severity===status);
 return rows.length?'<h5>'+['Uncovered weaknesses','Partially compensated','Well compensated'][index]+'</h5>'+
 rows.map(x=>`<p>${pill(x.type)} ${x.weak} weak · ${x.resist-x.immune} resist · ${x.immune} immune</p>`).join(''):'';
 }).join('')||'<p>No shared weaknesses.</p>'}</section>${m.filled.some(p=>roleTags(p).length)?`<details class="td42-settings"><summary>Team roles</summary>${['Physical','Special','Fast','Defensive'].map(r=>{const names=m.filled.filter(p=>roleTags(p).includes(r)).map(p=>safe(td41PokemonLabel(p.name)));return names.length?`<p><b>${r}</b> · ${names.join(', ')}</p>`:'';}).join('')}</details>`:''}`:'Choose a game.';placeInlineEditor();
 const typeCount=typesFor(state.game).length,moveCount=coverageFor(activeMoves()).types.length;
 const gaps=m.weak.filter(x=>x.weak>1&&x.severity==='uncovered').length;
 const partial=m.weak.filter(x=>x.weak>1&&x.severity==='partial').length;
 const compensated=m.weak.filter(x=>x.weak>1&&x.severity==='compensated').length;
 $('td77CoverageSummary').innerHTML=`<span class="td77-coverage-line"><span class="${countTone(potentialStab.length,typeCount)}">STAB ${potentialStab.length}/${typeCount}</span> · <span class="${countTone(moveCount,typeCount)}">Moves ${moveCount}/${typeCount}</span></span><span class="td77-coverage-line"><span class="${gaps?'td63-danger':'td41-good'}">${gaps} uncovered</span> · <span class="${partial?'td41-warn':'td41-good'}">${partial} partially compensated</span>${compensated?' · <span class="td41-good">'+compensated+' well compensated</span>':''}</span>`;
 const assigned=hms(state.game).filter(name=>activeMoves().includes(name));

 const expected=hms(state.game).length;
 $('td77HmSummary').textContent=expected?assigned.length+'/'+expected+' planned':'No party HMs';
 $('td77HmSummary').className=countTone(assigned.length,expected);
 const rosters=leagueTargets(state.game),gymCount=new Set(rosters.filter(t=>t.gym).map((_,i)=>gymBefore(state.game,i))).size,badges=actual()?.saveLink?.progression?.badgeCount;
 const nextGym=Number.isInteger(badges)?rosters.filter(t=>t.gym).find((_,i)=>gymBefore(state.game,i)===badges):null;
 $('td77GymSummary').textContent=nextGym?'Next: '+(badges===0&&['Black','White'].includes(state.game)?'Striaton Gym':nextGym.name):
  Number.isInteger(badges)&&gymCount?Math.min(badges,gymCount)+'/'+gymCount+' completed':gymCount?'View coverage by upcoming Gym':'No indexed Gyms';
 const gymSummary=$('td77GymSummary');
 const actualCoverage=nextGym?nextGym.rows.map(row=>leagueHits(actual()?.pokemon||[],row,false)):[];
 const nextStatus=readinessStatus(actualCoverage.map(result=>result.status));
 if(nextGym)gymSummary.textContent+=' · '+actualCoverage.filter(result=>result.hits.length).length+'/'+actualCoverage.length;
 gymSummary.dataset.readinessStatus=nextStatus;gymSummary.title=readinessLabels[nextStatus];
 $('td77LeagueSummary').innerHTML=rosters.filter(t=>!t.gym).map(t=>{
  const planned=readinessPlan(t,9,false);
  const covered=t.rows.filter(r=>['good','nonstab'].includes(leagueHits(planned,r,true).status)).length;
  return `<span class="${countTone(covered,t.rows.length)}" ${readinessAttributes(readinessStatus(t.rows.map(row=>leagueHits(planned,row,true).status)))}>${safe(t.name)} ${covered}/${t.rows.length}</span>`;
 }).join(' · ')||'No indexed roster';
 renderReadiness($('td77Gyms'),true);renderReadiness($('td4League'),false);renderHM();
 renderImprovements(m);}
 async function refreshMoveInfo(){if(!state)return;const g=state.game,run=++moveRun,stamp=token;const owned=(actual()?.pokemon||[]).flatMap(p=>p?.moves||[]);for(const m of owned){if(m?.type&&m?.damageClass&&!moveInfo.has(g+':'+moveKey(m)))moveInfo.set(g+':'+moveKey(m),m)}const names=[...new Set([...knownMoves(),...state.slots.flatMap(p=>(p?.duringMoves||[]).map(goal)),...owned.map(moveKey),...state.slots.flatMap(p=>(p?.plannedMoves||[]).map(m=>m.warningFrom))].filter(Boolean))];await Promise.all(names.filter(n=>!moveInfo.has(g+':'+n)).map(async n=>{const m=await enrichMove({name:pretty(n)},gameGeneration(g),g);if(m?.type&&m?.damageClass)moveInfo.set(g+':'+n,m)}));if(run===moveRun&&stamp===token&&state?.game===g){
   const editing=$('td41MoveSlots').contains(document.activeElement)||$('td41MoveSlots').querySelector('.suggestions:not([hidden])');
   if(editing)return;
   render();
   if(!$('td4Edit').hidden){if(movesetView==='final')updateMovePreviews();else renderMoveSlots();}
  }}
 function retainsMove(p,learner,move,slot,route=chosenRoute(p,true,slot)){
  const member=ownedFor(p,slot);
  if(!member||!learner||!move||!lineage(learner.id).has(Number(member.id)))return false;
  if(p?.fulfilledPid==null&&(route?route.initial.kind!=='owned':p?.acquisitionRoute||!sameMon(member,learner)))return false;
  // A move on the assigned individual remains legal through the selected evolution.
  return (member.moves||[]).some(entry=>moveKey(entry)===move);
 }
 function alignedMoves(p,slot,view=movesetView){
  const planned=(view==='during'?p.duringMoves:p.plannedMoves)||[];
  const learner=view==='during'?duringLearner(p,slot):finalLearner(p);
  const route=chosenRoute(p,true,slot),used=new Set(),member=ownedFor(p,slot);
  const actualMoves=Array.from({length:4},(_,i)=>moveKey(member?.moves?.[i]));
  const rows=actualMoves.map(from=>{
   const index=from?planned.findIndex((move,i)=>!used.has(i)&&goal(move)===from): -1;
   if(index>=0)used.add(index);
   return {from,index};
  });
  return rows.map(row=>{
   const index=row.index>=0?row.index:planned.findIndex((_,i)=>!used.has(i));
   used.add(index);
   const move=planned[index];
   return {...row,index,move,retained:row.from===goal(move)&&retainsMove(p,learner,row.from,slot,route)};
  });
 }
 function distributeHM(rows,slots){const occupied=slots.map(p=>new Set(displayedMoves(p).map(goal).filter(n=>rows.includes(n))));const pending=rows.filter(h=>!occupied.some(moves=>moves.has(h))).map(h=>({h,eligible:slots.map((p,i)=>p?.hms?.includes(h)?i:-1).filter(i=>i>=0)})).sort((a,b)=>a.eligible.length-b.eligible.length);const loads=occupied.map(x=>Math.min(4,x.size)),memo=new Map();const score=(h,i,load)=>{const p=slots[i],b=p.baseStats||{},type=['surf','waterfall','dive','whirlpool'].includes(h)?'water':h==='fly'||h==='defog'?'flying':h==='rock-smash'?'fighting':'normal',combat=['surf','fly','waterfall','strength'].includes(h);return (combat&&p.types?.includes(type)?75:0)+(h==='surf'?(b['special-attack']||0):(b.attack||0))/10+(p.plannedMoves?.filter(m=>!goal(m)).length>load-loads[i]?12:0)-(load*55);};function solve(j,counts){if(j===pending.length)return {score:0,choices:[]};const key=j+':'+counts.join(',');if(memo.has(key))return memo.get(key);const {h,eligible}=pending[j];let best=solve(j+1,counts);best={score:best.score,choices:[-1,...best.choices]};for(const i of eligible){const already=occupied[i].has(h);if(counts[i]>=4&&!already)continue;const next=counts.slice();if(!already)next[i]++;const r=solve(j+1,next),v=1000+score(h,i,counts[i])+r.score;if(v>best.score)best={score:v,choices:[i,...r.choices]};}memo.set(key,best);return best;}const best=solve(0,loads);return new Map(pending.map((x,j)=>[x.h,best.choices[j]>=0?{p:slots[best.choices[j]],i:best.choices[j]}:null]));}
 // Main-story HM requirement references: https://bulbapedia.bulbagarden.net/wiki/HM and https://pokemondb.net/black-white/hms
 function hmPurpose(g,h){if(!['Black','White','Black 2','White 2'].includes(g))return 'Story requirement not verified';if(h==='fly')return 'Fast travel';if(['Black','White'].includes(g)){if(h==='cut')return 'Story required · Dreamyard';if(h==='surf')return 'Optional · Area access & exploration';if(h==='strength')return 'Optional · Victory Road shortcuts & area access';}else if(['surf','strength'].includes(h))return 'Story required';return 'Optional exploration';}
 function td5HmAdvice(h,p,g){const attackType=['surf','waterfall','dive','whirlpool'].includes(h)?'water':['fly','defog'].includes(h)?'flying':h==='rock-smash'?'fighting':'normal';if(['surf','fly','waterfall','strength'].includes(h)&&p?.types?.includes(attackType)){if(gameGeneration(g)>=4&&h==='surf'&&(p.baseStats?.['special-attack']||0)<(p.baseStats?.attack||0)*0.65)return 'Replace';if(gameGeneration(g)>=4&&['fly','waterfall','strength'].includes(h)&&(p.baseStats?.attack||0)<(p.baseStats?.['special-attack']||0)*0.65)return 'Replace';return 'Keep';}if(['cut','flash','rock-smash','defog','rock-climb','dive','whirlpool'].includes(h))return 'Replace';return 'Replace';}
 function td5TemporaryCarrier(h){const catalog=pack,g=state.game,ids=new Set(state.slots.filter(Boolean).map(p=>p.id)),key=g+':'+h+':'+effectiveProgress()+':'+[...ids].sort().join(',');if(!catalog||catalog.game!==g)return null;if(temporaryHmCache.has(key))return temporaryHmCache.get(key);const entry={pending:true};temporaryHmCache.set(key,entry);const pool=(catalog.mons||[]).filter(p=>!ids.has(p[0])&&catalog.entries?.[p[0]]?.length).filter(p=>{const evidence=window.takDexAcquisitionV64.details(catalog,p[0]);const timing=window.td62Progress.acquisition(g,{id:p[0],name:p[1]},catalog,[],evidence),now=window.td62Progress.rank(effectiveProgress());return evidence.verified&&!evidence.notes?.some(n=>n.eventOnly)&&(now==null||timing.rank!=null&&timing.rank<=now)}).sort((a,b)=>{const av=Math.min(...(catalog.entries[a[0]]||[]).map(x=>Number(x[2])||100)),bv=Math.min(...(catalog.entries[b[0]]||[]).map(x=>Number(x[2])||100));return av-bv;}).slice(0,32);(async()=>{let found=null;for(let i=0;i<pool.length&&!found;i+=8){const batch=await Promise.all(pool.slice(i,i+8).map(async p=>{try{const d=await details(p[1],g);return d.hms.includes(h)?{p:d,loc:catalog.entries[p[0]]?.[0]?.[0]}:null}catch{return null}}));found=batch.find(Boolean)||null;}entry.pending=false;entry.found=found;if(state?.game===g&&pack===catalog)renderHM()})().catch(()=>{entry.pending=false;});return entry;}
 $('td4HM').closest('details').addEventListener('toggle',e=>{if(e.target.open&&state)renderHM()});
 function renderHM(){const opened=new Set([...$('td4HM').querySelectorAll('details[open]')].map(x=>x.dataset.hm));const rows=hms(state.game),owned=(actual()?.pokemon||[]).filter(Boolean),recommendations=distributeHM(rows,state.slots);$('td4HM').innerHTML=(rows.length?'<div class="td64-hm-summary td64-hm-head"><b>HM</b><b>Actual</b><b>Planned</b><span></span></div>':'')+(rows.map(h=>{const current=owned.filter(p=>(p.moves||[]).some(m=>moveKey(m)===h));const assigned=state.slots.flatMap((p,i)=>displayedMoves(p).some(m=>goal(m)===h)?[{p,i}]:[]);const recommended=recommendations.get(h);const outside=!assigned.length&&!recommended&&$('td4HM').closest('details').open?td5TemporaryCarrier(h):null;const unknown=state.slots.some(p=>p&&!Array.isArray(p.hms));const carrier=({p,i},prefix='')=>`<button class="td41-carrier" type="button" data-td41-carrier="${i}">${prefix}${safe(td41PokemonLabel(p.name))}</button>`;const usefulness=hmPurpose(state.game,h);const gate=window.td62Progress.hm(state.game,h,effectiveProgress());const names=ps=>ps.map(p=>safe(td41PokemonLabel(p.name))).join(', ')||'—';return `<details class="td64-hm-row" data-hm="${safe(h)}" ${opened.has(h)?'open':''}><summary class="td64-hm-summary"><strong>${safe(pretty(h))}</strong><span>${names(current)}</span><span class="${assigned.length?'td41-good':''}">${names(assigned.map(x=>x.p))}</span><span class="td64-hm-arrow">⌄</span></summary><div class="td41-hm-row"><small class="td45-hm-purpose ${gate&&window.td62Progress.rank(effectiveProgress())!=null&&window.td62Progress.rank(effectiveProgress())<gate.rank?'td63-danger':''}">${safe(usefulness)}${gate?' · '+safe(gate.text):''}</small><div class="td64-hm-actions">${assigned.length?assigned.map(x=>carrier(x,'Edit: ')).join(''):recommended?carrier(recommended,'Recommended: '):`<small>${outside?.found?`Suggested carrier: ${safe(td41PokemonLabel(outside.found.p.name))}${outside.found.loc?' · '+safe(pretty(outside.found.loc)):''} · ${td77AcquisitionLinks(window.td62Progress.describe(acquisition(outside.found.p),effectiveProgress(),''),state.game)}`:outside?.pending?'Checking temporary carriers…':unknown?'Compatibility unavailable':'No verified temporary carrier found in checked records'}</small>`}</div><div class="td41-hm-meta"><span>Elite Four: ${assigned.length?'Keep':recommended?td5HmAdvice(h,recommended.p,state.game):outside?.found?'Replace':'Unassigned'}</span></div></div></details>`}).join('')||'<p>No party HM requirement list for this game.</p>');}
 function td5Attacker(p,slot){const a=ownedFor(p,slot);return {...p,ability:sameMon(a,p)?a.ability:p.ability,abilities:sameMon(a,p)?(a.abilities?.length?a.abilities:p.abilities):p.abilities};}
 function td5Merit(x,p,slot,g){if(!damaging(x))return 0;const attacker=td5Attacker(p,slot),name=pretty(moveKey(x.name)),m={...x,name},gen=gameGeneration(g);if(TAK62_AVOID.has(moveKey(name))&&!TD2_CHARGE.has(name)&&!TD2_RECHARGE.has(name))return 0;const power=td2Power(m,attacker,null,gen)?.min;if(!Number.isFinite(power)||power<=0)return 0;const stat=p.baseStats?.[m.damageClass==='special'?'special-attack':'attack']||0;const drawback=['Flare Blitz','Brave Bird','Double Edge','Head Smash','Wood Hammer','Wild Charge','Take Down','Submission','Volt Tackle','Jump Kick','High Jump Kick'].includes(name)?0.88:1;const hit=Number.isFinite(m.accuracy)?m.accuracy/100:1;return power*hit*td2Stab(m,attacker,gen)*td2OffensiveModifier(m,attacker,gen)*(stat+50)/150/td2Turns(m,attacker,gen)*drawback+(Number(m.priority)>0?8:0);}
 function td51Risk(n){return /^(dream-eater|nightmare|foul-play|outrage|thrash|petal-dance|superpower|close-combat|overheat|leaf-storm|draco-meteor|hammer-arm|v-create|flare-blitz|brave-bird|double-edge|head-smash|wood-hammer|wild-charge|take-down|submission|volt-tackle|jump-kick|high-jump-kick|dig|fly|dive|bounce|solar-beam|sky-attack|razor-wind|skull-bash|shadow-force|giga-impact|hyper-beam|blast-burn|hydro-cannon|frenzy-plant|rock-wrecker|roar-of-time|focus-punch|sucker-punch|last-resort|snore|belch|stored-power|reversal|flail|endeavor|counter|mirror-coat|metal-burst|synchronoise|assurance|payback|revenge|avalanche|retaliate|hex|venoshock|wake-up-slap|brine|facade|acrobatics|electro-ball|gyro-ball|eruption|water-spout)$/.test(moveKey(n));}
 function plannerSuitability(mon,types,move,gen,foe={}){
   const incoming=Math.max(...types.map(type=>matchupDefense(mon,type,gen)),.25);
   const b=mon.baseStats||{},o=foe.baseStats||{};
   const bulk=(b.hp||70)*Math.min(b.defense||70,b['special-defense']||70);
   const first=move.priority>0||(b.speed&&o.speed&&b.speed>=o.speed);
   const defense=incoming>=4?.16:incoming>1?.35:incoming<1?1:.75;
   return Math.min(1.25,defense+Math.max(-.12,Math.min(.15,(bulk-4900)/30000))+(first?.14:0));
 }
 function rateMoveChange(p,i,prev,name,own,others,g){
  const m=info(name),old=info(prev),attacker=td5Attacker(p,i),gen=gameGeneration(g);
  const utility=hms(g).includes(name)&&![...own,...others].some(entry=>entry.name===name);
  const merit=td5Merit(m,p,i,g),oldMerit=td5Merit(old,p,i,g);
  if(!merit&&!utility)return null;
  const ownMoves=own.map(entry=>info(entry.name));
  if(damaging(m)&&old?.type!==m.type&&!utility&&ownMoves.some(row=>damaging(row)&&row.type===m.type&&
   row.damageClass===m.damageClass&&td5Merit(row,p,i,g)>=merit))return null;
  const effect=(move,mon,slot,type)=>damaging(move)&&defensiveEffect(move,{types:[type]},gen,mon)>1?
   plannerSuitability(mon,[type],move,gen)*Math.min(1,td5Merit(move,mon,slot,g)/60):0;
  let contribution=0;
  const added=[],lost=[];
  for(const type of typesFor(g)){
   const existing=Math.max(0,...others.map(({name,mon,slot})=>effect(info(name),mon,slot,type)),
    ...ownMoves.map(move=>effect(move,attacker,i,type)));
   const before=Math.max(existing,effect(old,attacker,i,type)),after=Math.max(existing,effect(m,attacker,i,type));
   contribution+=after-before;
   if(!before&&after)added.push(type);
   if(before&&!after)lost.push(type);
  }
  const lastSTAB=damaging(old)&&p.types?.includes(old.type)&&old.type!==m?.type&&
   !ownMoves.some(row=>damaging(row)&&row.type===old.type);
  const existingBest=Math.max(1,...ownMoves.map(row=>td5Merit(row,p,i,g)));
  const quality=Math.min(2.5,merit/Math.max(35,existingBest)*2)-Math.min(2.5,oldMerit/Math.max(35,existingBest)*2);
  const drawback=(td51Risk(name)?1:0)-(td51Risk(prev)?1:0);
  const score=7*contribution+quality-1.5*drawback-(lastSTAB?4:0)+(utility?3:0);
  return {score,added,lost,utility};
 }
 function moveDrawback(x){const n=moveKey(x?.name);if(['dig','fly','dive','bounce','solar-beam','sky-attack','razor-wind','skull-bash','shadow-force'].includes(n))return 'Two turns';if(n==='dream-eater')return 'Target must sleep';if(n==='foul-play')return 'Uses target Attack';if(['flare-blitz','brave-bird','double-edge','head-smash','wood-hammer','wild-charge','take-down','submission','volt-tackle'].includes(n))return 'Recoil';if(['giga-impact','hyper-beam','blast-burn','hydro-cannon','frenzy-plant','rock-wrecker','roar-of-time'].includes(n))return 'Recharge';if(['superpower','close-combat','overheat','leaf-storm','draco-meteor','hammer-arm','v-create'].includes(n))return 'Stat drop';if(['thrash','outrage','petal-dance'].includes(n))return 'Move lock / confusion';return '—'}
 function moveTradeoff(a,b,added,lost){const val=(x,k)=>k==='accuracy'?(x?.accuracy==null?'—':x.accuracy+'%'):k==='power'?(x?.power??'—'):x?.[k]?pretty(x[k]):'—';return `<span class="td44-trade-table">${[['Power','power'],['Accuracy','accuracy'],['Category','damageClass'],['Type','type'],['Drawback','drawback']].map(([label,k])=>{const x=k==='drawback'?moveDrawback(a):val(a,k),y=k==='drawback'?moveDrawback(b):val(b,k),cls=['power','accuracy'].includes(k)&&Number.isFinite(a?.[k])&&Number.isFinite(b?.[k])?(b[k]>a[k]?'td41-good':b[k]<a[k]?'td41-warn':''):k==='drawback'&&x!==y?(y==='—'?'td41-good':'td41-warn'):x!==y?'td51-changed':'';return `<span>${label}</span><span>${safe(x)}</span><span class="${cls}">${safe(y)}</span>`}).join('')}${added.length?`<span class="td41-good td44-trade-wide">Gains: ${safe(added.map(pretty).join(', '))}</span>`:''}${lost.length?`<span class="td41-warn td44-trade-wide">Loses: ${safe(lost.map(pretty).join(', '))}</span>`:''}</span>`}

 function downgradeReasons(p,slot,prev,n,others,g){
  const a=info(prev),z=info(n),reasons=[];
  if(!a||!z||prev===n)return reasons;
  const team=state.slots.flatMap((plan,i)=>i===slot?others:displayedMoves(plan).map(goal)).filter(Boolean);
  const reliable=name=>{
   const move=info(name);
   return damaging(move)&&(move.accuracy??100)>=80&&!td51Risk(name);
  };
  const before=coverageFor([...team,prev].filter(reliable)).types;
  const after=coverageFor([...team,n].filter(reliable)).types;
  const lost=before.filter(type=>!after.includes(type)),gained=after.filter(type=>!before.includes(type));
  if(lost.length)reasons.push('Loses reliable team coverage against '+lost.map(pretty).join(', '));
  if(damaging(a)&&p.types?.includes(a.type)&&!others.some(name=>reliable(name)&&info(name).type===a.type)&&
   (!damaging(z)||z.type!==a.type))reasons.push('Removes this Pokémon’s last '+pretty(a.type)+' STAB attack');
  if(damaging(a)&&(!damaging(z)||td5Merit(z,p,slot,g)<td5Merit(a,p,slot,g)*.8))reasons.push('Lower reliable offensive value');
  if(damaging(a)&&damaging(z)&&(a.accuracy??100)-(z.accuracy??100)>=15)reasons.push('Lower accuracy');
  if(hms(g).includes(prev)&&!team.includes(prev))reasons.push('Removes the team’s '+pretty(prev)+' HM assignment');
  if(td51Risk(n)&&!td51Risk(prev))reasons.push('Adds a conditional or high-drawback attack');
  if(reasons.length&&gained.length)reasons.push('Gains reliable team coverage against '+gained.map(pretty).join(', '));
  return reasons;
 }
 function editableMoveCard(learner,old,target,index,during,retained=false){
  const data=info(target),available=Array.isArray(learner.legalMoves);
  const text=target?pretty(target):'Choose move';
  const stats=retained?'<strong class="td41-good">Keep</strong>':target&&data?td77MoveResultLines({...data,name:target},text,info(old)):'<strong>'+safe(text)+'</strong>';
  const mode=during?'during':'goal';
  return `<div class="td42-move-flow td77-move-comparison ${during?'td77-during-flow':''}">${!old&&target?'<span class="td77-editor-empty" aria-label="No actual move">×</span>':moveChip(old,true)}<span class="td42-arrow">→</span>
   <div class="search td45-move-search td77-edit-move">
    <div class="td77-planner-move-info">${stats}<button class="td78-open-move" type="button" data-td78-open-move aria-expanded="false" aria-label="Change planned move ${index+1}" ${available?'':'disabled'}></button></div><div class="td78-editor-shell">
     <div class="td78-editor-search td772-filter-line"><input autocomplete="off" aria-label="${during?'During-game':'Goal'} move ${index+1}" ${during?'data-td77-during="'+index+'"':''} data-td45-move="${index}:${mode}" placeholder="Search moves…" value="${safe(target?text:'')}" ${available?'':'disabled'}>
     ${td772FilterButton('td78MoveFilters-'+index,'Move filters','td78MoveFilterPanel-'+index)}</div><div class="td78-move-badges"></div><div class="suggestions" hidden></div></div>
   </div></div>`;
 }
 page.addEventListener('click',event=>{
  const button=event.target.closest('[data-td7721-bind],[data-td7721-dismiss]');
  if(!button)return;
  const plan=state.slots[chosenSlot];
  if(button.hasAttribute('data-td7721-dismiss'))plan.ownershipReviewDismissed=button.dataset.td7721Dismiss;
  else{
   const candidate=acquisitionMatches()[chosenSlot]?.find(member=>member.saveStats.pid===Number(button.dataset.td7721Bind));
   if(!bindable(candidate))return;
   plan.fulfilledPid=candidate.saveStats.pid;
   plan.fulfilledStage=candidate.id;
  }
  persist();render();renderMoveSlots();
 });
 function movePreview(p,{move:m,from:old,index:i,retained}){
  const target=goal(m);
  return editableMoveCard(p,old,target,i,false,retained)+moveTimingMarkup(p,target);
 }
 function updateMovePreviews(){
  const p=state?.slots[chosenSlot],learner=finalLearner(p);
  if(!p||movesetView!=='final')return;
  for(const row of alignedMoves(p,chosenSlot)){
   const el=$('td41MoveSlots').querySelector(`[data-td42-preview="${row.index}"]`);
   if(el&&!el.contains(document.activeElement)&&!el.querySelector('.suggestions:not([hidden])'))el.innerHTML=movePreview(learner,row)+retainedChoiceNotice(learner,row.move,row.retained);
  }
 }
 function retainedChoiceNotice(learner,move,retained){
  return !retained&&goal(move)&&learner.legalMoves&&!learner.legalMoves.includes(goal(move))?
   '<small class="td41-warn">Retained choice · acquisition not verified for this target</small>':'';
 }
 function moveRowAttributes({from,move,retained}){
  return `data-td77-actual-move="${safe(from)}" data-td77-planned-move="${safe(goal(move))}" data-td77-retained="${retained}"`;
 }
 $('td77Lock').onclick=()=>{
  const p=state?.slots[chosenSlot];
  if(!p)return;
  p.locked=!p.locked;persist();render();renderMoveSlots();
  if(settings.open){restoreConfirmedPreview();findCandidates();}
 };
 let movesetView='final';
 $('td77MoveViews').onclick=e=>{
  if(!e.target.dataset.view)return;
  if(movesetView===e.target.dataset.view)return;
  captureStage();movesetView=e.target.dataset.view;state.mode=movesetView;projectStage();
  setDeadlineOptions(state.game);reconcileOwnership();persist();render();
  if(!$('td4Edit').hidden){renderMoveSlots();if(settings.open){restoreConfirmedPreview();findCandidates();}}
 };
 function finalFormOptions(p){
  if(!pack||!p)return [];
  buildLineageIndex();
  const route=chosenRoute(p),member=ownedFor(p,chosenSlot);
  const livingStart=member&&(route?.initial.kind==='owned'||!p.acquisitionRoute&&(lineage(p.id).has(member.id)||lineage(member.id).has(p.id)));
  const root=livingStart?Number(member.id):[...lineage(p.id)].at(-1);
  return pack.mons.filter(([id])=>lineage(id).has(root)).map(([id,name,types])=>{
   const paths=routeOptions({...p,id,name,types}).filter(row=>!livingStart||row.initial.kind==='owned');
   const path=paths.find(row=>row.id===route?.id)||paths.find(row=>routeFits(row))||paths[0];
   return {id,name,path,reason:path?'':acquisition({id,name},false).reason||'Route timing not verified'};
  });
 }
 function deadlineLevel(){
  const limit=deadlineRank()??9;
  if(limit>=9)return Infinity;
  const roster=leagueTargets(state.game).filter(t=>t.gym).find((_,i)=>gymBefore(state.game,i)===limit);
  return roster?.rows?.length?Math.max(...roster.rows.map(r=>r.level||0)):Infinity;
 }
 function linkTradePending(route){
  return route?.initial.kind==='link-trade'&&$('td77Availability').value==='actual'&&
   actual()?.saveLink?.progression?.events?.trading===false;
 }
 function routeFits(route,cap=deadlineLevel()){
  if(!route||route.rank==null||route.rank>(deadlineRank()??9)||linkTradePending(route))return false;
  const trained=route.initial.kind==='owned'?route.initial.minLevel||0:0;
  return route.steps.every(step=>step.level<=Math.max(cap,trained));
 }
 function learnsetFor(target){
  return Array.isArray(target.legalMoves)?{legalMoves:target.legalMoves,learnMethods:target.learnMethods,learnBefore:target.learnBefore}:null;
 }
 function finalLearner(p){return p?.finalLearnset?{...p,...p.finalLearnset}:p;}
 const finalMoveStamp=move=>[move?.move||'',move?.replacement||'',move?.purpose||''].join('|');
 function usableFinalMoves(p){
  const route=p&&chosenRoute(p);
  if(route&&!routeFits(route)||!route&&p?.acquisitionRoute)return [];
  const allowed=finalLearner(p)?.legalMoves;
  return (p?.plannedMoves||[]).filter(move=>!allowed||allowed.includes(goal(move)));
 }
 function reviseAutomaticMoves(p,generated,stamps=p.finalAutoMoves){
  const manual=moveSlots(p).map((move,i)=>p.finalManualSlots?.[i]||goal(move)&&finalMoveStamp(move)!==stamps?.[i]?move:null);
  const used=new Set(manual.map(goal).filter(Boolean));
  const choices=generated.filter(move=>goal(move)&&!used.has(goal(move)));
  const plannedMoves=moveSlots({plannedMoves:manual.map(move=>move||choices.shift())});
  return {plannedMoves,finalAutoMoves:plannedMoves.map((move,i)=>manual[i]?'':finalMoveStamp(move))};
 }
 function renderFinalFormChoice(p){
  const host=$('td77FinalForm'),stages=finalFormOptions(p);
  host.hidden=!p||stages.length<2;
  if(host.hidden)return;
  const during=movesetView==='during';
  const name=during?duringSpecies(p,chosenSlot):p.name;
  const path=stages.find(q=>q.name===name)?.path;
  const requirement=path?.steps.at(-1)?.requirement;
  host.innerHTML=`<div class="td78-evolution-label">Planned evolution
   <button type="button" class="td774-route-choice td78-evolution-control" aria-haspopup="dialog" data-td78-evolution>
   <span>${safe(pretty(name))} · ${during?'During game':'Final'}
    ${requirement?`<small>${safe(requirement)}</small>`:''}</span></button></div>`;
 }
 $('td77FinalForm').addEventListener('click',e=>{
  const trigger=e.target.closest('[data-td78-evolution]'),p=state.slots[chosenSlot];
  if(!trigger||!p)return;
  const during=movesetView==='during',slot=chosenSlot;
  const selected=during?duringSpecies(p,slot):p.name;
  const stages=finalFormOptions(p);
  const dialog=document.createElement('dialog');
  dialog.className='td71-quick-dialog td78-evolution-dialog';
  dialog.setAttribute('aria-labelledby','td78EvolutionTitle');
  dialog.innerHTML=`<h3 id="td78EvolutionTitle">Planned evolution</h3><div class="td78-evolution-options">
   ${stages.map(q=>{
    const current=q.name===selected,path=q.path;
    const fits=path&&routeFits(path);
    const tone=path?(fits?(current?'':'td41-good'):'td63-danger'):'';
    const status=path?(fits?(current?'Current choice':path.initial.kind==='owned'?'On team':window.td62Progress.milestone(path.rank)):routeRestriction(path)):q.reason;
    return `<div><button type="button" class="td774-secondary" data-td78-form="${q.id}" aria-pressed="${current}" ${!current&&!path?'disabled':''}>
     ${current?'Keep ':''}${safe(pretty(q.name))}</button>
     <div>${path?.steps.length?`<small>${safe(path.steps.map(step=>step.requirement).join(' · '))}</small>`:''}
     ${status?`<small class="${tone}">${safe(status)}</small>`:''}</div></div>`;
   }).join('')}</div><button type="button" class="td774-secondary" data-td78-evolution-cancel>Cancel</button>`;
  dialog.addEventListener('close',()=>{
   dialog.remove();
   if(trigger.isConnected&&!page.hidden)trigger.focus({preventScroll:true});
  },{once:true});
  dialog.addEventListener('click',event=>{
   const cancel=event.target.closest('[data-td78-evolution-cancel]');
   const button=event.target.closest('[data-td78-form]');
   if(cancel){dialog.close();return;}
   const option=button&&stages.find(q=>q.id===Number(button.dataset.td78Form));
   if(!option)return;
   dialog.close();
   if(option.name===selected||state.slots[slot]!==p||slot!==chosenSlot)return;
   const routes=routeOptions(p);
   const existing=chosenRoute(p);
   const route=during&&lineage(p.id).has(option.id)?
    routes.find(path=>path.id===existing?.id&&routeIncludesStage(path,option.id)):option.path;
   choose(option.name,route,during?option.id:undefined);
  });
  document.body.append(dialog);dialog.showModal();
  dialog.querySelector('[aria-pressed=true]')?.focus({preventScroll:true});dialog.scrollTop=0;
 });
 function routeRestriction(path){
  if(path.rank==null)return 'Timing not verified';
  if(linkTradePending(path))return 'Receive the C-Gear first';
  if(path.rank>(deadlineRank()??9))return 'After planning deadline';
  return 'Above the level for this deadline';
 }
 async function finalFormMoves(p,i,g,selected=chosenRoute(p,true,i)){
  const form=p;
  const route=[...lineage(form.id)];
  const member=ownedFor(p,i);
  const currentStage=member?route.indexOf(Number(member.id)):-1;
  const selectedStage=selected?route.indexOf(selected.startId):route.length-1;
  const start=selected?.initial.kind==='owned'&&currentStage>=0?Math.min(currentStage,selectedStage):selectedStage;
  const ancestors=route.slice(1,start<0?undefined:start+1).reverse();
  const earlier=(await Promise.all(ancestors.map(id=>pack?.mons.find(m=>m[0]===id)).filter(Boolean).map(m=>details(m[1],g).catch(()=>null)))).filter(Boolean);
  const learnBefore={},methods={};
  const directlyLegal=new Set(form.legalMoves||[]);
  for(const learner of [...earlier,form])for(const name of learner.legalMoves||[]){
   methods[name]=[...(methods[name]||[]),...(learner.learnMethods?.[name]||[])];
   if(!directlyLegal.has(name))learnBefore[name]=learner.name;
  }
  if(currentStage>=0&&(!selected||selected.initial.kind==='owned')){
   for(const move of (member.moves||[]).map(moveKey).filter(Boolean))methods[move]??=[];
  }
  const target={...form,legalMoves:Object.keys(methods).sort(),learnMethods:methods,learnBefore};
  const trainingRoute=selected?.initial.kind==='owned'&&currentStage>=0&&currentStage<selectedStage?
   {...selected,initial:{...selected.initial,minLevel:member.level}}:selected;
  return {target,moves:await suggestedMoves(form,i,g,false,earlier,trainingRoute)};
 }
 async function applyAcquisitionRoute(select,routeId){
  if(!routeId)return;
  const {td77Route}=select.dataset;
  if(td77Route==='preview'&&manualCandidate){stageCandidate(manualCandidate.name,routeId,{scroll:false});return;}
  const i=chosenSlot,g=state.game,p=state.slots[i],stamp=token;
  if(!p||fulfilledCapture(p))return;
  const route=routeOptions(p).find(row=>row.id===routeId);
  if(!route)return;
  if(p.duringTargetId&&!routeIncludesStage(route,p.duringTargetId))return;
  const edited={...p,acquisitionRoute:routeStore(route)};
  const bound=ownedFor(p,i);
  if(bound&&edited.fulfilledPid!=null&&!eligibleAcquisition(edited,bound)){
   delete edited.fulfilledPid;
   delete edited.fulfilledStage;
  }
  select.disabled=true;
  try{
   const duringName=pack?.mons.find(([id])=>id===p.duringTargetId)?.[1]||route.startName;
   const intermediate=duringName===p.name?p:await details(duringName,g);
   const [final,during]=await Promise.all([
    finalFormMoves(edited,i,g,route),suggestedMoves(intermediate,i,g,true,[],route)
   ]);
   if(stamp!==token||state.slots[i]!==p)return;
   const interim=reviseAutomaticMoves({plannedMoves:p.duringMoves,finalManualSlots:p.duringManualSlots},during,p.duringAutoMoves);
   const learnset=learnsetFor(final.target);
   state.slots[i]={...edited,...reviseAutomaticMoves(p,final.moves),duringSpecies:intermediate.name,
    duringMoves:interim.plannedMoves,duringAutoMoves:interim.finalAutoMoves,
    finalLearnset:learnset};
   persist();render();
   if(i===chosenSlot&&!$('td4Edit').hidden){
    renderMoveSlots();
    if(settings.open&&manualCandidate?.confirmed)restoreConfirmedPreview();
    else $('td77SlotRoute').querySelector('.td78-route-picker > summary')?.focus({preventScroll:true});
   }
   refreshMoveInfo();
  }catch{if(stamp===token&&state.slots[i]===p){say('Acquisition route could not be updated.');renderMoveSlots();}}
 }
 page.addEventListener('click',e=>{
  const select=e.target.closest('button[data-td77-route]');
  if(select)applyAcquisitionRoute(select,select.dataset.routeId);
 });
 page.addEventListener('change',e=>{
  const select=e.target.closest('select[data-td77-route]');
  if(select)applyAcquisitionRoute(select,select.value);
 });
 function renderOwnedChoices(p){
  const assigned=ownedAssignments(),party=actual()?.pokemon||[];
  $('td78AddOwned').innerHTML=p?'':party.flatMap((member,index)=>member&&!assigned.includes(index)?
   [`<button type="button" class="td774-secondary" data-td78-add-owned="${index}">Use ${safe(td41PokemonLabel(member.name))}${member.level?' · Lv. '+member.level:''} · Party ${index+1}</button>`]:[]).join('');
 }
 $('td78AddOwned').addEventListener('click',async event=>{
  const button=event.target.closest('[data-td78-add-owned]');
  if(!button||state.approved)return;
  const i=chosenSlot,index=Number(button.dataset.td78AddOwned),team=actual(),member=team?.pokemon[index];
  const view=movesetView,stamp=token;
  if(!member||state.slots[i]||ownedAssignments().includes(index))return;
  const matching=team.pokemon.filter(p=>p&&(member.saveStats?.pid!=null?p.saveStats?.pid===member.saveStats.pid:
   td73IdentityKey(p)===td73IdentityKey(member)));
  if(matching.length>1&&!await td78Confirmation('Use '+td41PokemonLabel(member.name)+' from party slot '+(index+1)+'?',
   'More than one party Pokémon has this identity.','Use Pokémon'))return;
  if(stamp!==token||movesetView!==view||chosenSlot!==i||state.slots[i]||actual()?.pokemon[index]!==member)return;
  const plan=fromTeam(member,index);
  delete plan.autoOwnedPending;
  plan.explicitOwned=true;
  plan.duringSpecies=plan.name;
  plan.duringMoves=plan.plannedMoves.map(move=>({...move}));
  if(view==='during'||state.independentSlots?.[i]){
   const stages=state.independentSlots?.[i];
   separateStages(i,view==='during'?plan:stages?.during??null,view==='final'?plan:stages?.final??null);
  }else state.slots[i]=plan;
  persist();render();renderMoveSlots();refreshMoveInfo();hydrate(false);
 });
 async function removePlannedStage(){
  const i=chosenSlot,stamp=token,view=movesetView,plan=state.slots[i];
  if(!plan||plan.locked||state.approved)return;
  const name=view==='during'?duringSpecies(plan,i):plan.name;
  if(!await td78Confirmation('Remove '+td41PokemonLabel(name)+' from '+(view==='during'?'During game':'Final')+'?',
   'This removes the Pokémon and its moves from this planned stage.','Remove'))return;
  if(stamp!==token||chosenSlot!==i||view!==movesetView||state.slots[i]!==plan||plan.locked)return;
  captureStage();
  const stages=state.independentSlots?.[i];
  if(stages){
   separateStages(i,view==='during'?null:stages.during,view==='final'?null:stages.final);
   if(!state.independentSlots[i].during&&!state.independentSlots[i].final)delete state.independentSlots[i];
  }else{
   separateStages(i,view==='final'?plan:null,view==='during'?plan:null);
  }
  ++rankRun;++selectionRun;++manualRun;manualCandidate=null;
  $('td63ManualCandidate').innerHTML='';$('td4Search').value='';$('td4SearchResults').hidden=true;
  settings.open=true;persist();render();renderMoveSlots();findCandidates();refreshMoveInfo();
 }
 page.addEventListener('click',event=>{
  if(event.target.closest('[data-td78-remove-stage]'))removePlannedStage();
  if(event.target.closest('[data-td79-keep-during]')&&movesetView==='final'&&!state.slots[chosenSlot]){
   const during=state.independentSlots?.[chosenSlot]?.during;
   if(during)choose(during.duringSpecies||during.name,null,undefined,during);
  }
 });
 function renderMoveSlots(){
 const host=$('td41MoveSlots'),{active:p,other,member:a}=stageDisplay(chosenSlot);
 const fallback=!p&&(other||a);
 const locked=!!p?.locked;
 $('td77Lock').disabled=!p||state.approved;
 $('td78RemovePlan').hidden=false;
 $('td78RemovePlan').disabled=!p||locked||state.approved;
 renderOwnedChoices(p);
 $('td77Legendary').closest('label').hidden=locked;
 $('td4Search').closest('.td77-candidate-search').hidden=locked;
 const lockMessage=$('td775ReplacementLocked');
 lockMessage.hidden=!locked;
 lockMessage.innerHTML=locked?plannerLockIcon('td774-lock-status')+' Replacement locked':'';
 if(locked)closeTypeFilter();
 renderFinalFormChoice(p);
 $('td77Lock').hidden=false;
 $('td77Lock').textContent=locked?'Unlock':'Lock';
 $('td77Lock').setAttribute('aria-pressed',String(!!p?.locked));
 $('td72MoveHeading').hidden=!p&&!fallback;
 $('td4Clear').hidden=false;
 $('td4Clear').disabled=!p||state.approved||locked||!displayedMoves(p).some(move=>move?.move||goal(move));
 refreshAcquisition();
 $('td5TeamOptimize').hidden=!p;
 if(!p){
  if(fallback)$('td72MoveTitle').textContent=td41PokemonLabel(fallback.name)+' · Moveset progression';
  host.innerHTML=movesetView==='final'&&other?`<button type="button" class="td774-secondary" data-td79-keep-during>Keep ${safe(td41PokemonLabel(other.duringSpecies||other.name))}</button>`:'';
  return;
 }
 const display=movesetView==='during'?duringLearner(p,chosenSlot):p;$('td72MoveTitle').textContent=(a&&!sameMon(a,display)?td41PokemonLabel(a.name)+' → ':'')+td41PokemonLabel(display.name)+' · Moveset progression';p.plannedMoves=moveSlots(p);
 if(movesetView==='during'){
  p.duringMoves=moveSlots({plannedMoves:p.duringMoves??moveSlots(p).map(m=>({...m,purpose:'keep',replacement:''}))});
  const species=duringSpecies(p,chosenSlot);
  if(species!==p.name&&!records.has(state.game+':'+species)){
   const g=state.game;details(species,g).then(()=>{if(state?.game===g&&state.slots[chosenSlot]===p&&movesetView==='during'){render();renderMoveSlots();}}).catch(()=>{});
  }
  host.innerHTML='<div class="td42-move-labels"><small>Actual</small><small>During game</small></div>'+(species!==p.name?'<small>'+safe(pretty(species))+' learnset</small>':'')+(p.duringAutoMoves&&p.duringMoves.every((m,i)=>!m.move||finalMoveStamp(m)===p.duringAutoMoves[i])&&p.duringMoves.some(m=>!m.move)?
   '<small class="note">Some slots are open because no additional verified move fits this stage.</small>':'')+ownershipReview()+alignedMoves(p,chosenSlot).map(row=>{
   const stage=duringLearner(p,chosenSlot),name=goal(row.move);
   return `<div class="td41-move-row" ${moveRowAttributes(row)}>${editableMoveCard(stage,row.from,name,row.index,true,row.retained)}${moveTimingMarkup(stage,name)}</div>`;
  }).join('');
  if(!$('td5TeamProposals').hidden)optimizeTeam();
  return;
 }
 const final=finalLearner(p),route=chosenRoute(p);
 const theoretical=route&&!routeFits(route)?'<small class="td41-warn">Theoretical Final moves · '+safe(routeRestriction(route))+'</small>':'';
 const known=Array.isArray(final.legalMoves);host.innerHTML=`<div class="td42-move-labels"><small>Actual</small><small>Final</small></div>${theoretical}${ownershipReview()}${known?'':'<small class="note">Move compatibility loading / unavailable.</small>'}${alignedMoves(p,chosenSlot).map(row=>`<div class="td41-move-row" ${moveRowAttributes(row)}>
 <div data-td42-preview="${row.index}">${movePreview(final,row)}${retainedChoiceNotice(final,row.move,row.retained)}</div></div>`).join('')}`;if(!$('td5TeamProposals').hidden)optimizeTeam();}

 function closeMoveSuggestions(){
  $('td5TeamOptimize').open=false;
  $('td5TeamProposals').hidden=true;
 }
 $('td5TeamOptimize').addEventListener('toggle',()=>{
  const open=$('td5TeamOptimize').open;
  $('td5TeamProposals').hidden=!open;
  if(open)optimizeTeam();
 });
 let suggestedMoveProposals=[];
 function optimizeTeam(){
  const result=moveRecommendations(chosenSlot),host=$('td5TeamProposals');
  suggestedMoveProposals=result.proposals;
  host.innerHTML=!result.ready?'Evaluating Pokémon moves…':result.proposals.length?
   `<h4>Recommended upgrades</h4><div class="td5-proposal-list">${result.proposals.map((r,i)=>
    `<div class="td64-alternative"><span class="td44-trade-head">${moveChip(r.prev)}<span>→</span>${moveChip(r.name)}</span>
    ${moveTradeoff(info(r.prev),info(r.name),r.added,r.lost)}<small>${td77AcquisitionLinks(r.timing,state.game)}</small>
    <button type="button" class="td774-secondary" data-td64-alt="${i}">Select ${safe(pretty(r.name))}</button></div>`).join('')}</div>`:
   'No verified move upgrade for this deadline.';
 }
 $('td5TeamProposals').addEventListener('click',e=>{
  const button=e.target.closest('[data-td64-alt]');
  if(button)applyMoveImprovement(suggestedMoveProposals[+button.dataset.td64Alt],{fromSlot:true});
 });
 async function applyMoveImprovement(r,{fromSlot=false}={}){
  if(!r||r.view!==movesetView||state.slots[r.i]!==r.p||(fromSlot?r.i!==chosenSlot:r.p.locked))return;
  const planned=displayedMoves(r.p),move=planned[r.j];
  if(goal(move)!==r.prev||!moveRecommendations(fromSlot?r.i:null).proposals.some(p=>p.i===r.i&&p.j===r.j&&p.name===r.name))return;
  const loss=r.lost.length?' Loses coverage against '+r.lost.map(pretty).join(', ')+'.':'';
  if(!await td78Confirmation((r.prev?'Replace '+pretty(r.prev)+' with ':'Add ')+pretty(r.name)+'?',td41PokemonLabel(r.p.name)+loss,'Apply')||state.slots[r.i]!==r.p||planned[r.j]!==move||movesetView!==r.view)return;
  const current=move.move;
  const temporary=r.view==='final'&&current&&current!==r.name&&!r.known&&
   !planned.some((entry,j)=>j!==r.j&&goal(entry)===current);
  const updated=temporary?{...move,purpose:'temporary',replacement:r.name}:
   {move:r.name,purpose:'keep',replacement:''};
  planned[r.j]=moveSlots({plannedMoves:[{...updated,reminderFor:r.reminder?r.name:''}]})[0];
  const manual=r.view==='during'?'duringManualSlots':'finalManualSlots';
  (r.p[manual]??=[])[r.j]=true;
  delete r.p.autoOwnedPending;
  persist();render();if(!$('td4Edit').hidden)renderMoveSlots();refreshMoveInfo();
 }
 const proposalLoads=new Set(),proposalAttempts=new Set();
 function loadProposalData(g,stages,names){
  const pending=names.filter(name=>!info(name)&&!proposalAttempts.has(g+':move:'+name));
  const missing=stages.filter(name=>!records.has(g+':'+name)&&!proposalAttempts.has(g+':stage:'+name));
  if(!pending.length&&!missing.length)return;
  for(const key of [...pending.map(name=>g+':move:'+name),...missing.map(name=>g+':stage:'+name)]){
   proposalAttempts.add(key);proposalLoads.add(key);
  }
  (async()=>{
   await Promise.all(missing.map(async name=>{await details(name,g).catch(()=>null);proposalLoads.delete(g+':stage:'+name);}));
   for(let offset=0;offset<pending.length;offset+=12){
    await Promise.all(pending.slice(offset,offset+12).map(async name=>{
     const move=await enrichMove({name:pretty(name)},gameGeneration(g),g).catch(()=>null);
     if(move?.damageClass&&move.type)moveInfo.set(g+':'+name,move);
     proposalLoads.delete(g+':move:'+name);
    }));
   }
   if(state?.game!==g||page.hidden)return;
   renderImprovements(metrics(intendedTeam(),g));
   if(!$('td5TeamProposals').hidden)optimizeTeam();
  })();
 }
 function moveRecommendations(onlySlot=null){
  const g=state.game,view=movesetView,during=view==='during',now=window.td62Progress.rank(effectiveProgress())??0;
  const observed=window.td62Progress.rank(effectiveProgress());
  const configured=state.stageDeadlines?.during??state.deadline;
  const deadline=during&&!configured&&observed!=null?Math.min(deadlineRank()??9,observed+1):deadlineRank()??9;
  const data=window.takDexAcquisitionV77;
  const names=new Set(),missing=new Set(),plans=[];
  const getStage=(p,name)=>records.get(g+':'+name)||(name===p.name&&p.legalMoves?p:null);
  for(const [i,p] of state.slots.entries()){
   if(!p)continue;
   const route=routeForLearner(chosenRoute(p,true,i),during?duringLearner(p,i):p,during),member=ownedFor(p,i);
   if(!route&&(p.acquisitionRoute||!sameMon(member,p)&&!acquisition(p,false).confirmed))continue;
   if(route&&(!routeFits(route)||route.initial.rank>deadline))continue;
   const stages=during?[duringSpecies(p,i)]:route?[route.startName,...route.steps.map(step=>step.name)]:[p.name];
   if(stages.length>1&&member&&route?.initial.kind==='owned'){
    const current=stages.indexOf(moveKey(member.name));
    if(current>0)stages.splice(0,current);
   }
   const learners=stages.map(name=>getStage(p,name));
   if(learners.some(stage=>!stage)){
    stages.filter((_,index)=>!learners[index]).forEach(name=>missing.add(name));continue;
   }
   const learner=learners.at(-1);
   const pool=collectMoveRoutes(learner,i,g,during,learners.slice(0,-1),route,deadline);
   if(!pool)continue;
   pool.routes.forEach((_,name)=>names.add(name));
   const moves=displayedMoves(p);
   plans.push({i,p,learner,moves,pool,route});
  }
  loadProposalData(g,[...missing],[...names]);
  const pending=[...names].some(name=>proposalLoads.has(g+':move:'+name))||[...missing].some(name=>proposalLoads.has(g+':stage:'+name));
  if(pending)return {ready:false,proposals:[]};
  const teamMoves=plans.map(({moves,pool,learner,i})=>moves.map(move=>goal(move)).filter(name=>pool.routes.has(name))
   .map(name=>({name,mon:td5Attacker(learner,i),slot:i})));
  const proposals=[],assignedHm=new Set(activeMoves().filter(name=>hms(g).includes(name)));
  for(const [index,{i,p,learner,moves,pool,route}] of plans.entries()){
   if(p.locked||onlySlot!=null&&i!==onlySlot)continue;
   const others=teamMoves.flatMap((rows,j)=>index===j?[]:rows),used=new Set(moves.map(goal).filter(Boolean));
   let best,fill;
   for(const [j,move] of moves.entries()){
    const prev=goal(move);
    if(hms(g).includes(prev)||hms(g).includes(move.move))continue;
    const existing=moves.filter((_,k)=>k!==j).map(goal).filter(n=>pool.routes.has(n));
    const own=existing.map(name=>({name}));
    for(const [name,options] of pool.routes){
     if(used.has(name)||!info(name))continue;
     const evaluation=rateMoveChange(learner,i,prev,name,own,others,g);
     const merit=td5Merit(info(name),learner,i,g),oldMerit=td5Merit(info(prev),learner,i,g);
     const required=during&&evaluation?.utility&&!assignedHm.has(name)&&hmPurpose(g,name).startsWith('Story required')&&
      !window.td62Progress.hm(g,name,effectiveProgress())?.used;
     if(!evaluation||!merit&&!required)continue;
     if(hms(g).includes(name)&&!required&&(!merit||merit<oldMerit||evaluation.score<=(evaluation.utility?3:0)))continue;
     const choices=[options,...existing.map(n=>pool.routes.get(n))];
     const scheduled=data.scheduleEvolutionMoves(pool.stageMinimums,pool.startingLevel,pool.practicalLevel,choices)?.[0];
     if(!scheduled)continue;
     const stage=pool.stages[scheduled.stage];
     const gate=Math.max(scheduled.timing?.rank||0,route?.initial.rank||0);
     const score=evaluation.score-(evaluation.utility&&!required?3:0)-(during&&observed!=null&&gate>now?.5:0)-(prev?.35:0)+(!prev&&merit?merit/40:0);
     const threshold=prev?1.25:.5;
     const incumbent=prev?best:fill;
     if(score<threshold||incumbent&&(Number(incumbent.utility)>Number(required)||incumbent.utility===Boolean(required)&&incumbent.score>=score))continue;
     const timing=pool.known.has(name)?'Already known':
      [scheduled.timing?.text||('Level '+scheduled.level),stage.name!==learner.name?'Learn as '+pretty(stage.name)+' before evolving':'',
       route?.initial.rank>now?'Obtain '+pretty(route.startName)+' · '+route.initial.place:''].filter(Boolean).join(' · ');
     const proposal={...evaluation,utility:Boolean(required),score,i,j,p,prev,name,timing,view,known:pool.known.has(name),reminder:scheduled.reminder};
     if(prev)best=proposal;else fill=proposal;
    }
   }
   const selected=fill||best;
   if(selected){
    proposals.push(selected);
    if(selected.utility)assignedHm.add(selected.name);
   }
  }
  return {ready:true,proposals:proposals.sort((a,b)=>Number(Boolean(a.prev))-Number(Boolean(b.prev))||b.score-a.score)};
 }
 function legalOptions(p,i,k,q){
  const during=k==='during',learner=during?duringLearner(p,chosenSlot):finalLearner(p);
  const used=new Set((during?p.duringMoves:p.plannedMoves).map(goal).filter(Boolean));
  const names=new Set(learner.legalMoves||[]);
  if(during)for(const n of finalLearner(p).legalMoves||[])names.add(n);
  return td78SearchMatches([...names].filter(n=>!used.has(n)).sort(),q);
 }
 function canKeepActual(p,index,mode,name){
  const during=mode==='during',learner=during?duringLearner(p,chosenSlot):finalLearner(p);
  const moves=during?p.duringMoves:p.plannedMoves;
  return retainsMove(p,learner,name,chosenSlot)&&!moves.some((move,i)=>i!==index&&goal(move)===name);
 }
 const moveHost=$('td41MoveSlots');
 const moveFilters=new WeakMap();
 const moveClasses=['physical','special','status'];
 let moveBlurTimer;
 function moveBox(input){return input.closest('.td78-editor-shell').querySelector('.suggestions');}
 function showMoveOptions(input,q='',scroll=0){
  const p=state?.slots[chosenSlot];
  if(!p)return;
  const [index,mode]=input.dataset.td45Move.split(':'),box=moveBox(input);
  const learner=mode==='during'?duringLearner(p,chosenSlot):finalLearner(p);
  const opts=legalOptions(p,+index,mode,q);
  const filter=moveFilters.get(input)||{open:false,types:new Set(),classes:new Set()};
  moveFilters.set(input,filter);
  const count=filter.types.size+filter.classes.size;
  input.closest('.td78-editor-shell').querySelector('.td78-move-badges').innerHTML=td78FilterBadges(filter.types,filter.classes);
  input.closest('.td77-edit-move').querySelector('[data-td78-open-move]').setAttribute('aria-expanded','true');
  const funnel=input.closest('.td78-editor-search').querySelector('.td772-filter-button');
  funnel.classList.toggle('selected',count>0);
  funnel.setAttribute('aria-expanded',String(filter.open));
  const classes=moveClasses.map(value=>`<button type="button" class="td774-secondary" data-td78-move-class="${value}" aria-pressed="${filter.classes.has(value)}">${pretty(value)}</button>`).join('');
  const filterPanel=`<div class="td772-filter-panel td78-move-filter-panel" id="td78MoveFilterPanel-${index}" ${filter.open?'':'hidden'}>
   ${td78FilterHeader(count)}<div class="td72-move-types" role="group" aria-label="Move type">${td77TypeTiles(gameGeneration(state.game),'data-td78-move-type',type=>filter.types.has(type))}</div>
   <div class="td78-move-classes" role="group" aria-label="Move category">${classes}</div></div>`;
  const old=input.closest('[data-td77-actual-move]')?.dataset.td77ActualMove;
  const selected=goal((mode==='during'?p.duringMoves:p.plannedMoves)[+index]);
  const timing=selected&&plannerMoveTiming(learner,selected);
  const action=(name,attributes,path)=>`<button type="button" ${attributes}><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${path}"/></svg>${name}</button>`;
  const keep=action('Keep',canKeepActual(p,+index,mode,old)?`data-td45-restore="${safe(old)}"`:'disabled','M3 12a9 9 0 1 1 3 7 M3 5v7h7');
  const clear=action('Clear',selected?'data-td77-clear-move aria-label="Clear planned move"':'disabled','m6 6 12 12 M18 6 6 18');
  const checker=action('Checker',selected?`data-td77-plan-move="${safe(selected)}" data-td77-reminder="${safe(timing?.text||'')}"`:'disabled','M13 5h6v6 M19 5l-8 8 M19 13v6H5V5h6');
  const close=action('Close','data-td79-close-move','m5 12 4 4L19 6');
  const render=(n,move)=>move?td77MoveResultLines({...move,name:n},''):'<strong></strong>';
  box.innerHTML=filterPanel+`<div class="td78-move-actions">${keep}${clear}${checker}${close}</div><strong>Available moves</strong><div class="td78-move-results"></div>`;
  box.hidden=false;
  const game=state.game,list=box.querySelector('.td78-move-results');
  const display=()=>{
   const names=opts.filter(name=>{
    const move=info(name);
    return (!filter.types.size||filter.types.has(move?.type))&&(!filter.classes.size||filter.classes.has(move?.damageClass));
   });
   list.innerHTML=names.map(n=>{
    const learned=learner.legalMoves?.includes(n);
    const timing=learned?plannerMoveTiming(learner,n):null;
    return `<div class="td79-move-choice">
     <button type="button" class="td78-suggestion-name" data-td77-plan-move="${safe(n)}" data-td77-reminder="${safe(timing?.text||'')}" aria-label="Open ${safe(pretty(n))} in Move Checker">${safe(pretty(n))}</button>
     <button type="button" class="td77-move-option" data-td45-pick="${safe(n)}" aria-label="Select ${safe(pretty(n))}"><span class="td77-move-result-lines">${render(n,info(n))}</span></button>
     ${learned?moveTimingMarkup(learner,n):'<small>Learn on a later planned form</small>'}</div>`;
   }).join('')+(names.length?'':'<p class="note">No compatible moves</p>');
   list.scrollTop=scroll;
  };
  const load=async name=>{
   const move=await enrichMove({name:pretty(name)},gameGeneration(game),game).catch(()=>null);
   if(move?.type)moveInfo.set(game+':'+name,move);
   return move;
  };
  box.moveObserver?.disconnect();
  if(count){
   const missing=opts.filter(name=>!info(name)?.damageClass);
   if(!missing.length){display();return;}
   list.innerHTML='<p class="note" role="status">Checking move details…</p>';
   (async()=>{
    for(let i=0;i<missing.length&&list.isConnected&&!box.hidden;i+=8){
     await Promise.all(missing.slice(i,i+8).map(load));
    }
    if(list.isConnected&&!box.hidden)display();
   })();
   return;
  }
  display();
  const observer=new IntersectionObserver(entries=>{
   for(const {target,isIntersecting} of entries){
    if(!isIntersecting)continue;
    observer.unobserve(target);
    const name=target.dataset.td45Pick;
    load(name).then(move=>{
     if(move?.type&&target.isConnected)target.firstElementChild.innerHTML=render(name,move);
    });
   }
  },{root:list});
  box.moveObserver=observer;
  for(const button of list.querySelectorAll('[data-td45-pick]'))if(!info(button.dataset.td45Pick))observer.observe(button);
 }

 moveHost.addEventListener('focusin',e=>{
  if(!e.target.matches('[data-td45-move]'))return;
  if(moveBox(e.target).hidden)showMoveOptions(e.target);
 });
 moveHost.addEventListener('click',async e=>{
  const option=e.target.closest('.td79-move-choice');
  if(option&&!e.target.closest('button,a,summary,details')){
   option.querySelector('[data-td45-pick]').click();
   return;
  }
  const filterButton=e.target.closest('.td772-filter-button,[data-td78-move-type],[data-td78-move-class],[data-td78-clear-filters],[data-td78-filter-value]');
  if(filterButton){
   const input=filterButton.closest('.td77-edit-move').querySelector('input');
   const filter=moveFilters.get(input);
   if(!filter)return;
   const {td78MoveType:type,td78MoveClass:damageClass}=filterButton.dataset;
   if(filterButton.hasAttribute('data-td78-clear-filters')){
    filter.types.clear();filter.classes.clear();showMoveOptions(input,clean(input.value));
    input.closest('.td78-editor-search').querySelector('.td772-filter-button').focus({preventScroll:true});return;
   }
   const removed=filterButton.dataset.td78FilterValue;
   if(removed){
    (filterButton.dataset.td78FilterGroup==='type'?filter.types:filter.classes).delete(removed);
    showMoveOptions(input,clean(input.value));
    input.closest('.td78-editor-search').querySelector('.td772-filter-button').focus({preventScroll:true});return;
   }
   if(type||damageClass){
    const values=type?filter.types:filter.classes,key=type||damageClass;
    if(values.has(key))values.delete(key);else values.add(key);
   }
   else {
    filter.open=!filter.open;
    moveBox(input).querySelector('.td78-move-filter-panel').hidden=!filter.open;
    filterButton.setAttribute('aria-expanded',String(filter.open));
    filterButton.classList.toggle('selected',Boolean(filter.types.size||filter.classes.size));
    return;
   }
   showMoveOptions(input,clean(input.value));
   const attribute=type?'data-td78-move-type':'data-td78-move-class';
   moveBox(input).querySelector(`[${attribute}="${type||damageClass}"]`)?.focus({preventScroll:true});
   return;
  }
  const trigger=e.target.closest('[data-td78-open-move]');
  if(trigger){
   const field=trigger.closest('.td77-edit-move').querySelector('input'),wasOpen=!moveBox(field).hidden;
   for(const other of moveHost.querySelectorAll('.suggestions:not([hidden])')){
    other.hidden=true;
    other.closest('.td77-edit-move').querySelector('[data-td78-open-move]').setAttribute('aria-expanded','false');
   }
   if(wasOpen){trigger.setAttribute('aria-expanded','false');return;}
   field.value='';showMoveOptions(field);
   const shell=field.closest('.td78-editor-shell');
   if(shell.getBoundingClientRect().bottom>window.innerHeight-72)shell.scrollIntoView({block:'nearest'});
   return;
  }
  const input=e.target.closest('[data-td45-move]');
  if(input&&moveBox(input).hidden)showMoveOptions(input);
  const close=e.target.closest('[data-td79-close-move]');
  if(close){
   const editor=close.closest('.td77-edit-move');
   editor.querySelector('.suggestions').hidden=true;
   const toggle=editor.querySelector('[data-td78-open-move]');
   toggle.setAttribute('aria-expanded','false');toggle.focus({preventScroll:true});
   return;
  }
  const clear=e.target.closest('[data-td77-clear-move],[data-td77-clear-plan]');
  if(clear){
   const field=clear.closest('.search').querySelector('input');
   const [index,mode]=field.dataset.td45Move.split(':');
   const p=state.slots[chosenSlot];
   const name=goal((mode==='during'?p.duringMoves:p.plannedMoves)[+index]);
   if(!name)return;
   if(!await td78Confirmation('Clear '+pretty(name)+'?','This clears the move from the '+(mode==='during'?'During game':'Final')+' slot.','Clear')){clear.focus({preventScroll:true});return;}
   if(!field.isConnected||state.slots[chosenSlot]!==p)return;
   if(mode==='during'){applyDuring(field,'');return;}
   const i=Number(index);
   p.plannedMoves[i]={move:'',purpose:'keep',replacement:''};
   (p.finalManualSlots??=[])[i]=true;
   delete p.autoOwnedPending;
   persist();render();renderMoveSlots();refreshMoveInfo();
  }
 });
 moveHost.addEventListener('input',e=>{
  if(e.target.matches('[data-td45-move]')){showMoveOptions(e.target,clean(e.target.value));}
 });
 moveHost.addEventListener('keydown',e=>{
  const input=e.target.closest('.td77-edit-move')?.querySelector('[data-td45-move]');
  if(!input?.matches('[data-td45-move]'))return;
  const box=moveBox(input);
  if(e.key==='Escape'){
   const funnel=input.closest('.td78-editor-search').querySelector('.td772-filter-button');
   if(moveFilters.get(input)?.open){
    e.preventDefault();funnel.click();funnel.focus({preventScroll:true});return;
   }
   box.hidden=true;
   const toggle=input.closest('.td77-edit-move').querySelector('[data-td78-open-move]');
   toggle?.setAttribute('aria-expanded','false');toggle?.focus({preventScroll:true});
   return;
  }
  if(e.key==='Enter'&&e.target===input&&!box.hidden){e.preventDefault();box.querySelector('.td78-move-results [data-td45-pick]')?.click();}
  if(!['ArrowDown','ArrowUp'].includes(e.key)||e.target!==input&&!e.target.matches('[data-td45-pick]'))return;
  e.preventDefault();
  if(box.hidden)showMoveOptions(input);
  const options=[...box.querySelectorAll('[data-td45-pick]')],current=options.indexOf(document.activeElement);
  const next=current+(e.key==='ArrowDown'?1:-1);
  options[Math.max(0,Math.min(next,options.length-1))]?.focus();
 });
 moveHost.addEventListener('focusout',e=>{
  const container=e.target.closest('.search');
  if(!container||checkerEditor||$('td78Confirmation')||container.contains(e.relatedTarget))return;
  const input=container.querySelector('[data-td45-move]');
  if(!input)return;
  const box=moveBox(input),contents=box.firstElementChild;
  clearTimeout(moveBlurTimer);
  moveBlurTimer=setTimeout(()=>{
   if(checkerEditor||$('td78Confirmation')||contents!==box.firstElementChild||!input.isConnected||container.contains(document.activeElement))return;
   box.hidden=true;container.querySelector('[data-td78-open-move]')?.setAttribute('aria-expanded','false');box.moveObserver?.disconnect();
   const [i,k]=input.dataset.td45Move.split(':'),p=state?.slots[chosenSlot];
   const m=k==='during'?p?.duringMoves[+i]:p?.plannedMoves[+i];
   if(m)input.value=pretty(k==='goal'?goal(m):m.move);
  },150);
 });
 page.addEventListener('pointerdown',e=>{if(!$('td78Confirmation')&&!e.target.closest('.td77-edit-move,[data-td77-plan-move]'))for(const box of moveHost.querySelectorAll('.suggestions:not([hidden])')){
  box.hidden=true;
  box.closest('.td77-edit-move').querySelector('[data-td78-open-move]')?.setAttribute('aria-expanded','false');
 }});
 function applyDuring(input,name,retained=false){
  const p=state.slots[chosenSlot],i=Number(input.dataset.td77During);
  if(!p?.duringMoves||name&&!retained&&!legalOptions(p,i,'during',name).includes(name))return;
  p.duringMoves[i]={move:name,purpose:'keep',replacement:''};
  (p.duringManualSlots??=[])[i]=true;delete p.autoOwnedPending;
  if(p.duringAutoMoves)p.duringAutoMoves[i]='';
  persist();render();renderMoveSlots();if(settings.open)findCandidates();refreshMoveInfo();
 }
 moveHost.addEventListener('click',async e=>{const b=e.target.closest('[data-td45-pick],[data-td45-restore]'),p=state?.slots[chosenSlot];if(!b||!p)return;e.preventDefault();const input=b.closest('.td45-move-search').querySelector('input'),[i,k]=input.dataset.td45Move.split(':'),n=b.dataset.td45Pick||b.dataset.td45Restore,m=p.plannedMoves[+i];if(b.hasAttribute('data-td45-restore')){
  const actualMove=input.closest('[data-td77-actual-move]')?.dataset.td77ActualMove;
  if(n!==actualMove||!canKeepActual(p,+i,k,n))return;
  const previous=goal((k==='during'?p.duringMoves:p.plannedMoves)[+i]);
  if(!await td78Confirmation(previous&&previous!==n?'Replace '+pretty(previous)+' with '+pretty(n)+'?':'Keep '+pretty(n)+'?','','Keep')){b.focus({preventScroll:true});return;}
  if(!input.isConnected||state.slots[chosenSlot]!==p||!canKeepActual(p,+i,k,n))return;
  if(k==='during'){applyDuring(input,n,true);return;}
  p.plannedMoves[+i]={move:n,purpose:'keep',replacement:''};
  (p.finalManualSlots??=[])[+i]=true;delete p.autoOwnedPending;
  if(p.finalAutoMoves)p.finalAutoMoves[+i]='';
  persist();render();renderMoveSlots();refreshMoveInfo();return;
 }
 const index=+i,slot=chosenSlot,g=state.game,stamp=token,during=k==='during';
 const moves=during?p.duringMoves:p.plannedMoves,selected=moves[index],prev=goal(selected);
 const valid=()=>input.isConnected&&stamp===token&&slot===chosenSlot&&state.slots[slot]===p&&
  moves[index]===selected&&goal(selected)===prev&&legalOptions(p,index,k,n).includes(n);
 if(!valid())return;
 if(prev){
  const relevant=new Set([n,prev,...activeMoves()]);
  await Promise.all([...relevant].filter(name=>!info(name)).map(async name=>{
   const value=await enrichMove({name:pretty(name)},gameGeneration(g),g).catch(()=>null);
   if(value?.type&&value.damageClass)moveInfo.set(g+':'+name,value);
  }));
  if(!valid())return;
  const learner=during?duringLearner(p,slot):finalLearner(p);
  const reasons=downgradeReasons(learner,slot,prev,n,moves.filter((_,j)=>j!==index).map(goal).filter(Boolean),g);
  if(reasons.length&&!await td78Confirmation(pretty(prev)+' → '+pretty(n),reasons.join('\n'),'Replace'))return;
 }
 if(!valid())return;
 if(during){applyDuring(input,n);return;}
 if(selected.purpose==='temporary'&&selected.move!==n&&p.duringMoves?.some(move=>goal(move)===selected.move)){
  selected.replacement=n;delete selected.warningFrom;delete selected.warningTarget;
 }else moves[index]={move:n,purpose:'keep',replacement:''};
 (p.finalManualSlots??=[])[index]=true;
 delete p.autoOwnedPending;
 if(p.finalAutoMoves)p.finalAutoMoves[index]='';
 persist();render();renderMoveSlots();if(settings.open)findCandidates();refreshMoveInfo();
 });
 $('td4HM').addEventListener('click',e=>{const b=e.target.closest('[data-td41-carrier]');if(!b)return;if($('td4Edit').hidden||chosenSlot!==Number(b.dataset.td41Carrier))$('td4Slots').querySelector(`[data-td4-slot="${Number(b.dataset.td41Carrier)}"]`)?.click();$('td41MoveSlots').scrollIntoView({block:'start'});});

 async function refreshLeagueInfo(){const g=state.game,stamp=token;const missing=[...new Set(leagueTargets(g).flatMap(t=>t.rows.filter(r=>!r.types?.length||!r.id||clean(r.name)==='jellicent').map(r=>clean(r.name))))];for(let i=0;i<missing.length;i+=6){if(stamp!==token)return;await Promise.all(missing.slice(i,i+6).map(async n=>{try{const d=await details(n,g);leagueInfo.set(g+':'+n,d)}catch{}}));}if(stamp===token&&state?.game===g&&!$('td41MoveSlots').contains(document.activeElement))render();}
 async function optimizeOwnedPlans(stamp){
  const game=state.game;
  for(const [i,p] of state.slots.entries()){
   if(stamp!==token)return;
   if(!p||p.locked)continue;
   const member=ownedFor(p,i);
   if(!member||!sameMon(member,p)||!p.autoOwnedPending)continue;
   const route=chosenRoute(p);
   const party=actual()?.pokemon;
   const original=[JSON.stringify(p.plannedMoves),JSON.stringify(p.duringMoves)];
   const [final,during]=await Promise.all([suggestedMoves(p,i,game,false,[],route),suggestedMoves(p,i,game,true,[],route)]);
   if(stamp!==token||actual()?.pokemon!==party||state.slots[i]!==p||p.locked||original[0]!==JSON.stringify(p.plannedMoves)||original[1]!==JSON.stringify(p.duringMoves))continue;
   if(!final.some(goal)&&!during.some(goal))continue;
   p.plannedMoves=final;p.duringMoves=during;p.finalAutoMoves=final.map(finalMoveStamp);p.duringAutoMoves=during.map(finalMoveStamp);
   delete p.autoOwnedPending;
   persist();
   if(!page.hidden&&!$('td41MoveSlots').contains(document.activeElement)){render();if(!$('td4Edit').hidden&&chosenSlot===i)renderMoveSlots();}
  }
  if(stamp===token)refreshMoveInfo();
 }
 async function hydrate(initialPlan){
  const my=token,g=state.game;
  try{
   const nextPack=await window.takDexEncounterV55.get(g,msg=>{if(my===token)say(msg)});
   if(my!==token)return;
   pack=nextPack;reconcileOwnership();say('');render();refreshLeagueInfo();
  }catch{if(my===token)say('Game acquisition records unavailable.');}
  if(my!==token)return;
  await Promise.all(state.slots.map(async(p,i)=>{
   if(!p)return;
   const route=chosenRoute(p,true,i);
   const stages=new Set([p.name,p.duringSpecies,route?.startName,...(route?.steps||[]).map(step=>step.name)]);
   await Promise.all([...stages].filter(Boolean).map(name=>details(name,g).catch(()=>null)));
   const d=records.get(g+':'+p.name);
   if(my===token&&state.slots[i]===p&&d)state.slots[i]={...p,...d};
  }));
  if(my!==token)return;
  persist();render();if(!$('td4Edit').hidden)renderMoveSlots();
  refreshMoveInfo();if(initialPlan)optimizeOwnedPlans(my).catch(()=>{});
 }
 $('td4Slots').onclick=e=>{const b=e.target.closest('[data-td4-slot]');if(!b||!state.game)return;const next=Number(b.dataset.td4Slot);if(!$('td4Edit').hidden&&next===chosenSlot){delete state.editorSlot;persist();$('td4Edit').hidden=true;++rankRun;placeInlineEditor();return;}++rankRun;improvementType='';chosenSlot=next;state.editorSlot=next;persist();manualCandidate=null;++manualRun;$('td63ManualCandidate').innerHTML='';closeMoveSuggestions();$('td5TeamProposals').innerHTML='';$('td4Edit').querySelector(':scope > .td42-settings').open=!state.slots[next];lookup=state.slots[chosenSlot];ranked=[];$('td4Edit').hidden=false;$('td4Search').value='';$('td4SearchResults').hidden=true;$('td4Candidates').innerHTML='';$('td4CandidateStatus').textContent=state.approved?'Unlock the plan to edit.':'';for(const id of ['td4Search','td4Clear'])$(id).disabled=state.approved;renderMoveSlots();if(!lookup)settings.open=true;placeInlineEditor();if(settings.open)findCandidates();};
 async function stageCandidate(n,routeId,{scroll=true}={}){const stamp=token,run=++manualRun,i=chosenSlot,g=state.game,host=$('td63ManualCandidate');manualCandidate=null;host.textContent='Loading candidate…';try{const d=await details(n,g);if(stamp!==token||run!==manualRun||i!==chosenSlot)return;if(!td7PokemonAllowed(d.name,d.id,g)){host.textContent='Not a species from this game’s generation.';return;}const priorPlan=state.slots[i],baseline=ownedFor(priorPlan,i);
 const activePlan=priorPlan&&movesetView==='during'?duringLearner(priorPlan,i):priorPlan;
 const selected=sameMon(activePlan,d);
 const rows=routeOptions(selected?priorPlan:d);
 const route=rows.find(row=>row.id===(routeId||(selected?priorPlan.acquisitionRoute?.id:'')))||
  (selected&&priorPlan.acquisitionRoute?null:rows.find(row=>routeFits(row))||rows[0]);
 const conflict=ownershipConflict(d,i);
 const familyWarning=state.slots.some((p,slot)=>slot!==i&&p&&redundantFamily(d,p));
 manualCandidate={...d,acquisitionRoute:routeStore(route)||(selected?priorPlan.acquisitionRoute:null),confirmed:selected};
 const previous=selected?baseline:activePlan;
 const prior=previous&&!previous.baseStats&&previous.id!==d.id?
  {...previous,baseStats:(await details(previous.canonicalName||previous.name,g).catch(()=>null))?.baseStats}:previous;
 if(stamp!==token||run!==manualRun||i!==chosenSlot)return;
 const weaknesses=p=>p?typesFor(g).filter(t=>matchup(t,p.types,gameGeneration(g))>1):[];
 const oldWeak=weaknesses(prior),newWeak=weaknesses(d);
 const gains=oldWeak.filter(t=>!newWeak.includes(t)),losses=newWeak.filter(t=>!oldWeak.includes(t));
 const comparison=gains.length||losses.length?`<details class="td773-disclosure td774-comparison"><summary>Comparison details</summary>
  <div class="td774-weak-compare">${[['Weaknesses removed',gains,'td41-good'],['Weaknesses added',losses,'td63-danger']].map(([title,types,tone])=>
   types.length?`<div><small class="${tone}">${title}</small><div class="pills">${types.map(pill).join('')}</div></div>`:'').join('')}</div></details>`:'';
 const endpoints=selected?[]:manualEndpoints(d,route);
 const evolution=endpoints.length?`<div class="td77-candidate-actions td772-evolution-choices"><strong>Evolution options</strong>${endpoints.map(({target,path})=>
  `<div><div class="td774-evolution-choice"><b>${safe(evolutionPath(path))}</b><button type="button" class="td774-secondary" aria-label="Plan ${safe(td41PokemonLabel(target.name))}" data-td77-plan-endpoint="${safe(target.name)}" data-route="${safe(path.id)}">Plan ›</button></div><small>${evolutionRequirements(path)}</small>${routeFits(path)?'':`<small class="td63-danger">${safe(routeRestriction(path))}</small>`}</div>`).join('')}</div>`:'';
 const conflictNotice=conflict&&!selected?`<div class="td77-candidate-actions"><small class="td41-warn">${safe(td41PokemonLabel(conflict.member.name))} is assigned to another team slot.</small><button type="button" data-td77-evolve-slot="${conflict.slot}">Plan evolution in ${safe(td41PokemonLabel(conflict.member.name))}’s slot</button></div>`:'';
 const remove=selected?`<button type="button" class="td774-secondary td78-remove-stage" data-td78-remove-stage ${priorPlan.locked||state.approved?'disabled':''}>Remove</button>`:'';
 const actionLabel=selected?'Selected':endpoints.length?'Keep '+td41PokemonLabel(d.name):conflict&&route?'Obtain another '+td41PokemonLabel(d.name):'Select '+td41PokemonLabel(d.name);
 host.innerHTML=`<div class="td43-candidate" data-td77-preview-context><div class="td43-candidate-pick" tabindex="0">${recommendationHeader(d,activePlan,{action:remove})}</div>${comparison}<div data-td77-preview-route>${routeEditor(selected?priorPlan:manualCandidate,selected?'confirmed':'preview')}</div>${selected?'':coverageDisclosure(i,d)}${conflictNotice}${earlierStage(d,priorPlan)?'<small class="td41-warn">'+safe(td41PokemonLabel(d.name))+' is an earlier evolutionary stage of planned '+safe(td41PokemonLabel(priorPlan.name))+'.</small>':''}${familyWarning?'<small class="td63-danger td77-family-warning">This evolutionary family is already represented in the plan.</small>':''}${evolution} ${selected?'':`<div class="bar td774-preview-actions"><button type="button" data-td63-manual-select ${conflict&&!route?'disabled':''}>${safe(actionLabel)}</button><button type="button" class="td774-secondary" data-td77-cancel-preview>Cancel</button></div>`}</div>`;
 refreshAcquisition();requestAnimationFrame(()=>{if(scroll&&stamp===token&&run===manualRun&&host.isConnected&&!page.hidden)host.scrollIntoView({block:'start'});});}catch{if(stamp===token&&run===manualRun)host.textContent='Pokémon data unavailable.';}}
 function manualEndpoints(start,source){
  return (pack?.mons||[]).filter(([id])=>id!==start.id&&lineage(id).has(start.id)).flatMap(([id,name,types])=>{
   const target={id,name,types},paths=routeOptions(target).filter(path=>path.startId===start.id);
   const path=paths.find(row=>row.id===source?.id)||paths[0];
   return path?[{target,path}]:[];
  }).filter((entry,_,all)=>!all.some(other=>other!==entry&&lineage(other.target.id).has(entry.target.id)));
 }
 function restoreConfirmedPreview(){
  const p=state?.slots[chosenSlot];
  if(p){stageCandidate(movesetView==='during'?duringSpecies(p,chosenSlot):p.name,p.acquisitionRoute?.id,{scroll:false});return;}
  manualCandidate=null;++manualRun;$('td63ManualCandidate').innerHTML='';
 }
 const filterTypes=new Set();
 function matchesTypes(types){return !filterTypes.size||[...filterTypes].some(type=>types?.includes(type));}
 function updateTypeFilter(){
  const host=$('td77TypeOptions');
  const typeButtons=td77TypeTiles(gameGeneration(state.game),'data-td77-filter-type',type=>filterTypes.has(type));
  host.innerHTML='<div class="td72-move-types">'+typeButtons+'</div>';
  td78FilterState($('td77TypeFilter'),host,filterTypes.size);
  $('td77ActiveTypes').innerHTML=td78FilterBadges(filterTypes);
 }
 function applyTypeFilter(){
  updateTypeFilter();findCandidates();
  if($('td4Search').value.trim().length>=2)$('td4Search').dispatchEvent(new Event('input'));
 }
 $('td77TypeOptions').addEventListener('click',event=>{
  if(!event.target.closest('[data-td78-clear-filters]'))return;
  filterTypes.clear();applyTypeFilter();$('td77TypeFilter').focus({preventScroll:true});
 });
 $('td77TypeFilter').onclick=()=>{
  const host=$('td77TypeOptions');
  host.hidden=!host.hidden;
  $('td77TypeFilter').setAttribute('aria-expanded',String(!host.hidden));
  if(!host.hidden)updateTypeFilter();
 };
 function closeTypeFilter(){
  $('td77TypeOptions').hidden=true;
  $('td77TypeFilter').setAttribute('aria-expanded','false');
 }
 page.addEventListener('pointerdown',event=>{
  if(!event.target.closest('.td77-candidate-search'))closeTypeFilter();
 },true);
 $('td77TypeOptions').addEventListener('keydown',event=>{
  if(event.key==='Escape'){closeTypeFilter();$('td77TypeFilter').focus();}
 });
 $('td77ActiveTypes').onclick=e=>{
  const badge=e.target.closest('[data-td78-filter-value]');
  if(!badge)return;
  filterTypes.delete(badge.dataset.td78FilterValue);
  applyTypeFilter();
  $('td77TypeFilter').focus({preventScroll:true});
 };
 $('td77TypeOptions').onclick=e=>{
  const button=e.target.closest('[data-td77-filter-type]');
  if(!button)return;
  const type=button.dataset.td77FilterType;
  if(filterTypes.has(type))filterTypes.delete(type);else filterTypes.add(type);
  applyTypeFilter();
 };
 search($('td4Search'),$('td4SearchResults'),stageCandidate,name=>{
  if(!filterTypes.size)return true;
  const row=pack?.mons?.find(mon=>mon[1]===name);
  return matchesTypes(row?.[2]);
 });$('td4Search').addEventListener('input',()=>{manualCandidate=null;++manualRun;$('td63ManualCandidate').innerHTML='';});$('td4Search').addEventListener('keydown',e=>{if(e.key==='Enter'){const b=$('td4SearchResults').querySelector('[data-value]');if(b&&!$('td4SearchResults').hidden){e.preventDefault();b.click()}}});
 function scrollToAppliedSlot(i,stamp,applied){
  const grid=$('td4Slots'),edit=$('td4Edit');
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
   if(stamp!==token||i!==chosenSlot||state.slots[i]!==applied||page.hidden||edit.hidden)return;
   const selected=grid.querySelector(`[data-td4-slot="${i}"]`);
   if(!selected)return;
   const rowTop=selected.getBoundingClientRect().top;
   const header=document.querySelector('body > header');
   const pinned=header&&['fixed','sticky'].includes(getComputedStyle(header).position);
   const inset=pinned?Math.max(0,header.getBoundingClientRect().bottom):0;
   const gap=parseFloat(getComputedStyle(selected).scrollMarginTop)||8;
   window.scrollTo({top:window.scrollY+rowTop-inset-gap,behavior:'instant'});
  }));
 }
 let selectionRun=0;
 async function choose(n,routeChoice,duringTarget,keptStage=null){
  if(state.approved||!n)return;
  const my=token,i=chosenSlot,run=++selectionRun,g=state.game,view=movesetView;
  const previous=state.slots[i],member=keptStage?matchingIdentity(keptStage,actual()?.pokemon||[]):ownedFor(previous,i);
  const current=()=>my===token&&run===selectionRun&&i===chosenSlot&&!state.approved&&view===movesetView&&
   (!keptStage||state.independentSlots?.[i]?.during===keptStage)&&state.slots[i]?.id===previous?.id&&state.slots[i]?.duringTargetId===previous?.duringTargetId&&
   state.slots[i]?.acquisitionRoute?.id===previous?.acquisitionRoute?.id;
  $('td4SearchResults').hidden=true;
  try{
   const selected=await details(n,g);
   if(!current())return;
   if(!td7PokemonAllowed(selected.name,selected.id,g)){
    $('td4CandidateStatus').textContent='Not a species from this game’s generation.';
    return;
   }
   const selectedLine=lineage(selected.id),previousLine=lineage(previous?.id);
   const family=!!previous&&[...selectedLine].some(id=>previousLine.has(id));
   const stages=state.independentSlots?.[i];
   const independent=Boolean(stages)||view==='during'&&!family||
    !family&&Boolean(previous?.duringTargetId||previous?.explicitOwned);
   const memberStage=member?.id??previous?.fulfilledStage;
   const ownedPath=previous&&memberStage&&previousLine.has(Number(memberStage))&&
    (previous.fulfilledPid!=null||!previous.acquisitionRoute||chosenRoute(previous,true,i)?.initial.kind==='owned');
   const explicitDuring=view==='during'?(duringTarget??selected.id):undefined;
   if(ownedPath&&family&&(!selectedLine.has(Number(memberStage))||
      explicitDuring&&!lineage(explicitDuring).has(Number(memberStage)))){
    say('Choose an evolution of the owned Pokémon.');
    return;
   }
   let target=selected;
   let duringId=family?previous.duringTargetId:undefined;
   if(view==='during'){
    duringId=explicitDuring;
    if(family&&selected.id===duringId&&previousLine.has(duringId))target=previous;
    else if(family&&!previousLine.has(duringId)&&!lineage(duringId).has(previous.id)&&
     !await td78Confirmation('Replace the incompatible Final evolution?', 'Use '+pretty(selected.name)+' during the game. Manual moves stay available for review.','Replace'))return;
   }else if(duringId&&!selectedLine.has(duringId)){
    if(!await td78Confirmation('Clear the incompatible During game evolution?', 'Use '+pretty(selected.name)+' for Final. Manual moves stay available for review.','Replace'))return;
    duringId=undefined;
   }
   if(previous?.locked&&!family&&!await td78Confirmation('Replace this locked Pokémon?','','Replace'))return;
   const routes=routeOptions(target,family,i,keptStage?member:undefined);
   const compatible=routes.filter(path=>!duringId||routeIncludesStage(path,duringId));
   const route=compatible.find(path=>path.id===(routeChoice?.id||keptStage?.acquisitionRoute?.id))||
    compatible.find(path=>path.id===previous?.acquisitionRoute?.id)||
    compatible.find(path=>path.initial.kind!=='link-trade'&&routeFits(path))||
    compatible.find(path=>routeFits(path))||compatible[0];
   if(duringId&&duringId!==target.id&&!route){
    say('No acquisition path supports both planned stages.');
    return;
   }
   const candidate={...target,acquisitionRoute:routeStore(route)};
   const firstStage=pack?.mons.find(([id])=>id===duringId)?.[1]||route?.startName;
   const intermediate=firstStage&&firstStage!==target.name?await details(firstStage,g):target;
   const [result,generated]=await Promise.all([
    finalFormMoves(candidate,i,g,route),suggestedMoves(intermediate,i,g,true,[],route)
   ]);
   if(!current())return;
   const sameFinal=sameMon(previous,target);
   const final=sameFinal?{plannedMoves:previous.plannedMoves,finalAutoMoves:previous.finalAutoMoves}:
    family?reviseAutomaticMoves(previous,result.moves):{plannedMoves:result.moves,finalAutoMoves:result.moves.map(finalMoveStamp)};
   const priorDuring=previous&&duringSpecies(previous,i);
   const during=family&&Array.isArray(previous.duringMoves)&&priorDuring===intermediate.name?
    {plannedMoves:previous.duringMoves,finalAutoMoves:previous.duringAutoMoves}:
    family?reviseAutomaticMoves({
     plannedMoves:previous.duringMoves,finalManualSlots:previous.duringManualSlots
    },generated,previous.duringAutoMoves):{plannedMoves:generated,finalAutoMoves:generated.map(finalMoveStamp)};
   const origin=keptStage||(family?(previous?.originPid!=null||previous?.originName?previous:
    fromTeam(member,actual()?.pokemon?.indexOf(member)??i)):null);
   manualCandidate=null;++manualRun;$('td63ManualCandidate').innerHTML='';closeMoveSuggestions();
   improvementType='';
   const applied={...candidate,...final,confirmedCandidate:true,milestone:previous?.milestone||'',
    milestoneId:previous?.milestoneId||'',temporary:sameFinal?previous.temporary||'':'',
    duringMoves:during.plannedMoves,duringAutoMoves:during.finalAutoMoves,duringSpecies:intermediate.name,duringTargetId:duringId,
    finalLearnset:learnsetFor(result.target),
    finalManualSlots:family?previous.finalManualSlots:undefined,duringManualSlots:family?previous.duringManualSlots:undefined,
    fulfilledPid:family&&previous.fulfilledPid!=null&&lineage(target.id).has(Number(memberStage))?previous.fulfilledPid:undefined,
    originPid:origin?.originPid,originName:origin?.originName,originSlot:origin?.originSlot,explicitOwned:origin?.explicitOwned,locked:family&&!!previous.locked};
   if(applied.fulfilledPid!=null)applied.fulfilledStage=memberStage;
   if(independent){
    captureStage();
    const other=stages?stages[view==='during'?'final':'during']:previous;
    separateStages(i,view==='during'?applied:other,view==='final'?applied:other);
   }else state.slots[i]=applied;
   state.editorSlot=i;reconcileOwnership();persist();
   $('td4Edit').hidden=false;render();$('td4Search').value='';lookup=applied;
   $('td4CandidateStatus').textContent='';renderMoveSlots();refreshMoveInfo();
   if(settings.open)restoreConfirmedPreview();
   findCandidates();scrollToAppliedSlot(i,my,applied);
  }catch{
   if(current())$('td4CandidateStatus').textContent='Pokémon data unavailable.';
  }
 }
 $('td4Clear').onclick=async()=>{
  const i=chosenSlot,p=state.slots[i],view=movesetView,stamp=token;
  if(!p||p.locked||state.approved||!displayedMoves(p).some(move=>move?.move||goal(move)))return;
  const label=view==='during'?'During game':'Final';
  if(!await td78Confirmation('Reset '+label+' moveset?', 'This clears the planned moves for this stage.','Reset')||
   stamp!==token||i!==chosenSlot||view!==movesetView||p!==state.slots[i]||p.locked)return;
  p[view==='during'?'duringMoves':'plannedMoves']=moveSlots({});
  p[view==='during'?'duringManualSlots':'finalManualSlots']=[true,true,true,true];
  delete p[view==='during'?'duringAutoMoves':'finalAutoMoves'];
  delete p.autoOwnedPending;
  persist();render();renderMoveSlots();refreshMoveInfo();
 };
 function coverageSnapshot(party,g){
  const gen=gameGeneration(g),types=typesFor(g);
  const stabTypes=[...new Set(party.flatMap(p=>p.types||[]))];
  return {
   defense:types.filter(type=>party.some(p=>matchup(type,p.types,gen)<1)),
   stabTypes,
   stabCoverage:types.filter(type=>stabTypes.some(attack=>matchup(attack,[type],gen)>1))
  };
 }
 function candidateCoverageCopy(index,mon){
  const rows=state.slots.map((plan,i)=>plan&&(movesetView==='during'?duringLearner(plan,i):plan));
  const before=coverageSnapshot(rows.filter(Boolean),state.game);
  rows[index]=mon;
  const after=coverageSnapshot(rows.filter(Boolean),state.game);
  const labels={defense:'Defensive coverage',stabTypes:'STAB types',stabCoverage:'Potential super-effective STAB'};
  const groups=Object.entries(labels).map(([key,label])=>[
   label,after[key].filter(type=>!before[key].includes(type)),before[key].filter(type=>!after[key].includes(type))
  ]).filter(([,gained,lost])=>gained.length||lost.length);
  const badges=types=>types.length?types.map(pill).join(''):'<span aria-label="None">—</span>';
  return groups.length?`<div class="td773-coverage-grid"><span class="td41-good">+ Gained</span><span class="td63-danger">− Lost</span>
   ${groups.map(([label,gained,lost])=>`<section><h4>${label}</h4><div>${badges(gained)}</div><div>${badges(lost)}</div></section>`).join('')}</div>`:
   '<small>No type coverage changes</small>';
 }
 function coverageDisclosure(index,mon,open=false){
  return `<details class="td773-coverage td773-disclosure"${open?' open':''}><summary><span>${state.slots[index]?'Coverage changes':'Coverage gained'}</span></summary><div class="td773-coverage-body">${candidateCoverageCopy(index,mon)}</div></details>`;
 }
 function recommendationHeader(mon,prior,{rank,action=''}={}){
  const bst=p=>p?.baseStats&&Object.values(p.baseStats).reduce((n,x)=>n+x,0);
  const total=bst(mon),previous=bst(prior);
  const difference=Number.isFinite(previous)?total-previous:0;
  const delta=difference?` <b class="${difference>0?'td41-good':'td63-danger'}">(${difference>0?'+':''}${difference})</b>`:'';
  return `<img loading="lazy" src="${safe(sprite(mon))}" alt=""><span class="td43-candidate-copy"><strong>${rank?'#'+rank+' · ':''}${safe(td41PokemonLabel(mon.name))}</strong><span class="pills">${mon.types.map(pill).join('')}</span></span><span class="td773-candidate-meta">${action?`<span class="td772-preview-label">${action}</span>`:''}${total?`<small>BST ${total}${delta}</small>`:''}</span>`;
 }
 function compositionValue(party,game){
  const m=metrics(party,game,true);
  const typings=new Map(),roles={physical:0,special:0};
  let defense=0,overlap=0,quality=0;
  for(const p of party){
   const key=[...(p.types||[])].sort().join('/');
   overlap+=typings.get(key)||0;typings.set(key,(typings.get(key)||0)+1);
   const stats=p.baseStats||{},atk=stats.attack||0,spa=stats['special-attack']||0;
   if(atk>=75&&atk>=spa*.85)roles.physical++;
   if(spa>=75&&spa>=atk*.85)roles.special++;
   quality+=statValue(p)*.55;
  }
  for(const row of m.weak){
   defense+=Math.min(row.resist,1)*2.25+(row.immune?1.5:0);
   defense-=row.severity==='uncovered'?row.gap*5:row.gap*2;
  }
  return quality+m.covered.length*4+defense-overlap*10+Math.min(roles.physical,roles.special,2)*5;
 }
 function setDeadlineOptions(game){
  const milestones=milestoneOptions(game).filter(([key])=>!['post-league','postgame'].includes(key));
  const unova=['Black','White','Black 2','White 2'].includes(game);
  const groups=[
   [['Red','Blue','Yellow','FireRed','LeafGreen'],['Pewter','Cerulean','Vermilion','Celadon','Fuchsia','Saffron','Cinnabar','Viridian']],
   [['Gold','Silver','Crystal','HeartGold','SoulSilver'],['Violet','Azalea','Goldenrod','Ecruteak','Cianwood','Olivine','Mahogany','Blackthorn']],
   [['Ruby','Sapphire','Emerald','Omega Ruby','Alpha Sapphire'],['Rustboro','Dewford','Mauville','Lavaridge','Petalburg','Fortree','Mossdeep','Sootopolis']],
   [['Diamond','Pearl','Brilliant Diamond','Shining Pearl'],['Oreburgh','Eterna','Veilstone','Pastoria','Hearthome','Canalave','Snowpoint','Sunyshore']],
   [['Platinum'],['Oreburgh','Eterna','Hearthome','Veilstone','Pastoria','Canalave','Snowpoint','Sunyshore']],
   [['X','Y'],['Santalune','Cyllage','Shalour','Coumarine','Lumiose','Laverre','Anistar','Snowbelle']],
   [['Sword','Shield'],['Turffield','Hulbury','Motostoke','Stow-on-Side','Ballonlea','Circhester','Spikemuth','Hammerlocke']]
  ];
  const cities=groups.find(([games])=>games.includes(game))?.[1];
  const deadlines=milestones.filter(([key])=>!key.startsWith('badge-')||unova||cities).map(([key,label])=>
   [key,cities&&key.startsWith('badge-')?'After Gym '+key.slice(6)+' · '+cities[Number(key.slice(6))-1]:label]);
  $('td77Availability').innerHTML='<option value="actual">Current actual progression</option>'+
   deadlines.map(([key,label])=>`<option value="${key}">${safe(label)}</option>`).join('')+'<option value="postgame">Including postgame</option>';
  const selected=state.stageDeadlines?.[movesetView]??state.deadline;
  $('td77Availability').value=deadlines.some(([key])=>key===selected)?selected:selected==='actual'||selected==='postgame'?selected:'pre-league';
  $('td77Legendary').checked=!!state.includeLegendary;
 }
 function deadlineRank(){
  const value=$('td77Availability').value;
  return window.td62Progress.rank(value==='actual'?window.td62Progress.detected(actual()?.saveLink?.progression):value);
 }
 function candidateInWindow(timing){
  if(['trade','event','tradePossible'].includes(timing.kind))return false;
  if(timing.kind==='owned')return true;
  const limit=deadlineRank(),wide=['pre-league','postgame'].includes($('td77Availability').value);
  if(timing.rank!=null&&timing.rank>limit&&limit!=null)return false;
  return timing.confirmed?limit!=null:wide;
 }
 let plannerIndexRequest;
 function plannerIndex(){
  if(!plannerIndexRequest)plannerIndexRequest=fetch('./db74/planner-v77.json?v=77.6.0').then(response=>{
   if(!response.ok)throw Error('Recommendation index unavailable');
   return response.json();
  }).catch(error=>{plannerIndexRequest=null;throw error;});
  return plannerIndexRequest;
 }
 function indexedStats(row,gen){
  const keys=['hp','attack','defense','special-attack','special-defense','speed'],values=row[1].slice();
  for(const era of Object.keys(row[2]).map(Number).sort((a,b)=>b-a)){
   if(gen<=era)for(const [stat,value] of row[2][era])values[stat]=value;
  }
  return Object.fromEntries(keys.map((key,i)=>[key,values[i]]));
 }
 function statValue(p){
  const b=p.baseStats||{},atk=b.attack||0,spa=b['special-attack']||0;
  return (Object.values(b).reduce((a,n)=>a+n,0)*.2+Math.max(atk,spa)*1.5+(b.speed||0)+(b.hp||0)*.75+((b.defense||0)+(b['special-defense']||0))*.5)/8;
 }
 function unovaResourceSummary(game){
  if(!['Black','White','Black 2','White 2'].includes(game))return '';
  const deadline=deadlineRank()??9,cap=deadlineLevel(),data=window.takDexAcquisitionV77;
  const claims=[],currencies=new Map();
  const spend=(item,n,projected,mon)=>{
   const row=currencies.get(item)||{item,total:0,projected:0,members:new Set()};
   row.total+=n;if(projected)row.projected+=n;row.members.add(mon);currencies.set(item,row);
  };
  for(const [slot,p] of state.slots.entries()){
   if(!p)continue;
   const during=movesetView==='during';
   const member=ownedFor(p,slot),learner=during?duringLearner(p,slot):finalLearner(p);
   const route=routeForLearner(chosenRoute(p,true,slot),learner,during);
   const timing=acquisition(learner,false);
   const completedStage=p.fulfilledStage||(route?.initial.kind==='owned'?member?.id:0);
   const completed=completedStage?route?.steps.findIndex(step=>step.id===completedStage)??-1:-1;
   const evolved=Number(completedStage)===Number(learner.id);
   const projected=route?!routeFits(route,cap):timing.rank>deadline;
   const needs=route?route.steps.slice(completed+1).filter(step=>step.resource).map(step=>({item:step.resource,requirement:step.requirement})):
    p.acquisitionRoute?[]:[{item:data.evolutionItem(timing),requirement:timing.path?.requirement}].filter(step=>step.item);
   const mon=td41PokemonLabel(learner.name);
   if(!evolved)for(const {item,requirement} of needs){
    const source=requirement?.split(' in ').at(1);
    claims.push({item,member:mon,projected,source});
   }
   const moves=displayedMoves(p);
   for(const move of new Set(moves.map(goal).filter(Boolean))){
    if(retainsMove(p,learner,move,slot,route))continue;
    const methods=learner.learnMethods?.[move]||[];
    const reminder=moves.some(m=>goal(m)===move&&m.reminderFor===move)||
     lineage(learner.id).size>1&&methods.length&&methods.every(([method,level])=>method==='level-up'&&level===1);
    if(reminder)spend('Heart Scale',1,projected||deadline<5,mon);
    if(!methods.length||!methods.every(([method])=>method==='tutor'))continue;
    const tutor=window.takDexTutorV73?.find(game,move)?.[0],timing=window.td62Progress.moveTiming(game,move,methods);
    const cost=tutor?.cost?.match(/^(\d+)\s+(.+)$/);
    if(cost&&timing?.rank!=null)spend(cost[2],Number(cost[1]),projected||timing.rank>deadline,mon);
   }
  }
  const line=(label,value,tone='')=>`<div><dt>${label}</dt><dd class="${tone}">${value}</dd></div>`;
  const requirement=(total,after)=>line('Required before deadline',total-after)+
    line('Required after deadline',after,after?'td41-warn':'');
  const stock=data.resourceBudget(game,deadline,claims).map(row=>{
   const total=row.members.length,after=row.projected||0;
   return `<details data-td77-resource="${safe(row.item)}"><summary class="${row.shortfall?'td63-danger':''}">${safe(row.item)} · ${total} needed</summary><small>${safe(row.members.join(', '))}</small>
    <dl>${requirement(total,after)}${line('Documented field supply',row.guaranteed,row.shortfall?'td41-warn':'td41-good')}</dl>
    ${row.shortfall?`<small class="${row.renewable?'td41-warn':'td63-danger'}">Field supply shortfall: ${row.shortfall}</small>`:''}
    ${(row.sources||[]).map(source=>`<small>${td77AcquisitionLinks(source,game)}</small>`).join('')}
    ${row.renewable?`<small>Repeatable · ${td77AcquisitionLinks(row.renewable.replace(/ at the Battle Subway/, ' · Battle Subway ·').replace(/· after/, '· After'),game)}</small>`:''}</details>`;
  });
  const tutor=[...currencies.values()].map(row=>{
   const source=row.item==='Heart Scale'?'Daily request · Driftveil City':/shard/i.test(row.item)?'Dust clouds and repeatable missions':'';
   return `<details data-td77-resource="${safe(row.item)}"><summary>${safe(row.item)} · ${row.total} needed</summary><small>${safe([...row.members].join(', '))}</small>
    <dl>${requirement(row.total,row.projected)}</dl>${source?`<small>${td77AcquisitionLinks(source,game)}</small>`:''}</details>`;
  });
  return stock.length||tutor.length?`<section class="td77-resource-summary">${stock.join('')}${tutor.join('')}</section>`:'';
 }
 function limitedSpeciesClaims(slots,g){
  const rules=window.takDexAcquisitionV77?.limitedSpecies(g,deadlineRank()??9)||[];
  return rules.map(rule=>({rule,members:slots.filter(p=>p&&rule.species.some(id=>lineage(p.id).has(id)))}));
 }
 function alreadyClaimsSpecies(p,rest,g){
  const ancestry=lineage(p.id);
  return limitedSpeciesClaims(rest,g).some(({rule,members})=>!rule.renewable&&members.length&&rule.species.some(id=>ancestry.has(id)));
 }
 function plannedMachineCopies(game,excluded=-1,view=movesetView){
  const copies=new Map();
  if(gameGeneration(game)>=5)return copies;
  for(const [slot,p] of state.slots.entries()){
   if(!p||slot===excluded)continue;
   const learner=view==='final'?finalLearner(p):duringLearner(p,slot);
   const planned=view==='final'?p.plannedMoves:p.duringMoves;
   for(const move of new Set((planned||[]).map(goal).filter(Boolean))){
    const methods=learner.learnMethods?.[move]||[];
    if(!methods.length||!methods.every(([method])=>method==='machine'))continue;
    if(retainsMove(p,learner,move,slot))continue;
    if(!copies.has(move))copies.set(move,[]);
    copies.get(move).push({p,known:false});
   }
  }
  return copies;
 }
 function routeForLearner(route,learner,during){
  if(!during||!route)return route;
  const index=route.steps.findIndex(step=>step.id===learner.id);
  return {...route,steps:route.steps.slice(0,index+1),rank:Math.max(route.initial.rank,
   ...route.steps.slice(0,index+1).map(step=>step.rank||0))};
 }
 function collectMoveRoutes(p,slot,g,during,earlier,selected,deadline,{levelLimit=null,wanted=null,requiredTraining=1}={}){
  const progress=window.td62Progress;
  const actualMon=ownedFor(p,slot);
  const retained=actualMon&&lineage(p.id).has(Number(actualMon.id))&&(!selected||selected.initial.kind==='owned')?actualMon.moves||[]:[];
  const known=new Map(retained.map(move=>[moveKey(move),move]).filter(([name])=>name));
  const gym=leagueTargets(g).filter(t=>t.gym)[Math.min(deadline,7)];
  const practicalLevel=Math.max(requiredTraining,selected?.initial.minLevel||1,retained.length||sameMon(actualMon,p)?actualMon.level||1:1,
   levelLimit??Math.max(...(gym?.rows||[]).map(r=>r.level||1),!during&&deadline>=9?60:1));
  const routes=new Map(),unverified=new Set();
  const data=window.takDexAcquisitionV77;
  const inUnova=['Black','White','Black 2','White 2'].includes(g);
  const stages=[...earlier,p];
  const actualStage=actualMon?.saveStats&&(!selected||selected.initial.kind==='owned')&&sameMon(actualMon,stages[0]);
  const startingLevel=selected?.initial.kind==='owned'&&!actualStage?1:selected?.initial.minLevel|| (actualStage?actualMon.level||1:1);
  if(selected&&(selected.initial.rank>deadline||!during&&selected.rank>deadline))return null;
  const stageMinimums=stages.map((_,i)=>i+1<stages.length?data.evolutionTrainingLevel(stages[i+1].id):1);
  const allocated=plannedMachineCopies(g,slot,during?'during':'final');
  const add=(name,route)=>{
   if(!routes.has(name))routes.set(name,[]);
   routes.get(name).push(route);
  };
  for(const [stage,learner] of stages.entries()){
   for(const name of wanted||learner.legalMoves||[]){
    if(wanted&&!learner.learnMethods?.[name])continue;
    const methods=learner.learnMethods?.[name]||[];
    if(known.has(name))continue;
    const machineReserved=allocated.has(name)&&data.limitedMachine(g,name);
    if(machineReserved&&methods.every(([method])=>method==='machine'))continue;
    const gated=methods.filter(([method])=>method!=='level-up'&&method!=='egg'&&(!machineReserved||method!=='machine'));
    const timing=(gated.some(([method])=>method==='machine')&&hms(g).includes(name)?progress.hm(g,name,effectiveProgress()):null)||
     progress.moveTiming(g,name,gated);
    if(wanted&&gated.length&&timing?.rank==null)unverified.add(name);
    if(timing?.rank!=null&&timing.rank<=deadline)add(name,{stage,timing,level:Infinity});
    for(const [method,level] of methods){
     if(method!=='level-up'||level<1||level>practicalLevel)continue;
     if(!inUnova||stage!==0||level>=startingLevel||!actualStage&&level>0){
      if(stage===0&&!actualStage&&level<=startingLevel){
       const later=Object.entries(learner.learnMethods||{}).filter(([,list])=>list.some(([method,n])=>method==='level-up'&&n>level&&n<=startingLevel)).length;
       if(later<4)add(name,{stage,level,at:startingLevel});
      }else if(level>1||stage===0)add(name,{stage,level,at:level});
     }
     const reminder=inUnova&&data.moveReminder(g);
     if(reminder&&deadline>=reminder.rank){
      add(name,{stage,level,minimum:level,timing:reminder,reminder:true});
     }
    }
   }
  }
  for(const name of known.keys())if(!wanted||wanted.has(name))add(name,{stage:0,level:0});
  return {routes,known,unverified,stageMinimums,startingLevel,practicalLevel,stages,actualMon};
 }
 async function suggestedMoves(p,slot,g,during=false,earlier=[],selected=null){
  const now=window.td62Progress.rank(effectiveProgress())??0,cutoff=deadlineRank()??9;
  const theoretical=!during&&selected&&!routeFits(selected);
  const deadline=during?Math.min(Math.max(now,selected?.initial.rank??0),cutoff):theoretical?Math.max(9,selected.rank):cutoff;
  const requiredTraining=!during?Math.max(1,...(selected?.steps||[]).map(step=>step.level||1)):1;
  const poolData=collectMoveRoutes(p,slot,g,during,earlier,selected,deadline,{requiredTraining});
  if(!poolData)return moveSlots({});
  const {routes,known,stageMinimums,startingLevel,practicalLevel,stages,actualMon}=poolData;
  const data=window.takDexAcquisitionV77,inUnova=['Black','White','Black 2','White 2'].includes(g);
  const utility=new Set(['tail-whip','leer','harden','withdraw','sand-attack','growl','defense-curl','charm',
   'thunder-wave','will-o-wisp','toxic','hypnosis','sleep-powder','stun-spore','recover','roost','synthesis',
   'slack-off','reflect','light-screen','calm-mind','swords-dance','work-up','bulk-up','confuse-ray','disable']);
  const pool=[...routes.entries()],rows=[];
  for(let offset=0;offset<pool.length;offset+=12)rows.push(...(await Promise.all(pool.slice(offset,offset+12).map(async ([name,options])=>{
   const {level,timing}=options.find(route=>Number.isFinite(route.level))||options[0];
   const move=info(name)||await enrichMove({name:pretty(name)},gameGeneration(g),g).catch(()=>known.get(name));
   if(!move?.type||!move.damageClass)return null;
   moveInfo.set(g+':'+name,move);
   const usable=damaging(move);
   if(!usable&&move.damageClass!=='status'&&!utility.has(name)&&!known.has(name))return null;
   const damage=usable?td5Merit(move,p,slot,g)-(td51Risk(name)?15:0):0;
   if(usable&&damage<=0&&!known.has(name))return null;
   const score=usable?Math.max(5,damage)+(Number.isFinite(level)?8:0)+(timing?.rank!=null?5:0):utility.has(name)?-30:-65;
   return {name,move,score:score+(known.has(name)?5:0),level,timing,usable,options};
  }))).filter(Boolean));
  const gen=gameGeneration(g),attacker=td5Attacker(p,slot);
  const teammates=state.slots.flatMap((mon,i)=>{
   if(!mon||i===slot)return [];
   const moves=(during?mon.duringMoves:usableFinalMoves(mon))||[];
   return [{mon:td5Attacker(during?duringLearner(mon,i):mon,i),moves:moves.map(goal).map(info).filter(damaging)}];
  });
  const reference=await plannerIndex().catch(()=>null);
  const trainerMatchups=leagueTargets(g).flatMap((trainer,index)=>trainer.rows
   .filter(foe=>foe.types?.length&&(!trainer.gym||gymBefore(g,index)>=now&&gymBefore(g,index)<=deadline))
   .map(foe=>({foe:reference?.[foe.id]?{...foe,baseStats:indexedStats(reference[foe.id],gen)}:foe,types:foe.types,weight:.7})));
  const scenarios=[...typesFor(g).map(type=>({types:[type],weight:20})),...trainerMatchups];
  const attackAgainst=(row,scenario,mon)=>defensiveEffect(row,{types:scenario.types},gen,mon)>1?
   plannerSuitability(mon,scenario.types,row,gen,scenario.foe):0;
  const existing=scenarios.map(scenario=>Math.max(0,...teammates.flatMap(({mon,moves})=>moves.map(row=>attackAgainst(row,scenario,mon)))));
  const bestAttack=Math.max(1,...rows.filter(r=>r.usable).map(r=>r.score));
  for(const row of rows){
   row.targetValues=row.usable?scenarios.map((scenario,i)=>Math.max(0,
    attackAgainst(row.move,scenario,attacker)*Math.min(1,row.score/75)-existing[i]*.75)*scenario.weight):[];
   row.quality=row.usable?30*Math.min(1,row.score/bestAttack):row.score<-50?1:6;
   row.utility=hms(g).includes(row.name)&&!teammates.some(({moves})=>moves.some(move=>moveKey(move.name)===row.name))?10:0;
  }
  // Beam-search complete combinations, retaining feasible alternatives if a move
  // would force education before capture or after the necessary evolution.
  let beam=[{moves:[],score:0,last:-1,schedule:null}];
  rows.sort((a,b)=>b.quality+b.utility-a.quality-a.utility||a.name.localeCompare(b.name));
  for(let size=1;size<=4;size++){
   const next=[];
   for(const entry of beam)for(const [i,row] of rows.entries()){
    if(i<=entry.last)continue;
    const moves=[...entry.moves,row];
    const schedule=inUnova?data.scheduleEvolutionMoves(stageMinimums,startingLevel,practicalLevel,moves.map(r=>r.options)):null;
    if(inUnova&&!schedule)continue;
    const damagingMoves=moves.filter(r=>r.usable);
    const coverage=scenarios.reduce((total,scenario,j)=>total+Math.max(0,...damagingMoves.map(r=>r.targetValues[j])),0);
    const typeCounts=new Map(),duplicateUtility=new Set();
    let quality=0,penalty=0;
    for(const m of moves){
     quality+=m.quality+m.utility;
     if(!m.usable)continue;
     const previous=typeCounts.get(m.move.type)||0;
     const distinct=m.utility||m.move.priority>0&&!duplicateUtility.has(m.move.type);
     if(m.move.priority>0)duplicateUtility.add(m.move.type);
     penalty+=Math.max(0,previous*(distinct?11:25));
     typeCounts.set(m.move.type,previous+1);
    }
    next.push({moves,score:quality+coverage-penalty,last:i,schedule});
   }
   if(!next.length)break;
   beam=next.sort((a,b)=>b.score-a.score).slice(0,36);
  }
  const best=beam[0];
  const targets=best.moves.map((row,i)=>{
   const route=best.schedule?.[i];
   return route?{...row,level:route.level,timing:route.timing,reminder:!!route.reminder}:row;
  }).sort((a,b)=>b.quality+b.utility-a.quality-a.utility);
  const stageNow=actualMon&&(!selected||selected.initial.kind==='owned')?stages.findIndex(learner=>sameMon(actualMon,learner)):0;
  const used=new Set(targets.map(x=>x.name));
  const result=targets.map(target=>{
   const pending=!during&&(target.timing?.rank!=null&&target.timing.rank>now||Number.isFinite(target.level)&&target.level>Math.max(actualMon?.level||0,selected?.initial.minLevel||1));
   const temp=pending&&rows.find(r=>!used.has(r.name)&&r.move.type===target.move.type&&r.options.some(route=>
    route.stage===stageNow&&(known.has(r.name)||route.timing?.rank!=null&&route.timing.rank<=now||
     Number.isFinite(route.level)&&!route.reminder&&route.level<=Math.max(actualMon?.level||0,stages[0]?.id===selected?.startId?selected.initial.minLevel||1:1))));
   if(temp)used.add(temp.name);
   return {move:temp?temp.name:target.name,purpose:temp?'temporary':'keep',replacement:temp?target.name:'',milestone:'',usefulness:'unknown',reminderFor:target.reminder?target.name:''};
  });
  return moveSlots({plannedMoves:result});
 }
 function sameFamily(a,b){return [...lineage(a.id)].at(-1)===[...lineage(b.id)].at(-1);}
 function redundantFamily(candidate,member){
  if(!member||!sameFamily(candidate,member))return false;
  const a=lineage(candidate.id),b=lineage(member.id);
  if(a.has(Number(member.id)))return !distinctEarlier(member,candidate);
  if(b.has(Number(candidate.id)))return !distinctEarlier(candidate,member);
  const sameTypes=candidate.types?.slice().sort().join('/')===member.types?.slice().sort().join('/');
  const distinct=Object.entries(candidate.baseStats||{}).some(([stat,value])=>{
   const other=member.baseStats?.[stat];
   return Number.isFinite(other)&&Math.abs(other-value)>=30;
  });
  return sameTypes&&!distinct;
 }
 function earlierStage(earlier,later){
  return !!earlier&&!!later&&earlier.id!==later.id&&lineage(later.id).has(earlier.id);
 }
 function redundantDowngrade(earlier,later){
  return earlierStage(earlier,later)&&!distinctEarlier(earlier,later);
 }
 function distinctEarlier(earlier,later){
  return earlier.types?.some(type=>!later.types?.includes(type))||
   (earlier.baseStats?.speed||0)>=(later.baseStats?.speed||0)+25||
   Math.max(earlier.baseStats?.attack||0,earlier.baseStats?.['special-attack']||0)>=
   Math.max(later.baseStats?.attack||0,later.baseStats?.['special-attack']||0)+20;
 }
 let recommendationContext='';
 const expandedRecommendations=new Map();
 async function findCandidates(){
  if(state.approved||!state.game)return;
  const my=token,run=++rankRun,i=chosenSlot,g=state.game,host=$('td4CandidateStatus');
  const candidates=$('td4Candidates');
  const selectedPlan=state.slots[i];
  const context=JSON.stringify([token,i,g,movesetView,selectedPlan?.id,selectedPlan?.duringTargetId,selectedPlan?.acquisitionRoute?.id,
   deadlineRank(),[...filterTypes].sort(),state.includeLegendary,improvementType]);
  if(recommendationContext!==context)expandedRecommendations.clear();
  recommendationContext=context;
  candidates.innerHTML='';
  if(state.slots[i]?.locked){host.textContent='';return;}
  host.textContent='Loading candidates…';
  const valid=()=>my===token&&run===rankRun&&i===chosenSlot;
  let catalog=pack;
  try{catalog=catalog||await window.takDexEncounterV55.get(g);}catch{if(valid())host.textContent='Acquisition data unavailable.';return;}
  if(!valid())return;
  pack=catalog;
  const during=movesetView==='during',plan=state.slots[i];
  const original=state.slots.flatMap((p,j)=>p?[during?duringLearner(p,j):p]:[]);
  const base=state.slots.flatMap((p,j)=>p&&j!==i?[during?duringLearner(p,j):p]:[]);
  const used=new Set(base.map(p=>p.id));
  if(plan)used.add(during?duringLearner(plan,i).id:plan.id);
  const owned=[ownedFor(plan,i)].filter(Boolean);
  const otherSlots=state.slots.filter((p,j)=>p&&j!==i);
  const cap=deadlineLevel();
  const opposition=leagueTargets(g);
  const covered=party=>opposition.reduce((sum,t)=>sum+t.rows.filter(o=>o.types?.length&&party.some(p=>p.types?.some(type=>matchup(type,o.types,gameGeneration(g))>1))).length,0);
  const limit=deadlineRank()??9;
  const currentLeague=covered(original);
  let index;
  try{index=await plannerIndex();}catch{if(valid())host.textContent='Recommendation index unavailable.';return;}
  if(!valid())return;
  const gen=gameGeneration(g),eligible=[];
  const selected=plan&&during?duringLearner(plan,i):plan;
  const baseline=compositionValue(original,g);
  const before=coverageSnapshot(original,g);
  const actualMember=ownedFor(selected,i);
  const pressure=metrics(base,g,true).weak.filter(row=>row.severity==='uncovered');
  buildLineageIndex();
  for(const [id,name,types,,parent] of terminalSpecies){
   const row=index[id];
   if(!row||used.has(id)||!types?.length||!matchesTypes(types)||improvementType&&matchup(improvementType,types,gen)>=1||!td7PokemonAllowed(name,id,g)||row[0]&&!$('td77Legendary').checked)continue;
   const evidence=window.takDexAcquisitionV64.details(pack,id);
   const timing=window.td62Progress.acquisition(g,{id,name},pack,owned,evidence);
   if(!timing.confirmed&&timing.kind!=='owned'&&!evidence.verified&&!evidence.nativeEvolution&&!pack.entries?.[id]?.length)continue;
   if((timing.kind!=='owned'&&alreadyClaimsSpecies({id},otherSlots,g))||!candidateInWindow(timing)||evidence.notes?.some(note=>note.eventOnly)&&!timing.confirmed)continue;
   const p={id,name,types,parent,timing,baseStats:indexedStats(row,gen)};
   if(otherSlots.some(q=>redundantFamily(p,q))||redundantDowngrade(p,selected))continue;
   p.routes=routeOptions(p);
   if(p.routes.length&&!p.routes.some(route=>routeFits(route,cap)))continue;
   const after=[...base,p];
   const leagueGain=covered(after)-currentLeague;
   const newCoverage=coverageSnapshot(after,g).stabCoverage;
   const gainedCoverage=newCoverage.filter(type=>!before.stabCoverage.includes(type)).length;
   const lostCoverage=before.stabCoverage.filter(type=>!newCoverage.includes(type)).length;
   const addressed=pressure.filter(row=>matchup(row.type,types,gen)<1);
   const addsPressure=pressure.filter(row=>matchup(row.type,types,gen)>1);
   const evolvesSelected=!!selected&&lineage(id).has(selected.id)&&id!==selected.id;
   const sameRole=selected&&selected.types?.some(type=>types.includes(type));
   const qualityGain=sameRole?Math.max(-6,Math.min(8,(statValue(p)-statValue(selected))*.35)):0;
   const parts={
    composition:compositionValue(after,g)-baseline,
    defense:addressed.reduce((sum,row)=>sum+row.weak*4,0)-addsPressure.reduce((sum,row)=>sum+row.weak*3,0),
    stab:gainedCoverage*2.5-lostCoverage*4,
    quality:qualityGain,
    league:leagueGain*.7,
    timing:-(timing.rank??8)*.35,
    effort:-acquisitionEffort(p,timing,actualMember)
   };
   eligible.push({...p,evolvesSelected,parts,addressed,addsPressure,lostCoverage,score:Object.values(parts).reduce((sum,n)=>sum+n,0)});

  }
  ranked=eligible.sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name));
  host.textContent=ranked.length?ranked.length+(state.slots[i]?' replacement options':' candidates'):'No candidates match these filters.';
  let from=0;
  const append=()=>{
   if(my!==token||run!==rankRun||i!==chosenSlot)return;
   observer.disconnect();
   candidates.querySelector('[data-td77-more-candidates]')?.remove();
   const current=state.slots[i];
   const active=current&&movesetView==='during'?duringLearner(current,i):current;
   const batch=ranked.slice(from,from+24);
   candidates.insertAdjacentHTML('beforeend',batch.map((p,offset)=>{
    const j=from+offset;
    return `<div class="td43-candidate td772-recommendation" data-candidate-id="${p.id}" data-score="${p.score.toFixed(2)}" data-factors="${safe(JSON.stringify(p.parts))}"><button type="button" class="td43-candidate-pick" data-td4-candidate="${j}">${recommendationHeader(p,active,{rank:j+1,action:'Preview ›'})}</button>${coverageDisclosure(i,p,expandedRecommendations.get(p.id)?.[0])}${candidateAcquisition(p,expandedRecommendations.get(p.id)?.[1])}</div>`;
   }).join(''));
   from+=24;
   if(from<ranked.length){
    candidates.insertAdjacentHTML('beforeend','<button type="button" data-td77-more-candidates>Show more Pokémon ('+(ranked.length-from)+')</button>');
    observer.observe(candidates.lastElementChild);
   }
   refreshAcquisition();
  };
  const observer=new IntersectionObserver(entries=>{
   if(entries.some(entry=>entry.isIntersecting&&entry.target.isConnected))append();
  },{rootMargin:'200px'});
  candidates.onclick=e=>{if(e.target.closest('[data-td77-more-candidates]'))append();};
  append();
 }
 $('td4Candidates').addEventListener('toggle',event=>{
  const disclosure=event.target,card=disclosure.closest('[data-candidate-id]');
  if(!card||!disclosure.isConnected)return;
  expandedRecommendations.set(Number(card.dataset.candidateId),[
   card.querySelector('.td773-coverage').open,card.querySelector('.td80-candidate-acquisition').open
  ]);
 },true);
 $('td77Availability').addEventListener('change',()=>{
  const fallback=state.deadline||'pre-league';
  (state.stageDeadlines??={during:fallback,final:fallback})[movesetView]=$('td77Availability').value;
  state.deadline=state.stageDeadlines.final;persist();render();if(!$('td4Edit').hidden){renderMoveSlots();if(settings.open)findCandidates();}});
 $('td77Legendary').addEventListener('change',()=>{state.includeLegendary=$('td77Legendary').checked;persist();findCandidates();});
 const settings=$('td4Edit').querySelector(':scope > .td42-settings');
 const searchReturn=$('td79SearchReturn');
 function updateSearchReturn(){
  const input=$('td4Search').getBoundingClientRect(),results=$('td4Candidates').getBoundingClientRect();
  searchReturn.hidden=page.hidden||$('td4Edit').hidden||!settings.open||input.bottom>0||results.height<innerHeight||results.bottom<80;
 }
 window.addEventListener('scroll',updateSearchReturn,{passive:true});
 new ResizeObserver(updateSearchReturn).observe($('td4Candidates'));
 searchReturn.onclick=()=>$('td4Search').scrollIntoView({block:'center',behavior:'smooth'});
 settings.addEventListener('toggle',()=>{
  if(settings.open&&!$('td4Edit').hidden){
   if(!$('td63ManualCandidate').textContent.trim())restoreConfirmedPreview();
   findCandidates();
  }else if(!settings.open){
   ++rankRun;++manualRun;manualCandidate=null;$('td63ManualCandidate').innerHTML='';
   refreshAcquisition();
  }
 });

 const candidateHost=$('td4Edit');
 function openPokemonActions(targets,compare){
  const game=state.game,scroll=window.scrollY,dialog=document.createElement('dialog');
  dialog.className='td71-quick-dialog';
  const title=compare?'Compare '+td41PokemonLabel(targets[0].name)+' with '+td41PokemonLabel(compare.name):targets.map(p=>td41PokemonLabel(p.name)).join(' / ');
  dialog.innerHTML='<h3>'+safe(title)+'</h3>'+
   '<div class="td77-pokemon-actions">'+
   (compare?'<button type="button" data-compare-confirm>Compare</button>':'')+
   targets.map((p,i)=>`<button type="button" data-td77-action-dex="${i}">${targets.length===1?'Open Pokédex':'Pokédex · '+safe(td41PokemonLabel(p.name))}</button>`).join('')+
   '<button type="button" data-compare-cancel>Cancel</button></div>';
  dialog.addEventListener('close',()=>dialog.remove(),{once:true});
  dialog.onclick=event=>{
   if(event.target.closest('[data-compare-cancel]'))dialog.close();
   if(event.target.closest('[data-compare-confirm]')){
    dialog.close();window.takDexCompareV71?.openPair(targets[0].name,compare.name,game,scroll);
   }
   const dex=event.target.closest('[data-td77-action-dex]');
   if(dex){
    const p=targets[Number(dex.dataset.td77ActionDex)];
    dialog.close();window.takDexBattleNavigationV73?.showDex(p.name,'team-planner',{game,id:p.id});
   }
  };
  document.body.append(dialog);dialog.showModal();
 }
 td77RegisterHold('#td4Slots [data-td77-hold]',button=>{
  const i=Number(button.dataset.td4Slot),p=state.slots[i],a=ownedFor(p,i);
  if(!p)return;
  openPokemonActions(a&&!sameMon(a,p)?[a,p]:[p]);
 });
 function getCandidate(button){
  return button.matches('[data-td63-manual-select],[data-td77-preview-context]')?manualCandidate:ranked[Number(button.dataset.td4Candidate)];
 }
 td77RegisterHold('#td4Edit [data-td4-candidate],#td4Edit [data-td77-preview-context]',button=>{
  const p=getCandidate(button),plan=state.slots[chosenSlot];
  const current=plan&&movesetView==='during'?duringLearner(plan,chosenSlot):plan;
  const reference=current&&!sameMon(current,p)?current:ownedFor(plan,chosenSlot);
  if(p)openPokemonActions([p],reference&&!sameMon(reference,p)?reference:null);
 },450);
 candidateHost.addEventListener('click',event=>{
  const switchSlot=event.target.closest('[data-td77-evolve-slot]');
  if(switchSlot&&manualCandidate){
   const name=manualCandidate.name,i=Number(switchSlot.dataset.td77EvolveSlot);
   if(chosenSlot!==i)$('td4Slots').querySelector(`[data-td4-slot="${i}"]`)?.click();
   settings.open=true;
   stageCandidate(name);
   return;
  }
  if(event.target.closest('[data-td77-cancel-preview]')){restoreConfirmedPreview();return;}
  const endpoint=event.target.closest('[data-td77-plan-endpoint]');
  if(endpoint){choose(endpoint.dataset.td77PlanEndpoint,{id:endpoint.dataset.route},movesetView==='during'?manualCandidate?.id:undefined);return;}
  const button=event.target.closest('[data-td4-candidate],[data-td63-manual-select]');
  if(!button||button.disabled)return;
  const p=getCandidate(button);
  if(!p)return;
  if(button.hasAttribute('data-td63-manual-select'))choose(p.name,p.acquisitionRoute);
  else stageCandidate(p.name);
 });

 window.addEventListener('td74:team-saved',event=>{
  if(!state||!plannerActive||event.detail?.teamIds&&!event.detail.teamIds.includes($('td4Team').value))return;
  reconcileOwnership();
  if(page.hidden){plannerDirty=true;return;}
  const old=$('td4Team').value;
  teamMenu();
  if(old!==$('td4Team').value){plannerActive=false;page.hidden=true;window.takActivate(0);return;}
  render();
  if(!$('td4Edit').hidden&&!$('td41MoveSlots').querySelector('.suggestions:not([hidden])')){renderMoveSlots();if(settings.open)findCandidates();}
  refreshMoveInfo();
 });

})();

td77MigrateBattleProfiles();
