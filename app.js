const $=id=>document.getElementById(id), games=['Red','Blue','Yellow','Gold','Silver','Crystal','Ruby','Sapphire','Emerald','FireRed','LeafGreen','Diamond','Pearl','Platinum','HeartGold','SoulSilver','Black','White','Black 2','White 2','X','Y','Omega Ruby','Alpha Sapphire','Sun','Moon','Ultra Sun','Ultra Moon','Sword','Shield','Brilliant Diamond','Shining Pearl','Scarlet','Violet'];
const vg={'Red':'red-blue','Blue':'red-blue','Yellow':'yellow','Gold':'gold-silver','Silver':'gold-silver','Crystal':'crystal','Ruby':'ruby-sapphire','Sapphire':'ruby-sapphire','Emerald':'emerald','FireRed':'firered-leafgreen','LeafGreen':'firered-leafgreen','Diamond':'diamond-pearl','Pearl':'diamond-pearl','Platinum':'platinum','HeartGold':'heartgold-soulsilver','SoulSilver':'heartgold-soulsilver','Black':'black-white','White':'black-white','Black 2':'black-2-white-2','White 2':'black-2-white-2','X':'x-y','Y':'x-y','Omega Ruby':'omega-ruby-alpha-sapphire','Alpha Sapphire':'omega-ruby-alpha-sapphire','Sun':'sun-moon','Moon':'sun-moon','Ultra Sun':'ultra-sun-ultra-moon','Ultra Moon':'ultra-sun-ultra-moon','Sword':'sword-shield','Shield':'sword-shield','Brilliant Diamond':'brilliant-diamond-and-shining-pearl','Shining Pearl':'brilliant-diamond-and-shining-pearl','Scarlet':'scarlet-violet','Violet':'scarlet-violet'};
const colors={normal:'#A8A77A',fire:'#EE8130',water:'#6390F0',electric:'#F7D02C',grass:'#7AC74C',ice:'#96D9D6',fighting:'#C22E28',poison:'#A33EA1',ground:'#E2BF65',flying:'#A98FF3',psychic:'#F95587',bug:'#A6B91A',rock:'#B6A136',ghost:'#735797',dragon:'#6F35FC',dark:'#705746',steel:'#B7B7CE',fairy:'#D685AD'};
const chart={normal:{rock:.5,ghost:0,steel:.5},fire:{fire:.5,water:.5,grass:2,ice:2,bug:2,rock:.5,dragon:.5,steel:2},water:{fire:2,water:.5,grass:.5,ground:2,rock:2,dragon:.5},electric:{water:2,electric:.5,grass:.5,ground:0,flying:2,dragon:.5},grass:{fire:.5,water:2,grass:.5,poison:.5,ground:2,flying:.5,bug:.5,rock:2,dragon:.5,steel:.5},ice:{fire:.5,water:.5,grass:2,ice:.5,ground:2,flying:2,dragon:2,steel:.5},fighting:{normal:2,ice:2,rock:2,dark:2,steel:2,poison:.5,flying:.5,psychic:.5,bug:.5,ghost:0,fairy:.5},poison:{grass:2,poison:.5,ground:.5,rock:.5,ghost:.5,steel:0,fairy:2},ground:{fire:2,electric:2,grass:.5,poison:2,flying:0,bug:.5,rock:2,steel:2},flying:{electric:.5,grass:2,fighting:2,bug:2,rock:.5,steel:.5},psychic:{fighting:2,poison:2,psychic:.5,dark:0,steel:.5},bug:{fire:.5,grass:2,fighting:.5,poison:.5,flying:.5,psychic:2,ghost:.5,dark:2,steel:.5,fairy:.5},rock:{fire:2,ice:2,fighting:.5,ground:.5,flying:2,bug:2,steel:.5},ghost:{normal:0,psychic:2,ghost:2,dark:.5},dragon:{dragon:2,steel:.5,fairy:0},dark:{fighting:.5,psychic:2,ghost:2,dark:.5,fairy:.5},steel:{fire:.5,water:.5,electric:.5,ice:2,rock:2,steel:.5,fairy:2},fairy:{fire:.5,fighting:2,poison:.5,dragon:2,dark:2,steel:.5}};
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));const pretty=s=>s.split('-').map(w=>w[0]?.toUpperCase()+w.slice(1)).join(' ');const pill=t=>`<span class="pill" style="--c:${colors[t]||'#777'}">${pretty(t)}</span>`;const chip=m=>`<span class="movechip" style="--c:${colors[m.type]||'#777'}">${safe(m.name)}</span>`;
let teams=JSON.parse(localStorage.getItem('poketact-teams')||'[]'),current=null,slotIndex=0,chosen=null,foe=null,foe2=null,doubleMode=false,names=null,validMoves=[],selectedMoves=[null,null,null,null],lookupVersion=0;const save=()=>localStorage.setItem('poketact-teams',JSON.stringify(teams));
// CacheStorage is larger than localStorage and survives network outages for downloaded records.
const OFFLINE_CACHE='takdex-pokeapi-records-v1';
// V27: resolve name-based lookups to the numbered records stored by the offline downloader.
// PokeAPI list endpoints return canonical numeric URLs, while our UI requests names.
const API_ROOT='https://pokeapi.co/api/v2/';
async function offlineRecord(path){
 if(!('caches' in window))return null;
 const globalCache=await caches.open(OFFLINE_CACHE);
 const names=[OFFLINE_CACHE,...(await caches.keys()).filter(k=>k.startsWith('takdex-reference-v58-'))];
 const refCaches=[globalCache,...await Promise.all(names.slice(1).map(k=>caches.open(k)))];
 const clean=path.replace(/^\/+|\/+$/g,'');
 const direct=[API_ROOT+path,API_ROOT+clean,API_ROOT+clean+'/'];
 for(const cache of refCaches)for(const url of direct){const r=await cache.match(url);if(r)return r.json()}
 const match=clean.match(/^(pokemon|pokemon-species|move|evolution-chain|machine)\/(.+)$/);
 if(!match||/^\d+$/.test(match[2]))return null;
 const listUrl=API_ROOT+match[1]+'?limit='+(['machine'].includes(match[1])?'3000':'2000');
 const wanted=decodeURIComponent(match[2]).toLowerCase();
 for(const cache of refCaches){const list=await cache.match(listUrl);if(!list)continue;const names=(await list.json()).results||[];const entry=names.find(x=>x.name===wanted);if(!entry)continue;const record=await cache.match(entry.url);if(record)return record.json()}
 return null;
}
async function api(path){
 const key='pt-v2:'+path,url=API_ROOT+path;
 try{const cached=localStorage.getItem(key);if(cached)return JSON.parse(cached)}catch{}
 try{const offline=await offlineRecord(path);if(offline)return offline}catch{}
 try{
  const res=await fetch(url);if(!res.ok)throw Error('Pokédex request failed');
  const data=await res.clone().json();
  try{if('caches' in window)await (await caches.open(OFFLINE_CACHE)).put(url,res.clone())}catch{}
  try{localStorage.setItem(key,JSON.stringify(data))}catch{}
  return data;
 }catch(e){
  // Network failed: retry cache in case the service worker/cache became ready.
  try{const offline=await offlineRecord(path);if(offline)return offline}catch{}
  throw e;
 }
}
// Force refresh during an explicit offline pack download, even for previously cached entries.
async function offlineFetch(path){
 const url='https://pokeapi.co/api/v2/'+path;
 const response=await fetch(url,{cache:'reload'});if(!response.ok)throw Error('Download failed: '+path);
 if(!('caches' in window))throw Error('Offline storage unavailable');
 await (await caches.open(OFFLINE_CACHE)).put(url,response.clone());
 return await response.json();
}
// V31: resolve historical typing using PokéAPI past_types; do not trust modern typing in older games.
function historicalTypes(data,game){
 const gen=gameGeneration(game);
 let types=[...(data.types||[])];
 // past_types entries apply to games before the indicated generation.
 for(const entry of [...(data.past_types||[])].sort((a,b)=>{const order={i:1,ii:2,iii:3,iv:4,v:5,vi:6,vii:7,viii:8,ix:9};return (order[b.generation?.name?.split('-').pop()]||0)-(order[a.generation?.name?.split('-').pop()]||0)})){
  const changed=Number((entry.generation?.name||'').match(/generation-(i|ii|iii|iv|v|vi|vii|viii|ix)$/)?.[1] ? ({i:1,ii:2,iii:3,iv:4,v:5,vi:6,vii:7,viii:8,ix:9})[(entry.generation.name.split('-').pop())] : 0);
  if(changed&&gen<changed)types=entry.types;
 }
 return types.slice().sort((a,b)=>a.slot-b.slot).map(t=>t.type.name);
}
async function refreshHistoricalTeamTypes(team){
 if(!team)return;
 const game=team.game, id=team.id;
 let changed=false;
 await Promise.all(team.pokemon.filter(Boolean).map(async p=>{
  try{const data=await api('pokemon/'+p.id);const types=historicalTypes(data,game);
   if(team.game===game&&JSON.stringify(p.types)!==JSON.stringify(types)){p.types=types;changed=true}
  }catch{}
 }));
 if(changed){save();if(current?.id===id){showSlots();if(!$('battlePage').hidden)showBattle()}}
}
async function listNames(){if(!names){names=(await api('pokemon?limit=2000')).results.map(x=>x.name)}return names}
function search(input,results,choose){let token=0;input.addEventListener('input',async()=>{const mine=++token,q=input.value.trim().toLowerCase().replace(/\s+/g,'-');results.hidden=true;if(q.length<2)return;results.innerHTML='<p class="note">Searching…</p>';results.hidden=false;try{const found=(await listNames()).filter(n=>n.includes(q)).slice(0,12);if(mine!==token)return;results.innerHTML=found.map(n=>`<button type="button" data-value="${safe(n)}">${safe(pretty(n))}</button>`).join('')||'<p class="note">No matches</p>'}catch{results.innerHTML='<p class="error">Internet needed for first lookup.</p>'}});results.addEventListener('click',e=>{const b=e.target.closest('[data-value]');if(b){results.hidden=true;input.value=pretty(b.dataset.value);choose(b.dataset.value)}})}
function showTeams(){$('teams').innerHTML=teams.length?teams.map(t=>`<article class="card"><strong>${safe(t.name)}</strong><p>${safe(t.game)} · ${t.pokemon.filter(Boolean).length}/6 Pokémon</p><div class="team-actions"><button data-open="${safe(t.id)}">Open</button><button type="button" data-edit-card="${safe(t.id)}">Edit</button><button type="button" data-export-card="${safe(t.id)}">Export</button></div> <button type="button" class="delete-team-link" data-delete="${safe(t.id)}">Delete team</button></article>`).join(''):'<p>No teams yet.</p>'}
$('teams').onclick=e=>{const open=e.target.closest('[data-open]'),edit=e.target.closest('[data-edit-card]'),exp=e.target.closest('[data-export-card]'),del=e.target.closest('[data-delete]');if(open)openTeam(open.dataset.open);if(edit){openTeam(edit.dataset.editCard);$('editTeam').click()}if(exp){current=teams.find(t=>t.id===exp.dataset.exportCard);$('exportTeam').click()}if(del&&confirm('Permanently delete this team? This cannot be undone.')){teams=teams.filter(t=>t.id!==del.dataset.delete);save();showTeams();$('editor').hidden=true}};
function openTeam(id){current=teams.find(t=>t.id===id);$('editor').hidden=false;$('editorTitle').textContent=current.name;$('editorGame').textContent=current.game;showSlots();enrichTeamMoves();refreshHistoricalTeamTypes(current)}
const evolutionStatus=new Map();
async function checkEvolution(p){const key=p.id+':'+current.game;if(evolutionStatus.has(key))return;try{const s=await api('pokemon-species/'+p.id);const c=await api(s.evolution_chain.url.replace('https://pokeapi.co/api/v2/',''));let node=null;function walk(n){if(n.species.name===s.name)node=n;else n.evolves_to.forEach(walk)}walk(c.chain);const options=node?.evolves_to||[];let available=false;for(const o of options){const candidate=await api('pokemon/'+o.species.name);if(candidate.moves.some(m=>m.version_group_details.some(v=>v.version_group.name===vg[current.game]))){available=true;break}}evolutionStatus.set(key,available);if(current?.pokemon.some(x=>x?.id===p.id))showSlots()}catch{}}
function showSlots(){$('slots').innerHTML=Array.from({length:6},(_,i)=>{const p=current.pokemon[i];return `<article class="slot">${p?`<div class="identity"><img src="${safe(p.image)}" alt=""><div><strong>${safe(p.name)}</strong><div class="pills">${p.types.map(pill).join('')}</div></div></div><div>${p.moves.map(chip).join('')}</div>`:`<strong>Empty slot ${i+1}</strong><p>Add a Pokémon</p>`}<button data-slot="${i}">${p?'Edit':'＋ Add'}</button>${p&&evolutionStatus.get(p.id+':'+current.game)!==false?` <button data-evolve="${i}" ${evolutionStatus.has(p.id+':'+current.game)?'':'disabled'}>${evolutionStatus.has(p.id+':'+current.game)?'↑ Evolve':'Checking evolution…'}</button>`:''}</article>`}).join('');current.pokemon.filter(Boolean).forEach(p=>{if(!evolutionStatus.has(p.id+':'+current.game))checkEvolution(p)})};$('slots').onclick=e=>{const b=e.target.closest('[data-slot]');if(b)editSlot(Number(b.dataset.slot));const ev=e.target.closest('[data-evolve]');if(ev)evolveSlot(Number(ev.dataset.evolve))};
function clearForm(){chosen=null;validMoves=[];selectedMoves=[null,null,null,null];$('pokeInput').value='';$('pokeNickname').value='';$('pokePreview').innerHTML='';$('moveNote').textContent='Select a Pokémon to load its moves.';$('error').hidden=true;$('savePoke').disabled=true;drawMoves()}
function editSlot(i){slotIndex=i;clearForm();$('pokeHeading').textContent=current.pokemon[i]?'Edit Pokémon':'Add Pokémon';$('removePoke').hidden=!current.pokemon[i];$('evolvePoke').hidden=!current.pokemon[i]||evolutionStatus.get(current.pokemon[i]?.id+':'+current.game)===false;$('pokeDialog').showModal();const p=current.pokemon[i];if(p){$('pokeInput').value=p.name;$('pokeNickname').value=p.nickname||'';loadPokemon(p.id,p.moves)}}
async function loadPokemon(name,old=[]){const version=++lookupVersion;$('savePoke').disabled=true;$('moveNote').textContent='Loading moves…';try{const p=await api('pokemon/'+name);if(version!==lookupVersion)return;const types=historicalTypes(p,current.game);const image=p.sprites.other?.['official-artwork']?.front_default||p.sprites.front_default||'';chosen={id:p.id,name:pretty(p.name),types,image,baseSpeed:p.stats.find(s=>s.stat.name==='speed')?.base_stat,baseStats:Object.fromEntries(p.stats.map(s=>[s.stat.name,s.base_stat])),abilities:p.abilities};validMoves=p.moves.filter(m=>m.version_group_details.some(d=>d.version_group.name===vg[current.game])).map(m=>m.move.name);selectedMoves=old.concat([null,null,null,null]).slice(0,4);$('pokePreview').innerHTML=`<div class="identity"><img src="${safe(image)}" alt=""><div><strong>${safe(chosen.name)}</strong><div class="pills">${types.map(pill).join('')}</div></div></div>`;drawMoves();Promise.all(selectedMoves.map(async (m,i)=>{if(m){selectedMoves[i]=await enrichMove(m,gameGeneration(current.game))}})).then(()=>{if(version===lookupVersion)drawMoves()});$('moveNote').textContent=`Moves listed for ${current.game}. Select each attack from the dropdown.`;$('savePoke').disabled=false}catch(e){$('error').hidden=false;$('error').textContent='Could not load Pokémon. Check your connection.'}}
function drawMoves(){$('moveFields').innerHTML=Array.from({length:4},(_,i)=>`<div class="moveRow"><b>${i+1}</b><div><div class="search"><input data-move-input="${i}" autocomplete="off" placeholder="Search attack ${i+1}" value="${safe(selectedMoves[i]?.name||'')}"><div class="suggestions" data-results="${i}" hidden></div></div><div class="moveType" data-type="${i}">${selectedMoves[i]?.type?pill(selectedMoves[i].type)+moveStats(selectedMoves[i]):''}</div></div><button type="button" class="clear" data-clear="${i}">×</button></div>`).join('')}
$('moveFields').addEventListener('input',e=>{const i=e.target.dataset.moveInput;if(i===undefined)return;selectedMoves[+i]=null;const results=document.querySelector(`[data-results="${i}"]`),q=e.target.value.toLowerCase();document.querySelector(`[data-type="${i}"]`).innerHTML='';results.hidden=!q;results.innerHTML=validMoves.filter(n=>n.includes(q.replace(/\s+/g,'-'))).slice(0,12).map(n=>`<button type="button" data-pick="${i}" data-name="${safe(n)}">${safe(pretty(n))}</button>`).join('')||'<p class="note">No matching move for this game</p>'});
$('moveFields').onclick=async e=>{const c=e.target.closest('[data-clear]'),b=e.target.closest('[data-pick]');if(c){const i=+c.dataset.clear;selectedMoves[i]=null;drawMoves()}if(b){const i=+b.dataset.pick,n=b.dataset.name;document.querySelector(`[data-results="${i}"]`).hidden=true;try{const m=await api('move/'+n);selectedMoves[i]={name:pretty(n),...moveGenerationData(m,gameGeneration(current.game)),target:m.target?.name,priority:m.priority||0,metaGeneration:gameGeneration(current.game)};drawMoves()}catch{$('error').hidden=false;$('error').textContent='Could not load move type.'}}};
$('pokeForm').onsubmit=e=>{e.preventDefault();if(!chosen)return;current.pokemon[slotIndex]={...chosen,nickname:$('pokeNickname').value.trim(),moves:selectedMoves.filter(Boolean)};save();showSlots();showTeams();$('pokeDialog').close()};$('evolvePoke').onclick=()=>evolveSlot(slotIndex);$('removePoke').onclick=()=>{current.pokemon[slotIndex]=null;save();showSlots();showTeams();$('pokeDialog').close()};$('cancelPoke').onclick=()=>$('pokeDialog').close();
$('game').innerHTML=games.map(g=>`<option>${g}</option>`).join('');$('game').value='Emerald';$('addTeam').onclick=()=>$('newDialog').showModal();$('cancelNew').onclick=()=>$('newDialog').close();$('newForm').onsubmit=e=>{e.preventDefault();const t={id:String(Date.now())+Math.random().toString(36).slice(2),name:$('teamName').value.trim(),game:$('game').value,pokemon:Array(6).fill(null)};teams.push(t);save();showTeams();$('newDialog').close();$('teamName').value='';openTeam(t.id)};$('closeTeam').onclick=()=>$('editor').hidden=true;$('editTeamGame').innerHTML=games.map(g=>`<option>${g}</option>`).join('');
$('editTeam').onclick=()=>{if(!current)return;$('editTeamName').value=current.name;$('editTeamGame').value=current.game;$('editTeamDialog').showModal()};
$('cancelEditTeam').onclick=()=>$('editTeamDialog').close();
$('editTeamForm').onsubmit=e=>{e.preventDefault();if(!current)return;const name=$('editTeamName').value.trim();if(!name)return;current.name=name;current.game=$('editTeamGame').value;save();showTeams();openTeam(current.id);$('editTeamDialog').close()};
$('exportTeam').onclick=()=>{if(!current)return;const payload={format:'takdex-team',version:1,team:{name:current.name,game:current.game,pokemon:current.pokemon}};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='takdex-'+current.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')+'.json';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),3000)};
$('importTeam').onclick=()=>$('importTeamFile').click();
$('importTeamFile').onchange=async e=>{const file=e.target.files?.[0];if(!file)return;try{if(file.size>2000000)throw Error('File is too large');const data=JSON.parse(await file.text());const t=data?.format==='takdex-team'?data.team:data;if(!t||typeof t.name!=='string'||!games.includes(t.game)||!Array.isArray(t.pokemon)||t.pokemon.length>6)throw Error('Invalid Tak-Dex team file');const pokemon=Array.from({length:6},(_,i)=>{const mon=t.pokemon[i];if(mon==null)return null;if(typeof mon.id!=='number'||typeof mon.name!=='string'||!Array.isArray(mon.moves)||mon.moves.length>4||!Array.isArray(mon.types))throw Error('Invalid Pokémon data');return {...mon,nickname:typeof mon.nickname==='string'?mon.nickname.slice(0,30):''}});const team={id:String(Date.now())+Math.random().toString(36).slice(2),name:t.name.slice(0,40),game:t.game,pokemon};teams.push(team);save();showTeams();$('newDialog').close();openTeam(team.id)}catch(err){alert('Could not import team: '+err.message)}finally{e.target.value=''}};

search($('pokeInput'),$('pokeResults'),n=>loadPokemon(n));search($('foeInput'),$('foeResults'),async n=>{try{const p=await api('pokemon/'+n);foe={name:pretty(p.name),types:historicalTypes(p,current.game),image:p.sprites.other?.['official-artwork']?.front_default||p.sprites.front_default,baseStats:Object.fromEntries(p.stats.map(s=>[s.stat.name,s.base_stat])),abilities:p.abilities};$('foePreview').innerHTML=`<div class="identity"><img src="${safe(foe.image)}"><div><strong>${safe(foe.name)}</strong><div class="pills">${foe.types.map(pill).join('')}</div></div></div>`;showBattle()}catch{$('matchups').textContent='Could not load opponent.'}});

let evolveBusy=false;
async function evolveSlot(i){
 if(evolveBusy)return;
 const old=current?.pokemon[i];if(!old)return;
 evolveBusy=true;
 try{
  const species=await api('pokemon-species/'+old.id);
  const chain=await api(species.evolution_chain.url.replace('https://pokeapi.co/api/v2/',''));
  const options=[];
  function walk(node){if(node.species.name===species.name){for(const e of node.evolves_to)options.push(e)}else for(const e of node.evolves_to)walk(e)}
  walk(chain.chain);
  if(!options.length){alert(old.name+' has no further evolution.');return}
  const choices=[];
  for(const option of options){
   const candidate=await api('pokemon/'+option.species.name);
   const group=vg[current.game];
   const hasMoves=candidate.moves.some(m=>m.version_group_details.some(v=>v.version_group.name===group));
   if(hasMoves)choices.push({candidate,details:option.evolution_details});
  }
  if(!choices.length){alert('No evolution data found for this Pokémon in '+current.game+'.');return}
  let chosenOption=choices[0];
  if(choices.length>1){
   const names=choices.map((c,n)=>`${n+1}. ${pretty(c.candidate.name)}`).join('\n');
   const answer=prompt('Choose an evolution:\n'+names,'1');
   if(answer===null)return;
   chosenOption=choices[Number(answer)-1];if(!chosenOption){alert('Invalid selection');return}
  }
  const detail=chosenOption.details?.[0];
  const hints=[];
  if(detail?.min_level)hints.push('Level '+detail.min_level+'+');
  if(detail?.item)hints.push('Use '+pretty(detail.item.name));
  if(detail?.held_item)hints.push('Hold '+pretty(detail.held_item.name));
  if(detail?.trigger?.name==='trade')hints.push('Trade required');
  if(detail?.min_happiness)hints.push('Friendship requirement');
  const note=hints.length?hints.join(', '):'Evolution conditions may apply';
  if(!confirm(`Evolve ${old.name} into ${pretty(chosenOption.candidate.name)}?\n${note}\n\nPokéTact does not verify that conditions are met. Existing moves will stay unchanged.`))return;
  const p=chosenOption.candidate;
  current.pokemon[i]={id:p.id,name:pretty(p.name),types:historicalTypes(p,current.game),image:p.sprites.other?.['official-artwork']?.front_default||p.sprites.front_default||'',moves:old.moves,baseSpeed:p.stats.find(s=>s.stat.name==='speed')?.base_stat,baseStats:Object.fromEntries(p.stats.map(s=>[s.stat.name,s.base_stat]))};
  save();showSlots();showTeams();if($('pokeDialog').open)$('pokeDialog').close();
 }catch(e){alert('Could not check evolution. Internet may be needed.')}finally{evolveBusy=false}
}
search($('foeInput2'),$('foeResults2'),async n=>{
 try{const p=await api('pokemon/'+n);foe2={name:pretty(p.name),types:historicalTypes(p,current.game),image:p.sprites.other?.['official-artwork']?.front_default||p.sprites.front_default,baseStats:Object.fromEntries(p.stats.map(s=>[s.stat.name,s.base_stat])),abilities:p.abilities};$('foePreview2').innerHTML=`<div class="identity"><img src="${safe(foe2.image)}" alt=""><div><strong>${safe(foe2.name)}</strong><div class="pills">${foe2.types.map(pill).join('')}</div></div></div>`;showBattle()}catch{$('matchups').textContent='Could not load second opponent.'}
});
$('singleMode').onclick=()=>{doubleMode=false;$('secondFoe').hidden=true;$('singleMode').classList.add('selected');$('doubleMode').classList.remove('selected');showBattle()};
$('doubleMode').onclick=()=>{doubleMode=true;$('secondFoe').hidden=false;$('doubleMode').classList.add('selected');$('singleMode').classList.remove('selected');showBattle()};
function gameGeneration(game){
 const i=games.indexOf(game);
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

function moveGenerationData(data,gen){
 let power=data.power,accuracy=data.accuracy,type=data.type?.name,damageClass=data.damage_class?.name;
 // PokeAPI past_values entries describe values BEFORE their generation change.
 const changes=[...(data.past_values||[])].sort((a,b)=>generationFromName(b.version_group?.name)-generationFromName(a.version_group?.name));
 for(const change of changes){
  const changeGen=generationFromName(change.version_group?.name);
  if(changeGen>gen){
   if(Object.hasOwn(change,'power'))power=change.power;
   if(Object.hasOwn(change,'accuracy') && Number.isFinite(change.accuracy))accuracy=change.accuracy; // null past value must not overwrite known numeric accuracy
   if(change.type)type=change.type.name;
  }
 }
 if(gen<=3&&damageClass!=='status'){
  const special=['fire','water','electric','grass','ice','psychic','dragon','dark'];
  damageClass=special.includes(type)?'special':'physical';
 }
 return {power,accuracy,type,damageClass};
}
function generationFromName(name){
 const key=name||'';
 const order=['red-blue','gold-silver','ruby-sapphire','diamond-pearl','black-white','x-y','sun-moon','sword-shield','scarlet-violet'];
 const aliases={yellow:1,crystal:2,emerald:3,'firered-leafgreen':3,platinum:4,'heartgold-soulsilver':4,'black-2-white-2':5,'omega-ruby-alpha-sapphire':6,'ultra-sun-ultra-moon':7,'brilliant-diamond-and-shining-pearl':8};
 if(aliases[key])return aliases[key];
 const i=order.indexOf(key);return i<0?9:i+1;
}
// Relative expected move strength, not a damage calculator. Base stats provide only an approximate ratio.
const ALWAYS_HIT_MOVES=new Set(['Swift','Aerial Ace','Shock Wave','Magical Leaf','Feint Attack','Faint Attack','Shadow Punch','Aura Sphere','Magnet Bomb','Disarming Voice','Smart Strike','Flower Trick']);
const VARIABLE_MOVES=new Set(['Magnitude','Present','Hidden Power','Return','Frustration','Flail','Reversal','Low Kick','Grass Knot','Gyro Ball','Electro Ball','Heavy Slam','Heat Crash','Eruption','Water Spout','Facade','Brine','Payback','Avalanche','Revenge','Assurance','Acrobatics','Hex','Venoshock','Stored Power','Punishment','Fling','Natural Gift','Trump Card','Rollout','Ice Ball','Fury Cutter','Triple Kick','Triple Axel','Beat Up','Seismic Toss','Night Shade','Dragon Rage','Sonic Boom','Super Fang','Endeavor','Psywave','Counter','Mirror Coat','Metal Burst','Bide','Final Gambit','OHKO','Guillotine','Horn Drill','Fissure','Sheer Cold']);
// V39: defensive ability information is loaded from Pokémon records when available.
const ABILITY_IMMUNITIES={levitate:['ground'], 'flash-fire':['fire'], 'water-absorb':['water'], 'storm-drain':['water'], 'dry-skin':['water'], 'volt-absorb':['electric'], 'lightning-rod':['electric'], 'motor-drive':['electric'], 'sap-sipper':['grass'], 'earth-eater':['ground'], 'well-baked-body':['fire']};
function abilityNames(p){return (p.abilities||[]).map(x=>typeof x==='string'?x:x.ability?.name).filter(Boolean)}
function defensiveEffect(move,defender,gen){
 const base=matchup(move.type,defender.types,gen);
 if(base===null||base===0)return base;
 // Do not infer a single ability for Pokémon with multiple possible abilities.
 const abilities=abilityNames(defender);
 if(abilities.length===1&&ABILITY_IMMUNITIES[abilities[0]]?.includes(move.type))return 0;
 return base;
}
function movePowerRange(m){
 const n=m.name;
 const ranges={Return:[1,102,'friendship 0–255'],Frustration:[1,102,'friendship 255–0'],Magnitude:[10,150,'random magnitude'],Present:[0,120,'random; may heal'], 'Hidden Power':[30,70,'IVs (generations 2–5)'],Flail:[20,200,'remaining HP'],Reversal:[20,200,'remaining HP'],'Low Kick':[20,120,'target weight'],'Grass Knot':[20,120,'target weight'],'Gyro Ball':[1,150,'relative Speed'],'Electro Ball':[40,150,'relative Speed'],'Heavy Slam':[40,120,'weight ratio'],'Heat Crash':[40,120,'weight ratio'],Eruption:[1,150,'remaining HP'],'Water Spout':[1,150,'remaining HP'],Facade:[70,140,'status condition'],Brine:[65,130,'target HP'],Payback:[50,100,'turn order'],Avalanche:[60,120,'damage received'],Revenge:[60,120,'damage received'],Assurance:[60,120,'target damaged'],Acrobatics:[55,110,'held item'],Hex:[65,130,'target status'],Venoshock:[65,130,'target poisoned'],'Stored Power':[20,860,'stat boosts'],Punishment:[60,200,'target boosts'],Rollout:[30,480,'consecutive hits'],'Ice Ball':[30,480,'consecutive hits'],'Fury Cutter':[10,160,'consecutive hits']};
 if(n==='Hidden Power'&&m.metaGeneration>=6)return {min:60,max:60,note:'fixed in generations 6+'};
 const r=ranges[n];if(r)return {min:r[0],max:r[1],note:r[2]};
 if(Number.isFinite(m.power)&&m.power>0)return {min:m.power,max:m.power,note:''};
 return null;
}
function accuracyLabel(m){
 if(Number.isFinite(m.accuracy))return m.accuracy+'%';
 if(m.accuracy===null&&(ALWAYS_HIT_MOVES.has(m.name)||m.alwaysHit))return 'Never misses';
 if(m.accuracy===null&&m.damageClass==='status'&&m.target==='user')return 'N/A (self)';
 return 'N/A / conditional';
}
function movePowerText(m){const r=movePowerRange(m);return r?(r.min===r.max?String(r.min):r.min+'–'+r.max)+(r.note?' ('+r.note+')':''):'Variable / special';}
function expectedPower(m,attacker,target,gen){
 const eff=defensiveEffect(m,target,gen);
 if(eff===null||eff===0||m.damageClass==='status'||!movePowerRange(m)||(!Number.isFinite(m.accuracy)&&!(m.accuracy===null&&ALWAYS_HIT_MOVES.has(m.name)))||(!movePowerRange(m)&&VARIABLE_MOVES.has(m.name)))return null;
 const stab=attacker.types.includes(m.type)?1.5:1;
 const atkKey=m.damageClass==='special'?'special-attack':'attack';
 const defKey=m.damageClass==='special'?'special-defense':'defense';
 const a=attacker.baseStats?.[atkKey],b=target.baseStats?.[defKey];
 // Mild stat weighting: no levels/EVs/natures, so avoid pretending this is true damage.
 const statFactor=Number.isFinite(a)&&Number.isFinite(b)?Math.sqrt((a+30)/(b+30)):1;
 return ((movePowerRange(m).min+movePowerRange(m).max)/2)*stab*eff*((m.accuracy===null?100:m.accuracy)/100)*statFactor;
}
function effectivePowerLabel(m){if(m.powerIndex===null||m.powerIndex===undefined)return 'Estimated score —';return 'Attack score '+Math.round(m.powerIndex)}
function moveStats(m){return `<span class="move-stats">PWR ${safe(movePowerText(m))} · ACC ${safe(accuracyLabel(m))}</span>`}
async function enrichMove(m,gen){
 if(m.metaGeneration===gen&&m.power!==undefined&&m.accuracy!==undefined&&m.target!==undefined)return m;
 try{
  const data=await api('move/'+String(m.name).toLowerCase().replace(/\s+/g,'-'));
  const historical=moveGenerationData(data,gen);return {...m,...historical,target:data.target?.name,priority:data.priority||0,alwaysHit:data.meta?.accuracy===null&&data.accuracy===null,metaGeneration:gen};
 }catch{return m}
}
async function enrichTeamMoves(){
 if(!current)return;
 const team=current,gen=gameGeneration(team.game);
 let updated=false;
 for(const p of team.pokemon.filter(Boolean)){
  if(!p.baseStats||!p.abilities){try{const info=await api('pokemon/'+p.id);p.baseStats=Object.fromEntries(info.stats.map(s=>[s.stat.name,s.base_stat]));p.abilities=info.abilities;updated=true}catch{}}
  for(let i=0;i<p.moves.length;i++){
   const m=p.moves[i];
   if(m.metaGeneration!==gen||m.accuracy===undefined||m.target===undefined){
    const next=await enrichMove(m,gen);
    if(next!==m){p.moves[i]=next;updated=true}
   }
  }
 }
 if(updated){save();showSlots()}
 if(current===team&&$('battlePage').hidden===false)showBattle();
}
function analyze(p,opponent,gen){
 const offense=(p.moves||[]).map(m=>{
  const effectiveness=defensiveEffect(m,opponent,gen);
  const stab=p.types.includes(m.type)?1.5:1;
  return {...m,effectiveness,stab,total:effectiveness===null?null:effectiveness*stab};
 }).filter(m=>m.total!==null);
 const scored=offense.map(m=>({...m,powerIndex:expectedPower(m,p,opponent,gen)}));
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
 const mult=defensiveEffect(move,target,gen);
 if(mult===null)return null;
 if(move.damageClass==='status'||move.power===0)return null;
 const stab=attacker.types.includes(move.type)?1.5:1;
 if(!Number.isFinite(move.power)||move.power<=0||(!Number.isFinite(move.accuracy)&&!(move.accuracy===null&&ALWAYS_HIT_MOVES.has(move.name)))||!movePowerRange(move))return null;
 const power=(movePowerRange(move).min+movePowerRange(move).max)/2;
 const spread=spreadTargets.has(move.target);
 const penalty=spread&&gen>=4?.75:1;
 const a=attacker.baseStats?.[move.damageClass==='special'?'special-attack':'attack'];
 const d=target.baseStats?.[move.damageClass==='special'?'special-defense':'defense'];
 const statFactor=Number.isFinite(a)&&Number.isFinite(d)?Math.sqrt((a+30)/(d+30)):1;
 const value=mult*stab*(power/60)*penalty*((move.accuracy===null?100:move.accuracy)/100)*statFactor;
 const allyRisk=ally&&allyHitTargets.has(move.target)?defensiveEffect(move,ally,gen):0;
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
 const who=p=>`<div class="identity"><img src="${safe(p.image||'')}" alt=""><div><strong>${safe(p.name)}</strong><div class="pills">${p.types.map(pill).join('')}</div></div></div>`;
 const actions=plan.actions.map((act,i)=>`<div class="pair-action">${safe(plan.actors[i].name)}: <strong>${safe(act.move.name)}</strong> → ${act.targets.map(t=>safe(opponents[t].name)).join(' + ')}${act.spread?' <span class="note">(spread)</span>':''}${act.allyRisk>0?` <span class="bad">May hit ally (${effectText(act.allyRisk)})</span>`:''}</div>`).join('');
 return `<article class="card rank-card"><div class="rank-header"><span class="rank-number">#${index+1}</span><div class="pair-identities">${who(a)}${who(b)}</div></div>${actions}<p class="note">Potential incoming STAB risk: ${safe(a.name)} ${effectText(plan.risks[0])} · ${safe(b.name)} ${effectText(plan.risks[1])}. Speed tie-breaker uses base Speed only, not actual turn order.</p></article>`;
}
function showBattle(){
 if(!current){$('matchups').innerHTML='<p>Open a team first.</p>';return}
 if(!foe){$('matchups').innerHTML='<p>Select an opponent above.</p>';return}
 if(doubleMode&&!foe2){$('matchups').innerHTML='<p>Select the second opponent to compare both threats.</p>';return}
 const gen=gameGeneration(current.game),opponents=doubleMode?[foe,foe2]:[foe];
 const ranked=current.pokemon.filter(Boolean).map(p=>{
  const reports=opponents.map(o=>analyze(p,o,gen));
  const score=reports.reduce((s,r)=>s+r.score,0)/reports.length;
  return {p,reports,score,worst:Math.max(...reports.map(r=>r.worst))};
 }).sort((a,b)=>b.score-a.score);
 let pairSection='';
 if(doubleMode){
  const members=current.pokemon.filter(Boolean),plans=[];
  for(let i=0;i<members.length;i++)for(let k=i+1;k<members.length;k++){
   const plan=pairPlan(members[i],members[k],opponents,gen);if(plan)plans.push(plan);
  }
  plans.sort((a,b)=>b.rank-a.rank);
  pairSection='<h3 class="subheading">RECOMMENDED PAIRS</h3>'+(plans.length?plans.slice(0,5).map((p,i)=>pairCard(p,i,opponents)).join(''):'<p>Add two Pokémon with damaging attacks to see pair recommendations.</p>')+'<h3 class="subheading">INDIVIDUAL MATCHUPS</h3>';
 }
 const note='Defensive abilities with a single possible ability are considered; ambiguous abilities are not assumed. Variable-power attacks use midpoint estimates, not guaranteed damage. Rankings estimate move strength using power, accuracy, STAB, type effectiveness and available base stats, balanced against potential incoming STAB threats. Not a damage calculator: levels, EVs, natures, items, opponent moves and many conditional effects are not modeled. Moves with unknown power are excluded from Best Move.';
 $('matchups').innerHTML=pairSection+
 ranked.map((r,i)=>{
 const top=r.reports[0],move=top.best;
 const headline=move?`<div class="recommended-move"><small>⚔ BEST MOVE${doubleMode?' VS '+safe(opponents[0].name).toUpperCase():''}</small><strong>${safe(move.name)}</strong><span>${moveStats(move)} · ${effectText(move.effectiveness)} type · ${move.stab>1?'STAB':'No STAB'} · ${effectivePowerLabel(move)}</span></div>`:'<div class="recommended-move"><small>BEST MOVE</small><strong>No attacks saved</strong></div>';
 const defense=r.worst>=4?'HIGH RISK':r.worst>=2?'WEAK DEFENSE':r.worst<1?'RESISTS ATTACKS':'NEUTRAL DEFENSE';
 const rows=r.reports.map((rep,k)=>`<div class="matchup-details"><h4>VS ${safe(opponents[k].name)}</h4><div class="threat-row">Potential incoming STAB: ${rep.threats.map(t=>`${pretty(t.type)} ${effectText(t.multiplier)}`).join(' · ')}</div>${rep.offense.map(m=>`<div class="move-detail-row">${chip(m)}<div class="move-detail-numbers">${moveStats(m)}<b class="${m.total>1?'good':m.total===0?'zero':m.total<1?'bad':''}">${effectText(m.effectiveness)} type · ${m.stab>1?'STAB':'No STAB'} · ${effectivePowerLabel(m)}</b></div></div>`).join('')||'<p>No attacks saved</p>'}</div>`).join('');
 return `<article class="card rank-card ${i===0?'rank-winner':''}"><div class="recommendation-head"><div class="ranking-medal">${i===0?'♛':i+1}</div><div class="identity rank-identity"><div class="rank-portrait"><img src="${safe(r.p.image||'')}" alt=""></div><div class="rank-info"><strong>${safe(r.p.name)}</strong><div class="pills">${r.p.types.map(pill).join('')}</div></div></div><div class="rank-risk ${r.worst>=2?'bad':r.worst<1?'good':''}">${defense}</div></div>${headline}${doubleMode?`<p class="note">Double battle: details against both opponents below.</p>`:''}<details class="expand-details"><summary>View all attacks & defensive matchups <span>⌄</span></summary>${rows}</details></article>`;
 }).join('')||'<p>Add Pokémon to your team to see recommendations.</p>';
 $('matchups').insertAdjacentHTML('beforeend',`<p class="analysis-disclaimer">${note}</p>`);
}
$('teamsTab').onclick=()=>{$('teamsPage').hidden=false;$('battlePage').hidden=true;$('teamsTab').classList.add('selected');$('battleTab').classList.remove('selected')};
$('battleTab').onclick=()=>{$('teamsPage').hidden=true;$('battlePage').hidden=false;$('battleTab').classList.add('selected');$('teamsTab').classList.remove('selected');showBattle();enrichTeamMoves()};function toggleTheme(){document.body.classList.toggle('light');localStorage.setItem('poketact-light',document.body.classList.contains('light'))};if(localStorage.getItem('poketact-light')==='true')document.body.classList.add('light');showTeams();if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js');

// V9 navigation: four real tabs, with the existing battle/team logic retained.
(function(){
 const tabs=['teamsTab','battleTab','dexTab','moreTab'];
 const pages=['teamsPage','battlePage','dexPage','morePage','plannerPage','tmPage'];
 const oldTeam=$('teamsTab').onclick,oldBattle=$('battleTab').onclick;
 function activate(index){
  pages.forEach((id,i)=>$(id).hidden=i!==index);
  tabs.forEach((id,i)=>{$(id).classList.toggle('selected',i===index);$(id).setAttribute('aria-current',i===index?'page':'false')});
  window.scrollTo({top:0,behavior:'instant'});
 }
 $('teamsTab').onclick=()=>{oldTeam?.();activate(0)};
 $('battleTab').onclick=()=>{oldBattle?.();activate(1)};
 $('dexTab').onclick=()=>activate(2);
 $('moreTab').onclick=()=>activate(3);window.takActivate=activate;
 $('moreTheme').onclick=toggleTheme;
 $('dexInput').addEventListener('keydown',e=>{if(e.key==='Enter')$('dexSearch').click()});
})();


// V16 tools: separate 6v6 planning, Pokédex learnsets/evolutions, TM/HM compatibility.
const gameOptions=games.map(g=>`<option value="${safe(g)}">${safe(g)}</option>`).join('');
['dexGame','planGame','tmGame'].forEach(id=>{ $(id).innerHTML=gameOptions; $(id).value=current?.game||'Emerald'; });
function teamOptions(){return '<option value="">Select team…</option>'+teams.map(t=>`<option value="${safe(t.id)}">${safe(t.name)} (${safe(t.game)})</option>`).join('')}
function refreshTeamMenus(){['dexTeam','planTeam','tmTeam'].forEach(id=>{const value=$(id).value;$(id).innerHTML=teamOptions();$(id).value=teams.some(t=>t.id===value)?value:current?.id||''});refreshDexMembers()}
function selectedTeam(id){return teams.find(t=>t.id===$(id).value)}
function refreshDexMembers(){const t=selectedTeam('dexTeam');$('dexTeamPoke').innerHTML='<option value="">Choose Pokémon…</option>'+(t?.pokemon||[]).filter(Boolean).map(p=>`<option value="${p.id}">${safe(p.name)}</option>`).join('');if(t)$('dexGame').value=t.game}
// V28: the Pokédex gets the same autocomplete as the Battle opponent field.
// Selecting a suggestion clears the saved-team member selector so the typed choice wins.
search($('dexInput'),$('dexResults'),name=>{
 $('dexTeamPoke').value='';
 $('dexInput').value=pretty(name);
 $('dexResults').hidden=true;
});
const dexClear=$('dexClear');
function syncDexClear(){dexClear.hidden=!$('dexInput').value.trim()}
$('dexInput').addEventListener('input',()=>{ $('dexTeamPoke').value='';syncDexClear() });
$('dexInput').addEventListener('focus',e=>{if(e.target.value)e.target.select()});
dexClear.addEventListener('click',()=>{$('dexInput').value='';$('dexTeamPoke').value='';$('dexResults').hidden=true;syncDexClear();$('dexInput').focus()});
$('dexTeam').onchange=refreshDexMembers;
$('dexTeamPoke').onchange=()=>{if($('dexTeamPoke').value)$('dexInput').value=$('dexTeamPoke').selectedOptions[0].textContent;syncDexClear()};
// V38: navigate the evolution chain without changing the selected game.
$('dexResult').addEventListener('click',event=>{
 const target=event.target.closest('[data-dex-evolution]');
 if(!target)return;
 const pokemon=target.dataset.dexEvolution;
 if(!pokemon)return;
 $('dexTeamPoke').value='';
 $('dexInput').value=pretty(pokemon);
 $('dexResults').hidden=true;
 syncDexClear();
 $('dexSearch').click();
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
 return (record?.version_group_details||[]).filter(x=>x.version_group?.name===vg[game]);
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
function tak62MoveMethodsText(details,machineItem){
 const methods=[];
 const level=details.filter(d=>d.move_learn_method?.name==='level-up').map(d=>d.level_learned_at).filter(Number.isFinite).sort((a,b)=>a-b);
 if(level.length)methods.push(level[0]>0?'Lv '+level[0]:'Starting / Lv 0 listing');
 if(details.some(d=>d.move_learn_method?.name==='machine'))methods.push(machineItem?machineItem.toUpperCase()+' (confirmed)':'TM/HM · number unverified');
 return methods.join(' · ');
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
async function tak62RenderSmart(host,pokemon,game,isCurrent){
 if(!isCurrent())return;
 host.innerHTML='<p class="note">Checking exact '+safe(game)+' learnsets, TM/HM compatibility and move stats…</p>';
 const gen=gameGeneration(game), types=historicalTypes(pokemon,game);
 const stats=Object.fromEntries((pokemon.stats||[]).map(s=>[s.stat.name,s.base_stat]));
 const applicable=(pokemon.moves||[]).map(x=>({name:x.move.name,details:takMoveMethodsForGame(pokemon,x.move.name,game)}))
  .filter(x=>x.details.some(d=>['machine','level-up'].includes(d.move_learn_method?.name)));
 if(!applicable.length){host.innerHTML='<p class="note">No verified level-up or machine moves are available in this game record. No recommendations can be confirmed.</p>';return}
 let machines=null;
 try{machines=await window.takDexReferenceV58?.machinesFor?.(game)}catch{}
 const lookup=new Map((machines||[]).filter(m=>m.move&&m.item).map(m=>[m.move,m.item]));
 let failures=0;
 const candidates=new Array(applicable.length);
 let cursor=0;
 async function worker(){while(cursor<applicable.length){const i=cursor++,item=applicable[i];
  try{
   const d=await api('move/'+encodeURIComponent(item.name));
   const hist=moveGenerationData(d,gen);
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
  const method=tak62MoveMethodsText(x.details,x.machine);
  const isStab=types.includes(x.hist.type);
  const category=x.hist.damageClass==='special'?'Special':x.hist.damageClass==='physical'?'Physical':'Status';
  const pwr=Number.isFinite(x.hist.power)?'PWR '+x.hist.power+' · ':'';
  const acc=Number.isFinite(x.hist.accuracy)?x.hist.accuracy+'%':'—';
  return `<div class="td62-row"><div class="td62-head"><strong>${safe(pretty(x.name))}</strong>${x.hist.type?pill(x.hist.type):''}${isStab?'<span class="td62-stab">STAB</span>':''}</div><div class="td62-method">${safe(method)}</div><div class="td62-meta">${safe(pwr+category+' · ACC '+acc)}</div></div>`;
 };
 let html='<p class="note">Verified for <b>'+safe(game)+'</b> using this Pokémon’s game-specific learn methods. Attacks are ranked by an approximate base-stat, power, accuracy and STAB score—not simulated damage.</p>';
 html+='<h4>Suggested attacking moves</h4>'+(chosen.length?chosen.map(row).join(''):'<p class="note">No reliable fixed-power attack suggestions found for this game.</p>');
 if(support.length)html+='<h4>Useful support &amp; status moves</h4><p class="note">Support moves have no base power because their effect is not a direct damaging attack. The descriptions below explain their role.</p>'+support.map(x=>{
  const guide=TAK63_SUPPORT_GUIDE[x.name]||['Read its full effect before teaching.','Situational'];
  const priority=tak63SupportPriority(x,stats);
  const label=priority>=88?'Worth considering':'Situational';
  return row(x).replace('</div></div>',`</div><div class="td63-support-desc"><b>${safe(label)}</b> · ${safe(guide[1])}: ${safe(guide[0])}</div></div>`);
 }).join('');
 html+='<p class="note">Only listed level-up and machine methods are confirmed. Egg moves, tutors, event moves, evolution timing, TM acquisition locations and historical status-move effects are not fully evaluated. A TM/HM number is shown only when verified for this game. Some moves have conditional effects, recoil or other drawbacks; check the full move details before using a one-time TM.</p>';
 if(failures)html+='<p class="note">'+failures+' move records could not be loaded; suggestions may be incomplete. Resume your game’s offline pack or reconnect.</p>';
 host.innerHTML=html;
}
function tak62AttachAdvisor(result,pokemon,game,requestId){
 const disclosure=result.querySelector('#td62SmartMoves'),host=result.querySelector('#td62SmartBody');
 if(!disclosure||!host)return;
 let started=false;
 disclosure.addEventListener('toggle',()=>{
  if(!disclosure.open||started)return;
  started=true;
  tak62RenderSmart(host,pokemon,game,()=>requestId===takDexDexRequestV56&&host.isConnected)
   .catch(()=>{if(requestId===takDexDexRequestV56&&host.isConnected)host.innerHTML='<p class="note">Move advice could not load. Check your game pack or internet connection, then reopen this Pokémon.</p>'});
 });
}

let takDexDexRequestV56=0;
$('dexSearch').onclick=async()=>{
 const requestId=++takDexDexRequestV56;
 const name=$('dexTeamPoke').value||$('dexInput').value.trim().toLowerCase().replace(/\s+/g,'-');if(!name)return;
 const game=$('dexGame').value,version=vg[game],result=$('dexResult');result.textContent='Loading Pokémon, evolution chain and level-up moves…';
 try{
  const pokemon=await api('pokemon/'+encodeURIComponent(name));
  const species=await api('pokemon-species/'+pokemon.species.name);
  const chain=await api(species.evolution_chain.url.replace('https://pokeapi.co/api/v2/',''));
  const evo=[];function walk(node,depth){const conditions=node.evolution_details.map(d=>[d.min_level?'Lv '+d.min_level:'',d.item?.name||'',d.trigger?.name==='trade'?'Trade':'',d.min_happiness?'Friendship':'',d.time_of_day||'',d.held_item?.name||'',d.known_move?.name||'',d.location?.name||''].filter(Boolean).join(' · ')).filter(Boolean);evo.push({name:node.species.name,id:Number(node.species.url.match(/\/(\d+)\/$/)?.[1]||0),depth,conditions});node.evolves_to.forEach(n=>walk(n,depth+1))}walk(chain.chain,0);
  // V25: resolve each evolution form independently: typing can change on evolution.
  // A failed lookup leaves a neutral label instead of inventing a type.
  await Promise.all(evo.map(async e=>{
   try{const form=await api('pokemon/'+e.id);e.types=historicalTypes(form,game)}
   catch{e.types=[]}
  }));
  const moves=pokemon.moves.flatMap(m=>m.version_group_details.filter(v=>v.version_group.name===version&&v.move_learn_method.name==='level-up').map(v=>({name:m.move.name,level:v.level_learned_at}))).sort((a,b)=>a.level-b.level||a.name.localeCompare(b.name));
  const unique=[...new Map(moves.map(m=>[m.level+':'+m.name,m])).values()];
  const details=await Promise.all(unique.map(async m=>{try{const data=await api('move/'+m.name);return {...m,...moveGenerationData(data,gameGeneration(game))}}catch{return m}}));
  const img=pokemon.sprites.other?.['official-artwork']?.front_default||pokemon.sprites.front_default||'';
  result.innerHTML=`<article class="card dex-entry"><img src="${safe(img)}" alt=""><div><h3>${safe(pretty(pokemon.name))}</h3><div class="pills">${historicalTypes(pokemon,game).map(pill).join('')}</div><p>${safe(game)} · #${pokemon.id}</p></div></article><h3>Evolutions</h3><div class="card">${evo.map(e=>`<div class="evo-line" style="padding-left:${Math.min(e.depth*14,40)}px">${e.depth?'↳ ':''}<button type="button" class="evo-navigate" data-dex-evolution="${safe(e.name)}" aria-label="View ${safe(pretty(e.name))} in Pokédex"><img class="evo-art" loading="lazy" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${e.id}.png" alt="" onerror="this.style.visibility='hidden'"><span class="evo-description"><strong>${safe(pretty(e.name))}</strong><span class="pills evo-types">${(e.types||[]).map(pill).join('')||'<small>Type unavailable offline</small>'}</span>${e.conditions.length?' <small>('+safe(e.conditions.join(' / '))+')</small>':''}</span></button></div>`).join('')}<p class="note">Evolution availability and special requirements may differ by game. Requirements are shown from species data.</p></div><details class="card td62-smart" id="td62SmartMoves"><summary>✦ Smart Move Advisor <span class="td62-caret" aria-hidden="true">▾</span></summary><div id="td62SmartBody" class="td62-body"><p class="note">Expand to check this Pokémon’s learnable moves in ${safe(game)}.</p></div></details><h3>Level-up learnset · ${safe(game)}</h3><div class="card">${details.length?details.map(m=>`<div class="learn-row"><b>Lv ${m.level}</b><span>${safe(pretty(m.name))}</span>${m.type?pill(m.type):''}${moveStats(m)}</div>`).join(''):'No level-up moves listed for this version.'}</div><section id="td56DexEncounters" aria-live="polite"><h3>Encounter & acquisition records · ${safe(game)}</h3><div class="card"><p class="note">Checking encounter records…</p></div></section>`;
  tak62AttachAdvisor(result,pokemon,game,requestId);
  // V56: render below learnset using a persistent element rather than innerHTML string replacement.
  const renderEncounter=html=>{
   if(requestId!==takDexDexRequestV56)return;
   const host=result.querySelector('#td56DexEncounters');
   if(host)host.innerHTML='<h3>Encounter &amp; acquisition records · '+safe(game)+'</h3><div class="card">'+html+'</div>';
  };
  const noRecords='<p>Recorded wild encounter entries: 0</p><p class="note">This does not rule out gifts, evolution, trades, static encounters or trainer appearances.</p>';
  const sourceFoot='<p class="note">PokéAPI encounter records, not a complete list of ways to obtain this Pokémon.</p>';
  try{
   const cat=window.takDexEncounterV55;
   // The explorer already downloaded this index; no additional request is necessary.
   const pack=cat&&await cat.cached(game);
   if(pack){
    const rec=pack.entries[pokemon.id]||[];
    renderEncounter((pack.hasSource?(rec.length?cat.format(rec):noRecords):'<p class="note">No encounter coverage for this game in the indexed dataset. Availability unknown.</p>')+window.takDexAcquisitionV64.html(pack,pokemon.id)+sourceFoot);
   }else{
    // An ordinary Pokédex search must not trigger the massive 34-game bulk download.
    const records=await api('pokemon/'+pokemon.id+'/encounters');
    const version=game.toLowerCase().replace(/ /g,'-');
    const matches=records.flatMap(r=>(r.version_details||[]).filter(v=>v.version.name===version).map(v=>({area:r.location_area.name,details:v.encounter_details||[]})));
    const content=matches.length?matches.map(r=>'<p><b>'+safe(pretty(r.area))+'</b>: '+r.details.map(d=>safe(pretty(d.method.name))+' · Lv '+d.min_level+(d.max_level!==d.min_level?'–'+d.max_level:'')).join('; ')+'</p>').join(''):noRecords;
    renderEncounter(content+'<p class="note">Individual Pokémon encounter lookup. Download the optional game indexes in More for offline searches.</p>'+sourceFoot);
   }
  }catch(e){renderEncounter('<p class="note">Encounter data could not be loaded. Check your connection or download the selected game’s Encounter Locations pack under More → Offline Data. Availability is unverified.</p>')}

 }catch(e){result.textContent='Could not load data. Check your connection or Pokémon name.'}
};
$('dexGame').onchange=()=>{$('dexTeam').value='';$('dexTeamPoke').innerHTML='';};
function openTool(page,nav){['teamsPage','battlePage','dexPage','morePage','plannerPage','tmPage'].forEach(id=>$(id).hidden=id!==page);['teamsTab','battleTab','dexTab','moreTab'].forEach((id,i)=>$(id).classList.toggle('selected',i===nav));window.scrollTo(0,0)}
$('openPlanner').onclick=()=>{refreshTeamMenus();openTool('plannerPage',3);syncPlanner()};
$('openTM').onclick=()=>{refreshTeamMenus();openTool('tmPage',3);syncTM()};
$('backPlanner').onclick=$('backTM').onclick=()=>window.takActivate(3);
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
let plannerOpp=[],plannerOwn=[];
function plannerPresetSet(){
 const game=$('planGame').value,cat=$('planMode').value;
 if(cat==='custom')return null;
 if(cat==='elite'&&game==='Emerald')return Object.fromEntries(Object.entries(emeraldLeague).map(([n,rows])=>[n,{v1:rows,v2:rows}]));
 return trainerRostersV57[game]?.[cat]||null;
}
function syncPlanner(){
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
 const rematch=!!selected?.v2;
 $('planVersion').disabled=!rematch;
 if(!rematch)$('planVersion').value='v1';
 $('planVersion').querySelector('[value="v2"]').textContent=game==='Emerald'?'Repeat League challenge (same roster)':'Rematch / second challenge';
 const source=trainerSourceV57[game];
 $('eliteNote').innerHTML=custom?'Custom opponent — enter names, levels and known moves.':
   (rosters?`Verified ${modeSelect.value==='gym'?'Gym Leader':modeSelect.value==='story'?'story battle':'League'} Pokémon and levels for ${safe(game)}. ${source?`<a href="${safe(source)}" target="_blank" rel="noopener noreferrer">Roster source</a>. `:''}${modeSelect.value==='gym'&&$('planTrainer').value==='Tate & Liza'?'This is a double battle; planner matchups remain individual. ':''}Opponent moves are only filled when individually verified; otherwise enter known moves for defensive estimates.`:
   'No verified built-in roster for this game and category. Use Custom instead.');
 loadPlannerRoster();importPlannerTeam();
}
function importPlannerTeam(){const t=selectedTeam('planTeam');plannerOwn=(t?.pokemon||[]).filter(Boolean).map(p=>({name:p.name.toLowerCase().replace(/\s+/g,'-'),level:50,moves:p.moves.map(m=>m.name.toLowerCase().replace(/\s+/g,'-'))}));renderPlannerSlots('planOwn',plannerOwn,true)}
function loadPlannerRoster(){
 const rosters=plannerPresetSet(),sel=rosters?.[$('planTrainer').value];
 const row=sel?.[$('planVersion').value]||sel?.v1;
 plannerOpp=row?row.map(([name,level,...moves],i)=>({name,level,moves:($('planGame').value==='Emerald'&&$('planMode').value==='gym'&&$('planVersion').value==='v1'&&td65EmeraldGymMoves[$('planTrainer').value]?.[i])||moves})):Array.from({length:6},()=>({name:'',level:50,moves:[]}));
 renderPlannerSlots('planOpp',plannerOpp,false);
 if($('planMode').value!=='custom')$('planResults').innerHTML='';
}
function plannerMovesFour(e){return Array.from({length:4},(_,i)=>String(e?.moves?.[i]||''))}
function renderPlannerSlots(id,entries,own){
 const container=$(id),open=new Set([...container.querySelectorAll('details.td63-slot[open]')].map(d=>Number(d.dataset.i)));
 container.innerHTML=Array.from({length:6},(_,i)=>{
  const e=entries[i]||{name:'',level:50,moves:[]},name=pretty(e.name||'Empty slot'),lvl=Number(e.level)||50,filled=plannerMovesFour(e).filter(Boolean).length;
  return `<details class="plan-slot td63-slot" data-i="${i}" ${open.has(i)?'open':''}><summary class="td63-slot-summary"><strong>#${i+1} · ${safe(name)}</strong><span>${e.name?'Lv '+lvl+' · '+filled+' move'+(filled===1?'':'s'):'Tap to add Pokémon'}</span><span class="td63-chevron" aria-hidden="true">⌄</span></summary><div class="td63-slot-fields"><label>Pokémon<input data-plan="${own?'own':'opp'}" data-i="${i}" data-field="name" value="${safe(e.name)}" placeholder="Pokémon"></label><label>Lv<input type="number" min="1" max="100" data-plan="${own?'own':'opp'}" data-i="${i}" data-field="level" value="${lvl}"></label><div class="td65-moves-label">Moves · 4 individual slots</div>${plannerMovesFour(e).map((m,j)=>`<div class="td65-move-slot"><span class="td65-move-number">${j+1}</span><div class="search td65-move-search"><input data-plan="${own?'own':'opp'}" data-i="${i}" data-field="move" data-move-index="${j}" autocomplete="off" placeholder="Search move ${j+1}…" value="${safe(pretty(m))}"><button type="button" class="td65-browse" data-move-browse="1" aria-label="Browse moves for slot ${j+1}">▾</button><div class="suggestions td65-move-options" hidden></div></div><button type="button" class="td65-clear" data-plan-clear="1" data-i="${i}" data-own="${own?'own':'opp'}" data-move-index="${j}" aria-label="Clear move">×</button></div>`).join('')}</div></details>`;
 }).join('');
}
function plannerEdit(e){const x=e.target;if(!x.dataset.plan)return;const arr=x.dataset.plan==='own'?plannerOwn:plannerOpp,i=+x.dataset.i;while(arr.length<=i)arr.push({name:'',level:50,moves:[]});const field=x.dataset.field;
 if(field==='move') {arr[i].moves=plannerMovesFour(arr[i]);arr[i].moves[Number(x.dataset.moveIndex)]=x.value.trim().toLowerCase().replace(/\s+/g,'-');}
 else arr[i][field]=field==='level'?Math.max(1,Math.min(100,Number(x.value)||50)):x.value.trim().toLowerCase().replace(/\s+/g,'-');
 const slot=x.closest('.td63-slot'),summary=slot?.querySelector('.td63-slot-summary');
 if(summary){const item=arr[i],title=summary.querySelector('strong'),meta=summary.querySelector('span');
  if(title)title.textContent='#'+(i+1)+' · '+pretty(item.name||'Empty slot');
  if(meta)meta.textContent=item.name?'Lv '+(Number(item.level)||50)+' · '+plannerMovesFour(item).filter(Boolean).length+' moves':'Tap to add Pokémon';
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
  const hit=list.filter(n=>!query||n.includes(query));const shown=hit.slice(0,browse?60:18);
  box.innerHTML=shown.length?shown.map(n=>`<button type="button" data-td65-pick="${safe(n)}">${safe(pretty(n))}</button>`).join('')+(hit.length>shown.length?'<p class="note">Type to narrow the list.</p>':''):'<p class="note">No verified moves for this game. Manual entry is still allowed.</p>';
 }
 const host=$('plannerPage');
 host.addEventListener('input',e=>{const x=e.target;if(x.matches('input[data-move-index][data-plan]')){if(clean(x.value).length>=1)offer(x,false);else closeExcept();}
  if(x.matches('input[data-field="name"][data-plan]')){for(const [k] of dataCache)if(k.startsWith($('planGame').value+':'))dataCache.delete(k)}
 });
 host.addEventListener('click',e=>{const browse=e.target.closest('[data-move-browse]');if(browse){const input=browse.closest('.td65-move-search').querySelector('input');offer(input,true);return}
  const pick=e.target.closest('[data-td65-pick]');if(pick){const box=pick.closest('.td65-move-options'),input=box.closest('.td65-move-search').querySelector('input');input.value=pretty(pick.dataset.td65Pick);plannerEdit({target:input});box.hidden=true;return}
  const clear=e.target.closest('[data-plan-clear]');if(clear){const id=clear.dataset.own==='own'?'planOwn':'planOpp',input=$(id)?.querySelector(`input[data-i="${clear.dataset.i}"][data-move-index="${clear.dataset.moveIndex}"]`);if(input){input.value='';plannerEdit({target:input});input.focus()}closeExcept();return}
  if(!e.target.closest('.td65-move-search'))closeExcept();
 });
 host.addEventListener('keydown',e=>{if(e.key==='Escape'){closeExcept();return}if(e.key==='Enter'&&e.target.matches('input[data-move-index][data-plan]')){const b=e.target.closest('.td65-move-search').querySelector('.td65-move-options:not([hidden]) [data-td65-pick]');if(b){e.preventDefault();b.click()}}});
})();
$('planOwn').addEventListener('input',plannerEdit);$('planOpp').addEventListener('input',plannerEdit);
if(!$('planMode').querySelector('[value="gym"]'))$('planMode').querySelector('[value="elite"]').insertAdjacentHTML('beforebegin','<option value="gym">Gym Leaders</option>');
if(!$('planMode').querySelector('[value="story"]'))$('planMode').querySelector('[value="custom"]').insertAdjacentHTML('beforebegin','<option value="story">Story / Special Battles</option>');
$('planMode').parentElement.firstChild.textContent='Opponent category';
$('planVersion').parentElement.firstChild.textContent='Battle version';
$('planGame').onchange=syncPlanner;$('planMode').onchange=syncPlanner;$('planTrainer').onchange=()=>{loadPlannerRoster();const note=$('eliteNote');if(note){const double=$('planMode').value==='gym'&&$('planTrainer').value==='Tate & Liza';note.dataset.double=String(double);if(double&&!note.textContent.includes('double battle'))note.insertAdjacentHTML('beforeend',' <b>Tate &amp; Liza is a double battle; planner calculations remain individual.</b>')}};$('planVersion').onchange=loadPlannerRoster;$('planTeam').onchange=()=>{const t=selectedTeam('planTeam');if(t){$('planGame').value=t.game;syncPlanner()}else importPlannerTeam()};
async function loadPlannerPokemon(e,gen,game){const p=await api('pokemon/'+encodeURIComponent(e.name));const moves=await Promise.all((e.moves||[]).filter(Boolean).map(async n=>{try{const m=await api('move/'+encodeURIComponent(n));return {name:pretty(m.name),...moveGenerationData(m,gen)}}catch{return {name:pretty(n),power:null}}}));return {id:p.id,name:pretty(p.name),types:historicalTypes(p,game),baseStats:Object.fromEntries(p.stats.map(s=>[s.stat.name,s.base_stat])),abilities:p.abilities,level:e.level,moves}}
function estimateDamage(a,d,m,gen){if(!m||m.damageClass==='status'||!movePowerRange(m))return null;const eff=defensiveEffect(m,d,gen);if(eff===null||eff===0)return 0;const category=m.damageClass==='special'?'special':'physical';const attack=a.baseStats?.[category==='special'?'special-attack':'attack']||70,defense=d.baseStats?.[category==='special'?'special-defense':'defense']||70;
 const power=(movePowerRange(m).min+movePowerRange(m).max)/2;const l=Math.max(1,Math.min(100,a.level||50)),al=Math.max(1,Math.min(100,d.level||50));const atk=Math.floor((2*attack+31)*l/100)+5,def=Math.floor((2*defense+31)*al/100)+5;const stab=a.types.includes(m.type)?1.5:1;return Math.max(1,Math.floor((Math.floor((2*l/5+2)*power*atk/Math.max(1,def)/50)+2)*eff*stab))}
function estimatedHP(p){const hp=p.baseStats?.hp||70,level=Math.max(1,Math.min(100,p.level||50));return Math.floor((2*hp+15)*level/100)+level+10}
function plannerDamageLabel(a,d,m,gen){const high=estimateDamage(a,d,m,gen);if(high===null)return 'Damage varies';const hp=estimatedHP(d);const low=Math.floor(high*.85);return `Est. ${low}–${high} HP (${Math.round(100*low/hp)}–${Math.round(100*high/hp)}%)`}
// V17: rank YOUR whole team independently against EACH opposing Pokémon, in battle order.
function plannerPortrait(p){return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`}
// V64: progressive matchup analysis. Type-only information is always available;
// move-based HP estimates are only shown when an actual damaging move was provided.
function plannerPotentialStab(attacker,defender,gen){
 return [...new Set(attacker.types||[])].map(t=>({type:t,mult:defensiveEffect({type:t,name:'Potential STAB',damageClass:'physical'},defender,gen)})).filter(x=>x.mult!==null);
}
function plannerTypeRisk(threats){const worst=Math.max(...threats.map(t=>t.mult),0);
 return {worst,label:worst>=4?'4× STAB threat':worst>=2?'2× STAB threat':worst===1?'Neutral STAB risk':worst>0?'Resists STAB':'Immune to listed STAB'};
}
function plannerStabLine(threats){return threats.length?threats.map(t=>`${pill(t.type)} <b>${safe(effectText(t.mult))}</b>`).join(' · '):'<span class="note">Opponent typing unavailable.</span>'}
function renderPlannerBattle(own,opp,gen){
 const disclaimer='<p class="analysis-disclaimer">When moves are missing, STAB type matchups show potential exposure, not confirmed opponent moves or HP damage. HP damage is estimated only from entered moves. Estimates assume neutral nature, approximate stats, no items, EVs, boosts, weather or many special mechanics. Unambiguous ability immunities are considered; uncertain abilities are not assumed. All other move effects require verification.</p>';
 return opp.map((d,oi)=>{
  const ranks=own.map(a=>{
   const attacks=(a.moves||[]).map(m=>({m,value:estimateDamage(a,d,m,gen),effectiveness:defensiveEffect(m,d,gen)})).filter(x=>x.value!==null).sort((x,y)=>y.value-x.value);
   const incoming=(d.moves||[]).map(m=>({m,value:estimateDamage(d,a,m,gen),effectiveness:defensiveEffect(m,a,gen)})).filter(x=>x.value!==null).sort((x,y)=>y.value-x.value);
   const outgoingStab=plannerPotentialStab(a,d,gen),incomingStab=plannerPotentialStab(d,a,gen);
   const potential=plannerTypeRisk(incomingStab),knownWorst=incoming[0]?.value??null;
   const best=attacks[0]||null;
   const topOffensiveMult=Math.max(0,...outgoingStab.map(t=>t.mult));
   const bestRealMult=best?.effectiveness??0;
   // Rank both complete and type-only reports; known attacks refine a basic type matchup.
   const offensive=best?(bestRealMult*1.7+Math.min(best.value,180)/70):(topOffensiveMult*1.7);
   const defensive=knownWorst!==null?Math.min(knownWorst/60,3):potential.worst>=4?2:potential.worst>=2?1:potential.worst===0?-.7:potential.worst<1?-.35:0;
   return {a,attacks,incoming,best,outgoingStab,incomingStab,potential,knownWorst,score:offensive-defensive,topOffensiveMult};
  }).sort((a,b)=>b.score-a.score);
  return `<details class="planner-opponent td63-opponent"><summary class="planner-opponent-heading td63-opponent-heading"><div class="planner-opponent-number">${oi+1}</div><div class="planner-opponent-art"><img src="${safe(plannerPortrait(d))}" alt=""></div><div><small>OPPONENT ${oi+1} OF ${opp.length}</small><h3>${safe(d.name)} <span>Lv ${d.level}</span></h3><div class="pills">${d.types.map(pill).join('')}</div></div><span class="td63-chevron" aria-hidden="true">⌄</span></summary><div class="td63-opponent-body"><div class="planner-opponent-moves"><b>Opponent moves:</b> ${d.moves.length?d.moves.map(m=>`<span class="movechip" style="--c:${colors[m.type]||'#777'}">${safe(m.name)}</span>`).join(' '):'<span class="note">Not entered · potential STAB threats shown below</span>'}</div><h4 class="section-label">▥ YOUR TEAM · BEST MATCHUPS</h4>${ranks.map((r,i)=>{
    const b=r.best;
    const headline=b?`<div class="recommended-move"><small>⚔ BEST KNOWN MOVE VS ${safe(d.name).toUpperCase()}</small><strong class="td65-head-move">${safe(b.m.name)} ${pill(b.m.type)}</strong><span>${effectText(b.effectiveness)} effective · ${plannerDamageLabel(r.a,d,b.m,gen)} · ${r.a.types.includes(b.m.type)?'STAB':'No STAB'}</span></div>`:
      `<div class="recommended-move"><small>POTENTIAL OFFENSE · MOVES NOT ENTERED</small><strong>${r.topOffensiveMult?effectText(r.topOffensiveMult)+' STAB potential':'No effective STAB type'}</strong><span>Type matchup only · does not confirm a move is learned</span></div>`;
    const defensiveMult=r.incoming.length?Math.max(...r.incoming.map(x=>x.effectiveness??1)):r.potential.worst;
    const defenseStatus=defensiveMult===0?'Immune':defensiveMult<1?'Resistant':defensiveMult>=2?'Weak defense':'Neutral';
    const risk=defenseStatus+(r.incoming.length?' · known moves':' · potential STAB');
    const detail=r.attacks.length?r.attacks.map(x=>`<div class="learn-row td65-attackline"><div class="td65-attackhead"><b>${safe(x.m.name)}</b>${pill(x.m.type)}</div><span class="td65-attackdetail">${effectText(x.effectiveness)} effective · ${plannerDamageLabel(r.a,d,x.m,gen)}${r.a.types.includes(x.m.type)?' · STAB':''}</span></div>`).join(''):'<p class="note">No damaging attacks entered. Potential STAB type coverage: '+plannerStabLine(r.outgoingStab)+'</p>';
    const defense=r.incoming.length?`<h4>Known opponent attacks against ${safe(r.a.name)} · ${safe(defenseStatus)}</h4>`+r.incoming.map(x=>`<div class="learn-row td65-attackline"><div class="td65-attackhead"><b>${safe(x.m.name)}</b>${pill(x.m.type)}</div><span class="td65-attackdetail">${effectText(x.effectiveness)} effective · ${plannerDamageLabel(d,r.a,x.m,gen)}${d.types.includes(x.m.type)?' · STAB':''}</span></div>`).join(''):'<p class="note">No verified damaging opponent attacks entered; incoming HP damage cannot be estimated. '+safe(defenseStatus)+' (type-only assessment).</p>';
    return `<details class="card rank-card td63-rank ${i===0?'rank-winner':''}"><summary class="recommendation-head"><div class="ranking-medal">${i===0?'♛':i+1}</div><div class="identity rank-identity"><div class="rank-portrait"><img src="${safe(plannerPortrait(r.a))}" alt=""></div><div class="rank-info"><strong>${safe(r.a.name)} · Lv ${r.a.level}</strong><div class="pills">${r.a.types.map(pill).join('')}</div></div></div><div class="rank-risk">${safe(risk)}</div><span class="td63-chevron" aria-hidden="true">⌄</span></summary><div class="td63-rank-body">${headline}<div class="td64-stab"><h4>Potential incoming STAB · type only</h4>${plannerStabLine(r.incomingStab)}<p class="note">These attack types are possible, not confirmed moves.</p></div><details class="expand-details"><summary>Attacks & defensive details <span>⌄</span></summary>${detail}${defense}</details></div></details>`;
   }).join('')}</div></details>`;
 }).join('')+disclaimer;
}
$('planAnalyze').onclick=async()=>{const result=$('planResults');result.textContent='Loading Pokémon and move data…';const game=$('planGame').value,gen=gameGeneration(game);try{
 const own=await Promise.all(plannerOwn.filter(x=>x.name).map(x=>loadPlannerPokemon(x,gen,game)));
 const opp=await Promise.all(plannerOpp.filter(x=>x.name).map(x=>loadPlannerPokemon(x,gen,game)));
 if(!own.length||!opp.length){result.textContent='Enter at least one Pokémon on each side.';return}
 result.innerHTML=renderPlannerBattle(own,opp,gen);
 }catch(e){result.textContent='Could not load battle data. Check Pokémon and move names and your connection.'}
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
 #plannerPage .td63-tools{display:flex;align-items:center;justify-content:flex-end;gap:7px;margin:5px 0 9px}
 #plannerPage .td63-tools button{font-size:.74rem;min-height:32px;padding:6px 9px}
 #plannerPage .td63-tools .td63-section-label{margin-right:auto;font-size:.74rem;color:var(--muted)}
 #plannerPage .td63-opponent>summary:focus-visible,#plannerPage .td63-rank>summary:focus-visible,#plannerPage .td63-slot>summary:focus-visible{outline:2px solid var(--accent,#ed3044);outline-offset:-2px}
 #plannerPage .td63-rank:not([open]){box-shadow:none}
 #plannerPage .td63-rank:not([open]) .rank-risk{align-self:center}
 #plannerPage .td64-stab{border:1px solid var(--edge);border-radius:10px;padding:9px 11px;margin-top:10px;background:color-mix(in srgb,var(--text) 3%,transparent)}
 #plannerPage .td64-stab h4{font-size:.8rem;margin:0 0 6px}
 #plannerPage .td64-stab .pill{font-size:.68rem}
 #plannerPage .td63-rank .rank-risk{max-width:36%;min-width:0;overflow-wrap:anywhere;font-size:.72rem}
 `;document.head.appendChild(style);
 for(const [id,label] of [['planOwn','Your team'],['planOpp','Opponents'],['planResults','Results']]){
  const node=document.getElementById(id);if(!node)continue;
  if(id==='planOwn')node.insertAdjacentHTML('beforebegin','<p class="note td63-level-note">Saved teams do not store Pokémon levels. Imported Pokémon start at Lv 50; update each level for more useful estimates.</p>');
  node.insertAdjacentHTML('beforebegin',`<div class="td63-tools" data-td63-controls="${id}"><span class="td63-section-label">${label}</span><button type="button" data-td63-action="expand" data-td63-for="${id}">Expand all</button><button type="button" data-td63-action="collapse" data-td63-for="${id}">Collapse all</button></div>`);
 }
 document.getElementById('plannerPage').addEventListener('click',event=>{
  const btn=event.target.closest('[data-td63-action]');if(!btn)return;
  const host=document.getElementById(btn.dataset.td63For);if(!host)return;
  const expand=btn.dataset.td63Action==='expand';
  host.querySelectorAll('details.td63-slot,details.td63-opponent,details.td63-rank,details.expand-details').forEach(d=>d.open=expand);
 });
})();

// TM/HM compatibility uses exact version-group machine data, not species move presence alone.
let machineEntries=[];
function machineLabel(m){return m.item.toUpperCase()+' — '+pretty(m.move)}
function setMachineResults(open){
 $('tmMoveResults').hidden=!open;
 $('tmMoveSearch').setAttribute('aria-expanded',String(open));
 $('tmMoveBrowse').setAttribute('aria-expanded',String(open));
}
function machineMatches(q){
 const compact=q.toLowerCase().replace(/[\s-]/g,'');
 return machineEntries.map((m,i)=>({...m,i})).filter(m=>!compact||m.item.includes(compact)||m.move.replace(/-/g,'').includes(compact)||pretty(m.move).toLowerCase().replace(/\s+/g,'').includes(compact)||(/^\d+$/.test(compact)&&String(Number(m.item.replace(/\D/g,'')))===String(Number(compact))));
}
function showMachineResults(q='',all=false){
 const results=$('tmMoveResults');const found=machineMatches(q).slice(0,all?machineEntries.length:25);
 results.innerHTML=found.map(m=>`<button type="button" data-machine="${m.i}">${safe(machineLabel(m))}</button>`).join('')||'<p class="note">No matching TM/HM</p>';
 setMachineResults(true);
}
function renderMachineOptions(){
 const select=$('tmMove');select.innerHTML=machineEntries.map((m,i)=>`<option value="${i}">${safe(machineLabel(m))}</option>`).join('');
 const chosen=machineEntries[Number(select.value)];$('tmMoveSearch').value=chosen?machineLabel(chosen):'';
 setMachineResults(false);
}
function chooseMachine(i){if(!machineEntries[i])return;$('tmMove').value=String(i);$('tmMoveSearch').value=machineLabel(machineEntries[i]);setMachineResults(false)}
$('tmMoveSearch').addEventListener('focus',e=>e.target.select());
$('tmMoveSearch').addEventListener('input',()=>showMachineResults($('tmMoveSearch').value));
$('tmMoveBrowse').addEventListener('click',()=>{
 if(!$('tmMoveResults').hidden){setMachineResults(false);return}
 showMachineResults('',true);
});
$('tmMoveResults').addEventListener('click',e=>{const b=e.target.closest('[data-machine]');if(b)chooseMachine(Number(b.dataset.machine))});
$('tmMoveSearch').addEventListener('keydown',e=>{
 if(e.key==='Escape')setMachineResults(false);
 if(e.key==='ArrowDown'){if($('tmMoveResults').hidden)showMachineResults('',true);$('tmMoveResults').querySelector('[data-machine]')?.focus();e.preventDefault()}
 if(e.key==='Enter'){const b=$('tmMoveResults').querySelector('[data-machine]');if(!$('tmMoveResults').hidden&&b){e.preventDefault();chooseMachine(Number(b.dataset.machine))}}
});
$('tmMoveResults').addEventListener('keydown',e=>{if(e.key==='Escape'){setMachineResults(false);$('tmMoveSearch').focus()}});
document.addEventListener('pointerdown',e=>{if(!e.target.closest('.tm-combo'))setMachineResults(false)});
search($('tmPokemon'),$('tmPokemonResults'),()=>{});
$('tmPokemon').addEventListener('focus',e=>{e.target.select()});
const emeraldMachines=`focus-punch dragon-claw water-pulse calm-mind roar toxic hail bulk-up bullet-seed hidden-power sunny-day taunt ice-beam blizzard hyper-beam light-screen protect rain-dance giga-drain safeguard frustration solar-beam iron-tail thunderbolt thunder earthquake return dig psychic shadow-ball brick-break double-team reflect shock-wave flamethrower sludge-bomb sandstorm fire-blast rock-tomb aerial-ace torment facade secret-power rest attract thief steel-wing skill-swap snatch overheat`.split(' ');
const emeraldHMs=`cut fly surf strength flash rock-smash waterfall dive`.split(' ');
async function syncTM(){const game=$('tmGame').value;const result=$('tmResults');
 const v58Machines=await window.takDexReferenceV58?.machinesFor(game);if(v58Machines){machineEntries=v58Machines;renderMachineOptions();result.textContent=machineEntries.length?'Loaded game-specific TM/HM records from your offline pack.':'No TM/HM records in this game-specific pack.';return;}

 if(game==='Emerald'||game==='Ruby'||game==='Sapphire'||game==='FireRed'||game==='LeafGreen'){
  const hms=(game==='FireRed'||game==='LeafGreen')?emeraldHMs.slice(0,7):emeraldHMs;
  machineEntries=[...emeraldMachines.map((move,i)=>({item:'tm'+String(i+1).padStart(2,'0'),move})),...hms.map((move,i)=>({item:'hm'+String(i+1).padStart(2,'0'),move}))];
  renderMachineOptions();result.textContent='Select a machine and check compatibility.';return;
 }
 result.textContent='Loading game-specific machines… This may take time on the first lookup.';
 try{const list=await api('machine?limit=2000');const found=[];
  // Bounded batches avoid overwhelming mobile browsers and PokéAPI.
  for(let i=0;i<list.results.length;i+=20){const batch=await Promise.all(list.results.slice(i,i+20).map(async r=>{try{const m=await api(r.url.replace('https://pokeapi.co/api/v2/',''));return m.version_group.name===vg[game]?{item:m.item.name,move:m.move.name}:null}catch{return null}}));found.push(...batch.filter(Boolean));if(i%100===0)result.textContent=`Checking machine data… ${Math.min(i+20,list.results.length)} / ${list.results.length}`;}
  machineEntries=found.sort((a,b)=>a.item.localeCompare(b.item,undefined,{numeric:true}));renderMachineOptions();result.textContent=machineEntries.length?'Select a machine and check compatibility.':'No machine data found for this game.';
 }catch{result.textContent='Could not load machine data. First lookup needs internet.'}}
$('tmGame').onchange=syncTM;$('tmTeam').onchange=()=>{const t=selectedTeam('tmTeam');if(t){$('tmGame').value=t.game;syncTM()}};
$('tmCheck').onclick=async()=>{const item=machineEntries[Number($('tmMove').value)],t=selectedTeam('tmTeam'),individual=$('tmPokemon').value.trim().toLowerCase().replace(/\s+/g,'-');if(!item)return;const names=individual?[individual]:(t?.pokemon||[]).filter(Boolean).map(p=>p.name.toLowerCase().replace(/\s+/g,'-'));if(!names.length){$('tmResults').textContent='Select a team or enter a Pokémon.';return}const result=$('tmResults');result.textContent='Checking exact game compatibility…';const checks=await Promise.all(names.map(async name=>{try{const p=await api('pokemon/'+encodeURIComponent(name));const yes=takMachineCompatible(p,item.move,$('tmGame').value);return {name:pretty(p.name),yes}}catch{return {name:pretty(name),error:true}}}));result.innerHTML=`<h3>${safe(item.item.toUpperCase())} · ${safe(pretty(item.move))}</h3>${checks.map(x=>`<div class="card tm-result"><strong>${safe(x.name)}</strong><b class="${x.yes?'good':'bad'}">${x.error?'Unknown':x.yes?'✓ Compatible':'✕ Cannot learn'}</b></div>`).join('')}`};
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
 clear.addEventListener('click',()=>{field.value='';field.dispatchEvent(new Event('input',{bubbles:true}));$(id==='foeInput'?'foePreview':'foePreview2').innerHTML='';if(id==='foeInput')foe=null;else foe2=null;showBattle();field.focus();update()});
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
  status.textContent=p?.complete?'🟢 Offline records downloaded · '+new Date(p.date).toLocaleDateString():p?.done?'🟠 Partial database · '+p.done+' / '+p.total+' files. Tap to resume.':'⚪ Offline database not downloaded';
  btn.textContent=p?.complete?'Update offline database':p?.done?'Resume offline download':'Download offline database';
 };
 const cached=async(url)=>!!(await (await caches.open(OFFLINE_CACHE)).match(url));
 const download=async(url,force=false)=>{
  const cache=await caches.open(url.startsWith(origin)?OFFLINE_CACHE:'takdex-artwork-v26');
  if(!force&&await cache.match(url))return;
  let err;for(let i=0;i<3;i++)try{const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);await cache.put(url,r.clone());return}catch(e){err=e}
  throw err;
 };
 const getList=async(path)=>{
  const url=origin+path;
  let res=await (await caches.open(OFFLINE_CACHE)).match(url);
  if(!res){await download(url);res=await (await caches.open(OFFLINE_CACHE)).match(url)}
  return (await res.json()).results||[];
 };
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
 <p class="note">Choose a game and one or two types to explore offensive and defensive matchups.</p>
 <div class="tool-card"><label>Game<select id="typeCheckGame"></select></label>
 <div class="tc-picker-label">Select up to two types <span id="tcSelectionCount">(0/2)</span></div>
 <div id="typeCheckGrid" class="tc-type-grid" role="group" aria-label="Select up to two Pokémon types"></div></div>
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
 g.value=games.includes('Emerald')?'Emerald':games[0];
 const allTypes=Object.keys(chart);
 let selected=[];
 const typesForGen=gen=>allTypes.filter(t=>gen>=6||t!=='fairy').filter(t=>gen>=2||(t!=='dark'&&t!=='steel'));
 const chip=(t,m)=>`<span class="tc-chip">${pill(t)} <small>${effectText(m)}</small></span>`;
 function group(title,items,empty='None'){
  return `<div class="tc-group"><h3>${title}</h3><div class="tc-chips">${items.length?items.map(x=>chip(x.t,x.m)).join(''):`<span class="note">${empty}</span>`}</div></div>`;
 }
 function render(){
  const gen=gameGeneration(g.value),valid=typesForGen(gen);
  selected=selected.filter(t=>valid.includes(t)).slice(0,2);
  count.textContent=`(${selected.length}/2)`;
  grid.innerHTML=allTypes.map(t=>{
   const active=selected.includes(t),available=valid.includes(t);
   return `<button type="button" class="tc-type-button" data-tc-type="${t}" style="--type-color:${colors[t]}" aria-pressed="${active}" ${available?'':'disabled'}>${pretty(t)}</button>`;
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
 ['teamsTab','battleTab','dexTab','moreTab','openPlanner','openTM','backPlanner','backTM'].forEach(id=>document.getElementById(id)?.addEventListener('click',hide,true));
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
 const platinum={tm13:'Route 216 · Rock Climb after Icicle Badge; or Veilstone Game Corner (10,000 coins)',tm24:'Valley Windworks · Surf behind building; or Veilstone Game Corner (10,000 coins)',tm26:'Wayward Cave · hidden entrance under Cycling Road; also Battle Frontier after Elite Four',tm28:'Ruin Maniac Cave / Route 214',tm29:'Route 210 · Rock Climb; or Veilstone Game Corner',tm30:'Route 210; or Battle Frontier',tm35:'Fuego Ironworks · Surf; or Veilstone Game Corner',tm06:'Route 212 marsh; or Battle Frontier (postgame)',tm17:'Veilstone Department Store · third floor',tm04:'Battle Frontier · 48 BP (postgame)',tm02:'Mt. Coronet · near summit, Rock Climb',tm31:'Oreburgh Gate; or Battle Frontier',tm27:'Sandgem Town · Professor Rowan; also Lost Tower / Game Corner',tm38:'Lake Verity · Surf',tm19:'Route 209 · Surf'};
 const frlg={tm03:'Cerulean Gym · defeat Misty',tm04:'Saffron Gym · defeat Sabrina',tm06:'Fuchsia Gym · defeat Koga',tm13:'Celadon Game Corner · 4,000 coins',tm24:'Celadon Game Corner · 4,000 coins',tm26:'Viridian Gym · defeat Giovanni',tm28:'Cerulean City · robbed house; or Celadon Department Store',tm29:'Saffron City · Mr. Psychic',tm30:'Celadon Game Corner · 4,500 coins',tm31:'S.S. Anne; or Celadon Department Store',tm35:'Celadon Game Corner · 4,000 coins',tm39:'Pewter Gym · defeat Brock',tm19:'Celadon Gym · defeat Erika',tm34:'Vermilion Gym · defeat Lt. Surge',tm44:'Route 9'};
 const reference={Emerald:'https://www.smogon.com/ingame/guides/emerald_itemlocations',Platinum:'https://www.smogon.com/ingame/guides/plat-tms',FireRed:'https://pokemondb.net/firered-leafgreen/tms',LeafGreen:'https://pokemondb.net/firered-leafgreen/tms'};
 function label(game,item){const key=String(item||'').toLowerCase();if(game==='Emerald'){const n=+key.slice(2);return key.startsWith('tm')?emeraldTM[n-1]||null:key.startsWith('hm')?emeraldHM[n-1]||null:null}if(game==='Platinum')return platinum[key]||null;if(game==='FireRed'||game==='LeafGreen')return frlg[key]||null;return null}
 function reuse(game,item){if(String(item).startsWith('hm'))return 'HM · reusable in games with HMs';if(['Brilliant Diamond','Shining Pearl','Scarlet','Violet'].includes(game))return 'Single-use copy · obtainable again through game systems';if(gameGeneration(game)<=4)return 'TM · single-use';if(game==='Sword'||game==='Shield')return String(item).startsWith('tr')?'TR · single-use':'TM · reusable';return 'TM · reusable (where the game has TMs)'}
 const tm=$('tmPage'),box=document.createElement('div');box.id='td65MachineGuide';box.className='card';box.style.cssText='margin:12px 0';
 $('tmResults').parentNode.insertBefore(box,$('tmResults'));
 function update(){const game=$('tmGame').value,item=machineEntries[Number($('tmMove').value)];if(!item){box.innerHTML='<p class="note">Choose a TM/HM to see acquisition information.</p>';return}
  const source=reference[game],where=label(game,item.item),how=reuse(game,item.item);
  box.innerHTML=`<h3 style="margin:0 0 7px">Where to get ${safe(String(item.item).toUpperCase())} · ${safe(pretty(item.move))}</h3><p><b>${where?safe(where):'Location not yet verified for '+safe(game)}</b></p><p class="note">${safe(how)}</p>`+(source?`<p class="note"><a href="${safe(source)}" target="_blank" rel="noopener noreferrer">Location reference ↗</a> · Select another machine to update.</p>`:'<p class="note">Unverified location; no location is invented for this game.</p>');
 }
 $('tmMoveResults').addEventListener('click',()=>setTimeout(update,0));$('tmMoveBrowse').addEventListener('click',()=>setTimeout(update,0));$('tmMoveSearch').addEventListener('keydown',()=>setTimeout(update,0));
 $('tmGame').addEventListener('change',()=>setTimeout(update,800));$('tmTeam').addEventListener('change',()=>setTimeout(update,800));$('tmCheck').addEventListener('click',()=>setTimeout(update,0));
 // Observe the hidden TM select, which is populated asynchronously by the existing loader.
 const obs=new MutationObserver(()=>update());obs.observe($('tmMove'),{childList:true,attributes:true,subtree:false});
 window.takDexMachineGuideV65={label,reuse,update};update();
})();

// V55 — version-indexed encounter catalog. PokéAPI CSV data is parsed locally on demand.
// Verified records do NOT constitute a complete obtainable-Pokémon roster.
(function initEncounterCatalogV55(){
 const ROOT='https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/';
 const CACHE='takdex-encounter-catalog-v55';
 const SOURCE=['versions','pokemon','pokemon_types','pokemon_types_past','types','pokedex_version_groups','pokemon_dex_numbers','encounters','encounter_slots','encounter_methods','encounter_condition_value_map','encounter_condition_values','location_areas','locations','pokemon_species'];
 const MEM=new Map(), IN_FLIGHT=new Map();let lastProgress=()=>{};const TABLES=new Map();
 const key=game=>new URL('takdex-encounters-v55/'+game.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'.json',/^https?:/.test(location.href)?location.href:'https://takdex.invalid/').href;
 function csv(text){const lines=text.trim().split(/\r?\n/),names=lines.shift().split(',');return lines.filter(Boolean).map(line=>{const parts=line.split(',');return Object.fromEntries(names.map((name,i)=>[name,(parts[i]||'').trim()]))})}
 function index(rows,field){return new Map(rows.map(x=>[x[field],x]))}
 const maxIds=[151,251,386,493,649,721,809,905,1025];
 async function cached(game){if(MEM.has(game))return MEM.get(game);if(!('caches'in window))return null;const r=await(await caches.open(CACHE)).match(key(game));if(!r)return null;try{const p=await r.json();if((p.schema===55||p.schema===64)&&p.game===game){MEM.set(game,p);return p}}catch{}return null}
 async function fetchTable(name){if(!TABLES.has(name))TABLES.set(name,(async()=>{const res=await fetch(ROOT+name+'.csv');if(!res.ok)throw Error('PokéAPI '+name+'.csv: HTTP '+res.status);return csv(await res.text())})());return TABLES.get(name)}
 async function buildSelected(selected,progress){
  const data={};let done=0;
  // Grouped fetches avoid saturating mobile connections, while retaining usable progress updates.
  for(let i=0;i<SOURCE.length;i+=4){const batch=SOURCE.slice(i,i+4);await Promise.all(batch.map(async n=>{data[n]=await fetchTable(n);done++;progress('Downloading source tables · '+done+' / '+SOURCE.length)}))}
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
  progress('Saving indexed game packs…');
  if(!('caches' in window))throw Error('Offline CacheStorage is unavailable in this browser');
  const cache=await caches.open(CACHE);
  for(let i=0;i<selected.length;i++){
   const game=selected[i],pack=packs[game];
   await cache.put(key(game),new Response(JSON.stringify(pack),{headers:{'content-type':'application/json'}}));MEM.set(game,pack);
   if(i%5===0)progress('Saving encounter packs · '+(i+1)+' / '+selected.length);
  }
  progress('Encounter index downloaded for '+selected.length+' selected game(s)');window.dispatchEvent(new Event('td58-pack-update'));return packs;
 }
 async function get(game,cb){
  const ready=await cached(game);if(ready)return ready;
  if(!games.includes(game))throw Error('Unsupported game: '+game);
  if(!IN_FLIGHT.has(game))IN_FLIGHT.set(game,buildSelected([game],m=>{lastProgress(m);if(cb)cb(m)}).finally(()=>IN_FLIGHT.delete(game)));
  await IN_FLIGHT.get(game);const pack=await cached(game);if(!pack)throw Error('No encounter pack for '+game);return pack;
 }
 async function refresh(game,cb){if(!games.includes(game))throw Error('Select a supported game');
  if(!IN_FLIGHT.has(game))IN_FLIGHT.set(game,buildSelected([game],m=>{lastProgress(m);if(cb)cb(m)}).finally(()=>IN_FLIGHT.delete(game)));
  await IN_FLIGHT.get(game);return cached(game);
 }
 async function remove(game){MEM.delete(game);if('caches' in window){const cache=await caches.open(CACHE);await cache.delete(key(game))}window.dispatchEvent(new Event('td58-pack-update'))}
 async function clearAll(){MEM.clear();if('caches' in window)await caches.delete(CACHE);window.dispatchEvent(new Event('td58-pack-update'))}
 async function count(){let total=0;for(const g of games)if(await cached(g))total++;return total}
 function format(records){return (records||[]).map(r=>'<p><b>'+safe(pretty(r[0]))+'</b> · '+safe(pretty(r[1]))+' · Lv '+r[2]+(r[3]!==r[2]?'–'+r[3]:'')+(r[4]?.length?' · '+r[4].map(x=>safe(pretty(x))).join(', '):'')+'</p>').join('')}
 window.takDexEncounterV55={get,cached,count,format,refresh,remove,clearAll};
})();

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
  Emerald:{sudowoodo:['Static encounter','Battle Frontier · use Wailmer Pail · Lv 40 (postgame)'],meowth:['In-game trade','Battle Frontier · trade Skitty for Meowth (postgame)']},
  Yellow:{bulbasaur:['Gift','Cerulean City · NPC gift'],charmander:['Gift','Route 24 · NPC gift'],squirtle:['Gift','Vermilion City · NPC gift']}
 };
 function details(pack,id){
  if(!pack)return {label:'Coverage unknown',notes:[],verified:false};
  const mon=(pack.mons||[]).find(p=>p[0]===Number(id));
  if(!mon)return {label:'Not indexed',notes:[],verified:false};
  const notes=[],enc=pack.entries?.[id]||[];
  if(enc.length)notes.push({kind:'Recorded encounter',text:enc.length+' indexed location/method record(s)',verified:true});
  if((starters[pack.game]||'').split(' ').includes(mon[1]))notes.push({kind:'Starter',text:pack.game==='Yellow'?'Professor Oak gives you Pikachu':'Choose one starter at the beginning; other starter choices need another acquisition method',verified:true});
  if(special[pack.game]?.[mon[1]]){const [kind,text]=special[pack.game][mon[1]];notes.push({kind,text,verified:true})}
  if(!notes.length&&mon[4]){
   const seen=new Set([Number(id)]);let parent=mon[4],depth=0;
   while(parent&&depth++<6&&!seen.has(parent)){
    seen.add(parent);const candidate=(pack.mons||[]).find(p=>p[0]===parent);if(!candidate)break;
    if((pack.entries?.[parent]||[]).length||(starters[pack.game]||'').split(' ').includes(candidate[1])||special[pack.game]?.[candidate[1]]){
     notes.push({kind:'Evolution route',text:'Evolves through the '+pretty(candidate[1])+' family; verify evolution requirements and version availability',verified:false});break;
    }
    parent=candidate[4];
   }
  }
  const verified=notes.some(x=>x.verified);
  return {label:verified?notes.find(x=>x.verified).kind:notes.length?'Potential evolution':mon[3]?'Regional Pokédex · unverified':'Availability unverified',notes,verified,regional:!!mon[3],encCount:enc.length};
 }
 function html(pack,id){const info=details(pack,id);
  return (info.notes.length?info.notes.map(n=>`<p><b>${safe(n.kind)}:</b> ${safe(n.text)}${n.verified?'':' <span class="note">(availability unverified)</span>'}</p>`).join(''):'<p class="note">No confirmed gift, evolution, trade or special acquisition record in this dataset.</p>')
   +'<p class="note">These records are intentionally incomplete. Transfer requirements, version exclusives and trainer-only appearances are not comprehensively verified.</p>';
 }
 window.takDexAcquisitionV64={details,html};
})();

// V43 — separate, on-demand Pokédex type explorer. Encounter-backed results only.
(function initTypeExplorer(){
 const dex=$('dexPage');if(!dex||$('typeExplorerPage'))return;
 const btn=document.createElement('button');btn.type='button';btn.id='openTypeExplorer';btn.textContent='◈ By Type';btn.style.cssText='width:auto;display:inline-block;margin:0;padding:7px 13px;border-radius:9px;font-size:.9rem;font-weight:700;cursor:pointer';
 const byTypeRow=document.createElement('div');byTypeRow.id='dexByTypeRow';byTypeRow.style.cssText='display:flex;justify-content:flex-end;align-items:center;flex:0 0 auto;margin:0';byTypeRow.appendChild(btn);const dexHeading=dex.querySelector('h2');if(dexHeading){const header=document.createElement('div');header.id='dexTitleRow';header.style.cssText='display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 12px';dexHeading.parentNode.insertBefore(header,dexHeading);header.appendChild(dexHeading);dexHeading.style.cssText='margin:0;min-width:0';header.appendChild(byTypeRow)}else{dex.insertBefore(byTypeRow,dex.firstChild)}
 const page=document.createElement('section');page.id='typeExplorerPage';page.hidden=true;
 page.innerHTML='<button id="typeExplorerBack" type="button" style="padding:10px;margin-bottom:12px">← Back to Pokédex</button><h2>Explore Pokémon by Type</h2><p class="note">Selected games show Pokémon with positive acquisition evidence by default. All Games shows a broader national catalog. Missing evidence does not mean unobtainable.</p><label for="typeExplorerGame">Game</label><select id="typeExplorerGame"></select><div id="typeExplorerTypes" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin:14px 0"></div><p id="typeExplorerStatus" class="note">Choose a type to explore.</p><div id="typeExplorerResults"></div>';
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
 gameEl.innerHTML='<option value="All Games">All Games · National catalog</option>'+gameOptions;let selected=null,request=0,explorerScroll=0,fromExplorer=false;
 const progressKey=g=>'takdex-v65-progress:'+g;
 const readProgress=g=>{try{return localStorage.getItem(progressKey(g))||'all'}catch{return 'all'}};
 let progress=readProgress(gameEl.value),onlyRecorded=false,includeUnverified=false;
 const filterBox=document.createElement('details');filterBox.id='td65ProgressFilter';filterBox.innerHTML=`<summary>How far are you in the game? <small id="td65MilestoneSummary">Any point in the game</small><span aria-hidden="true">⌄</span></summary><div class="td65-filter-body"><label for="td65Milestone">Progression milestone</label><select id="td65Milestone"><option value="all">Any point in the game</option><option value="early">Before the 3rd Gym</option><option value="preelite">Before the Elite Four</option><option value="postgame">Postgame / everything</option></select><label class="td65-filter-check"><input type="checkbox" id="td65Recorded"> Only recorded wild encounters</label><label class="td65-filter-check"><input type="checkbox" id="td65Unverified"> Include Pokémon with unverified availability</label><p class="note">Progression filtering is strict: unknown encounter timing is never assumed to be early-game. All Games displays the broader national catalog and doesn't apply game-specific milestones.</p></div>`;
 const filterStyle=document.createElement('style');filterStyle.textContent=`
 #typeExplorerPage #td65ProgressFilter{border:1px solid var(--edge);border-radius:12px;margin:11px 0 13px;background:var(--card)}
 #typeExplorerPage #td65ProgressFilter summary{display:flex;align-items:center;gap:8px;cursor:pointer;padding:12px;font-weight:750;list-style:none}
 #typeExplorerPage #td65ProgressFilter summary::-webkit-details-marker{display:none}
 #typeExplorerPage #td65ProgressFilter summary small{font-size:.72rem;color:var(--muted);font-weight:500;margin-left:auto;text-align:right}
 #typeExplorerPage #td65ProgressFilter summary span{color:var(--muted)}
 #typeExplorerPage .td65-filter-body{padding:0 12px 14px}
 #typeExplorerPage .td65-filter-check{display:flex;align-items:center;gap:10px;margin:11px 0;font-size:.87rem}
 #typeExplorerPage .td65-filter-check input{width:auto;flex:none}
 `;document.head.appendChild(filterStyle);
 typeEl.parentNode.insertBefore(filterBox,typeEl);
 const progressEl=filterBox.querySelector('#td65Milestone'),summaryEl=filterBox.querySelector('#td65MilestoneSummary');
 function syncProgress(){progress=readProgress(gameEl.value);progressEl.value=progress;summaryEl.textContent=progressEl.selectedOptions[0]?.textContent||'Any point in the game';progressEl.disabled=gameEl.value==='All Games'}
 progressEl.addEventListener('change',()=>{progress=progressEl.value;try{localStorage.setItem(progressKey(gameEl.value),progress)}catch{};syncProgress();filterBox.open=false;show()});
 filterBox.querySelector('#td65Recorded').addEventListener('change',e=>{onlyRecorded=e.target.checked;show()});
 filterBox.querySelector('#td65Unverified').addEventListener('change',e=>{includeUnverified=e.target.checked;show()});
 syncProgress();
 function go(back,restore=false){dex.hidden=!back;page.hidden=back;if(!back)window.scrollTo(0,restore?explorerScroll:0);else window.scrollTo(0,0)}
 const returnBtn=document.createElement('button');returnBtn.type='button';returnBtn.id='returnToTypeExplorer';returnBtn.textContent='← Back to Explore by Type';returnBtn.style.cssText='display:none;margin:12px 0;padding:11px 14px;border-radius:10px;font-weight:700;cursor:pointer';dex.insertBefore(returnBtn,$('dexResult')||btn);
 function clearOrigin(){fromExplorer=false;returnBtn.style.display='none'}
 returnBtn.onclick=()=>{if(!fromExplorer)return;clearOrigin();go(false,true)};
 $('dexTab').addEventListener('click',clearOrigin);for(const tab of ['teamsTab','battleTab','dexTab','moreTab'])$(tab).addEventListener('click',()=>{if(!page.hidden){page.hidden=true;dex.hidden=tab!=='dexTab';clearOrigin()}});$('dexInput').addEventListener('input',()=>{if(fromExplorer)clearOrigin()});
 $('dexGame').addEventListener('change',()=>{if(fromExplorer)clearOrigin()});
 btn.onclick=()=>{clearOrigin();gameEl.value=$('dexGame').value;syncProgress();selected=null;drawTypes();results.innerHTML='';status.textContent='Choose a type to explore.';go(false)};
 page.querySelector('#typeExplorerBack').onclick=()=>go(true);
 function drawTypes(){const gen=gameEl.value==='All Games'?9:gameGeneration(gameEl.value);typeEl.innerHTML=Object.entries(colors).map(([type,color])=>{const unavailable=(gen<6&&type==='fairy')||(gen<2&&(type==='dark'||type==='steel'));return `<button type="button" data-explore-type="${type}" ${unavailable?'disabled title="Not available in this generation"':''} aria-pressed="${selected===type}" style="background:${color};opacity:${unavailable?'.28':'1'};filter:${unavailable?'grayscale(1)':'none'};color:${['electric','ice','ground','steel','normal'].includes(type)?'#151515':'white'};padding:10px 2px;border-radius:9px;border:${selected===type?'3px solid var(--text,white)':'2px solid transparent'};font-weight:700;cursor:${unavailable?'not-allowed':'pointer'}">${pretty(type)}</button>`}).join('')}
 function label(name){return pretty(name).replace(/\bArea\b$/,'').trim()}
 const intro=page.querySelector('.note');if(intro)intro.textContent='A selected game lists confirmed wild, starter, gift or special evidence and potential evolutions. Unknown entries can be included in Filters; All Games shows a broader species catalog.';
 // Clear, conservative timing. An unverified wild route is not asserted to be accessible before any badge.
 function stage(m){const notes=m.acquisition?.notes||[];
  if(notes.some(n=>/postgame|battle frontier/i.test(n.text)))return 'postgame';
  if(notes.some(n=>n.kind==='Starter'))return 'early';
  // Positive early-game evidence for selected routes only; no badge claims for other areas.
  const places=(m.rec||[]).map(r=>String(r[0]||'').toLowerCase()).join(' | '),game=gameEl.value;
  if(game==='Emerald'&&(/route-(10[1-9]|110|116)(\D|$)/.test(places)||/petalburg-woods|granite-cave|rusturf-tunnel/.test(places)))return 'early';
  if(['FireRed','LeafGreen'].includes(game)&&(/route-(1|2|3|4|5|6|11|22|24|25)(\D|$)/.test(places)||/viridian-forest|mt-moon|digletts-cave/.test(places)))return 'early';
  if(game==='Platinum'&&(/route-(201|202|203|204|205|206|207|208)(\D|$)/.test(places)||/eterna-forest|oreburgh-mine|floaroma-meadow|valley-windworks/.test(places)))return 'early';
  const routes=[...places.matchAll(/route-(\d+)(?:\D|$)/g)].map(x=>Number(x[1]));
  if(game==='Emerald'&&routes.some(n=>n>=101&&n<=134))return 'preelite';
  if(['FireRed','LeafGreen'].includes(game)&&routes.some(n=>n>=1&&n<=23))return 'preelite';
  if(['Platinum','Diamond','Pearl'].includes(game)&&routes.some(n=>n>=201&&n<=223))return 'preelite';
  if(['HeartGold','SoulSilver'].includes(game)&&routes.some(n=>n>=29&&n<=47))return 'preelite';
  if(['Black','White'].includes(game)&&routes.some(n=>n>=1&&n<=10))return 'preelite';
  return null;
 }
 function matchesProgress(m){if(gameEl.value==='All Games'||progress==='all'||progress==='postgame')return true;
  const s=stage(m);if(!s)return false;
  return progress==='preelite'?(s==='early'||s==='preelite'):s==='early';
 }
 function itemHtml(m,hasSource){
  const found=m.rec||[],has=found.length>0;
  const evidence=m.acquisition?.label||(has?'Recorded encounter'+(found.length>1?'s':''):m.regional?'Regional Pokédex · availability unverified':'Availability unverified');
  return `<article class="card td61-entry"><button class="td61-entry-open" type="button" data-explore-pokemon="${safe(m.name)}"><span class="td61-thumb"><img loading="lazy" width="64" height="64" alt="" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${m.id}.png"></span><span class="td61-entry-info"><strong>#${m.id} ${safe(pretty(m.name))}</strong><span class="pills">${m.types.map(pill).join('')}</span><small>${safe(evidence)}</small></span><span class="td61-entry-chevron" aria-hidden="true">›</span></button><details class="td61-entry-details"><summary>${has?'Encounter records ('+found.length+')':hasSource?'No encounter records':'Coverage unknown'}</summary>${has?window.takDexEncounterV55.format(found):'<p class="note">'+(hasSource?'No matching records in the encounter source; this does not mean unobtainable.':'The source has no recorded encounters for this version.')+'</p>'}${m.acquisition?window.takDexAcquisitionV64.html(m.pack,m.id):''}</details></article>`
 }
 async function show(){const token=++request;results.innerHTML='';if(!selected){status.textContent='Choose a type to explore.';return}
  const game=gameEl.value,gen=game==='All Games'?9:gameGeneration(game);status.textContent='Loading '+pretty(selected)+' Pokémon for '+game+'…';
  if(game==='All Games'){
   try{const type=await api('type/'+selected);if(token!==request)return;
    const ids=new Map();for(const row of type.pokemon||[]){const id=+(row.pokemon.url.match(/\/(\d+)\/?$/)||[])[1];if(id>0&&id<=1025&&!ids.has(id))ids.set(id,{id,name:row.pokemon.name,types:[selected],rec:[],acquisition:null,pack:null});}
    const list=[...ids.values()].sort((a,b)=>a.id-b.id);
    results.innerHTML=list.map(m=>itemHtml(m,false)).join('')||'<div class="card">No matching Pokémon.</div>';
    status.textContent=list.length+' national-catalog Pokémon matching '+pretty(selected)+'. Uses current type data; encounter availability differs by game.';
   }catch{if(token===request)status.textContent='All Games catalog unavailable offline. Connect once to load the type catalog.'}
   return;
  }
  try{
   const cat=window.takDexEncounterV55,pack=await cat.get(game,msg=>{if(token===request)status.textContent=msg});if(token!==request)return;
   const matched=pack.mons.filter(m=>m[2].includes(selected)).map(m=>({id:m[0],name:m[1],types:m[2],regional:!!m[3],rec:pack.entries[m[0]]||[],acquisition:window.takDexAcquisitionV64.details(pack,m[0]),pack}));
   // Wild encounters and curated starter/gift/static records count as positive evidence.
   // Evolution paths derived from these records are possible, but may require progression or trading.
   const hasEvidence=m=>m.rec.length>0||Boolean(m.acquisition?.notes?.some(n=>['Starter','Gift','In-game trade','Static encounter','Evolution route'].includes(n.kind)));
   let shown=matched.filter(m=>(includeUnverified||hasEvidence(m))&&(!onlyRecorded||m.rec.length)&&matchesProgress(m));
   results.innerHTML=shown.map(m=>itemHtml(m,pack.hasSource)).join('')||'<div class="card">No confirmed matches with these filters. Open “How far are you in the game?” to include unverified species or change the milestone.</div>';
   const seen=matched.filter(m=>m.rec.length).length,confirmed=matched.filter(hasEvidence).length;
   status.textContent=shown.length+' shown · '+confirmed+' with acquisition evidence · '+seen+' with wild records · '+matched.length+' matching species.'+(progress!=='all'&&progress!=='postgame'?' Unknown encounter timing is excluded from this milestone.':'');
  }catch(e){if(token===request){status.textContent='Game-specific records unavailable. Download a game pack or connect online. No generation-wide fallback is displayed as verified availability.'}}
 }
 typeEl.onclick=e=>{const b=e.target.closest('[data-explore-type]');if(!b||b.disabled)return;selected=selected===b.dataset.exploreType?null:b.dataset.exploreType;drawTypes();show()};
 gameEl.onchange=()=>{request++;const gen=gameEl.value==='All Games'?9:gameGeneration(gameEl.value);if((gen<6&&selected==='fairy')||(gen<2&&['dark','steel'].includes(selected)))selected=null;syncProgress();filterBox.open=false;drawTypes();results.innerHTML='';if(selected)show();else status.textContent='Choose a type to explore.'};
 results.onclick=e=>{const b=e.target.closest('[data-explore-pokemon]');if(!b)return;if(gameEl.value!=='All Games')$('dexGame').value=gameEl.value;$('dexTeam').value='';$('dexTeamPoke').value='';$('dexInput').value=pretty(b.dataset.explorePokemon);explorerScroll=window.scrollY;fromExplorer=true;returnBtn.style.display='block';go(true);$('dexSearch').click()};
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
  <p class="note">Compare two Pokémon before training. Search suggestions are filtered by generation, but actual in-game availability still needs verification.</p>
  <div class="tool-card"><label>Game<select id="td56Game"></select></label>
  <div class="td56-select-grid"><div class="td57-picker"><label for="td56A">Pokémon 1</label><div class="search td56-combo"><input type="text" id="td56A" autocomplete="off" placeholder="Search Pokémon…" aria-expanded="false" aria-controls="td56SuggestionsA"><button type="button" class="td56-arrow" data-picker="A" aria-label="Browse Pokémon 1">▾</button><div class="suggestions" id="td56SuggestionsA" hidden></div></div><div class="td57-evolutions" id="td57StagesA" hidden></div></div>
  <div class="td57-picker"><label for="td56B">Pokémon 2</label><div class="search td56-combo"><input type="text" id="td56B" autocomplete="off" placeholder="Search Pokémon…" aria-expanded="false" aria-controls="td56SuggestionsB"><button type="button" class="td56-arrow" data-picker="B" aria-label="Browse Pokémon 2">▾</button><div class="suggestions" id="td56SuggestionsB" hidden></div></div><div class="td57-evolutions" id="td57StagesB" hidden></div></div></div>
  <button type="button" id="td56Run">Compare Pokémon</button></div>
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
 const game=$('td56Game'),output=$('td56Output'),values={A:null,B:null};let revision=0,open=false;
 game.innerHTML=gameOptions;game.value=current?.game||'Emerald';
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
   const pool=rows.filter(r=>Number((r.url.match(/\/(\d+)\/?$/)||[])[1])<=max).map(r=>r.name);
   const prefix=pool.filter(n=>n.startsWith(q)),other=q?pool.filter(n=>!n.startsWith(q)&&n.includes(q)):[];
   const found=(browse&&!q?pool:prefix.concat(other)).slice(0,45);
   box.innerHTML=found.length?found.map(n=>`<button type="button" data-compare-name="${safe(n)}">${safe(pretty(n))}</button>`).join('')+'<p class="note" style="padding:3px 8px">'+(q?'Type more to narrow results.':'Type to search the full Pokédex.')+'</p>':'<p class="note">No matching Pokémon.</p>';
  }catch{if(mine===revision)box.innerHTML='<p class="note">Pokémon list unavailable. Connect to the internet or download Offline Data.</p>'}
 }
 const evolutionCache=new Map(),stageRun={A:0,B:0};
 function clearStages(k){stageRun[k]++;const box=$('td57Stages'+k);box.hidden=true;box.innerHTML=''}
 async function loadEvolutionStages(k,name){
  const token=++stageRun[k],box=$('td57Stages'+k);
  box.innerHTML='<p class="note">Loading evolution stages…</p>';box.hidden=false;
  try{
   const species=await api('pokemon-species/'+encodeURIComponent(name));
   const url=species.evolution_chain?.url;
   if(!url)throw Error('No chain');
   let entries=evolutionCache.get(url);
   if(!entries){
    const chain=await api(url.replace('https://pokeapi.co/api/v2/',''));
    entries=[];
    function walk(node){
     const name=node.species?.name,id=Number((node.species?.url||'').match(/\/(\d+)\/?$/)?.[1]||0);
     if(name&&id)entries.push({name,id});
     for(const child of node.evolves_to||[])walk(child);
    }
    walk(chain.chain);evolutionCache.set(url,entries);
   }
   if(token!==stageRun[k]||page.hidden)return;
   const available=entries.filter(e=>e.id<=maxPokemon());
   // Forms in this chain from later generations are hidden; game obtainability still unverified.
   if(available.length<2){box.hidden=true;return}
   box.innerHTML='<p class="note">Evolution forms · tap to compare</p><div class="td57-stage-options">'+available.map(e=>`<button type="button" data-evo-name="${safe(e.name)}" data-evo-side="${k}" aria-pressed="${String(e.name===values[k])}">${safe(pretty(e.name))}</button>`).join('')+'</div>';
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
  input.addEventListener('focus',()=>{if(input.value.length>=2)suggestions(k,false)});
  input.addEventListener('keydown',e=>{if(e.key==='Escape'){revision++;closeSuggestions()}if(e.key==='Enter'){const first=box.querySelector('[data-compare-name]');if(!box.hidden&&first){e.preventDefault();pick(k,first.dataset.compareName)}else{e.preventDefault();compare()}}});
  box.addEventListener('click',e=>{const b=e.target.closest('[data-compare-name]');if(b)pick(k,b.dataset.compareName)});
  page.querySelector('[data-picker="'+k+'"]').addEventListener('click',()=>{if(!box.hidden){revision++;closeSuggestions()}else suggestions(k,true)});
 }
 document.addEventListener('pointerdown',e=>{if(open&&!page.hidden&&!e.target.closest('#td56ComparePage .td56-combo')){revision++;closeSuggestions()}});
 const stats=[['HP','hp'],['Attack','attack'],['Defense','defense'],['Sp. Atk','special-attack'],['Sp. Def','special-defense'],['Speed','speed']];
 const statMap=p=>Object.fromEntries((p.stats||[]).map(x=>[x.stat.name,x.base_stat]));
 function defensive(types,gen){const t=Object.keys(colors).filter(t=>gen>=6||t!=='fairy').filter(t=>gen>=2||!['dark','steel'].includes(t));return t.map(x=>({name:x,value:matchup(x,types,gen)})).filter(x=>x.value!==null)}
 function group(types,gen){const effects=defensive(types,gen);return {weak:effects.filter(x=>x.value>1),resist:effects.filter(x=>x.value>0&&x.value<1),immune:effects.filter(x=>x.value===0)}}
 function chips(list){return list.length?list.map(x=>`<span style="display:inline-block;margin:3px">${pill(x.name)} <b>${effectText(x.value)}</b></span>`).join(''):'<span class="note">None</span>'}
 function abilityLabel(p){const found=(p.abilities||[]).map(a=>pretty(a.ability?.name||'')).filter(Boolean);return found.length?found.map(safe).join(' · '):'Not listed'}
 function header(p,types){const img=p.sprites?.other?.['official-artwork']?.front_default||p.sprites?.front_default||'';
  return `<article class="card td56-mon"><img loading="lazy" src="${safe(img)}" alt=""><h3>${safe(pretty(p.name))}</h3><div class="pills" style="justify-content:center">${types.map(pill).join('')}</div><p class="note">#${p.id}</p></article>`;
 }
 let run=0;
 async function compare(){const mine=++run;const n1=values.A||ident($('td56A').value),n2=values.B||ident($('td56B').value);
  closeSuggestions();if(!n1||!n2){output.innerHTML='<p class="note">Choose two Pokémon first.</p>';return}
  const selectedGame=game.value;output.innerHTML='<p class="note">Loading Pokémon stats and types…</p>';
  try{
   const [p1,p2]=await Promise.all([api('pokemon/'+encodeURIComponent(n1)),api('pokemon/'+encodeURIComponent(n2))]);if(mine!==run||selectedGame!==game.value)return;
   if(p1.id>maxPokemon()||p2.id>maxPokemon()){output.innerHTML='<p class="note">A selected Pokémon was introduced after this generation. Choose an older Pokémon.</p>';return}
   const prevA=values.A,prevB=values.B;values.A=p1.name;values.B=p2.name;$('td56A').value=pretty(p1.name);$('td56B').value=pretty(p2.name);if(prevA!==p1.name)loadEvolutionStages('A',p1.name);if(prevB!==p2.name)loadEvolutionStages('B',p2.name);
   const gen=gameGeneration(selectedGame),t1=historicalTypes(p1,selectedGame),t2=historicalTypes(p2,selectedGame),s1=statMap(p1),s2=statMap(p2);
   let html='<div class="td56-cards">'+header(p1,t1)+header(p2,t2)+'</div><article class="card"><h3>Base stat comparison</h3>';
   for(const [label,key] of stats){const a=s1[key]??0,b=s2[key]??0;html+=`<div class="td56-stat-row"><span class="td56-left ${a>b?'td56-win':''}">${a}</span><strong>${label}</strong><span class="td56-right ${b>a?'td56-win':''}">${b}</span></div>`}
   const total1=stats.reduce((a,[,k])=>a+(s1[k]||0),0),total2=stats.reduce((a,[,k])=>a+(s2[k]||0),0);
   html+=`<div class="td56-stat-row"><span class="td56-left ${total1>total2?'td56-win':''}">${total1}</span><strong>Total</strong><span class="td56-right ${total2>total1?'td56-win':''}">${total2}</span></div></article>`;
   const g1=group(t1,gen),g2=group(t2,gen);
   html+='<div class="td56-cards">'+[[p1,g1],[p2,g2]].map(([p,g])=>`<article class="card td56-match"><h3>${safe(pretty(p.name))}</h3><p class="note">Type-chart matchups only. Abilities can alter immunities.</p><h4>Weak to</h4>${chips(g.weak)}<h4>Resists</h4>${chips(g.resist)}<h4>Immune to</h4>${chips(g.immune)}<h4>Abilities (current API)</h4><p class="note">${abilityLabel(p)}</p></article>`).join('')+'</div>';
   const win=(key)=>s1[key]===s2[key]?'Tied':s1[key]>s2[key]?pretty(p1.name):pretty(p2.name);
   html+=`<article class="card"><h3>Quick takeaways</h3><p><b>Faster:</b> ${safe(win('speed'))} · <b>Higher Attack:</b> ${safe(win('attack'))} · <b>Higher Sp. Atk:</b> ${safe(win('special-attack'))}</p><p class="note">Base stats are current PokéAPI values and may have changed in older games; this is not a full battle simulation. Abilities are current API listings and may differ in historical games. Compare actual moves and evolution requirements before committing to training.</p></article>`;
   output.innerHTML=html;
  }catch(e){if(mine===run)output.innerHTML='<p class="note">Unable to load a Pokémon. Check spelling and your internet/offline database.</p>'}
 }
 $('td56Run').onclick=compare;
 game.onchange=()=>{run++;revision++;closeSuggestions();for(const k of ['A','B']){values[k]=null;$('td56'+k).value='';clearStages(k)}output.innerHTML='<p class="note">Choose Pokémon for the selected game. Evolution stages reflect that game’s generation.</p>'};
 launch.onclick=()=>{window.takActivate(3);more.hidden=true;page.hidden=false;open=true;game.value=$('dexGame').value||'Emerald';output.innerHTML='<p class="note">Choose two Pokémon to compare.</p>';window.scrollTo(0,0)};
 $('td56Back').onclick=()=>{page.hidden=true;open=false;revision++;run++;closeSuggestions();window.takActivate(3)};
 for(const tab of ['teamsTab','battleTab','dexTab','moreTab'])$(tab).addEventListener('click',()=>{page.hidden=true;open=false;revision++;run++;closeSuggestions()});
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
 <p class="note">Download a game’s available Pokédex, moves, encounters and artwork in one pack. Games without a pack remain usable online.</p>
 <div class="tool-card"><label for="td59Game">Choose game<select id="td59Game">${gameOptions}</select></label>
 <p class="note" id="td59Legend">🟢 Downloaded · 🟠 Partial · ⚪ Not downloaded</p></div>
 <div class="card td59-card"><h3 id="td59Name">Game data pack</h3>
 <p class="note">Pokémon stats, types, moves, learnsets, evolutions, TM/HM data, wild encounter and acquisition evidence, and artwork. Type calculations and currently supported trainer rosters are built into the app. Acquisition records remain incomplete for many versions.</p>
 <p id="td59State" class="note" aria-live="polite">Checking downloaded data…</p>
 <p id="td59Progress" class="note" aria-live="polite"></p>
 <div class="td59-actions"><button type="button" id="td59Download">Download game pack</button><button type="button" class="td59-delete" id="td59Delete">Remove game pack</button></div></div>
 <div class="card td59-card"><h3>Saved game packs</h3><div id="td59Saved" class="note">Checking storage…</div>
 <button type="button" class="td59-delete td59-clear" id="td59Clear">Clear all downloaded packs and old offline data</button></div>
 <p class="note">A green indicator means reference, encounter index and artwork files are saved, not that every Pokémon is obtainable or all encounter conditions are verified. Artwork downloads can use significant storage. You can resume partial downloads without deleting teams.</p>`;
 document.querySelector('main').appendChild(page);
 const css=document.createElement('style');css.textContent=`
 #td59OfflinePage .td59-card{margin:13px 0;padding:16px}
 #td59OfflinePage .td59-card h3{margin:0 0 9px;font-size:1.05rem}
 #td59OfflinePage .td59-actions{display:flex;gap:9px;flex-wrap:wrap;align-items:center}
 #td59OfflinePage .td59-actions button{flex:1 1 142px;width:auto;min-width:0;padding:11px 9px;font-size:.9rem}
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
   const meta=await r.json();return meta.schema===60&&meta.game===g?meta:null;
  }catch{return null}
 }
 // Pack artwork is intentionally stored under the ORIGINAL image URLs, so all screens
 // (Pokédex, evolutions, Battle, 6v6, comparison and explorer) share one image cache.
 async function downloadArtwork(g,report){
  if(!('caches' in window))throw Error('Offline image storage unavailable');
  const store=await caches.open(artCacheName(g));
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
   while(next<urls.length){const url=urls[next++];let hit=false;
    try{
     const old=await store.match(url);
     if(old){hit=true;saved++}
     else {
      let lastError;
      for(let attempt=0;attempt<2&&!hit;attempt++){
       try{
        const response=await fetch(url,{mode:'cors',cache:'no-store'});
        if(!response.ok)throw Error('Image HTTP '+response.status);
        if(!((response.headers.get('content-type')||'').toLowerCase().startsWith('image/')))throw Error('Not an image');
        await store.put(url,response.clone());
        bytes+=Number(response.headers.get('content-length'))||0;
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
  const meta={schema:60,game:g,complete:failed===0,expected:urls.length,completed,saved,failed,bytes,created:new Date().toISOString()};
  await store.put(artKey(g),new Response(JSON.stringify(meta),{headers:{'Content-Type':'application/json'}}));
  window.dispatchEvent(new Event('td58-pack-update'));
  if(failed)throw Error(failed+' image files could not be downloaded. Retry to resume.');
  return meta;
 }
 async function removeArtwork(g){if('caches' in window)await caches.delete(artCacheName(g));window.takDexArtV60?.reset?.();}
 const taskState={busy:false,token:0};let visible=false;
 const fetchJSON=async url=>{const res=await fetch(url,{cache:'no-store'});if(!res.ok)throw Error('HTTP '+res.status+' · '+url);return res.json()};
 const rows=text=>{const lines=text.trim().split(/\r?\n/),head=lines.shift().split(',');return lines.filter(Boolean).map(line=>{const parts=line.split(',');return Object.fromEntries(head.map((h,i)=>[h,(parts[i]||'').trim()]))})};
 async function cachedReference(g){if(!('caches'in window))return null;
  if(!(await caches.keys()).includes(refCacheName(g)))return null;
  const found=await(await caches.open(refCacheName(g))).match(refKey(g));
  if(!found)return null;try{const d=await found.json();return d.schema===58&&d.game===g?d:null}catch{return null}}
 async function machinesFor(g){const meta=await cachedReference(g);return meta?.machines||null}
 window.takDexReferenceV58={machinesFor,cached:cachedReference};
 async function downloadReference(g,report){
  if(!('caches' in window))throw Error('Offline storage not supported by this browser');
  const store=await caches.open(refCacheName(g));
  const prior=await cachedReference(g);
  let saved=0,failed=0,requests=0;const failures=[];
  if(!prior?.complete)await store.put(refKey(g),new Response(JSON.stringify({schema:58,game:g,complete:false,created:new Date().toISOString(),saved:0,requests:0,failed:0,machines:[]}),{headers:{'content-type':'application/json'}}));
  const progress=msg=>report(msg+' · '+saved+' saved / '+requests+' checked'+(failed?' · '+failed+' failed':''));
  async function put(url){requests++;if(await store.match(url)){saved++;return null}
   let error;for(let retry=0;retry<2;retry++)try{const res=await fetch(url,{cache:'no-store'});if(!res.ok)throw Error('HTTP '+res.status);const data=await res.clone().json();await store.put(url,res.clone());saved++;return data}catch(e){error=e}
   failed++;failures.push(url);return null;
  }
  async function work(urls,label,process){let n=0;let next=0;progress(label);
   const unique=[...new Set(urls)];
   async function run(){while(next<unique.length){const url=unique[next++];let data;
    // Needed when a previously downloaded Pokémon record is used to discover its moves.
    const hit=await store.match(url);if(hit){saved++;requests++;try{data=await hit.json()}catch{data=null}}
    else data=await put(url);
    if(data&&process)process(data);
    n++;if(n%15===0||n===unique.length)progress(label+' · '+n+'/'+unique.length);
   }}
   await Promise.all(Array.from({length:Math.min(5,unique.length||1)},run));
  }
  const lists=['pokemon?limit=2000','pokemon-species?limit=2000','move?limit=2000','evolution-chain?limit=1000'];
  progress('Saving Pokémon search indexes');
  for(const p of lists)await put(BASE+p);
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
   const files=await Promise.all(['machines','version_groups','items','moves'].map(async n=>{
    const res=await fetch(CSV_ROOT+n+'.csv');if(!res.ok)throw Error(n+' CSV unavailable');return rows(await res.text());
   }));
   const [machineRows,versionGroups,items,moves]=files;
   const correctedGroup=chosenGroup==='brilliant-diamond-and-shining-pearl'?'brilliant-diamond-shining-pearl':chosenGroup;
   const groupId=versionGroups.find(x=>x.identifier===correctedGroup)?.id;
   if(!groupId)throw Error('No TM/HM group for '+g);
   const itemMap=new Map(items.map(x=>[x.id,x.identifier]));const moveMap=new Map(moves.map(x=>[x.id,x.identifier]));
   machines=machineRows.filter(x=>x.version_group_id===groupId).map(x=>({item:itemMap.get(x.item_id),move:moveMap.get(x.move_id)})).filter(x=>x.item&&x.move);
   machines.sort((a,b)=>a.item.localeCompare(b.item,undefined,{numeric:true}));
   if(!machines.length)throw Error('Game-specific TM/HM list unavailable in PokéAPI CSV');
  }catch(e){failed++;failures.push('TM/HM catalog: '+e.message)}
  const previous=await cachedReference(g);
  const meta={schema:58,game:g,complete:failed===0,created:new Date().toISOString(),saved,requests,failed,machines,
   note:'Generation-filtered reference records, not verified game-specific obtainable roster'};
  // Never replace a previously complete manifest with an incomplete retry.
  if(!previous?.complete||meta.complete)await store.put(refKey(g),new Response(JSON.stringify(meta),{headers:{'content-type':'application/json'}}));
  window.dispatchEvent(new Event('td58-pack-update'));
  if(failed)throw Error(failed+' records could not be saved. Retry to resume; existing records are preserved.');
  return meta;
 }
 async function removeReference(g){if('caches' in window)await caches.delete(refCacheName(g));window.dispatchEvent(new Event('td58-pack-update'))}

 // A pack is 'downloaded' only if both indexes have positive coverage and reference download completed.
 function statusFor(ref,enc,art){return ref?.complete&&enc?.hasSource&&enc?.schema>=64&&art?.complete?'ready':ref||enc||art?'partial':'missing'}
 const iconFor={ready:'🟢',partial:'🟠',missing:'⚪'};
 let statusMap=new Map(games.map(g=>[g,'missing']));
 let statusVersion=0,refreshing=false;
 const gameSelectIds=['game','editTeamGame','dexGame','planGame','tmGame','typeCheckGame','typeExplorerGame','td56Game','td59Game'];
 // Explicit option.value is critical: Team dialog options used to derive their value from text.
 function decorateGameSelects(){
  for(const id of gameSelectIds){const select=$(id);if(!select)continue;
   for(const option of select.options){const name=option.dataset.td59Game||option.value;
    if(!games.includes(name))continue;
    if(!option.dataset.td59Game){option.value=name;option.dataset.td59Game=name}
    const label=iconFor[statusMap.get(name)||'missing']+' '+name;
    if(option.textContent!==label)option.textContent=label;
   }
  }
 }
 async function refreshStatusMap(){
  if(refreshing){statusVersion++;return}
  refreshing=true;const my=++statusVersion;
  try{
   const records=await Promise.all(games.map(async g=>{
    const [ref,enc,art]=await Promise.all([cachedReference(g),window.takDexEncounterV55.cached(g),cachedArtwork(g)]);
    return [g,statusFor(ref,enc,art)];
   }));
   statusMap=new Map(records);
   decorateGameSelects();
  }catch(e){console.warn('Game pack status refresh:',e)}finally{refreshing=false;
   if(statusVersion!==my)refreshStatusMap();
  }
 }
 // Update rebuilt dropdowns when focused or opened, even if another page replaces their options.
 document.addEventListener('focusin',e=>{if(e.target?.tagName==='SELECT')decorateGameSelects()},true);
 document.addEventListener('pointerdown',e=>{if(e.target?.closest?.('select'))decorateGameSelects()},true);
 window.addEventListener('td58-pack-update',()=>refreshStatusMap());
 window.takDexOfflineV59={refreshIndicators:refreshStatusMap};

 async function getState(g){const [ref,enc,art]=await Promise.all([cachedReference(g),window.takDexEncounterV55.cached(g),cachedArtwork(g)]);return {ref,enc,art,status:statusFor(ref,enc,art)}}
 function word(status){return status==='ready'?'Downloaded':status==='partial'?'Partial — resume available':'Not downloaded'}
 async function hasLegacyCache(){
  try{const keys=await caches.keys();if(keys.some(k=>['takdex-pokeapi-records-v1','takdex-artwork-v26'].includes(k)))return true}catch{}
  try{if(localStorage.getItem('takdex-offline-full-v26'))return true;for(let i=0;i<localStorage.length;i++)if(localStorage.key(i)?.startsWith('pt-v2:'))return true}catch{}
  return false;
 }
 async function update(showAll=true){
  const g=game.value,token=++taskState.token;
  $('td59Name').textContent='Pokémon '+g+' — game data pack';
  const {ref,enc,art,status:packStatus}=await getState(g);
  if(token!==taskState.token)return;
  state.textContent=iconFor[packStatus]+' '+word(packStatus)
   +' · Reference: '+(ref?(ref.complete?'ready':'incomplete'):'missing')
   +' · Encounters: '+(enc?(enc.hasSource?(enc.schema>=64?'indexed + acquisition evidence':'older index — update required'):'coverage unavailable'):'missing')
   +' · Artwork: '+(art?(art.complete?'ready':(art.saved||0)+'/'+(art.expected||'?')+' images'):'missing');
  downloadBtn.textContent=packStatus==='ready'?'✓ '+g+' pack downloaded':packStatus==='partial'?'Resume '+g+' pack':'Download '+g+' pack';
  downloadBtn.disabled=taskState.busy||packStatus==='ready';
  deleteBtn.disabled=taskState.busy||(!ref&&!enc&&!art);
  clearBtn.disabled=taskState.busy;
  if(showAll){const saved=[];for(const name of games){const data=await getState(name);if(data.status!=='missing')saved.push({name,...data});}
   if(token!==taskState.token)return;
   $('td59Saved').innerHTML=saved.length?saved.map(p=>'<div>'+iconFor[p.status]+' <b>'+safe(p.name)+'</b> · '+word(p.status)+'</div>').join(''):'No game-specific packs stored.';
   // Includes old V26 offline downloads that predate this manager.
   clearBtn.disabled=taskState.busy||(!saved.length&&!(await hasLegacyCache()));
  }
  decorateGameSelects();
 }
 function setBusy(busy){taskState.busy=busy;game.disabled=busy;downloadBtn.disabled=busy;deleteBtn.disabled=busy;clearBtn.disabled=busy;}
 async function downloadGame(){
  if(taskState.busy)return;
  const g=game.value;
  setBusy(true);let errors=[];
  try{
   const existing=await getState(g);
   if(!existing.ref?.complete){
    progress.textContent='Downloading '+g+' reference data…';
    try{await downloadReference(g,txt=>progress.textContent='↻ '+txt)}catch(e){errors.push('Reference: '+(e.message||e))}
   }
   if(!existing.enc?.hasSource||existing.enc?.schema<64){
    progress.textContent='Downloading '+g+' encounter locations…';
    try{await window.takDexEncounterV55.refresh(g,txt=>progress.textContent='↻ '+txt)}catch(e){errors.push('Encounters: '+(e.message||e))}
   }
   if(!existing.art?.complete){
    progress.textContent='Downloading '+g+' Pokémon artwork…';
    try{await downloadArtwork(g,txt=>progress.textContent='↻ '+txt)}catch(e){errors.push('Artwork: '+(e.message||e))}
   }
   const final=await getState(g);
   progress.textContent=errors.length?'⚠ '+errors.join(' | '):final.status==='ready'?'✓ '+g+' game data saved.':'⚠ Pack is partial; some source data is missing. Retry to resume.';
  }finally{setBusy(false);await refreshStatusMap();await update()}
 }
 async function removeGame(){
  if(taskState.busy)return;
  const g=game.value,existing=await getState(g);
  if(existing.status==='missing')return;
  if(!window.confirm('Remove the downloaded '+g+' game pack?\n\nThis will delete its reference and encounter records. Saved teams and settings will NOT be deleted.'))return;
  setBusy(true);
  try{await removeReference(g);await window.takDexEncounterV55.remove(g);await removeArtwork(g);progress.textContent='Removed '+g+' game data and artwork.'}
  catch(e){progress.textContent='⚠ Could not remove '+g+': '+(e.message||e)}
  finally{setBusy(false);await refreshStatusMap();await update()}
 }
 async function clearAll(){
  if(taskState.busy)return;
  const msg='Delete ALL downloaded game packs AND older offline databases?\n\nSaved teams, nicknames, movesets and preferences will NOT be deleted.\n\nThis cannot be undone.';
  if(!window.confirm(msg))return;
  setBusy(true);progress.textContent='Removing game packs and old offline records…';
  try{
   // Clearing the catalog's in-memory map matters: otherwise removed games remain usable until reload.
   await window.takDexEncounterV55.clearAll();
   if('caches' in window){for(const k of await caches.keys()){
    if(k.startsWith(REF_PREFIX)||k.startsWith(ART_PREFIX)||['takdex-encounter-catalog-v55','takdex-pokeapi-records-v1','takdex-artwork-v26'].includes(k))await caches.delete(k);
   }}
   try{for(let i=localStorage.length-1;i>=0;i--){const key=localStorage.key(i);if(key&&(key.startsWith('pt-v2:')||key==='takdex-offline-full-v26'))localStorage.removeItem(key)}}catch{}
   window.takDexArtV60?.reset?.();
   progress.textContent='✓ Downloaded data and artwork cleared. Your saved teams and preferences were kept.';
  }catch(e){progress.textContent='⚠ Cleanup was incomplete: '+(e.message||e)}
  finally{setBusy(false);await refreshStatusMap();await update()}
 }
 downloadBtn.addEventListener('click',downloadGame);
 deleteBtn.addEventListener('click',removeGame);
 clearBtn.addEventListener('click',clearAll);
 game.onchange=()=>{progress.textContent='';update()};
 launch.onclick=()=>{window.takActivate(3);more.hidden=true;page.hidden=false;visible=true;
  game.value=$('dexGame')?.value||'Emerald';progress.textContent='';update();window.scrollTo(0,0)};
 $('td59Back').onclick=()=>{page.hidden=true;visible=false;window.takActivate(3)};
 for(const tab of ['teamsTab','battleTab','dexTab','moreTab'])$(tab).addEventListener('click',()=>{page.hidden=true;visible=false});
 window.addEventListener('td58-pack-update',()=>{if(visible&&!taskState.busy)update()});
 decorateGameSelects();refreshStatusMap();
})();


// V60 — retrieve per-game downloaded images for all Pokémon views in airplane mode.
// A normal <img> tag cannot directly read CacheStorage; a cached Response is converted
// to an object URL and swapped into the image when offline (or after network failure).
(function initOfflineArtworkV60(){
 const CACHE_PREFIX='takdex-artwork-v60-';
 const blobURLs=new Map(),pending=new Map();
 const allowed=url=>{try{const u=new URL(url,location.href);return u.hostname==='raw.githubusercontent.com'&&u.pathname.startsWith('/PokeAPI/sprites/master/sprites/pokemon/')&&u.pathname.endsWith('.png')}catch{return false}};
 function reset(){for(const url of blobURLs.values())URL.revokeObjectURL(url);blobURLs.clear();pending.clear()}
 async function resolve(src){
  if(!allowed(src))return null;
  if(blobURLs.has(src))return blobURLs.get(src);
  if(pending.has(src))return pending.get(src);
  const task=(async()=>{
   if(!('caches' in window))return null;
   const keys=(await caches.keys()).filter(k=>k.startsWith(CACHE_PREFIX));
   // Prefer the requested artwork, then fall back to the normal sprite when the
   // API has no official artwork for a particular Pokémon (and vice versa).
   const alternate=src.includes('/other/official-artwork/')
    ?src.replace('/other/official-artwork/','/')
    :src.replace('/sprites/pokemon/','/sprites/pokemon/other/official-artwork/');
   for(const candidate of [src,alternate])for(const key of keys){
    const res=await(await caches.open(key)).match(candidate);
    if(res){const blob=await res.blob();if(blob.type&&!blob.type.startsWith('image/'))continue;
     const url=URL.createObjectURL(blob);blobURLs.set(src,url);return url;
    }
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
  if(img.isConnected&&(img.getAttribute('src')||'')===original&&local){
   // Existing Pokédex evolution images hide on error; restore when cache succeeds.
   img.style.visibility='';img.src=local;
  }
  if(img.dataset.td60Pending===original)delete img.dataset.td60Pending;
 }
 function scan(node){if(node.nodeType!==1)return;
  if(node.tagName==='IMG')replace(node);
  if(node.querySelectorAll)node.querySelectorAll('img').forEach(replace);
 }
 // Capture failures before inline onerror handlers hide evolution portraits.
 document.addEventListener('error',e=>{if(e.target?.tagName==='IMG')replace(e.target)},true);
 const observer=new MutationObserver(records=>{
  if(navigator.onLine!==false)return;
  for(const r of records){
   if(r.type==='attributes')scan(r.target);
   else for(const n of r.addedNodes)scan(n);
  }
 });
 observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['src']});
 if(navigator.onLine===false)scan(document.body);
 window.addEventListener('offline',()=>scan(document.body));
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

(function(){const el=document.createElement('style');el.textContent=`#plannerPage .td65-head-move{display:flex;align-items:center;gap:8px;flex-wrap:wrap;min-width:0}#plannerPage .td65-head-move .pill{font-size:.69rem}#plannerPage .td65-rank-clarity{font-size:.72rem}`;document.head.appendChild(el)})();

// V65 — optional team analysis. Default is MOVE improvements, never forced Pokémon swaps.
(function initImproveTeamV65(){
 const page=$('teamsPage');if(!page||$('td65ImproveTeam'))return;
 const panel=document.createElement('details');panel.id='td65ImproveTeam';panel.className='card';
 panel.innerHTML=`<summary>✦ Improve My Team <span style="font-size:.8rem;color:var(--muted)">Move suggestions first · optional replacements ⌄</span></summary>
 <div class="td65-team-controls"><label>Saved team<select id="td65Team"></select></label><label class="td65-team-switch"><input id="td65Swaps" type="checkbox" style="width:auto"> Also explore potential Pokémon replacements</label><button type="button" id="td65AnalyzeTeam">Analyze current team</button><p class="note">Uses the selected game's learnsets and available TM/HM compatibility records. Suggestions are guidance, not guaranteed optimal moves.</p></div>
 <div id="td65TeamOutput" aria-live="polite"></div>`;
 const heading=page.querySelector('.bar');if(heading)heading.insertAdjacentElement('afterend',panel);else page.insertBefore(panel,page.firstChild);
 const style=document.createElement('style');style.textContent=`
 #td65ImproveTeam{padding:0;overflow:visible;margin:13px 0;border:1px solid var(--edge)}
 #td65ImproveTeam>summary{cursor:pointer;display:flex;justify-content:space-between;gap:10px;align-items:center;list-style:none;padding:13px 14px;font-weight:800}
 #td65ImproveTeam>summary::-webkit-details-marker{display:none}
 #td65ImproveTeam .td65-team-controls{padding:0 14px 10px;display:grid;gap:11px}
 #td65ImproveTeam .td65-team-switch{display:flex;align-items:center;gap:9px;font-size:.86rem}
 #td65ImproveTeam #td65TeamOutput{padding:0 13px 14px}
 #td65ImproveTeam .td65-suggestion{border:1px solid var(--edge);padding:11px;margin:9px 0;border-radius:10px;background:var(--card)}
 #td65ImproveTeam .td65-suggestion h4{margin:0 0 7px}
 #td65ImproveTeam .td65-suggestion p{margin:5px 0;font-size:.82rem}
 `;document.head.appendChild(style);
 const select=$('td65Team'),output=$('td65TeamOutput');
 function sync(){const previous=select.value||current?.id;select.innerHTML=teams.map(t=>`<option value="${safe(t.id)}">${safe(t.name)} · ${safe(t.game)}</option>`).join('');if(teams.some(t=>t.id===previous))select.value=previous}
 panel.addEventListener('toggle',()=>{if(panel.open)sync()});
 // Keep selection current after teams are added or edited.
 const refreshed=showTeams;showTeams=function(){refreshed();if(panel.open)sync()};
 const typeStat=['fire','water','electric','grass','ice','fighting','poison','ground','flying','psychic','bug','rock','ghost','dragon','dark','steel','fairy','normal'];
 const key=s=>String(s||'').toLowerCase().replace(/\s+/g,'-');
 async function machineLookup(game){
  const rows=await window.takDexReferenceV58?.machinesFor(game).catch(()=>null);
  if(rows?.length)return new Map(rows.map(x=>[x.move,x.item.toUpperCase()]));
  if(['Emerald','Ruby','Sapphire','FireRed','LeafGreen'].includes(game)){
   const hms=(game==='FireRed'||game==='LeafGreen')?emeraldHMs.slice(0,7):emeraldHMs;
   const tm=new Map(emeraldMachines.map((m,i)=>[m,'TM'+String(i+1).padStart(2,'0')]));hms.forEach((m,i)=>tm.set(m,'HM'+String(i+1).padStart(2,'0')));return tm;
  }return new Map();
 }
 let task=0;
 async function analyze(){const token=++task,t=teams.find(t=>t.id===select.value);if(!t){output.textContent='Choose a saved team first.';return}
  const game=t.game,gen=gameGeneration(game),pokemon=t.pokemon.filter(Boolean);if(!pokemon.length){output.textContent='Add Pokémon to this team before analyzing.';return}
  output.innerHTML='<p class="note">Checking game-specific learnsets, stats and move compatibility…</p>';
  try{
   const machines=await machineLookup(game);
   const apiPokemon=await Promise.all(pokemon.map(p=>api('pokemon/'+p.id)));
   if(token!==task)return;
   const weaknesses=typeStat.map(type=>({type,count:pokemon.filter((p,i)=>{const v=matchup(type,historicalTypes(apiPokemon[i],game),gen);return v!==null&&v>=2}).length})).filter(x=>x.count>=2).sort((a,b)=>b.count-a.count).slice(0,5);
   let html=`<p class="note">${safe(t.name)} · ${safe(game)} · ${pokemon.length}/6 Pokémon</p>`+
    (weaknesses.length?`<p><b>Shared defensive weaknesses:</b> ${weaknesses.map(w=>pill(w.type)+' ×'+w.count).join(' · ')}</p>`:'<p class="note">No attack type is super-effective against two or more team members by typing alone.</p>');
   for(let i=0;i<pokemon.length;i++){
    const p=pokemon[i],data=apiPokemon[i],types=historicalTypes(data,game),known=new Set((p.moves||[]).map(m=>key(m.name)));
    const base=Object.fromEntries(data.stats.map(s=>[s.stat.name,s.base_stat]));
    const vgName=vg[game],candidate=[];
    for(const mv of data.moves){if(known.has(mv.move.name))continue;
     const details=mv.version_group_details.filter(d=>d.version_group.name===vgName);
     if(!details.length)continue;
     const levels=details.filter(d=>d.move_learn_method.name==='level-up'&&d.level_learned_at>0).map(d=>d.level_learned_at);
     const byMachine=details.some(d=>d.move_learn_method.name==='machine'&&machines.has(mv.move.name)&&takMachineCompatible(data,mv.move.name,game));
     if(!levels.length&&!byMachine)continue;
     const method=[...levels.map(x=>'Lv '+x),...(byMachine?[machines.get(mv.move.name)]:[])].join(' / ');
     candidate.push({name:mv.move.name,method});
    }
    // Limit move endpoints; game-specific eligibility is already checked before scoring.
    const options=candidate.slice(0,65);let checked=0;
    const relevant=[];
    for(const chunk of Array.from({length:Math.ceil(options.length/12)},(_,n)=>options.slice(n*12,n*12+12))){
     const batch=await Promise.all(chunk.map(async m=>{try{const move=await api('move/'+m.name),hist=moveGenerationData(move,gen);return {...m,...hist}}catch{return null}}));
     relevant.push(...batch.filter(Boolean));checked+=chunk.length;
     if(token!==task)return;
    }
    const scored=relevant.filter(m=>m.damageClass!=='status'&&Number(m.power)>0&&m.type)
     .map(m=>{const stab=types.includes(m.type),stat=m.damageClass==='special'?base['special-attack']:base.attack,acc=Number.isFinite(m.accuracy)?m.accuracy/100:.7;
      const missingType=!((p.moves||[]).some(x=>x.type===m.type));
      const score=m.power*acc*(stab?1.5:1)*(stat||75)/100*(missingType?1.18:1);
      return {...m,score,stab,missingType}}).sort((a,b)=>b.score-a.score);
    const suggestions=scored.slice(0,3);
    html+=`<div class="td65-suggestion"><h4>${safe(p.name)} · ${types.map(pill).join('')}</h4>`+
      (suggestions.length?suggestions.map(m=>`<p><b>${safe(pretty(m.name))}</b> ${pill(m.type)} · ${safe(m.method)} · PWR ${safe(m.power)}${m.stab?' · STAB':''}${m.missingType?' · adds coverage':''}</p>`).join(''):'<p class="note">No additional verified attacking move found in the available level/TM records. This does not mean your moveset is optimal.</p>')+'</div>';
   }
   if($('td65Swaps').checked){
    html+='<h3>Optional replacement candidates</h3>';
    const pack=await window.takDexEncounterV55?.cached(game);
    if(!pack){html+='<p class="note">Download the game encounter index to explore verified catch candidates. Your current team remains unchanged.</p>'}
    else{
     const worst=weaknesses[0]?.type;
     if(!worst){html+='<p class="note">No common 2× weakness identified; Pokémon replacements are optional.</p>'}
     else{
      const existing=new Set(apiPokemon.map(p=>p.id));
      const matches=pack.mons.filter(m=>!existing.has(m[0])&&matchup(worst,m[2],gen)<1&&((pack.entries?.[m[0]]||[]).length||window.takDexAcquisitionV64.details(pack,m[0]).verified)).slice(0,8);
      html+=matches.length?`<p class="note">${pretty(worst)} threatens multiple team members. These game-recorded species resist or ignore ${pretty(worst)} attacks; availability and evolution conditions still need checking.</p>`+matches.map(m=>`<p>${safe(pretty(m[1]))} · ${m[2].map(pill).join('')} · ${safe(window.takDexAcquisitionV64.details(pack,m[0]).label)}</p>`).join(''):'<p class="note">No verified accessible alternative identified from the downloaded encounter index.</p>';
     }
    }
   }
   if(token===task)output.innerHTML=html;
  }catch(e){if(token===task)output.innerHTML='<p class="note">Analysis could not finish. Check that this game’s reference pack is available or reconnect to load move records. No team data was changed.</p>'}
 }
 $('td65AnalyzeTeam').addEventListener('click',analyze);
 window.takDexImproveTeamV65={refresh:sync};
})();
