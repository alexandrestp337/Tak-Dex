const {Generations,Pokemon,Move,Field,calculate}=require(process.env.TAKDEX_REFERENCE_CALC||'@smogon/calc');
const g=Generations.get(5);
const statKeys={hp:'hp',atk:'attack',def:'defense',spa:'special-attack',spd:'special-defense',spe:'speed'};
const statMap=stat=>Object.fromEntries(Object.entries(statKeys).map(([key,label])=>[label,stat[key]]));
const norm=s=>s?.toLowerCase().replaceAll(' ','-');
const statuses={brn:'burn',par:'paralysis',psn:'poison',tox:'toxic',slp:'sleep'};
const specs=[
 ['91 HP threshold','Stoutland','Audino','Return',{ability:'Sand Rush',ivs:{atk:1},evs:{atk:0}},{ability:'Healer',ivs:{def:1},evs:{def:0},curHP:90}],
 ['Base-power stage and item','Darmanitan','Lucario','Fire Punch',{ability:'Sheer Force',item:'Charcoal'},{ability:'Steadfast'}],
 ['Sheer Force with Life Orb','Darmanitan','Lucario','Fire Punch',{ability:'Sheer Force',item:'Life Orb'},{ability:'Steadfast'}],
 ['Mold Breaker bypasses Levitate','Haxorus','Rotom-Wash','Earthquake',{ability:'Mold Breaker'},{ability:'Levitate'}],
 ['Guts and burn','Conkeldurr','Stoutland','Drain Punch',{ability:'Guts',status:'brn'},{ability:'Sand Rush'}],
 ['Burn after STAB and effectiveness','Stoutland','Audino','Return',{ability:'Sand Rush',status:'brn'},{ability:'Healer'}],
 ['Adaptability STAB','Porygon-Z','Audino','Tri Attack',{ability:'Adaptability',item:'Choice Specs'},{ability:'Healer'}],
 ['Multiscale rounding','Beartic','Dragonite','Icicle Crash',{ability:'Snow Cloak',item:'Expert Belt'},{ability:'Multiscale'}],
 ['HP-triggered Torrent and rain','Samurott','Milotic','Surf',{ability:'Torrent',curHP:25,item:'Mystic Water'},{ability:'Marvel Scale'},'Rain'],
 ['Brine at half target HP','Samurott','Darmanitan','Brine',{ability:'Torrent'},{ability:'Sheer Force',curHP:60}],
 ['Choice Scarf and Gyro Ball','Ferrothorn','Stoutland','Gyro Ball',{ability:'Iron Barbs'},{ability:'Sand Rush',item:'Choice Scarf'}],
 ['Intimidate and Choice Band','Haxorus','Stoutland','Dragon Claw',{ability:'Mold Breaker',item:'Choice Band'},{ability:'Intimidate',abilityOn:true}],
];
const fixtures=[];
for(const [label,aName,dName,mName,initialA,initialD,weather] of specs){
 let ao={...initialA},dof={...initialD};
 let a,d,attack,rolls;
 const calc=()=>{
  a=new Pokemon(g,aName,{level:50,...ao});
  d=new Pokemon(g,dName,{level:50,...dof});
  attack=new Move(g,mName);
  rolls=calculate(g,a,d,attack,new Field(weather?{weather}:{})).damage;
 };
 calc();
 if(label==='91 HP threshold'){
  search:for(let atkEV=0;atkEV<=252;atkEV+=4)for(let defEV=0;defEV<=252;defEV+=4){
   ao.evs={atk:atkEV};dof.evs={def:defEV};calc();
   if(rolls.at(-1)===91&&rolls.filter(n=>n>=90).length===2)break search;
  }
  if(rolls.at(-1)!==91)throw Error('Threshold fixture unavailable');
 }
 const wrap=(mon,options)=>({name:mon.name,level:mon.level,types:mon.types.map(norm),
  battleStats:statMap(mon.rawStats),abilities:[norm(mon.ability)],ability:norm(mon.ability),
  ...options.item&&{heldItem:options.item},...options.status&&{status:statuses[options.status]},
  ...Number.isFinite(options.curHP)&&{currentHP:options.curHP}});
 const attacker=wrap(a,ao),defender=wrap(d,dof);
 if(weather){attacker.weather=norm(weather);defender.weather=norm(weather);}
 if(mName==='Return')attacker.friendship=255;
 const move={name:mName,power:attack.bp,type:norm(attack.type),damageClass:norm(attack.category),accuracy:100};
 fixtures.push({label,a:attacker,d:defender,m:move,rolls});
}
console.log(JSON.stringify({source:'@smogon/calc@0.11.0',generation:5,fixtures},null,2));
