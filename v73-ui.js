/* Tak-Dex V73 DEV1 — Battle/Pokédex navigation and 6v6 state preservation. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const dexSelector=$('td73DexSelector'),dexReturn=$('td73DexReturn');
if(!dexSelector||!dexReturn)return;
let previousDexScreen=null;
// The underlying planner keeps the same arrays and DOM while hidden. V72's
// openPlanner called syncPlanner() on every return, which rebuilt both sides.
// Initialize ONCE; only user actions inside 6v6 should rebuild the opponent team.
const plannerButton=$('openPlanner'),previousOpenPlanner=plannerButton.onclick;
let plannerOpened=false;
plannerButton.onclick=function(e){
 if(!plannerOpened){
  previousOpenPlanner?.call(this,e);
  plannerOpened=true;
  window.td73PlannerPreserveGame=true;
 }else openTool('plannerPage',3);
};
function showDex(name,context){
 const game=context==='planner'?$('planGame').value:(current?.game||td66SavedGame()||'');
 if(!game||!games.includes(game))return;
 const origin=context==='planner'?'planner':'battle';
 previousDexScreen={origin,scroll:window.scrollY};
 $('dexGame').value=game;
 td66RememberGame(game,'battle');
 refreshTeamMenus();
 $('dexTeamPoke').value='';
 $('dexInput').value=pretty(name);
 $('dexResults').hidden=true;
 syncDexClear();
 if(typeof td70TeamDexBack!=='undefined')td70TeamDexBack.style.display='none';
 dexSelector.open=false;
 window.takActivate(2);
 dexReturn.textContent=origin==='planner'?'← Back to 6v6 Battle':'← Back to Battle';
 dexReturn.hidden=false;
 $('dexSearch').click();
}
function goBack(){
 const old=previousDexScreen;previousDexScreen=null;dexReturn.hidden=true;
 if(old?.origin==='planner')openTool('plannerPage',3);
 else window.takActivate(1);
 requestAnimationFrame(()=>window.scrollTo(0,old?.scroll||0));
}
dexReturn.addEventListener('click',goBack);
// Main tab uses the simple start state: search open only when nothing is loaded.
$('dexTab').addEventListener('click',()=>{
 previousDexScreen=null;dexReturn.hidden=true;
 dexSelector.open=!$('dexResult').querySelector('.td66-pokemon-card');
});
for(const id of ['teamsTab','battleTab','moreTab'])$(id).addEventListener('click',()=>{previousDexScreen=null;dexReturn.hidden=true});
$('dexSearch').addEventListener('click',()=>{if($('dexTeamPoke').value||$('dexInput').value.trim())dexSelector.open=false});
// Team Builder can also deep-link into Pokédex: close selector for those results.
document.addEventListener('click',e=>{if(e.target.closest('[data-td70-dex],[data-td72-team-dex],[data-td70-team-dex]'))dexSelector.open=false});

let timer=null,start=null,lastHold=null;
function cancelHold(){if(timer!==null)clearTimeout(timer);timer=null;start=null;}
function targetOf(e){const el=e.target?.closest?.('.td73-poke-link[data-td73-mon]');return el?.dataset.td73Mon?.trim()?el:null}
function metadata(el){return {name:el.dataset.td73Mon,context:el.dataset.td73Context||'battle'};}
function comparison(el){const {name,context}=metadata(el);const game=context==='planner'?$('planGame').value:(current?.game||td66SavedGame());
 if(!game||!games.includes(game))return;
 try{window.takDexCompareV71?.openForBattle?.(name,game,context)?.catch?.(err=>console.warn('V73 comparison failed',err));}
 catch(err){console.warn('V73 comparison navigation failed',err)}
}
document.addEventListener('pointerdown',e=>{
 const el=targetOf(e);if(!el||e.button!==0)return;
 cancelHold();start={x:e.clientX,y:e.clientY,el};
 timer=setTimeout(()=>{
  if(start?.el!==el)return;
  timer=null;lastHold={el,at:Date.now()};comparison(el);
 },550);
},true);
document.addEventListener('pointermove',e=>{if(start&&Math.hypot(e.clientX-start.x,e.clientY-start.y)>12)cancelHold()},true);
for(const event of ['pointerup','pointercancel'])document.addEventListener(event,cancelHold,true);
document.addEventListener('contextmenu',e=>{const el=targetOf(e);if(!el)return;e.preventDefault();cancelHold();if(lastHold?.el===el&&Date.now()-lastHold.at<1500)return;lastHold={el,at:Date.now()};comparison(el)},true);
document.addEventListener('click',e=>{
 const el=targetOf(e);
 if(lastHold){
  const suppress=lastHold.el===el&&Date.now()-lastHold.at<1200;lastHold=null;
  if(suppress){e.preventDefault();e.stopImmediatePropagation();return;}
 }
 if(!el)return;
 // The Pokemon link inside a <summary> must not toggle its parent details.
 e.preventDefault();e.stopImmediatePropagation();
 const {name,context}=metadata(el);showDex(name,context);
},true);
document.addEventListener('keydown',e=>{
 const el=targetOf(e);if(!el||!['Enter',' '].includes(e.key))return;
 e.preventDefault();e.stopImmediatePropagation();
 if(e.shiftKey)comparison(el);else{const {name,context}=metadata(el);showDex(name,context)}
},true);
window.takDexBattleNavigationV73={showDex,returnToBattle:goBack};
})();
