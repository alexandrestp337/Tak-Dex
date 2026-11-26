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
  'strange-house · 1f':6,'strange-house · b1f':6,'chargestone-cave · b1f':5,'chargestone-cave · b2f':5,
  'celestial-tower · 3f':5,'celestial-tower · 4f':5,'celestial-tower · 5f':5,
  'unova-route-23':9,'giant-chasm · outside':8,'giant-chasm · forest':8,
  'unova-route-15':10,'unova-route-8':10,'unova-route-3':10,'unova-route-2':10,'unova-route-1':10,
  'dreamyard':10,'pinwheel-forest · outside':10,'pinwheel-forest · inside':10,
  'dragonspiral-tower · entrance':10,'dragonspiral-tower · outside':10,
  'icirrus-city':10,'moor-of-icirrus':10,'nature-sanctuary':10,
  'twist-mountain · b1f-3f':10,'abundant-shrine':10,'unova-route-18':10,
  'castelia-city':2,'giant-chasm':8,'seaside-cave · 1f':8,'seaside-cave · b1f':8,
  'p2-laboratory':10,'unova-victory-road-2 · unknown-area-77':9,'unova-victory-road-2 · unknown-area-80':9,
  ...Object.fromEntries(Array.from({length:9},(_,i)=>['reversal-mountain · unknown-area-'+(48+i),6])) };
 const originalLand={'unova-route-4':2,'unova-route-5':4,'unova-route-6':5,'unova-route-7':5,
  'unova-route-9':7,'unova-route-16':3,'chargestone-cave · 1f':5,'celestial-tower · 2f':5,'lostlorn-forest':3,
  'cold-storage':4,'unova-route-10':8,'unova-route-10 · victory-road-gate':8,'unova-victory-road · outside':8,
  'chargestone-cave · b1f':5,'chargestone-cave · b2f':5,'celestial-tower · 3f':5,'celestial-tower · 4f':5,'celestial-tower · 5f':5,
  'unova-route-8':7,'icirrus-city':6,'moor-of-icirrus':6,'unova-route-11':10,'unova-route-12':10,'unova-route-13':10,
  'unova-route-15':10,'village-bridge':10,'challengers-cave · 1f':10,'giant-chasm · outside':10,'giant-chasm · forest':10,
  'giant-chasm':10,'giant-chasm · forest-cave':10,'abundant-shrine':10,'unova-route-14':10,
  'dreamyard · b1f':10,'relic-castle · c':10,'relic-castle · d':10,'relic-castle · a':3,
  'relic-castle · b':7,'challengers-cave · b1f':10,'challengers-cave · b2f':10,'twist-mountain · b1f-3f':6,'unova-victory-road · 1f-unknown-room':8,
  'unova-victory-road · 4f-middle-room':8,'unova-victory-road · unknown-area-53':8,
  'pinwheel-forest · inside':2,'dragonspiral-tower · 1f':6,'dragonspiral-tower · 2f':6,
  'dragonspiral-tower · entrance':6,'dragonspiral-tower · outside':6};
 const waterBW={'unova-route-1':0,'unova-route-3':1,'unova-route-6':5,'unova-route-8':7,'unova-route-11':10,
  'icirrus-city':6,'moor-of-icirrus':6,'village-bridge':10,'undella-bay':10,
  'unova-route-4':2,'unova-route-13':10,'unova-route-17':6,'unova-route-18':6,'p2-laboratory':6,
  'abundant-shrine':10,'giant-chasm':10,'giant-chasm · forest-cave':10,'driftveil-city':4,'dragonspiral-tower · outside':6};
 const waterB2={'unova-route-19':0,'unova-route-20':0,'unova-route-6':5,'unova-route-11':6,'village-bridge':6,
  'virbank-city':1,'virbank-complex · outer':1,'unova-route-4':3,'unova-route-17':10,'unova-route-18':10,
  'p2-laboratory':10,'nature-sanctuary':10,'dragonspiral-tower · outside':10,'clay-tunnel':10,
  'relic-passage · relic-castle-entrance':5,'seaside-cave · 1f':8,'giant-chasm':8,
  'unova-route-23':9,'unova-victory-road-2 · unknown-area-71':9,
  'undella-bay':6,'undella-town':6,'humilau-city':7,'unova-route-21':8,'unova-route-1':10,'unova-route-3':10,
  'unova-route-8':10,'icirrus-city':10,'moor-of-icirrus':10};
 const isKanto=game=>['Red','Blue','Yellow'].includes(game);
 const isJohto=game=>['Gold','Silver','Crystal'].includes(game);
 const canonicalAliases={
  'kanto-victory-road-2':'Victory Road','kanto-safari-zone':'Safari Zone','kanto-power-plant':'Power Plant',
  'digletts-cave':'Diglett’s Cave',
  'nature-sanctuary':'Nature Preserve','unova-victory-road-2':'Victory Road','unova-victory-road':'Victory Road',
  'relic-castle':'Relic Castle','marvelous-bridge':'Marvelous Bridge'
 };
 function placeName(value,game){
  const [raw,room]=String(value||'').split(' · ');
  const base=canonicalAliases[raw]||raw.replace(/^(?:unova-|(?:kanto|johto)-(?:sea-)?)/,'').replace(/-/g,' ').replace(/(^| )([a-z])/g,(_,space,c)=>space+c.toUpperCase());
  if(raw==='unova-victory-road-2'&&['unknown-area-71','unknown-area-78'].includes(room))return 'Victory Road · Cave';
  if(raw==='relic-castle'&&room==='d'&&game?.endsWith(' 2'))return 'Relic Castle · Volcarona’s chamber';
  if(!room||/^unknown-area/i.test(room))return base;
  return base+' · '+room.replace(/-/g,' ').replace(/(^| )([a-z])/g,(_,space,c)=>space+c.toUpperCase());
 }
 const reviewedGrottos={'unova-route-5 · hidden-grotto':4,'unova-route-7 · hidden-grotto':5,
  'unova-route-9 · hidden-grotto':6,'unova-route-2 · hidden-grotto':10,'unova-route-3 · hidden-grotto-pond':10,
  'unova-route-18 · hidden-grotto':10,'pinwheel-forest · hidden-grotto-inner-area':10,
  'pinwheel-forest · hidden-grotto-outer-area':10,'unova-route-3 · hidden-grotto-dark-grass':10,
  'lostlorn-forest · hidden-grotto':4,'unova-route-13 · hidden-grotto-stairs':6,'giant-chasm · hidden-grotto':8};
 // RBY can reach several gyms out of order. The named event remains decisive.
 const kantoAreaGates={
  'pallet-town':[0],'viridian-city':[0],'kanto-route-1':[0],'kanto-route-2':[0],
  'viridian-forest':[0],'kanto-route-22':[0],
  'kanto-route-3':[1,'Defeat Brock to leave Pewter City eastward.'],
  'mt-moon':[1,'Defeat Brock and travel east from Pewter City.'],
  'kanto-route-4':[1,'Reach Cerulean by crossing Mt. Moon.'],
  'cerulean-city':[1,'Cross Mt. Moon from Pewter City.'],
  'kanto-route-24':[1,'Reach Cerulean and defeat the rival at Nugget Bridge.'],
  'kanto-route-25':[1,'Cross Nugget Bridge north of Cerulean City.'],
  'kanto-route-5':[1,'Help Bill, then pass through the burgled house in Cerulean.'],
  'kanto-route-6':[1,'Use the Underground Path from Route 5.'],
  'vermilion-city':[1,'Use the Underground Path from Route 5 and walk south from Route 6.'],
  'kanto-route-11':[1,'Reach Vermilion via the Routes 5–6 Underground Path.'],
  'digletts-cave':[1,'Enter from Route 11 east of Vermilion.'],
  'kanto-route-9':[2,'Obtain Cut from the S.S. Anne and defeat Misty.'],
  'kanto-route-10':[2,'Use Cut east of Cerulean City, then follow Route 9.'],
  'rock-tunnel':[2,'Reach Route 10 with Cut after Misty. Flash is optional for visibility.'],
  'kanto-route-7':[2,'Reach Lavender through Rock Tunnel, then use the Routes 7–8 Underground Path.'],
  'kanto-route-8':[2,'Reach Lavender through Rock Tunnel after obtaining Cut.'],
  'celadon-city':[2,'Travel via the Routes 7–8 Underground Path after reaching Lavender Town.'],
  'pokemon-tower':[2,'Obtain the Silph Scope from the Rocket Hideout to catch the ghosts.'],
  'kanto-route-12':[2,'Use the Poké Flute from Mr. Fuji to pass the sleeping Snorlax.'],
  'kanto-route-13':[2,'Use the Poké Flute to pass Route 12.'],
  'kanto-route-14':[2,'Reach the coastal route south of the Route 12 Snorlax.'],
  'kanto-route-15':[2,'Reach Fuchsia by the coastal routes or Cycling Road after obtaining the Poké Flute.'],
  'kanto-route-16':[2,'Reach Celadon. The grass north of the Cycling Road gate is accessible with Cut.'],
  'kanto-route-17':[2,'Wake Snorlax on Route 16 and bring the Bicycle.'],
  'kanto-route-18':[2,'Reach Cycling Road with the Bicycle or approach from Fuchsia.'],
  'fuchsia-city':[2,'Reach Fuchsia via the coast or Cycling Road after obtaining the Poké Flute.'],
  'kanto-safari-zone':[2,'Reach Fuchsia after obtaining the Poké Flute and pay the Safari Zone fee.'],
  'kanto-sea-route-19':[3,'Obtain Surf at the Safari Zone and defeat Koga.'],
  'kanto-sea-route-20':[3,'Obtain Surf at the Safari Zone and defeat Koga.'],
  'kanto-sea-route-21':[3,'Obtain Surf at the Safari Zone and defeat Koga.'],
  'seafoam-islands':[3,'Reach the islands with Surf after Koga. Use Strength and boulders for the lower water passages.'],
  'cinnabar-island':[3,'Obtain Surf at the Safari Zone and defeat Koga.'],
  'pokemon-mansion':[3,'Surf to Cinnabar Island after Koga. Mansion switches control access to lower rooms.'],
  'kanto-power-plant':[3,'Surf from Route 10 after obtaining the Soul Badge.'],
  'kanto-victory-road-2':[8,'Show all eight badges on Route 23. Use Strength to traverse Victory Road.'],
  'cerulean-cave':[10,'Enter the Hall of Fame, then Surf southwest from Route 24.']
 };
 const kantoRodGates={
  'old-rod':[1,'Get the Old Rod from the Vermilion City Fishing Guru.'],
  'good-rod':[2,'Get the Good Rod from the Fuchsia City Fishing Guru after opening the route to Fuchsia.'],
  'super-rod':[2,'Get the Super Rod from the Fishing Guru south of Snorlax on Route 12.']
 };
 function verifiedAreaRank(game,place){return isKanto(game)?kantoAreaGates[place.split(' · ')[0]]?.[0]:isJohto(game)?johtoAreaGates[place]?.[0]:null;}
 function kantoRoute(game,row){
  const [place,method,,,conditions=[]]=row;
  if(conditions.length)return null;
  const area=place.split(' · ')[0];
  const gate=kantoAreaGates[area];
  if(!gate)return null;
  const [rank,access]=gate;
  let methodGate=kantoRodGates[method],note=access;
  if(method==='surf')methodGate=[3,'Use Surf after defeating Koga.'];
  if(method==='pokeflute')methodGate=[2,'Rescue Mr. Fuji in Pokémon Tower to obtain the Poké Flute, then wake Snorlax.'];
  if(method==='static'&&!['cerulean-cave','seafoam-islands','kanto-power-plant','kanto-victory-road-2'].includes(area))return null;
  if(area==='seafoam-islands'&&(method==='static'||method==='surf'))methodGate=[4,'Use Strength with Erika’s Rainbow Badge to stop the currents.'];
  if(!methodGate&&!['walk','static'].includes(method))return null;
  if(methodGate)note=method==='pokeflute'?methodGate[1]:[access,methodGate[1]].filter(Boolean).join(' ');
  return {...early(Math.max(rank,methodGate?.[0]??0),placeName(place,game),method,note),source:'rby-location-story-and-method'};
 }
 const johtoAreaGates={
  'new-bark-town':[0],'cherrygrove-city':[0],'johto-route-29':[0],'johto-route-30':[0],
  'johto-route-31':[0],'johto-route-46':[0,'Enter the southern end from Route 29.'],
  'violet-city':[0],'sprout-tower':[0],'dark-cave · violet-city-entrance':[0,'Enter via Route 31.'],
  'johto-route-32':[1,'Defeat Falkner to head south from Violet City.'],
  'union-cave · 1f':[1,'Follow Route 32 south.'],
  'union-cave · b1f':[1,'Follow Route 32 south.'],
  'union-cave · b2f':[4,'Surf to the deepest room after defeating Morty.'],
  'johto-route-33':[1,'Pass through Union Cave.'],
  'azalea-town':[1,'Pass through Union Cave.'],
  'slowpoke-well · 1f':[1,'Speak to Kurt in Azalea and follow him to confront Team Rocket.'],
  'slowpoke-well · b1f':[4,'Clear Team Rocket, then use Strength and Surf.'],
  'ilex-forest':[2,'Rescue the Farfetch’d in Ilex Forest, then use Cut after Bugsy.'],
  'johto-route-34':[2,'Exit Ilex Forest after obtaining Cut.'],
  'goldenrod-city':[2,'Travel north from Ilex Forest through Route 34.'],
  'johto-route-35':[2,'Leave Goldenrod north through the gate.'],
  'national-park':[2,'Enter from Route 35 north of Goldenrod.'],
  'johto-route-36':[3,'Obtain the SquirtBottle after Whitney to remove Sudowoodo.'],
  'johto-route-37':[3,'Clear Sudowoodo with the SquirtBottle.'],
  'ecruteak-city':[3,'Clear Sudowoodo with the SquirtBottle.'],
  'burned-tower':[3,'Reach Ecruteak and enter the Burned Tower.'],
  'johto-route-38':[3,'Leave Ecruteak westward.'],'johto-route-39':[3,'Continue west of Ecruteak.'],
  'olivine-city':[3,'Follow Routes 38–39 from Ecruteak.'],
  'johto-sea-route-40':[4,'Use Surf after defeating Morty to cross from Olivine.'],
  'johto-sea-route-41':[4,'Use Surf after defeating Morty to cross from Olivine.'],
  'cianwood-city':[4,'Surf across Routes 40 and 41 from Olivine.'],
  'johto-route-42':[3,'Travel east from Ecruteak via Route 42.'],
  'mt-mortar · 1f':[3,'Enter Mt. Mortar from Route 42.'],
  'mt-mortar · lower-cave':[3,'Enter Mt. Mortar from Route 42.'],
  'mt-mortar · b1f':[4,'Use Surf to reach the inner cave.'],
  'mt-mortar · upper-cave':[8,'Use Surf and Waterfall after obtaining the Rising Badge.'],
  'johto-route-43':[3,'Go north from Mahogany Town.'],
  'lake-of-rage':[3,'Travel north of Mahogany Town via Route 43.'],
  'johto-route-44':[7,'Resolve the Goldenrod Radio Tower takeover after obtaining seven badges.'],
  'ice-path':[7,'Resolve the Goldenrod Radio Tower takeover, then continue east on Route 44.'],
  'blackthorn-city':[7,'Travel through Ice Path after freeing the Radio Tower.'],
  'johto-route-45':[7,'Exit Blackthorn southward.'],
  'dragons-den':[7,'Defeat Clair in Blackthorn and enter Dragon’s Den to complete her challenge.'],
  'dark-cave · blackthorn-city-entrance':[7,'Enter from Route 45 south of Blackthorn.'],
  'ruins-of-alph · outside':[0,'Enter from Route 36 south of Violet.'],
  'kanto-route-26':[8,'Use Surf and Waterfall through Tohjo Falls after Clair.'],
  'kanto-route-27':[8,'Use Surf and Waterfall through Tohjo Falls after Clair.'],
  'tohjo-falls':[8,'Use Surf and Waterfall after Clair to traverse the falls.'],
  'kanto-victory-road-1':[8,'Show eight Johto badges at the Pokémon League gate.'],
  'mt-silver':[10,'Earn all 16 badges, then speak to Professor Oak.'],
  'kanto-route-28':[10,'Earn all 16 badges and ask Oak for permission to access Mt. Silver.'],
  'digletts-cave':[10,'Restore the Power Plant, get the EXPN Card from the Lavender Radio Tower, then wake Snorlax with the Poké Flute station.'],
  'kanto-route-2':[10,'Open Diglett’s Cave by waking Snorlax with the Poké Flute station.'],
  'kanto-route-3':[10,'Wake Snorlax and reach Pewter via Diglett’s Cave.'],
  'mt-moon':[10,'Reach Pewter after waking Snorlax, then follow Route 3 east.'],
  'whirl-islands':[5,'Use Surf and Whirlpool after clearing the Mahogany Rocket Hideout and defeating Pryce.'],
  ...Object.fromEntries(['celadon-city','cerulean-city','cinnabar-island','fuchsia-city','pallet-town','vermilion-city',
   'viridian-city','rock-tunnel','kanto-route-1','kanto-route-4','kanto-route-5','kanto-route-6','kanto-route-7',
   'kanto-route-8','kanto-route-9','kanto-route-10','kanto-route-11','kanto-route-12','kanto-route-13','kanto-route-14',
   'kanto-route-15','kanto-route-16','kanto-route-17','kanto-route-18','kanto-route-22','kanto-route-24','kanto-route-25',
   'kanto-sea-route-19','kanto-sea-route-20','kanto-sea-route-21']
   .map(place=>[place,[10,'Enter the Hall of Fame and obtain the S.S. Ticket to reach postgame Kanto.']]))
 };
 const johtoMethods={
  surf:[4,'Get Surf after the Ecruteak Dance Theater battles and defeat Morty.'],
  'old-rod':[1,'Get the Old Rod at the Route 32 Pokémon Center.'],
  'good-rod':[3,'Get the Good Rod in Olivine City.'],
  'super-rod':[10,'Get the Super Rod on Route 12 in postgame Kanto.'],
  headbutt:[2,'Obtain Headbutt in Ilex Forest and use it on an eligible tree.'],
  'rock-smash':[3,'Remove Sudowoodo, then speak to the NPC east of its former spot for Rock Smash.']
 };
 const johtoSwarmContacts={
  'mt-mortar · 1f':[7,'Hiker Parry on Route 45'],
  'johto-route-35':[2,'Bug Catcher Arnie on Route 35'],
  'dark-cave · violet-city-entrance':[1,'Hiker Anthony on Route 33'],
  'johto-route-38':[3,'Schoolboy Chad on Route 38'],
  'johto-route-32':[1,'Fisher Ralph on Route 32'],
  'johto-route-44':[7,'Fisher Wilton on Route 44']
 };
 function johtoRoute(game,row){
  const [place,method,,,conditions=[]]=row;
  if(conditions.some(c=>!/^time-(morning|day|night)$|^weekday-friday$|^swarm-(no|yes)$/.test(c)))return null;
  const area=place.split(' · ')[0],gate=johtoAreaGates[place]||johtoAreaGates[area];
  if(!gate)return null;
  const [areaRank,areaNote]=gate;
  const field=johtoMethods[method.startsWith('headbutt-')?'headbutt':method];
  let milestone=areaRank,requirement=areaNote;
  if(method==='static'&&place==='union-cave · b2f'){
   requirement='Surf to the deepest room after Morty. Lapras appears on Fridays.';
  }else if(method==='static'&&place==='lake-of-rage'){
   milestone=4;requirement='Surf to the red Gyarados after defeating Morty.';
  }else if(method==='squirt-bottle'){
   requirement='Defeat Whitney, get the SquirtBottle and use it on Sudowoodo.';
  }else if(field){
   milestone=Math.max(milestone,field[0]);
   requirement=[areaNote,field[1]].filter(Boolean).join(' ');
  }else if(method!=='walk')return null;
  if(conditions.includes('swarm-yes')){
   const contact=johtoSwarmContacts[place];
   if(!contact)return null;
   milestone=Math.max(milestone,contact[0]);
   requirement=[requirement,'Register '+contact[1]+' and wait for a swarm call.'].filter(Boolean).join(' ');
  }
  const time=conditions.filter(c=>c.startsWith('time-')).map(c=>c.slice(5));
  return {...early(milestone,placeName(place,game),method,[requirement,time.length?'Time: '+time.join(', '):''].filter(Boolean).join(' ')),
   source:'gsc-location-story-and-method'};
 }
 function encounterRoute(game,row){
  if(isKanto(game))return kantoRoute(game,row);
  if(isJohto(game))return johtoRoute(game,row);
  if(!['Black','White','Black 2','White 2'].includes(game))return null;
  const sequel=game.endsWith(' 2'),[place,method, , ,conditions=[]]=row;
  if(conditions.some(c=>!/^season-(spring|summer|autumn|winter)$/.test(c)))return null;
  let rank,requirement='';
  if(['walk','dark-grass','grass-spots','cave-spots'].includes(method)){
   rank=(sequel?sequelLand:originalLand)[place];
  }else if(sequel&&method==='hidden-grotto'){
   rank=reviewedGrottos[place];requirement='Hidden Grotto encounter. Check after the Route 5 tutorial; spawns are random.';
  }else if(['surf','surf-spots','super-rod','super-rod-spots'].includes(method)){
   const area=(sequel?waterB2:waterBW)[place];
   if(area==null)return null;
   const fishing=method.startsWith('super-rod');
   rank=Math.max(area,fishing?10:sequel?5:6);
   requirement=fishing?'Requires Super Rod after the story clear.':'Requires Surf.';
  }
  if(rank==null)return null;
  if(place==='nature-sanctuary')requirement=[requirement,'Permit from Professor Juniper after seeing every non-mythical Unova Pokédex entry. Fly from Mistralton City with Skyla.'].filter(Boolean).join(' ');
  if(sequel&&place==='castelia-city')requirement='Castelia’s park is accessed from the top level of the sewers during the Plasma investigation.';
  if(place.startsWith('seaside-cave'))requirement=[requirement,'Story access from Route 21 after Marlon; Strength for parts of the basement.'].filter(Boolean).join(' ');
  if(place==='abundant-shrine')requirement=[requirement,'Requires Surf to reach the shrine area.'].filter(Boolean).join(' ');
  const name=placeName(place,game);
  const seasons=conditions.map(c=>c.slice(7)).join(', ');
  return {...early(rank,name,method,[requirement,seasons?'Season: '+seasons:''].filter(Boolean).join(' ')),source:sequel?'walkthrough-b2w2':'walkthrough-bw'};
 }
 function land(game,encounters){
  return (encounters||[]).map(row=>encounterRoute(game,row)).filter(Boolean).sort((a,b)=>a.rank-b.rank)[0]||null;
 }
 const title=name=>name.replace(/(^|-)[a-z]/g,m=>m.toUpperCase()).replace(/-/g,' ');
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
 // Individual machine gates and prerequisites cross-checked with the area's item table.
 const originalMachines={
  tm10:[null,'Show 115 seen entries in the Unova Pokédex to Professor Juniper'],
  tm17:[null,'Show 60 seen entries in the Unova Pokédex to Professor Juniper'],
  tm54:[null,'Show 25 seen entries in the Unova Pokédex to Professor Juniper'],
  tm01:[10,'Find Zinzolin in the postgame Seven Sages hunt'],tm02:[8],tm03:[10],
  tm04:[10,'Find Ryoku in the postgame Seven Sages hunt'],tm05:[8],
  tm06:[6,'Requires Surf to reach Route 17'],tm08:[10,'Find Giallo in the postgame Seven Sages hunt'],
  tm09:[10],tm12:[8],tm15:[7,'₽90,000'],tm19:[6,'Requires Surf to reach Route 18'],
  tm22:[2],tm30:[7,'Follow Team Plasma into Relic Castle after Dragonspiral Tower'],tm46:[1],
  tm24:[6,'Requires Surf to reach P2 Laboratory'],tm29:[10,'Requires Surf'],
  tm31:[6],tm32:[10,'Find Rood in the postgame Seven Sages hunt'],tm35:[10,'Requires Surf to reach Abundant Shrine'],
  tm36:[7],tm40:[6,'Talk to the Youngster after defeating Skyla'],tm41:[2],tm42:[7],
  tm43:[7,'Talk to the Battle Girl'],tm44:[2,'Talk to the Hiker on 11F'],tm45:[2,'Talk to the School Kid on 47F'],
  tm47:[6,'Requires Surf'],tm49:[3,'Talk to the owner in the Musical Theater'],tm50:[10],
  tm52:[6,'Requires Surf'],tm53:[10],tm56:[7],tm57:[5,'Talk to the Battle Girl'],tm58:[5],
  tm61:[5],tm63:[6,'Requires Surf'],tm65:[5],tm66:[4,'Requires Strength'],
  tm68:[7,'₽90,000'],tm69:[10,'Find Bronius in the postgame Seven Sages hunt'],
  tm70:[2,'Talk to the man behind the dumpster'],tm71:[10],tm75:[10,'Find Gorm in the postgame Seven Sages hunt'],
  tm80:[6,'Requires Surf to reach Mistralton Cave'],tm81:[5],tm84:[6,'Requires Surf'],
  tm85:[10,'Enter the Dreamyard ruins'],tm86:[2],tm89:[10],
  tm90:[6,'Winter only'],tm91:[6],tm92:[10,'Requires Surf'],tm93:[8],tm94:[1]
 };
 const sequelMachines={
  tm01:[9],tm02:[10],tm03:[8,'Defeat Ghetsis in the Giant Chasm'],
  tm05:[9],tm06:[8,'Requires Strength and access from B1F'],tm12:[9,'Requires Cut and Strength'],
  tm15:[6,'₽90,000'],tm19:[10],tm22:[10],tm29:[6,'Requires Surf'],
  tm30:[6,'Behind the Strange House'],tm35:[9,'Requires Surf to reach the eastern house'],tm36:[10],
  tm39:[3,'Enter the Desert Resort side of Relic Castle'],tm40:[6,'Talk to the Youngster after defeating Skyla'],
  tm41:[5,'Requires Surf and seasonal water in spring or summer'],tm42:[7,'Talk to the Parasol Lady at the Humilau exit'],
  tm43:[10,'Talk to the Battle Girl'],tm44:[2,'Talk to the Guitarist on 11F'],tm45:[2,'Talk to the School Kid on 47F'],
  tm47:[10],tm49:[3,'Talk to the owner in the Musical Theater'],tm50:[10,'Enter N’s Castle after the League'],
  tm52:[10,'Requires Surf'],tm56:[5,'Requires Surf'],tm57:[6,'Talk to the woman in the southwest house'],
  tm58:[5],tm61:[5],tm63:[4,'Enter the Driftveil Market from the left'],tm65:[5],
  tm66:[3,'Requires Strength'],tm68:[6,'₽90,000'],tm69:[6,'Use the version-specific dead-end tunnel'],
  tm70:[2,'Talk to the man behind the dumpster'],tm71:[10],tm81:[5],
  tm84:[10,'Requires Strength'],tm85:[10,'Requires Cut'],tm86:[10],tm90:[10],
  tm91:[10],tm92:[10,'Requires Surf to reach Abundant Shrine'],tm95:[3,'Talk to the Backpacker in the northern forest']
 };
 function machineGate(game,item){
  if(game==='Black 2'||game==='White 2')return sequelMachines[item];
  if(game==='Black'||game==='White')return originalMachines[item];
 }
 function hidden(game,name,ability){
  if((game==='Black 2'||game==='White 2')&&name==='minccino'&&ability==='skill-link')
   return 'Route 5 Hidden Grotto · Bianca’s tutorial after Elesa.';
  return '';
 }
 const fossils={omanyte:'Helix Fossil',kabuto:'Dome Fossil',aerodactyl:'Old Amber',lileep:'Root Fossil',
  anorith:'Claw Fossil',cranidos:'Skull Fossil',shieldon:'Armor Fossil'};
 const sequelStatics={
  cobalion:[6,'Route 13','Level 45 on the main route above the cuttable trees.'],
  virizion:[6,'Route 11','Level 45 on the first visit.'],
  terrakion:[8,'Route 22','Level 45 after defeating Marlon.'],
  haxorus:[10,'Nature Preserve','Shiny Lv 60 encounter. Requires the Permit from Professor Juniper and a flight from Mistralton City.'],
  uxie:[10,'Nacrene City','Speak to Juniper in the Cave of Being after becoming Champion; find Uxie near the museum.'],
  mesprit:[10,'Celestial Tower','Speak to Juniper in the Cave of Being after becoming Champion; find Mesprit on the top floor.'],
  azelf:[10,'Route 23','Speak to Juniper in the Cave of Being after becoming Champion; find Azelf on Route 23.'],
  heatran:[10,'Reversal Mountain','Bring the Magma Stone from postgame Route 18 to the lowest floor.'],
  cresselia:[10,'Marvelous Bridge','Bring the Lunar Wing from the Strange House.'],
  regirock:[10,'Underground Ruins','Enter from Clay Tunnel, then solve the floor-switch puzzle.'],
  regigigas:[10,'Twist Mountain','Bring Regirock, Regice and Registeel in the party. One key normally comes from the opposite version.']
 };
 const sequelReviewed={
  aron:early(5,'Mistralton Cave','walk','Requires Surf to reach the cave from Route 6.'),
  axew:early(5,'Mistralton Cave','walk','Requires Surf to reach the cave from Route 6.'),
  shuckle:early(8,'Seaside Cave','walk','Basement encounter. Requires Strength to navigate the route.'),
  ducklett:early(4,'Driftveil Drawbridge','bridge-spots','Check the moving shadows after Elesa.'),
 };
 const sequelLevels={
  lairon:['aron',32],aggron:['aron',42],fraxure:['axew',38],
  electabuzz:['elekid',30],magmar:['magby',30],darmanitan:['darumaka',35],
  cofagrigus:['yamask',34],swanna:['ducklett',35],swoobat:['woobat','High friendship'],
  archeops:['archen',37],carracosta:['tirtouga',37]
 };
 // Unconditional level evolutions in PokeAPI pokemon_evolution.csv, through generation V.
 // Version-specific, branching and additional-trigger cases use the individual rules above.
 const auditedLevelEvolutions={
  2:16,3:32,5:16,6:36,8:16,9:36,11:7,12:10,14:7,15:10,17:18,18:36,
  20:20,22:20,24:22,28:22,30:16,33:16,42:22,44:21,47:24,49:31,51:26,53:28,
  55:33,57:28,61:25,64:16,67:28,70:21,73:30,75:25,78:40,80:37,82:30,85:31,
  87:34,89:38,93:25,97:26,99:28,101:30,105:28,110:35,112:42,117:32,119:33,124:30,
  125:30,126:30,130:20,139:40,141:40,148:30,149:55,153:16,154:32,156:14,157:36,159:18,
  160:30,162:15,164:20,166:18,168:22,171:27,178:25,180:15,181:30,184:18,188:18,189:27,
  195:20,202:15,205:31,210:23,217:30,219:38,221:33,224:25,229:24,232:25,247:30,248:55,
  253:16,254:36,256:16,257:36,259:16,260:36,262:18,264:20,267:10,269:10,271:14,274:14,
  277:22,279:25,281:20,282:30,284:22,286:23,288:18,289:36,291:20,294:20,295:40,297:24,
  305:32,306:42,308:37,310:26,317:26,319:30,321:40,323:33,326:32,329:35,330:45,332:32,
  334:35,340:30,342:30,344:36,346:40,348:40,354:37,356:37,362:42,364:32,365:44,372:30,
  373:50,375:20,376:45,388:18,389:32,391:14,392:36,394:16,395:36,397:14,398:34,400:15,
  402:10,404:15,405:30,409:30,411:30,419:26,421:25,426:28,432:38,435:34,437:33,444:24,
  445:48,450:34,452:40,454:37,457:31,460:40,496:17,497:36,499:17,500:36,502:17,503:36,
  505:20,507:16,508:32,510:20,520:21,521:32,523:27,525:25,530:31,533:25,536:25,537:36,
  541:20,544:22,545:30,552:29,553:40,555:35,558:34,560:39,563:34,565:37,567:37,569:36,
  571:30,575:32,576:41,578:32,579:41,581:35,583:35,584:47,591:39,593:40,596:36,598:40,
  600:38,601:49,603:39,606:42,608:41,611:38,612:48,614:37,620:50,623:43,625:52,628:54,
  630:54,634:50,635:64,637:59,
 };
 const catalogIndexes=new WeakMap();
 function levelPath(game,id,pack,owned){
  if((!isJohto(game)&&!isKanto(game)&&!['Black','White','Black 2','White 2'].includes(game))||!pack?.mons||!auditedLevelEvolutions[id])return null;
  if(!catalogIndexes.has(pack)){
   const rows=new Map(pack.mons.map(row=>[row[0],row]));
   const counts=new Map();
   for(const row of rows.values())counts.set(row[4],(counts.get(row[4])||0)+1);
   catalogIndexes.set(pack,{rows,counts});
  }
  const {rows,counts}=catalogIndexes.get(pack);
  const parent=rows.get(rows.get(id)?.[4]),parentId=parent?.[0];
  if(!parentId||counts.get(parentId)!==1)return null;
  const initial=lookup(game,parent[1],pack.entries?.[parentId])||levelPath(game,parentId,pack,owned);
  const ownedParent=owned?.find(p=>Number(p?.id)===parentId);
  if(!initial?.confirmed&&!ownedParent)return null;
  const requirement='Level '+auditedLevelEvolutions[id];
  const place=initial?.place;
  const rank=initial?.confirmed?initial.rank:0;
  return {...early(rank,place,'evolution',requirement),path:{stage:title(parent[1]),initial:initial?.confirmed?initial:{method:'already owned',rank},requirement},
   source:'pokeapi-unconditional-level-evolution'};
 }
 const versionFamilies={
  Black:['solosis','duosion','reuniclus','elekid','electabuzz','electivire','magby','magmar','magmortar','budew','slakoth'],
  White:['gothita','gothorita','gothitelle'],
  'Black 2':['solosis','duosion','reuniclus','elekid','electabuzz','electivire','skitty','delcatty','numel','camerupt'],
  'White 2':['gothita','gothorita','gothitelle','magby','magmar','magmortar','buneary','lopunny','spoink','grumpig']
 };
 const sequelEggFamilies={
  beldum:'Metang or Metagross',blitzle:'Zebstrika',budew:'Roselia or Roserade holding a Rose Incense',
  cleffa:'Clefairy or Clefable',deino:'Zweilous or Hydreigon',golett:'Golurk',igglybuff:'Jigglypuff or Wigglytuff',
  larvesta:'Volcarona',larvitar:'Pupitar or Tyranitar',shuppet:'Banette',slakoth:'Vigoroth or Slaking',
  swinub:'Piloswine or Mamoswine',tympole:'Palpitoad or Seismitoad',vanillite:'Vanillish or Vanilluxe',wingull:'Pelipper'
 };
 const moveStoneEvolution=(rank,stage,initial,requirement,resource,level=0)=>({
  ...early(rank,initial.place,'evolution',stage+' · '+requirement),
  path:{stage,initial,requirement,resource,level},source:'unova-item-and-evolution'
 });
 const originalSwarms={
  "farfetchd":["Route 1", ""],
  "wynaut":["Route 2", ""],
  "volbeat":["Route 3", "Black"],
  "illumise":["Route 3", "White"],
  "hippopotas":["Route 4", ""],
  "smeargle":["Route 5", ""],
  "plusle":["Route 6", "Black"],
  "minun":["Route 6", "White"],
  "sentret":["Route 7", ""],
  "croagunk":["Route 8", ""],
  "houndour":["Route 9", "Black"],
  "poochyena":["Route 9", "White"],
  "tyrogue":["Route 10", ""],
  "shroomish":["Route 11", "Black"],
  "paras":["Route 11", "White"],
  "doduo":["Route 12", ""],
  "shuppet":["Route 13", ""],
  "yanma":["Route 14", ""],
  "mankey":["Route 15", ""],
  "pineco":["Route 16", ""],
  "exeggcute":["Route 18", ""],
 };
 const sequelSwarms={
  "farfetchd":["Route 1", ""],
  "volbeat":["Route 3", "Black 2"],
  "illumise":["Route 3", "White 2"],
  "natu":["Route 5", ""],
  "plusle":["Route 6", "Black 2"],
  "minun":["Route 6", "White 2"],
  "furret":["Route 7", ""],
  "quagsire":["Route 8", ""],
  "swalot":["Route 9", ""],
  "masquerain":["Route 11", ""],
  "doduo":["Route 12", ""],
  "swellow":["Route 13", ""],
  "fearow":["Route 15", ""],
  "pineco":["Route 16", ""],
  "hoppip":["Route 18", ""],
  "sudowoodo":["Route 20", "Black 2"],
  "mr-mime":["Route 20", "White 2"],
  "ariados":["Route 22", "Black 2"],
  "ledian":["Route 22", "White 2"],
  "hypno":["Dreamyard", ""],
  "hippowdon":["Desert Resort", ""],
  "slowpoke":["Abundant Shrine", ""],
  "cacturne":["Reversal Mountain", ""],
 };
 const whiteForestResidents={
  "pidgey":["grass", "Leo"],
  "nidoran-f":["grass", "Jacques"],
  "nidoran-m":["grass", "Ken"],
  "oddish":["grass", "Lynette"],
  "abra":["grass", "Collin"],
  "machop":["grass", "Ryder"],
  "bellsprout":["grass", "Piper"],
  "magnemite":["grass", "Marie"],
  "gastly":["grass", "Dave"],
  "rhyhorn":["grass", "Shane"],
  "porygon":["grass", "Herman"],
  "togepi":["grass", "Miki"],
  "mareep":["grass", "Pierce"],
  "hoppip":["grass", "Britney"],
  "elekid":["grass", "Robbie"],
  "magby":["grass", "Vincent"],
  "wurmple":["grass", "Silvia"],
  "lotad":["grass", "Ralph"],
  "seedot":["grass", "Miho"],
  "ralts":["grass", "Lena"],
  "slakoth":["grass", "Karenna"],
  "whismur":["grass", "Rosa"],
  "azurill":["grass", "Molly"],
  "aron":["grass", "Gene"],
  "trapinch":["grass", "Eliza"],
  "bagon":["grass", "Grace"],
  "starly":["grass", "Carlos"],
  "shinx":["grass", "Doug"],
  "budew":["grass", "Frederic"],
  "happiny":["grass", "Emi"],
  "wooper":["surf", "Lena, Frederic, Herman, Grace"],
  "surskit":["surf", "Leo, Silvia, Dave, Britney, Robbie, Miki, Lynette, Pierce, Gene, Piper, Miho, Shane, Ralph"],
  "corphish":["surf", "Vincent, Carlos, Ken, Emi"],
 };
 const originalUnovaTransfer=new Set([
  1,2,3,4,5,6,7,8,9,23,24,25,26,50,51,52,53,58,59,72,
  73,88,89,96,97,100,101,109,110,122,123,128,133,134,135,136,144,145,146,150,
  151,152,153,154,155,156,157,158,159,160,172,177,178,185,190,194,195,196,197,201,
  203,209,210,212,216,217,218,219,227,231,232,241,243,244,245,249,250,251,252,253,
  254,255,256,257,258,259,260,263,264,290,291,292,296,297,299,300,301,307,308,309,
  310,316,317,322,323,324,325,326,327,331,332,351,352,355,356,361,362,377,378,379,
  380,381,382,383,384,385,386,387,388,389,390,391,392,393,394,395,412,413,414,417,
  422,423,424,427,428,431,432,434,435,438,439,441,442,443,444,445,451,452,455,459,
  460,470,471,476,477,478,480,481,482,483,484,485,486,487,488,489,490,491,492,493,
 ]);
 const sequelUnovaTransfer=new Set([
  1,2,3,4,5,6,7,8,9,16,17,18,23,24,25,26,43,44,45,46,
  47,50,51,66,67,68,69,70,71,72,73,74,75,76,77,78,92,93,94,100,
  101,102,103,104,105,106,107,115,123,124,128,137,144,145,146,150,151,152,153,154,
  155,156,157,158,159,160,172,182,200,201,212,218,219,228,229,233,234,235,236,237,
  238,241,243,244,245,249,250,251,252,253,254,255,256,257,258,259,260,261,262,263,
  264,265,266,267,268,269,290,291,292,293,294,295,324,355,356,358,361,362,382,383,
  384,385,386,387,388,389,390,391,392,393,394,395,396,397,398,401,402,403,404,405,
  412,413,414,420,421,429,433,459,460,474,477,478,483,484,487,489,490,491,492,493,
  494,641,642,645,647,648,649,
 ]);
 const namedTransferEvidence={
  "Black 2":new Set(["beautifly", "beedrill", "bellossom", "bidoof", "blissey", "bonsly", "breloom", "butterfree", "cacnea", "cascoon", "caterpie", "chansey", "cherubi", "chingling", "cubone", "drowzee", "dustox", "electrike", "exeggutor", "exploud", "gallade", "gardevoir", "gastrodon", "gengar", "geodude", "gloom", "golem", "gulpin", "haunter", "hippopotas", "hitmonchan", "hitmonlee", "hitmontop", "honchkrow", "houndoom", "jumpluff", "kakuna", "kirlia", "kricketot", "ledyba", "lombre", "lotad", "loudred", "ludicolo", "luxio", "luxray", "machamp", "machoke", "makuhita", "masquerain", "meditite", "metapod", "mightyena", "mime-jr", "misdreavus", "mismagius", "munchlax", "murkrow", "nidoking", "nidoqueen", "nidorina", "nidorino", "parasect", "pidgeot", "pidgeotto", "ponyta", "porygon-z", "porygon2", "rhydon", "rhyperior", "salamence", "sentret", "shelgon", "shroomish", "silcoon", "skiploom", "slowbro", "slowking", "smoochum", "snorlax", "snubbull", "spearow", "spinarak", "staraptor", "staravia", "surskit", "taillow", "togekiss", "togetic", "venonat", "victreebel", "vileplume", "weedle", "weepinbell", "wooper", "wynaut"]),
  "White 2":new Set(["beautifly", "beedrill", "bellossom", "bidoof", "blissey", "bonsly", "breloom", "butterfree", "cacnea", "cascoon", "caterpie", "chansey", "cherubi", "chingling", "cubone", "drowzee", "dustox", "electrike", "exeggutor", "exploud", "gallade", "gardevoir", "gastrodon", "gengar", "geodude", "gloom", "golem", "gulpin", "haunter", "hippopotas", "hitmonchan", "hitmonlee", "hitmontop", "honchkrow", "houndoom", "jumpluff", "kakuna", "kirlia", "kricketot", "ledyba", "lombre", "lotad", "loudred", "ludicolo", "luxio", "luxray", "machamp", "machoke", "makuhita", "masquerain", "meditite", "metapod", "mightyena", "mime-jr", "misdreavus", "mismagius", "munchlax", "murkrow", "nidoking", "nidoqueen", "nidorina", "nidorino", "parasect", "pidgeot", "pidgeotto", "ponyta", "porygon-z", "porygon2", "rhydon", "rhyperior", "salamence", "sentret", "shelgon", "shroomish", "silcoon", "skiploom", "slowbro", "slowking", "smoochum", "snorlax", "snubbull", "spearow", "spinarak", "staraptor", "staravia", "surskit", "taillow", "togekiss", "togetic", "venonat", "victreebel", "vileplume", "weedle", "weepinbell", "wooper", "wynaut"]),
  "Black":new Set(["abra", "aggron", "aipom", "alakazam", "ampharos", "azumarill", "beautifly", "bellossom", "blissey", "bonsly", "butterfree", "cacnea", "cascoon", "caterpie", "chansey", "crawdaunt", "drowzee", "dustox", "electrike", "exploud", "flaaffy", "flygon", "gallade", "gardevoir", "gastrodon", "gengar", "gloom", "gulpin", "haunter", "jumpluff", "kadabra", "kirlia", "lairon", "lombre", "lotad", "loudred", "ludicolo", "luxio", "luxray", "machamp", "machoke", "magneton", "magnezone", "makuhita", "marill", "masquerain", "meditite", "metapod", "mightyena", "mime-jr", "misdreavus", "mismagius", "nidoking", "nidoqueen", "nidorina", "nidorino", "nuzleaf", "parasect", "pidgeot", "pidgeotto", "porygon-z", "porygon2", "rhydon", "rhyperior", "roselia", "roserade", "salamence", "seedot", "shelgon", "shiftry", "silcoon", "skiploom", "slaking", "snubbull", "staraptor", "staravia", "surskit", "togekiss", "togetic", "vibrava", "victreebel", "vigoroth", "vileplume", "weepinbell", "wooper"]),
  "White":new Set(["aipom", "beedrill", "bonsly", "breloom", "cacnea", "drowzee", "electrike", "gastrodon", "gulpin", "honchkrow", "houndoom", "kakuna", "makuhita", "meditite", "mime-jr", "murkrow", "shroomish", "snubbull", "weedle"]),
 };
 const documentedBreeding={
  "Black 2":{
   "abra":["Kadabra", "Alakazam"],
   "aipom":["Ambipom"],
   "beldum":["Metang", "Metagross"],
   "cleffa":["Clefairy", "Clefable"],
   "drifloon":["Drifblim"],
   "hoothoot":["Noctowl"],
   "igglybuff":["Jigglypuff", "Wigglytuff"],
   "larvitar":["Pupitar", "Tyranitar"],
   "seedot":["Nuzleaf", "Shiftry"],
   "swinub":["Piloswine", "Mamoswine"],
  },
  "White 2":{
   "abra":["Kadabra", "Alakazam"],
   "aipom":["Ambipom"],
   "beldum":["Metang", "Metagross"],
   "cleffa":["Clefairy", "Clefable"],
   "drifloon":["Drifblim"],
   "hoothoot":["Noctowl"],
   "igglybuff":["Jigglypuff", "Wigglytuff"],
   "larvitar":["Pupitar", "Tyranitar"],
   "seedot":["Nuzleaf", "Shiftry"],
   "swinub":["Piloswine", "Mamoswine"],
  },
  "Black":{
   "baltoy":["Claydol"],
   "beldum":["Metang", "Metagross"],
   "bidoof":["Bibarel"],
   "bronzor":["Bronzong"],
   "cherubi":["Cherrim"],
   "chingling":["Chimecho"],
   "cleffa":["Clefairy", "Clefable"],
   "cubone":["Marowak"],
   "drifloon":["Drifblim"],
   "geodude":["Graveler", "Golem"],
   "hoothoot":["Noctowl"],
   "igglybuff":["Jigglypuff", "Wigglytuff"],
   "kricketot":["Kricketune"],
   "larvitar":["Pupitar", "Tyranitar"],
   "ledyba":["Ledian"],
   "ponyta":["Rapidash"],
   "psyduck":["Golduck"],
   "rattata":["Raticate"],
   "sandshrew":["Sandslash"],
   "smoochum":["Jynx"],
   "spearow":["Fearow"],
   "spinarak":["Ariados"],
   "swablu":["Altaria"],
   "swinub":["Piloswine", "Mamoswine"],
   "taillow":["Swellow"],
   "venonat":["Venomoth"],
   "weedle":["Kakuna", "Beedrill"],
   "zubat":["Golbat", "Crobat"],
  },
  "White":{
   "baltoy":["Claydol"],
   "beldum":["Metang", "Metagross"],
   "bidoof":["Bibarel"],
   "bronzor":["Bronzong"],
   "caterpie":["Metapod", "Butterfree"],
   "cherubi":["Cherrim"],
   "chingling":["Chimecho"],
   "cleffa":["Clefairy", "Clefable"],
   "cubone":["Marowak"],
   "drifloon":["Drifblim"],
   "geodude":["Graveler", "Golem"],
   "hoothoot":["Noctowl"],
   "igglybuff":["Jigglypuff", "Wigglytuff"],
   "kricketot":["Kricketune"],
   "larvitar":["Pupitar", "Tyranitar"],
   "ledyba":["Ledian"],
   "ponyta":["Rapidash"],
   "psyduck":["Golduck"],
   "rattata":["Raticate"],
   "sandshrew":["Sandslash"],
   "smoochum":["Jynx"],
   "spearow":["Fearow"],
   "spinarak":["Ariados"],
   "swablu":["Altaria"],
   "swinub":["Piloswine", "Mamoswine"],
   "taillow":["Swellow"],
   "venonat":["Venomoth"],
   "zubat":["Golbat", "Crobat"],
  },
 };
 const lateIncense={
  azurill:'Sea Incense',wynaut:'Lax Incense',budew:'Rose Incense',chingling:'Pure Incense',happiny:'Luck Incense',
  'mime-jr':'Odd Incense',bonsly:'Rock Incense',mantyke:'Wave Incense',munchlax:'Full Incense'
 };
 const documentedEvolutions={
  exeggutor:['Exeggcute','Use a Leaf Stone','leaf-stone'],hitmonlee:['Tyrogue','Reach Lv 20 with Attack higher than Defense',null,20],
  hitmonchan:['Tyrogue','Reach Lv 20 with Defense higher than Attack',null,20],hitmontop:['Tyrogue','Reach Lv 20 with Attack equal to Defense',null,20],
  snorlax:['Munchlax','Level up with high friendship'],togetic:['Togepi','Level up with high friendship'],
  togekiss:['Togetic','Use a Shiny Stone','shiny-stone'],blissey:['Chansey','Level up with high friendship'],
  chansey:['Happiny','Level up during daylight while holding an Oval Stone'],nidoqueen:['Nidorina','Use a Moon Stone','moon-stone'],
  nidoking:['Nidorino','Use a Moon Stone','moon-stone'],vileplume:['Gloom','Use a Leaf Stone','leaf-stone'],
  victreebel:['Weepinbell','Use a Leaf Stone','leaf-stone'],bellossom:['Gloom','Use a Sun Stone','sun-stone'],
  kadabra:['Abra','Evolve at Lv 16',null,16],azumarill:['Marill','Evolve at Lv 18',null,18],
  gardevoir:['Kirlia','Evolve at Lv 30',null,30],marill:['Azurill','Level up with high friendship'],silcoon:['Wurmple','Reach Lv 7. The result depends on Wurmple’s internal value',null,7],
  cascoon:['Wurmple','Reach Lv 7. The result depends on Wurmple’s internal value',null,7],
  beautifly:['Silcoon','Reach Lv 10',null,10],dustox:['Cascoon','Reach Lv 10',null,10],
  ludicolo:['Lombre','Use a Water Stone','water-stone'],shiftry:['Nuzleaf','Use a Leaf Stone','leaf-stone'],
  roselia:['Budew','Level up with high friendship during daylight'],roserade:['Roselia','Use a Shiny Stone','shiny-stone'],
  gallade:['Kirlia','Use a Dawn Stone on a male Kirlia','dawn-stone'],lucario:['Riolu','Level up with high friendship during daylight'],
  lickilicky:['Lickitung','Level up while it knows Rollout'],yanmega:['Yanma','Level up while it knows Ancient Power'],
  magnezone:['Magneton','Level up in Chargestone Cave'],weavile:['Sneasel','Level up at night holding a Razor Claw','razor-claw']
 };
 function documentedUnovaAlternative(game,name,pack,seen=new Set()){
  if(seen.has(name))return null;
  const ancestry=new Set([...seen,name]);
  if(!pack?.mons||!['Black','White','Black 2','White 2'].includes(game))return null;
  const starters=new Set(['snivy','tepig','oshawott']);
  if(starters.has(name))return null;
  const nativeRoute=label=>{
   const key=label.toLowerCase().replaceAll(' ','-');
   const mon=pack.mons.find(row=>row[1]===key);
   if(!mon)return null;
   const found=lookup(game,key,pack.entries?.[mon[0]])||levelPath(game,mon[0],pack,[]);
   if(found?.confirmed)return found;
   const inherited=documentedUnovaAlternative(game,key,pack,ancestry);
   return inherited?.confirmed?inherited:null;
  };
  function breedRoute(parents,baby){
   const initial=parents.map(nativeRoute).filter(Boolean).sort((a,b)=>a.rank-b.rank)[0];
   if(!initial)return null;
   const sequel=game.endsWith(' 2');
   const incense=lateIncense[baby];
   const gate=sequel?'Enter the Hall of Fame to reach the Day Care.':'Help the Day-Care Man in Nimbasa City and obtain the Bike to unlock breeding.';
   return {...early(Math.max(initial.rank,sequel||incense?10:3),'Route 3 · Day Care','breeding',
    'Breed '+parents.join(' or ')+(incense?' with the compatible parent holding '+incense+' from Driftveil Market':'')+'. '+gate),
    source:'pokemondb-species-and-unova-day-care'};
  }
  const entry=documentedBreeding[game]?.[name];
  if(entry)return breedRoute(entry,name);
  if(!game.endsWith(' 2')||name==='kadabra'){
   const evo=documentedEvolutions[name];
   if(evo&&!namedTransferEvidence[game]?.has(name)){
    const [parent,condition,item,level]=evo,initial=nativeRoute(parent);
    if(initial){
     const earliestItem=item?{ 'leaf-stone':5,'moon-stone':3,'sun-stone':3,'water-stone':4,
      'shiny-stone':5,'dawn-stone':6,'razor-claw':10 }[item]||0:0;
     return moveStoneEvolution(Math.max(initial.rank,earliestItem),parent,initial,condition,item,level||0);
    }
   }
  }
  const tradeEvolutions={alakazam:'Kadabra',golem:'Graveler',machamp:'Machoke',gengar:'Haunter',
   porygon2:'Porygon holding an Up-Grade','porygon-z':'Porygon2 holding a Dubious Disc',
   rhyperior:'Rhydon holding a Protector',steelix:'Onix holding a Metal Coat',
   huntail:'Clamperl holding a Deep Sea Tooth',gorebyss:'Clamperl holding a Deep Sea Scale'};
  return tradeEvolutions[name]&&!namedTransferEvidence[game]?.has(name)?{kind:'trade',reason:'Trade '+tradeEvolutions[name]+' to evolve.',source:'pokemondb-species-and-evolution'}:null;
 }
 function transferOnly(game,id,name){
  const original=game==='Black'||game==='White';
  const sequel=game==='Black 2'||game==='White 2';
  const entries=original?originalUnovaTransfer:sequel?sequelUnovaTransfer:null;
  if(game==='Black'&&whiteForestResidents[name]){
   return {kind:'trade',reason:'This route uses the resident encounter table exclusive to White Forest in Pokémon White.',source:'white-forest-residents'};
  }
  if(namedTransferEvidence[game]?.has(name)){
   return {kind:'trade',reason:'The game-specific acquisition catalog lists trade or migration for this species.',source:'pokemondb-version-acquisition'};
  }
  if(!entries?.has(Number(id)))return null;
  return {kind:'trade',reason:'Transfer from a compatible game or use a supported historical tie-in. No native route is listed for this version pair.',
   source:original?'serebii-bw-transfer-catalog':'serebii-b2w2-transfer-catalog'};
 }
 const yancyTrades=new Set(['meowth','wobbuffet','ralts','shieldon','rhyhorn','shellos','mawile','spiritomb','snorlax','teddiursa','spinda','togepi']);
 const curtisTrades=new Set(['mankey','wobbuffet','ralts','cranidos','rhyhorn','shellos','sableye','spiritomb','snorlax','phanpy','spinda','togepi']);
 function droppedItemTrade(name){
  const yancy=yancyTrades.has(name),curtis=curtisTrades.has(name);
  if(!yancy&&!curtis)return null;
  const who=yancy&&curtis?'Yancy or Curtis':yancy?'Yancy (male player)':'Curtis (female player)';
  return {...early(10,'Nimbasa City','in-game trade','After the League, return the Dropped Item and complete the Xtransceiver calls and Ferris Wheel sequence. Trade any Pokémon to '+who+' for its daily offer.'),
   source:'serebii-b2w2-dropped-item-trades'};
 }
 function recentUnovaRoute(game,name){
  const sequel=game.endsWith(' 2');
  if(versionFamilies[game]?.includes(name))return {kind:'trade',reason:'Trade or transfer this family from a compatible game with a native route.'};
  if(sequel&&sequelEggFamilies[name]){
   return {...early(10,'Route 3 · Day Care','breeding','Breed '+sequelEggFamilies[name]+'. The Day Care opens after entering the Hall of Fame.'),
    source:'unova-day-care-and-species-catalog'};
  }
  if(['keldeo-ordinary','meloetta-aria','genesect'].includes(name)||sequel&&name==='victini'){
   return {kind:'event',reason:'Requires an official event Pokémon or transfer from a compatible game with the distribution.'};
  }
  if(sequel&&['tornadus-incarnate','thundurus-incarnate','landorus-incarnate'].includes(name)){
   return {kind:'event',reason:'Obtain the Therian Forme through Pokémon Dream Radar or trade. Use the Reveal Glass obtained at Abundant Shrine to change form.'};
  }
  const tradeEvolutions={conkeldurr:'Gurdurr',escavalier:'Karrablast for Shelmet',accelgor:'Shelmet for Karrablast'};
  if(tradeEvolutions[name])return {kind:'trade',reason:'Trade '+tradeEvolutions[name]+' to evolve.'};
  if(['electivire','magmortar'].includes(name)){
   const item=name==='electivire'?'Electirizer':'Magmarizer';
   return {kind:'trade',reason:'Trade '+(name==='electivire'?'Electabuzz':'Magmar')+' holding the '+item+'. '+
    (sequel?'A native copy is aboard the Plasma Frigate in '+(name==='electivire'?'White 2':'Black 2')+'; Join Avenue has an alternate source.':
     'Route 13 supplies the item in the postgame.')};
  }
  if(sequel&&['espeon','umbreon','leafeon','glaceon'].includes(name)){
   const requirements={espeon:'Level up with high friendship during the day',umbreon:'Level up with high friendship at night',
    leafeon:'Level up near the Moss Rock in postgame Pinwheel Forest',glaceon:'Level up near the Ice Rock in postgame Twist Mountain'};
   const requirement=requirements[name];
   return {...early(['leafeon','glaceon'].includes(name)?10:2,bw2.eevee.place,'evolution',requirement),
    path:{stage:'Eevee',initial:bw2.eevee,requirement},source:'unova-eevee-evolution'};
  }
  if(sequel&&name==='probopass'){
   const initial=early(5,'Chargestone Cave','walk','After Clay, reach the cave via Route 6.');
   return {...early(5,initial.place,'evolution','Level up Nosepass in Chargestone Cave.'),
    path:{stage:'Nosepass',initial,requirement:'Level up in Chargestone Cave'},source:'chargestone-cave'};
  }
  if(sequel&&name==='weavile'){
   const initial=early(8,'Giant Chasm','walk','Follow the Plasma Frigate story into Giant Chasm after Marlon.');
   return moveStoneEvolution(8,'Sneasel',initial,'Level up at night holding a Razor Claw (8 BP at the PWT or find it in Giant Chasm)','razor-claw');
  }
  if(!sequel&&name==='swoobat'){
   const initial=bw.woobat;
   return {...early(1,initial.place,'evolution','Raise Woobat’s friendship, then level it up.'),
    path:{stage:'Woobat',initial,requirement:'Level up with high friendship'},source:'woobat-evolution'};
  }
  if(name==='eelektross'){
   const initial=early(5,'Chargestone Cave','walk','Catch Tynamo in Chargestone Cave after Clay.');
   return moveStoneEvolution(5,'Tynamo',initial,'Evolve at Lv 39, then use a Thunder Stone from Chargestone Cave','thunder-stone',39);
  }
  if(name==='chandelure'){
   const initial=early(5,'Celestial Tower','walk','Catch Litwick in Celestial Tower.');
   return moveStoneEvolution(6,'Litwick',initial,'Evolve at Lv 41, then use a Dusk Stone from '+(sequel?'the Strange House':'Mistralton Cave with Surf'),'dusk-stone',41);
  }
  const monkey={simisage:['Pansage','Leaf Stone','leaf-stone'],simisear:['Pansear','Fire Stone','fire-stone'],simipour:['Panpour','Water Stone','water-stone']}[name];
  if(monkey){
   const initial=sequel?early(3,'Lostlorn Forest','grass-spots','Find the elemental monkeys in rustling grass.'):
    early(2,'Pinwheel Forest · Interior','grass-spots','Find the elemental monkeys in rustling grass. The Dreamyard gift depends on the starter.');
   const [stage,stone,resource]=monkey;
   const location=sequel?{simisage:'Lostlorn Forest',simisear:'Desert Resort',simipour:'Route 19 with Surf'}[name]:'Castelia City (one stone choice)';
   return moveStoneEvolution(sequel&&name==='simipour'?5:initial.rank,stage,initial,'Use a '+stone+' from '+location,resource);
  }
  if((game.startsWith('Black')&&name==='lilligant')||(game.startsWith('White')&&name==='whimsicott')){
   const initial=sequel?early(3,'Route 4','in-game trade','Trade the native plant Pokémon for its counterpart.'):
    early(2,'Nacrene City','in-game trade','Trade the native Pinwheel Forest Pokémon for its counterpart.');
   return moveStoneEvolution(3,name==='lilligant'?'Petilil':'Cottonee',initial,'Use a Sun Stone from Nimbasa City','sun-stone');
  }
  if(game==='White'&&['elekid','magby','budew','slakoth'].includes(name)){
   return {...early(10,'White Forest','walk','The matching White Forest resident must be present. Check the resident roster or recruit from a compatible game.'),
    source:'white-forest-residents'};
  }
  return null;
 }
 function lookup(game,name,encounters){
  if(isKanto(game)){
   const yellow=game==='Yellow';
   const gifts={
    eevee:[2,'Celadon City · Mansion','Enter by the back door and take the single Eevee on the rooftop.'],
    lapras:[2,'Saffron City · Silph Co.','Give the gate guards a drink from Celadon. Defeat the rival on 7F, then speak to the employee.'],
    magikarp:[1,'Route 4 · Pokémon Center','Buy a Magikarp from the salesman before entering Mt. Moon for ₽500.'],
    hitmonlee:[2,'Saffron City · Fighting Dojo','Give a drink to enter Saffron, defeat the Karate Master and choose one gift fighter.'],
    hitmonchan:[2,'Saffron City · Fighting Dojo','Give a drink to enter Saffron, defeat the Karate Master and choose one gift fighter.']
   };
   if(yellow)Object.assign(gifts,{
    pikachu:[0,'Pallet Town','Professor Oak gives Pikachu at the start.'],
    bulbasaur:[1,'Cerulean City','Show Melanie a sufficiently happy starter Pikachu.'],
    charmander:[1,'Route 24','Cross Nugget Bridge, then speak to the trainer on Route 24.'],
    squirtle:[3,'Vermilion City','Defeat Lt. Surge, then speak to Officer Jenny.']
   });
   const direct=land(game,encounters);
   if(gifts[name]){
    const [rank,place,note]=gifts[name];
    if(direct&&direct.rank<rank)return direct;
    return {...early(rank,place,name==='magikarp'?'purchase':'gift',note),source:'rby-game-specific-gifts'};
   }
   const trades=yellow?{
    'mr-mime':[1,'Route 2','Clefairy','Approach through Diglett’s Cave from Vermilion.'],
    machamp:[2,'Routes 5–6 Underground Path','Cubone','The received Machoke evolves on arrival.'],
    parasect:[2,'Route 18','Tangela','Catch Tangela in the Yellow Safari Zone.'],
    rhydon:[3,'Cinnabar Island · Lab','Golduck'],dewgong:[3,'Cinnabar Island · Lab','Growlithe'],muk:[3,'Cinnabar Island · Lab','Kangaskhan']
   }:{
    'mr-mime':[1,'Route 2','Abra','Approach through Diglett’s Cave from Vermilion.'],
    'nidoran-f':[1,'Routes 5–6 Underground Path','Nidoran♂'],
    nidorina:[1,'Route 11','Nidorino'],
    farfetchd:[1,'Vermilion City','Spearow'],
    jynx:[2,'Cerulean City','Poliwhirl'],
    lickitung:[2,'Route 18','Slowbro'],
    seel:[3,'Cinnabar Island · Lab','Ponyta'],electrode:[3,'Cinnabar Island · Lab','Raichu'],tangela:[3,'Cinnabar Island · Lab','Venonat']
   };
   if(trades[name]){
    const [rank,place,partner,requirement]=trades[name];
    const trade={...early(rank,place,'in-game trade',['Trade '+partner+'.',requirement].filter(Boolean).join(' ')),source:'rby-in-game-trades'};
    return direct&&direct.rank<=rank?{...direct,alternatives:[trade]}:trade;
   }
   if(direct)return direct;
   if(encounters?.some(r=>r[0]==='celadon-city · prize-corner'&&r[1]==='gift')){
    return {...early(2,'Celadon City · Prize Corner','purchase','Get the Coin Case in Celadon and exchange Game Corner coins at the Prize Corner.'),source:'celadon-version-specific-prizes'};
   }
   if(['omanyte','kabuto','aerodactyl'].includes(name)){
    const part={omanyte:'Choose the Helix Fossil at Mt. Moon.',kabuto:'Choose the Dome Fossil at Mt. Moon.',
     aerodactyl:'Take the Old Amber from the back room of the Pewter Museum after obtaining Cut.'}[name];
    return {...early(3,'Cinnabar Island · Lab','fossil',part+' Surf to Cinnabar after Koga and revive the fossil.'),source:'rby-fossils'};
   }
   if(name==='mew')return {kind:'event',reason:'Official Red, Blue and Yellow acquisition requires a distribution or trade from a distribution.'};
   if(!yellow&&['bulbasaur','charmander','squirtle'].includes(name))return {kind:'tradePossible',reason:'Choose this starter at the beginning of the game. Other starter families require a trade.'};
   return null;
  }
  if(isJohto(game)){
   if(name==='snorlax')return {...early(10,'Vermilion City','pokeflute',
    'Restore the Power Plant, obtain the EXPN Card in Lavender Town and tune the Pokégear to the Poké Flute station by Snorlax.'),source:'vermilion-city'};
   if(name==='aerodactyl')return {...early(10,'Route 14','in-game trade','Trade Chansey to the NPC on Route 14 in postgame Kanto.'),source:'gsc-in-game-trades'};
   if(name==='porygon')return {...early(10,'Celadon City · Prize Corner','purchase',
    'Exchange '+(game==='Crystal'?'5,555':'9,999')+' coins at the postgame Celadon Prize Corner.'),source:'celadon-version-specific-prizes'};
   if(game==='Crystal'&&['pichu','cleffa','igglybuff','tyrogue','smoochum','elekid','magby'].includes(name)){
    return {...early(2,'Route 34 · Day Care','gift egg',
     'In the international release, take the one Odd Egg and hatch it. The species is random; breeding supplies alternatives.'),source:'crystal-odd-egg'};
   }
   if(name==='tyrogue')return {...early(8,'Mt. Mortar · B1F','gift',
    'Surf and use Waterfall with the Rising Badge, then defeat the Karate King. Keep an open party slot.'),source:'mt-mortar'};
   if((game==='Gold'&&name==='ekans')||(game==='Silver'&&name==='sandshrew')){
    return {...early(2,'Goldenrod City · Game Corner','purchase','Exchange 700 coins at the Goldenrod Game Corner.'),source:'goldenrod-version-specific-prizes'};
   }
   if(name==='unown')return {...early(0,'Ruins of Alph','walk','Solve the first sliding-panel puzzle in the accessible ruin above the entrance.'),source:'ruins-of-alph'};
   if(name==='lugia'){
    const rank=game==='Silver'?7:10;
    return {...early(rank,'Whirl Islands','static','Bring the Silver Wing from '+(game==='Silver'?'the Radio Tower Director after Team Rocket':'the man in postgame Pewter City')+'. Use Surf and Whirlpool to approach from the northeast island.'),source:'whirl-islands'};
   }
   if(name==='ho-oh'){
    const rank=game==='Gold'?7:10;
    const wing=game==='Crystal'?'Catch the three legendary beasts, enter the Hall of Fame and obtain the Rainbow Wing from the Sage.':
     'Bring the Rainbow Wing from '+(game==='Gold'?'the Radio Tower Director after Team Rocket.':'the man in postgame Pewter City.');
    return {...early(rank,'Bell Tower · Roof','static',wing),source:'bell-tower'};
   }
   if(game==='Crystal'&&name==='suicune')return {...early(7,'Bell Tower · 1F','static',
    'Free the Radio Tower to receive the Clear Bell, then meet the Sages and enter the tower.'),source:'bell-tower'};
   if(game==='Crystal'&&name==='remoraid')return {kind:'trade',reason:'Crystal has no native Remoraid fishing encounter. Trade from Gold or Silver.'};
   const gifts={
    togepi:[1,'Violet City','After defeating Falkner, take the Egg from Elm’s aide at the Pokémon Center and hatch it.','gift egg'],
    eevee:[3,'Goldenrod City · Bill’s House','Meet Bill in the Ecruteak Pokémon Center, then return to his home.','gift'],
    shuckle:[4,'Cianwood City · Mania’s House','Surf to Cianwood after Morty and talk to Mania.','gift'],
    dratini:[8,'Dragon’s Den','Complete Clair’s test in the Dragon Shrine and return for the gift.','gift']
   };
   const direct=land(game,encounters),gift=gifts[name];
   if(gift&&(name!=='dratini'||game==='Crystal')&&(!direct||direct.rank>=gift[0])){
    const [rank,place,note,method]=gift;
    return {...early(rank,place,method,note),source:'gsc-game-specific-gifts'};
   }
   if(direct)return direct;
   if(['chikorita','cyndaquil','totodile'].includes(name))return {kind:'tradePossible',reason:'Choose one starter from Professor Elm. The other families require a trade.'};
   if(name==='celebi'&&game==='Crystal')return {kind:'event',reason:'Requires the GS Ball through a supported official event or the Virtual Console post-League release.'};
   if(['raikou','entei'].includes(name)||name==='suicune'&&game!=='Crystal'){
    return {...early(3,'Johto · Roaming encounter','roaming-grass','Awaken the legendary Pokémon at the Burned Tower in Ecruteak, then track it through Johto.'),source:'burned-tower'};
   }
   return null;
  }
  const sequel=game==='Black 2'||game==='White 2';
  if(!sequel&&game!=='Black'&&game!=='White')return null;
  const verified=recentUnovaRoute(game,name);
  if(verified)return verified;
  const resident=game==='White'&&whiteForestResidents[name];
  if(sequel&&['glameow','purugly','stunky','skuntank'].includes(name)&&!encounters?.length){
   const quiet=['glameow','purugly'].includes(name);
   return {kind:'event',reason:'Requires the '+(quiet?'Quiet Hidden Grottoes (White 2)':'Noisy Hidden Grottoes (Black 2)')+
    ' Funfest Mission or a trade from its supported version.',source:'serebii-b2w2-special-grottos'};
  }
  if(resident&&!encounters?.some(row=>encounterRoute(game,row))){
   return {...early(10,'White Forest',resident[0]==='grass'?'walk':resident[0],
    'Requires '+resident[1]+' in the White Forest resident roster. '+(resident[0]==='surf'?'Requires Surf. ':'')+
    'Recruit a missing resident through compatible Entralink play.'),source:'white-forest-residents'};
  }
  if(sequel&&!encounters?.length){
   const trade=droppedItemTrade(name);
   if(trade)return trade;
  }
  const swarm=(sequel?sequelSwarms:originalSwarms)[name];
  if(swarm&&!(!swarm[1]||swarm[1]===game)&&!encounters?.length)
   return {kind:'trade',reason:'The documented swarm is exclusive to '+swarm[1]+'.'};
  if(swarm&&(!swarm[1]||swarm[1]===game)&&!encounters?.some(row=>encounterRoute(game,row))){
   return {...early(10,swarm[0],'swarm','Obtain the National Pokédex and check the current swarm on a route gate’s electronic board.'),
    source:sequel?'serebii-b2w2-swarms':'serebii-bw-swarms'};
  }
  if(sequel&&((name==='magby'&&game==='White 2')||(name==='elekid'&&game==='Black 2')))
   return {kind:'trade',reason:'Version-exclusive family'};
  if(!sequel){
   const storyDragon=game==='Black'?'reshiram':'zekrom';
   const roamer=game==='Black'?'tornadus-incarnate':'thundurus-incarnate';
   const statics={
    [storyDragon]:[9,'N’s Castle','Story encounter immediately after the Elite Four. If skipped with a full party and PC, catch it later at Dragonspiral Tower.'],
    [roamer]:[8,'Route 7','After the eighth badge, visit the house on Route 7 during the storm, then track it across Unova.'],
    'landorus-incarnate':[10,'Abundant Shrine','Requires Surf and both Tornadus and Thundurus in the party. At least one comes from the opposite version.'],
    volcarona:[10,'Relic Castle','Lowest chamber after defeating Ghetsis.'],
    cobalion:[6,'Mistralton Cave','Surf from Route 6, then reach the Guidance Chamber.'],
    terrakion:[8,'Victory Road','After encountering Cobalion, enter the Trial Chamber in Victory Road.'],
    virizion:[6,'Pinwheel Forest','After encountering Cobalion, visit the Rumination Field.'],
    kyurem:[10,'Giant Chasm','Reach the innermost cave in the postgame.'],
    musharna:[10,'Dreamyard','On Fridays in the postgame basement. This Musharna has Telepathy.']
   };
   if(statics[name]){
    const [rank,place,note]=statics[name];
    return {...early(rank,place,'static',note),source:'bw-location-and-static-guides'};
   }
   if(['reshiram','zekrom','tornadus-incarnate','thundurus-incarnate'].includes(name))return {kind:'trade',reason:'Native encounter is exclusive to the opposite version.'};
   if(name==='victini')return {kind:'event',reason:'Liberty Garden requires the distribution-only Liberty Pass.'};
   if(name==='zorua'||name==='zoroark')return {kind:'event',reason:name==='zorua'?'The Castelia City Zorua gift requires a distribution Celebi.':'The Lostlorn Forest encounter requires a distribution shiny Raikou, Entei or Suicune.'};
   if(name==='axew')return {...early(6,'Mistralton Cave','walk','Requires Surf to reach the cave from Route 6.'),source:'mistralton-cave'};
   if(name==='ducklett')return {...early(4,'Driftveil Drawbridge','bridge-spots','Check moving shadows after Elesa.'),source:'driftveil-drawbridge'};
   if(name==='swanna'){
    const initial=early(4,'Driftveil Drawbridge','bridge-spots','Check moving shadows after Elesa.');
    return {...early(4,initial.place,'evolution','Ducklett evolves at level 35.'),path:{stage:'Ducklett',initial,requirement:'Level 35'},source:'ducklett-evolution'};
   }
  }
  if(name==='leavanny'){
   return {...early(5,'Route 6','grass-spots','Check rustling grass, or evolve Swadloon with high friendship.'),source:'unova-route-6'};
  }
  if(!sequel&&name==='venomoth')return {...early(10,'Dreamyard','dark-grass','Enter the far side through the ruins after the story clear.'),source:'dreamyard'};
  if(!sequel&&regionalPlants[game]===name)return {...early(2,'Pinwheel Forest interior','walk','After the Nacrene Gym museum incident.'),source:'walkthrough-bw'};
  if(name==='rotom')return {...early(10,'Route 15','in-game trade','Trade a Ditto.'),source:'in-game-trades-gen5'};
  if(sequel&&['ambipom','alakazam'].includes(name)){
   return {...early(10,'Accumula Town','in-game trade',name==='ambipom'?'Trade Excadrill.':'Complete Diana’s first trade in Accumula Town, then trade Hippowdon.'),source:'in-game-trades-gen5'};
  }
  if(sequel&&name==='happiny')return {...early(10,'Nacrene City','gift egg','Receive the Egg from the Breeder in the west gate and hatch it.'),source:'nacrene-city'};
  if(!sequel&&name==='munchlax')return {...early(10,'Undella Town','in-game trade','In summer, trade a Cinccino.'),source:'in-game-trades-gen5'};
  const partner=game.startsWith('Black')?'petilil':'cottonee';
  if(name===partner){
   return {...early(sequel?3:2,sequel?'Route 4':'Nacrene City','in-game trade',
    'Trade a '+(partner==='petilil'?'Cottonee':'Petilil')+'.'),source:'in-game-trades-gen5'};
  }
  if(sequel&&name==='yamask')return {...early(3,'Relic Castle','walk','Use the entrance from Desert Resort.'),source:'relic-castle'};
  if(sequel&&sequelStatics[name]){
   const [rank,place,note]=sequelStatics[name];
   return {...early(rank,place,'static',note),source:'game-specific-location-static'};
  }
  if(sequel&&(name==='regice'||name==='registeel')){
   const ice=name==='regice',native=ice?game==='White 2':game==='Black 2',key=ice?'Iceberg Key':'Iron Key';
   return {...early(10,'Underground Ruins','static','Catch Regirock, then activate the '+key+' in Unova Link. '+(native?'Earn it in this version.':'Receive it through Key Link from the opposite version.')),source:'underground-ruins'};
  }
  if(sequel&&['latios','latias','zekrom','reshiram'].includes(name)){
   const eon=name==='latios'||name==='latias',blackExclusive=name==='latios'||name==='zekrom';
   if((game==='Black 2')!==blackExclusive)return {kind:'trade',reason:'Available through the opposite sequel version.'};
   return {...early(10,eon?'Dreamyard':'Dragonspiral Tower','static',eon?'Chase it through the ruins on the first visit.':'Defeat N in N’s Castle, then bring the stone to the tower summit.'),source:eon?'dreamyard':'dragonspiral-tower'};
  }
  if(sequel&&name==='kyurem')return {...early(10,'Giant Chasm · Cave','static','Catch the version’s dragon from Dragonspiral Tower, then return to the Giant Chasm.'),source:'giant-chasm'};
  if(sequel&&sequelReviewed[name])return {...sequelReviewed[name],source:'game-specific-location-encounter'};
  const stageRule=sequel&&sequelLevels[name==='darmanitan-standard'?'darmanitan':name];
  if(stageRule){
   const [stage,trigger]=stageRule;
   const initial=lookup(game,stage);
   if(initial?.kind==='trade')return initial;
   if(initial?.confirmed){
    const requirement=typeof trigger==='number'?'Level '+trigger:trigger;
    return {...early(initial.rank,initial.place,'evolution',title(stage)+' · '+requirement),
     path:{stage:title(stage),initial,requirement},source:'species-evolution'};
   }
  }
  if(sequel&&['gible','gabite','garchomp'].includes(name)){
   if(game==='White 2')return {kind:'trade',reason:'The Gible gift is exclusive to Black 2. Trade or transfer a Gible to evolve it in White 2.'};
   const gift=early(10,'Floccesy Town','gift','Defeat Benga in Black Tower, then visit Alder’s house.');
   if(name==='gible')return {...gift,source:'floccesy-town'};
   const requirement=name==='gabite'?'Level 24':'Gible → Gabite at Lv 24 → Garchomp at Lv 48';
   return {...early(10,'Floccesy Town','evolution',gift.note+' '+requirement+'.'),path:{stage:'Gible',initial:gift,requirement},source:'floccesy-town'};
  }
  if(sequel&&['baltoy','claydol'].includes(name)){
   const initial=early(5,'Relic Castle · Volcarona’s chamber','walk','Enter Relic Passage from the Pokémon World Tournament after Clay.');
   return name==='baltoy'?{...initial,source:'relic-castle'}:{...early(5,initial.place,'evolution','Baltoy evolves at Lv 36.'),path:{stage:'Baltoy',initial,requirement:'Level 36'},source:'relic-castle'};
  }
  if(sequel&&name==='golurk')return {...early(9,'Victory Road · Cave','walk','Lv 48–50 in the cave after Route 23.'),source:'victory-road-b2w2'};
  if(!sequel&&name==='golurk'){
   const initial=early(6,'Dragonspiral Tower','walk','Golett on 1F and 2F after Brycen.');
   return {...early(6,initial.place,'evolution','Golett evolves at Lv 43.'),path:{stage:'Golett',initial,requirement:'Level 43'},source:'dragonspiral-tower'};
  }
  if(sequel&&name==='starmie'){
   const initial=early(6,'Undella Town','surf','Requires Surf and access through Reversal Mountain.');
   return {...early(6,'Undella Town','surf-spots','Requires Surf. Starmie appears in rippling water.'),
    path:{stage:'Staryu',initial,requirement:'Water Stone (Route 19 with Surf, after Clay)',alternative:'Surf in rippling water at Undella Town'},
    source:'undella-town-and-route-19'};
  }
  if(sequel&&name==='golduck'){
   const initial=bw2.psyduck;
   return {...early(0,initial.place,'evolution','Psyduck evolves at Lv 33. Train it before relying on Golduck for an early Gym.'),path:{stage:'Psyduck',initial,requirement:'Level 33',alternative:'Catch Golduck on Route 11 after Skyla'},source:'floccesy-ranch-and-route-11'};
  }
  if(fossils[name])return {...early(10,'Twist Mountain → Nacrene Museum','fossil',
   fossils[name]+' · Random daily fossil after receiving the National Pokédex.'),source:'twist-mountain'};
  if(sequel&&name==='deerling')return {...early(5,'Route 6 Season Research Lab','gift','Level 30 with Serene Grace.'),source:'unova-route-6'};
  if(sequel&&((name==='mandibuzz'&&game==='Black 2')||(name==='braviary'&&game==='White 2'))){
   return {...early(3,'Route 4','static',name==='mandibuzz'?'Thursday · Weak Armor.':'Monday · Defiant.'),source:'unova-route-4'};
  }
  if(name==='conkeldurr'||(!sequel&&name==='gigalith'))return {kind:'trade',reason:name==='gigalith'?'Trade Boldore':'Trade Gurdurr'};
  if(sequel&&name==='gigalith')return {...early(5,'Route 7','in-game trade','Trade a Lostlorn Forest Emolga to the Hiker, or trade-evolve Boldore.'),source:'unova-route-7'};
  if(sequel&&name==='gliscor')return {...early(6,'Route 11','grass-spots','Catch Gliscor in rustling grass, or evolve Route 11 Gligar at night holding a Razor Fang (8 BP at PWT/Subway).'),path:{stage:'Gligar',initial:early(6,'Route 11','walk'),requirement:'Level up at night holding Razor Fang (8 BP at PWT/Subway)',alternative:'Gliscor in rustling grass on Route 11'},source:'route-11-and-razor-fang'};
  if(['tirtouga','archen'].includes(name)){
   const fossil=name==='tirtouga'?'Cover Fossil':'Plume Fossil';
   return {...early(sequel?10:3,sequel?'Nacrene Museum':'Relic Castle → Nacrene Museum','fossil',fossil+(sequel?' · One guaranteed museum choice. Join Avenue’s Antique Shop can yield additional fossils.':' · One fossil choice per save.')),source:sequel?'walkthrough-b2w2':'walkthrough-bw'};
  }
  const specific=sequel&&sequelConditions[name];
  if(specific){
   const [stage,rank,requirement]=specific;
   return {...early(rank,bw2[stage].place,'evolution',title(stage)+' → '+title(name)+' · '+requirement),path:{stage:title(stage),initial:bw2[stage],requirement},source:'bulbapedia-stones-and-evolution'};
  }
  const records=sequel?bw2:bw;
  if(records[name])return {...records[name],source:sequel?'walkthrough-b2w2':'walkthrough-bw'};
  const rule=levels[name]||conditions[name],parent=rule&&records[rule[0]];
  const direct=land(game,encounters);
  if(!parent||direct&&direct.rank<parent.rank)return direct;
  return {kind:typeof rule[1]==='number'?'timed':'partial',confirmed:typeof rule[1]==='number',rank:parent.rank,place:parent.place,method:'evolution',
   note:title(rule[0])+' available earlier · '+(typeof rule[1]==='number'?'Evolves at Lv '+rule[1]:rule[1]),path:{stage:title(rule[0]),initial:parent,requirement:typeof rule[1]==='number'?'Level '+rule[1]:rule[1]},source:'pokedb-evolution'};
 }
 const kantoMachineLocations={
  tm01:"Mt. Moon, Celadon Department Store · ₽3,000",
  tm02:"Rocket Hideout, Celadon Department Store · ₽2,000",
  tm03:"Silph Co.",
  tm04:"Route 4",
  tm05:"Victory Road, Celadon Department Store · ₽3,000",
  tm06:"Prize for defeating Fuchsia Gym Leader Koga",
  tm07:"Rocket Hideout, Celadon Department Store · ₽2,000",
  tm08:"S.S. Anne",
  tm09:"Silph Co., Celadon Department Store · ₽3,000",
  tm10:"Rocket Hideout",
  tm11:"Prize for defeating Cerulean Gym Leader Misty",
  tm12:"Mt. Moon",
  tm13:"Celadon Department Store roof",
  tm14:"Pokémon Mansion",
  tm15:"Rocket Game Corner · 5,500 Game Corner coins",
  tm16:"Route 12",
  tm17:"Victory Road, Celadon Department Store · ₽3,000",
  tm18:"Celadon Department Store",
  tm19:"Route 25",
  tm20:"Route 15",
  tm21:"Prize for defeating Celadon Gym Leader Erika",
  tm22:"Pokémon Mansion",
  tm23:"Rocket Game Corner · 3,300 Game Corner coins",
  tm24:"Prize for defeating Vermilion Gym Leader Lt. Surge",
  tm25:"Kanto Power Plant",
  tm26:"Silph Co.",
  tm27:"Prize for defeating Viridian Gym Leader Giovanni",
  tm28:"Cerulean City",
  tm29:"Saffron City",
  tm30:"Route 9",
  tm31:"Saffron City",
  tm32:"Safari Zone, Celadon Department Store · ₽1,000",
  tm33:"Kanto Power Plant, Celadon Department Store · ₽1,000",
  tm34:"Prize for defeating Pewter Gym Leader Brock",
  tm35:"Pokémon Lab",
  tm36:"Silph Co.",
  tm37:"Safari Zone, Celadon Department Store · ₽2,000",
  tm38:"Prize for defeating Cinnabar Gym Leader Blaine",
  tm39:"Route 12",
  tm40:"Safari Zone",
  tm41:"Celadon City",
  tm42:"Viridian City",
  tm43:"Victory Road",
  tm44:"S.S. Anne",
  tm45:"Route 24",
  tm46:"Prize for defeating Saffron Gym Leader Sabrina",
  tm47:"Victory Road",
  tm48:"Celadon Department Store roof",
  tm49:"Celadon Department Store roof",
  tm50:"Rocket Game Corner · 7,700 Game Corner coins",
  hm01:"S.S. Anne · Cascade Badge required for field use",
  hm02:"Route 16 · Thunder Badge required for field use",
  hm03:"Safari Zone · Soul Badge required for field use",
  hm04:"Fuchsia City · Rainbow Badge required for field use",
  hm05:"Route 2 · Boulder Badge required for field use",
 };
 const johtoMachineLocations={
  tm01:"Prize for defeating Chuck",
  tm02:"Ilex Forest, Goldenrod Department Store · ₽2,000",
  tm03:"Celadon Mansion",
  tm04:"Route 35",
  tm05:"Route 32",
  tm06:"Prize for defeating Janine",
  tm07:"Kanto Power Plant",
  tm08:"Route 36, Goldenrod Department Store · ₽1,000",
  tm09:"Traded Abra from Generation I",
  tm10:"Lake of Rage, Celadon Department Store · ₽3,000",
  tm11:"Goldenrod Radio Tower, Celadon Department Store · ₽2,000",
  tm12:"Route 34",
  tm13:"Moomoo Farm, Dark Cave",
  tm14:"Goldenrod Game Corner · 5,500 Game Corner coins",
  tm15:"Celadon Game Corner · 7,500 Game Corner coins",
  tm16:"Prize for defeating Pryce",
  tm17:"Celadon Department Store · ₽3,000",
  tm18:"Slowpoke Well, Celadon Department Store · ₽2,000",
  tm19:"Prize for defeating Erika",
  tm20:"Burned Tower",
  tm21:"Goldenrod Department Store",
  tm22:"Route 27",
  tm23:"Prize for defeating Jasmine",
  tm24:"Prize for defeating Clair",
  tm25:"Goldenrod Game Corner · 5,500 Game Corner coins",
  tm26:"Victory Road",
  tm27:"Goldenrod Department Store",
  tm28:"National Park",
  tm29:"Saffron City, Celadon Game Corner · 3,500 Game Corner coins",
  tm30:"Prize for defeating Morty",
  tm31:"Prize for defeating Falkner",
  tm32:"Celadon Game Corner · 1,500 Game Corner coins",
  tm33:"Goldenrod Department Store, Traded Krabby Horsea Goldeen and Staryu from Generation I · ₽3,000",
  tm34:"Olivine Lighthouse",
  tm35:"Goldenrod Department Store basement",
  tm36:"Route 43",
  tm37:"Route 27, Celadon Department Store · ₽2,000",
  tm38:"Goldenrod Game Corner · 5,500 Game Corner coins",
  tm39:"Union Cave",
  tm40:"Mt. Mortar",
  tm41:"Goldenrod Department Store · ₽3,000",
  tm42:"Viridian City",
  tm43:"Lake of Rage, Traded Nidoran♀ and Nidoran♂ from Generation I",
  tm44:"Ice Path",
  tm45:"Prize for defeating Whitney",
  tm46:"Team Rocket HQ",
  tm47:"Route 28, Rock Tunnel",
  tm48:"Goldenrod Department Store · ₽3,000",
  tm49:"Prize for defeating Bugsy",
  tm50:"Route 31 after delivering Randy’s mail",
  hm01:"Ilex Forest · Hive Badge required for field use",
  hm02:"Cianwood City · Storm Badge required for field use",
  hm03:"Ecruteak City · Fog Badge required for field use",
  hm04:"Olivine City · Plain Badge required for field use",
  hm05:"Sprout Tower · Zephyr Badge required for field use",
  hm06:"Team Rocket HQ · Glacier Badge required for field use",
  hm07:"Ice Path · Rising Badge required for field use",
 };
 const johtoMoveWindows={
  'dynamic-punch':[5,'Defeat Chuck in Cianwood.'],
  headbutt:[2,'Speak to the Headbutt tutor in Ilex Forest.'],
  curse:[10,'Speak to the NPC in the Celadon Mansion at night.'],
  rollout:[2,'Reach Route 35 after Ilex Forest.'],
  roar:[2,'Use Cut to reach the man on the north ledge of Route 32.'],
  snore:[3,'Feed seven Berries to Moomoo at the farm on Route 39. There is another copy in Dark Cave.'],
  'rain-dance':[4,'Use Surf and Strength in the lower Slowpoke Well. Another copy is for sale in postgame Celadon.'],
  endure:[3,'Use Strength to reach the northeastern basement of Burned Tower after Whitney.'],
  'sleep-talk':[7,'Use the Basement Key to reach the Radio Director in the Goldenrod warehouse during the takeover.'],
  'sludge-bomb':[4,'Clear the Mahogany Rocket Hideout, then speak to the guard in the Route 43 toll building.'],
  sandstorm:[8,'Show the woman on Route 27 a high-friendship lead after crossing Tohjo Falls.'],
  'defense-curl':[4,'Reach the raised platform in the center of Mt. Mortar.'],
  'dream-eater':[10,'Speak to the sleeping man in Viridian after using Cut or Surf.'],
  detect:[3,'Use Cut to reach the northeastern path beside the Lake of Rage.'],
  thief:[4,'Enter the southwestern B2F room of the Mahogany Rocket Hideout.'],
  'steel-wing':[10,'Find a copy in Rock Tunnel. Another is available from the celebrity on Route 28.'],
  toxic:[10,'Defeat Janine in postgame Fuchsia.'],
  'zap-cannon':[10,'Return the Machine Part to the postgame Power Plant manager.'],
  'rock-smash':[3,'Move Sudowoodo and talk to the man on Route 36.'],
  'psych-up':[null,'Requires a Generation I Abra through the Time Capsule.'],
  'hidden-power':[3,'Get the TM at the Lake of Rage.'],
  'sunny-day':[7,'Receive it at the Radio Tower after the Rocket takeover.'],
  'sweet-scent':[2,'Speak to the attendant in the Ilex Forest gate to Route 34.'],
  blizzard:[2,'5,500 coins in Goldenrod.'],thunder:[2,'5,500 coins in Goldenrod.'],
  'fire-blast':[2,'5,500 coins in Goldenrod.'],
  'hyper-beam':[10,'7,500 coins in Celadon.'],
  'icy-wind':[5,'Defeat Pryce in Mahogany after clearing Team Rocket’s hideout.'],
  protect:[10,'Purchase at the Celadon Department Store.'],
  'giga-drain':[10,'Defeat Erika in postgame Celadon.'],
  frustration:[2,'Visit the Goldenrod Department Store on Sunday with a low-friendship lead.'],
  return:[2,'Visit the Goldenrod Department Store on Sunday with a high-friendship lead.'],
  'solar-beam':[8,'Explore Route 27 using Surf and Waterfall after Clair.'],
  'iron-tail':[5,'Deliver the SecretPotion and defeat Jasmine in Olivine.'],
  'dragon-breath':[8,'Complete Clair’s Dragon’s Den challenge.'],
  earthquake:[8,'Pass through Victory Road after collecting eight Johto badges.'],
  dig:[2,'Look behind the fence in the National Park.'],
  psychic:[10,'Visit Mr. Psychic in Saffron or exchange 3,500 coins in Celadon.'],
  'shadow-ball':[4,'Defeat Morty in Ecruteak.'],
  'mud-slap':[1,'Defeat Falkner in Violet.'],
  'double-team':[10,'Exchange 1,500 coins in Celadon.'],
  'ice-punch':[2,'Purchase at the Goldenrod Department Store.'],
  'thunder-punch':[2,'Purchase at the Goldenrod Department Store.'],
  'fire-punch':[2,'Purchase at the Goldenrod Department Store.'],
  swagger:[3,'Climb the Olivine Lighthouse.'],swift:[1,'Explore Union Cave.'],
  rest:[7,'Pass through Ice Path after freeing the Radio Tower.'],
  attract:[3,'Defeat Whitney in Goldenrod.'],
  'fury-cutter':[2,'Defeat Bugsy in Azalea.'],
  nightmare:[2,'Take Randy’s mail from the Route 35 gate to the man on Route 31.'],
  cut:[2,'Rescue the Farfetch’d in Ilex Forest. The Hive Badge is required for field use.'],
  fly:[5,'Defeat Chuck, then speak to his wife in Cianwood.'],
  surf:[3,'Defeat the Kimono Girls. The Fog Badge is required for field use.'],
  strength:[3,'Speak to a sailor at the Olivine Café. The Plain Badge is required for field use.'],
  flash:[0,'Defeat the elder in Sprout Tower. The Zephyr Badge is required for field use.'],
  whirlpool:[4,'Clear the Rocket Hideout in Mahogany. The Glacier Badge is required for field use.'],
  waterfall:[7,'Find it in Ice Path. The Rising Badge is required for field use.']
 };
 function johtoMoveTiming(game,name,methods){
  if(!isJohto(game))return null;
  const machine=methods.some(m=>m[0]==='machine')?johtoMoveWindows[name]:null;
  const tutor=game==='Crystal'&&methods.some(m=>m[0]==='tutor')&&['ice-beam','thunderbolt','flamethrower'].includes(name)?
   [10,'Goldenrod Game Corner tutor on Wednesday or Saturday after the League. Requires the Coin Case and 4,000 coins.']:null;
  const known=[machine,tutor].filter(Boolean);
  const ranks=known.map(row=>row[0]).filter(rank=>rank!=null);
  return known.length?{rank:ranks.length?Math.min(...ranks):null,requirements:known.map(row=>row[1]),text:known.map(row=>row[1]).join(' / ')}:null;
 }
 function machineLocation(game,item){
  return isKanto(game)?kantoMachineLocations[item]:isJohto(game)?johtoMachineLocations[item]:null;
 }
 // Kanto's repeatable shop and Game Corner machines are excluded.
 const kantoSingleUse=new Set([
  'swords-dance','whirlwind','toxic','body-slam','double-edge','bubble-beam','water-gun','ice-beam',
  'blizzard','pay-day','counter','seismic-toss','rage','mega-drain','solar-beam','thunderbolt',
  'thunder','earthquake','fissure','dig','psychic','teleport','mimic','bide',
  'metronome','self-destruct','fire-blast','swift','skull-bash','soft-boiled','dream-eater','sky-attack',
  'rest','thunder-wave','psywave','explosion','rock-slide','tri-attack',
 ]);
 const johtoSingleUse=new Set(['dynamic-punch','curse','rollout','roar','toxic','zap-cannon','sweet-scent','icy-wind',
  'giga-drain','endure','solar-beam','iron-tail','dragon-breath','earthquake','dig','shadow-ball','mud-slap','swagger','sleep-talk',
  'sludge-bomb','swift','defense-curl','dream-eater','rest','attract','thief','fury-cutter','nightmare']);
 function limitedMachine(game,name){
  if(['Red','Blue','Yellow'].includes(game))return kantoSingleUse.has(name);
  if(isJohto(game))return johtoSingleUse.has(name);
  if(['FireRed','LeafGreen'].includes(game))return name==='earthquake';
  return false;
 }
 // Build routes from the version's audited acquisition records and encounter index.
 function plannerRoutes(game,target,pack,owned=[],resolve=lookup){
  if(!pack?.mons||!target?.id)return [];
  const rows=new Map();
  let cursor=Number(target.id);
  while(cursor&&!rows.has(cursor)){
   const row=pack.mons.find(entry=>entry[0]===cursor);
   if(!row)break;
   rows.set(cursor,row);
   cursor=Number(row[4]);
  }
  if(!rows.has(Number(target.id)))return [];
  const chain=[...rows.values()].reverse();
  const audited=chain.map(([id,name])=>resolve(game,name,pack.entries?.[id],id));
  const direct=(row,record)=>{
   const [id]=row;
   const included=[record,...(record?.alternatives||[])].filter(r=>r?.confirmed&&!r.path&&
    !['evolution','breeding'].includes(r.method));
   const area=place=>String(place||'').split(' · ')[0].toLowerCase();
   const encounters=(pack.entries?.[id]||[]).filter(()=>!record||!['trade','event'].includes(record.kind))
    .map(e=>{
     const place=placeName(e[0],game);
     const fallback=included.find(r=>r.method===e[1]&&area(r.place)===area(place));
     const route=encounterRoute(game,e)||fallback;
     return route&&{...route,place,minLevel:e[2],maxLevel:e[3],conditions:e[4]||[]};
    }).filter(Boolean);
   const special=included.filter(r=>!encounters.some(e=>area(e.place)===area(r.place)&&e.method===r.method&&e.rank===r.rank));
   return [...encounters,...special];
  };
  const routes=[];
  for(const [start,row] of chain.entries()){
   const [id,name]=row,record=audited[start];
   const onward=chain.slice(start+1);
   const steps=onward.map(([nextId,nextName],i)=>{
    const note=audited[start+i+1]?.path;
    const previous=chain[start+i]?.[1];
    const level=auditedLevelEvolutions[nextId]||0;
    const specialMatch=note?.stage&&note.stage.toLowerCase().replaceAll(' ','-')===previous;
    const stone=nextId===38&&['Black','White','Black 2','White 2'].includes(game);
    const requirement=level?'Level '+level:specialMatch?note.requirement:stone?'Use a Fire Stone':'';
    const resource=specialMatch?evolutionItem({path:note}):stone?'fire-stone':null;
    return requirement?{id:nextId,name:nextName,requirement,level,resource,
     rank:specialMatch&&!level?audited[start+i+1].rank:stone?game.endsWith(' 2')?3:1:0}:null;
   });
   if(steps.includes(null))continue;
   const sources=direct(row,record);
   for(const p of owned.filter(p=>Number(p?.id)===id)){
    sources.push({kind:'owned',confirmed:true,rank:0,method:'already owned',minLevel:p.level,member:p.saveStats?.pid??''});
   }
   for(const initial of sources){
    const key=initial.kind==='owned'?[id,'owned',initial.member??''].join('|'):
     [id,initial.method,initial.place||'',initial.minLevel||0,initial.maxLevel||0,...(initial.conditions||[])].join('|');
    if(routes.some(r=>r.id===key))continue;
    const rank=Math.max(initial.rank,...steps.map(step=>step.rank));
    routes.push({...initial,id:key,rank,startId:id,startName:name,initial,steps,
     kind:initial.kind==='owned'&&!steps.length?'owned':'timed',
     path:steps.length?{stage:title(name),initial,requirement:steps.map(step=>step.requirement).join(' → '),level:steps.at(-1).level}:undefined});
   }
  }
  return routes.sort((a,b)=>Number(b.initial.kind==='owned')-Number(a.initial.kind==='owned')||a.rank-b.rank||
   a.steps.length-b.steps.length||(a.initial.minLevel||0)-(b.initial.minLevel||0)||a.id.localeCompare(b.id));
 }
 function moveReminder(game){
  if(!['Black','White','Black 2','White 2'].includes(game))return null;
  const sequel=game.endsWith(' 2'),place=sequel?'Pokémon World Tournament':'Mistralton City';
  const gate=sequel?'After Clay and the first tournament':'After Clay; reach Mistralton through Chargestone Cave';
  return {rank:5,place,text:'Move Reminder · '+place+' · One Heart Scale · '+gate};
 }
 function evolutionTrainingLevel(id){return auditedLevelEvolutions[id]||1;}
 function scheduleEvolutionMoves(stages,start,cap,choices){
  const selected=[];
  function compatible(){
   let level=start;
   for(const [stage,evolvesAt] of stages.entries()){
    const moves=selected.filter(route=>route.stage===stage);
    if(moves.some(route=>route.at&&route.at<level))return false;
    level=Math.max(level,evolvesAt,...moves.map(route=>route.at||route.minimum||1));
    if(level>cap)return false;
   }
   return true;
  }
  function choose(i){
   if(!compatible())return false;
   if(i===choices.length)return true;
   for(const route of choices[i]){
    selected.push(route);
    if(choose(i+1))return true;
    selected.pop();
   }
   return false;
  }
  return choose(0)?selected:null;
 }
 // Guaranteed local copies are lower bounds. Random drops and purchases are separate routes.
 const unovaItemSources={
  'fire-stone':{name:'Fire Stone',original:[3],sequel:[3,6],renewableOriginal:[1,'dust clouds in Wellspring Cave'],
   renewableSequel:[3,'3 BP at the Battle Subway after the entrance battle']},
  'water-stone':{name:'Water Stone',original:[4],sequel:[5,10],renewableOriginal:[1,'dust clouds in Wellspring Cave'],
   renewableSequel:[3,'3 BP at the Battle Subway after the entrance battle']},
  'leaf-stone':{name:'Leaf Stone',original:[5],sequel:[3,5],renewableOriginal:[1,'dust clouds in Wellspring Cave'],
   renewableSequel:[3,'3 BP at the Battle Subway after the entrance battle']},
  'thunder-stone':{name:'Thunder Stone',original:[5,7],sequel:[3,5],renewableOriginal:[1,'dust clouds in Wellspring Cave'],
   renewableSequel:[3,'3 BP at the Battle Subway after the entrance battle']},
  'sun-stone':{name:'Sun Stone',original:[3],sequel:[3,5],renewableOriginal:[1,'dust clouds in Wellspring Cave'],
   renewableSequel:[5,'dust clouds in Chargestone Cave or later caves']},
  'dusk-stone':{name:'Dusk Stone',original:[6,8],sequel:[6,9,10],renewableOriginal:[1,'dust clouds in Wellspring Cave'],
   renewableSequel:[5,'dust clouds in Chargestone Cave or later caves']},
  'razor-claw':{name:'Razor Claw',original:[10],sequel:[8],renewableOriginal:[3,'48 BP at the Battle Subway'],
   renewableSequel:[3,'8 BP at the Battle Subway after the entrance battle']},
  'razor-fang':{name:'Razor Fang',original:[10],sequel:[6],renewableOriginal:[3,'48 BP at the Battle Subway'],
   renewableSequel:[3,'8 BP at the Battle Subway after the entrance battle']},
  'moon-stone':{name:'Moon Stone',original:[2,6],sequel:[5,8],renewableOriginal:[1,'dust clouds in Wellspring Cave'],
   renewableSequel:[5,'dust clouds in Chargestone Cave']},
  'dawn-stone':{name:'Dawn Stone',original:[8],sequel:[10,10,10],renewableOriginal:[1,'dust clouds in Wellspring Cave'],
   renewableSequel:[5,'dust clouds in Chargestone Cave']},
  'shiny-stone':{name:'Shiny Stone',original:[5,6],sequel:[5,6,10,10],renewableOriginal:[1,'dust clouds in Wellspring Cave'],
   renewableSequel:[5,'dust clouds in Chargestone Cave']},
  'oval-stone':{name:'Oval Stone',original:[10],sequel:[],renewableOriginal:[1,'dust clouds in Wellspring Cave'],
   renewableSequel:[5,'dust clouds in Chargestone Cave']},
  'metal-coat':{name:'Metal Coat',original:[6],sequel:[5,10],renewableOriginal:[10,'the Route 13 treasure hunter or wild holders'],
   renewableSequel:[1,'wild Magnemite holding a Metal Coat']},
  'kings-rock':{name:'King’s Rock',original:[6],sequel:[10,10],renewableOriginal:[0,'Pickup with a Pokémon at Lv 11–30'],
   renewableSequel:[0,'Pickup with a Pokémon at Lv 11–30']},
  protector:{name:'Protector',original:[10],sequel:[10],renewableOriginal:[10,'the Route 13 treasure hunter'],
   renewableSequel:[3,'a developed Join Avenue Antique Shop']},
  'up-grade':{name:'Up-Grade',original:[10],sequel:[10,10],renewableOriginal:[10,'the Route 13 treasure hunter'],
   renewableSequel:[3,'a developed Join Avenue Antique Shop']},
  'dubious-disc':{name:'Dubious Disc',original:[6],sequel:[10],renewableOriginal:[10,'the Route 13 treasure hunter'],
   renewableSequel:[3,'a developed Join Avenue Antique Shop']},
  electirizer:{name:'Electirizer',original:[10],sequel:{'White 2':[8]},renewableOriginal:[10,'the Route 13 treasure hunter'],
   renewableSequel:[3,'a developed Join Avenue Antique Shop']},
  magmarizer:{name:'Magmarizer',original:[],sequel:{'Black 2':[8]},renewableOriginal:[10,'the Route 13 treasure hunter'],
   renewableSequel:[3,'a developed Join Avenue Antique Shop']},
  'deep-sea-tooth':{name:'Deep Sea Tooth',original:[6],sequel:[],renewableOriginal:[6,'wild Red-Striped Basculin holding the item'],
   renewableSequel:[3,'a developed Join Avenue Antique Shop or a wild holder']},
  'deep-sea-scale':{name:'Deep Sea Scale',original:[10],sequel:[],renewableOriginal:[6,'wild Blue-Striped Basculin holding the item'],
   renewableSequel:[3,'a developed Join Avenue Antique Shop or a wild holder']}
 };
 function evolutionItem(timing){
  const path=timing?.path;
  if(path?.resource)return path.resource;
  const text=(path?.requirement||(timing?.kind==='trade'?timing.reason:'')||'').toLowerCase().replace(/['’]/g,'').replace(/-/g,' ');
  return Object.keys(unovaItemSources).find(key=>text.includes(key.replaceAll('-',' ')));
 }
 function resourceBudget(game,deadline,claims){
  if(!['Black','White','Black 2','White 2'].includes(game))return [];
  const sequel=game.endsWith(' 2'),counted=new Map();
  for(const claim of claims){
   if(!unovaItemSources[claim.item])continue;
   if(!counted.has(claim.item))counted.set(claim.item,[]);
   counted.get(claim.item).push(claim);
  }
  return [...counted].map(([item,members])=>{
   const source=unovaItemSources[item];
   const stock=sequel?source.sequel:source.original;
   const local=Array.isArray(stock)?stock:stock[game]||[];
   const guaranteed=local.filter(rank=>rank<=deadline).length;
   const route=sequel?source.renewableSequel:source.renewableOriginal,renewable=route&&route[0]<=deadline?route[1]:'';
   const projected=members.filter(m=>m.projected).length;
   return {item:source.name,members:members.map(m=>m.member),guaranteed,renewable,
    ...(projected?{projected}:{}),shortfall:Math.max(0,members.length-projected-guaranteed)};
  });
 }
 function limitedSpecies(game,rank){
  const gen1=['Red','Blue','Yellow'].includes(game);
  const remakes=['FireRed','LeafGreen'].includes(game);
  const unova=['Black','White','Black 2','White 2'].includes(game);
  const rules=[];
  if(gen1||remakes){
   rules.push({name:'Helix or Dome Fossil',species:[138,140],
    alternative:'Choose one fossil in Mt. Moon. Use a traded Pokémon for the other family.'});
   if(gen1||rank<10){
    rules.push({name:'Celadon Eevee gift',species:[133],alternative:remakes?'Trade another Eevee or breed after unlocking the Four Island Day Care.':'Trade for a second Eevee or its evolution.'});
    rules.push({name:'Fighting Dojo gift',species:[106,107],alternative:remakes?'Trade for the other fighter or breed Tyrogue after unlocking the Four Island Day Care.':'Use a trade to obtain the other fighter.'});
   }
  }
  if(game==='Crystal')rules.push({name:'Crystal Odd Egg',species:[172,173,174,236,238,239,240],renewable:true,
   alternative:'The Odd Egg hatches one random Pokémon. Use breeding or another documented route for additional families.'});
  if(unova){
   const renewable=game.endsWith(' 2');
   rules.push({name:'Unova starter choice',species:[495,498,501],
    alternative:'Only one family is available from the starter gift. Trade for another starter family.'});
   rules.push({name:'Cover or Plume Fossil',species:[564,566],renewable,
    alternative:renewable?'One guaranteed museum choice. Try the Join Avenue Antique Shop or trade for the other fossil.':
     'The local choice gives one of these fossil families. Trade for the other.'});
  }
  if(['Ruby','Sapphire','Omega Ruby','Alpha Sapphire'].includes(game)||game==='Emerald'&&rank<10){
   rules.push({name:'Root or Claw Fossil',species:[345,347],
    alternative:game==='Emerald'?'Find the other fossil in the Desert Underpass after the League.':'Trade for the other fossil family.'});
  }
  return rules;
 }
 root.takDexAcquisitionV77={lookup,levelPath,verifiedAreaRank,hidden,encounterRoute,placeName,machineGate,machineLocation,johtoMoveTiming,limitedSpecies,limitedMachine,evolutionItem,resourceBudget,evolutionTrainingLevel,scheduleEvolutionMoves,plannerRoutes,moveReminder,transferOnly,documentedUnovaAlternative};
})(globalThis);
