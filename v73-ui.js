/* Tak-Dex V73 DEV1 — Battle/Pokédex navigation and 6v6 state preservation. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const dexReturn=$('td73DexReturn');
if(!dexReturn)return;
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
// DEV7.5: one result-local contextual Back for every external Pokédex origin.
function parkBack(){
 const result=$('dexResult');result.before(dexReturn);dexReturn.hidden=!previousDexScreen;
}
function mountBack(){
 const card=$('dexResult').querySelector('.td66-pokemon-card');
 if(!card||!previousDexScreen){parkBack();return;}
 let row=card.querySelector('.td75-dex-back-row');
 if(!row){row=document.createElement('div');row.className='td75-dex-back-row';card.prepend(row);}
 row.append(dexReturn);dexReturn.hidden=false;
}
function clearBack(origin){if(origin&&previousDexScreen?.origin!==origin)return;previousDexScreen=null;parkBack();}
function setBack(origin,restore){previousDexScreen={origin,restore};dexReturn.textContent='← Back';parkBack();}
function showDex(name,context,options={}){
 const game=options.game||(context==='maps'?$('mapsGame').value:context==='planner'?$('planGame').value:context==='comparison'?$('td56Game').value:context==='team-planner'?$('td4Game').value:(current?.game||td66SavedGame()||''));
 if(!game||!games.includes(game))return;
 const sections=[...document.querySelectorAll('main > section')],visible=sections.filter(el=>!el.hidden),tabs=['teamsTab','battleTab','dexTab','moreTab'],selected=tabs.findIndex(id=>$(id).classList.contains('selected')),scroll=window.scrollY;
 setBack(context,()=>{for(const el of sections)el.hidden=!visible.includes(el);tabs.forEach((id,i)=>{$(id).classList.toggle('selected',i===selected);$(id).setAttribute('aria-current',i===selected?'page':'false')});requestAnimationFrame(()=>window.scrollTo(0,scroll));});
 $('dexGame').value=game;refreshTeamMenus();$('dexInput').value=td41PokemonLabel(name);$('dexResults').hidden=true;syncDexClear();
 window.takActivate(2);for(const el of sections)el.hidden=el.id!=='dexPage';
 if(Number(options.id)>0)$('dexInput').dataset.evolutionId=String(options.id);else $('dexInput').value=String(name).replace(/-/g,' ');
 td77SearchDex();delete $('dexInput').dataset.evolutionId;
}
function goBack(){const old=previousDexScreen;if(!old)return;clearBack();old.restore?.();}
dexReturn.addEventListener('click',goBack);
$('dexTab').addEventListener('click',()=>clearBack());
for(const id of ['teamsTab','battleTab','moreTab'])$(id).addEventListener('click',()=>clearBack());

// DEV3.2: Dex-only hold. Arm during press; open on release after the originating click.
// No modal is placed underneath the finger while it is still down.
let active=null,release=null;
window.td3HoldActive=()=>!!active;
const selector='#dexPage [data-td71-quick-compare],#dexPage [data-dex-evolution],#typeExplorerPage [data-explore-pokemon]';
function targetOf(e){return e.target?.closest?.(selector)||null;}
function metadata(el){const name=el?.dataset.td71QuickCompare||el?.dataset.dexEvolution||el?.dataset.explorePokemon;const game=el?.closest('#typeExplorerPage')?$('typeExplorerGame').value:$('dexGame').value;return name?{name,game:game||td66SavedGame()}:null;}
function clear(){if(active?.timer)clearTimeout(active.timer);active=null;}
function begin(el,x,y){const data=metadata(el);if(!data||active||$('td71CompareQuick')?.open)return;release=null;active={...data,el,x,y,armed:false};active.timer=setTimeout(()=>{if(active)active.armed=true;},500);}
function moved(x,y){if(active&&Math.hypot(x-active.x,y-active.y)>12)clear();}
function finish(){if(!active)return;const held=active;clear();if(!held.armed)return;release={el:held.el,at:Date.now()};setTimeout(()=>{window.tdDev2QuickCompare?.(held.name,held.game);},60);}
const capture=true;
document.addEventListener('pointerdown',e=>{const el=targetOf(e);if(el&&e.button===0&&e.isPrimary!==false)begin(el,e.clientX,e.clientY);},capture);
document.addEventListener('pointermove',e=>moved(e.clientX,e.clientY),capture);
document.addEventListener('pointerup',finish,capture);
document.addEventListener('pointercancel',e=>{if(e.pointerType!=='touch')clear();},capture);
document.addEventListener('touchstart',e=>{const t=e.touches[0],el=targetOf(e);if(e.touches.length===1&&el&&t)begin(el,t.clientX,t.clientY);else if(e.touches.length>1)clear();},{capture:true,passive:true});
document.addEventListener('touchmove',e=>{const t=e.touches[0];if(t)moved(t.clientX,t.clientY);},{capture:true,passive:true});
document.addEventListener('touchend',finish,capture);
document.addEventListener('touchcancel',()=>{if(active?.armed)finish();else clear();},capture);
document.addEventListener('contextmenu',e=>{const el=targetOf(e);if(!el)return;e.preventDefault();if(active){active.armed=true;return;}if(e.button===2){const data=metadata(el);if(data)window.tdDev2QuickCompare?.(data.name,data.game);}},capture);
document.addEventListener('dragstart',e=>{if(targetOf(e))e.preventDefault();},capture);
document.addEventListener('click',e=>{const el=targetOf(e);if(release&&Date.now()-release.at<1000&&el===release.el){release=null;e.preventDefault();e.stopImmediatePropagation();return;}const link=e.target?.closest?.('.td73-poke-link[data-td73-mon]');if(link){e.preventDefault();e.stopImmediatePropagation();showDex(link.dataset.td73Mon,link.dataset.td73Context,{id:link.dataset.td73Id});}},capture);
document.addEventListener('keydown',e=>{if(!['Enter',' '].includes(e.key))return;const data=metadata(targetOf(e));if(e.shiftKey&&data){e.preventDefault();e.stopImmediatePropagation();window.tdDev2QuickCompare?.(data.name,data.game);return;}const link=e.target?.closest?.('.td73-poke-link[data-td73-mon]');if(link&&!e.shiftKey){e.preventDefault();e.stopImmediatePropagation();showDex(link.dataset.td73Mon,link.dataset.td73Context,{id:link.dataset.td73Id});}},capture);
window.takDexBattleNavigationV73={showDex,returnToBattle:goBack,setBack,clearBack,mountBack,parkBack};
})();
