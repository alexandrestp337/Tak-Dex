/* Timing sources and scope are listed in .github/v77/REPORT.md. */
(function(root){
 'use strict';
 const early=(rank,place,method,note='')=>({kind:'timed',confirmed:true,rank,place,method,note});
 const bw2={
  mareep:early(0,'Floccesy Ranch','walk'),riolu:early(0,'Floccesy Ranch','walk'),
  azurill:early(0,'Floccesy Ranch','walk'),lillipup:early(0,'Floccesy Ranch','walk'),
  psyduck:early(0,'Floccesy Ranch','walk'),patrat:early(0,'Route 19','walk'),
  purrloin:early(0,'Route 19','walk'),sewaddle:early(0,'Route 20','walk'),
  magnemite:early(1,'Virbank Complex','walk'),growlithe:early(1,'Virbank Complex','walk'),
  magby:early(1,'Virbank Complex','walk'),elekid:early(1,'Virbank Complex','walk'),
  koffing:early(1,'Virbank Complex','walk'),pidove:early(0,'Floccesy Ranch','walk'),
  eevee:early(2,'Castelia City park','walk','Enter from Castelia Sewers.'),
  sandile:early(3,'Desert Resort','walk'),darumaka:early(3,'Desert Resort','walk'),
  zorua:early(4,'Driftveil City','gift','N’s Zorua from Rood after battling him.'),
  volcarona:early(5,'Relic Castle via Relic Passage','static','Level 35 after defeating Clay.'),
  magikarp:early(10,'Marvelous Bridge','purchase','₽500 after the League.')
 };
 const bw={
  patrat:early(0,'Route 1','walk'),lillipup:early(0,'Route 1','walk'),
  purrloin:early(0,'Route 2','walk'),munna:early(1,'Dreamyard','walk','Requires Cut for the grass.'),
  pidove:early(1,'Route 3','walk'),blitzle:early(1,'Route 3','walk'),
  roggenrola:early(1,'Wellspring Cave','walk'),woobat:early(1,'Wellspring Cave','walk'),
  sandile:early(3,'Desert Resort','walk'),darumaka:early(3,'Desert Resort','walk'),
  magikarp:early(10,'Marvelous Bridge','purchase','₽500 after the story clear.'),
  larvesta:early(6,'Route 18','gift egg','Requires Surf and hatching the egg.')
 };
 function addRoutes(records,rank,place,names,note=''){
  for(const name of names.split(' '))if(!records[name])records[name]=early(rank,place,'walk',note);
 }
 addRoutes(bw2,0,'Route 20','sunkern');
 addRoutes(bw2,2,'Castelia Sewers','rattata zubat grimer','Open during the Team Plasma investigation.');
 addRoutes(bw2,2,'Relic Passage','onix roggenrola woobat timburr','Enter from Castelia Sewers.');
 addRoutes(bw2,3,'Desert Resort','sandshrew trapinch maractus dwebble scraggy sigilyph');
 addRoutes(bw,1,'Pinwheel Forest exterior','timburr tympole');
 addRoutes(bw,2,'Pinwheel Forest interior','sewaddle venipede','After the Nacrene Gym museum incident.');
 addRoutes(bw,3,'Desert Resort','maractus dwebble scraggy sigilyph');
 const sequelLand={ 'unova-route-4':3,'unova-route-5':4,'unova-route-6':5,'unova-route-7':5,
  'unova-route-9':6,'unova-route-11':6,'unova-route-12':6,'unova-route-13':6,'unova-route-16':3,
  'unova-route-22':8,'chargestone-cave · 1f':5,'celestial-tower · 2f':5,'lostlorn-forest':3,'village-bridge':6,
  'strange-house · 1f':6 };
 const originalLand={'unova-route-4':2,'unova-route-5':4,'unova-route-6':5,'unova-route-7':5,
  'unova-route-9':7,'unova-route-16':3,'chargestone-cave · 1f':5,'celestial-tower · 2f':5,'lostlorn-forest':3};
 function land(game,encounters){
  const sequel=game.endsWith(' 2'),catalog=sequel?sequelLand:originalLand;
  const valid=(encounters||[]).filter(([place,method, , ,conditions])=>
   Object.hasOwn(catalog,place)&&['walk','dark-grass','grass-spots','cave-spots'].includes(method)&&!conditions?.length);
  const first=valid.sort((a,b)=>catalog[a[0]]-catalog[b[0]])[0];
  if(!first)return null;
  const place=first[0].replace(/^unova-/,'').replace(/-/g,' ').replace(/^./,c=>c.toUpperCase());
  return {...early(catalog[first[0]],place,first[1],'Documented encounter route.'),source:sequel?'walkthrough-b2w2':'walkthrough-bw'};
 }
 const levels={golduck:['psyduck',33],pelipper:['wingull',25],weezing:['koffing',35],golbat:['zubat',22],
  raticate:['rattata',20],unfezant:['pidove',32],tranquill:['pidove',21],leavanny:['sewaddle','Friendship after Swadloon'],
  sandslash:['sandshrew',22],vibrava:['trapinch',35],flygon:['trapinch',45],
crustle:['dwebble',34],scrafty:['scraggy',39],sunflora:['sunkern','Sun Stone'],
  grumpig:['spoink',32],flaaffy:['mareep',15],ampharos:['mareep',30],magneton:['magnemite',30],
  watchog:['patrat',20],liepard:['purrloin',20],herdier:['lillipup',16],stoutland:['lillipup',32],
  krookodile:['sandile',40],krokorok:['sandile',29],darmanitan:['darumaka',35],
  zoroark:['zorua',30],gurdurr:['timburr',25],boldore:['roggenrola',25],gyarados:['magikarp',20]};
 const regionalPlants={Black:'cottonee',White:'petilil'};
 const conditions={lucario:['riolu','Friendship during the day'],crobat:['zubat','Friendship after Golbat'],
  gigalith:['roggenrola','Trade Boldore'],conkeldurr:['timburr','Trade Gurdurr'],
  arcanine:['growlithe','Fire Stone'],magnezone:['magnemite','Level up Magneton in Chargestone Cave'],
  jolteon:['eevee','Thunder Stone'],flareon:['eevee','Fire Stone'],vaporeon:['eevee','Water Stone']};
 const sequelConditions={
  arcanine:['growlithe',3,'Fire Stone in Desert Resort'],
  jolteon:['eevee',3,'Thunder Stone in Nimbasa City'],
  flareon:['eevee',3,'Fire Stone in Desert Resort'],
  vaporeon:['eevee',5,'Water Stone on Route 19 · Requires Surf'],
  sunflora:['sunkern',3,'Sun Stone in Nimbasa City'],
  magnezone:['magnemite',5,'Level up Magneton in Chargestone Cave'],
  lucario:['riolu',0,'High friendship during the day'],
  crobat:['zubat',2,'Golbat at Lv 22, then high friendship'],
 };
 function hidden(game,name,ability){
  if((game==='Black 2'||game==='White 2')&&name==='minccino'&&ability==='skill-link')
   return 'Route 5 Hidden Grotto · Bianca’s tutorial after Elesa.';
  return '';
 }
 function lookup(game,name,encounters){
  const sequel=game==='Black 2'||game==='White 2';
  if(!sequel&&game!=='Black'&&game!=='White')return null;
  if(sequel&&((name==='magby'&&game==='White 2')||(name==='elekid'&&game==='Black 2')))
   return {kind:'trade',reason:'Version-exclusive family'};
  if(!sequel&&regionalPlants[game]===name)return {...early(2,'Pinwheel Forest interior','walk','After the Nacrene Gym museum incident.'),source:'walkthrough-bw'};
  if(name==='conkeldurr'||(!sequel&&name==='gigalith'))return {kind:'trade',reason:name==='gigalith'?'Trade Boldore':'Trade Gurdurr'};
  if(sequel&&name==='gigalith')return {...early(5,'Route 7','in-game trade','Trade a Lostlorn Forest Emolga to the Hiker, or trade-evolve Boldore.'),source:'unova-route-7'};
  if(sequel&&name==='gliscor')return {...early(6,'Route 11','grass-spots','Catch Gliscor in rustling grass, or evolve Route 11 Gligar at night holding a Razor Fang (8 BP at PWT/Subway).'),source:'route-11-and-razor-fang'};
  if(['tirtouga','archen'].includes(name)){
   const fossil=name==='tirtouga'?'Cover Fossil':'Plume Fossil';
   return {...early(sequel?10:3,sequel?'Nacrene Museum':'Relic Castle → Nacrene Museum','fossil',fossil+' · One fossil choice per save.'),source:sequel?'walkthrough-b2w2':'walkthrough-bw'};
  }
  const specific=sequel&&sequelConditions[name];
  if(specific){
   const [stage,rank,requirement]=specific;
   return {...early(rank,bw2[stage].place,'evolution',stage+' → '+name+' · '+requirement),source:'bulbapedia-stones-and-evolution'};
  }
  const records=sequel?bw2:bw;
  if(records[name])return {...records[name],source:sequel?'walkthrough-b2w2':'walkthrough-bw'};
  const rule=levels[name]||conditions[name],parent=rule&&records[rule[0]];
  const direct=land(game,encounters);
  if(!parent||direct&&direct.rank<parent.rank)return direct;
  return {kind:typeof rule[1]==='number'?'timed':'partial',confirmed:typeof rule[1]==='number',rank:parent.rank,place:parent.place,method:'evolution',
   note:rule[0]+' available earlier · '+(typeof rule[1]==='number'?'evolves by Lv '+rule[1]:rule[1]),source:'pokedb-evolution'};
 }
 root.takDexAcquisitionV77={lookup,hidden};
})(globalThis);
