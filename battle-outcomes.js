/* Two-turn estimates for known, entered 1v1 moves. */
(function () {
 'use strict';
 const hp = mon => Math.max(0,Math.min(estimatedHP(mon),mon.currentHP??estimatedHP(mon)));
 function speed(mon,gen) {
  const ability=td2ActualAbility(mon);
  const weatherAbility={rain:'swift-swim',sun:'chlorophyll',sand:'sand-rush',hail:'slush-rush'}[mon.weather];
  const weather=ability&&ability===weatherAbility?2:1;
  const scarf=gen>=4 && td73MoveKey(mon.heldItem)==='choice-scarf' ? 1.5 : 1;
  const paralysis=mon.status==='paralysis' && td2ActualAbility(mon)!=='quick-feet' ? (gen>=7?.5:.25) : 1;
  return Math.floor((mon.battleStats?.speed||0)*scarf*paralysis*weather*(mon.status&&mon.status!=='none'&&ability==='quick-feet'?1.5:1));
 }
 function orderChance(a,d,m,n,gen) {
  const priority=(mon,move)=> Number(move.priority??0)+(gen>=5&&move.damageClass==='status'&&td2ActualAbility(mon)==='prankster'?1:0);
  const delta=priority(a,m)-priority(d,n)||speed(a,gen)-speed(d,gen);
  return delta>0?1:delta<0?0:.5;
 }
 const charging=(move,mon,gen)=>TD2_CHARGE.has(move.name)&&td2Turns(move,mon,gen)>1;
 function damageOptions(actor,target,move,gen) {
  const damage=estimateDamage(actor,target,move,gen);
  const accuracy=td2Accuracy(move);
  if (damage==null || accuracy==null || damage===0) return [{damage:0,weight:1}];
  const fixed=['Seismic Toss','Night Shade','Dragon Rage','Sonic Boom'].includes(move.name);
  const rolls=fixed?[[1,1]]:[[.85,.25],[.925,.5],[1,.25]];
  const options=rolls.map(([roll,weight])=>({damage:Math.max(1,Math.floor(roll*damage)),weight:weight*accuracy}));
  if (accuracy<1) options.push({damage:0,weight:1-accuracy});
  return options;
 }
 function compare(a,d,m,n,gen) {
  const mons=[a,d], moves=[m,n], initial=mons.map(hp);
  const result={win:0,firstKo:0,preemptiveKo:0,twoHitKo:0,survive:0,acts:0,progress:0,boost:0,damage:0,minimum:Infinity,maximum:0};
  function simulate(turn,state,weight) {
   if (!weight) return;
   if (turn>2 || state.hp.some(value=>value===0)) {
    result.win+=state.hp[0]>0&&state.hp[1]===0?weight:0;
    result.firstKo+=state.hp[1]===0&&turn===2?weight:0;
    result.twoHitKo+=state.hp[1]===0&&state.landed===2?weight:0;
    result.survive+=state.hp[0]>0?weight:0;
    result.progress+=weight*(initial[1]-state.hp[1])/Math.max(1,initial[1]);
    return;
   }
   const first=orderChance(a,d,m,n,gen);
   if (first) step(0,1,0,state,[false,false],[false,false],weight*first);
   if (first<1) step(1,0,0,state,[false,false],[false,false],weight*(1-first));
   function step(i,j,stepIndex,current,acted,hits,chance) {
    if (!chance) return;
    const next=(newState,newActed,newHits,newChance)=>stepIndex===0
     ? step(j,i,1,newState,newActed,newHits,newChance) : simulate(turn+1,newState,newChance);
    if (acted[i] || current.hp[i]===0 || current.hp[j]===0) return next(current,acted,hits,chance);
    const move=moves[i];
    if(move===idle)return next(current,acted,hits,chance);
    const mode=current.mode[i], nextMode=current.mode.slice();
    if (mode==='recharge' || (mode!=='charged' && charging(move,mons[i],gen))) {
     nextMode[i]=mode==='recharge'?null:'charged';
     const nextActed=acted.slice();
     nextActed[i]=true;
     return next({...current,mode:nextMode},nextActed,hits,chance);
    }
    nextMode[i]=null;
    const attacker={...mons[i],currentHP:current.hp[i],hitByTargetThisTurn:hits[i],damagedThisTurn:hits[i]};
    const defender={...mons[j],currentHP:current.hp[j],actedThisTurn:acted[j],damagedThisTurn:hits[j]};
    const context=td2Power(move,attacker,defender,gen);
    const base=td2Power(move,mons[i],mons[j],gen);
    const available=!(Number.isFinite(move.remainingPP)&&move.remainingPP<turn-(mode==='charged'?1:0));
    const canHit=available && (move.name!=='Fake Out'||turn===1) &&
     (move.name!=='Focus Punch'||!hits[i]) &&
     (move.name!=='Sucker Punch'||!acted[j]&&['physical','special'].includes(moves[j].damageClass));
    if (i===0 && turn===1 && available) {
     result.acts+=chance;
     if (context && base && context.min>base.min) result.boost+=chance;
    }
    const outcomes=canHit?damageOptions(attacker,defender,move,gen):[{damage:0,weight:1}];
    for (const outcome of outcomes) {
     if (i===0 && turn===1 && outcome.damage>0) {
      result.damage+=chance*outcome.weight*outcome.damage;
      result.minimum=Math.min(result.minimum,outcome.damage);
      result.maximum=Math.max(result.maximum,outcome.damage);
     }
     const remaining=current.hp.slice(), newActed=acted.slice(), newHits=hits.slice(), modes=nextMode.slice();
     const usedItems=current.usedItems.slice();
     const fullHP=remaining[j]===estimatedHP(mons[j]);
     const ability=td2ActualAbility(mons[j]), attackerAbility=td2ActualAbility(mons[i]);
     const sturdy=gen>=5&&ability==='sturdy'&&!['mold-breaker','turboblaze','teravolt'].includes(attackerAbility);
     const sash=gen>=4&&!usedItems[j]&&td73MoveKey(mons[j].heldItem)==='focus-sash';
     const wouldFaint=outcome.damage>=remaining[j];
     if(fullHP&&wouldFaint&&(sturdy||sash)){
      remaining[j]=1;
      if(!sturdy)usedItems[j]=true;
     }else remaining[j]=Math.max(0,remaining[j]-outcome.damage);
     if(i===0&&turn===1&&!acted[j]&&remaining[j]===0)result.preemptiveKo+=chance*outcome.weight;
     const landed=current.landed+Number(i===0&&outcome.damage>0);
     if(move.name==='Fake Out'&&outcome.damage>0&&!acted[j]&&td2ActualAbility(mons[j])!=='inner-focus'){
      next({hp:remaining,mode:modes,usedItems,landed},[true,true],newHits,chance*outcome.weight);
      continue;
     }
     newActed[i]=true;
     newHits[j]=outcome.damage>0;
     if (outcome.damage>0 && TD2_RECHARGE.has(move.name)) modes[i]='recharge';
     next({hp:remaining,mode:modes,usedItems,landed},newActed,newHits,chance*outcome.weight);
    }
   }
  }
  simulate(1,{hp:initial,mode:[null,null],usedItems:[false,false],landed:0},1);
  return result;
 }
 const idle={name:'No entered attack',priority:0};
 function candidates(a,d,g) {
  return (a?.moves||[]).filter(m=>m?.name&&m.remainingPP!==0&&td2Accuracy(m)>0&&estimateDamage(a,d,m,g)>0);
 }
 function threat(a,d,g,reply) {
  if (!a || !d || !hp(d)) return null;
  return candidates(a,d,g).map(m=>{
   const result=compare(a,d,m,reply||idle,g);
   return {m,damage:estimateDamage(a,d,m,g),...result};
  }).sort((x,y)=>(reply?y.preemptiveKo-x.preemptiveKo:0)||y.firstKo-x.firstKo||y.damage/td2Turns(y.m,a,g)-x.damage/td2Turns(x.m,a,g))[0]||null;
 }
 function attackScore(result) {
  return 5*result.win+result.survive+result.acts+result.progress;
 }
 function attacks(a,d,g) {
  if (!a || !d || !hp(a) || !hp(d)) return [];
  const threats=candidates(d,a,g);
  return candidates(a,d,g).map(m=>{
   const results=(threats.length?threats:[idle]).map(n=>({n,...compare(a,d,m,n,g)}));
   const worst=results.reduce((x,y)=>attackScore(x)<=attackScore(y)?x:y);
   // Require a preemptive KO chance against every modeled damaging reply.
   let beforeReplyKo=threats.length?Math.min(...results.map(result=>result.preemptiveKo)):0;
   if(beforeReplyKo>0){
    const bypass=['mold-breaker','turboblaze','teravolt'].includes(td2ActualAbility(a));
    const ability=td2ActualAbility(d);
    const possible=ability?[ability]:td2AllAbilities(d);
    if(!bypass&&((g>=7&&possible.includes('disguise'))||
      (g>=8&&m.damageClass==='physical'&&possible.includes('ice-face'))||
      (g>=5&&hp(d)===estimatedHP(d)&&possible.includes('sturdy'))))beforeReplyKo=0;
    if(g>=2&&td73MoveKey(d.heldItem)==='focus-band')beforeReplyKo=Math.min(beforeReplyKo,.99);
    const guards=['Protect','Detect','Endure','King’s Shield',"King's Shield",'Spiky Shield','Baneful Bunker','Obstruct','Silk Trap','Burning Bulwark'];
    if(d.moves?.some(reply=>guards.includes(reply?.name)&&reply.remainingPP!==0&&orderChance(d,a,reply,m,g)>0))beforeReplyKo=0;
   }
   return {m,...worst,beforeReplyKo,score:attackScore(worst),verifiedThreat:!!threats.length};
  }).sort((x,y)=>y.win-x.win||y.score-x.score);
 }
 function koLabel({firstKo,twoHitKo}){
  const label=(probability,kind)=>probability>=1-1e-10
   ? 'Guaranteed '+kind : kind+' chance: '+(probability>=.995?'>99':Math.max(1,Math.round(probability*100)))+'%';
  return firstKo>0?label(firstKo,'OHKO'):twoHitKo>0?label(twoHitKo,'2HKO'):'';
 }
 function against(a,d,move,reply,gen){
  return reply&&hp(a)>0&&hp(d)>0&&td2Accuracy(move)>0&&estimateDamage(a,d,move,gen)>0
   ? {...compare(a,d,move,reply,gen),verifiedThreat:true}:null;
 }
 window.takDexBattleOutcomes={attacks,threat,orderChance,hp,koLabel,against};
})();
