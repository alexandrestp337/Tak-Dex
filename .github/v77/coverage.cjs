const fs=require('node:fs');
const vm=require('node:vm');
const {execFileSync}=require('node:child_process');
const path=require('node:path');
const root=path.join(__dirname,'../..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const baselineRef=process.env.TAKDEX_ACQUISITION_BASE||'165f154';
const fromGit=file=>execFileSync('git',['show',baselineRef+':'+file],{cwd:root,encoding:'utf8',stdio:['ignore','pipe','ignore']});
const old=fromGit('app.js');
function engine(app,updated){
 const start=app.indexOf('(function(){',app.indexOf('// DEV6.2: conservative story gates.'));
 const end=app.indexOf('// V74 DEV4: playthrough Team Planner',start);
 const context=vm.createContext({window:null,trainerRostersV57:{}});context.window=context;
 for(const asset of ['unova-v74.js','unova-b2w2-v74.js','tutor-locations.js'])vm.runInContext(read(asset),context);
 let data;try{data=updated?read('acquisition-v77.js'):fromGit('acquisition-v77.js');}catch{}
 if(data)vm.runInContext(data,context);
 vm.runInContext(app.slice(start,end),context);
 return {engine:context.td62Progress,catalog:context};
}
const baseline=engine(old,false),candidate=engine(read('app.js'),true);
const before=baseline.engine,after=candidate.engine;
const games=['Red','Blue','Yellow','Gold','Silver','Crystal','Ruby','Sapphire','Emerald','FireRed','LeafGreen','Diamond','Pearl','Platinum','HeartGold','SoulSilver','Black','White','Black 2','White 2','X','Y','Omega Ruby','Alpha Sapphire','Sun','Moon','Ultra Sun','Ultra Moon','Sword','Shield','Brilliant Diamond','Shining Pearl','Scarlet','Violet'];
const fmt=(n,total)=>total?n+' ('+(100*n/total).toFixed(1)+'%)':'0';
console.log('Baseline '+baselineRef+' · denominators below use the same candidate set before and after.\n');
console.log('| Game | Indexed species assessed | Verified before | Verified after | Partial after | Unresolved | Locations with lower bound |');
console.log('| --- | ---: | ---: | ---: | ---: | ---: | ---: |');
for(const game of games){
 const key=game.toLowerCase().replace(/\s+/g,'-');
 const pack=JSON.parse(read('db74/e-'+key+'.json'));pack.game=game;
 const denominators=process.env.TAKDEX_FIXED_DENOMINATOR?[before]:[before,after];
 const rows=pack.mons.filter(([id,name])=>pack.entries[id]?.length||denominators.some(engine=>['timed','partial'].includes(engine.acquisition(game,{id,name},pack,[],null).kind)));
 const counts=engine=>rows.reduce((out,[id,name])=>{
  const row=engine.acquisition(game,{id,name},pack,[],null);
  if(row.confirmed)out.verified++;
  else if(row.rank!=null)out.partial++;
  return out;
 },{verified:0,partial:0});
 const old=counts(before),next=counts(after),places=new Set(Object.values(pack.entries).flat().map(r=>r[0].split(' · ')[0]));
 const gated=[...places].filter(place=>after.location(game,place)!=null).length;
 console.log(`| ${game} | ${rows.length} | ${fmt(old.verified,rows.length)} | ${fmt(next.verified,rows.length)} | ${next.partial} | ${rows.length-next.verified-next.partial} | ${gated}/${places.size} |`);
}

console.log('\n| Game | Machines listed | Machine timing before | Machine timing after |');
console.log('| --- | ---: | ---: | ---: |');
for(const game of ['Black','White','Black 2','White 2']){
 const assets=candidate.catalog;
 const machines=(game.includes('2')?assets.takDexB2W2:assets.takDexUnovaV74).machines;
 const timed=engine=>machines.filter(m=>engine.moveTiming(game,m.move,[['machine',0]])?.rank!=null).length;
 console.log(`| ${game} | ${machines.length} | ${timed(before)} | ${timed(after)} |`);
}
