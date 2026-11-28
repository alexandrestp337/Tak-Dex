/* Bridge for raw save snapshots from a file picker or a future native provider. */
(function () {
 'use strict';
 const forms = {
  351:[10013,10014,10015],386:[10001,10002,10003],413:[10004,10005],
  479:[10008,10009,10010,10011,10012],487:[10007],492:[10006],
  550:[10016],555:[10017],641:[10019],642:[10020],645:[10021],
  646:[10023,10022],647:[10024],648:[10018]
 };
 const natureNames=['Hardy','Lonely','Brave','Adamant','Naughty','Bold','Docile','Relaxed','Impish','Lax','Timid','Hasty','Serious','Jolly','Naive','Modest','Mild','Quiet','Bashful','Rash','Calm','Gentle','Sassy','Careful','Quirky'];
 const hiddenPowerTypes=['fighting','flying','poison','ground','rock','bug','ghost','steel','fire','water','grass','electric','psychic','ice','dragon','dark'];
 const intents = new Map();
 let namesRequest;
 async function names() {
  if (!namesRequest) namesRequest=fetch('./db74/gen5-save-names.json').then(response=>{
   if (!response.ok) throw Error('Save reference unavailable.');
   return response.json();
  }).catch(error=>{namesRequest=null;throw error;});
  return namesRequest;
 }
 async function hydrate(record,game,lookup,encounters) {
  const id = forms[record.species]?.[record.form-1] ?? record.species;
  const p = await api('pokemon/'+id);
  const moves = await Promise.all(record.moves.map(async move=>{
   if (!move) return null;
   const m=await api('move/'+move.id);
   const historical=moveGenerationData(m,5,game);
   if(m.name==='hidden-power'){
    const order=['hp','attack','defense','speed','special-attack','special-defense'];
    const typeBits=order.reduce((bits,key,i)=>bits|((record.ivs[key]&1)<<i),0);
    historical.type=hiddenPowerTypes[Math.floor(typeBits*15/63)];
   }
   return {...historical,name:pretty(m.name),...move};
  }));
  const evolutions=encounters?.mons.filter(row=>row[4]===record.species).map(row=>({id:row[0],name:row[1]}))??null;
  return {id,level:record.level,name:pretty(p.name),canonicalName:p.name,image:p.sprites.other?.['official-artwork']?.front_default||p.sprites.front_default,
   types:historicalTypes(p,game),baseStats:Object.fromEntries(td76HistoricalStats(p,game).map(s=>[s.stat.name,s.base_stat])),
   abilities:historicalAbilities(p,game),ability:lookup.abilities[record.abilityId]||'',weight:p.weight,
   moves:moves.filter(Boolean),item:lookup.items[record.itemId]||'',shiny:record.shiny,
   saveStats:{...record,natureName:natureNames[record.nature],evolutions}};
 }
 function status(teamId,message) {
  for (const node of document.querySelectorAll('[data-save-status]')) {
   if (node.dataset.saveStatus===teamId) node.textContent=message;
  }
 }
 // Compare save-owned fields. Cosmetic labels and cached lookup metadata can differ.
 function partyMatches(current,next){
  const sameData=(a,b)=>{
   if(a===b)return true;
   if(!a||!b||typeof a!=='object'||typeof b!=='object')return false;
   return Object.keys(a).length===Object.keys(b).length&&Object.keys(a).every(key=>sameData(a[key],b[key]));
  };
  return next.every((mon,i)=>{
   const old=current[i];
   if(!mon||!old)return !mon&&!old;
   const {evolutions:oldEvolutions,...oldStats}=old.saveStats||{};
   const {evolutions,...actualStats}=mon.saveStats;
   return old.id===mon.id&&td73IdentityKey(old)===td73IdentityKey(mon)&&
    (old.level??oldStats.level)===mon.level&&old.shiny===mon.shiny&&
    old.ability===mon.ability&&old.item===mon.item&&
    !Object.values(old.statAdjustments||{}).some(Boolean)&&sameData(oldStats,actualStats)&&
    sameData((old.moves||[]).map(moveIdentity),mon.moves.map(moveIdentity));
  });
 }
 function moveIdentity(move){
  return [td73MoveKey(move),move?.id,move?.type,move?.ppUps,move?.remainingPP,move?.pp];
 }
 function invalid(message,code='INVALID_SAVE'){return td78Store.fault(code,message);}
 async function observation(parsed,bytes){
  const digest=new Uint8Array(await crypto.subtle.digest('SHA-256',bytes));
  const fingerprint=Array.from(digest,value=>value.toString(16).padStart(2,'0')).join('');
  return {fingerprint,trainerKey:parsed.trainerKey,sequence:parsed.sequence,signature:JSON.stringify(parsed.pokemon),progression:parsed.progression};
 }
 function hydratedLink(mark,modifiedAt){
  return {...mark,modifiedAt:Number.isFinite(modifiedAt)?modifiedAt:null,syncedAt:Date.now()};
 }
 function linkFor(state,id,team){
  const link=td78Store.entry(state,'links',id).value;
  if(link?.game===team.game)return link;
  const legacy=team.nativeSaveCheckpoint;
  return {game:team.game,generation:link?link.generation+1:0,mark:!link&&legacy?.signature?{
   trainerKey:legacy.trainerKey,sequence:legacy.sequence,signature:legacy.signature,progression:legacy.progression||{}
  }:null};
 }
 function classify(mark,next){
  if(!mark)return 'new';
  if(mark.trainerKey!==next.trainerKey)throw invalid('This source belongs to a different trainer. Replace the link to confirm.','TRAINER');
  const distance=(next.sequence-mark.sequence)&0xffff;
  if(distance>=0x8000)return 'stale';
  const equivalent=mark.signature===next.signature&&td78Store.same(mark.progression,next.progression);
  if(distance===0&&(!equivalent||mark.fingerprint&&mark.fingerprint!==next.fingerprint))throw invalid('Two snapshots have the same save sequence and different content. Retry or explicitly import or replace the source.','SEQUENCE_CONFLICT');
  return distance===0?'retry':equivalent?'equivalent':'new';
 }
 function selectedTeam(state,id){
  const team=td78Store.entry(state,'teams',id).value;
  if(!team)throw invalid('Choose a saved team.','TEAM');
  return team;
 }
 async function synchronize({teamId,bytes,modifiedAt,manual=false,linked=false,relink=false,sourceGeneration,requestId}={}){
  // The legacy adapter may send a parsed hint. Only the validated raw bytes are authoritative.
  const parsed=window.takDexGen5Save.parse(bytes);
  const next=await observation(parsed,bytes);
  const first=td78Store.read();
  const firstTeam=selectedTeam(first.state,teamId);
  if(parsed.game!==firstTeam.game)throw invalid('This save is for '+parsed.game+'.','GAME');
  const linkedRead=!manual&&!relink;
  const initialLink=linkFor(first.state,teamId,firstTeam);
  if(linkedRead&&['unlinked','game-changed'].includes(initialLink.intent))return 'stale';
  const generation=sourceGeneration??initialLink.generation;
  if(relink&&requestId&&(initialLink.confirmed?.id===requestId||initialLink.acknowledged===requestId)&&
   generation===initialLink.generation-1&&td78Store.same(initialLink.relinkObservation,next))return 'unchanged';
  if(generation!==initialLink.generation)return 'stale';
  const pending=initialLink.pending;
  if(relink&&requestId&&(pending?.id!==requestId||!td78Store.same(pending.observation,next)))return 'superseded';
  if(relink&&!requestId&&(pending||initialLink.confirmed))throw invalid('A replacement is already pending. Resume or cancel it first.','RELINK_PENDING');
  const classification=linkedRead?classify(initialLink.mark,next):'new';
  if(classification==='stale')return 'stale';
  // A valid manual choice invalidates older local display work after validation.
  // A pending relink leaves the old source usable until the generation commits.
  if(manual&&!relink)intents.set(teamId,(intents.get(teamId)||0)+1);
  const intent=intents.get(teamId);
  const local=teams.find(team=>team.id===teamId);
  const queued=await td78TeamWriteState(teamId);
  if(queued.value&&queued.value.game!==parsed.game)return 'superseded';
  const basis=td78Store.read().state;
  const baseRow=td78Store.entry(basis,'teams',teamId);
  if(!baseRow.value||baseRow.value.game!==parsed.game)return 'superseded';
  let hydrated=null;
  try{
   async function hydrateParty(){
    const lookup=await names();
    const encounters=await window.takDexDB74.encounter(parsed.game).catch(()=>null);
    const pokemon=await Promise.all(parsed.pokemon.map(p=>hydrate(p,parsed.game,lookup,encounters)));
    hydrated=Array.from({length:6},(_,i)=>pokemon[i]||null);
   }
   if(classification==='new')await hydrateParty();
   const commit=()=>td78Store.commit(state=>{
    const row=td78Store.entry(state,'teams',teamId),team=row.value;
    if(!team||team.game!==parsed.game||intents.get(teamId)!==intent)return {code:'superseded'};
    const link=linkFor(state,teamId,team);
    if(link.generation!==generation||(linkedRead&&['unlinked','game-changed'].includes(link.intent)))return {code:'stale'};
    if(relink&&requestId&&(link.pending?.id!==requestId||!td78Store.same(link.pending.observation,next)))return {code:'superseded'};
    if(relink&&!requestId&&(link.pending||link.confirmed))return {code:'superseded'};
    if((link.manualRevision||0)!==(initialLink.manualRevision||0))return {code:'superseded'};
    if(row.revision!==baseRow.revision&&(!linkedRead||link.publishedRevision!==row.revision))
     throw invalid('The team was edited while the save was loading. Retry synchronization.','CONFLICT');
    const verdict=linkedRead?classify(link.mark,next):'new';
    if(verdict==='stale')return {code:'stale'};
    if(verdict==='retry')return {code:'unchanged'};
    if(verdict==='equivalent'){
     td78Store.replace(state,'links',teamId,{...link,mark:next});
     return {code:'unchanged'};
    }
    if(!hydrated)return {retryHydration:true};
    const previous=team.saveLink;
    const previousProgress=previous?.trainerKey===next.trainerKey?previous.progression:{};
    const progress={...previousProgress,...next.progression};
    const actualChanged=!partyMatches(team.pokemon,hydrated);
    const progressChanged=!td78Store.same(progress,previous?.progression||{});
    const updated={...team,pokemon:actualChanged?hydrated:team.pokemon,saveLink:hydratedLink({...next,progression:progress},modifiedAt)};
    if(linked||relink)updated.nativeSaveCheckpoint=updated.saveLink;
    const saved=td78Store.replace(state,'teams',teamId,updated);
    const lifecycle=relink?{generation:generation+1,intent:'linked',pending:null,
     confirmed:requestId?{id:requestId,generation:generation+1}:null,relinkObservation:requestId?next:null,cancelled:[]}:{};
    td78Store.replace(state,'links',teamId,{...link,...lifecycle,mark:linkedRead||relink?next:link.mark,
     manualRevision:(link.manualRevision||0)+Number(manual||relink),publishedRevision:saved.revision});
    return {code:actualChanged||progressChanged||!previous?'updated':'unchanged',actualChanged,progressChanged,published:true};
   });
   let outcome=await commit();
   if(outcome.result.retryHydration){await hydrateParty();outcome=await commit();}
   td78ProjectionWarning(outcome);
   const {code,published,actualChanged,progressChanged}=outcome.result;
   if(!published)return code;
   td78AcceptTeam(outcome.state,teamId);
   const team=teams.find(t=>t.id===teamId);
   if(!team)return code;
   if(progressChanged||actualChanged)td78NotifyTeamSaved([teamId]);
   if(progressChanged)window.dispatchEvent(new CustomEvent('td77:progression',{detail:{teamId}}));
   if(actualChanged){
    window.dispatchEvent(new CustomEvent('td76:save-synced',{detail:{teamId}}));
    for(const tile of document.querySelectorAll('[data-td74-builder-team]')){
     if(tile.dataset.td74BuilderTeam!==teamId||tile.getAttribute('aria-expanded')==='true')continue;
     const p=team.pokemon[Number(tile.dataset.td74BuilderSlot)];
     const label=p?td41PokemonLabel(p.name):'Add Pokémon';
     tile.innerHTML=(p?`<img loading="lazy" src="${safe(td71StoredArt(p))}" alt="">`:'<span class="td74-builder-add" aria-hidden="true">＋</span>')+`<span class="td74-builder-name">${safe(label)}</span>`;
     tile.setAttribute('aria-label',p?'Edit '+label:label+' '+(Number(tile.dataset.td74BuilderSlot)+1));
    }
    const body=[...document.querySelectorAll('[data-td71-team-body]')].find(node=>node.dataset.td71TeamBody===teamId);
    if(body)body.firstElementChild.textContent=team.pokemon.filter(Boolean).length+'/6 Pokémon';
   }
   status(teamId,description(team));
   return code;
  }catch(error){
   if(intents.get(teamId)===intent&&(!local||teams.includes(local)))status(teamId,error.message);
   throw error;
  }
 }
 function nativeState({teamId,sourceGeneration}={}){
  const {state,status}=td78Store.read();
  const team=td78Store.entry(state,'teams',teamId).value,link=td78Store.entry(state,'links',teamId).value;
  if(status==='corrupt'||status==='missing'||status==='empty')
   return {status:'quarantined',reason:status};
  if(link?.intent==='deleted'||link?.intent==='unlinked'){
   if((link.releaseGenerations||[link.generation-1]).includes(sourceGeneration))return {status:'release-authorized',generation:sourceGeneration};
   return {status:'quarantined',reason:'unmatched-release-generation'};
  }
  if(!team)return {status:'quarantined',reason:'unassociated'};
  const active=linkFor(state,teamId,team);
  if(active.intent==='game-changed')return {status:'quarantined',reason:'game-changed',generation:active.generation};
  if(sourceGeneration!=null&&sourceGeneration!==active.generation&&!active.confirmed)
   return {status:'quarantined',reason:'source-generation-mismatch',generation:active.generation};
  return {status:active.confirmed?'awaiting-native':active.pending?'pending':'associated',generation:active.generation,
   pending:active.pending?.id||null,confirmed:active.confirmed?.id||null};
 }
 function requestKey(requestId){
  if(typeof requestId!=='string'||!/^[a-zA-Z0-9_-]{1,100}$/.test(requestId))throw invalid('A valid replacement request ID is required.','RELINK_ID');
 }
 async function prepareRelink({teamId,requestId,bytes,sourceGeneration}={}){
  requestKey(requestId);
  const parsed=window.takDexGen5Save.parse(bytes);
  const next=await observation(parsed,bytes);
  const outcome=await td78Store.commit(state=>{
   const team=selectedTeam(state,teamId),link=linkFor(state,teamId,team);
   if(parsed.game!==team.game)throw invalid('This save is for '+parsed.game+'.','GAME');
   if(link.confirmed?.id===requestId||link.acknowledged===requestId){
    if(!td78Store.same(link.relinkObservation,next))throw invalid('Replacement request ID belongs to different bytes.','RELINK_ID');
    return {status:'committed',generation:link.generation};
   }
   if(sourceGeneration!==link.generation)throw invalid('The save source changed. Recheck the active link.','SOURCE');
   if(link.cancelled?.includes(requestId))return {status:'cancelled',generation:link.generation};
   if(link.confirmed)throw invalid('A committed replacement needs acknowledgement.','RELINK_PENDING');
   if(link.pending&&!td78Store.same(link.pending,{id:requestId,observation:next}))
    throw invalid('A replacement is already pending. Resume or cancel it first.','RELINK_PENDING');
   td78Store.replace(state,'links',teamId,{...link,pending:{id:requestId,observation:next}});
   return {status:'pending',generation:link.generation,nextGeneration:link.generation+1};
  });
  td78ProjectionWarning(outcome);return outcome.result;
 }
 async function finishRelink({teamId,requestId,sourceGeneration,cancel=false}={}){
  requestKey(requestId);
  const outcome=await td78Store.commit(state=>{
   const team=selectedTeam(state,teamId),link=linkFor(state,teamId,team);
   if(cancel&&(link.confirmed?.id===requestId||link.acknowledged===requestId))return 'committed';
   if(sourceGeneration!==link.generation)return 'stale';
   if(cancel){
    if(link.pending?.id===requestId)td78Store.replace(state,'links',teamId,{...link,pending:null,cancelled:[...(link.cancelled||[]),requestId]});
    return 'cancelled';
   }
   if(link.acknowledged===requestId)return 'acknowledged';
   if(link.confirmed?.id!==requestId)return 'stale';
   td78Store.replace(state,'links',teamId,{...link,confirmed:null,acknowledged:requestId});
   return 'acknowledged';
  });
  td78ProjectionWarning(outcome);return outcome.result;
 }
 async function unlink({teamId,sourceGeneration}={}){
  const outcome=await td78Store.commit(state=>{
   const team=selectedTeam(state,teamId),link=linkFor(state,teamId,team);
   if(link.intent==='unlinked'&&link.generation-1===sourceGeneration)return 'unlinked';
   if(link.generation!==sourceGeneration)return 'stale';
   if(link.pending||link.confirmed)throw invalid('Finish or cancel the pending replacement before unlinking.','RELINK_PENDING');
   td78Store.replace(state,'links',teamId,td78Store.endLink(link,'unlinked',team.game));
   return 'unlinked';
  });
  td78ProjectionWarning(outcome);return outcome.result;
 }
 function description(team) {
  if(team?.saveLink?.exportedSnapshot)return 'Exported progression snapshot';
  if(!team?.saveLink)return 'Read-only save snapshot · Actual progression not synchronized';
  const progress=team.saveLink.progression;
  const milestone=progress?.postgame?'Postgame unlocked':Number.isInteger(progress?.badgeCount)?progress.badgeCount+'/8 badges':'';
  return 'Saved-game snapshot · '+new Date(team.saveLink.syncedAt).toLocaleString()+(milestone?' · '+milestone:'');
 }
 window.takDexSaveSync={synchronize,description,nativeLinks:{inspect:nativeState,prepareRelink,finishRelink,unlink}};
 $('teams').addEventListener('change',async event=>{
  const input=event.target.closest('[data-save-file]');
  const file=input?.files?.[0];
  if (!file) return;
  input.value='';
  const teamId=input.dataset.saveFile;
  try {
   if (file.size!==0x80000) throw Error('Choose a 512 KiB raw Generation V save.');
   const result=await synchronize({teamId,bytes:await file.arrayBuffer(),modifiedAt:file.lastModified,manual:true});
   if (result==='unchanged') status(teamId,description(teams.find(t=>t.id===teamId)));
  } catch(error) { status(teamId,error.message); }
 });
})();
