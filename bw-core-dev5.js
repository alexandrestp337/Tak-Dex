/* V74 DEV5: lightweight, verified BW1 reference fallback for display and
 * battle resilience when on-demand PokeAPI records are unavailable.
 * Unknown records remain unknown; this is NOT a complete offline Pokédex. */
(function(){'use strict';
const commonIds={
 geodude:74,nosepass:299,machop:66,meditite:307,makuhita:296,voltorb:100,electrike:309,magneton:82,manectric:310,numel:322,slugma:218,camerupt:323,torkoal:324,spinda:327,vigoroth:288,linoone:264,slaking:289,swablu:333,tropius:357,pelipper:279,skarmory:227,altaria:334,claydol:344,xatu:178,lunatone:337,solrock:338,luvdisc:370,whiscash:340,sealeo:364,crawdaunt:342,kingdra:230,
 yanmega:469,scizor:212,vespiquen:416,heracross:214,drapion:452,gliscor:472,golem:76,rhyperior:464,hippowdon:450,houndoom:229,flareon:136,rapidash:78,infernape:392,magmortar:467,'mr-mime':122,espeon:196,bronzong:437,alakazam:65,gallade:475,spiritomb:442,roserade:407,togekiss:468,lucario:448,milotic:350,garchomp:445,
 lillipup:506,herdier:507,watchog:505,whirlipede:544,leavanny:542,emolga:587,palpitoad:536,unfezant:521,swanna:581,vanillish:583,cryogonal:615,beartic:614,fraxure:611,
};
const ids={
 snivy:495,servine:496,serperior:497,tepig:498,pignite:499,emboar:500,oshawott:501,dewott:502,samurott:503,
 patrat:504,watchog:505,purrloin:509,liepard:510,pansage:511,simisage:512,pansear:513,simisear:514,panpour:515,simipour:516,munna:517,musharna:518,
 blitzle:522,zebstrika:523,roggenrola:524,boldore:525,gigalith:526,woobat:527,swoobat:528,drilbur:529,excadrill:530,
 timburr:532,gurdurr:533,conkeldurr:534,seismitoad:537,throh:538,sawk:539,sewaddle:540,swadloon:541,leavanny:542,
 venipede:543,whirlipede:544,scolipede:545,sandile:551,krokorok:552,krookodile:553,dwebble:557,crustle:558,scraggy:559,scrafty:560,sigilyph:561,yamask:562,cofagrigus:563,
 darmanitan:555,'darmanitan-standard':555,carracosta:565,archeops:567,trubbish:568,garbodor:569,zoroark:571,minccino:572,cinccino:573,gothitelle:576,solosis:577,duosion:578,reuniclus:579,
 vanilluxe:584,deerling:585,sawsbuck:586,escavalier:589,foongus:590,amoonguss:591,frillish:592,jellicent:593,alomomola:594,joltik:595,galvantula:596,
 ferroseed:597,ferrothorn:598,klink:599,klang:600,klinklang:601,tynamo:602,eelektrik:603,eelektross:604,elgyem:605,beheeyem:606,litwick:607,lampent:608,chandelure:609,
 axew:610,fraxure:611,haxorus:612,cubchoo:613,beartic:614,cryogonal:615,shelmet:616,accelgor:617,stunfisk:618,mienfoo:619,mienshao:620,druddigon:621,golett:622,golurk:623,pawniard:624,bisharp:625,bouffalant:626,
 rufflet:627,braviary:628,vullaby:629,mandibuzz:630,heatmor:631,durant:632,deino:633,zweilous:634,hydreigon:635,larvesta:636,volcarona:637,
 cobalion:638,terrakion:639,virizion:640,tornadus:641,thundurus:642,reshiram:643,zekrom:644,landorus:645,kyurem:646,keldeo:647,meloetta:648,genesect:649,
 froslass:478,drifblim:426,sharpedo:319,drapion:452,bronzong:437,metagross:376,breloom:286,toxicroak:454
};
Object.assign(ids,commonIds);
// Exact Gen V base stats: HP, Attack, Defense, Special Attack, Special Defense, Speed.
const raw={
 oshawott:[['water'],55,55,45,63,45,45,['torrent']],
 dewott:[['water'],75,75,60,83,60,60,['torrent']],
 samurott:[['water'],95,100,85,108,70,70,['torrent']],
 cofagrigus:[['ghost'],58,50,145,95,105,30,['mummy']],
 jellicent:[['water','ghost'],100,60,70,85,105,60,['water-absorb','cursed-body']],
 golurk:[['ground','ghost'],89,124,80,55,80,55,['iron-fist','klutz']],
 chandelure:[['ghost','fire'],60,55,90,145,90,80,['flash-fire','flame-body']],
 froslass:[['ice','ghost'],70,80,70,80,70,110,['snow-cloak']],
 drifblim:[['ghost','flying'],150,80,44,90,54,80,['aftermath','unburden']]
};
const keys=['hp','attack','defense','special-attack','special-defense','speed'];
const species={};for(const [name,row] of Object.entries(raw))species[name]={id:ids[name],types:row[0],baseStats:Object.fromEntries(keys.map((k,i)=>[k,row[i+1]])),abilities:row[7]};
// Gen 5 values only. Unknown moves are NOT assigned speculative power.
const moves={};function add(name,type,power,damageClass,accuracy=100){moves[name]={name:name.replace(/(^|-)(\w)/g,(s,p,c)=>' '+c.toUpperCase()).trim(),type,power,damageClass,accuracy,metaGeneration:5,pp:null};}
for(const [name,type,power,damageClass,accuracy] of [
 ['tackle','normal',50,'physical',100],['pound','normal',40,'physical',100],['scratch','normal',40,'physical',100],['quick-attack','normal',40,'physical',100],
 ['water-gun','water',40,'special',100],['razor-shell','water',75,'physical',95],['aqua-jet','water',40,'physical',100],['surf','water',95,'special',100],['scald','water',80,'special',100],['hydro-pump','water',120,'special',80],
 ['ice-beam','ice',95,'special',100],['blizzard','ice',120,'special',70],['shadow-ball','ghost',80,'special',100],['shadow-claw','ghost',70,'physical',100],
 ['psychic','psychic',90,'special',100],['flamethrower','fire',95,'special',100],['fire-blast','fire',120,'special',85],['thunderbolt','electric',95,'special',100],
 ['energy-ball','grass',80,'special',100],['giga-drain','grass',75,'special',100],['leaf-blade','grass',90,'physical',100],
 ['crunch','dark',80,'physical',100],['bite','dark',60,'physical',100],['night-slash','dark',70,'physical',100],['dark-pulse','dark',80,'special',100],
 ['earthquake','ground',100,'physical',100],['stone-edge','rock',100,'physical',80],['rock-slide','rock',75,'physical',90],['brick-break','fighting',75,'physical',100],['close-combat','fighting',120,'physical',100],
 ['u-turn','bug',70,'physical',100],['bug-buzz','bug',90,'special',100],['aerial-ace','flying',60,'physical',null],['air-slash','flying',75,'special',95],['flash-cannon','steel',80,'special',100],
 ['body-slam','normal',85,'physical',100],['water-pulse','water',60,'special',100],['dragon-claw','dragon',80,'physical',100],['dragon-pulse','dragon',90,'special',100],
 ['swords-dance','normal',null,'status',null],['tail-whip','normal',null,'status',100],['growl','normal',null,'status',100],['thunder-wave','electric',null,'status',100],['will-o-wisp','fire',null,'status',75],['calm-mind','psychic',null,'status',null]
])add(name,type,power,damageClass,accuracy);
// DEV7.3: verified Gen V reference additions. Keep alternate forms separate.
species['darmanitan-standard']={id:555,types:['fire'],baseStats:{hp:105,attack:140,defense:55,'special-attack':30,'special-defense':55,speed:95},abilities:['sheer-force','zen-mode'],weight:929};
add('fire-punch','fire',75,'physical',100);moves['fire-punch'].pp=15;
add('assurance','dark',50,'physical',100);moves.assurance.pp=10;
add('synchronoise','psychic',70,'special',100);moves.synchronoise.pp=15;
window.takDexBWCoreV75={ids,species,moves};
})();
