const assert=require('node:assert/strict');
const test=require('node:test');
const fs=require('node:fs');
const {ensure,apiShape,bundleShape}=require('../../offline-data.js');
const BASE='https://pokeapi.co/api/v2/';
const url=BASE+'move/33/';
const valid={id:33,name:'tackle',type:{name:'normal'},damage_class:{name:'physical'},generation:{name:'generation-i'}};
const check=data=>apiShape('move/33/',data);
const response=value=>new Response(JSON.stringify(value));
function memory(initial){
 const records=new Map(initial);
 return {match:async key=>records.get(key)?.clone(),put:async(key,value)=>records.set(key,value.clone())};
}
test('Invalid local and shared bodies cannot count as a saved dependency',async()=>{
 const cache=memory([[url,new Response('<html>broken</html>')]]);
 let requests=0;
 const original=global.fetch;
 global.fetch=async()=>++requests===1?response({id:33}):response(valid);
 try{
  assert.deepEqual(await ensure(cache,url,check,{shared:async()=>response({error:'wrong shape'})}),valid);
  assert.equal(requests,2);
  assert.deepEqual(await (await cache.match(url)).json(),valid);
  await ensure(cache,url,check);
  assert.equal(requests,2);
 }finally{global.fetch=original;}
});
test('Missing dependencies stay incomplete after bounded retries or cancellation',async()=>{
 const cache=memory(),original=global.fetch;
 let requests=0;
 global.fetch=async()=>{requests++;return new Response('missing',{status:404});};
 try{
  await assert.rejects(ensure(cache,url,check),/HTTP 404/);
  assert.equal(requests,2);
  assert.equal(await cache.match(url),undefined);
  const controller=new AbortController();controller.abort();
  await assert.rejects(ensure(cache,url,check,{signal:controller.signal}),{name:'AbortError'});
  assert.equal(requests,2);
 }finally{global.fetch=original;}
});
test('Bundled files retain their published shapes and empty encounter source is explicit',()=>{
 const base=new URL('../../db74/',`file://${__filename}`);
 for(const file of fs.readdirSync(base).filter(file=>file.endsWith('.json'))){
  const parsed=JSON.parse(fs.readFileSync(new URL(file,base)));
  assert.ok(bundleShape(file,parsed),file);
 }
 assert.equal(bundleShape('e-black-2.json',{schema:65,version:'black-2',records:0,entries:{},hasSource:false}),false);
 assert.equal(apiShape('move/34/',valid),false);
});
test('Release metadata and versioned assets agree with the explicit shell manifest',()=>{
 const html=fs.readFileSync(new URL('../../index.html',`file://${__filename}`),'utf8');
 const worker=fs.readFileSync(new URL('../../sw.js',`file://${__filename}`),'utf8');
 const version=html.match(/name="takdex-version" content="([^"]+)"/)[1];
 assert.equal(JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)[1]).softwareVersion,version);
 assert.match(worker,/const NAME='takdex-v78\.0\.0-dev5-rc3'/);
 assert.ok(worker.includes(`name="takdex-version" content="${version}"`));
 const shell=JSON.parse(worker.match(/const SHELL=(.*);/)[1]);
 const dependencies=[...html.matchAll(/<(?:script\s+src|link[^>]+href)="([^"]+\.(?:js|css|webmanifest)(?:\?[^"]+)?)"/g)]
  .map(([_,file])=>'./'+file);
 assert.deepEqual(shell.filter(file=>/\.(js|css|webmanifest)(\?|$)/.test(file)),dependencies);
 assert.ok(!shell.some(file=>/unova-.*\.jpg|sinnoh-.*\.png|\/db74\/e-/.test(file)));
 assert.match(html,/Developed by WHOASP/);
});
