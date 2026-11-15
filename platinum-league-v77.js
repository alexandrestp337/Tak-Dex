/* V74 DEV7: Pokémon Platinum (DS) post-Stark Mountain Elite Four rematches.
 * Data: Bulbapedia Walkthrough: Pokémon Platinum/Elite Four rematches.
 * Entries are exact trainer move lists, not species default level-up learnsets.
 */
(function(){'use strict';
const moves={
 Aaron:{
  yanmega:['Air Slash','Bug Buzz','U-turn','Double Team'],
  scizor:['Iron Head','X-Scissor','Night Slash','Quick Attack'],
  vespiquen:['Attack Order','Defend Order','Heal Order','Power Gem'],
  heracross:['Megahorn','Close Combat','Night Slash','Stone Edge'],
  drapion:['X-Scissor','Cross Poison','Ice Fang','Aerial Ace']
 },
 Bertha:{
  whiscash:['Earth Power','Aqua Tail','Zen Headbutt','Sandstorm'],
  gliscor:['Earthquake','Ice Fang','Fire Fang','Thunder Fang'],
  hippowdon:['Earthquake','Stone Edge','Crunch','Yawn'],
  golem:['Earthquake','Fire Punch','Thunder Punch','Sandstorm'],
  rhyperior:['Earthquake','Rock Wrecker','Megahorn','Avalanche']
 },
 Flint:{
  houndoom:['Flamethrower','Sludge Bomb','Dark Pulse','Sunny Day'],
  flareon:['Overheat','Giga Impact','Quick Attack','Will-O-Wisp'],
  rapidash:['Flare Blitz','Solar Beam','Bounce','Sunny Day'],
  infernape:['Flare Blitz','Thunder Punch','Mach Punch','Earthquake'],
  magmortar:['Flamethrower','Thunderbolt','Solar Beam','Hyper Beam']
 },
 Lucian:{
  'mr-mime':['Psychic','Thunderbolt','Reflect','Light Screen'],
  espeon:['Psychic','Shadow Ball','Quick Attack','Signal Beam'],
  bronzong:['Psychic','Gyro Ball','Earthquake','Calm Mind'],
  alakazam:['Psychic','Energy Ball','Focus Blast','Recover'],
  gallade:['Drain Punch','Psycho Cut','Leaf Blade','Stone Edge']
 },
 Cynthia:{
  spiritomb:['Dark Pulse','Psychic','Silver Wind','Ominous Wind'],
  roserade:['Energy Ball','Sludge Bomb','Shadow Ball','Extrasensory'],
  togekiss:['Air Slash','Aura Sphere','Water Pulse','Psychic'],
  lucario:['Aura Sphere','Dragon Pulse','Psychic','Earthquake'],
  milotic:['Surf','Ice Beam','Mirror Coat','Aqua Ring'],
  garchomp:['Dragon Rush','Earthquake','Brick Break','Giga Impact']
 }
};
const abilities={
 Aaron:{yanmega:'Speed Boost',scizor:'Swarm',vespiquen:'Pressure',heracross:'Swarm',drapion:'Battle Armor'},
 Bertha:{whiscash:'Oblivious',gliscor:'Hyper Cutter',hippowdon:'Sand Stream',golem:'Rock Head',rhyperior:'Lightningrod'},
 Flint:{houndoom:'Early Bird',flareon:'Flash Fire',rapidash:'Run Away',infernape:'Blaze',magmortar:'Flame Body'},
 Lucian:{'mr-mime':'Soundproof',espeon:'Synchronize',bronzong:'Levitate',alakazam:'Synchronize',gallade:'Steadfast'},
 Cynthia:{spiritomb:'Pressure',roserade:'Natural Cure',togekiss:'Hustle',lucario:'Steadfast',milotic:'Marvel Scale',garchomp:'Sand Veil'}
};
const ace={Aaron:'drapion',Bertha:'rhyperior',Flint:'magmortar',Lucian:'gallade',Cynthia:'garchomp'};
const slug=s=>String(s||'').trim().toLowerCase().replace(/\./g,'').replace(/[^a-z0-9]+/g,'-').replace(/-+$/,'');
function get(trainer,version,pokemon){if(version!=='v2')return null;
 const tn=Object.keys(moves).find(x=>slug(x)===slug(trainer));if(!tn)return null;
 const name=slug(pokemon),t=moves[tn];const list=t[name];
 return list?{moves:list.slice(),ability:abilities[tn]?.[name]||'',item:ace[tn]===name?'Sitrus Berry':''}:null;
}
window.takDexPlatinumLeagueV77={get,moves,source:'https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pokémon_Platinum/Elite_Four_rematches'};
})();
