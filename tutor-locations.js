/* Tak-Dex V73 — independently verified, game-specific Move Tutor acquisition data.
 * Coverage is intentionally partial. Unlisted tutors are UNKNOWN, not absent.
 * References: https://pokemondb.net/mechanics/move-tutors
 *             https://www.serebii.net/platinum/movetutors.shtml
 */
(function(){
'use strict';
const source='https://pokemondb.net/mechanics/move-tutors';
const data=Object.create(null);
function add(game,place,detail,records,ref=source){
  const games=Array.isArray(game)?game:[game];
  for(const g of games){
    if(!data[g])data[g]=Object.create(null);
    for(const [move,cost,condition] of records){
      const key=move.toLowerCase().replace(/\s+/g,'-');
      if(!data[g][key])data[g][key]=[];
      data[g][key].push({game:g,place,detail,cost:cost||'Free',condition:condition||'',reference:ref,type:'Move Tutor'});
    }
  }
}
// Platinum: all three shard tutors, and the two earlier Diamond/Pearl special tutors.
// Shard amounts are Red, Green, Blue, Yellow in the table source.
function shards(r=0,g=0,b=0,y=0){return [['Red',r],['Green',g],['Blue',b],['Yellow',y]].filter(x=>x[1]).map(([color,n])=>n+' '+color+' Shard'+(n===1?'':'s')).join(' + ')}
add('Platinum','Route 212','House in the southern, rainy stretch of Route 212',[
 ['fire-punch',shards(2,0,6)],['ice-punch',shards(2,0,6)],['thunder-punch',shards(2,0,6)],
 ['icy-wind',shards(0,2,6)],['fury-cutter',shards(0,0,8)],['trick',shards(0,0,4,4)],
 ['knock-off',shards(4,0,4)],['dive',shards(2,0,4,2)],['air-cutter',shards(2,2,4)],
 ['sucker-punch',shards(0,0,6,2)],['vacuum-wave',shards(2,2,4)],['zen-headbutt',shards(0,0,4,4)],
 ['ominous-wind',shards(0,2,6)]
]);
add('Platinum','Snowpoint City','Move Tutor in the northwest house',[
 ['swift',shards(0,4,2,2)],['snore',shards(2,2,0,4)],['spite',shards(0,0,0,8)],
 ['synthesis',shards(0,6,0,2)],['uproar',shards(0,2,0,6)],['helping-hand',shards(2,2,0,4)],
 ['last-resort',shards(0,8)],['magnet-rise',shards(0,2,2,4)]
]);
add('Platinum','Survival Area','Move Tutor reached via the ledge from Route 226',[
 ['mud-slap',shards(4,0,4)],['outrage',shards(6,0,0,2)],['rollout',shards(4,2,2)],
 ['twister',shards(6,2)],['ancient-power',shards(6,2)],['heat-wave',shards(4,2,2)],
 ['superpower',shards(8)],['endeavor',shards(4,0,0,4)],['signal-beam',shards(2,2,2,2)],
 ['iron-defense',shards(4,0,2,2)],['bounce',shards(4,2,0,2)],['gastro-acid',shards(4,2,0,2)],
 ['aqua-tail',shards(6,2)],['seed-bomb',shards(4,4)],['earth-power',shards(6,2)],
 ['gunk-shot',shards(4,2,2)],['iron-head',shards(6,0,0,2)]
]);
add(['Diamond','Pearl','Platinum'],'Route 210','Elder in the northern part of Route 210',[
 ['draco-meteor','Free','Eligible Dragon-type Pokémon with maximum friendship']
]);
add(['Diamond','Pearl','Platinum'],'Route 228','Move Tutor in a house on Route 228',[
 ['blast-burn','Free','Eligible fully evolved Fire starter with maximum friendship'],
 ['hydro-cannon','Free','Eligible fully evolved Water starter with maximum friendship'],
 ['frenzy-plant','Free','Eligible fully evolved Grass starter with maximum friendship']
]);
add('Crystal','Goldenrod City','Tutor outside the Game Corner; Wednesdays and Saturdays after Hall of Fame, Coin Case required',[
 ['flamethrower','4,000 coins'],['ice-beam','4,000 coins'],['thunderbolt','4,000 coins']
]);
// FireRed / LeafGreen: one-time overworld tutors and special tutor locations.
const frlg={
 'Route 4':['mega-punch','mega-kick'], 'Cape Brink':['blast-burn','hydro-cannon','frenzy-plant'],
 'Celadon City':['counter','soft-boiled'], 'Cinnabar Island':['metronome'],
 'Four Island':['body-slam'], 'Fuchsia City':['substitute'], 'Mt. Ember':['explosion'],
 'Pewter City':['seismic-toss'], 'Rock Tunnel':['rock-slide'], 'Saffron City':['mimic'],
 'Seven Island':['swords-dance'], 'Silph Co.':['thunder-wave'],
 'Victory Road':['double-edge'], 'Viridian City':['dream-eater']
};
for(const [place,moves] of Object.entries(frlg))add(['FireRed','LeafGreen'],place,'Move Tutor in '+place,moves.map(n=>[n,'Free','One-time tutor']));
// Emerald tutors. Battle Frontier BP prices and the one-time Hoenn locations.
add('Emerald','Battle Frontier','Move Tutor inside the Battle Frontier',[
 ['mega-punch','24 BP'],['fire-punch','48 BP'],['ice-punch','48 BP'],['thunder-punch','48 BP'],
 ['swords-dance','48 BP'],['mega-kick','48 BP'],['body-slam','48 BP'],['counter','48 BP'],
 ['seismic-toss','24 BP'],['thunder-wave','48 BP'],['defense-curl','16 BP'],['swift','24 BP'],
 ['soft-boiled','16 BP'],['dream-eater','24 BP'],['rock-slide','48 BP'],['snore','24 BP'],
 ['mud-slap','24 BP'],['icy-wind','24 BP'],['endure','48 BP'],['psych-up','48 BP']
]);
for(const [place,move] of Object.entries({'Fallarbor Town':'metronome','Fortree City':'sleep-talk','Lavaridge Town':'mimic','Mauville City':'rollout','Mossdeep City':'dynamic-punch','Pacifidlog Town':'explosion','Slateport City':'swagger','Sootopolis City':'double-edge','Verdanturf Town':'fury-cutter','Lilycove City':'substitute'}))add('Emerald',place,'One-time Move Tutor',[ [move,'Free','One-time tutor'] ]);
// HeartGold/SoulSilver tutor list, cross-checked against the full Frontier Access
// lists: https://altissimo1.github.io/Main-Series/HGSS/moves.html
const hgss=['HeartGold','SoulSilver'];
add(hgss,'Frontier Access','Move Tutor house in the southwest corner of Frontier Access; Battle Points required',[
 ['dive','40 BP'],['fury-cutter','32 BP'],['icy-wind','48 BP'],
 ['thunder-punch','64 BP'],['fire-punch','64 BP'],['ice-punch','64 BP'],
 ['ominous-wind','48 BP'],['air-cutter','48 BP'],['zen-headbutt','64 BP'],
 ['vacuum-wave','48 BP'],['trick','48 BP'],['knock-off','40 BP'],
 ['sucker-punch','40 BP'],['bug-bite','32 BP'],
 ['mud-slap','32 BP'],['rollout','32 BP'],['superpower','48 BP'],
 ['iron-head','40 BP'],['aqua-tail','40 BP'],['gastro-acid','32 BP'],
 ['endeavor','64 BP'],['outrage','48 BP'],['ancient-power','40 BP'],
 ['signal-beam','40 BP'],['earth-power','40 BP'],['gunk-shot','32 BP'],
 ['twister','40 BP'],['seed-bomb','40 BP'],['iron-defense','40 BP'],
 ['bounce','32 BP'],['heat-wave','48 BP'],['super-fang','40 BP'],
 ['pain-split','64 BP'],['low-kick','32 BP'],['sky-attack','64 BP'],
 ['snore','32 BP'],['spite','40 BP'],['helping-hand','40 BP'],
 ['synthesis','40 BP'],['magnet-rise','40 BP'],['last-resort','48 BP'],
 ['swift','40 BP'],['uproar','48 BP'],['string-shot','32 BP'],
 ['tailwind','48 BP'],['gravity','32 BP'],['worry-seed','32 BP'],
 ['magic-coat','32 BP'],['role-play','48 BP'],['heal-bell','48 BP'],
 ['block','32 BP']
], 'https://altissimo1.github.io/Main-Series/HGSS/moves.html');
add(hgss,'Ilex Forest','Tutor at the southeast side of the pond, accessible around a ledge',[['headbutt','Free']], 'https://altissimo1.github.io/Main-Series/HGSS/moves.html');
add(hgss,'Blackthorn City','Special tutors in the western house',[
 ['draco-meteor','Free','Dragon-type Pokémon with maximum friendship'],
 ['blast-burn','Free','Eligible fully evolved Fire starter with maximum friendship'],
 ['hydro-cannon','Free','Eligible fully evolved Water starter with maximum friendship'],
 ['frenzy-plant','Free','Eligible fully evolved Grass starter with maximum friendship']
], 'https://altissimo1.github.io/Main-Series/HGSS/moves.html');

// DEV6.2 — B2W2 tutor catalog, verified against Serebii.
const b2w2=['Black 2','White 2'], b2ref='https://www.serebii.net/black2white2/movetutor.shtml';
add(b2w2,"Driftveil City","Red Shard tutor",[["covet", "2 Red Shards"], ["bug-bite", "2 Red Shards"], ["drill-run", "4 Red Shards"], ["bounce", "4 Red Shards"], ["signal-beam", "4 Red Shards"], ["iron-head", "4 Red Shards"], ["super-fang", "6 Red Shards"], ["uproar", "6 Red Shards"], ["seed-bomb", "6 Red Shards"], ["dual-chop", "6 Red Shards"], ["low-kick", "8 Red Shards"], ["gunk-shot", "8 Red Shards"], ["thunder-punch", "10 Red Shards"], ["fire-punch", "10 Red Shards"], ["ice-punch", "10 Red Shards"]],b2ref);
add(b2w2,"Lentimas Town","Blue Shard tutor",[["last-resort", "2 Blue Shards"], ["iron-defense", "2 Blue Shards"], ["magnet-rise", "4 Blue Shards"], ["magic-coat", "4 Blue Shards"], ["block", "6 Blue Shards"], ["hyper-voice", "6 Blue Shards"], ["electroweb", "6 Blue Shards"], ["icy-wind", "6 Blue Shards"], ["iron-tail", "6 Blue Shards"], ["aqua-tail", "8 Blue Shards"], ["earth-power", "8 Blue Shards"], ["zen-headbutt", "8 Blue Shards"], ["foul-play", "8 Blue Shards"], ["superpower", "10 Blue Shards"], ["gravity", "10 Blue Shards"], ["dragon-pulse", "10 Blue Shards"], ["dark-pulse", "10 Blue Shards"]],b2ref);
add(b2w2,"Humilau City","Yellow Shard tutor",[["bind", "2 Yellow Shards"], ["snore", "2 Yellow Shards"], ["heal-bell", "4 Yellow Shards"], ["knock-off", "4 Yellow Shards"], ["synthesis", "6 Yellow Shards"], ["roost", "6 Yellow Shards"], ["sky-attack", "8 Yellow Shards"], ["role-play", "8 Yellow Shards"], ["heat-wave", "10 Yellow Shards"], ["giga-drain", "10 Yellow Shards"], ["drain-punch", "10 Yellow Shards"], ["pain-split", "10 Yellow Shards"], ["tailwind", "10 Yellow Shards"]],b2ref);
add(b2w2,"Nacrene City","Green Shard tutor",[["worry-seed", "6 Green Shards"], ["gastro-acid", "6 Green Shards"], ["helping-hand", "8 Green Shards"], ["after-you", "8 Green Shards"], ["magic-room", "8 Green Shards"], ["wonder-room", "8 Green Shards"], ["spite", "8 Green Shards"], ["recycle", "10 Green Shards"], ["trick", "10 Green Shards"], ["stealth-rock", "10 Green Shards"], ["outrage", "10 Green Shards"], ["endeavor", "10 Green Shards"], ["sleep-talk", "10 Green Shards"], ["skill-swap", "10 Green Shards"], ["snatch", "10 Green Shards"]],b2ref);
add(b2w2,"Pokémon World Tournament","Special tutor stalls",[["grass-pledge","Free","Eligible starter; sufficient friendship"],["fire-pledge","Free","Eligible starter; sufficient friendship"],["water-pledge","Free","Eligible starter; sufficient friendship"],["frenzy-plant","Free","Eligible fully evolved starter; sufficient friendship"],["blast-burn","Free","Eligible fully evolved starter; sufficient friendship"],["hydro-cannon","Free","Eligible fully evolved starter; sufficient friendship"]],b2ref);
add(b2w2,"Opelucid City","Drayden’s house",[["draco-meteor","Free","After defeating Drayden; eligible Dragon Pokémon"]],b2ref);
function find(game,move){const key=String(move||'').toLowerCase().trim().replace(/\s+/g,'-');return (data[game]?.[key]||[]).map(e=>({...e}));}
function at(game,place){const normalized=String(place||'').trim().toLowerCase().replace(/[^a-z0-9]+/g,'-');
  return Object.entries(data[game]||{}).flatMap(([move,records])=>records.filter(e=>e.place.toLowerCase().replace(/[^a-z0-9]+/g,'-')===normalized).map(e=>({...e,move}))).sort((a,b)=>a.move.localeCompare(b.move));
}
window.takDexTutorV73={find,at,source,coverage:Object.keys(data)};
})();
