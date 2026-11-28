/* V78 DEV1: validate team envelope versions before any persistent mutation. */
(function(root){
 'use strict';
 const stats=['hp','attack','defense','speed','special-attack','special-defense'];
 const types=new Set('normal fire water electric grass ice fighting poison ground flying psychic bug rock ghost dragon dark steel fairy stellar unknown shadow'.split(' '));
 const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
 const fail=path=>{throw Error('Invalid team file field: '+path);};
 const string=(v,path,max,required=false)=>{if(typeof v!=='string'||v.length>max||required&&!v.trim())fail(path);};
 const integer=(v,path,min,max)=>{if(!Number.isInteger(v)||v<min||v>max)fail(path);};
 const enumValue=(v,path,allowed)=>{if(!allowed.includes(v))fail(path);};
 function inspect(value,path,depth=0,learnsetKeys=false){
  if(depth>14)fail(path);
  if(typeof value==='string'){string(value,path,12000);return;}
  if(typeof value==='number'){if(!Number.isFinite(value)||Math.abs(value)>Number.MAX_SAFE_INTEGER)fail(path);return;}
  if(value===null||typeof value==='boolean')return;
  if(Array.isArray(value)){
   if(value.length>1800)fail(path);
   value.forEach((item,i)=>inspect(item,path+'['+i+']',depth+1));return;
  }
  if(!object(value)||Object.keys(value).length>1800)fail(path);
  for(const [key,item] of Object.entries(value)){
   if(key.length>200||['__proto__','constructor','prototype'].includes(key))fail(path);
   const child=path+'.'+key;
   // Learnset dictionaries use move slugs as keys, including defense-curl.
   if(!learnsetKeys&&item!=null&&/(?:^url$|^href$|^image$|^sprite$|url$|^front_)/i.test(key))resource(item,child);
   inspect(item,child,depth+1,key==='learnMethods'||key==='learnBefore');
  }
 }
 function resource(value,path){
  string(value,path,2048);
  if(!value)return;
  let parsed;
  try{parsed=new URL(value);}catch{fail(path);}
  if(parsed.protocol!=='https:'||parsed.username||parsed.password)fail(path);
 }
 function optionalInteger(record,key,path,min,max){
  if(record[key]!=null)integer(record[key],path+'.'+key,min,max);
 }
 function statMap(value,path,min,max,required=false){
  if(!object(value))fail(path);
  for(const key of stats){
   if(required||value[key]!=null)integer(value[key],path+'.'+key,min,max);
  }
 }
 function move(value,path){
  if(typeof value==='string'){string(value,path,100,true);return;}
  if(!object(value))fail(path);
  string(value.name,path+'.name',100,true);
  for(const [key,min,max] of [['id',1,100000],['power',0,2000],['accuracy',0,100],['priority',-12,12],['pp',0,255],['remainingPP',0,255],['ppUps',0,3]])
   optionalInteger(value,key,path,min,max);
  if(value.type!=null&&!types.has(value.type))fail(path+'.type');
  if(value.damageClass!=null)enumValue(value.damageClass,path+'.damageClass',['physical','special','status']);
 }
 function saveStats(value,path){
  if(!object(value))fail(path);
  for(const [key,min,max] of [['pid',0,0xffffffff],['species',1,649],['level',value.egg===true?0:1,100],['nature',0,24],['currentHP',0,65535],
   ['form',0,31],['abilityId',0,255],['itemId',0,65535],['friendship',0,255],['statusWord',0,0xffffffff]])
   optionalInteger(value,key,path,min,max);
  // Older exports sometimes contain identity only. Partial stat groups, when
  // present, cannot be used by the battle engine as complete actual stats.
  if(value.stats!=null){
   statMap(value.stats,path+'.stats',value.egg===true?0:1,65535,true);
   statMap(value.ivs,path+'.ivs',0,31,true);statMap(value.evs,path+'.evs',0,255,true);
   integer(value.level,path+'.level',value.egg===true?0:1,100);integer(value.nature,path+'.nature',0,24);
   if(value.currentHP>value.stats.hp)fail(path+'.currentHP');
  }else if(value.ivs!=null||value.evs!=null)fail(path+'.stats');
  if(value.moves!=null){
   if(!Array.isArray(value.moves)||value.moves.length>4)fail(path+'.moves');
   value.moves.forEach((m,i)=>{
    if(m===null)return;
    if(!object(m))fail(path+'.moves['+i+']');
    integer(m.id,path+'.moves['+i+'].id',1,559);
    optionalInteger(m,'remainingPP',path+'.moves['+i+']',0,255);
    optionalInteger(m,'ppUps',path+'.moves['+i+']',0,3);
   });
  }
  for(const key of ['egg','shiny'])if(value[key]!=null&&typeof value[key]!=='boolean')fail(path+'.'+key);
 }
 function mon(value,path,planned=false){
  if(!object(value))fail(path);
  integer(value.id,path+'.id',1,100000);
  string(value.name,path+'.name',100,true);
  if(!Array.isArray(value.types)||value.types.length>2||value.types.some(t=>!types.has(t))||new Set(value.types).size!==value.types.length)
   fail(path+'.types');
  for(const key of ['canonicalName','ability','item','nickname','heldItem','selectedAbility'])
   if(value[key]!=null)string(value[key],path+'.'+key,140);
  optionalInteger(value,'level',path,value.saveStats?.egg===true?0:1,100);
  if(value.baseStats!=null)statMap(value.baseStats,path+'.baseStats',0,65535);
  if(value.statAdjustments!=null)statMap(value.statAdjustments,path+'.statAdjustments',-65535,65535);
  if(value.abilities!=null&&(!Array.isArray(value.abilities)||value.abilities.length>12||
   value.abilities.some(a=>typeof a==='string'?a.length>100:!object(a)||a.ability!==null&&
    (!object(a.ability)||typeof a.ability.name!=='string'))))fail(path+'.abilities');
  if(!planned||value.moves!=null){
   if(!Array.isArray(value.moves)||value.moves.length>4)fail(path+'.moves');
   value.moves.forEach((m,i)=>{if(m!==null)move(m,path+'.moves['+i+']');});
  }
  if(value.saveStats!=null)saveStats(value.saveStats,path+'.saveStats');
 }
 function moveset(value,path){
  if(!Array.isArray(value)||value.length>4)fail(path);
  value.forEach((m,i)=>{
   const at=path+'['+i+']';
   if(!object(m))fail(at);
   string(m.move,at+'.move',100);
   for(const key of ['replacement','milestone','warningFrom','warningTarget','reminderFor'])
    if(m[key]!=null)string(m[key],at+'.'+key,100);
   if(m.purpose!=null)enumValue(m.purpose,at+'.purpose',['keep','temporary','review']);
   if(m.usefulness!=null)enumValue(m.usefulness,at+'.usefulness',['unknown','needed','not-needed']);
  });
 }
 function learnset(value,path){
  if(value.legalMoves!=null&&(!Array.isArray(value.legalMoves)||value.legalMoves.length>1500||
   value.legalMoves.some(m=>typeof m!=='string'||!m||m.length>100)))fail(path+'.legalMoves');
  if(value.learnMethods!=null){
   if(!object(value.learnMethods))fail(path+'.learnMethods');
   for(const [name,rows] of Object.entries(value.learnMethods)){
    if(!Array.isArray(rows)||rows.length>32||rows.some(row=>!Array.isArray(row)||row.length!==2||
     typeof row[0]!=='string'||row[0].length>60||!Number.isInteger(row[1])||row[1]<0||row[1]>100))
     fail(path+'.learnMethods.'+name);
   }
  }
  if(value.learnBefore!=null&&(!object(value.learnBefore)||
   Object.values(value.learnBefore).some(name=>typeof name!=='string'||!name||name.length>100)))fail(path+'.learnBefore');
 }
 function planFor(plan,game,caught,warnings){
  if(plan==null)return null;
  if(!object(plan)||plan.game!==game||!Array.isArray(plan.slots)||plan.slots.length>6)fail('plan');
  if(plan.mode!=null)enumValue(plan.mode,'plan.mode',['during','final']);
  if(plan.progress!=null)string(plan.progress,'plan.progress',200);
  const validDeadline=value=>typeof value==='string'&&/^(?:|actual|start|badge-[1-8]|pre-league|post-league|postgame)$/.test(value);
  if(plan.deadline!=null&&!validDeadline(plan.deadline))fail('plan.deadline');
  if(plan.stageDeadlines!=null&&(!object(plan.stageDeadlines)||!validDeadline(plan.stageDeadlines.during)||!validDeadline(plan.stageDeadlines.final)))fail('plan.stageDeadlines');
  optionalInteger(plan,'editorSlot','plan',0,5);
  const fulfilled=new Set();
  const validate=(slot,path,fulfilled)=>{
   if(slot===null)return;
   mon(slot,path,true);learnset(slot,path);
   if(slot.finalLearnset!=null){if(!object(slot.finalLearnset))fail(path+'.finalLearnset');learnset(slot.finalLearnset,path+'.finalLearnset');}
   if(slot.finalTarget!=null){mon(slot.finalTarget,path+'.finalTarget',true);learnset(slot.finalTarget,path+'.finalTarget');}
   for(const key of ['originPid','fulfilledPid'])optionalInteger(slot,key,path,0,0xffffffff);
   optionalInteger(slot,'originSlot',path,0,5);
   for(const key of ['duringTargetId','fulfilledStage'])optionalInteger(slot,key,path,1,100000);
   for(const key of ['originName','duringSpecies'])if(slot[key]!=null)string(slot[key],path+'.'+key,100,true);
   for(const key of ['locked','confirmedCandidate','explicitOwned'])if(slot[key]!=null&&typeof slot[key]!=='boolean')fail(path+'.'+key);
   for(const key of ['plannedMoves','duringMoves'])if(slot[key]!=null)moveset(slot[key],path+'.'+key);
   for(const key of ['finalManualSlots','duringManualSlots'])if(slot[key]!=null&&
    (!Array.isArray(slot[key])||slot[key].length>4||slot[key].some(v=>v!==null&&typeof v!=='boolean')))fail(path+'.'+key);
   if(slot.acquisitionRoute!=null){
    const r=slot.acquisitionRoute;
    if(!object(r))fail(path+'.acquisitionRoute');
    string(r.id,path+'.acquisitionRoute.id',300,true);
    integer(r.startId,path+'.acquisitionRoute.startId',1,100000);
    optionalInteger(r,'startLevel',path+'.acquisitionRoute',1,100);
   }
   if(slot.fulfilledStage!=null&&slot.fulfilledPid==null)fail(path+'.fulfilledStage');
   if(slot.fulfilledPid!=null){
    if(fulfilled.has(slot.fulfilledPid)||!slot.confirmedCandidate)fail(path+'.fulfilledPid');
    fulfilled.add(slot.fulfilledPid);
    if(!caught.has(slot.fulfilledPid))warnings.add('A saved acquisition refers to a Pokémon outside the exported party.');
   }
  };
  plan.slots.forEach((slot,i)=>validate(slot,'plan.slots['+i+']',fulfilled));
  if(plan.independentSlots!=null){
   if(!object(plan.independentSlots))fail('plan.independentSlots');
   const during=new Set();
   for(const [key,stages] of Object.entries(plan.independentSlots)){
    const path='plan.independentSlots.'+key;
    if(!/^[0-5]$/.test(key)||!object(stages)||!Object.hasOwn(stages,'during')||Object.keys(stages).some(field=>field!=='during'))fail(path);
    validate(stages.during,path+'.during',during);
   }
  }
  return plan;
 }
 function validate(data,games){
  if(!object(data))fail('file');
  inspect(data,'file');
  const envelope=data.format==='takdex-team';
  if(Object.hasOwn(data,'format')&&!envelope)fail('format');
  if(envelope)enumValue(data.version??1,'version',[1,2]);
  const team=envelope?data.team:data;
  if(!object(team)||!games.includes(team.game)||!Array.isArray(team.pokemon)||team.pokemon.length>6)fail('team');
  string(team.name,'team.name',200,true);
  if(team.id!=null)string(team.id,'team.id',128,true);
  const caught=new Set(),warnings=new Set();
  team.pokemon.forEach((member,i)=>{
   if(member===null)return;
   mon(member,'team.pokemon['+i+']');
   const pid=member.saveStats?.pid;
   if(pid!=null){
    if(caught.has(pid))fail('team.pokemon['+i+'].saveStats.pid');
    caught.add(pid);
   }
  });
  const plan=envelope?planFor(data.plan,team.game,caught,warnings):null;
  const progression=envelope?data.progression:undefined;
  if(progression!=null){
   if(!object(progression))fail('progression');
   optionalInteger(progression,'badgeCount','progression',0,8);
   for(const key of ['leagueCompleted','championCompleted','postgame'])
    if(progression[key]!=null&&typeof progression[key]!=='boolean')fail('progression.'+key);
   if(progression.events!=null&&(!object(progression.events)||
    Object.entries(progression.events).some(([name,value])=>!/^[a-zA-Z]{1,80}$/.test(name)||typeof value!=='boolean')))fail('progression.events');
   for(const key of ['badges','hms'])if(progression[key]!=null&&(!Array.isArray(progression[key])||
    progression[key].length>8||progression[key].some(x=>typeof x!=='string'||x.length>40)))fail('progression.'+key);
  }
  return {team,plan,progression,warnings:[...warnings]};
 }
 if(typeof module==='object')module.exports={validate};
 else root.takDexImportV78={validate};
})(globalThis);
