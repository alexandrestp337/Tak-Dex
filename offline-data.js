/* Shared read-only checks for PokéAPI records and the bundled offline format. */
(function(global){
 const object=value=>!!value&&typeof value==='object'&&!Array.isArray(value);
 const text=value=>typeof value==='string'&&value.length>0;
 const list=(value,check)=>Array.isArray(value)&&value.every(check);
 const url=(value,kind)=>text(value)&&new RegExp('^https://pokeapi\\.co/api/v2/'+kind+'/[0-9]+/?$').test(value);
 const named=value=>object(value)&&text(value.name);
 const version=value=>named(value?.version_group);
 const machineRows=value=>list(value,row=>object(row)&&/^(tm|hm|tr)\d+$/i.test(row.item)&&text(row.move));
 function apiShape(path,value){
  if(!object(value))return false;
  const [route,query]=String(path).split('?'),[kind,id]=route.replace(/^\/+|\/+$/g,'').split('/');
  if(!id&&query?.includes('limit=')){
   const params=new URLSearchParams(query),limit=Number(params.get('limit')),offset=Number(params.get('offset'));
   return Number.isInteger(value.count)&&value.count>0&&limit>0&&Array.isArray(value.results)&&
    value.results.length===Math.min(limit,Math.max(0,value.count-offset))&&value.results.every(row=>url(row?.url,kind)&&(kind==='evolution-chain'||named(row)));
  }
  if(!Number.isInteger(value.id)||value.id<1||/^\d+$/.test(id)&&value.id!==Number(id))return false;
  switch(kind){
   case 'pokemon':return named(value)&&named(value.species)&&list(value.types,row=>named(row?.type))&&value.types.length>0&&
    list(value.stats,row=>named(row?.stat)&&Number.isFinite(row.base_stat))&&value.stats.length>=5&&
    list(value.moves,row=>named(row?.move)&&url(row.move.url,'move')&&list(row.version_group_details,version));
   case 'pokemon-species':return named(value)&&url(value.evolution_chain?.url,'evolution-chain');
   case 'evolution-chain':{
    const valid=(row,depth=0)=>depth<12&&named(row?.species)&&list(row.evolves_to,child=>valid(child,depth+1));
    return valid(value.chain);
   }
   case 'move':return named(value)&&named(value.type)&&named(value.damage_class)&&named(value.generation);
   case 'machine':return named(value.item)&&named(value.move)&&named(value.version_group);
   default:return true;
  }
 }
 function encounterShape(value,slug){
  return object(value)&&[55,64,65].includes(value.schema)&&(!slug||value.version===slug)&&
   Number.isInteger(value.records)&&value.records>=0&&typeof value.hasSource==='boolean'&&
   value.hasSource===(value.records>0)&&Array.isArray(value.mons)&&value.mons.length>0&&
   value.mons.every(row=>Array.isArray(row)&&Number.isInteger(row[0])&&text(row[1])&&Array.isArray(row[2]))&&
   object(value.entries)&&Object.values(value.entries).every(rows=>list(rows,row=>Array.isArray(row)&&row.length>=4&&text(row[0])&&text(row[1])))&&
   (!value.hasSource||Object.keys(value.entries).length>0);
 }
 function bundleShape(file,value){
  if(!object(value))return false;
  if(file.startsWith('e-'))return encounterShape(value,file.slice(2,-5));
  if(file==='index.json')return ['pokemon','groups','methods','moves','species','coverage'].every(k=>object(value[k])&&Object.keys(value[k]).length)&&list(value.chunks,Number.isInteger)&&value.chunks.length>0;
  if(file==='machines.json')return Object.keys(value).length>0&&Object.values(value).every(machineRows);
  if(file==='moves.json')return Object.keys(value).length>0&&Object.values(value).every(row=>apiShape('move/'+row?.id,row));
  if(file==='gen5-save-names.json')return ['items','abilities'].every(k=>Array.isArray(value[k])&&value[k].length>1);
  if(/^p\d+\.json$/.test(file))return Object.keys(value).length>0&&Object.values(value).every(row=>Array.isArray(row)&&text(row[0])&&[4,6,8,10].every(i=>Array.isArray(row[i])));
  if(file==='planner-v77.json')return Object.keys(value).length>0&&Object.values(value).every(row=>Array.isArray(row)&&Array.isArray(row[1])&&row[1].length===6);
  return true;
 }
 async function read(response,valid){
  if(!response?.ok)return null;
  try{const data=await response.json();return valid(data)?data:null;}catch{return null}
 }
 async function request(url,options={},consume=response=>response){
  const {signal,...init}=options,controller=new AbortController();
  const abort=()=>controller.abort(signal.reason);
  if(signal?.aborted)abort();
  else signal?.addEventListener('abort',abort,{once:true});
  const timeout=setTimeout(()=>controller.abort(),12000);
  try{
   const response=await fetch(url,{...init,signal:controller.signal});
   if(!response.ok)throw Error('HTTP '+response.status);
   return await consume(response);
  }finally{clearTimeout(timeout);signal?.removeEventListener('abort',abort);}
 }
 async function ensure(cache,url,valid,{signal,shared}={}){
  const own=await cache.match(url);
  const present=await read(own,valid);
  if(present)return present;
  const other=await shared?.(url);
  const available=await read(other?.clone(),valid);
  if(available){await cache.put(url,other);return available;}
  for(let attempt=0;attempt<2;attempt++){
   if(signal?.aborted)throw signal.reason;
   try{
    const data=await request(url,{cache:'no-store',signal},response=>response.json());
    if(!valid(data))throw Error('Invalid record: '+url);
    await cache.put(url,new Response(JSON.stringify(data),{headers:{'Content-Type':'application/json'}}));
    return data;
   }catch(error){if(attempt===1||signal?.aborted)throw error;}
  }
 }
 const helpers={apiShape,bundleShape,encounterShape,machineRows,read,request,ensure};
 if(typeof module!=='undefined'&&module.exports)module.exports=helpers;
 else global.takDexOfflineData=helpers;
})(globalThis);
