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
 const pending = new Map();
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
 async function synchronize({teamId,bytes,modifiedAt,manual=false}={}) {
  const team=teams.find(t=>t.id===teamId);
  if (!team) throw Error('Choose a saved team.');
  const token=Symbol();
  pending.set(teamId,token);
  try {
   const parsed=window.takDexGen5Save.parse(bytes);
   if (parsed.game!==team.game) throw Error('This save is for '+parsed.game+'.');
   const previous=team.saveLink;
   if (!manual && previous?.trainerKey===parsed.trainerKey && ((parsed.sequence-previous.sequence)&0xffff)>=0x8000) return 'stale';
   if (!manual && previous && modifiedAt && previous.modifiedAt && modifiedAt<previous.modifiedAt) return 'stale';
   const signature=JSON.stringify(parsed.pokemon);
   const progress={...(previous?.trainerKey===parsed.trainerKey?previous.progression:{}),...parsed.progression};
   const progressChanged=JSON.stringify(progress)!==JSON.stringify(previous?.progression||{});
   const sameParty=previous?.signature===signature;
   if (!manual&&sameParty&&!progressChanged) return 'unchanged';
   let nextParty=team.pokemon;
   if(manual||!sameParty){
    const lookup=await names();
    const encounters=await window.takDexDB74.encounter(team.game).catch(()=>null);
    const pokemon=await Promise.all(parsed.pokemon.map(p=>hydrate(p,team.game,lookup,encounters)));
    const hydrated=Array.from({length:6},(_,i)=>pokemon[i]||null);
    if(!partyMatches(team.pokemon,hydrated))nextParty=hydrated;
   }
   if(pending.get(teamId)!==token||!teams.includes(team)||team.game!==parsed.game)return 'superseded';
   if(manual&&previous&&nextParty===team.pokemon&&!progressChanged)return 'unchanged';
   const oldParty=team.pokemon;
   team.pokemon=nextParty;
   team.saveLink={signature,progression:progress,trainerKey:parsed.trainerKey,sequence:parsed.sequence,modifiedAt:modifiedAt||null,syncedAt:Date.now()};
   try { save(); }
   catch(error) {team.pokemon=oldParty;team.saveLink=previous;throw error;}
   window.dispatchEvent(new CustomEvent('td77:progression',{detail:{teamId}}));
   if(nextParty===oldParty){status(teamId,description(team));return 'updated';}
   window.dispatchEvent(new CustomEvent('td76:save-synced',{detail:{teamId}}));
   for (const tile of document.querySelectorAll('[data-td74-builder-team]')) {
    if (tile.dataset.td74BuilderTeam!==teamId || tile.getAttribute('aria-expanded')==='true') continue;
    const p=team.pokemon[Number(tile.dataset.td74BuilderSlot)];
    const label=p?td41PokemonLabel(p.name):'Add Pokémon';
    tile.innerHTML=(p?`<img loading="lazy" src="${safe(td71StoredArt(p))}" alt="">`:'<span class="td74-builder-add" aria-hidden="true">＋</span>')+`<span class="td74-builder-name">${safe(label)}</span>`;
    tile.setAttribute('aria-label',p?'Edit '+label:label+' '+(Number(tile.dataset.td74BuilderSlot)+1));
   }
   const body=[...document.querySelectorAll('[data-td71-team-body]')].find(node=>node.dataset.td71TeamBody===teamId);
   if (body) body.firstElementChild.textContent=nextParty.filter(Boolean).length+'/6 Pokémon';
   status(teamId,description(team));
   return 'updated';
  } catch(error) {
   if (pending.get(teamId)===token) status(teamId,error.message);
   throw error;
  } finally {
   if (pending.get(teamId)===token) pending.delete(teamId);
  }
 }
 function description(team) {
  return team?.saveLink ? 'Saved-game snapshot · '+new Date(team.saveLink.syncedAt).toLocaleString() : 'Read-only save snapshot';
 }
 window.takDexSaveSync={synchronize,description};
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
