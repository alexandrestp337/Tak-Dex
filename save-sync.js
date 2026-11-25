/* Bridge for raw save snapshots from a file picker or a future native provider. */
(function () {
 'use strict';
 const forms = {
  351:[10013,10014,10015],386:[10001,10002,10003],413:[10004,10005],
  479:[10008,10009,10010,10011,10012],487:[10007],492:[10006],
  550:[10016],555:[10017],641:[10019],642:[10020],645:[10021],
  646:[10023,10022],647:[10024],648:[10018]
 };
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
   return {...moveGenerationData(m,5,game),name:pretty(m.name),...move};
  }));
  const evolutions=encounters?.mons.filter(row=>row[4]===record.species).map(row=>({id:row[0],name:row[1]}))??null;
  return {id,name:pretty(p.name),canonicalName:p.name,image:p.sprites.other?.['official-artwork']?.front_default||p.sprites.front_default,
   types:historicalTypes(p,game),baseStats:Object.fromEntries(td76HistoricalStats(p,game).map(s=>[s.stat.name,s.base_stat])),
   abilities:historicalAbilities(p,game),ability:lookup.abilities[record.abilityId]||'',weight:p.weight,
   moves:moves.filter(Boolean),item:lookup.items[record.itemId]||'',shiny:record.shiny,
   saveStats:{...record,evolutions}};
 }
 function status(teamId,message) {
  for (const node of document.querySelectorAll('[data-save-status]')) {
   if (node.dataset.saveStatus===teamId) node.textContent=message;
  }
 }
 async function synchronize({teamId,bytes,modifiedAt}={}) {
  const team=teams.find(t=>t.id===teamId);
  if (!team) throw Error('Choose a saved team.');
  const token=Symbol();
  pending.set(teamId,token);
  try {
   const parsed=window.takDexGen5Save.parse(bytes);
   if (parsed.game!==team.game) throw Error('This save is for '+parsed.game+'.');
   const previous=team.saveLink;
   if (previous && modifiedAt && previous.modifiedAt && modifiedAt<previous.modifiedAt) return 'stale';
   const signature=JSON.stringify(parsed.pokemon);
   if (previous?.signature===signature) return 'unchanged';
   const lookup=await names();
   const encounters=await window.takDexDB74.encounter(team.game).catch(()=>null);
   const pokemon=await Promise.all(parsed.pokemon.map(p=>hydrate(p,team.game,lookup,encounters)));
   if (pending.get(teamId)!==token || !teams.includes(team) || team.game!==parsed.game) return 'superseded';
   const oldParty=team.pokemon;
   team.pokemon=Array.from({length:6},(_,i)=>pokemon[i]||null);
   team.saveLink={signature,modifiedAt:modifiedAt||null,syncedAt:Date.now()};
   try { save(); }
   catch(error) {team.pokemon=oldParty;team.saveLink=previous;throw error;}
   for (const tile of document.querySelectorAll('[data-td74-builder-team]')) {
    if (tile.dataset.td74BuilderTeam!==teamId || tile.getAttribute('aria-expanded')==='true') continue;
    const p=team.pokemon[Number(tile.dataset.td74BuilderSlot)];
    const label=p?td41PokemonLabel(p.name):'Add Pokémon';
    tile.innerHTML=(p?`<img loading="lazy" src="${safe(td71StoredArt(p))}" alt="">`:'<span class="td74-builder-add" aria-hidden="true">＋</span>')+`<span class="td74-builder-name">${safe(label)}</span>`;
    tile.setAttribute('aria-label',p?'Edit '+label:label+' '+(Number(tile.dataset.td74BuilderSlot)+1));
   }
   const body=[...document.querySelectorAll('[data-td71-team-body]')].find(node=>node.dataset.td71TeamBody===teamId);
   if (body) body.firstElementChild.textContent=pokemon.length+'/6 Pokémon';
   if (current===team && !$('battlePage').hidden) showBattle();
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
  return team.saveLink ? 'Save snapshot · '+new Date(team.saveLink.syncedAt).toLocaleString() : 'Read-only save snapshot';
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
   const result=await synchronize({teamId,bytes:await file.arrayBuffer(),modifiedAt:file.lastModified});
   if (result==='unchanged') status(teamId,description(teams.find(t=>t.id===teamId)));
   if (result==='stale') status(teamId,'A newer snapshot is already linked.');
  } catch(error) { status(teamId,error.message); }
 });
})();
