/* BW1 trainer move sets, sourced against original Black/White gym and League
 * tables (not BW2). No speculative entries are synthesized. */
(function(){'use strict';
const gym={
 Cilan:{lillipup:['Work Up','Bite','Odor Sleuth','Helping Hand'],pansage:['Work Up','Vine Whip','Lick','Fury Swipes']},
 Chili:{lillipup:['Work Up','Bite','Odor Sleuth','Helping Hand'],pansear:['Work Up','Incinerate','Lick','Fury Swipes']},
 Cress:{lillipup:['Work Up','Bite','Odor Sleuth','Helping Hand'],panpour:['Work Up','Water Gun','Lick','Fury Swipes']},
 Lenora:{herdier:['Take Down','Bite','Retaliate','Leer'],watchog:['Hypnosis','Crunch','Retaliate','Leer']},
 Burgh:{whirlipede:['Poison Tail','Struggle Bug','Screech','Pursuit'],dwebble:['Smack Down','Struggle Bug','Sand Attack','Feint Attack'],leavanny:['Razor Leaf','Protect','String Shot','Struggle Bug']},
 Elesa:{emolga:['Volt Switch','Aerial Ace','Quick Attack','Pursuit'],zebstrika:['Spark','Volt Switch','Quick Attack','Flame Charge']},
 Clay:{krokorok:['Swagger','Torment','Crunch','Bulldoze'],palpitoad:['Aqua Ring','Bubble Beam','Muddy Water','Bulldoze'],excadrill:['Rock Slide','Slash','Hone Claws','Bulldoze']},
 Skyla:{swoobat:['Amnesia','Heart Stamp','Acrobatics','Assurance'],unfezant:['Quick Attack','Razor Wind','Leer','Air Slash'],swanna:['Air Slash','Aerial Ace','Bubble Beam','Aqua Ring']},
 Brycen:{vanillish:['Frost Breath','Acid Armor','Mirror Shot','Astonish'],cryogonal:['Frost Breath','Aurora Beam','Rapid Spin','Reflect'],beartic:['Icicle Crash','Swagger','Slash','Brine']},
 Drayden:{fraxure:['Dragon Tail','Dragon Dance','Dragon Rage','Assurance'],druddigon:['Dragon Tail','Night Slash','Chip Away','Revenge'],haxorus:['Dragon Tail','Dragon Dance','Slash','Assurance']},
 Iris:{fraxure:['Dragon Tail','Dragon Dance','Dragon Rage','Assurance'],druddigon:['Dragon Tail','Night Slash','Chip Away','Revenge'],haxorus:['Dragon Tail','Dragon Dance','Slash','Assurance']}
};
const elite={
 Shauntal:{
  v1:{cofagrigus:['Will-O-Wisp','Grass Knot','Psychic','Shadow Ball'],jellicent:['Energy Ball','Brine','Surf','Shadow Ball'],golurk:['Curse','Earthquake','Brick Break','Shadow Punch'],chandelure:['Payback','Fire Blast','Psychic','Shadow Ball']},
  v2:{cofagrigus:['Shadow Ball','Psychic','Will-O-Wisp','Energy Ball'],jellicent:['Shadow Ball','Psychic','Hydro Pump','Sludge Wave'],froslass:['Shadow Ball','Psychic','Blizzard','Ice Shard'],drifblim:['Shadow Ball','Psychic','Acrobatics','Thunder'],golurk:['Shadow Punch','Earthquake','Hammer Arm','Curse'],chandelure:['Shadow Ball','Psychic','Fire Blast','Payback']}
 },
 Grimsley:{
  v1:{scrafty:['Crunch','Brick Break','Poison Jab','Sand Attack'],liepard:['Night Slash','Fake Out','Aerial Ace','Attract'],krookodile:['Crunch','Dragon Claw','Earthquake','Foul Play'],bisharp:['Night Slash','X-Scissor','Metal Claw','Aerial Ace']},
  v2:{sharpedo:['Aqua Jet','Night Slash','Waterfall','Earthquake'],liepard:['Sucker Punch','Fake Out','Aerial Ace','Attract'],scrafty:['Head Smash','Crunch','Brick Break','Poison Jab'],drapion:['Thunder Fang','Poison Fang','Fire Fang','Crunch'],krookodile:['Smack Down','Earthquake','Foul Play','Outrage'],bisharp:['Guillotine','Night Slash','X-Scissor','Aerial Ace']}
 },
 Marshal:{
  v1:{throh:['Storm Throw','Bulldoze','Stone Edge','Payback'],sawk:['Karate Chop','Grass Knot','Stone Edge','Retaliate'],conkeldurr:['Hammer Arm','Grass Knot','Stone Edge','Retaliate'],mienshao:['Jump Kick','U-Turn','Rock Slide','Retaliate']},
  v2:{breloom:['Mach Punch','Spore','Grass Knot','Sky Uppercut'],sawk:['Close Combat','Retaliate','Stone Edge','Poison Jab'],throh:['Superpower','Retaliate','Earthquake','Grass Knot'],toxicroak:['Venoshock','Toxic','Low Sweep','Earthquake'],mienshao:['Hi Jump Kick','U-Turn','Acrobatics','Fake Out'],conkeldurr:['Hammer Arm','Earthquake','Stone Edge','Payback']}
 },
 Caitlin:{
  v1:{reuniclus:['Psychic','Energy Ball','Focus Blast','Thunder'],musharna:['Psychic','Shadow Ball','Charge Beam','Reflect'],sigilyph:['Psychic','Shadow Ball','Ice Beam','Air Slash'],gothitelle:['Psychic','Shadow Ball','Thunderbolt','Calm Mind']},
  v2:{musharna:['Psychic','Dream Eater','Hypnosis','Reflect'],sigilyph:['Air Slash','Psychic','Flash Cannon','Ice Beam'],bronzong:['Payback','Flash Cannon','Psychic','Charge Beam'],reuniclus:['Psychic','Thunder','Energy Ball','Focus Blast'],gothitelle:['Psychic','Payback','Flatter','Thunderbolt'],metagross:['Zen Headbutt','Bullet Punch','Earthquake','Giga Impact']}
 },
 'Alder (postgame)':{v1:{accelgor:['Focus Blast','Bug Buzz','Me First','Energy Ball'],bouffalant:['Head Charge','Megahorn','Earthquake','Stone Edge'],druddigon:['Outrage','Superpower','Night Slash','Payback'],vanilluxe:['Blizzard','Flash Cannon','Light Screen','Acid Armor'],escavalier:['X-Scissor','Iron Head','Aerial Ace','Giga Impact'],volcarona:['Overheat','Quiver Dance','Bug Buzz','Hyper Beam']},v2:{accelgor:['Focus Blast','Bug Buzz','Me First','Energy Ball'],bouffalant:['Head Charge','Megahorn','Earthquake','Stone Edge'],druddigon:['Outrage','Superpower','Night Slash','Payback'],vanilluxe:['Blizzard','Flash Cannon','Light Screen','Acid Armor'],escavalier:['X-Scissor','Iron Head','Aerial Ace','Giga Impact'],volcarona:['Overheat','Quiver Dance','Bug Buzz','Hyper Beam']}}
};
function normalized(s){return String(s||'').toLowerCase().replace(/[^a-z0-9]/g,'')}
function get(trainer,mode,version,mon){const key=String(trainer||'');const gymKey=Object.keys(gym).find(name=>normalized(key)===normalized(name)||normalized(key).startsWith(normalized(name)));const table=mode==='gym'?gym[gymKey||key]:elite[key]?.[version]||elite[key]?.v1;return table?.[String(mon).toLowerCase()]||null;}
window.takDexBWTrainerMovesV76={get,gym,elite,sourceGym:'https://www.pokemon-france.com/en/guides/black-and-white/unova-gyms/',sourceLeague:'https://www.serebii.net/pokearth/unova/pokemonleague.shtml'};
})();
