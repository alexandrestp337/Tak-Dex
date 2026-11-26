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
 const canonicalAliases={
  'nature-sanctuary':'Nature Preserve','unova-victory-road-2':'Victory Road','unova-victory-road':'Victory Road',
  'relic-castle':'Relic Castle','marvelous-bridge':'Marvelous Bridge'
 };
 function placeName(value,game){
  const [raw,room]=String(value||'').split(' · ');
  const base=canonicalAliases[raw]||raw.replace(/^unova-/,'').replace(/-/g,' ').replace(/(^| )([a-z])/g,(_,space,c)=>space+c.toUpperCase());
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
 function encounterRoute(game,row){
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
  if(!['Black','White','Black 2','White 2'].includes(game)||!pack?.mons||!auditedLevelEvolutions[id])return null;
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
 function lookup(game,name,encounters){
  const sequel=game==='Black 2'||game==='White 2';
  if(!sequel&&game!=='Black'&&game!=='White')return null;
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
 function machineLocation(game,item){
  return ['Red','Blue','Yellow'].includes(game)?kantoMachineLocations[item]:null;
 }
 // Kanto's repeatable shop and Game Corner machines are excluded.
 const kantoSingleUse=new Set([
  'swords-dance','whirlwind','toxic','body-slam','double-edge','bubble-beam','water-gun','ice-beam',
  'blizzard','pay-day','counter','seismic-toss','rage','mega-drain','solar-beam','thunderbolt',
  'thunder','earthquake','fissure','dig','psychic','teleport','mimic','bide',
  'metronome','self-destruct','fire-blast','swift','skull-bash','soft-boiled','dream-eater','sky-attack',
  'rest','thunder-wave','psywave','explosion','rock-slide','tri-attack',
 ]);
 function limitedMachine(game,name){
  if(['Red','Blue','Yellow'].includes(game))return kantoSingleUse.has(name);
  if(['Gold','Silver','Crystal','FireRed','LeafGreen'].includes(game))return name==='earthquake';
  return false;
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
  if(unova){
   const renewable=game.endsWith(' 2');
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
 root.takDexAcquisitionV77={lookup,levelPath,hidden,encounterRoute,placeName,machineGate,machineLocation,limitedSpecies,limitedMachine};
})(globalThis);
