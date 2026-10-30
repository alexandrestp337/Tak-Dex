const $=id=>document.getElementById(id), games=['Red','Blue','Yellow','Gold','Silver','Crystal','Ruby','Sapphire','Emerald','FireRed','LeafGreen','Diamond','Pearl','Platinum','HeartGold','SoulSilver','Black','White','Black 2','White 2','X','Y','Omega Ruby','Alpha Sapphire','Sun','Moon','Ultra Sun','Ultra Moon','Sword','Shield','Brilliant Diamond','Shining Pearl','Scarlet','Violet'];
const vg={'Red':'red-blue','Blue':'red-blue','Yellow':'yellow','Gold':'gold-silver','Silver':'gold-silver','Crystal':'crystal','Ruby':'ruby-sapphire','Sapphire':'ruby-sapphire','Emerald':'emerald','FireRed':'firered-leafgreen','LeafGreen':'firered-leafgreen','Diamond':'diamond-pearl','Pearl':'diamond-pearl','Platinum':'platinum','HeartGold':'heartgold-soulsilver','SoulSilver':'heartgold-soulsilver','Black':'black-white','White':'black-white','Black 2':'black-2-white-2','White 2':'black-2-white-2','X':'x-y','Y':'x-y','Omega Ruby':'omega-ruby-alpha-sapphire','Alpha Sapphire':'omega-ruby-alpha-sapphire','Sun':'sun-moon','Moon':'sun-moon','Ultra Sun':'ultra-sun-ultra-moon','Ultra Moon':'ultra-sun-ultra-moon','Sword':'sword-shield','Shield':'sword-shield','Brilliant Diamond':'brilliant-diamond-and-shining-pearl','Shining Pearl':'brilliant-diamond-and-shining-pearl','Scarlet':'scarlet-violet','Violet':'scarlet-violet'};
const colors={normal:'#A8A77A',fire:'#EE8130',water:'#6390F0',electric:'#F7D02C',grass:'#7AC74C',ice:'#96D9D6',fighting:'#C22E28',poison:'#A33EA1',ground:'#E2BF65',flying:'#A98FF3',psychic:'#F95587',bug:'#A6B91A',rock:'#B6A136',ghost:'#735797',dragon:'#6F35FC',dark:'#705746',steel:'#B7B7CE',fairy:'#D685AD'};
const chart={normal:{rock:.5,ghost:0,steel:.5},fire:{fire:.5,water:.5,grass:2,ice:2,bug:2,rock:.5,dragon:.5,steel:2},water:{fire:2,water:.5,grass:.5,ground:2,rock:2,dragon:.5},electric:{water:2,electric:.5,grass:.5,ground:0,flying:2,dragon:.5},grass:{fire:.5,water:2,grass:.5,poison:.5,ground:2,flying:.5,bug:.5,rock:2,dragon:.5,steel:.5},ice:{fire:.5,water:.5,grass:2,ice:.5,ground:2,flying:2,dragon:2,steel:.5},fighting:{normal:2,ice:2,rock:2,dark:2,steel:2,poison:.5,flying:.5,psychic:.5,bug:.5,ghost:0,fairy:.5},poison:{grass:2,poison:.5,ground:.5,rock:.5,ghost:.5,steel:0,fairy:2},ground:{fire:2,electric:2,grass:.5,poison:2,flying:0,bug:.5,rock:2,steel:2},flying:{electric:.5,grass:2,fighting:2,bug:2,rock:.5,steel:.5},psychic:{fighting:2,poison:2,psychic:.5,dark:0,steel:.5},bug:{fire:.5,grass:2,fighting:.5,poison:.5,flying:.5,psychic:2,ghost:.5,dark:2,steel:.5,fairy:.5},rock:{fire:2,ice:2,fighting:.5,ground:.5,flying:2,bug:2,steel:.5},ghost:{normal:0,psychic:2,ghost:2,dark:.5},dragon:{dragon:2,steel:.5,fairy:0},dark:{fighting:.5,psychic:2,ghost:2,dark:.5,fairy:.5},steel:{fire:.5,water:.5,electric:.5,ice:2,rock:2,steel:.5,fairy:2},fairy:{fire:.5,fighting:2,poison:.5,dragon:2,dark:2,steel:.5}};
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));const pretty=s=>s.split('-').map(w=>w[0]?.toUpperCase()+w.slice(1)).join(' ');const pill=t=>`<span class="pill" style="--c:${colors[t]||'#777'}">${pretty(t)}</span>`;const chip=m=>`<span class="movechip" style="--c:${colors[m.type]||'#777'}">${safe(m.name)}</span>`;
let teams=JSON.parse(localStorage.getItem('poketact-teams')||'[]'),current=null,slotIndex=0,chosen=null,foe=null,foe2=null,doubleMode=false,names=null,validMoves=[],selectedMoves=[null,null,null,null],lookupVersion=0;const save=()=>localStorage.setItem('poketact-teams',JSON.stringify(teams));
async function api(path){const key='pt-v2:'+path;try{const cached=localStorage.getItem(key);if(cached)return JSON.parse(cached)}catch{}const res=await fetch('https://pokeapi.co/api/v2/'+path);if(!res.ok)throw Error('Pokédex request failed');const data=await res.json();try{localStorage.setItem(key,JSON.stringify(data))}catch{}return data}
async function listNames(){if(!names){names=(await api('pokemon?limit=2000')).results.map(x=>x.name)}return names}
function search(input,results,choose){let token=0;input.addEventListener('input',async()=>{const mine=++token,q=input.value.trim().toLowerCase().replace(/\s+/g,'-');results.hidden=true;if(q.length<2)return;results.innerHTML='<p class="note">Searching…</p>';results.hidden=false;try{const found=(await listNames()).filter(n=>n.includes(q)).slice(0,12);if(mine!==token)return;results.innerHTML=found.map(n=>`<button type="button" data-value="${safe(n)}">${safe(pretty(n))}</button>`).join('')||'<p class="note">No matches</p>'}catch{results.innerHTML='<p class="error">Internet needed for first lookup.</p>'}});results.addEventListener('click',e=>{const b=e.target.closest('[data-value]');if(b){results.hidden=true;input.value=pretty(b.dataset.value);choose(b.dataset.value)}})}
function showTeams(){$('teams').innerHTML=teams.length?teams.map(t=>`<article class="card"><strong>${safe(t.name)}</strong><p>${safe(t.game)} · ${t.pokemon.filter(Boolean).length}/6 Pokémon</p><button data-open="${safe(t.id)}">Open</button> <button data-delete="${safe(t.id)}">Delete</button></article>`).join(''):'<p>No teams yet.</p>'}
$('teams').onclick=e=>{const open=e.target.closest('[data-open]'),del=e.target.closest('[data-delete]');if(open)openTeam(open.dataset.open);if(del&&confirm('Delete team?')){teams=teams.filter(t=>t.id!==del.dataset.delete);save();showTeams();$('editor').hidden=true}};
function openTeam(id){current=teams.find(t=>t.id===id);$('editor').hidden=false;$('editorTitle').textContent=current.name;$('editorGame').textContent=current.game;showSlots();enrichTeamMoves()}
const evolutionStatus=new Map();
async function checkEvolution(p){const key=p.id+':'+current.game;if(evolutionStatus.has(key))return;try{const s=await api('pokemon-species/'+p.id);const c=await api(s.evolution_chain.url.replace('https://pokeapi.co/api/v2/',''));let node=null;function walk(n){if(n.species.name===s.name)node=n;else n.evolves_to.forEach(walk)}walk(c.chain);const options=node?.evolves_to||[];let available=false;for(const o of options){const candidate=await api('pokemon/'+o.species.name);if(candidate.moves.some(m=>m.version_group_details.some(v=>v.version_group.name===vg[current.game]))){available=true;break}}evolutionStatus.set(key,available);if(current?.pokemon.some(x=>x?.id===p.id))showSlots()}catch{}}
function showSlots(){$('slots').innerHTML=Array.from({length:6},(_,i)=>{const p=current.pokemon[i];return `<article class="slot">${p?`<div class="identity"><img src="${safe(p.image)}" alt=""><div><strong>${safe(p.name)}</strong><div class="pills">${p.types.map(pill).join('')}</div></div></div><div>${p.moves.map(chip).join('')}</div>`:`<strong>Empty slot ${i+1}</strong><p>Add a Pokémon</p>`}<button data-slot="${i}">${p?'Edit':'＋ Add'}</button>${p&&evolutionStatus.get(p.id+':'+current.game)!==false?` <button data-evolve="${i}" ${evolutionStatus.has(p.id+':'+current.game)?'':'disabled'}>${evolutionStatus.has(p.id+':'+current.game)?'↑ Evolve':'Checking evolution…'}</button>`:''}</article>`}).join('');current.pokemon.filter(Boolean).forEach(p=>{if(!evolutionStatus.has(p.id+':'+current.game))checkEvolution(p)})};$('slots').onclick=e=>{const b=e.target.closest('[data-slot]');if(b)editSlot(Number(b.dataset.slot));const ev=e.target.closest('[data-evolve]');if(ev)evolveSlot(Number(ev.dataset.evolve))};
function clearForm(){chosen=null;validMoves=[];selectedMoves=[null,null,null,null];$('pokeInput').value='';$('pokePreview').innerHTML='';$('moveNote').textContent='Select a Pokémon to load its moves.';$('error').hidden=true;$('savePoke').disabled=true;drawMoves()}
function editSlot(i){slotIndex=i;clearForm();$('pokeHeading').textContent=current.pokemon[i]?'Edit Pokémon':'Add Pokémon';$('removePoke').hidden=!current.pokemon[i];$('evolvePoke').hidden=!current.pokemon[i]||evolutionStatus.get(current.pokemon[i]?.id+':'+current.game)===false;$('pokeDialog').showModal();const p=current.pokemon[i];if(p){$('pokeInput').value=p.name;loadPokemon(p.id,p.moves)}}
async function loadPokemon(name,old=[]){const version=++lookupVersion;$('savePoke').disabled=true;$('moveNote').textContent='Loading moves…';try{const p=await api('pokemon/'+name);if(version!==lookupVersion)return;const types=p.types.sort((a,b)=>a.slot-b.slot).map(t=>t.type.name);const image=p.sprites.other?.['official-artwork']?.front_default||p.sprites.front_default||'';chosen={id:p.id,name:pretty(p.name),types,image,baseSpeed:p.stats.find(s=>s.stat.name==='speed')?.base_stat};validMoves=p.moves.filter(m=>m.version_group_details.some(d=>d.version_group.name===vg[current.game])).map(m=>m.move.name);selectedMoves=old.concat([null,null,null,null]).slice(0,4);$('pokePreview').innerHTML=`<div class="identity"><img src="${safe(image)}" alt=""><div><strong>${safe(chosen.name)}</strong><div class="pills">${types.map(pill).join('')}</div></div></div>`;drawMoves();Promise.all(selectedMoves.map(async (m,i)=>{if(m){selectedMoves[i]=await enrichMove(m,gameGeneration(current.game))}})).then(()=>{if(version===lookupVersion)drawMoves()});$('moveNote').textContent=`Moves listed for ${current.game}. Select each attack from the dropdown.`;$('savePoke').disabled=false}catch(e){$('error').hidden=false;$('error').textContent='Could not load Pokémon. Check your connection.'}}
function drawMoves(){$('moveFields').innerHTML=Array.from({length:4},(_,i)=>`<div class="moveRow"><b>${i+1}</b><div><div class="search"><input data-move-input="${i}" autocomplete="off" placeholder="Search attack ${i+1}" value="${safe(selectedMoves[i]?.name||'')}"><div class="suggestions" data-results="${i}" hidden></div></div><div class="moveType" data-type="${i}">${selectedMoves[i]?.type?pill(selectedMoves[i].type)+moveStats(selectedMoves[i]):''}</div></div><button type="button" class="clear" data-clear="${i}">×</button></div>`).join('')}
$('moveFields').addEventListener('input',e=>{const i=e.target.dataset.moveInput;if(i===undefined)return;selectedMoves[+i]=null;const results=document.querySelector(`[data-results="${i}"]`),q=e.target.value.toLowerCase();document.querySelector(`[data-type="${i}"]`).innerHTML='';results.hidden=!q;results.innerHTML=validMoves.filter(n=>n.includes(q.replace(/\s+/g,'-'))).slice(0,12).map(n=>`<button type="button" data-pick="${i}" data-name="${safe(n)}">${safe(pretty(n))}</button>`).join('')||'<p class="note">No matching move for this game</p>'});
$('moveFields').onclick=async e=>{const c=e.target.closest('[data-clear]'),b=e.target.closest('[data-pick]');if(c){const i=+c.dataset.clear;selectedMoves[i]=null;drawMoves()}if(b){const i=+b.dataset.pick,n=b.dataset.name;document.querySelector(`[data-results="${i}"]`).hidden=true;try{const m=await api('move/'+n);selectedMoves[i]={name:pretty(n),...moveGenerationData(m,gameGeneration(current.game)),target:m.target?.name,priority:m.priority||0,metaGeneration:gameGeneration(current.game)};drawMoves()}catch{$('error').hidden=false;$('error').textContent='Could not load move type.'}}};
$('pokeForm').onsubmit=e=>{e.preventDefault();if(!chosen)return;current.pokemon[slotIndex]={...chosen,moves:selectedMoves.filter(Boolean)};save();showSlots();showTeams();$('pokeDialog').close()};$('evolvePoke').onclick=()=>evolveSlot(slotIndex);$('removePoke').onclick=()=>{current.pokemon[slotIndex]=null;save();showSlots();showTeams();$('pokeDialog').close()};$('cancelPoke').onclick=()=>$('pokeDialog').close();
$('game').innerHTML=games.map(g=>`<option>${g}</option>`).join('');$('game').value='Emerald';$('addTeam').onclick=()=>$('newDialog').showModal();$('cancelNew').onclick=()=>$('newDialog').close();$('newForm').onsubmit=e=>{e.preventDefault();const t={id:String(Date.now())+Math.random().toString(36).slice(2),name:$('teamName').value.trim(),game:$('game').value,pokemon:Array(6).fill(null)};teams.push(t);save();showTeams();$('newDialog').close();$('teamName').value='';openTeam(t.id)};$('closeTeam').onclick=()=>$('editor').hidden=true;
search($('pokeInput'),$('pokeResults'),n=>loadPokemon(n));search($('foeInput'),$('foeResults'),async n=>{try{const p=await api('pokemon/'+n);foe={name:pretty(p.name),types:p.types.map(t=>t.type.name),image:p.sprites.other?.['official-artwork']?.front_default||p.sprites.front_default};$('foePreview').innerHTML=`<div class="identity"><img src="${safe(foe.image)}"><div><strong>${safe(foe.name)}</strong><div class="pills">${foe.types.map(pill).join('')}</div></div></div>`;showBattle()}catch{$('matchups').textContent='Could not load opponent.'}});

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
  current.pokemon[i]={id:p.id,name:pretty(p.name),types:p.types.sort((a,b)=>a.slot-b.slot).map(t=>t.type.name),image:p.sprites.other?.['official-artwork']?.front_default||p.sprites.front_default||'',moves:old.moves,baseSpeed:p.stats.find(s=>s.stat.name==='speed')?.base_stat};
  save();showSlots();showTeams();if($('pokeDialog').open)$('pokeDialog').close();
 }catch(e){alert('Could not check evolution. Internet may be needed.')}finally{evolveBusy=false}
}
search($('foeInput2'),$('foeResults2'),async n=>{
 try{const p=await api('pokemon/'+n);foe2={name:pretty(p.name),types:p.types.map(t=>t.type.name),image:p.sprites.other?.['official-artwork']?.front_default||p.sprites.front_default};$('foePreview2').innerHTML=`<div class="identity"><img src="${safe(foe2.image)}" alt=""><div><strong>${safe(foe2.name)}</strong><div class="pills">${foe2.types.map(pill).join('')}</div></div></div>`;showBattle()}catch{$('matchups').textContent='Could not load second opponent.'}
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
 if(gen<6&&(attack==='fairy'||defenders.includes('fairy')))return null;
 let result=defenders.reduce((v,d)=>v*(chart[attack]?.[d]??1),1);
 // Steel resisted Ghost and Dark in Generations 2–5.
 if(gen>=2&&gen<=5&&defenders.includes('steel')&&(attack==='ghost'||attack==='dark'))result*=.5;
 // Generation 1: Ghost was ineffective against Psychic, and Bug/Poison interactions differed.
 if(gen===1){
  if(attack==='ghost'&&defenders.includes('psychic'))result*=0;
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
   if(change.power!==null&&change.power!==undefined)power=change.power;
   if(change.accuracy!==null&&change.accuracy!==undefined)accuracy=change.accuracy;
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
function expectedPower(m,attacker,target,gen){
 const eff=matchup(m.type,target.types,gen);
 if(eff===null||m.damageClass==='status'||m.power===0)return null;
 if(!Number.isFinite(m.power)||!Number.isFinite(m.accuracy))return null;
 const stab=attacker.types.includes(m.type)?1.5:1;
 // A relative comparison index, NOT actual HP damage.
 return m.power*stab*eff*(m.accuracy/100);
}
function moveStats(m){return `<span class="move-stats">PWR ${Number.isFinite(m.power)?m.power:'—'} · ACC ${Number.isFinite(m.accuracy)?m.accuracy+'%':'—'}</span>`}
async function enrichMove(m,gen){
 if(m.metaGeneration===gen&&m.power!==undefined&&m.accuracy!==undefined)return m;
 try{
  const data=await api('move/'+String(m.name).toLowerCase().replace(/\s+/g,'-'));
  return {...m,...moveGenerationData(data,gen),target:data.target?.name,priority:data.priority||0,metaGeneration:gen};
 }catch{return m}
}
async function enrichTeamMoves(){
 if(!current)return;
 const team=current,gen=gameGeneration(team.game);
 let updated=false;
 for(const p of team.pokemon.filter(Boolean)){
  for(let i=0;i<p.moves.length;i++){
   const m=p.moves[i];
   if(m.metaGeneration!==gen||m.accuracy===undefined){
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
  const effectiveness=matchup(m.type,opponent.types,gen);
  const stab=p.types.includes(m.type)?1.5:1;
  return {...m,effectiveness,stab,total:effectiveness===null?null:effectiveness*stab};
 }).filter(m=>m.total!==null);
 const scored=offense.map(m=>({...m,powerIndex:expectedPower(m,p,opponent,gen)}));
 const best=scored.filter(m=>m.powerIndex!==null).reduce((a,b)=>!a||b.powerIndex>a.powerIndex?b:a,null)
   ||scored.filter(m=>m.damageClass!=='status'&&m.power!==0).reduce((a,b)=>!a||b.total>a.total?b:a,null);
 const threats=opponent.types.map(t=>({type:t,multiplier:matchup(t,p.types,gen)}));
 const worst=Math.max(...threats.map(t=>t.multiplier??1),1/4);
 const bestOffense=best?.total??0;
 // Transparent heuristic: offensive advantage balanced against worst possible STAB-type threat.
 // 4x incoming weakness outweighs modest offensive improvements.
 const attackScore=best?.powerIndex!==null&&best?.powerIndex!==undefined&&best.powerIndex>0?Math.log2(best.powerIndex/60):bestOffense>0?Math.log2(bestOffense): -3;
 const defensePenalty=worst>=4?3.2:worst>=2?1.6:worst===1?0:worst===.5?-0.8:-1.2;
 const score=attackScore-defensePenalty;
 return {p,offense:scored,best,threats,worst,score};
}

const spreadTargets=new Set(['all-opponents','all-other-pokemon','all-pokemon']);
const allyHitTargets=new Set(['all-other-pokemon','all-pokemon']);
function moveValue(move,attacker,target,gen,ally){
 const mult=matchup(move.type,target.types,gen);
 if(mult===null)return null;
 if(move.damageClass==='status'||move.power===0)return null;
 const stab=attacker.types.includes(move.type)?1.5:1;
 const power=Number.isFinite(move.power)?move.power:60; // legacy records use placeholder
 const spread=spreadTargets.has(move.target);
 const penalty=spread&&gen>=4?.75:1;
 const value=mult*stab*(power/60)*penalty*(Number.isFinite(move.accuracy)?move.accuracy/100:1);
 const allyRisk=ally&&allyHitTargets.has(move.target)?matchup(move.type,ally.types,gen):0;
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
 const note='Rankings balance move power, accuracy, STAB, type effectiveness and potential incoming STAB threats. This is a relative move-strength estimate, not actual damage. Special effects, stats, abilities, items, immunities from abilities and actual opponent moves are not modeled.';
 $('matchups').innerHTML=`<p class="analysis-disclaimer">${note}</p>`+pairSection+
 ranked.map((r,i)=>{
 const top=r.reports[0],move=top.best;
 const headline=move?`<div class="recommended-move"><small>⚔ BEST MOVE${doubleMode?' VS '+safe(opponents[0].name).toUpperCase():''}</small><strong>${safe(move.name)}</strong><span>${moveStats(move)} · ${effectText(move.total)} with STAB</span></div>`:'<div class="recommended-move"><small>BEST MOVE</small><strong>No attacks saved</strong></div>';
 const defense=r.worst>=4?'HIGH RISK':r.worst>=2?'WEAK DEFENSE':r.worst<1?'RESISTS ATTACKS':'NEUTRAL DEFENSE';
 const rows=r.reports.map((rep,k)=>`<div class="matchup-details"><h4>VS ${safe(opponents[k].name)}</h4><div class="threat-row">Potential incoming STAB: ${rep.threats.map(t=>`${pretty(t.type)} ${effectText(t.multiplier)}`).join(' · ')}</div>${rep.offense.map(m=>`<div class="move-detail-row">${chip(m)}<div class="move-detail-numbers">${moveStats(m)}<b class="${m.total>1?'good':m.total===0?'zero':m.total<1?'bad':''}">${effectText(m.total)} incl. STAB</b></div></div>`).join('')||'<p>No attacks saved</p>'}</div>`).join('');
 return `<article class="card rank-card ${i===0?'rank-winner':''}"><div class="recommendation-head"><div class="ranking-medal">${i===0?'♛':i+1}</div><div class="identity rank-identity"><div class="rank-portrait"><img src="${safe(r.p.image||'')}" alt=""></div><div class="rank-info"><strong>${safe(r.p.name)}</strong><div class="pills">${r.p.types.map(pill).join('')}</div></div></div><div class="rank-risk ${r.worst>=2?'bad':r.worst<1?'good':''}">${defense}</div></div>${headline}${doubleMode?`<p class="note">Double battle: details against both opponents below.</p>`:''}<details class="expand-details"><summary>View all attacks & defensive matchups <span>⌄</span></summary>${rows}</details></article>`;
 }).join('')||'<p>Add Pokémon to your team to see recommendations.</p>';
}
$('teamsTab').onclick=()=>{$('teamsPage').hidden=false;$('battlePage').hidden=true;$('teamsTab').classList.add('selected');$('battleTab').classList.remove('selected')};
$('battleTab').onclick=()=>{$('teamsPage').hidden=true;$('battlePage').hidden=false;$('battleTab').classList.add('selected');$('teamsTab').classList.remove('selected');showBattle();enrichTeamMoves()};function toggleTheme(){document.body.classList.toggle('light');localStorage.setItem('poketact-light',document.body.classList.contains('light'))};if(localStorage.getItem('poketact-light')==='true')document.body.classList.add('light');showTeams();if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js');

// V9 navigation: four real tabs, with the existing battle/team logic retained.
(function(){
 const tabs=['teamsTab','battleTab','dexTab','moreTab'];
 const pages=['teamsPage','battlePage','dexPage','morePage'];
 const oldTeam=$('teamsTab').onclick,oldBattle=$('battleTab').onclick;
 function activate(index){
  pages.forEach((id,i)=>$(id).hidden=i!==index);
  tabs.forEach((id,i)=>{$(id).classList.toggle('selected',i===index);$(id).setAttribute('aria-current',i===index?'page':'false')});
  window.scrollTo({top:0,behavior:'instant'});
 }
 $('teamsTab').onclick=()=>{oldTeam?.();activate(0)};
 $('battleTab').onclick=()=>{oldBattle?.();activate(1)};
 $('dexTab').onclick=()=>activate(2);
 $('moreTab').onclick=()=>activate(3);
 $('moreTheme').onclick=toggleTheme;
 $('dexSearch').onclick=async()=>{
  const name=$('dexInput').value.trim().toLowerCase().replace(/\s+/g,'-');
  if(!name)return;
  $('dexResult').textContent='Searching…';
  try{
   const p=await api('pokemon/'+encodeURIComponent(name));
   const art=p.sprites?.other?.['official-artwork']?.front_default||p.sprites?.front_default||'';
   $('dexResult').innerHTML=`<div class="card dex-entry"><img src="${safe(art)}" alt=""><div><h3>${safe(pretty(p.name))}</h3><p>#${p.id}</p><div class="pills">${p.types.map(t=>pill(t.type.name)).join('')}</div></div></div>`;
  }catch{$('dexResult').textContent='Pokémon not found, or an internet connection is required.'}
 };
 $('dexInput').addEventListener('keydown',e=>{if(e.key==='Enter')$('dexSearch').click()});
})();
