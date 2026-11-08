/* Tak-Dex V73 DEV5.2 — Platinum interactive HD in-game-style Sinnoh map.
 * Game-specific map coordinates use a 1254x1254 recreation of the Platinum
 * Town Map artwork. Road strokes follow the illustration, not world distances.
 * Non-Platinum atlas data is kept intact for later staged rollout.
 */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const gameRegions={
 Red:['kanto'],Blue:['kanto'],Yellow:['kanto'],
 Gold:['johto','kanto'],Silver:['johto','kanto'],Crystal:['johto','kanto'],
 Ruby:['hoenn'],Sapphire:['hoenn'],Emerald:['hoenn'],
 FireRed:['kanto','sevii-islands'],LeafGreen:['kanto','sevii-islands'],
 Diamond:['sinnoh'],Pearl:['sinnoh'],Platinum:['sinnoh'],
 HeartGold:['johto','kanto'],SoulSilver:['johto','kanto'],
 Black:['unova'],White:['unova'],'Black 2':['unova'],'White 2':['unova'],
 X:['kalos'],Y:['kalos'],'Omega Ruby':['hoenn'],'Alpha Sapphire':['hoenn'],
 Sun:['alola'],Moon:['alola'],'Ultra Sun':['alola'],'Ultra Moon':['alola'],
 Sword:['galar'],Shield:['galar'],'Brilliant Diamond':['sinnoh'],'Shining Pearl':['sinnoh'],
 Scarlet:['paldea'],Violet:['paldea']
};
// Format: name|x|y|category. Positions are intentionally schematic, not surveyed.
const atlas={
 kanto:`Pallet Town|36|85|town;Viridian City|32|72|town;Pewter City|34|55|town;Cerulean City|61|39|town;Vermilion City|65|63|town;Celadon City|41|53|town;Saffron City|56|54|town;Lavender Town|79|51|town;Fuchsia City|53|78|town;Cinnabar Island|24|89|town;Indigo Plateau|23|37|landmark;Mt. Moon|44|41|landmark;Rock Tunnel|77|36|landmark;Victory Road|20|50|landmark;Seafoam Islands|40|88|landmark;Pokémon Mansion|21|86|landmark;Route 4|53|42|route;Route 10|80|41|route;Route 12|77|64|route;Route 17|38|70|route`,
 johto:`New Bark Town|88|80|town;Cherrygrove City|73|81|town;Violet City|62|52|town;Azalea Town|49|79|town;Goldenrod City|35|72|town;Ecruteak City|42|46|town;Olivine City|22|57|town;Cianwood City|14|76|town;Mahogany Town|67|44|town;Blackthorn City|87|49|town;Lake of Rage|66|28|landmark;Ruins of Alph|57|62|landmark;Ilex Forest|41|78|landmark;Frontier Access|12|87|landmark;National Park|36|58|landmark;Mt. Mortar|55|43|landmark;Dragon's Den|88|41|landmark;Mt. Silver|21|30|landmark;Bell Tower|44|40|landmark;Whirl Islands|20|74|landmark`,
 'sevii-islands':`One Island|25|22|town;Two Island|45|31|town;Three Island|62|38|town;Four Island|79|48|town;Five Island|66|66|town;Six Island|43|77|town;Seven Island|22|83|town;Mt. Ember|22|12|landmark;Cape Brink|45|19|landmark;Lost Cave|72|62|landmark;Tanoby Ruins|27|94|landmark`,
 hoenn:`Littleroot Town|45|81|town;Oldale Town|45|72|town;Petalburg City|31|68|town;Rustboro City|24|48|town;Dewford Town|15|84|town;Slateport City|54|82|town;Mauville City|56|59|town;Verdanturf Town|41|60|town;Fallarbor Town|46|26|town;Lavaridge Town|39|40|town;Fortree City|72|45|town;Lilycove City|83|52|town;Mossdeep City|91|68|town;Sootopolis City|81|79|town;Pacifidlog Town|72|91|town;Ever Grande City|93|90|town;Mt. Pyre|76|66|landmark;Mt. Chimney|39|33|landmark;Sky Pillar|79|96|landmark;Seafloor Cavern|86|83|landmark;Victory Road|94|87|landmark;Battle Frontier|32|90|landmark`,
 sinnoh:`Twinleaf Town|20|80|town;Sandgem Town|28|82|town;Jubilife City|31|66|town;Oreburgh City|50|70|town;Floaroma Town|34|50|town;Eterna City|50|43|town;Hearthome City|61|62|town;Solaceon Town|66|55|town;Veilstone City|81|59|town;Pastoria City|66|82|town;Celestic Town|58|48|town;Canalave City|16|61|town;Snowpoint City|59|15|town;Sunyshore City|88|73|town;Pokémon League|91|45|landmark;Mt. Coronet|54|52|landmark;Lake Verity|16|77|landmark;Lake Valor|76|73|landmark;Lake Acuity|58|23|landmark;Wayward Cave|45|55|landmark;Route 212|61|75|route;Route 210|65|51|route;Route 228|84|29|route;Survival Area|70|19|town;Stark Mountain|77|8|landmark;Iron Island|12|40|landmark;Route 216|44|26|route;Route 217|49|18|route`,
 unova:`Nuvema Town|76|87|town;Accumula Town|73|79|town;Striaton City|66|72|town;Nacrene City|56|75|town;Castelia City|39|77|town;Nimbasa City|39|60|town;Driftveil City|26|57|town;Mistralton City|28|41|town;Icirrus City|45|34|town;Opelucid City|64|38|town;Lacunosa Town|77|34|town;Undella Town|84|53|town;Black City|76|68|town;White Forest|80|72|landmark;Virbank City|18|81|town;Aspertia City|14|90|town;Floccesy Town|22|86|town;Humilau City|85|40|town;Victory Road|53|17|landmark;Pokémon League|53|10|landmark;Relic Castle|48|48|landmark;Chargestone Cave|25|46|landmark;Giant Chasm|75|26|landmark`,
 kalos:`Vaniville Town|43|85|town;Aquacorde Town|45|77|town;Santalune City|59|72|town;Lumiose City|53|51|town;Camphrier Town|40|58|town;Ambrette Town|23|75|town;Cyllage City|15|58|town;Geosenge Town|26|49|town;Shalour City|20|37|town;Coumarine City|45|30|town;Laverre City|60|35|town;Dendemille Town|70|32|town;Anistar City|82|43|town;Couriway Town|70|64|town;Snowbelle City|66|77|town;Kiloude City|49|91|town;Pokémon League|85|24|landmark;Parfum Palace|34|55|landmark;Reflection Cave|25|39|landmark;Frost Cavern|74|25|landmark;Terminus Cave|75|52|landmark`,
 alola:`Iki Town|26|32|town;Hau'oli City|17|39|town;Verdant Cavern|24|43|landmark;Heahea City|54|46|town;Paniola Town|57|35|town;Konikoni City|56|62|town;Malie City|76|27|town;Tapu Village|76|47|town;Po Town|67|43|town;Seafolk Village|43|82|town;Mount Lanakila|75|36|landmark;Vast Poni Canyon|49|76|landmark;Aether Paradise|49|22|landmark;Melemele Island|19|35|landmark;Akala Island|55|52|landmark;Ula'ula Island|74|37|landmark;Poni Island|46|79|landmark`,
 galar:`Postwick|50|90|town;Wedgehurst|50|82|town;Motostoke|48|65|town;Turffield|27|57|town;Hulbury|74|57|town;Hammerlocke|51|44|town;Stow-on-Side|22|41|town;Ballonlea|24|29|town;Circhester|64|30|town;Spikemuth|78|32|town;Wyndon|52|12|town;Wild Area|48|53|landmark;Slumbering Weald|39|89|landmark;Isle of Armor|15|75|landmark;Crown Tundra|85|81|landmark;Glimwood Tangle|31|31|landmark;Route 3|34|62|route;Route 6|31|44|route`,
 paldea:`Cabo Poco|43|85|town;Los Platos|45|76|town;Mesagoza|50|68|town;Cortondo|29|63|town;Artazon|69|63|town;Levincia|83|52|town;Cascarrafa|23|44|town;Medali|36|38|town;Montenevera|55|21|town;Alfornada|26|75|town;Porto Marinada|15|46|town;Zapapico|72|38|town;Glaseado Mountain|60|23|landmark;Area Zero|51|50|landmark;Paldea League|44|58|landmark;Socarrat Trail|36|27|landmark;Asado Desert|24|52|landmark;Casseroya Lake|32|22|landmark;South Province Area One|62|76|landmark;East Province Area Three|76|45|landmark`
};

// DEV3: Retain earlier reference datasets for all 34 game selections.
const rows={};
for(const [r,record] of Object.entries(atlas))rows[r]=parseRows(record);
const originalSinnoh=rows.sinnoh;
const MAP_W=1254,MAP_H=1254,CX=MAP_W/2,CY=MAP_H/2;
const PLATINUM_IMAGE='./sinnoh-platinum-game-map.png';
// Image-pixel coordinates calibrated against the new HD town-map recreation.
// Official cities follow their printed map icons; landmarks without an icon
// are approximate regional points, not precision indoor positioning.
const platinumPlaces=`
Twinleaf Town|275|935|town;Sandgem Town|335|901|town;Jubilife City|321|818|town;Oreburgh City|452|816|town;Floaroma Town|332|690|town;Eterna City|477|590|town;Hearthome City|638|759|town;Solaceon Town|733|708|town;Veilstone City|862|659|town;Pastoria City|761|890|town;Celestic Town|628|581|town;Canalave City|210|800|town;Snowpoint City|519|278|town;Sunyshore City|1016|825|town;Pokémon League|999|615|landmark;
Newmoon Island|240|323|landmark;Fullmoon Island|310|322|landmark;Iron Island|263|551|landmark;Lake Verity|232|897|landmark;Lake Valor|855|822|landmark;Lake Acuity|474|281|landmark;Great Marsh|720|850|landmark;Mt. Coronet|556|698|landmark;Wayward Cave|462|704|landmark;Victory Road|1020|650|landmark;Eterna Forest|410|508|landmark;Valley Windworks|389|601|landmark;Spear Pillar|566|576|landmark;Fuego Ironworks|300|542|landmark;Old Chateau|391|489|landmark;Solaceon Ruins|764|731|landmark;Lost Tower|706|761|landmark;Oreburgh Gate|413|815|landmark;Oreburgh Mine|460|851|landmark;Pal Park|452|969|landmark;Snowpoint Temple|553|257|landmark;Acuity Lakefront|474|336|landmark;Verity Lakefront|212|857|landmark;Valor Lakefront|844|787|landmark;Spring Path|900|783|landmark;Turnback Cave|924|770|landmark;
Fight Area|792|480|town;Survival Area|809|385|town;Resort Area|971|514|town;Stark Mountain|829|222|landmark;Battle Frontier|766|513|landmark;Flower Paradise|1070|254|landmark;Seabreak Path|1060|410|landmark;
Route 201|306|898|route;Route 202|334|860|route;Route 203|386|812|route;Route 204|333|756|route;Route 205|390|580|route;Route 206|483|706|route;Route 207|513|809|route;Route 208|584|773|route;Route 209|683|760|route;Route 210|693|637|route;Route 211|553|584|route;Route 212|647|845|route;Route 213|816|885|route;Route 214|859|748|route;Route 215|790|641|route;Route 216|509|449|route;Route 217|480|353|route;Route 218|264|808|route;Route 219|332|946|route;Route 220|379|1030|route;Route 221|403|966|route;Route 222|937|828|route;Route 223|1002|721|route;Route 224|1061|434|route;Route 225|798|435|route;Route 226|863|387|route;Route 227|910|332|route;Route 228|923|450|route;Route 229|936|487|route;Route 230|850|562|route;
Oreburgh Gym · Coal Badge|486|785|gym;Eterna Gym · Forest Badge|510|555|gym;Hearthome Gym · Relic Badge|675|725|gym;Veilstone Gym · Cobble Badge|895|622|gym;Pastoria Gym · Fen Badge|794|860|gym;Canalave Gym · Mine Badge|244|766|gym;Snowpoint Gym · Icicle Badge|555|248|gym;Sunyshore Gym · Beacon Badge|1053|791|gym;
`;
rows.sinnoh=parseRows(platinumPlaces);
// The terrain image is deliberately not redrawn. These route centerlines
// follow the tan road strokes shown in the game-style artwork. Short routes
// may share a junction; sea lanes without road graphics use a location pin.
const paths={
 'route-201':[[275,935],[274,902],[310,898],[335,901]],
 'route-202':[[335,901],[335,866],[334,836],[322,818]],
 'route-203':[[321,818],[352,812],[390,813],[421,813],[452,816]],
 'route-204':[[321,818],[329,793],[331,761],[332,727],[332,690]],
 'route-205':[[332,690],[333,651],[336,614],[342,579],[391,577],[434,578],[477,590]],
 'route-206':[[477,590],[482,625],[480,670],[479,708],[476,754],[479,812]],
 'route-207':[[452,816],[479,807],[521,807],[548,794]],
 'route-208':[[548,794],[571,788],[604,786],[638,759]],
 'route-209':[[638,759],[678,761],[716,762],[732,736],[733,708]],
 'route-210':[[733,708],[720,692],[720,653],[719,619],[719,581],[679,581],[628,581]],
 'route-211':[[477,590],[512,581],[553,582],[594,581],[628,581]],
 'route-212':[[638,759],[638,808],[638,855],[638,903],[680,909],[718,909],[747,906],[761,890]],
 'route-213':[[761,890],[808,887],[854,888],[857,851],[855,822]],
 'route-214':[[862,659],[866,710],[868,759],[880,780],[925,779],[925,801],[902,841],[855,852]],
 'route-215':[[862,659],[844,639],[812,637],[770,638],[730,638]],
 'route-216':[[550,450],[518,448],[481,447],[477,486]],
 'route-217':[[519,278],[477,278],[477,324],[477,371],[481,414],[481,447]],
 'route-218':[[210,800],[243,802],[279,810],[321,818]],
 'route-219':[[335,901],[335,926],[335,948]],
 'route-221':[[335,948],[335,967],[371,969],[415,968],[452,969]],
 'route-222':[[855,852],[888,848],[927,848],[975,848],[1016,825]],
 'route-224':[[999,615],[1049,613],[1057,577],[1058,532],[1059,485],[1059,429],[1059,371],[1059,313],[1059,254]],
 'route-225':[[792,480],[795,446],[794,416],[808,385]],
 'route-226':[[808,385],[840,386],[878,386],[910,386]],
 'route-227':[[910,386],[911,341],[912,304],[911,269]],
 'route-228':[[910,386],[916,416],[917,456],[919,480],[949,480],[969,514]],
 'route-229':[[792,480],[829,482],[875,482],[917,480],[949,480],[969,514]]
};
// Routes 220, 223, 230 (water) and other unmapped sections stay as points.
// A regional map cannot show a tutor house interior; focus its road vicinity.
const routeFocusOverrides={'route-212':{x:655,y:851,zoom:2.8}};
const gymNames={
 'oreburgh-gym-coal-badge':'Roark · Coal Badge',
 'eterna-gym-forest-badge':'Gardenia · Forest Badge',
 'hearthome-gym-relic-badge':'Fantina · Relic Badge',
 'veilstone-gym-cobble-badge':'Maylene · Cobble Badge',
 'pastoria-gym-fen-badge':'Crasher Wake · Fen Badge',
 'canalave-gym-mine-badge':'Byron · Mine Badge',
 'snowpoint-gym-icicle-badge':'Candice · Icicle Badge',
 'sunyshore-gym-beacon-badge':'Volkner · Beacon Badge'
};
function parseRows(record){return record.split(';').map(e=>e.trim()).filter(Boolean).map(e=>{const [name,x,y,kind]=e.split('|');return {name,x:Number(x),y:Number(y),kind,key:normalize(name)};});}
function normalize(name){return String(name||'').toLowerCase().replace(/é/g,'e').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}
function locKey(name){return normalize(name).replace(/^(kanto|johto|hoenn|sinnoh|unova|kalos|alola|galar|paldea)-/,'').replace(/^mt-/,'mount-');}
function pretty(name){return String(name||'').replace(/-/g,' ').replace(/\b[a-z]/g,c=>c.toUpperCase()).replace(/Pokemon/g,'Pokémon').replace(/Mt /g,'Mt. ');}
function escape(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
const page=$('mapsPage'),layout=$('mapsContent'),list=$('mapsList'),canvas=$('mapsCanvas'),game=$('mapsGame'),region=$('mapsRegion'),regionName=$('mapsRegionName'),filter=$('mapsCategory'),search=$('mapsSearch'),details=$('mapsDetails');
if(!page||!canvas||!game)return;
let selected='',available=[],zoom=1,panX=0,panY=0,returnFrom=null,detailRequest=0;
let pointers=new Map(),dragging=false,suppressClick=false,lastPointerX=0,lastPointerY=0,animationId=0;
// Other games remain in atlas/gameRegions, only Platinum appears here.
game.innerHTML='<option value="">Choose your game</option><option value="Platinum">Platinum</option>';
function applyRegions(){region.value=game.value==='Platinum'?'sinnoh':'';if(regionName)regionName.textContent=region.value?'Sinnoh':'Choose a game';}
function isTutor(place){return !!window.takDexTutorV73?.at(game.value,place)?.length;}
function categoryFor(row){return isTutor(row.name)?'tutor':row.kind||'landmark';}
function matched(row){const q=normalize(search.value);return (!q||locKey(row.name).includes(q)||normalize(row.name).includes(q))&&(filter.value==='all'||categoryFor(row)===filter.value);}
function getRow(name){const key=locKey(name);return available.find(r=>locKey(r.name)===key)||null;}
function resetViewport(){stopAnimation();zoom=1;panX=0;panY=0;}
function clampPan(){panX=Math.max(-CX*(zoom-1),Math.min(CX*(zoom-1),panX));panY=Math.max(-CY*(zoom-1),Math.min(CY*(zoom-1),panY));}
function mapTransform(){return `translate(${(CX*(1-zoom)+panX).toFixed(3)},${(CY*(1-zoom)+panY).toFixed(3)}) scale(${zoom.toFixed(5)})`;}
function updateViewport(){const el=canvas.querySelector('#td73MapLayer');if(el)el.setAttribute('transform',mapTransform());const el2=$('mapsZoomValue');if(el2)el2.textContent=Math.round(zoom*100)+'%';}
function stopAnimation(){if(animationId){cancelAnimationFrame(animationId);animationId=0;}}
function moveViewport(newZoom,newPanX,newPanY,smooth=true){
 stopAnimation();const z=Math.max(1,Math.min(4.4,newZoom));
 const px=Math.max(-CX*(z-1),Math.min(CX*(z-1),newPanX));
 const py=Math.max(-CY*(z-1),Math.min(CY*(z-1),newPanY));
 if(!smooth||window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches){zoom=z;panX=px;panY=py;updateViewport();return;}
 const start=performance.now(),from=[zoom,panX,panY];
 const tick=now=>{let t=Math.min(1,(now-start)/350);t=1-Math.pow(1-t,3);
  zoom=from[0]+(z-from[0])*t;panX=from[1]+(px-from[1])*t;panY=from[2]+(py-from[2])*t;
  updateViewport();if(t<1)animationId=requestAnimationFrame(tick);else animationId=0;};
 animationId=requestAnimationFrame(tick);
}
function focusPoint(x,y,z=2.35,smooth=true){moveViewport(z,z*(CX-x),z*(CY-y),smooth);}
function focusRoute(name){
 const row=getRow(name); if(row){focusPoint(row.x,row.y,2.35);return;}
 const key=locKey(name),pts=paths[key];
 if(!pts?.length){const row=getRow(name);if(row)focusPoint(row.x,row.y,2.15);return;}
 const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);
 const x=(Math.min(...xs)+Math.max(...xs))/2,y=(Math.min(...ys)+Math.max(...ys))/2;
 const w=Math.max(...xs)-Math.min(...xs),h=Math.max(...ys)-Math.min(...ys);
 const z=Math.min(3.1,Math.max(1.4,Math.min(MAP_W/(w+245),MAP_H/(h+255))));
 focusPoint(x,y,z);
}
function noGame(){canvas.replaceChildren();}
function listScrollToSelected(){
 const btn=list.querySelector('button.selected');if(!btn)return;
 // Move only the directory's own scrollbar. Native scrollIntoView would jump
 // the entire page to the list, hiding the map on a phone after a pin tap.
 const outer=list.getBoundingClientRect(),inner=btn.getBoundingClientRect();
 if(inner.top<outer.top+6)list.scrollBy({top:inner.top-outer.top-8,behavior:'smooth'});
 else if(inner.bottom>outer.bottom-6)list.scrollBy({top:inner.bottom-outer.bottom+8,behavior:'smooth'});
}
function showSelection(){
 for(const b of list.querySelectorAll('[data-location]')){const yes=locKey(b.dataset.location)===selected;b.classList.toggle('selected',yes);b.setAttribute('aria-pressed',yes?'true':'false');}
 for(const el of canvas.querySelectorAll('[data-map-place]')){const yes=locKey(el.dataset.mapPlace)===selected;el.classList.toggle('selected',yes);el.setAttribute('aria-pressed',yes?'true':'false');}
 const svg=canvas.querySelector('svg');if(svg)svg.dataset.selection=selected;
 listScrollToSelected();
}
function display(){
 if(game.value!=='Platinum'){noGame();$('mapsCount').textContent='Choose Platinum to explore Sinnoh.';return;}
 const displayed=available.filter(matched),plotted=displayed.filter(r=>Number.isFinite(r.x)&&Number.isFinite(r.y));
 $('mapsCount').textContent=displayed.length+' locations · '+plotted.filter(p=>p.kind==='route').length+' routes';
 list.innerHTML=displayed.length?displayed.slice().sort((a,b)=>{
  if(a.kind==='route'&&b.kind==='route')return Number(a.name.match(/\d+/)?.[0])-Number(b.name.match(/\d+/)?.[0]);
  return a.name.localeCompare(b.name);
 }).map(r=>`<button type="button" data-location="${escape(r.name)}" aria-pressed="${locKey(r.name)===selected}" class="${locKey(r.name)===selected?'selected':''}"><span>${escape(r.name)}</span><small>${r.kind==='route'?'Route':r.kind==='gym'?'Gym · Badge':categoryFor(r)==='tutor'?'Tutor':r.kind==='town'?'Town / city':'Landmark'}</small></button>`).join(''):'<p class="note">No locations match. Change your search or category.</p>';
 // Restore the original route-shaped click targets, but NEVER draw route dots or highlight strokes.
 // The SVG hit strokes themselves have no visible paint; map/list selection remains synchronized.
 const mtCoronetHit=`<g class="td73-map-mountain-hit" data-kind="landmark" data-map-place="Mt. Coronet" tabindex="0" role="button" aria-label="Mt. Coronet mountain range" aria-pressed="${selected==='mount-coronet'}"><title>Mt. Coronet</title><path class="td73-mountain-zone" d="M 536,439 L 566,439 L 581,462 L 578,487 L 594,510 L 616,547 L 637,580 L 630,609 L 631,638 L 641,674 L 634,703 L 617,735 L 616,771 L 604,805 L 553,819 L 528,799 L 527,769 L 541,735 L 555,715 L 549,683 L 529,651 L 544,613 L 535,573 L 543,547 L 530,512 L 532,478 Z"/></g>`;
 const routes=plotted.filter(r=>r.kind==='route'&&paths[locKey(r.name)]?.length>1).map(r=>{
  const chosen=locKey(r.name)===selected;
  const points=paths[locKey(r.name)].map(p=>p.join(',')).join(' ');
  return `<g class="td73-map-route td73-map-road-hit ${chosen?'selected':''}" data-kind="route" data-map-place="${escape(r.name)}" tabindex="0" role="button" aria-label="${escape(r.name)}" aria-pressed="${chosen}"><title>${escape(r.name)}</title><polyline class="td73-route-hit" points="${points}"/></g>`;
 }).join('');
 const pins=plotted.filter(r=>r.kind!=='route'||!paths[locKey(r.name)]?.length).map(r=>{
  const chosen=locKey(r.name)===selected;
  // Routes not represented by a drawn road (e.g. sea routes) keep invisible point targets.
  const routeFallback=r.kind==='route';
  return `<g class="td73-map-place td73-map-${r.kind} ${chosen?'selected':''}" data-kind="${r.kind}" data-map-place="${escape(r.name)}" tabindex="0" role="button" aria-label="${escape(r.name)}" aria-pressed="${chosen}" transform="translate(${r.x},${r.y})"><title>${escape(r.name)}</title><circle class="td73-pin-hit" r="${r.kind==='gym'?20:24}"/>${routeFallback?'':r.kind==='gym'?'<path class="td73-badge-diamond" d="M0,-11 L11,0 L0,11 L-11,0 Z"/><circle class="td73-badge-center" r="2.5"/>':`<circle class="td73-pin-halo" r="11"/><circle class="td73-pin-core" r="${chosen?8:5.5}"/>`}</g>`;
 }).join('');
 canvas.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MAP_W} ${MAP_H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Platinum HD Sinnoh game-style map with selectable roads gyms and landmarks" data-selection="${escape(selected)}"><g id="td73MapLayer" transform="${mapTransform()}"><image href="${PLATINUM_IMAGE}" x="0" y="0" width="${MAP_W}" height="${MAP_H}" preserveAspectRatio="none"/><g class="td73-mountain-overlay">${mtCoronetHit}</g><g class="td73-route-overlay">${routes}</g><g class="td73-pins">${pins}</g></g></svg>`;
 updateViewport();
}
async function loadDirectory(){
 ++detailRequest;selected='';resetViewport();available=game.value==='Platinum'?[...rows.sinnoh]:[];
 if(layout)layout.hidden=game.value!=='Platinum';
 if(game.value!=='Platinum'){
  list.replaceChildren();$('mapsCount').textContent='';$('mapsHeading').textContent='Region map';details.replaceChildren();noGame();return;
 }
 $('mapsHeading').textContent='Sinnoh · Platinum';details.innerHTML='<h3>Select a location</h3>';
 display();
}
function tutorList(name){return (window.takDexTutorV73?.at(game.value,name)||[]).slice(0,50);}
function viewTutorRows(tutors){return tutors.length?'<h4>Move Tutor moves</h4><div class="td73-tutor-list">'+tutors.map(t=>`<div><button type="button" class="td73-tutor-move" data-td73-move-checker="${escape(t.move)}">${escape(pretty(t.move))}</button> · ${escape(t.cost)}${t.condition?' · '+escape(t.condition):''}</div>`).join('')+'</div>':'';}
async function openLocation(name,origin='user'){
 if(game.value!=='Platinum')return;
 let row=getRow(name);
 if(!row){details.innerHTML=`<h3>${escape(name)}</h3><p class="note">This location has not yet been positioned on the Platinum map.</p>`;return;}
 if(!matched(row)){search.value='';filter.value='all';display();}
 selected=locKey(row.name);showSelection();
 if(origin==='list'&&window.innerWidth<=720)canvas.scrollIntoView({behavior:'smooth',block:'center'});
 if(origin==='move-checker')requestAnimationFrame(()=>canvas.scrollIntoView({behavior:'smooth',block:'center'}));
 if(selected==='mount-coronet'){
  // Frame the full mountain from Route 207/208 north to Route 216.
  focusPoint(577,627,2.0);
 }else if(origin==='move-checker'&&routeFocusOverrides[selected]){
  const f=routeFocusOverrides[selected];focusPoint(f.x,f.y,f.zoom);
 }else if(row.kind==='route')focusRoute(row.name);
 else focusPoint(row.x,row.y,2.5);
 const tutors=tutorList(row.name),mine=++detailRequest;
 const gymDetail=row.kind==='gym'?`<p><b>Gym leader / badge:</b> ${escape(gymNames[selected]||'Gym Badge')}</p>`:'';
 const trainer=row.kind==='gym'?(gymNames[selected]||'').split(' · ')[0]:'';
 const gymButton=trainer?`<button type="button" class="td73-gym-battle-button" data-td73-gym-trainer="${escape(trainer)}">⚔ Open in 6v6 Battle</button>`:'';
 details.innerHTML=`<h3>${escape(row.name)}</h3>${gymDetail}${gymButton}${tutors.length?`<p><b>Move Tutor:</b> ${escape(tutors[0].detail)}</p>`:''}${viewTutorRows(tutors)}<div id="td73-location-record"></div>`;
 const status=$('td73-location-record');
 try{
  const n=row.name.toLowerCase().replace(/[^a-z0-9]+/g,'-');
  const data=await api('location/'+encodeURIComponent(n));
  if(mine!==detailRequest||!status?.isConnected)return;
  const areas=(data.areas||[]).map(a=>({name:pretty(a.name),apiName:a.name}));
  status.innerHTML=areas.length?`<p><b>Subareas:</b> ${areas.slice(0,14).map(a=>escape(a.name)).join(' · ')}${areas.length>14?' …':''}</p>`:'';
  if(areas.length){const area=await api('location-area/'+encodeURIComponent(areas[0].apiName));if(mine!==detailRequest||!status?.isConnected)return;
   const names=(area.pokemon_encounters||[]).filter(p=>(p.version_details||[]).some(v=>v.version?.name==='platinum')).map(x=>pretty(x.pokemon.name));
   if(names.length)status.insertAdjacentHTML('beforeend',`<p><b>Recorded wild encounters (${escape(areas[0].name)}):</b> ${names.slice(0,12).map(escape).join(' · ')}${names.length>12?' …':''}</p>`);
  }
 }catch(e){if(mine===detailRequest&&status?.isConnected)status.textContent='';}
}
function setGame(g){game.value=g==='Platinum'?'Platinum':'';applyRegions();loadDirectory();}
function open(g,place){
 if(place){search.value='';filter.value='all';}
 const active=[...document.querySelectorAll('main > section')].find(el=>!el.hidden&&el.id!=='mapsPage');
 returnFrom={id:active?.id||'morePage',scroll:window.scrollY};
 for(const el of document.querySelectorAll('main > section'))el.hidden=el!==page;
 document.querySelectorAll('.main-tabs button').forEach((el,i)=>el.classList.toggle('selected',i===3));
 if(g==='Platinum'&&game.value!=='Platinum')setGame('Platinum');
 else if(g&&g!=='Platinum'){
  if(!game.value){if(layout)layout.hidden=true;noGame();details.innerHTML=`<h3>Map unavailable</h3><p class="note">${escape(g)} map is not enabled yet. Its data remains saved for later.</p>`;}
 }else if(game.value==='Platinum')display();else loadDirectory();
 if(place&&g==='Platinum')Promise.resolve().then(()=>openLocation(place,'move-checker'));
 window.scrollTo(0,0);
}
details.addEventListener('click',e=>{
 const move=e.target.closest('[data-td73-move-checker]');
 if(move){window.takDexOpenMoveFromMapsV73?.(move.dataset.td73MoveChecker,'Platinum');return;}
 const gym=e.target.closest('[data-td73-gym-trainer]');
 if(gym){if(window.takDexOpenGymFromMapV73?.(gym.dataset.td73GymTrainer)){
  gymReturnPending=true;gymReturnScroll=window.scrollY;$('backPlanner').textContent='← Maps';page.hidden=true;
 }}
});
let gymReturnPending=false,gymReturnScroll=0;
$('backPlanner').addEventListener('click',e=>{
 if(!gymReturnPending)return;
 e.preventDefault();e.stopImmediatePropagation();gymReturnPending=false;$('backPlanner').textContent='← More';
 $('plannerPage').hidden=true;page.hidden=false;
 requestAnimationFrame(()=>window.scrollTo(0,gymReturnScroll));
},true);
for(const tabId of ['teamsTab','battleTab','dexTab','moreTab'])$(tabId).addEventListener('click',()=>{if(gymReturnPending){gymReturnPending=false;$('backPlanner').textContent='← More';}},true);
// Keep Maps immediately above Offline Data after all More tools initialize.
const offlineMenuButton=$('td59OpenOffline');
if(offlineMenuButton?.parentElement)offlineMenuButton.before($('openMaps'));
$('openMaps').addEventListener('click',()=>open());
$('backMaps').addEventListener('click',()=>{
 stopAnimation();const previous=returnFrom;returnFrom=null;page.hidden=true;
 if(previous?.id&&$(previous.id)){
  if(previous.id==='morePage')window.takActivate(3);
  else if(previous.id==='plannerPage')openTool('plannerPage',3);
  else if(previous.id==='battlePage')window.takActivate(1);
  else {$(previous.id).hidden=false;document.querySelectorAll('.main-tabs button').forEach((el,i)=>el.classList.toggle('selected',i===3));}
  requestAnimationFrame(()=>window.scrollTo(0,previous.scroll));
 }else window.takActivate(3);
});
game.addEventListener('change',()=>{applyRegions();loadDirectory();});
search.addEventListener('input',display);filter.addEventListener('change',display);
list.addEventListener('click',e=>{const button=e.target.closest('[data-location]');if(button)openLocation(button.dataset.location,'list');});
canvas.addEventListener('click',e=>{if(suppressClick){suppressClick=false;return;}const target=e.target.closest('[data-map-place]');if(target)openLocation(target.dataset.mapPlace,'map');});
canvas.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){const target=e.target.closest('[data-map-place]');if(target){e.preventDefault();openLocation(target.dataset.mapPlace,'map');}}});
function zoomTo(next,px=CX,py=CY){
 stopAnimation();const z=Math.min(4.4,Math.max(1,next));
 const x=(px-(CX*(1-zoom)+panX))/zoom,y=(py-(CY*(1-zoom)+panY))/zoom;
 moveViewport(z,px-CX*(1-z)-x*z,py-CY*(1-z)-y*z,false);
}
function clientToMap(e){const b=canvas.getBoundingClientRect();return {x:(e.clientX-b.left)/b.width*MAP_W,y:(e.clientY-b.top)/b.height*MAP_H};}
$('mapsZoomIn').onclick=()=>zoomTo(zoom*1.35);
$('mapsZoomOut').onclick=()=>zoomTo(zoom/1.35);
$('mapsZoomReset').onclick=()=>moveViewport(1,0,0);
canvas.addEventListener('wheel',e=>{if(game.value!=='Platinum')return;e.preventDefault();const p=clientToMap(e);zoomTo(zoom*(e.deltaY<0?1.14:1/1.14),p.x,p.y);},{passive:false});
canvas.addEventListener('pointerdown',e=>{
 if(game.value!=='Platinum'||(e.pointerType==='mouse'&&e.button!==0))return;
 stopAnimation();if(!pointers.size)suppressClick=false;
 pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
 if(pointers.size===1){dragging=false;lastPointerX=e.clientX;lastPointerY=e.clientY;}
 if(pointers.size===2){dragging=true;suppressClick=true;try{canvas.setPointerCapture(e.pointerId);}catch(_){} }
});
canvas.addEventListener('pointermove',e=>{
 if(!pointers.has(e.pointerId)||game.value!=='Platinum')return;
 const prev=pointers.get(e.pointerId),others=[...pointers.entries()].filter(([id])=>id!==e.pointerId);
 pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
 if(others.length){
  const other=others[0][1],d0=Math.hypot(prev.x-other.x,prev.y-other.y),d1=Math.hypot(e.clientX-other.x,e.clientY-other.y);
  const box=canvas.getBoundingClientRect(),px=((e.clientX+other.x)/2-box.left)/box.width*MAP_W,py=((e.clientY+other.y)/2-box.height*MAP_H);
  if(d0>4&&d1>4){zoomTo(zoom*d1/d0,px,py);dragging=true;}return;
 }
 const dx=e.clientX-prev.x,dy=e.clientY-prev.y;
 if(Math.hypot(e.clientX-lastPointerX,e.clientY-lastPointerY)>5&&!dragging){dragging=true;try{canvas.setPointerCapture(e.pointerId);}catch(_){} }
 if(dragging){suppressClick=true;panX+=dx*MAP_W/Math.max(1,canvas.clientWidth);panY+=dy*MAP_H/Math.max(1,canvas.clientHeight);clampPan();updateViewport();}
});
function endPointer(e){pointers.delete(e.pointerId);if(!pointers.size)dragging=false;try{canvas.releasePointerCapture(e.pointerId);}catch(_){} }
canvas.addEventListener('pointerup',endPointer);canvas.addEventListener('pointercancel',endPointer);
document.addEventListener('click',e=>{
 const link=e.target.closest('[data-td73-map-link]');if(link){e.preventDefault();open(link.dataset.td73MapGame,link.dataset.td73MapLink);return;}
 if(e.target.closest('#teamsTab,#battleTab,#dexTab,#moreTab,#openPlanner,#openTM,#td56OpenCompare,#td68OpenMove,#td59OpenOffline'))page.hidden=true;
},true);
applyRegions();noGame();
window.takDexMapsV73={open,openLocation,gameRegions,regions:()=>Object.keys(atlas),legacySinnoh:originalSinnoh,platinumRoads:paths};
})();
