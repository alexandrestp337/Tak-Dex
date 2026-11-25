// DEV7.6: version-pinned local reference snapshot. No data is written to saved teams here.
(function(){
 const base='https://pokeapi.co/api/v2/', pending=new Map(), records=new Map();
 const ref=(name,kind,id)=>({name,...(kind&&id?{url:base+kind+'/'+id+'/'}:{})});
 const read=file=>{if(!pending.has(file))pending.set(file,fetch(new URL('db74/'+file,document.baseURI)).then(r=>{if(!r.ok)throw Error('Bundled reference '+file+' unavailable');return r.json()}).catch(e=>{pending.delete(file);throw e}));return pending.get(file)};
 const gen=n=>'generation-'+['','i','ii','iii','iv','v','vi','vii','viii','ix'][n];
 const types=arr=>arr.map(([slot,name])=>({slot,type:ref(name)}));
 const abilities=arr=>arr.map(([slot,name,is_hidden])=>({slot,ability:name?ref(name):null,is_hidden}));
 const stats=arr=>arr.map(([name,base_stat,effort])=>({stat:ref(name),base_stat,effort}));
 async function pokemon(id){
  const k='p'+id;if(records.has(k))return records.get(k);
  const ix=await read('index.json'),chunk=Math.floor(id/64);if(!ix.chunks.includes(chunk))return null;
  const row=(await read('p'+chunk+'.json'))[id];if(!row)return null;
  const [name,sp,height,weight,t,pt,a,pa,s,ps,learn]=row;
  const byMove=new Map();for(const [mid,g,method,level] of learn){let list=byMove.get(mid);if(!list)byMove.set(mid,list=[]);list.push({version_group:ref(ix.groups[g]),move_learn_method:ref(ix.methods[method]),level_learned_at:level})}
  const art='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';
  const p={id,name,height,weight,species:ref(ix.species[sp],'pokemon-species',sp),types:types(t),past_types:Object.entries(pt).map(([g,v])=>({generation:ref(gen(g)),types:types(v)})),abilities:abilities(a),past_abilities:Object.entries(pa).map(([g,v])=>({generation:ref(gen(g)),abilities:abilities(v)})),stats:stats(s),past_stats:Object.entries(ps).map(([g,v])=>({generation:ref(gen(g)),stats:stats(v)})),moves:[...byMove].map(([mid,version_group_details])=>({move:ref(ix.moves[mid],'move',mid),version_group_details})),sprites:{front_default:art+id+'.png',other:{'official-artwork':{front_default:art+'other/official-artwork/'+id+'.png'}}}};
  // Limit inflated in-memory records; underlying compact chunks remain available.
  if(records.size>=64)records.delete(records.keys().next().value);records.set(k,p);return p;
 }
 async function api(path){
  const clean=path.replace(/^\/+|\/+$/g,'');
  if(clean==='pokemon?limit=2000'||clean==='move?limit=2000'){
   const ix=await read('index.json'),isPokemon=clean.startsWith('pokemon');const list=isPokemon?Object.entries(ix.pokemon).map(([name,id])=>ref(name,'pokemon',id)):Object.entries(ix.moves).map(([id,name])=>ref(name,'move',id));return {count:list.length,next:null,previous:null,results:list};
  }
  const m=clean.match(/^(pokemon|move)\/([^/?]+)$/);if(!m)return null;
  const ix=await read('index.json'),key=decodeURIComponent(m[2]).toLowerCase();
  if(m[1]==='pokemon'){const id=/^\d+$/.test(key)?Number(key):ix.pokemon[key];return id?pokemon(id):null}
  const name=/^\d+$/.test(key)?ix.moves[key]:key;return (await read('moves.json'))[name]||null;
 }
 async function encounter(game){const name=game.toLowerCase().replace(/ /g,'-');const ix=await read('index.json');if(!Object.hasOwn(ix.coverage,name))return null;const pack=await read('e-'+name+'.json');if(pack.schema!==65||pack.version!==name)throw Error('Invalid bundled encounter index');return {...pack,game};}
 async function machines(group){const rows=(await read('machines.json'))[group];return rows?rows.slice().sort((a,b)=>a.item.localeCompare(b.item,undefined,{numeric:true})):null;}
 window.takDexDB74={api,encounter,machines};
})();
