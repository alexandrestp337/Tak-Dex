const TYPES=["Normal","Fire","Water","Electric","Grass","Ice","Fighting","Poison","Ground","Flying","Psychic","Bug","Rock","Ghost","Dragon","Dark","Steel","Fairy"];
const chart={
Normal:{Rock:.5,Ghost:0,Steel:.5},Fire:{Fire:.5,Water:.5,Grass:2,Ice:2,Bug:2,Rock:.5,Dragon:.5,Steel:2},
Water:{Fire:2,Water:.5,Grass:.5,Ground:2,Rock:2,Dragon:.5},Electric:{Water:2,Electric:.5,Grass:.5,Ground:0,Flying:2,Dragon:.5},
Grass:{Fire:.5,Water:2,Grass:.5,Poison:.5,Ground:2,Flying:.5,Bug:.5,Rock:2,Dragon:.5,Steel:.5},
Ice:{Fire:.5,Water:.5,Grass:2,Ice:.5,Ground:2,Flying:2,Dragon:2,Steel:.5},Fighting:{Normal:2,Ice:2,Rock:2,Dark:2,Steel:2,Poison:.5,Flying:.5,Psychic:.5,Bug:.5,Ghost:0,Fairy:.5},
Poison:{Grass:2,Poison:.5,Ground:.5,Rock:.5,Ghost:.5,Steel:0,Fairy:2},Ground:{Fire:2,Electric:2,Grass:.5,Poison:2,Flying:0,Bug:.5,Rock:2,Steel:2},
Flying:{Electric:.5,Grass:2,Fighting:2,Bug:2,Rock:.5,Steel:.5},Psychic:{Fighting:2,Poison:2,Psychic:.5,Dark:0,Steel:.5},
Bug:{Fire:.5,Grass:2,Fighting:.5,Poison:.5,Flying:.5,Psychic:2,Ghost:.5,Dark:2,Steel:.5,Fairy:.5},
Rock:{Fire:2,Ice:2,Fighting:.5,Ground:.5,Flying:2,Bug:2,Steel:.5},Ghost:{Normal:0,Psychic:2,Ghost:2,Dark:.5},
Dragon:{Dragon:2,Steel:.5,Fairy:0},Dark:{Fighting:.5,Psychic:2,Ghost:2,Dark:.5,Fairy:.5},
Steel:{Fire:.5,Water:.5,Electric:.5,Ice:2,Rock:2,Steel:.5,Fairy:2},Fairy:{Fire:.5,Fighting:2,Poison:.5,Dragon:2,Dark:2,Steel:.5}};
const evolutions={golbat:{name:"Crobat",types:["Poison","Flying"]},zubat:{name:"Golbat",types:["Poison","Flying"]},machop:{name:"Machoke",types:["Fighting"]},machoke:{name:"Machamp",types:["Fighting"]},aron:{name:"Lairon",types:["Steel","Rock"]},lairon:{name:"Aggron",types:["Steel","Rock"]},ralts:{name:"Kirlia",types:["Psychic","Fairy"]},kirlia:{name:"Gardevoir",types:["Psychic","Fairy"]},electrike:{name:"Manectric",types:["Electric"]},mudkip:{name:"Marshtomp",types:["Water","Ground"]},marshtomp:{name:"Swampert",types:["Water","Ground"]},makuhita:{name:"Hariyama",types:["Fighting"]}};
let teams=JSON.parse(localStorage.getItem("poketact-teams")||"[]"),active=null,editingSlot=null;
const $=id=>document.getElementById(id), save=()=>localStorage.setItem("poketact-teams",JSON.stringify(teams));
function initSelects(){for(const id of ["type1","type2","opponentType"]){$(id).innerHTML=(id==="type2"?'<option value="">—</option>':'')+TYPES.map(t=>`<option>${t}</option>`).join("")}}
function renderTeams(){$("teamList").innerHTML=teams.length?teams.map(t=>`<div class="team-card"><div><b>${esc(t.name)}</b><small>${esc(t.game)} · ${t.pokemon.filter(Boolean).length}/6 Pokémon</small></div><div><button onclick="openTeam('${t.id}')">Open team</button> <button class="ghost" onclick="deleteTeam('${t.id}')">Delete</button></div></div>`).join(""):'<p>No teams yet. Create your first team.</p>'}
function esc(s){return String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
window.openTeam=id=>{active=teams.find(t=>t.id===id);$("editor").classList.remove("hidden");$("teamTitle").textContent=active.name;$("teamGame").textContent=active.game;renderSlots();$("editor").scrollIntoView({behavior:"smooth"})};
window.deleteTeam=id=>{if(confirm("Delete this team?")){teams=teams.filter(t=>t.id!==id);save();renderTeams();$("editor").classList.add("hidden")}};
function renderSlots(){$("slots").innerHTML=Array.from({length:6},(_,i)=>{let p=active.pokemon[i];return `<article class="slot">${p?`<h3>${esc(p.name)} <small>Lv. ${p.level}</small></h3><p>${p.types.join(" / ")}</p><p>${p.moves.map(esc).join(" · ")||"No moves entered"}</p><button onclick="editPokemon(${i})">Edit</button>${evolutions[p.name.toLowerCase()]?`<button onclick="evolve(${i})">⇧ Evolve</button>`:""}`:`<h3>Empty slot ${i+1}</h3><p>Add a Pokémon to your team.</p><button onclick="editPokemon(${i})">＋ Add Pokémon</button>`}</article>`}).join("")}
window.editPokemon=i=>{editingSlot=i;const p=active.pokemon[i]||{name:"",level:50,types:["Normal"],moves:[]};$("pokeName").value=p.name;$("pokeLevel").value=p.level;$("type1").value=p.types[0]||"Normal";$("type2").value=p.types[1]||"";$("moves").value=p.moves.join("\n");$("pokemonDialog").showModal()};
window.evolve=i=>{const p=active.pokemon[i],e=evolutions[p.name.toLowerCase()];if(!e)return;if(!confirm(`Evolve ${p.name} into ${e.name}? Your moves and level will be kept.`))return;p.name=e.name;p.types=e.types;save();renderSlots()};
$("newTeam").onclick=()=>$("teamDialog").showModal();$("teamForm").onsubmit=e=>{if(e.submitter?.value==="cancel")return;e.preventDefault();const t={id:crypto.randomUUID(),name:$("teamName").value.trim(),game:$("game").value,pokemon:Array(6).fill(null)};teams.push(t);save();renderTeams();$("teamDialog").close();$("teamName").value="";openTeam(t.id)};
$("closeEditor").onclick=()=>$("editor").classList.add("hidden");
$("pokemonForm").onsubmit=e=>{if(e.submitter?.value==="cancel")return;e.preventDefault();const types=[$("type1").value,$("type2").value].filter(Boolean);active.pokemon[editingSlot]={name:$("pokeName").value.trim(),level:+$("pokeLevel").value,types,moves:$("moves").value.split("\n").map(s=>s.trim()).filter(Boolean)};save();renderSlots();renderTeams();$("pokemonDialog").close()};
function multiplier(attack,defender){return defender.reduce((n,t)=>n*(chart[attack]?.[t]??1),1)}
function renderBattle(){if(!active){$("battleResults").innerHTML="<p>Open a saved team first, then return here.</p>";return}const foe=$("opponentType").value;$("battleResults").innerHTML=active.pokemon.map(p=>{if(!p)return"";const m=multiplier(foe,p.types);return `<div class="result"><b>${esc(p.name)}</b> <span class="${m>1?'bad':m<1?'good':''}">${m}× incoming ${foe} damage</span><small> · ${p.types.join("/")}</small></div>`}).join("")||"<p>Your team is empty.</p>"}
$("opponentType").onchange=renderBattle;
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x===b));$("teamsView").classList.toggle("hidden",b.dataset.view!=="teams");$("battleView").classList.toggle("hidden",b.dataset.view!=="battle");renderBattle()});
$("themeBtn").onclick=()=>{document.body.classList.toggle("light");localStorage.setItem("poketact-light",document.body.classList.contains("light"))};
if(localStorage.getItem("poketact-light")==="true")document.body.classList.add("light");
initSelects();renderTeams();if("serviceWorker"in navigator)navigator.serviceWorker.register("./sw.js");
