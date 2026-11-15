/* Tak-Dex V74 DEV2 — compact opponent-first battle dashboard, inline team editors. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clean=s=>String(s||'').trim().toLowerCase().replace(/\s+/g,'-');
const art=(id,name)=>{const num=Number(id)||window.takDexBWCoreV75?.ids?.[clean(name)]||window.takDexSpriteIdsV77?.[clean(name)]||0;return num?`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${num}.png`:name?`https://play.pokemonshowdown.com/sprites/gen5/${clean(name)}.png`:'';};
let ownSelection=0,oppSelection=0,last=null,analyzeTimer=null,syncing=false,updating=false,analysisError='',userChoseOwn=false;
const strip=$('td74TeamStrips'),focus=$('td74Focus');
if(!strip||!focus)return;
const orgOwn=$('planOwn'),orgOpp=$('planOpp'),oldEditors=$('td74PlannerEditors');
// Keep the original editor DOM and event handlers. Move, rather than clone, each editor
// to the team whose Pokémon it changes. No separate page-wide edit panel.
strip.innerHTML=`<section class="td74-team-strip own"><div class="td74-strip-heading"><strong>Your team</strong><small>Tap to inspect</small></div><div id="td74OwnChips" class="td74-mon-row"></div><details id="td74EditorOwn" class="td74-team-editor"><summary>✎ Edit battle levels &amp; held items</summary></details></section><section class="td74-team-strip opp"><div class="td74-strip-heading"><strong>Opponents</strong><small>Tap to rank matches</small></div><div id="td74OppChips" class="td74-mon-row"></div><details id="td74EditorOpp" class="td74-team-editor"><summary>✎ Edit opponent Pokémon &amp; moves</summary></details></section>`;
$('td74EditorOwn').appendChild(orgOwn);$('td74EditorOpp').appendChild(orgOpp);
oldEditors.hidden=true;
function updateOwnEditorLabel(){$('td74EditorOwn').querySelector('summary').textContent=$('planTeam').value==='__custom__'?'✎ Build custom team · Pokémon, moves & items':'✎ Edit battle levels & held items';}
$('planTeam').addEventListener('change',updateOwnEditorLabel);updateOwnEditorLabel();
// DEV7: team switches in Team Builder can finish while 6v6 is hidden.
$('openPlanner')?.addEventListener('click',()=>{last=null;analysisError='';updating=false;queueMicrotask(()=>{updateOwnEditorLabel();if(!$('plannerPage').hidden)scheduleAnalyze();});});

const roster=side=>side==='own'?plannerOwn:plannerOpp;
function loaded(side,index){const src=roster(side)[index];if(!src?.name||!last)return null;
 const present=roster(side).slice(0,index+1).filter(x=>x?.name).length-1;
 const match=(side==='own'?last.own:last.opp)[present];
 if(clean(match?.name)!==clean(src.name))return null;
 return {...match,level:Number(src.level)||50,heldItem:src.item||'',statAdjustments:{...(src.statAdjustments||{})},battleStats:td74StatsAt(match.baseStats,Number(src.level)||50,src.statAdjustments),selectedAbility:src.ability||match.selectedAbility};
}
function bestMove(a,d,gen){if(!a||!d)return null;return (a.moves||[]).map(m=>({m,damage:estimateDamage(a,d,m,gen)})).filter(x=>Number.isFinite(x.damage)&&x.damage>=0).sort((x,y)=>y.damage-x.damage)[0]||null;}
function effText(m,d,gen){try{const n=defensiveEffect(m,d,gen);return n===null?'Unknown':n===0?'Immune':n===.25?'¼×':n===.5?'½×':n===1?'1×':n===2?'2×':n===4?'4×':n+'×';}catch{return 'Unknown';}}
function moveSummary(attack,defend,gen){return (attack?.moves||[]).filter(m=>m?.name).map(m=>({m,damage:estimateDamage(attack,defend,m,gen)})).sort((a,b)=>(Number.isFinite(b.damage)?b.damage:-1)-(Number.isFinite(a.damage)?a.damage:-1));}
function effectivenessClass(move,defender,gen,incoming=false){const mult=move&&defender?defensiveEffect(move,defender,gen):null;return !Number.isFinite(mult)?'unknown':mult===1?'neutral':(incoming?mult>1:mult<1)?'danger':'safe';}
function matchupRanks(){const d=loaded('opp',oppSelection),gen=last?.gen||gameGeneration($('planGame').value);if(!d)return new Map();const list=roster('own').map((p,i)=>{const a=loaded('own',i),out=bestMove(a,d,gen),inc=bestMove(d,a,gen);return p?.name&&out?{i,score:out.damage/Math.max(1,estimatedHP(d))-(inc?inc.damage/Math.max(1,estimatedHP(a))*.9:0)}:null}).filter(Boolean).sort((a,b)=>b.score-a.score||a.i-b.i);return new Map(list.map((r,i)=>[r.i,i+1]));}
function renderChips(side){
 const rows=roster(side),chosen=side==='own'?ownSelection:oppSelection,ranks=side==='own'?matchupRanks():new Map();
 $(side==='own'?'td74OwnChips':'td74OppChips').innerHTML=Array.from({length:6},(_,i)=>{
 const p=rows[i]||{},name=p.name?pretty(p.name):'Empty',rank=ranks.get(i),best=rank===1;
 return `<button type="button" class="td74-mon-chip ${i===chosen?'active':''} ${best?'td74-crowned':''}" data-td74-side="${side}" data-td74-i="${i}" aria-pressed="${i===chosen}" title="${escape(name)}${rank?' · matchup #'+rank:''}">${side==='own'&&rank?`<span class="td74-corner-rank" aria-label="${best?'Best matchup':'Rank '+rank}">${best?'👑':'#'+rank}</span>`:''}<span class="td74-mon-art">${art(p.id,p.name)?`<img src="${art(p.id,p.name)}" alt="" loading="lazy" onerror="this.replaceWith(document.createTextNode('${escape(name.slice(0,2).toUpperCase())}'))">`:(p.name?escape(name.slice(0,2).toUpperCase()):'+')}</span><span class="td74-mon-name">${escape(name.split(' ')[0])}</span><small>${p.name?'Lv '+(p.level||50):'Slot '+(i+1)}</small></button>`;
 }).join('');
}
function typeBadges(p){const raw=p?.types||[];return raw.length?`<span class="td75-types">${raw.map(t=>pill(t)).join('')}</span>`:'<span class="td75-type-unknown">Types unavailable</span>';}
function moveNameWithType(m){return `<span class="td75-move-name"><strong>${escape(m.name)}</strong>${m.type?pill(m.type):''}</span>`;}
function knownMoveMeta(m,a){const out=[];if(Number.isFinite(m.power)&&m.power>0)out.push('PWR '+m.power);if(Number.isFinite(m.accuracy))out.push('ACC '+m.accuracy+'%');if(a?.types?.includes(m.type))out.push('STAB');return out.length?`<span class="td75-move-meta">${escape(out.join(' · '))}</span>`:'';}
function focusWarnings(a,d,gen){const out=[];if(!a||!d)return '';
 const hasDamaging=(d.moves||[]).some(m=>m?.name&&m.damageClass!=='status'&&Number(m.power)>0);
 if(!hasDamaging){const potential=plannerPotentialStab(d,a,gen).filter(x=>Number.isFinite(x.mult));
  out.push(`<div class="td75-focus-warning"><strong>Opponent attacks unknown.</strong> ${potential.length?`Potential STAB effectiveness: ${potential.map(t=>`${pill(t.type)} ${escape(effText({type:t.type},a,gen))}`).join(' · ')}`:'Damage risk cannot be fully assessed until opponent moves are known.'}</div>`);
 }
 const blocked=(a.moves||[]).filter(m=>m?.name&&m.type&&td72AbilityReport(m,d,gen).possibleImmune.length);
 if(blocked.length)out.push(`<div class="td75-focus-warning">Ability uncertainty: ${blocked.map(m=>escape(m.name+' — '+td72RiskLabel(m,d,gen))).join(' · ')}</div>`);
 return out.join('');
}
function formatMoves(a,d,gen,incoming=false){const entries=moveSummary(a,d,gen);
 if(!entries.length)return '<p class="note">No moves entered.</p>';
 return entries.map(({m,damage})=>`<div class="td74-move-detail td74-effect-${effectivenessClass(m,d,gen,incoming)}">${moveNameWithType(m)}<span class="td74-effect-number">${effText(m,d,gen)}</span><span>${Number.isFinite(damage)?escape(plannerDamageLabel(a,d,m,gen)):'Damage unavailable'}</span>${knownMoveMeta(m,a)}</div>`).join('');}
function threatBox(label,a,d,gen,incoming=false){const entry=bestMove(a,d,gen),n=a?.moves?.filter(m=>m?.name).length||0;
 const summary=entry?`${moveNameWithType(entry.m)}<span class="td74-effect-number td74-effect-${effectivenessClass(entry.m,d,gen,incoming)}">${effText(entry.m,d,gen)}</span><span>${escape(plannerDamageLabel(a,d,entry.m,gen))}</span>`:n?'Damage metadata unavailable':'No moves entered';
 return `<section class="td74-clash-line"><span class="td74-clash-label">${label}</span>${summary}</section>`;
}
function renderFocus(){const own=roster('own')[ownSelection]||{},foe=roster('opp')[oppSelection]||{};
 if(!own.name||!foe.name){focus.innerHTML='<div class="card"><h3>Select an opponent and a Pokémon</h3><p class="note">Select the opponent first to view your team rankings, then choose a matchup.</p></div>';return;}
 const opened=!!focus.querySelector('.td74-shared-expand')?.open;
 const a=loaded('own',ownSelection),d=loaded('opp',oppSelection),gen=last?.gen||gameGeneration($('planGame').value);
 const status=analysisError?`<p class="note td74-calc-error">${escape(analysisError)} <button type="button" data-td74-retry>Retry</button></p>`:updating?'<p class="note td74-calc-note">Recalculating…</p>':(!a||!d)?'<p class="note td74-calc-note">No calculated moves loaded yet. Expand a team to check its moves, then retry.</p>':'';
 focus.innerHTML=`<article class="card td74-clash"><div class="td75-duel-title"><div class="td75-duel-mon td77-duel-mon"><img class="td77-duel-art" src="${art(own.id,own.name)}" alt="" onerror="this.hidden=true"><strong>${escape(pretty(own.name))}</strong>${typeBadges(a||own)}<small>Lv ${Number(own.level)||50}</small></div><span class="td75-vs">vs</span><div class="td75-duel-mon td77-duel-mon"><img class="td77-duel-art" src="${art(foe.id,foe.name)}" alt="" onerror="this.hidden=true"><strong>${escape(pretty(foe.name))}</strong>${typeBadges(d||foe)}<small>Lv ${Number(foe.level)||50}</small></div></div><details class="td74-shared-expand" ${opened?'open':''}><summary><div class="td74-clash-columns">${threatBox('YOUR BEST ATTACK',a,d,gen)}${threatBox('STRONGEST ENTERED THREAT',d,a,gen,true)}</div><small class="td74-shared-more">All attacks & threats ▾</small></summary><div class="td74-clash-columns td74-expanded-pair"><section class="td74-all-moves"><h4>Your attacks</h4>${formatMoves(a,d,gen)}</section><section class="td74-all-moves"><h4>Incoming threats</h4>${formatMoves(d,a,gen,true)}</section></div></details>${focusWarnings(a,d,gen)}${status}</article>`;
}
function refresh(){renderChips('own');renderChips('opp');renderFocus();mountBattleStats();}
function suggestedOwn(){const d=loaded('opp',oppSelection);if(!d)return ownSelection;const gen=last?.gen||gameGeneration($('planGame').value);
 const options=roster('own').map((p,i)=>{const a=loaded('own',i),out=bestMove(a,d,gen),inc=bestMove(d,a,gen);if(!p?.name||!out)return null;
 return {i,score:out.damage/Math.max(1,estimatedHP(d))-(inc?inc.damage/Math.max(1,estimatedHP(a))*.9:0)};}).filter(Boolean).sort((a,b)=>b.score-a.score);
 return options[0]?.i??ownSelection;
}
function select(side,i){if(side==='own'){ownSelection=i;userChoseOwn=true;}else{oppSelection=i;userChoseOwn=false;ownSelection=suggestedOwn();}refresh();}
strip.addEventListener('click',e=>{const b=e.target.closest('[data-td74-side]');if(b)select(b.dataset.td74Side,Number(b.dataset.td74I));});
focus.addEventListener('click',e=>{if(e.target.closest('[data-td74-retry]'))$('planAnalyze').click();});
function scheduleAnalyze(){clearTimeout(analyzeTimer);updating=true;analysisError='';refresh();
 if(!plannerOwn.some(p=>p?.name)||!plannerOpp.some(p=>p?.name)){updating=false;return;}
 analyzeTimer=setTimeout(()=>{if(!$('plannerPage').hidden)$('planAnalyze').click();},320);
}
window.addEventListener('td74:plan-results',e=>{last=e.detail;updating=false;analysisError='';
 if(!userChoseOwn&&loaded('opp',oppSelection))ownSelection=suggestedOwn();
 for(const side of ['own','opp']){const rows=roster(side);let j=0;for(const r of rows){if(!r?.name)continue;const d=(side==='own'?last.own:last.opp)[j++];if(d?.id&&!r.id)r.id=d.id;}}
 refresh();
});
window.addEventListener('td74:plan-error',e=>{updating=false;analysisError=e.detail?.message||'Battle data could not load.';refresh();});
window.addEventListener('td75:active-game',()=>{last=null;analysisError='';updating=false;userChoseOwn=false;ownSelection=0;oppSelection=0;refresh();scheduleAnalyze();});
function syncPlannerTeam(){if(syncing)return;const t=selectedTeam('planTeam');if(!t||t.game!==$('planGame').value)return;
 const latest=Array.from({length:6},(_,i)=>{const p=t.pokemon?.[i];if(!p)return {name:'',level:50,moves:[]};
 const name=clean(p.name),old=plannerOwn[i]||{},same=clean(old.name)===name;
 return {id:p.id||null,name,level:same?old.level||50:50,moves:(p.moves||[]).map(m=>clean(typeof m==='string'?m:m?.name)),item:same?(old.item||p.item||''):(p.item||''),statAdjustments:same?old.statAdjustments||{}:{},baseStats:p.baseStats||null,types:p.types||[],abilities:p.abilities||[]};});
 const sig=a=>JSON.stringify(a.map(p=>[p.name,p.id,p.moves,p.level,p.item]));if(sig(latest)===sig(plannerOwn))return;
 syncing=true;plannerOwn=latest;renderPlannerSlots('planOwn',plannerOwn,true);td72SavePlannerLevels();syncing=false;scheduleAnalyze();
}
window.addEventListener('td74:team-saved',syncPlannerTeam);
for(const id of ['planOwn','planOpp']){const node=$(id),obs=new MutationObserver(()=>{refresh();scheduleAnalyze();});obs.observe(node,{childList:true,subtree:false});
 node.addEventListener('input',e=>{if(e.target.matches('[data-field="level"][data-plan]'))scheduleAnalyze();});
 node.addEventListener('change',e=>{if(e.target.closest('[data-plan]'))scheduleAnalyze();});}
for(const id of ['planTeam','planTrainer','planVersion','planMode','planGame'])$(id)?.addEventListener('change',()=>{last=null;userChoseOwn=false;ownSelection=0;oppSelection=0;scheduleAnalyze();});
// Visible final battle stats, as on the in-game summary (no IV/EV editing grid).
const STAT_NAMES={'hp':'HP','attack':'Attack','defense':'Defense','special-attack':'Sp. Atk','special-defense':'Sp. Def','speed':'Speed'};
function mountBattleStats(){
 for(const side of ['own','opp']){
  const host=$(side==='own'?'planOwn':'planOpp'),entries=roster(side);
  for(const slot of host.querySelectorAll('details.td63-slot')){
   const i=Number(slot.dataset.i),entry=entries[i];if(!entry?.name)continue;
   const match=loaded(side,i),base=match?.baseStats||entry?.baseStats;
   if(!base)continue;
   let pane=slot.querySelector('.td74-battle-stats');
   if(!pane){pane=document.createElement('details');pane.className='td74-battle-stats';
    pane.innerHTML='<summary>Battle stats · tap to adjust</summary><div class="td74-stat-fields"></div><div class="td75-stat-footer"><small>Level-based estimates · edit to match your game</small><button type="button" data-td74-stat-reset="'+side+'-'+i+'" aria-label="Reset battle stats to estimates">↺ Auto</button></div>';
    slot.querySelector('.td63-slot-fields')?.appendChild(pane);
   }
   const box=pane.querySelector('.td74-stat-fields'),values=td74StatsAt(base,entry.level,entry.statAdjustments);
   for(const key of window.takDexBattleStatsV74.keys){
    let field=box.querySelector('input[data-td74-stat="'+key+'"]');
    if(!field){const label=document.createElement('label');label.className='td74-stat-field';label.title='Species base '+STAT_NAMES[key]+': '+(base[key]??'unknown');label.innerHTML='<span class="td76-stat-name">'+STAT_NAMES[key]+'<small class="td76-base-stat">Base '+(Number.isFinite(Number(base[key]))?base[key]:'—')+'</small></span><input type="number" min="1" max="999" inputmode="numeric" data-td74-stat="'+key+'" data-td74-side="'+side+'" data-td74-i="'+i+'" aria-label="'+STAT_NAMES[key]+' battle stat" />';box.appendChild(label);field=label.querySelector('input');}
    const baseTag=field.closest('.td74-stat-field')?.querySelector('.td76-base-stat');if(baseTag)baseTag.textContent='Base '+(Number.isFinite(Number(base[key]))?base[key]:'—');
    if(document.activeElement!==field)field.value=String(Math.round(values[key]));
   }
  }
 }
}
for(const id of ['planOwn','planOpp']){
 $(id).addEventListener('change',e=>{
  const input=e.target.closest('input[data-td74-stat]');if(!input)return;
  const side=input.dataset.td74Side,i=Number(input.dataset.td74I),entry=roster(side)[i],base=loaded(side,i)?.baseStats||entry?.baseStats;if(!entry||!base)return;
  const key=input.dataset.td74Stat,value=Number(input.value);
  if(!Number.isInteger(value)||value<1||value>999)return;
  entry.statAdjustments={...(entry.statAdjustments||{}),[key]:value-td74StatEstimate(base[key],entry.level,key==='hp')};
  if(side==='own')td72SavePlannerLevels();scheduleAnalyze();
 });
 $(id).addEventListener('click',e=>{
  const b=e.target.closest('[data-td74-stat-reset]');if(!b)return;
  const [side,i]=b.dataset.td74StatReset.split('-'),entry=roster(side)[Number(i)];if(!entry)return;
  entry.statAdjustments={};if(side==='own')td72SavePlannerLevels();mountBattleStats();scheduleAnalyze();
 });
 $(id).addEventListener('input',e=>{
  if(e.target.matches('[data-field="level"]'))requestAnimationFrame(mountBattleStats);
 });
}
// Level +/- buttons do not emit an input/change event: refresh the estimates immediately.
for(const id of ['planOwn','planOpp']){
 $(id).addEventListener('click',e=>{if(e.target.closest('[data-td72-level-step]'))requestAnimationFrame(()=>{mountBattleStats();refresh();scheduleAnalyze();});});
 $(id).addEventListener('change',e=>{if(e.target.matches('input[data-field="level"]'))requestAnimationFrame(()=>{mountBattleStats();refresh();});});
}
function selectedGame(){const id=localStorage.getItem('takdex-v71-active-team');const selected=teams.find(t=>t.id===id);return selected?.game||td66SavedGame()||'';}
// Recently viewed Pokémon, captured from normal Pokédex navigation without altering navigation handlers.
const RECENT='takdex-v74-recent';
function recent(){try{return JSON.parse(localStorage.getItem(RECENT)||'[]').filter(Boolean).slice(0,8)}catch{return []}}
function rememberPokemon(name){if(!name)return;const next=[pretty(name),...recent().filter(x=>clean(x)!==clean(name))].slice(0,8);try{localStorage.setItem(RECENT,JSON.stringify(next))}catch{}renderRecent();}
const recentPanel=document.createElement('details');recentPanel.className='card td74-recent';recentPanel.innerHTML='<summary>Recently viewed Pokémon</summary><div id="td74RecentContents"></div>';const more=$('morePage');more.appendChild(recentPanel);
function renderRecent(){const row=$('td74RecentContents');row.innerHTML=recent().length?recent().map(n=>`<button type="button" data-td74-recent="${escape(n)}">${escape(n)}</button>`).join(''):'<p class="note">Your recently viewed Pokémon appear here.</p>';}
renderRecent();
document.addEventListener('click',e=>{
 const mon=e.target.closest('[data-td73-mon]');if(mon)rememberPokemon(mon.dataset.td73Mon);
 const rec=e.target.closest('[data-td74-recent]');if(rec){const g=selectedGame();if(g&&games.includes(g)){$('dexGame').value=g;$('dexInput').value=rec.dataset.td74Recent;window.takActivate(2);$('dexSearch').click();}}
},true);
// Save and restore search strings without forcefully triggering a new data fetch.
for(const id of ['tmMoveSearch','tmPokemon','dexInput']){
 const field=$(id);if(!field)continue;const key='takdex-v74-input-'+id;
 if(!field.value)try{field.value=sessionStorage.getItem(key)||''}catch{}
 field.addEventListener('input',()=>{try{sessionStorage.setItem(key,field.value)}catch{}});
}
// The Pokédex sections are directly reachable through a small horizontal jump bar.
const dex=$('dexResult'),jump=document.createElement('nav');jump.id='td74DexJump';jump.setAttribute('aria-label','Pokédex sections');dex.before(jump);
function renderDexJumps(){const headings=[...dex.querySelectorAll('h2,h3,h4')].filter(h=>h.offsetParent!==null).slice(0,12);
 const keys=['moves','evol','encounter','ability','machine'];const chosen=headings.filter(h=>keys.some(k=>h.textContent.toLowerCase().includes(k))&&!/base stats/i.test(h.textContent)).slice(0,5);
 jump.innerHTML=chosen.map((h,i)=>`<button type="button" data-td74-dex-jump="${i}">${escape(h.textContent.trim().slice(0,22))}</button>`).join('');jump._sections=chosen;
}
let jumpsScheduled=false;new MutationObserver(()=>{if(jumpsScheduled)return;jumpsScheduled=true;requestAnimationFrame(()=>{jumpsScheduled=false;renderDexJumps()})}).observe(dex,{subtree:true,childList:true});
jump.addEventListener('click',e=>{const b=e.target.closest('[data-td74-dex-jump]');if(b)jump._sections?.[Number(b.dataset.td74DexJump)]?.scrollIntoView({behavior:'smooth',block:'start'});});
// Per-team compatibility in TM/HM checker: no extra confirmation to see whose moves are compatible.
const tmResult=$('tmResults'),teamBar=document.createElement('div');teamBar.id='td74TMTeamBar';tmResult.before(teamBar);
function renderTMTeam(){const t=selectedTeam('tmTeam');if(!t){teamBar.innerHTML='';return;}teamBar.innerHTML='<div class="td74-strip-heading"><strong>Selected team</strong><small>Compatibility appears in results below</small></div><div class="td74-mon-row">'+Array.from({length:6},(_,i)=>{const p=t.pokemon[i];return `<span class="td74-mon-chip"><span class="td74-mon-art">${p?.id?`<img loading="lazy" src="${art(p.id)}" alt="">`:'+'}</span><span class="td74-mon-name">${escape(pretty(p?.name||'Empty').split(' ')[0])}</span></span>`;}).join('')+'</div>';}
$('tmTeam')?.addEventListener('change',renderTMTeam);$('tmGame')?.addEventListener('change',()=>setTimeout(renderTMTeam,0));renderTMTeam();
refresh();

// All Pokédex encounter locations for Platinum link to the active Sinnoh map.
const dexRecords=$('dexResult');
function linkDexEncounters(){const region=dexRecords.querySelector('#td56DexEncounters .td66-section-body');
 if(!region||!['Platinum','Black','White'].includes($('dexGame').value))return;
 for(const bold of region.querySelectorAll('p > b')){if(bold.querySelector('button'))continue;
 const raw=bold.textContent.trim(),name=raw.split(' · ')[0].trim();
 // Acquisition evidence labels summarize records; they are not geographical locations.
 // Leave the individual, actual encounter location links above them untouched.
 if(/^(recorded encounter|starter|evolution route|trade evolution|external trade required|event-only(?:.+)?|gift|availability unverified):?$/i.test(raw))continue;
 const mapped=window.takDexMapsV73?.resolveLocation?.(name,$('dexGame').value);
 bold.innerHTML=mapped?`<button type="button" class="td74-dex-map-link" data-td74-dex-map="${escape(mapped)}" title="Show ${escape(name)} on the map">${escape(raw)} <span aria-hidden="true">⌖</span></button>`:`<button type="button" class="td74-dex-map-link" data-td74-dex-map-search="${escape(name)}" title="Search ${escape(name)} on the map">${escape(raw)} <span aria-hidden="true">⌖</span></button>`;
 }
}
function linkDexActions(){const hero=dexRecords.querySelector('.td71-dex-hero'),name=hero?.querySelector('h3')?.textContent.trim(),game=$('dexGame').value;
 if(!hero||!name||hero.querySelector('.td74-dex-actions'))return;
 const bar=document.createElement('div');bar.className='td74-dex-actions';
 bar.innerHTML=(['Platinum','Black','White'].includes(game)?`<button type="button" data-td74-dex-map-search="${escape(name)}">⌖ Encounter map</button>`:'')+`<button type="button" data-td74-dex-battle="${escape(name)}"><img src="takdex-battle-nav.png" alt="" class="td74-mini-battle-icon"> Battle</button>`;
 hero.appendChild(bar);
}
const debouncedDex=new MutationObserver(()=>{linkDexEncounters();linkDexActions();});debouncedDex.observe(dexRecords,{childList:true,subtree:true});
// Capture early so Pokédex navigation wrappers cannot swallow a map or battle action.
document.addEventListener('click',e=>{
 const loc=e.target.closest('#dexResult [data-td74-dex-map],#tmPage [data-td74-tm-map],#dexResult [data-td74-dex-map-search],#dexResult [data-td74-dex-battle]');
 if(!loc)return;
 e.preventDefault();e.stopImmediatePropagation();
 const name=loc.dataset.td74DexMap||loc.dataset.td74TmMap;
 if(name){window.takDexMapsV73?.open(loc.dataset.td74TmGame||$('dexGame').value||$('tmGame').value||'Platinum',name);return;}
 if(loc.hasAttribute('data-td74-dex-map-search')){
  window.takDexMapsV73?.open($('dexGame').value);const field=$('mapsSearch');field.value=loc.dataset.td74DexMapSearch;field.dispatchEvent(new Event('input',{bubbles:true}));field.focus();return;
 }
 const mon=loc.dataset.td74DexBattle;
 if(mon)window.td74OpenBattleOpponent?.(mon,$('dexGame').value);
},true);
// Direct cross-tool map navigation; capture early so panels cannot swallow the click.
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-td74-machine-location],[data-td74-tm-map]');if(!b)return;
 e.preventDefault();e.stopImmediatePropagation();
 const chosenGame=b.dataset.td74MachineGame||b.dataset.td74TmGame||$('tmGame').value||td66SavedGame()||'Platinum';
 const raw=b.dataset.td74MachineLocation||b.dataset.td74TmMap||'';
 // Resolve the location INSIDE the requested game, atomically. Never reuse
 // whatever region was rendered before this button was clicked.
 window.takDexMapsV73?.open(chosenGame,raw);
},true);
})();
