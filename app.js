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
 const cache=await caches.open(OFFLINE_CACHE);
 const clean=path.replace(/^\/+|\/+$/g,'');
 const direct=[API_ROOT+path,API_ROOT+clean,API_ROOT+clean+'/'];
 for(const url of direct){const r=await cache.match(url);if(r)return r.json()}
 const match=clean.match(/^(pokemon|pokemon-species|move|evolution-chain|machine)\/(.+)$/);
 if(!match||/^\d+$/.test(match[2]))return null;
 const listUrl=API_ROOT+match[1]+'?limit='+(['machine'].includes(match[1])?'3000':'2000');
 const list=await cache.match(listUrl);
 if(!list)return null;
 const names=(await list.json()).results||[];
 const wanted=decodeURIComponent(match[2]).toLowerCase();
 const entry=names.find(x=>x.name===wanted);
 if(!entry)return null;
 const record=await cache.match(entry.url);
 return record?record.json():null;
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
 const note='V39: defensive abilities with a single possible ability are considered; ambiguous abilities are not assumed. Variable-power attacks use midpoint estimates, not guaranteed damage. Rankings estimate move strength using power, accuracy, STAB, type effectiveness and available base stats, balanced against potential incoming STAB threats. Not a damage calculator: levels, EVs, natures, items, opponent moves and many conditional effects are not modeled. Moves with unknown power are excluded from Best Move.';
 $('matchups').innerHTML=`<p class="analysis-disclaimer">${note}</p>`+pairSection+
 ranked.map((r,i)=>{
 const top=r.reports[0],move=top.best;
 const headline=move?`<div class="recommended-move"><small>⚔ BEST MOVE${doubleMode?' VS '+safe(opponents[0].name).toUpperCase():''}</small><strong>${safe(move.name)}</strong><span>${moveStats(move)} · ${effectText(move.effectiveness)} type · ${move.stab>1?'STAB':'No STAB'} · ${effectivePowerLabel(move)}</span></div>`:'<div class="recommended-move"><small>BEST MOVE</small><strong>No attacks saved</strong></div>';
 const defense=r.worst>=4?'HIGH RISK':r.worst>=2?'WEAK DEFENSE':r.worst<1?'RESISTS ATTACKS':'NEUTRAL DEFENSE';
 const rows=r.reports.map((rep,k)=>`<div class="matchup-details"><h4>VS ${safe(opponents[k].name)}</h4><div class="threat-row">Potential incoming STAB: ${rep.threats.map(t=>`${pretty(t.type)} ${effectText(t.multiplier)}`).join(' · ')}</div>${rep.offense.map(m=>`<div class="move-detail-row">${chip(m)}<div class="move-detail-numbers">${moveStats(m)}<b class="${m.total>1?'good':m.total===0?'zero':m.total<1?'bad':''}">${effectText(m.effectiveness)} type · ${m.stab>1?'STAB':'No STAB'} · ${effectivePowerLabel(m)}</b></div></div>`).join('')||'<p>No attacks saved</p>'}</div>`).join('');
 return `<article class="card rank-card ${i===0?'rank-winner':''}"><div class="recommendation-head"><div class="ranking-medal">${i===0?'♛':i+1}</div><div class="identity rank-identity"><div class="rank-portrait"><img src="${safe(r.p.image||'')}" alt=""></div><div class="rank-info"><strong>${safe(r.p.name)}</strong><div class="pills">${r.p.types.map(pill).join('')}</div></div></div><div class="rank-risk ${r.worst>=2?'bad':r.worst<1?'good':''}">${defense}</div></div>${headline}${doubleMode?`<p class="note">Double battle: details against both opponents below.</p>`:''}<details class="expand-details"><summary>View all attacks & defensive matchups <span>⌄</span></summary>${rows}</details></article>`;
 }).join('')||'<p>Add Pokémon to your team to see recommendations.</p>';
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
$('dexSearch').onclick=async()=>{
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
  let encounterHtml='<h3>Wild encounters · '+safe(game)+'</h3><div class="card"><p class="note">Checking encounter records…</p></div>';
  result.innerHTML=`${encounterHtml}<article class="card dex-entry"><img src="${safe(img)}" alt=""><div><h3>${safe(pretty(pokemon.name))}</h3><div class="pills">${historicalTypes(pokemon,game).map(pill).join('')}</div><p>${safe(game)} · #${pokemon.id}</p></div></article><h3>Evolutions</h3><div class="card">${evo.map(e=>`<div class="evo-line" style="padding-left:${Math.min(e.depth*14,40)}px">${e.depth?'↳ ':''}<button type="button" class="evo-navigate" data-dex-evolution="${safe(e.name)}" aria-label="View ${safe(pretty(e.name))} in Pokédex"><img class="evo-art" loading="lazy" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${e.id}.png" alt="" onerror="this.style.visibility='hidden'"><span class="evo-description"><strong>${safe(pretty(e.name))}</strong><span class="pills evo-types">${(e.types||[]).map(pill).join('')||'<small>Type unavailable offline</small>'}</span>${e.conditions.length?' <small>('+safe(e.conditions.join(' / '))+')</small>':''}</span></button></div>`).join('')}<p class="note">Evolution availability and special requirements may differ by game. Requirements are shown from species data.</p></div><h3>Level-up learnset · ${safe(game)}</h3><div class="card">${details.length?details.map(m=>`<div class="learn-row"><b>Lv ${m.level}</b><span>${safe(pretty(m.name))}</span>${m.type?pill(m.type):''}${moveStats(m)}</div>`).join(''):'No level-up moves listed for this version.'}</div>`;
  // Wild encounter records are supplemental: a failed endpoint must not hide the Pokédex entry.
  try{
   const records=await api('pokemon/'+pokemon.name+'/encounters');
   const matching=records.flatMap(r=>r.version_details.filter(v=>v.version.name===game.toLowerCase().replace(/ /g,'-')).map(v=>({area:r.location_area.name,details:v.encounter_details})));
   const block='<h3>Wild encounters · '+safe(game)+'</h3><div class="card">'+(matching.length?matching.map(r=>'<p><b>'+safe(pretty(r.area))+'</b>: '+r.details.map(d=>safe(pretty(d.method.name))+' · Lv '+d.min_level+(d.max_level!==d.min_level?'–'+d.max_level:'')).join('; ')+'</p>').join(''):'<p>Wild encounter records: 0</p><p class="note">This does not rule out starters, gifts, evolutions, trades, or special encounters.</p>')+'</div>';
   result.innerHTML=result.innerHTML.replace(encounterHtml,block);
  }catch{result.innerHTML=result.innerHTML.replace(encounterHtml,'<h3>Wild encounters</h3><div class="card">Encounter records unavailable or not downloaded.</div>')}
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
let plannerOpp=[],plannerOwn=[];
function plannerRosterAvailable(){return $('planGame').value==='Emerald'}
function syncPlanner(){const game=$('planGame').value,known=plannerRosterAvailable(),custom=$('planMode').value==='custom';$('eliteOptions').hidden=custom;
 $('planTrainer').innerHTML=(known?Object.keys(emeraldLeague):[]).map(n=>`<option>${n}</option>`).join('');
 $('eliteNote').textContent=known?'Emerald Elite Four and Champion use the same teams on subsequent challenges.':'This game does not yet have a verified automatic League roster bundled. Choose Custom to enter opponents without guessing.';
 $('planVersion').disabled=!known;$('planVersion').querySelector('[value="v2"]').textContent=known?'Repeat challenge (same roster)':'Rematch / second challenge';
 if(!known&&!custom){$('planMode').value='custom';$('eliteOptions').hidden=true}
 loadPlannerRoster();importPlannerTeam();}
function importPlannerTeam(){const t=selectedTeam('planTeam');plannerOwn=(t?.pokemon||[]).filter(Boolean).map(p=>({name:p.name.toLowerCase().replace(/\s+/g,'-'),level:50,moves:p.moves.map(m=>m.name.toLowerCase().replace(/\s+/g,'-'))}));renderPlannerSlots('planOwn',plannerOwn,true)}
function loadPlannerRoster(){if($('planMode').value==='elite'&&plannerRosterAvailable()){plannerOpp=(emeraldLeague[$('planTrainer').value]||emeraldLeague.Sidney).map(([name,level,...moves])=>({name,level,moves}))}else{plannerOpp=Array.from({length:6},()=>({name:'',level:50,moves:[]}))}renderPlannerSlots('planOpp',plannerOpp,false)}
function renderPlannerSlots(id,entries,own){$(id).innerHTML=Array.from({length:6},(_,i)=>{const e=entries[i]||{name:'',level:50,moves:[]};return `<div class="plan-slot"><b>#${i+1}</b><label>Pokémon<input data-plan="${own?'own':'opp'}" data-i="${i}" data-field="name" value="${safe(e.name)}" placeholder="Pokémon"></label><label>Lv<input type="number" min="1" max="100" data-plan="${own?'own':'opp'}" data-i="${i}" data-field="level" value="${Number(e.level)||50}"></label><label>Moves (comma-separated)<input data-plan="${own?'own':'opp'}" data-i="${i}" data-field="moves" value="${safe((e.moves||[]).join(', '))}" placeholder="Move 1, Move 2…"></label></div>`}).join('')}
function plannerEdit(e){const x=e.target;if(!x.dataset.plan)return;const arr=x.dataset.plan==='own'?plannerOwn:plannerOpp,i=+x.dataset.i;while(arr.length<=i)arr.push({name:'',level:50,moves:[]});const field=x.dataset.field;arr[i][field]=field==='moves'?x.value.split(',').map(s=>s.trim().toLowerCase().replace(/\s+/g,'-')).filter(Boolean).slice(0,4):field==='level'?Math.max(1,Math.min(100,Number(x.value)||50)):x.value.trim().toLowerCase().replace(/\s+/g,'-')}
$('planOwn').addEventListener('input',plannerEdit);$('planOpp').addEventListener('input',plannerEdit);
$('planGame').onchange=syncPlanner;$('planMode').onchange=syncPlanner;$('planTrainer').onchange=loadPlannerRoster;$('planVersion').onchange=loadPlannerRoster;$('planTeam').onchange=()=>{const t=selectedTeam('planTeam');if(t){$('planGame').value=t.game;syncPlanner()}else importPlannerTeam()};
async function loadPlannerPokemon(e,gen){const p=await api('pokemon/'+encodeURIComponent(e.name));const moves=await Promise.all((e.moves||[]).map(async n=>{try{const m=await api('move/'+encodeURIComponent(n));return {name:pretty(m.name),...moveGenerationData(m,gen)}}catch{return {name:pretty(n),power:null}}}));return {id:p.id,name:pretty(p.name),types:historicalTypes(p,games.find(g=>gameGeneration(g)===gen)||"Emerald"),baseStats:Object.fromEntries(p.stats.map(s=>[s.stat.name,s.base_stat])),abilities:p.abilities,level:e.level,moves}}
function estimateDamage(a,d,m,gen){if(!m||m.damageClass==='status'||!movePowerRange(m))return null;const eff=defensiveEffect(m,d,gen);if(eff===null||eff===0)return 0;const category=m.damageClass==='special'?'special':'physical';const attack=a.baseStats?.[category==='special'?'special-attack':'attack']||70,defense=d.baseStats?.[category==='special'?'special-defense':'defense']||70;
 const power=(movePowerRange(m).min+movePowerRange(m).max)/2;const l=Math.max(1,Math.min(100,a.level||50)),al=Math.max(1,Math.min(100,d.level||50));const atk=Math.floor((2*attack+31)*l/100)+5,def=Math.floor((2*defense+31)*al/100)+5;const stab=a.types.includes(m.type)?1.5:1;return Math.max(1,Math.floor((Math.floor((2*l/5+2)*power*atk/Math.max(1,def)/50)+2)*eff*stab))}
function estimatedHP(p){const hp=p.baseStats?.hp||70,level=Math.max(1,Math.min(100,p.level||50));return Math.floor((2*hp+15)*level/100)+level+10}
function plannerDamageLabel(a,d,m,gen){const high=estimateDamage(a,d,m,gen);if(high===null)return 'Damage varies';const hp=estimatedHP(d);const low=Math.floor(high*.85);return `Est. ${low}–${high} HP (${Math.round(100*low/hp)}–${Math.round(100*high/hp)}%)`}
// V17: rank YOUR whole team independently against EACH opposing Pokémon, in battle order.
function plannerPortrait(p){return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`}
function renderPlannerBattle(own,opp,gen){
 const disclaimer='<p class="analysis-disclaimer">Estimated HP damage is approximate (assumed IVs, no EVs, neutral nature, random 85–100% roll). Only unambiguous ability immunities are modeled; items, weather, boosts, multi-hit and many special move mechanics are not. Variable-power moves use midpoint power estimates. Actual damage may differ. Opponents appear in their saved order.</p>';
 return disclaimer+opp.map((d,oi)=>{
  const ranks=own.map(a=>{
   const attacks=a.moves.map(m=>({m,value:estimateDamage(a,d,m,gen),effectiveness:defensiveEffect(m,d,gen)})).filter(x=>x.value!==null).sort((x,y)=>y.value-x.value);
   const incoming=d.moves.map(m=>({m,value:estimateDamage(d,a,m,gen)})).filter(x=>x.value!==null).sort((x,y)=>y.value-x.value);
   const worst=incoming[0]?.value??null;
   const best=attacks[0]||null;
   return {a,attacks,incoming,worst,best,score:(best?.value??0)/(Math.max(0,worst??0)+25)};
  }).sort((a,b)=>b.score-a.score);
  return `<section class="planner-opponent"><div class="planner-opponent-heading"><div class="planner-opponent-number">${oi+1}</div><div class="planner-opponent-art"><img src="${safe(plannerPortrait(d))}" alt=""></div><div><small>OPPONENT ${oi+1} OF ${opp.length}</small><h3>${safe(d.name)} <span>Lv ${d.level}</span></h3><div class="pills">${d.types.map(pill).join('')}</div></div></div><div class="planner-opponent-moves"><b>Opponent moves:</b> ${d.moves.length?d.moves.map(m=>`<span class="movechip" style="--c:${colors[m.type]||'#777'}">${safe(m.name)}</span>`).join(' '):'<span class="note">Unknown — defensive risk cannot be evaluated</span>'}</div><h4 class="section-label">▥ YOUR TEAM · BEST MATCHUPS</h4>${ranks.map((r,i)=>{
    const b=r.best;
    const headline=b?`<div class="recommended-move"><small>⚔ BEST MOVE VS ${safe(d.name).toUpperCase()}</small><strong>${safe(b.m.name)}</strong><span>${moveStats(b.m)} · ${effectText(b.effectiveness)} type · ${r.a.types.includes(b.m.type)?'STAB':'No STAB'} · ${plannerDamageLabel(r.a,d,b.m,gen)}</span></div>`:'<div class="recommended-move"><small>BEST MOVE</small><strong>No fixed-power attacks saved</strong></div>';
    const risk=r.worst===null?'Unknown':r.worst>=b?.value?'High risk':'Compare moves';
    const detail=r.attacks.length?r.attacks.map(x=>`<div class="learn-row"><b>${safe(x.m.name)}</b>${pill(x.m.type)}<span>${effectText(x.effectiveness)} · ${plannerDamageLabel(r.a,d,x.m,gen)}</span></div>`).join(''):'<p class="note">No fixed-power attacks available.</p>';
    const defense=r.incoming.length?`<h4>Opponent attacks against ${safe(r.a.name)}</h4>`+r.incoming.map(x=>`<div class="learn-row"><b>${safe(x.m.name)}</b><span>${plannerDamageLabel(d,r.a,x.m,gen)}</span></div>`).join(''):'<p class="note">Opponent move damage unknown or no fixed-power attacks.</p>';
    return `<article class="card rank-card ${i===0?'rank-winner':''}"><div class="recommendation-head"><div class="ranking-medal">${i===0?'♛':i+1}</div><div class="identity rank-identity"><div class="rank-portrait"><img src="${safe(plannerPortrait(r.a))}" alt=""></div><div class="rank-info"><strong>${safe(r.a.name)} · Lv ${r.a.level}</strong><div class="pills">${r.a.types.map(pill).join('')}</div></div></div><div class="rank-risk">${risk}</div></div>${headline}<details class="expand-details"><summary>View all attacks & defensive matchups <span>⌄</span></summary>${detail}${defense}</details></article>`
   }).join('')}</section>`
 }).join('')
}
$('planAnalyze').onclick=async()=>{const result=$('planResults');result.textContent='Loading Pokémon and move data…';const gen=gameGeneration($('planGame').value);try{
 const own=await Promise.all(plannerOwn.filter(x=>x.name).map(x=>loadPlannerPokemon(x,gen)));
 const opp=await Promise.all(plannerOpp.filter(x=>x.name).map(x=>loadPlannerPokemon(x,gen)));
 if(!own.length||!opp.length){result.textContent='Enter at least one Pokémon on each side.';return}
 result.innerHTML=renderPlannerBattle(own,opp,gen);
 }catch(e){result.textContent='Could not load battle data. Check Pokémon and move names and your connection.'}
};
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
const emeraldMachines=`focus-punch dragon-claw water-pulse calm-mind roar toxic hail bulk-up bullet-seed hidden-power sunny-day taunt ice-beam blizzard hyper-beam protect rain-dance giga-drain safeguard frustration solar-beam iron-tail thunderbolt thunder earthquake return dig psychic shadow-ball brick-break double-team reflect shock-wave flamethrower sludge-bomb sandstorm fire-blast rock-tomb aerial-ace torment facade secret-power rest attract thief steel-wing skill-swap snatch overheat`.split(' ');
const emeraldHMs=`cut fly surf strength flash rock-smash waterfall dive`.split(' ');
async function syncTM(){const game=$('tmGame').value;const result=$('tmResults');
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
$('tmCheck').onclick=async()=>{const item=machineEntries[Number($('tmMove').value)],t=selectedTeam('tmTeam'),individual=$('tmPokemon').value.trim().toLowerCase().replace(/\s+/g,'-');if(!item)return;const names=individual?[individual]:(t?.pokemon||[]).filter(Boolean).map(p=>p.name.toLowerCase().replace(/\s+/g,'-'));if(!names.length){$('tmResults').textContent='Select a team or enter a Pokémon.';return}const result=$('tmResults');result.textContent='Checking exact game compatibility…';const checks=await Promise.all(names.map(async name=>{try{const p=await api('pokemon/'+encodeURIComponent(name));const yes=p.moves.some(m=>m.move.name===item.move&&m.version_group_details.some(v=>v.version_group.name===vg[$('tmGame').value]&&v.move_learn_method.name==='machine'));return {name:pretty(p.name),yes}}catch{return {name:pretty(name),error:true}}}));result.innerHTML=`<h3>${safe(item.item.toUpperCase())} · ${safe(pretty(item.move))}</h3>${checks.map(x=>`<div class="card tm-result"><strong>${safe(x.name)}</strong><b class="${x.yes?'good':'bad'}">${x.error?'Unknown':x.yes?'✓ Compatible':'✕ Cannot learn'}</b></div>`).join('')}`};
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


// V43 — separate, on-demand Pokédex type explorer. Encounter-backed results only.
(function initTypeExplorer(){
 const dex=$('dexPage');if(!dex||$('typeExplorerPage'))return;
 const btn=document.createElement('button');btn.type='button';btn.id='openTypeExplorer';btn.textContent='◈ By Type';btn.style.cssText='width:auto;display:inline-block;margin:0;padding:7px 13px;border-radius:9px;font-size:.9rem;font-weight:700;cursor:pointer';
 const byTypeRow=document.createElement('div');byTypeRow.id='dexByTypeRow';byTypeRow.style.cssText='display:flex;justify-content:flex-end;align-items:center;flex:0 0 auto;margin:0';byTypeRow.appendChild(btn);const dexHeading=dex.querySelector('h2');if(dexHeading){const header=document.createElement('div');header.id='dexTitleRow';header.style.cssText='display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 12px';dexHeading.parentNode.insertBefore(header,dexHeading);header.appendChild(dexHeading);dexHeading.style.cssText='margin:0;min-width:0';header.appendChild(byTypeRow)}else{dex.insertBefore(byTypeRow,dex.firstChild)}
 const page=document.createElement('section');page.id='typeExplorerPage';page.hidden=true;
 page.innerHTML='<button id="typeExplorerBack" type="button" style="padding:10px;margin-bottom:12px">← Back to Pokédex</button><h2>Explore Pokémon by Type</h2><p class="note">Browse Pokémon by type, including species without recorded wild encounters. The list is generation-based; game-specific obtainability and trainer appearances are not yet verified.</p><label for="typeExplorerGame">Game</label><select id="typeExplorerGame"></select><div id="typeExplorerTypes" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin:14px 0"></div><p id="typeExplorerStatus" class="note">Choose a type to explore.</p><div id="typeExplorerResults"></div>';
 dex.parentNode.appendChild(page);
 const gameEl=page.querySelector('#typeExplorerGame'),typeEl=page.querySelector('#typeExplorerTypes'),status=page.querySelector('#typeExplorerStatus'),results=page.querySelector('#typeExplorerResults');
 gameEl.innerHTML=gameOptions;let selected=null,request=0,explorerScroll=0,fromExplorer=false;
 function go(back,restore=false){dex.hidden=!back;page.hidden=back;if(!back)window.scrollTo(0,restore?explorerScroll:0);else window.scrollTo(0,0)}
 const returnBtn=document.createElement('button');returnBtn.type='button';returnBtn.id='returnToTypeExplorer';returnBtn.textContent='← Back to Explore by Type';returnBtn.style.cssText='display:none;margin:12px 0;padding:11px 14px;border-radius:10px;font-weight:700;cursor:pointer';dex.insertBefore(returnBtn,$('dexResult')||btn);
 function clearOrigin(){fromExplorer=false;returnBtn.style.display='none'}
 returnBtn.onclick=()=>{if(!fromExplorer)return;clearOrigin();go(false,true)};
 $('dexTab').addEventListener('click',clearOrigin);$('dexInput').addEventListener('input',()=>{if(fromExplorer)clearOrigin()});
 $('dexGame').addEventListener('change',()=>{if(fromExplorer)clearOrigin()});
 btn.onclick=()=>{clearOrigin();gameEl.value=$('dexGame').value;selected=null;drawTypes();results.innerHTML='';status.textContent='Choose a type to explore.';go(false)};
 page.querySelector('#typeExplorerBack').onclick=()=>go(true);
 function drawTypes(){const gen=gameGeneration(gameEl.value);typeEl.innerHTML=Object.entries(colors).map(([type,color])=>{const unavailable=(gen<6&&type==='fairy')||(gen<2&&(type==='dark'||type==='steel'));return `<button type="button" data-explore-type="${type}" ${unavailable?'disabled title="Not available in this generation"':''} aria-pressed="${selected===type}" style="background:${color};opacity:${unavailable?'.28':'1'};filter:${unavailable?'grayscale(1)':'none'};color:${['electric','ice','ground','steel','normal'].includes(type)?'#151515':'white'};padding:10px 2px;border-radius:9px;border:${selected===type?'3px solid var(--text,white)':'2px solid transparent'};font-weight:700;cursor:${unavailable?'not-allowed':'pointer'}">${pretty(type)}</button>`}).join('')}
 function label(name){return pretty(name).replace(/\bArea\b$/,'').trim()}
 async function show(){const token=++request;results.innerHTML='';if(!selected){status.textContent='Choose a type to explore.';return}
  const game=gameEl.value,gen=gameGeneration(game),version=game.toLowerCase().replace(/ /g,'-');
  status.textContent='Loading '+pretty(selected)+' Pokémon and checking '+game+' encounter records…';
  try{
   const typed=await api('type/'+selected);
   // Type endpoint contains current typing; confirm historical typing individually to avoid false positives.
   const candidates=typed.pokemon.filter(x=>{const id=Number(x.pokemon.url.match(/\/(\d+)\/$/)?.[1]);return id>0&&id<=1025}).map(x=>x.pokemon);
   const verified=[];let checked=0;const maxIds=[151,251,386,493,649,721,809,905,1025];
   // A game-specific positive encounter is evidence; no encounter is NOT evidence of unavailability.
   for(let i=0;i<candidates.length;i+=8){
    if(token!==request)return;
    const batch=await Promise.all(candidates.slice(i,i+8).map(async p=>{
     try{
      const encounters=await api('pokemon/'+p.name+'/encounters');
      const matches=encounters.flatMap(a=>a.version_details.filter(v=>v.version.name===version).map(v=>({area:a.location_area.name,details:v.encounter_details})));
      const mon=await api('pokemon/'+p.name);
      if(mon.id>maxIds[gen-1])return null;
      if(!historicalTypes(mon,game).includes(selected))return null;
      return {name:p.name,id:mon.id,matches,types:historicalTypes(mon,game)};
     }catch{return null}
    }));
    verified.push(...batch.filter(Boolean));checked+=batch.length;
    status.textContent='Checked '+checked+' / '+candidates.length+' species · '+verified.length+' matching species';
    // Progressive results, sorted by national Pokédex number.
    results.innerHTML=verified.sort((a,b)=>a.id-b.id).map(m=>`<article class="card" style="margin:9px 0;padding:12px"><button type="button" data-explore-pokemon="${safe(m.name)}" style="display:flex;align-items:center;gap:12px;width:100%;text-align:left"><img loading="lazy" width="60" height="60" alt="" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${m.id}.png"><span><b>#${m.id} ${safe(pretty(m.name))}</b><span class="pills" style="display:block">${m.types.map(pill).join('')}</span></span></button><details><summary>Wild encounter records (${m.matches.length})</summary>${m.matches.length?m.matches.map(loc=>`<p><b>${safe(label(loc.area))}</b>: ${loc.details.map(d=>safe(pretty(d.method.name))+' · Lv '+d.min_level+(d.max_level!==d.min_level?'–'+d.max_level:'')+(d.condition_values.length?' · '+d.condition_values.map(c=>safe(pretty(c.name))).join(', '):'')).join('; ')}</p>`).join(''):'<p>No wild encounter records found for this game. This does not mean unobtainable.</p>'}</details></article>`).join('');
   }
   if(token!==request)return;
   status.textContent=verified.length+' '+pretty(selected)+' Pokémon from this generation (not a verified game-obtainability list).';
  }catch(e){if(token===request)status.textContent='Could not load encounter data. Connect to the internet or download the required data first.'}
 }
 typeEl.onclick=e=>{const b=e.target.closest('[data-explore-type]');if(!b||b.disabled)return;selected=selected===b.dataset.exploreType?null:b.dataset.exploreType;drawTypes();show()};
 gameEl.onchange=()=>{request++;if((gameGeneration(gameEl.value)<6&&selected==='fairy')||(gameGeneration(gameEl.value)<2&&['dark','steel'].includes(selected)))selected=null;drawTypes();results.innerHTML='';if(selected)show();else status.textContent='Choose a type to explore.'};
 results.onclick=e=>{const b=e.target.closest('[data-explore-pokemon]');if(!b)return;$('dexGame').value=gameEl.value;$('dexTeam').value='';$('dexTeamPoke').value='';$('dexInput').value=pretty(b.dataset.explorePokemon);explorerScroll=window.scrollY;fromExplorer=true;returnBtn.style.display='block';go(true);$('dexSearch').click()};
 drawTypes();
})();

// V47 — approved navigation artwork. Icons inherit the existing selected tab color.
(function(){
 const style=document.createElement('style');
 style.textContent=`#teamsTab .takdex-nav-art,#battleTab .takdex-nav-art,#dexTab .takdex-nav-art{display:block;width:24px;height:24px;flex:0 0 24px;margin:0 auto;background-color:currentColor;mask-position:center;mask-repeat:no-repeat;mask-size:contain;-webkit-mask-position:center;-webkit-mask-repeat:no-repeat;-webkit-mask-size:contain}#teamsTab .takdex-nav-art{transform-origin:center;mask-image:url('takdex-team-nav.png');-webkit-mask-image:url('takdex-team-nav.png')}#battleTab .takdex-nav-art{mask-image:url('takdex-battle-nav.png');-webkit-mask-image:url('takdex-battle-nav.png')}#dexTab .takdex-nav-art{mask-image:url('takdex-pokedex-nav.png');-webkit-mask-image:url('takdex-pokedex-nav.png')}#teamsTab .takdex-nav-art,#battleTab .takdex-nav-art,#dexTab .takdex-nav-art{transform-origin:center}#teamsTab .takdex-nav-art{transform:translateY(-3px) scale(1.92)}#battleTab .takdex-nav-art{transform:translateY(-3px) scale(1.40)}#dexTab .takdex-nav-art{transform:translateY(-3px) scale(1.52)}`;
 document.head.appendChild(style);
 for(const id of ['teamsTab','battleTab','dexTab']){const tab=document.getElementById(id);if(!tab)continue;const old=tab.querySelector('svg');if(!old)continue;const icon=document.createElement('span');icon.className='takdex-nav-art';icon.setAttribute('aria-hidden','true');old.replaceWith(icon)}
})();
