const fs=require('node:fs');
const vm=require('node:vm');
const {execFileSync}=require('node:child_process');
const path=require('node:path');
const root=path.join(__dirname,'../..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const baselineRef=process.env.TAKDEX_ACQUISITION_BASE||'90e8432';
const fromGit=(ref,file)=>execFileSync('git',['show',ref+':'+file],{cwd:root,encoding:'utf8',stdio:['ignore','pipe','ignore']});
const old=fromGit(baselineRef,'app.js');
function engine(app,updated,ref=baselineRef){
 const start=app.indexOf('(function(){',app.indexOf('// DEV6.2: conservative story gates.'));
 const end=app.indexOf('// V74 DEV4: playthrough Team Planner',start);
 const context=vm.createContext({window:null,trainerRostersV57:{}});context.window=context;
 for(const asset of ['unova-v74.js','unova-b2w2-v74.js','tutor-locations.js'])vm.runInContext(read(asset),context);
 let data;try{data=updated?read('acquisition-v77.js'):fromGit(ref,'acquisition-v77.js');}catch{}
 if(data)vm.runInContext(data,context);
 vm.runInContext(app.slice(start,end),context);
 return {engine:context.td62Progress,catalog:context};
}
const baseline=engine(old,false),candidate=engine(read('app.js'),true);
const before=baseline.engine,after=candidate.engine;
if(process.argv.includes('--planner-timing')){
 const moves=Object.keys(JSON.parse(read('db74/moves.json')));
 const groups={11:'Black',14:'Black 2'};
 const timing=Object.fromEntries(Object.entries(groups).map(([group,game])=>[group,
  Object.fromEntries(['machine','tutor'].map(method=>[method,
   Object.fromEntries(moves.map(move=>[move,after.moveTiming(game,move,[[method,0]])?.rank]).filter(([,rank])=>rank!=null))
  ]))
 ]));
 console.log(JSON.stringify(timing));
 process.exit(0);
}

const fixed=engine(execFileSync('git',['show','165f154:app.js'],{cwd:root,encoding:'utf8'}),false,'165f154').engine;
const games=['Red','Blue','Yellow','Gold','Silver','Crystal','Ruby','Sapphire','Emerald','FireRed','LeafGreen','Diamond','Pearl','Platinum','HeartGold','SoulSilver','Black','White','Black 2','White 2','X','Y','Omega Ruby','Alpha Sapphire','Sun','Moon','Ultra Sun','Ultra Moon','Sword','Shield','Brilliant Diamond','Shining Pearl','Scarlet','Violet'];
const ledger=[];
const fmt=(n,total)=>total?n+' ('+(100*n/total).toFixed(1)+'%)':'0';
console.log('Baseline '+baselineRef+' · denominators below use the same candidate set before and after.\n');
console.log('| Game | Indexed species assessed | Verified before | Verified after | Partial after | Unresolved | Locations with lower bound |');
console.log('| --- | ---: | ---: | ---: | ---: | ---: | ---: |');
for(const game of games){
 const key=game.toLowerCase().replace(/\s+/g,'-');
 const pack=JSON.parse(read('db74/e-'+key+'.json'));pack.game=game;
 const denominators=process.env.TAKDEX_FIXED_DENOMINATOR?[fixed]:[fixed,before,after];
 const rows=pack.mons.filter(([id,name])=>pack.entries[id]?.length||denominators.some(engine=>['timed','partial'].includes(engine.acquisition(game,{id,name},pack,[],null).kind)));
 const counts=engine=>rows.reduce((out,[id,name])=>{
  const row=engine.acquisition(game,{id,name},pack,[],null);
  if(row.confirmed)out.verified++;
  else if(row.rank!=null)out.partial++;
  return out;
 },{verified:0,partial:0});
 if(process.env.TAKDEX_ACQUISITION_LEDGER){
  const cohort=new Set(rows.map(r=>r[0]));
  for(const [id,name,,regional,parent] of pack.mons){
   const row=after.acquisition(game,{id,name},pack,[],null);
   if(row.confirmed)continue;
   const records=pack.entries[id]||[];
   const routes=records.map(([place,method,min,max,conditions])=>({place,method,min,max,conditions,
    gate:after.encounter(game,[place,method,min,max,conditions])}));
   const next=routes.length?'Verify encounter-specific gates against a version-specific walkthrough and check earlier alternatives.':
    parent?'Check parent routes and exact evolution trigger, item access or trade conditions.':
    'Search version-specific gifts, encounters, statics, trades and transfer restrictions.';
   const restrictions={
    trade:'A trade or transfer is required for the documented route.',
    event:'The documented route requires a distributed item or Pokémon.',
    tradePossible:'One local starter choice. Save choice is needed to decide whether this family is native to the current playthrough.'
   };
   ledger.push({game,id,name,regional,parent,cohort:cohort.has(id),status:restrictions[row.kind]?row.kind:
    row.rank!=null?'partially verified':routes.length?'encounter recorded, progression unverified':'availability unverified',
    reason:row.reason||restrictions[row.kind],routes,
    next:restrictions[row.kind]?'Keep the restriction unless a version-specific alternative route is verified.':next});

  }
 }
 const old=counts(before),next=counts(after),places=new Set(Object.values(pack.entries).flat().map(r=>r[0].split(' · ')[0]));
 const gated=[...places].filter(place=>(after.location(game,place)??candidate.catalog.takDexAcquisitionV77?.verifiedAreaRank(game,place))!=null).length;
 console.log(`| ${game} | ${rows.length} | ${fmt(old.verified,rows.length)} | ${fmt(next.verified,rows.length)} | ${next.partial} | ${rows.length-next.verified-next.partial} | ${gated}/${places.size} |`);
}

console.log('\n| Game | Machines listed | Machine timing before | Machine timing after |');
console.log('| --- | ---: | ---: | ---: |');
const groupedMachines=JSON.parse(read('db74/machines.json'));
for(const game of ['Black','White','Black 2','White 2','Gold','Silver','Crystal']){
 const assets=candidate.catalog;
 const group={Gold:'gold-silver',Silver:'gold-silver',Crystal:'crystal'}[game];
 const machines=group?groupedMachines[group].map(row=>({...row,location:assets.takDexAcquisitionV77?.machineLocation(game,row.item)})):
  (game.includes('2')?assets.takDexB2W2:assets.takDexUnovaV74).machines;
 const timed=engine=>machines.filter(m=>engine.moveTiming(game,m.move,[['machine',0]])?.rank!=null).length;
 if(process.env.TAKDEX_ACQUISITION_LEDGER)for(const machine of machines){
  const timing=after.moveTiming(game,machine.move,[['machine',0]]);
  if(timing?.rank!=null)continue;
  const unavailable=timing?.requirements?.some(r=>r.includes('never distributed'));
  const conditional=!unavailable&&timing?.requirements?.length>0;
  ledger.push({game,item:machine.item,move:machine.move,location:machine.location,status:unavailable?'unobtainable by documented route':
   conditional?'conditional milestone':'timing unverified',requirements:timing?.requirements||[],
   next:unavailable?'Preserve the distribution restriction.':conditional?'Use the seen-count requirement. Badge count alone cannot verify availability.':
    'Verify earliest entrance, field move or NPC requirements against the game-specific machine location.'});

 }
 console.log(`| ${game} | ${machines.length} | ${timed(before)} | ${timed(after)} |`);
}

const names=Object.keys(JSON.parse(read('db74/moves.json')));
console.log('\n| Game | Moves with tutor location | Moves with verified tutor timing |');
console.log('| --- | ---: | ---: |');
for(const game of ['Black','White','Black 2','White 2']){
 const known=names.filter(n=>candidate.catalog.takDexTutorV73.find(game,n).length);
 console.log(`| ${game} | ${known.length} | ${known.filter(n=>after.moveTiming(game,n,[['tutor',0]])?.rank!=null).length} |`);
}

if(process.env.TAKDEX_ACQUISITION_LEDGER){
 const scope=process.env.TAKDEX_LEDGER_GAME;
 const fixedOnly=process.env.TAKDEX_LEDGER_COHORT==='1';
 const output=ledger.filter(row=>(!scope||scope.split(',').includes(row.game))&&(!fixedOnly||row.cohort||row.item));
 fs.writeFileSync(process.env.TAKDEX_ACQUISITION_LEDGER,output.map(row=>JSON.stringify(row)).join('\n')+'\n');
}
