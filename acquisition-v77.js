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
 const levels={flaaffy:['mareep',15],ampharos:['mareep',30],magneton:['magnemite',30],
  watchog:['patrat',20],liepard:['purrloin',20],herdier:['lillipup',16],stoutland:['lillipup',32],
  krookodile:['sandile',40],krokorok:['sandile',29],darmanitan:['darumaka',35],
  zoroark:['zorua',30],gurdurr:['timburr',25],boldore:['roggenrola',25],gyarados:['magikarp',20]};
 const regionalPlants={Black:'cottonee',White:'petilil'};
 const conditions={lucario:['riolu','Friendship during the day'],crobat:['zubat','Friendship after Golbat'],
  gigalith:['roggenrola','Trade Boldore'],conkeldurr:['timburr','Trade Gurdurr'],
  arcanine:['growlithe','Fire Stone'],magnezone:['magnemite','Level up Magneton in Chargestone Cave'],
  jolteon:['eevee','Thunder Stone'],flareon:['eevee','Fire Stone'],vaporeon:['eevee','Water Stone']};
 function lookup(game,name){
  const sequel=game==='Black 2'||game==='White 2';
  if(!sequel&&game!=='Black'&&game!=='White')return null;
  if(sequel&&((name==='magby'&&game==='White 2')||(name==='elekid'&&game==='Black 2')))
   return {kind:'trade',reason:'Version-exclusive family'};
  if(!sequel&&regionalPlants[game]===name)return {...early(2,'Pinwheel Forest interior','walk','After the Nacrene Gym museum incident.'),source:'walkthrough-bw'};
  const records=sequel?bw2:bw;
  if(records[name])return {...records[name],source:sequel?'walkthrough-b2w2':'walkthrough-bw'};
  const rule=levels[name]||conditions[name],parent=rule&&records[rule[0]];
  if(!parent)return null;
  return {kind:'partial',rank:parent.rank,place:parent.place,method:'evolution',
   note:rule[0]+' available earlier · '+(typeof rule[1]==='number'?'evolves by Lv '+rule[1]:rule[1]),source:'pokedb-evolution'};
 }
 root.takDexAcquisitionV77={lookup};
})(globalThis);
