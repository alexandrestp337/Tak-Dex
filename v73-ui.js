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

const selector='#dexPage [data-td71-quick-compare],#dexPage [data-dex-evolution],#typeExplorerPage [data-explore-pokemon]';
td77RegisterHold(selector,element=>{
 const inExplorer=element.closest('#typeExplorerPage');
 const name=element.dataset.td71QuickCompare||element.dataset.dexEvolution||element.dataset.explorePokemon;
 const game=(inExplorer?$('typeExplorerGame').value:$('dexGame').value)||td66SavedGame();
 if(name)window.tdDev2QuickCompare?.(name,game,inExplorer?'type-explorer':'dex');
});
document.addEventListener('click',event=>{
 const link=event.target?.closest?.('.td73-poke-link[data-td73-mon]');
 if(link){event.preventDefault();event.stopImmediatePropagation();showDex(link.dataset.td73Mon,link.dataset.td73Context,{id:link.dataset.td73Id});}
},true);
document.addEventListener('keydown',event=>{
 if(event.shiftKey||!['Enter',' '].includes(event.key))return;
 const link=event.target?.closest?.('.td73-poke-link[data-td73-mon]');
 if(link){event.preventDefault();event.stopImmediatePropagation();showDex(link.dataset.td73Mon,link.dataset.td73Context,{id:link.dataset.td73Id});}
},true);
window.takDexBattleNavigationV73={showDex,returnToBattle:goBack,setBack,clearBack,mountBack,parkBack};
})();
