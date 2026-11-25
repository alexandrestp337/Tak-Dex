/* Tak-Dex V74 DEV3 — compact opponent-first battle dashboard, inline team editors. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clean=s=>String(s||'').trim().toLowerCase().replace(/\s+/g,'-');
const art=(id,name)=>{const num=Number(id)||window.takDexBWCoreV75?.ids?.[clean(name)]||window.takDexSpriteIdsV77?.[clean(name)]||({pidove:519})[clean(name)]||0;return num?`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${num}.png`:name?`https://play.pokemonshowdown.com/sprites/gen5/${clean(name)}.png`:'';};
let ownSelection=0,oppSelection=0,last=null,analyzeTimer=null,updating=false,analysisError='',userChoseOwn=false,preserveSyncedMatchup=false;
const strip=$('td74TeamStrips'),focus=$('td74Focus');
if(!strip||!focus)return;
const orgOwn=$('planOwn'),orgOpp=$('planOpp'),oldEditors=$('td74PlannerEditors');
// Keep the original editor DOM and event handlers. Move, rather than clone, each editor
// to the team whose Pokémon it changes. No separate page-wide edit panel.
strip.innerHTML=`<section class="td74-team-strip own"><div class="td74-strip-heading"><strong>Your team</strong></div><div id="td74OwnChips" class="td74-mon-row"></div><details id="td74EditorOwn" class="td74-team-editor"><summary>✎ Edit levels &amp; held items</summary></details></section><section class="td74-team-strip opp"><div class="td74-strip-heading"><strong>Opponents</strong></div><div id="td74OppChips" class="td74-mon-row"></div><details id="td74EditorOpp" class="td74-team-editor"><summary>✎ Edit opponent Pokémon &amp; moves</summary></details></section>`;
$('td74EditorOwn').appendChild(orgOwn);$('td74EditorOpp').appendChild(orgOpp);
oldEditors.hidden=true;
function updateOwnEditorLabel(){
 const editor=$('td74EditorOwn');
 editor.hidden=$('planTeam').value!==TD74_CUSTOM_TEAM;
 editor.querySelector('summary').textContent='✎ Build custom team · Pokémon, moves & items';
}
$('planTeam').addEventListener('change',updateOwnEditorLabel);updateOwnEditorLabel();
// DEV7: team switches in Team Builder can finish while 6v6 is hidden.
$('openPlanner')?.addEventListener('click',()=>{last=null;analysisError='';updating=false;queueMicrotask(()=>{updateOwnEditorLabel();if(!$('plannerPage').hidden)scheduleAnalyze();});});

const roster=side=>side==='own'?plannerOwn:plannerOpp;
function loaded(side,index){const src=roster(side)[index];if(!src?.name||!last)return null;
 const present=roster(side).slice(0,index+1).filter(x=>x?.name).length-1;
 const match=(side==='own'?last.own:last.opp)[present];
 if(src.saveStats?.egg)return null;
 if(!td73SamePokemon(match,src)||last.game&&last.game!==$('planGame').value||match.sourceMoves!==undefined&&match.sourceMoves!==td73MoveSignature(src.moves))return null;
 if(match.dataMissing||!match.baseStats)return match;
 return {...match,level:Number(src.level)||50,heldItem:src.item||'',statAdjustments:{...(src.statAdjustments||{})},battleStats:td74EntryStats(match.baseStats,src),currentHP:src.saveStats?.level===Number(src.level)?src.saveStats?.currentHP:undefined,friendship:src.saveStats?.friendship,ivs:src.saveStats?.ivs,selectedAbility:td2ResolveAbility(match,src.ability)||null};
}
const outcomes=window.takDexBattleOutcomes;
function bestMove(a,d,gen){return outcomes.attacks(a,d,gen)[0]||null;}
function moveSummary(attack,defend,gen){return (attack?.moves||[]).filter(m=>m?.name).map(m=>({m,damage:estimateDamage(attack,defend,m,gen)})).sort((a,b)=>(Number.isFinite(b.damage)?b.damage:-1)-(Number.isFinite(a.damage)?a.damage:-1));}
function effectivenessClass(mult,incoming){
 if(!Number.isFinite(mult)||mult===1)return 'neutral';
 return (incoming?mult<1:mult>1)?'safe':'danger';
}
function rankedMatchups(){
 const defender=loaded('opp',oppSelection),gen=last?.gen||gameGeneration($('planGame').value);
 if(!defender)return [];
 return roster('own').map((_,i)=>({i,attack:bestMove(loaded('own',i),defender,gen)}))
  .filter(row=>row.attack).sort((a,b)=>outcomes.compareAttacks(a.attack,b.attack)||a.i-b.i);
}
function matchupRanks(){return new Map(rankedMatchups().map((row,i)=>[row.i,i+1]));}
function teamChip(p,i,rank,active,attrs,disabled=false,level=null,showLevel=true){const name=p?.name?(p.nickname||td41PokemonLabel(p.name)):'Empty',best=rank===1,src=p?.name?art(p.id,p.name):'';return `<button type="button" class="td74-mon-chip ${active?'active':''} ${best?'td74-crowned':''}" ${attrs} ${disabled?'disabled':''} aria-pressed="${active}" aria-label="${escape(name)}" title="${escape(name)}${rank?' · matchup #'+rank:''}">${rank?`<span class="td74-corner-rank" aria-label="${best?'Best matchup':'Rank '+rank}">${best?'👑':'#'+rank}</span>`:''}<span class="td74-mon-art">${src?`<img src="${escape(src)}" alt="" loading="eager" decoding="async" data-td62-sprite="${escape(clean(p.name))}" draggable="false">`:'+'}</span><span class="td74-mon-name">${escape(name)}${p?.shiny||p?.saveStats?.shiny?' <span aria-label="Shiny">✨</span>':''}</span>${showLevel||!p?.name?`<small>${p?.name?(level?'Lv '+level:'Lv —'):'Slot '+(i+1)}</small>`:''}</button>`;}
function renderChips(side){
 const rows=roster(side),chosen=side==='own'?ownSelection:oppSelection,ranks=side==='own'?matchupRanks():new Map();
 const host=$(side==='own'?'td74OwnChips':'td74OppChips');if(window.td3HoldActive?.()||host.contains(document.activeElement)&&document.activeElement.matches('[data-td2-level]'))return;const html=Array.from({length:6},(_,i)=>{
 const p=rows[i]||{};return teamChip(p,i,ranks.get(i),i===chosen,`data-td74-side="${side}" data-td74-i="${i}"`,false,p.name?Number(p.level)||50:null);
 }).join('');
 if(host.dataset.td62Markup!==html){host.dataset.td62Markup=html;host.innerHTML=html;}
}
strip.addEventListener('error',e=>{const img=e.target;if(!img.matches?.('img[data-td62-sprite]')||img.dataset.td62Fallback)return;img.dataset.td62Fallback='1';const fallback='https://play.pokemonshowdown.com/sprites/gen5/'+encodeURIComponent(img.dataset.td62Sprite)+'.png';if(img.src!==fallback)img.src=fallback;},true);
function typeBadges(p){const raw=p?.types||[];return raw.length?`<span class="td75-types">${raw.map(t=>pill(t)).join('')}</span>`:'<span class="td75-type-unknown">Types unavailable</span>';}
function quickOrder(a,d,gen){
 const level=a?.level||50;
 const speed=p=>p?.baseStats?.speed&&((p.battleStats?.speed&&p.level?p.battleStats.speed-td74StatEstimate(p.baseStats.speed,level):0)+p.baseStats.speed)*(gen>=4&&p.heldItem==='Choice Scarf'?1.5:1);
 const first=speed(a),second=speed(d);
 if(!(first>0&&second>0))return null;
 return Math.abs(first-second)>=Math.max(5,Math.max(first,second)*.05)?Math.sign(first-second):0;
}
function potentialThreat(a,d,gen){
 const stats=d.baseStats||{}, physical=stats.attack, special=stats['special-attack'];
 const tendency=physical===special?'Balanced offense':physical>special?'Physical tendency':'Special tendency';
 return `<section class="td76-defense"><h4>Potential STAB</h4>${plannerPotentialStab(d,a,gen).map(({type,mult})=>{
  const tone=mult<1?'safe':mult>1?'danger':'neutral';
  return `<div class="td76-defense-type td74-effect-${tone}">${pill(type)} <strong>${mult+'× '+(mult===0?'Immune':mult>1?'Weak':mult<1?'Resists':'Neutral')}</strong></div>`;
 }).join('')}<div class="td76-defense-stats"><h5>Opponent base stats</h5><dl>
  ${Object.entries(STAT_NAMES).map(([key,label])=>`<div><dt>${label}</dt><dd>${escape(stats[key]??'—')}</dd></div>`).join('')}
 </dl>${physical&&special?`<small>${tendency}</small>`:''}</div></section>`;
}
function moveCard(m,a,d,gen,{incoming=false,battle=false,outcome=null,standardOrder=null,comparison=null}={}){
 const report=td72AbilityReport(m,d,gen,a), status=m.damageClass==='status';
 const stab=status?1:td2Stab(m,a,gen);
 const multiplier=td2Combined(m,a,d,gen);
 const power=td2Power(m,a,d,gen);
 const score=expectedPower(m,a,d,gen), highScore=expectedPower(m,a,d,gen,'max');
 const damage=battle||status?null:estimateDamage(a,d,m,gen);
 const boosted=outcome?.boost>0&&Number.isFinite(outcome.minimum);
 const high=boosted?outcome.maximum:damage;
 const low=boosted?outcome.minimum:damage===null?null:damage===0||['Seismic Toss','Night Shade','Dragon Rage','Sonic Boom'].includes(m.name)?damage:Math.max(1,Math.floor(damage*.85));
 const hp=estimatedHP(d);
 const percent=n=>Math.round(n*100/hp);
 const bound=n=>Math.min(100,percent(n));
 const order=comparison?outcomes.orderChance(a,d,m,comparison,gen):null;
 const notes=[];
 if(!battle){
  if(TD2_RECHARGE.has(m.name))notes.push('Recharge after hit');
  else if(td2Turns(m,a,gen)>1)notes.push('Charges first');
  if(boosted)notes.push('Boost '+Math.round(outcome.boost*100)+'%');
  if(outcome){
   const knockout=outcome.verifiedThreat?outcomes.koLabel(outcome):'';
   if(knockout)notes.push(knockout);
   else if(high>=outcomes.hp(d)&&!TD2_CHARGE.has(m.name)){
    if(!outcome.verifiedThreat)notes.push('OHKO damage · turn order unknown');
    else if(outcome.acts===0)notes.push('OHKO damage · may be KO’d before attacking');
   }
  }
  if(order!==null&&standardOrder!==null&&order!==standardOrder)notes.push(order===.5?'Speed tie':order?'Moves first':'Moves second');
  const ability=td2OffensiveModifier(m,a,gen);
  if(ability!==1)notes.push(pretty(td2ActualAbility(a))+' ×'+ability);
 }
 if(report.possibleImmune.length)notes.push('Possible immunity: '+report.possibleImmune.map(pretty).join(' / '));
 return `<article class="td74-move-detail td76-move-card td74-effect-${effectivenessClass(status?null:report.effective,incoming)}" data-type-effect="${report.base??''}" data-move-type="${escape(m.type||'')}"><div class="td76-move-head"><button type="button" class="td76-move-link" data-td76-move="${escape(m.name)}">${escape(m.name)}</button>${m.type?pill(m.type):''}</div><small class="td76-move-category">${escape(pretty(m.damageClass||''))}</small><span class="td76-move-effect">${status?'—':multiplier===null?'—':multiplier===0?'Immune':multiplier+'×'}${td3Stab(stab>1)}</span><small>PWR ${power?(power.min===power.max?power.min:power.min+'–'+power.max):'—'} · ACC ${escape(accuracyLabel(m))}</small><small class="td76-move-score">Score ${score===null?'—':Math.round(score)+(highScore>score?'–'+Math.round(highScore):'')}</small>${high===null?'':`<small class="td76-damage-text">Est. ${low}–${high} HP · ${percent(low)}–${percent(high)}%</small><div class="td76-damage-track ${incoming?'incoming':''}" style="--low:${bound(low)}%;--high:${bound(high)}%" aria-hidden="true"></div>`}${notes.length?`<small>${escape(notes.join(' · '))}</small>`:''}</article>`;
}
function moveCards(a,d,gen,{incoming=false,battle=false,ranked=[],first=null,standardOrder=null,comparison=null}={}){
 if(!a?.moves||!d)return [];
 const moves=moveSummary(a,d,gen).map(row=>row.m);
 const score=m=>expectedPower(m,a,d,gen)??-1;
 if(battle)moves.sort((x,y)=>score(y)-score(x));
 else if(first)moves.sort((x,y)=>Number(y===first)-Number(x===first));
 return [...new Map(moves.map(m=>[td73MoveKey(m.name),m])).values()].map(m=>moveCard(m,a,d,gen,{incoming,battle,outcome:incoming?outcomes.against(a,d,m,comparison,gen):ranked.find(row=>row.m===m),standardOrder,comparison}));
}
window.td76QuickMoveCards=(a,d,gen)=>moveCards(a,d,gen,{battle:true}).join('');
function duelCard(own,foe,a,d,gen,status,context='planner'){
 const battle=context==='battle';
 const attacks=battle?[]:outcomes.attacks(a,d,gen);
 const best=attacks[0], threat=battle?null:outcomes.threat(d,a,gen);
 const knownOrder=best?.n?.type?outcomes.orderChance(a,d,best.m,best.n,gen):null;
 const first=battle?quickOrder(a,d,gen):knownOrder===null||knownOrder===.5?0:knownOrder?1:-1;
 const indicator=first?(battle?'Should strike first':'Strikes first'):
  battle&&first===0?'Speed too close to call':knownOrder===.5?'Speed tie':'Turn order uncertain';
 const orderSide=first||1;
 const orderClass=first>0?'player':first<0?'opponent':'neutral';
 const mon=(p,stats,side)=>{
  const profile=stats||p;
  const shiny=p.shiny||p.saveStats?.shiny;
  const item=stats?.heldItem||p.item;
  return `<div class="td75-duel-mon td77-duel-mon td77-duel-side-${side} td73-poke-link" role="button" tabindex="0" data-td73-mon="${escape(p.name)}" data-td73-context="${context}">
   <img class="td77-duel-art" src="${escape(p.image||art(p.id,p.name))}" alt="" draggable="false" onerror="if(!this.dataset.td7Fallback)this.hidden=true">
   <strong>${escape(td41PokemonLabel(p.name))}</strong><div class="td77-duel-types">${typeBadges(profile)}</div>
   <div class="td77-duel-ability">${td3AbilityText(profile)}</div>
   ${battle?'':`<small class="td31-duel-level">Lv ${Number(stats?.level||p.level)||50}${shiny?' · ✨':''}</small>`}<small class="td77-duel-item">${escape(item||'')}</small>
  </div>`;
 };
 const order=a&&d?`<div class="td77-turn-row"><small class="td76-turn-order ${orderClass}" data-side="${orderSide===1?'own':'opp'}" title="${battle?'Estimate at comparable levels and training':'For the modeled move pair'}">${indicator}</small></div>`:'';

 const outgoing=moveCards(a,d,gen,{battle,ranked:attacks,first:best?.m,standardOrder:knownOrder,comparison:best?.n?.type?best.n:null});
 const incoming=moveCards(d,a,gen,{incoming:true,first:threat?.m,standardOrder:knownOrder===null?null:1-knownOrder,comparison:best?.m});
 const danger=best?.m&&outcomes.threat(d,a,gen,best.m);
 const warning=danger?.preemptiveKo>0?danger.m.name+(danger.preemptiveKo>=1-1e-10?' is predicted to KO before you attack':' can KO before you attack'):'';
 const opportunity=best?.beforeReplyKo>0?best.m.name+
  (best.beforeReplyKo>=1-1e-10?' will OHKO before the opponent attacks':' can OHKO before the opponent attacks'):'';
 const moves=battle?`<div class="td74-clash-columns td76-quick-grid"><section><h4>Your attacks</h4>${outgoing.join('')||'<small>No moves entered.</small>'}</section>${a&&d?potentialThreat(a,d,gen):''}</div>`:
 `<div class="td76-duel-grid"><h4>Your attacks</h4><h4>Incoming threats</h4>${Array.from({length:Math.max(1,outgoing.length,incoming.length)},(_,i)=>(outgoing[i]||`<div>${i===0?'<small>No moves entered.</small>':''}</div>`)+(incoming[i]||`<div>${i===0?'<small>No moves entered.</small>':''}</div>`)).join('')}</div>`;
 return `<article class="card td74-clash"><div class="td75-duel-title${battle?'':' td77-duel-six'}">${mon(own,a,'own')}<span class="td75-vs">vs</span>${mon(foe,d,'opp')}</div>${order}${warning?`<aside class="td76-battle-warning"><span aria-hidden="true">⚠</span> ${escape(warning)}</aside>`:''}${opportunity?`<aside class="td76-battle-warning td76-battle-opportunity"><span aria-hidden="true">✓</span> ${escape(opportunity)}</aside>`:''}${status||''}${moves}</article>`;
}

function renderFocus(){if(window.td3HoldActive?.())return;const own=roster('own')[ownSelection]||{},foe=roster('opp')[oppSelection]||{};
 if(!own.name||!foe.name){focus.innerHTML='<div class="card"><h3>Select an opponent and a Pokémon</h3><p class="note">Select the opponent first to view your team rankings, then choose a matchup.</p></div>';return;}
 const a=loaded('own',ownSelection),d=loaded('opp',oppSelection),gen=last?.gen||gameGeneration($('planGame').value);
 const status=analysisError?`<p class="note td74-calc-error">${escape(analysisError)} <button type="button" data-td74-retry>Retry</button></p>`:updating?'<p class="note td74-calc-note">Recalculating…</p>':(!a||!d)?'<p class="note td74-calc-note">Matchup data not ready. Retry calculation if it does not load.</p>':'';
 focus.innerHTML=duelCard(own,foe,a,d,gen,status,'planner');
}
let battleKey='',battleOwnIndex=null;
const battleStrip=$('td76BattleStrip');
window.td76RenderBattleStrip=function(team,ranked=[]){
 battleStrip.hidden=!team;
 if(!team)return;
 const rows=team.pokemon||[],ranks=new Map(ranked.map((row,i)=>[row.p,i+1]));
 battleStrip.innerHTML=`<div class="td74-strip-heading"><strong>My Team</strong></div><div class="td74-mon-row">${Array.from({length:6},(_,i)=>{
  const p=rows[i];return teamChip(p,i,ranks.get(p),i===battleOwnIndex,`data-td3-battle-slot="${i}"`,!p,p?.level??p?.saveStats?.level,!!(p?.level??p?.saveStats?.level));
 }).join('')}</div>`;
};
window.td3RenderSingleBattle=function(team,target,ranked,gen){
 const host=$('matchups');
 if(window.td3HoldActive?.())return;
 const key=team.id+'|'+team.game+'|'+clean(target.name),rows=team.pokemon||[];
 if(key!==battleKey||!rows[battleOwnIndex]){
  battleKey=key;battleOwnIndex=rows.indexOf(ranked[0]?.p);
 }
 window.td76RenderBattleStrip(team,ranked);
 const selected=rows[battleOwnIndex];
 host.innerHTML=selected?duelCard(selected,target,td33BaseBattleMon(selected,team,battleOwnIndex),td33BaseBattleMon(target),gen,'','battle'):'<p>Add Pokémon to your team.</p>';
};
battleStrip.addEventListener('click',e=>{
 const button=e.target.closest('[data-td3-battle-slot]');
 if(!button||button.disabled)return;
 battleOwnIndex=Number(button.dataset.td3BattleSlot);showBattle();
 if(doubleMode)$('matchups').querySelector(`[data-td76-battle-card="${battleOwnIndex}"]`)?.scrollIntoView({block:'nearest'});
 battleStrip.querySelector(`[data-td3-battle-slot="${battleOwnIndex}"]`)?.focus({preventScroll:true});
});
for(const [id,source] of [['matchups','battle'],['td74Focus','planner']]){
 $(id).addEventListener('click',event=>{
  const button=event.target.closest('[data-td76-move]');
  if(button)window.takDexMoveV68.open(button.dataset.td76Move,source,source==='battle'?current?.game:$('planGame').value);
 });
}
function refresh(){updateOwnEditorLabel();renderChips('own');renderChips('opp');renderFocus();mountBattleStats();}
function suggestedOwn(){return rankedMatchups()[0]?.i??ownSelection;}
function select(side,i){if(side==='own'){ownSelection=i;userChoseOwn=true;}else{oppSelection=i;userChoseOwn=false;ownSelection=suggestedOwn();}refresh();}
function commitLevel(side,i,value){const row=roster(side)[i];if(!row?.name)return;const n=tdDev1Level(value,row.level||50);row.level=n;const field=$(side==='own'?'planOwn':'planOpp').querySelector(`[data-td2-level="${side}:${i}"]`);if(field&&document.activeElement!==field)field.value=String(n);return n;}
strip.addEventListener('focusin',e=>{if(e.target.matches('[data-td2-level]'))e.target.select()});
strip.addEventListener('input',e=>{const input=e.target;if(!input.matches('[data-td2-level]')||!/^\d{1,3}$/.test(input.value)||+input.value<1||+input.value>100)return;const [side,i]=input.dataset.td2Level.split(':');commitLevel(side,+i,input.value);refresh();});
strip.addEventListener('focusout',e=>{const input=e.target;if(!input.matches('[data-td2-level]'))return;const [side,i]=input.dataset.td2Level.split(':');input.value=String(commitLevel(side,+i,input.value));setTimeout(()=>scheduleAnalyze(),180);});
strip.addEventListener('keydown',e=>{if(e.target.matches('[data-td2-level]')&&e.key==='Enter'){e.preventDefault();e.target.blur()}});
strip.addEventListener('click',e=>{if(e.target.closest('.td3-header-level')&&!e.target.matches('input'))e.preventDefault();const step=e.target.closest('[data-td2-step]');if(step){e.preventDefault();e.stopPropagation();const [side,i,delta]=step.dataset.td2Step.split(':');const row=roster(side)[+i];const n=commitLevel(side,+i,tdDev1Level(row.level,50)+Number(delta));const field=step.parentElement.querySelector('input');if(field)field.value=String(n);scheduleAnalyze();return;}if(e.target.closest('.td3-header-level')){e.stopPropagation();return;}const b=e.target.closest('[data-td74-side]');if(b)select(b.dataset.td74Side,Number(b.dataset.td74I));});
focus.addEventListener('click',e=>{if(e.target.closest('[data-td74-retry]'))$('planAnalyze').click();});
function scheduleAnalyze(){clearTimeout(analyzeTimer);updating=true;analysisError='';refresh();
 if(!plannerOwn.some(p=>p?.name)||!plannerOpp.some(p=>p?.name)){updating=false;return;}
 analyzeTimer=setTimeout(()=>{if(!$('plannerPage').hidden)$('planAnalyze').click();},320);
}
window.addEventListener('td74:plan-results',e=>{last=e.detail;updating=false;analysisError='';
 if((!preserveSyncedMatchup&&!userChoseOwn||!plannerOwn[ownSelection]?.name)&&loaded('opp',oppSelection))ownSelection=suggestedOwn();
 preserveSyncedMatchup=false;
 for(const side of ['own','opp']){const rows=roster(side);let j=0;for(const r of rows){if(!r?.name)continue;const d=(side==='own'?last.own:last.opp)[j++];if(td73SamePokemon(d,r)&&d?.id&&!r.id)r.id=d.id;if(d&&!d.dataMissing&&td73SamePokemon(d,r)&&(side==='opp'||$('planTeam').value===TD74_CUSTOM_TEAM)){r.abilities=d.abilities;r.weight=d.weight;r.ability=td2ResolveAbility(d,r.ability);const sel=$(side==='own'?'planOwn':'planOpp').querySelector(`select[data-field="ability"][data-i="${rows.indexOf(r)}"]`);if(sel&&document.activeElement!==sel){sel.innerHTML=td2AbilityOptions(d,r.ability);td3UpdateAbilityDescription(sel,$('planGame').value);}}}}
 refresh();
});
window.addEventListener('td74:plan-error',e=>{updating=false;analysisError=e.detail?.message||'Battle data could not load.';refresh();});
window.addEventListener('td75:active-game',()=>{last=null;analysisError='';updating=false;userChoseOwn=false;ownSelection=0;oppSelection=0;refresh();scheduleAnalyze();});
function syncPlannerTeam(){
 const t=selectedTeam('planTeam');
 if(!t||t.game!==$('planGame').value)return;
 const latest=td77PlannerTeamRows(t);
 if(td73PlannerSourceTeam===t.id&&JSON.stringify(latest)===JSON.stringify(plannerOwn))return;
 preserveSyncedMatchup=td73PlannerSourceTeam===t.id;
 td73PlannerSourceTeam=t.id;
 plannerOwn=latest;
 scheduleAnalyze();
}
window.addEventListener('td74:team-saved',()=>{syncPlannerTeam();if(!$('battlePage').hidden)showBattle();});
window.addEventListener('td76:save-synced',event=>{
 const {teamId}=event.detail;
 if(teamId===td73PlannerSourceTeam)preserveSyncedMatchup=true;
 if(teamId!==current?.id||!($('pokeDialog').open||td74InlineTeam===teamId))return;
 if(!draft||window.td77BuilderProfile.stale(current.pokemon[slotIndex])){
  const settings=[builder,...builder.querySelectorAll('details')];
  const expanded=settings.map(section=>section.open);
  editSlot(slotIndex);
  settings.forEach((section,i)=>{section.open=expanded[i];});
 }
});
for(const id of ['planOwn','planOpp']){const node=$(id),obs=new MutationObserver(()=>{refresh();scheduleAnalyze();});obs.observe(node,{childList:true,subtree:false});
 node.addEventListener('input',e=>{if(e.target.matches('[data-field="level"][data-plan]'))scheduleAnalyze();});
 node.addEventListener('change',e=>{if(e.target.closest('[data-plan]'))scheduleAnalyze();});}
for(const id of ['planTeam','planTrainer','planVersion','planMode','planGame'])$(id)?.addEventListener('change',()=>{last=null;userChoseOwn=false;ownSelection=0;oppSelection=0;scheduleAnalyze();});
// Visible final battle stats, as on the in-game summary (no IV/EV editing grid).
const STAT_NAMES={'hp':'HP','attack':'Attack','defense':'Defense','special-attack':'Sp. Atk','special-defense':'Sp. Def','speed':'Speed'};
function renderStatEditor(host,entry,base){
 let pane=host.querySelector('.td74-battle-stats');
 if(!pane){
  pane=document.createElement('details');pane.className='td74-battle-stats';
  pane.innerHTML='<summary>Battle stats</summary>';
  host.appendChild(pane);
 }
 if(!pane.querySelector('.td74-stat-fields')){
  pane.insertAdjacentHTML('beforeend',`<div class="td74-stat-fields">${Object.entries(STAT_NAMES).map(([key,name])=>`<label class="td74-stat-field"><span class="td76-stat-name">${name}<small class="td76-base-stat"></small></span><span class="td3-header-level td76-stat-stepper"><button type="button" data-td76-stat-step="-1" aria-label="Decrease ${name}">−</button><input type="text" maxlength="3" inputmode="numeric" data-td74-stat="${key}" aria-label="${name} battle stat"><button type="button" data-td76-stat-step="1" aria-label="Increase ${name}">+</button></span></label>`).join('')}</div><div class="td75-stat-footer"><small data-td76-stat-source></small><button type="button" data-td74-stat-reset aria-label="Reset manual battle stat adjustments">↺ Auto</button></div>`);
 }
 const provenance=entry.saveStats&&!entry.saveStats.egg?(entry.level===entry.saveStats.level?'Imported from save':'Calculated from imported IVs, EVs and nature'):entry.challengeOffset?'Challenge Mode stat level · estimated':'Estimated · 15 IV / 0 EV / neutral';
 pane.querySelector('[data-td76-stat-source]').textContent=provenance+(Object.values(entry.statAdjustments||{}).some(Boolean)?' · Manually adjusted':'');
 const values=td74EntryStats(base,entry);
 for(const field of pane.querySelectorAll('[data-td74-stat]')){
  const key=field.dataset.td74Stat;
  field.closest('label').querySelector('.td76-base-stat').textContent='Base '+(base[key]??'—');
  if(document.activeElement!==field)field.value=String(Math.round(values[key]));
 }
}
function bindStatEditor(host,record,refreshValues,changed=refreshValues){
 const commit=input=>{
  const {entry,base}=record(input)||{};
  if(!entry||!base||!/^\d{1,3}$/.test(input.value)||Number(input.value)<1)return;
  const key=input.dataset.td74Stat;
  entry.statAdjustments={...(entry.statAdjustments||{}),[key]:Number(input.value)-td74EntryStats(base,entry,{})[key]};
  changed();
 };
 host.addEventListener('focusin',e=>{if(e.target.matches('[data-td74-stat]'))e.target.select();});
 host.addEventListener('input',e=>{if(e.target.matches('[data-td74-stat]'))commit(e.target);});
 host.addEventListener('focusout',e=>{if(e.target.matches('[data-td74-stat]'))requestAnimationFrame(refreshValues);});
 host.addEventListener('click',e=>{
  const reset=e.target.closest('[data-td74-stat-reset]');
  const step=e.target.closest('[data-td76-stat-step]');
  if(reset){
   const {entry}=record(reset)||{};if(!entry)return;
   entry.statAdjustments={};changed();
  }else if(step){
   const input=step.parentElement.querySelector('input');
   input.value=String(Math.max(1,Math.min(999,(Number(input.value)||1)+Number(step.dataset.td76StatStep))));
   commit(input);
  }
 });
}
function mountBattleStats(){
 for(const side of ['own','opp']){
  const host=$(side==='own'?'planOwn':'planOpp');
  for(const slot of host.querySelectorAll('details.td63-slot')){
   const i=Number(slot.dataset.i),entry=roster(side)[i];
   const base=loaded(side,i)?.baseStats||entry?.baseStats;
   if(entry?.name&&base)renderStatEditor(slot.querySelector('.td63-slot-fields'),entry,base);
  }
 }
}
for(const side of ['own','opp']){
 bindStatEditor($(side==='own'?'planOwn':'planOpp'),element=>{
  const slot=element.closest('.td63-slot');if(!slot)return;
  const i=Number(slot.dataset.i),entry=roster(side)[i];
  return {entry,base:loaded(side,i)?.baseStats||entry?.baseStats};
 },refresh);
}
const builder=$('td77BuilderBattle');
let draft=null,original=null;
const renderBuilderStats=()=>{if(draft)renderStatEditor(builder,draft,draft.baseStats);};
bindStatEditor(builder,()=>draft?{entry:draft,base:draft.baseStats}:null,renderBuilderStats,()=>{td74DraftDirty=true;renderBuilderStats();});
td77ItemAutocomplete(builder,()=>current?.game,()=>draft?.item||'');
builder.addEventListener('change',e=>{
 if(draft&&e.target.dataset.field==='item'&&e.target.dataset.td31Commit==='1'){draft.item=e.target.value;td74DraftDirty=true;window.td77BuilderProfile.summary();}
});
function commitBuilderLevel(input){
 if(!draft||!/^\d{1,3}$/.test(input.value)||+input.value<1||+input.value>100)return;
 draft.level=+input.value;
 renderBuilderStats();window.td77BuilderProfile.summary();
}
builder.addEventListener('focusin',e=>{if(e.target.id==='td77BuilderLevel')e.target.select();});
builder.addEventListener('input',e=>{if(e.target.id==='td77BuilderLevel')commitBuilderLevel(e.target);});
builder.addEventListener('focusout',e=>{if(e.target.id==='td77BuilderLevel'&&draft)e.target.value=String(draft.level);});
builder.addEventListener('click',e=>{
 const step=e.target.closest('[data-builder-level-step]');
 if(!draft||!step)return;
 const field=$('td77BuilderLevel');
 field.value=String(Math.min(100,Math.max(1,draft.level+Number(step.dataset.builderLevelStep))));
 td74DraftDirty=true;commitBuilderLevel(field);
});
window.td77BuilderProfile={
 mount(mon,previous){
  original=previous;
  const same=td73SamePokemon(mon,previous);
  draft={baseStats:mon.baseStats,level:tdDev1Level(previous?.level,previous?.saveStats?.level||50),
   item:previous?.item??'',statAdjustments:same?{...previous.statAdjustments}:{},saveStats:same?previous.saveStats:undefined};
  $('td77BuilderLevelHost').innerHTML=`<label class="td77-builder-level">Level <span class="td3-header-level"><button type="button" data-builder-level-step="-1" aria-label="Decrease level">−</button><input id="td77BuilderLevel" inputmode="numeric" type="text" maxlength="3" value="${draft.level}"><button type="button" data-builder-level-step="1" aria-label="Increase level">+</button></span></label>`;
  $('td77BuilderItemHost').innerHTML=`<div class="td31-item-field"><label for="td77BuilderItem">Held item</label><div class="search battle-search td74-item-search"><input id="td77BuilderItem" data-field="item" role="combobox" aria-expanded="false" autocomplete="off" placeholder="Search held item…" value="${escape(draft.item)}"><button type="button" class="battle-clear td74-item-clear" aria-label="Unequip held item" ${draft.item?'':'hidden'}>×</button><div class="suggestions td74-item-options" hidden></div></div></div>`;
  builder.hidden=false;renderBuilderStats();
 },
 clear(){
  draft=null;original=null;builder.open=false;builder.hidden=true;
  for(const section of builder.querySelectorAll('details'))section.open=false;
  $('td77BuilderLevelHost').replaceChildren();$('td77BuilderItemHost').replaceChildren();
 },
 summary(){
  if(!draft||!chosen)return;
  const ability=td2ResolveAbility(chosen,$('td2TeamAbility')?.value);
  const shiny=td73SamePokemon(chosen,original)&&(original?.shiny||original?.saveStats?.shiny);
  const source=td71StoredArt(chosen);
  $('pokePreview').innerHTML=`${source?`<img class="td77-builder-art" src="${escape(source)}" alt="" onerror="this.hidden=true">`:''}<div><div class="pills">${typeBadges(chosen)}</div><div class="td77-builder-summary"><strong>Lv ${draft.level}</strong>${shiny?'<span aria-label="Shiny">✨</span>':''}${ability?`<span>${escape(pretty(ability))}</span>`:''}${draft.item?`<span>${escape(draft.item)}</span>`:''}</div></div>`;
 },
 stale(member){return !!draft&&member!==original&&member?.saveStats!==original?.saveStats;},
 read(){return draft?{level:draft.level,item:draft.item,statAdjustments:draft.statAdjustments}:{};}
};
// Level +/- buttons do not emit an input/change event: refresh the estimates immediately.
for(const id of ['planOwn','planOpp']){
 $(id).addEventListener('click',e=>{if(e.target.closest('[data-td72-level-step]'))requestAnimationFrame(()=>{mountBattleStats();refresh();scheduleAnalyze();});});
 $(id).addEventListener('change',e=>{if(e.target.matches('input[data-field="level"]'))requestAnimationFrame(()=>{mountBattleStats();refresh();});});
}
function selectedGame(){const id=localStorage.getItem('takdex-v71-active-team');const selected=teams.find(t=>t.id===id);return selected?.game||td66SavedGame()||'';}
// Recently viewed Pokémon, captured from normal Pokédex navigation without altering navigation handlers.
const RECENT='takdex-v74-recent';
function recent(){try{return JSON.parse(localStorage.getItem(RECENT)||'[]').map(x=>typeof x==='string'?{name:clean(x),game:''}:x).filter(x=>x?.name).slice(0,8)}catch{return []}}
function rememberPokemon(name,game){if(!name)return;const key=clean(name),next=[{name:key,game},...recent().filter(x=>clean(x.name)!==key)].slice(0,8);try{localStorage.setItem(RECENT,JSON.stringify(next))}catch{}renderRecent();}
const recentPanel=document.createElement('details');recentPanel.className='card td74-recent';recentPanel.innerHTML='<summary>Recently viewed Pokémon</summary><div id="td74RecentContents"></div>';$('dexPage').insertBefore(recentPanel,$('dexResult'));
function renderRecent(){const row=$('td74RecentContents');row.innerHTML=recent().length?recent().map((n,i)=>`<button type="button" data-td74-recent="${i}">${escape(td41PokemonLabel(n.name))}${n.game?' · '+escape(n.game):''}</button>`).join(''):'<p class="note">No recently viewed Pokémon.</p>';}
renderRecent();let lastRecentHero=null;
new MutationObserver(()=>{const hero=$('dexResult').querySelector('[data-td71-quick-compare]');if(hero&&hero!==lastRecentHero){lastRecentHero=hero;rememberPokemon(hero.dataset.td71QuickCompare,$('dexGame').value);}}).observe($('dexResult'),{childList:true,subtree:true});
recentPanel.addEventListener('click',e=>{const b=e.target.closest('[data-td74-recent]');if(!b)return;const record=recent()[Number(b.dataset.td74Recent)];if(!record)return;recentPanel.open=false;const g=record.game||$('dexGame').value||selectedGame();if(g&&[...$('dexGame').options].some(o=>o.value===g))$('dexGame').value=g;$('dexTeam').value='';$('dexTeamPoke').value='';$('dexInput').value=pretty(record.name);$('dexSearch').click();});
// Save and restore search strings without forcefully triggering a new data fetch.
for(const id of ['tmMoveSearch','tmPokemon','dexInput']){
 const field=$(id);if(!field)continue;const key='takdex-v74-input-'+id;
 if(!field.value)try{field.value=sessionStorage.getItem(key)||''}catch{}
 field.addEventListener('input',()=>{try{sessionStorage.setItem(key,field.value)}catch{}});
}
// The Pokédex sections are directly reachable through a small horizontal jump bar.
const dex=$('dexResult'),jump=document.createElement('nav');jump.id='td74DexJump';jump.setAttribute('aria-label','Pokédex sections');dex.before(jump);
function renderDexJumps(){const headings=[...dex.querySelectorAll('h2,h3,h4')].filter(h=>h.offsetParent!==null&&!/^(Suggested attacking moves|Useful support & status moves)$/i.test(h.textContent.trim())).slice(0,12);
 const keys=['moves','evol','encounter','ability','machine'];const chosen=headings.filter(h=>keys.some(k=>h.textContent.toLowerCase().includes(k))&&!/base stats/i.test(h.textContent)).slice(0,5);
 jump.innerHTML=chosen.map((h,i)=>`<button type="button" data-td74-dex-jump="${i}">${escape(h.textContent.trim().slice(0,22))}</button>`).join('');jump._sections=chosen;
}
let jumpsScheduled=false;new MutationObserver(()=>{if(jumpsScheduled)return;jumpsScheduled=true;requestAnimationFrame(()=>{jumpsScheduled=false;renderDexJumps()})}).observe(dex,{subtree:true,childList:true});
jump.addEventListener('click',e=>{const b=e.target.closest('[data-td74-dex-jump]');if(b)jump._sections?.[Number(b.dataset.td74DexJump)]?.scrollIntoView({behavior:'smooth',block:'start'});});
// Per-team compatibility in TM/HM checker: no extra confirmation to see whose moves are compatible.
const tmResult=$('tmResults'),teamBar=document.createElement('div');teamBar.id='td74TMTeamBar';tmResult.before(teamBar);
function renderTMTeam(){const t=selectedTeam('tmTeam');if(!t){teamBar.innerHTML='';return;}teamBar.hidden=!!$('tmPokemon').value.trim();if(teamBar.dataset.team===String(t.id)&&teamBar.dataset.game===$('tmGame').value&&teamBar.querySelector('#td5TMStrip'))return;teamBar.dataset.team=String(t.id);teamBar.dataset.game=$('tmGame').value;teamBar.innerHTML='<div class="td74-strip-heading"><strong>Selected team</strong></div><div id="td5TMStrip" class="td74-mon-row">'+td51CompatTiles(t.pokemon||[],[],'')+'</div>';}
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
function linkDexActions(){const hero=dexRecords.querySelector('.td71-dex-hero'),name=hero?.querySelector('[data-td71-quick-compare]')?.dataset.td71QuickCompare||hero?.querySelector('h3')?.textContent.trim(),game=$('dexGame').value;
 if(!hero||!name||hero.querySelector('.td74-dex-actions'))return;
 const bar=document.createElement('div');bar.className='td74-dex-actions';
 bar.innerHTML=(['Emerald','Platinum','Black','White','Black 2','White 2'].includes(game)?`<button type="button" data-td74-dex-map-search="${escape(name)}" data-td76-species-map><span class="td76-dex-icon" aria-hidden="true">⌖</span> Encounter map</button>`:'')+`<button type="button" data-td74-dex-battle="${escape(name)}"><img src="takdex-battle-nav.png" alt="" class="td74-mini-battle-icon td76-dex-icon"> Battle</button>`;
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
  if(loc.hasAttribute('data-td76-species-map')){
   window.takDexMapsV73?.openSpecies($('dexGame').value,loc.dataset.td74DexMapSearch);
   return;
  }
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

/* DEV7 UI consistency pass. Reuse existing clear semantics on stateful inputs. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const fields='input:not([type]),input[type=text],input[type=search],input[type=email]';
const stateful='.battle-clear,.td74-item-clear,.td65-clear,[data-clear],[data-plan-clear],[data-td44-clear]';
function decorate(input){
 if(input.disabled||input.readOnly||input.inputMode==='numeric'||input.matches('[data-td2-level],[data-td74-stat],[name="_gotcha"]'))return;
 let shell=input.parentElement;
 if(!shell.matches('.search,.td74-map-search-wrap,.td7-input-shell')){
  if(!input.matches('#pokeNickname,#teamName,#editTeamName,#td4Temporary,#td4OpponentName')&&!input.hasAttribute('autocomplete'))return;
  const wrapper=document.createElement('div');input.before(wrapper);wrapper.append(input);shell=wrapper;
 }
 shell.classList.add('td7-input-shell');
 const row=shell.closest('.moveRow,.td65-move-slot,.td5-inline-goal');
 let button=shell.querySelector(':scope > .td7-circle-clear,:scope > .battle-clear,:scope > .td74-item-clear');
 if(!button&&row){button=row.querySelector(stateful);if(button){shell.append(button);row.classList.add('td7-inline-clear');}}
 if(!button){
  // The planner's X means reset to the actual move, not clear it. Existing
  // reset controls are preserved; do not insert a second conflicting action.
  button=document.createElement('button');button.type='button';button.className='battle-clear td7-generated-clear';button.textContent='×';button.setAttribute('aria-label','Clear '+(input.getAttribute('aria-label')||input.placeholder||'text'));
  button.addEventListener('pointerdown',e=>e.preventDefault());
  button.addEventListener('click',()=>{input.value='';if(input.id==='tmMoveSearch'){$('tmMove').selectedIndex=-1;$('tmResults').replaceChildren();window.takDexMachineGuideV65?.update();}input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));input.focus();});
  shell.append(button);
 }
 button.classList.add('td7-circle-clear');
 shell.classList.toggle('td7-has-browse',!!shell.querySelector(':scope > .td56-arrow,:scope > .tm-combo-arrow,:scope > .td65-browse,:scope > .td66-pokemon-browse'));
 if(button.classList.contains('td7-generated-clear')||button.matches('[data-clear],[data-plan-clear]'))button.hidden=!input.value;
 if(input.offsetHeight)shell.style.setProperty('--td7-clear-top',`${input.offsetTop+input.offsetHeight/2}px`);
}
let pending=false;function refresh(){pending=false;document.querySelectorAll(fields).forEach(decorate);}
function queue(){if(!pending){pending=true;requestAnimationFrame(refresh)}}
new MutationObserver(queue).observe(document.body,{childList:true,subtree:true});
document.addEventListener('input',e=>{if(e.target.matches(fields))decorate(e.target)});
document.addEventListener('focusin',e=>{if(e.target.matches(fields)){decorate(e.target);if(e.target.closest('.td7-input-shell')&&e.target.value)e.target.select();}});
document.addEventListener('click',queue);window.addEventListener('resize',queue);queue();
// Pokémon-only image fallbacks. Never modify branding, badges or map artwork.
const artRoot='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';
const unavailableArt='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="24" fill="#737983" opacity=".3" stroke="#9298a2" stroke-width="2"/><path d="M8 32h48" stroke="#9298a2" stroke-width="2"/><circle cx="32" cy="32" r="7" fill="#9298a2"/></svg>');
document.addEventListener('error',e=>{const img=e.target;if(!(img instanceof HTMLImageElement))return;const src=img.dataset.td60Original||img.src;const match=src.match(/\/sprites\/pokemon\/(?:other\/official-artwork\/)?(\d+)\.png/);if(!match||img.src===unavailableArt)return;const id=match[1];if(img.dataset.td71ArtId!==id){img.dataset.td71ArtId=id;img.dataset.td71ArtAttempt='0';}const attempt=Number(img.dataset.td71ArtAttempt||0);img.dataset.td71ArtAttempt=String(attempt+1);img.dataset.td71Retry=src;delete img.dataset.td60Original;img.hidden=false;img.style.visibility='';img.src=attempt===0?(src.includes('/other/official-artwork/')?artRoot+id+'.png':artRoot+'other/official-artwork/'+id+'.png'):unavailableArt;},true);
function retryArt(){for(const img of document.images){if(img.dataset.td71Retry&&(img.src.startsWith('data:')||!img.naturalWidth&&img.complete)){const src=img.dataset.td71Retry;delete img.dataset.td71ArtAttempt;delete img.dataset.td71Retry;img.src=src;}}}
window.addEventListener('online',retryArt);window.addEventListener('pageshow',retryArt);
})();

(function(){const result=document.getElementById('tmResults');if(!result)return;let armed=0;const request=()=>{armed=Date.now()+15000};document.getElementById('tmCheck')?.addEventListener('click',request);document.getElementById('tmMoveResults')?.addEventListener('click',e=>{if(e.target.closest('button'))request()});new MutationObserver(()=>{if(armed>Date.now()&&!document.getElementById('tmPage')?.hidden&&result.querySelector('table,.card,.td74-mon-row')){armed=0;requestAnimationFrame(()=>result.scrollIntoView({block:'start'}));}}).observe(result,{childList:true,subtree:true});})();

/* DEV7 feedback: private recipient remains in Formspree account. No mailto. */
(function(){
 const button=document.getElementById('td7FeedbackOpen');if(!button)return;
 const dialog=document.createElement('dialog');dialog.id='td7FeedbackDialog';
 dialog.innerHTML=`<form id="td7FeedbackForm"><div class="bar"><h3>Send feedback</h3><button type="button" id="td7FeedbackClose" aria-label="Close feedback">×</button></div><label>Category<select name="category"><option>Bug report</option><option>Feature request</option><option>Suggestion</option><option>Other</option></select></label><label>Message<textarea name="message" required maxlength="4000" placeholder="What could Tak-Dex improve?"></textarea></label><label>Reply email (optional)<input type="email" name="email" autocomplete="email" maxlength="254" placeholder="Only if you want a reply"></label><label class="td7-honeypot" aria-hidden="true">Leave blank<input name="_gotcha" tabindex="-1" autocomplete="off"></label><p class="note">Your category, message, optional reply email and app version are sent through Formspree to the developer. Do not include passwords or other sensitive information.</p><button type="submit" id="td7FeedbackSubmit">Send feedback</button><p id="td7FeedbackStatus" role="status" aria-live="polite"></p></form>`;
 document.body.append(dialog);const form=dialog.querySelector('form'),send=dialog.querySelector('#td7FeedbackSubmit'),status=dialog.querySelector('#td7FeedbackStatus');let busy=false;
 const id=()=>String(window.TAKDEX_FEEDBACK_FORM_ID||'').trim();const configured=()=>/^[a-zA-Z0-9]{6,40}$/.test(id());
 button.onclick=()=>{dialog.showModal();send.disabled=busy||!configured();if(!configured())status.textContent='Feedback delivery is not configured yet.';};dialog.querySelector('#td7FeedbackClose').onclick=()=>{if(!busy)dialog.close()};
 dialog.addEventListener('cancel',e=>{if(busy)e.preventDefault()});
 form.addEventListener('submit',async e=>{e.preventDefault();if(busy||!configured())return;if(!navigator.onLine){status.textContent='You are offline. Reconnect and try again.';return;}if(!form.reportValidity())return;const data=new FormData(form);if(!String(data.get('message')||'').trim()){status.textContent='Enter a message first.';return;}data.set('message',String(data.get('message')).trim());data.set('app_version','V74');busy=true;send.disabled=true;status.textContent='Sending…';const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),20000);try{const response=await fetch('https://formspree.io/f/'+encodeURIComponent(id()),{method:'POST',headers:{Accept:'application/json'},body:data,signal:controller.signal});if(!response.ok)throw Error('HTTP '+response.status);form.reset();status.textContent='Feedback sent. Thank you!';}catch{status.textContent='Feedback could not be sent. Your message is still here; try again.';}finally{clearTimeout(timeout);busy=false;send.disabled=!configured();}});
})();

/* DEV7.1 — approved More ordering and shared disclosure/name fitting. */
(function(){
 const more=document.querySelector('#morePage>.tool-card');
 if(more){for(const id of ['openPlanner','td68OpenMove','openMaps','td56OpenCompare','openTypeChecker','td59OpenOffline','td70OpenAbout','td7FeedbackOpen']){const node=document.getElementById(id);if(node)more.append(node);}}
 const arrowOnly=/^[⌄⌃▾▴▼▲▶►◀‹›❯❮∨∧v^]$/;
 function disclose(el){if(el.classList.contains('td71-disclosure')&&el.querySelector(':scope>.td71-chevron'))return;el.classList.add('td71-disclosure');for(const child of el.children){if(child.matches('span,i,small')&&arrowOnly.test(child.textContent.trim())){child.classList.add('td71-legacy-arrow');child.setAttribute('aria-hidden','true');}}const icon=document.createElement('span');icon.className='td71-chevron';icon.setAttribute('aria-hidden','true');el.append(icon);}
 const nameSelector='#teams .td71-team-member>span,#td4TeamPlannerPage .td42-mon-pair strong,.td74-mon-chip .td74-mon-name';
 function fit(el){if(el.clientWidth<1)return;el.classList.add('td71-fit-name');if(el.dataset.td71Fit){el.style.removeProperty('font-size');delete el.dataset.td71Fit;}let px=parseFloat(getComputedStyle(el).fontSize);if(!Number.isFinite(px))return;let w=el.clientWidth;if(el.scrollWidth>w){const font=Math.max(10,Math.floor(px*w/el.scrollWidth*10)/10);el.style.setProperty('font-size',font+'px','important');el.dataset.td71Fit='1';}}
 let pending=false;function update(){pending=false;document.querySelectorAll('details>summary,button[data-td71-toggle],button[data-td72-details]').forEach(disclose);document.querySelectorAll(nameSelector).forEach(fit);}
 function queue(){if(!pending){pending=true;requestAnimationFrame(update);}}
 new MutationObserver(queue).observe(document.body,{subtree:true,childList:true});window.addEventListener('resize',queue);document.addEventListener('toggle',queue,true);document.addEventListener('click',queue);document.fonts?.ready?.then(queue);queue();
})();
