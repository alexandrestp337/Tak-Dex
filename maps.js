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
let MAP_W=1254,MAP_H=1254,CX=MAP_W/2,CY=MAP_H/2;
const PLATINUM_IMAGE='./sinnoh-platinum-game-map.png';
// Image-pixel coordinates calibrated against the new HD town-map recreation.
// Official cities follow their printed map icons; landmarks without an icon
// are approximate regional points, not precision indoor positioning.
const platinumPlaces=`
Twinleaf Town|275|935|town;Sandgem Town|335|901|town;Jubilife City|321|818|town;Oreburgh City|452|816|town;Floaroma Town|332|690|town;Eterna City|477|590|town;Hearthome City|638|759|town;Solaceon Town|733|708|town;Veilstone City|862|659|town;Pastoria City|761|890|town;Celestic Town|628|581|town;Canalave City|210|800|town;Snowpoint City|519|278|town;Sunyshore City|1016|825|town;Pokémon League|999|615|landmark;
Newmoon Island|240|323|landmark;Fullmoon Island|310|322|landmark;Iron Island|263|551|landmark;Lake Verity|232|897|landmark;Lake Valor|855|822|landmark;Lake Acuity|474|281|landmark;Great Marsh|720|850|landmark;Mt. Coronet|556|698|landmark;Wayward Cave|462|704|landmark;Victory Road|1020|650|landmark;Eterna Forest|410|508|landmark;Valley Windworks|389|601|landmark;Spear Pillar|566|576|landmark;Fuego Ironworks|309|638|landmark;Old Chateau|391|489|landmark;Solaceon Ruins|764|731|landmark;Lost Tower|706|761|landmark;Oreburgh Gate|413|815|landmark;Oreburgh Mine|460|851|landmark;Pal Park|452|969|landmark;Snowpoint Temple|553|257|landmark;Acuity Lakefront|474|336|landmark;Verity Lakefront|212|857|landmark;Valor Lakefront|844|787|landmark;Spring Path|900|783|landmark;Turnback Cave|924|770|landmark;
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
 'striaton-gym-trio-badge':'Chili / Cilan / Cress · Trio Badge',
 'nacrene-gym-basic-badge':'Lenora · Basic Badge',
 'castelia-gym-insect-badge':'Burgh · Insect Badge',
 'nimbasa-gym-bolt-badge':'Elesa · Bolt Badge',
 'driftveil-gym-quake-badge':'Clay · Quake Badge',
 'mistralton-gym-jet-badge':'Skyla · Jet Badge',
 'icirrus-gym-freeze-badge':'Brycen · Freeze Badge',
 'opelucid-gym-legend-badge':'Drayden / Iris · Legend Badge',
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
const page=$('mapsPage'),layout=$('mapsContent'),list=$('mapsList'),canvas=$('mapsCanvas'),game=$('mapsGame'),region=$('mapsRegion'),regionName=$('mapsRegionName'),filter=$('mapsCategory'),search=$('mapsSearch'),details=$('mapsDetails'),suggestions=$('mapsSuggestions');
if(!page||!canvas||!game)return;
let activeMapGame='',activeMapRevision=0,fitEncounterGroup=false;
const fullDetails=$('td76FullMapDetails'),regularDetails=details.parentElement;
let selected='',available=[],zoom=1,panX=0,panY=0,returnFrom=null,detailRequest=0,activeSearch=null,encounterPack=null,encounterLoading=null,encounterSet=[],mapMachines=[],mapMachineLoading=null;
const mapServices=[{name:'Move Deleter',place:'Canalave City',detail:'House south of the Pokémon Center',kind:'service',aliases:'forget moves remove hm deleter'}];
// Black/White 1 service NPCs, sourced from Serebii and Smogon BW1 references.
const unovaServices=[
 {name:'Move Deleter',place:'Mistralton City',detail:'House east of Pokémon Center',kind:'service',aliases:'forget moves remove hm deleter'},
 {name:'Move Relearner',place:'Mistralton City',detail:'Same house as Move Deleter · costs a Heart Scale',kind:'service',aliases:'move reminder remember moves relearn heart scale'},
 {name:'Hidden Power Checker',place:'Mistralton City',detail:'Inside Pokémon Center',kind:'service',aliases:'check hidden power type'},
 {name:'Name Rater',place:'Castelia City',detail:'Building left of Route 4 entrance',kind:'service',aliases:'nickname rename pokemon'},
 {name:'Happiness Checker',place:'Nacrene City',detail:'Girl in house with version-specific in-game trader',kind:'service',aliases:'friendship happiness checker'},
 {name:'Heart Scale Lady',place:'Driftveil City',detail:'Requests a Pokémon with a specified TM move daily',kind:'service',aliases:'heart scale daily challenge'},
];
let encounterAttempted=false, mapFull=false, fullScroll=0;
let pointers=new Map(),dragging=false,suppressClick=false,lastPointerX=0,lastPointerY=0,animationId=0;
// Other games remain in atlas/gameRegions, only Platinum appears here.
game.innerHTML='<option value="">Choose your game</option><option value="Emerald">Emerald</option><option value="Platinum">Platinum</option><option value="Black">Black</option><option value="White">White</option><option value="Black 2">Black 2</option><option value="White 2">White 2</option>';
const isSequel=g=>g==='Black 2'||g==='White 2';
const isUnovaGame=g=>['Black','White','Black 2','White 2'].includes(g);
const isUnova=()=>isUnovaGame(game.value);
const atlasFor=g=>isSequel(g)?window.takDexB2W2:window.takDexUnovaV74;
const unovaPlaces=g=>(atlasFor(g)?.places||[]).filter(r=>g.startsWith('Black')?r.name!=='White Forest':r.name!=='Black City');
const unovaMachines=g=>atlasFor(g)?.machines||[];
const sequelAlias=(name,g)=>isSequel(g)?Object.entries(window.takDexB2W2?.aliases||{}).find(([n,v])=>v&&locKey(n)===locKey(name))?.[1]||name:name;
const unovaRoads=()=>atlasFor(game.value)?.routePaths||{};
const mapImageFor=g=>isSequel(g)?'./unova-'+(g.startsWith('White')?'white':'black')+'-2-v74.jpg?v=74.6.1':g==='White'?'./unova-white-v78.jpg?v=74.8.3':'./unova-black-v78.jpg?v=74.8.3';
// DEV8.2: paint Unova JPEG source pixels directly onto a high-DPI raster
// matching the final viewport. The separate SVG keeps exact click targets,
// markers and label positions. SVG <image> remains as a safe loading fallback.
const td82BitmapImages=Object.create(null);
let td82BitmapCanvas=null;
const td82BitmapSource=()=>mapImageFor(game.value);
function td82PaintMapBitmap(){
 if(!td82BitmapCanvas||!td82BitmapCanvas.isConnected||!isUnova())return;
 const img=td82BitmapImages[td82BitmapSource()];
 if(!img?.complete||!img.naturalWidth||!img.naturalHeight)return;
 const area=td82BitmapCanvas.getBoundingClientRect();
 if(area.width<1||area.height<1)return;
 const pixelRatio=Math.min(3,Math.max(1,window.devicePixelRatio||1),Math.sqrt(6000000/(area.width*area.height)));
 const w=Math.max(1,Math.round(area.width*pixelRatio)),h=Math.max(1,Math.round(area.height*pixelRatio));
 if(td82BitmapCanvas.width!==w)td82BitmapCanvas.width=w;
 if(td82BitmapCanvas.height!==h)td82BitmapCanvas.height=h;
 const ctx=td82BitmapCanvas.getContext('2d',{alpha:false});if(!ctx)return;
 ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
 // Invert the exact mapTransform() applied to the interactive SVG layer,
 // then sample that visible source rectangle from the original full-size JPEG.
 const tx=CX*(1-zoom)+panX,ty=CY*(1-zoom)+panY;
 const scale=(useSlice()?Math.max:Math.min)(area.width/MAP_W,area.height/MAP_H)||1;const dx=(area.width-MAP_W*scale)/2,dy=(area.height-MAP_H*scale)/2;
 ctx.fillStyle=getComputedStyle(canvas).backgroundColor||'#101216';ctx.fillRect(0,0,w,h);
 ctx.save();ctx.scale(w/area.width,h/area.height);ctx.beginPath();ctx.rect(useSlice()?0:dx,useSlice()?0:dy,useSlice()?area.width:MAP_W*scale,useSlice()?area.height:MAP_H*scale);ctx.clip();
 ctx.drawImage(img,dx+tx*scale,dy+ty*scale,MAP_W*zoom*scale,MAP_H*zoom*scale);ctx.restore();
 td82BitmapCanvas.dataset.ready='true';
}
function td82InstallMapBitmap(){
 td82BitmapCanvas=null;
 if(!isUnova())return;
 const layer=document.createElement('canvas');layer.className='td82-map-bitmap';
 layer.setAttribute('aria-hidden','true');canvas.prepend(layer);td82BitmapCanvas=layer;
 const src=td82BitmapSource();let img=td82BitmapImages[src];
 if(!img){
  img=new Image();img.decoding='async';td82BitmapImages[src]=img;
  img.addEventListener('load',()=>{if(td82BitmapCanvas===layer&&td82BitmapSource()===src)td82PaintMapBitmap();});
  img.addEventListener('error',()=>{if(td82BitmapCanvas===layer)layer.dataset.error='image-load-failed';});
  img.src=src;
 }
 td82PaintMapBitmap();
}
if(typeof ResizeObserver!=='undefined')new ResizeObserver(()=>{clampPan();updateViewport()}).observe(canvas);
else window.addEventListener('resize',td82PaintMapBitmap,{passive:true});
const hoenn=()=>game.value==='Emerald';
const hoennPlaces=(window.takDexHoennLocations||[]).map(([name,left,top,w,h,kind])=>({
 name,kind,left:left*44+26,top:top*44+26,w:w*44,h:h*44,
 x:(left+w/2)*44+26,y:(top+h/2)*44+26
}));
const supported=()=>hoenn()||game.value==='Platinum'||isUnova();
const useSlice=()=>mapFull&&!fitEncounterGroup;
function applyRegions(){region.value=hoenn()?'hoenn':game.value==='Platinum'?'sinnoh':isUnova()?'unova':'';MAP_W=hoenn()?1328:isUnova()?1400:1254;MAP_H=hoenn()?820:isSequel(game.value)?1400*3579/4469:isUnova()?1078:1254;CX=MAP_W/2;CY=MAP_H/2;canvas.classList.toggle('td74-unova-canvas',isUnova());canvas.classList.toggle('td61-sequel-canvas',isSequel(game.value));if(regionName)regionName.textContent=hoenn()?'Hoenn':region.value==='sinnoh'?'Sinnoh':region.value==='unova'?'Unova':'Choose a game';}
function isTutor(place){return !!window.takDexTutorV73?.at(game.value,place)?.length;}
function categoryFor(row){return isTutor(row.name)?'tutor':row.kind||'landmark';}
function matched(row){return filter.value==='all'||categoryFor(row)===filter.value;}
function getRow(name){const key=locKey(name);return available.find(r=>locKey(r.name)===key)||null;}
function resetViewport(){stopAnimation();fitEncounterGroup=false;zoom=1;panX=0;panY=0;}
function mapGeometry(){const b=(canvas.querySelector('svg')||canvas).getBoundingClientRect();const s=(useSlice()?Math.max:Math.min)(b.width/MAP_W,b.height/MAP_H)||1;return {b,s};}
function panLimits(z){const {b,s}=mapGeometry();return {x:Math.max(0,CX*z-(useSlice()&&b.width?b.width/s/2:CX)),y:Math.max(0,CY*z-(useSlice()&&b.height?b.height/s/2:CY))};}
function clampPan(){const lim=panLimits(zoom);panX=Math.max(-lim.x,Math.min(lim.x,panX));panY=Math.max(-lim.y,Math.min(lim.y,panY));}
function mapTransform(){return `translate(${(CX*(1-zoom)+panX).toFixed(3)},${(CY*(1-zoom)+panY).toFixed(3)}) scale(${zoom.toFixed(5)})`;}
function updateViewport(){const svg=canvas.querySelector('svg');if(svg)svg.setAttribute('preserveAspectRatio',useSlice()?'xMidYMid slice':'xMidYMid meet');clampPan();const el=canvas.querySelector('#td73MapLayer');if(el)el.setAttribute('transform',mapTransform());
 const focus=canvas.querySelector('#td78MapFocusLabel');if(focus&&isUnova()){
  const row=available.find(r=>locKey(r.name)===selected);
  if(row&&row.kind!=='route'&&Number.isFinite(row.x)&&Number.isFinite(row.y)){
   // Match the same geometrical center used by route framing. The label must
   // remain at the focused destination, not at a separate legacy route pin.
   const routePoints=row.kind==='route'?unovaRoads()?.[selected]:null;
   const anchor=routePoints?.length?{
    x:(Math.min(...routePoints.map(p=>p[0]))+Math.max(...routePoints.map(p=>p[0])))/2,
    y:(Math.min(...routePoints.map(p=>p[1]))+Math.max(...routePoints.map(p=>p[1])))/2
   }:row;
   const x=CX*(1-zoom)+panX+anchor.x*zoom,y=CY*(1-zoom)+panY+anchor.y*zoom;
   focus.setAttribute('transform',`translate(${Math.max(100,Math.min(MAP_W-100,x)).toFixed(2)},${Math.max(48,Math.min(MAP_H-20,y-38)).toFixed(2)})`);
   focus.removeAttribute('hidden');focus.setAttribute('visibility','visible');
  }else focus.setAttribute('visibility','hidden');
 }
 td82PaintMapBitmap();
 const el2=$('mapsZoomValue');if(el2)el2.textContent=Math.round(zoom*100)+'%';}
function stopAnimation(){if(animationId){cancelAnimationFrame(animationId);animationId=0;}}
function moveViewport(newZoom,newPanX,newPanY,smooth=true){
 stopAnimation();const z=Math.max(1,Math.min(isUnova()?14:4.4,newZoom));
 const lim=panLimits(z);const px=Math.max(-lim.x,Math.min(lim.x,newPanX));
 const py=Math.max(-lim.y,Math.min(lim.y,newPanY));
 if(!smooth||window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches){zoom=z;panX=px;panY=py;updateViewport();return;}
 const start=performance.now(),from=[zoom,panX,panY];
 const tick=now=>{let t=Math.min(1,(now-start)/350);t=1-Math.pow(1-t,3);
  zoom=from[0]+(z-from[0])*t;panX=from[1]+(px-from[1])*t;panY=from[2]+(py-from[2])*t;
  updateViewport();if(t<1)animationId=requestAnimationFrame(tick);else animationId=0;};
 animationId=requestAnimationFrame(tick);
}
function focusPoint(x,y,z=2.35,smooth=true){moveViewport(z,z*(CX-x),z*(CY-y),smooth);}
function focusRoute(name){
 const key=locKey(name),pts=(isUnova()?unovaRoads():paths)?.[key];
 if(!pts?.length){const row=getRow(name);if(row)focusPoint(row.x,row.y,isUnova()?8:2.6);return;}
 const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);
 const x=(Math.min(...xs)+Math.max(...xs))/2,y=(Math.min(...ys)+Math.max(...ys))/2;
 const w=Math.max(...xs)-Math.min(...xs),h=Math.max(...ys)-Math.min(...ys);
 const z=isUnova()?Math.min(10.5,Math.max(3.2,Math.min(MAP_W/(w+70),MAP_H/(h+70)))):Math.min(3.7,Math.max(1.6,Math.min(MAP_W/(w+230),MAP_H/(h+230))));
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
 const tag=$('mapsSelectionLabel');if(tag)tag.textContent=getRow(selected)?.name||'Select a destination';
 const clear=$('mapsClearSelection');if(clear)clear.disabled=!(selected||search.value.trim()||encounterSet.length);
 fullDetails.hidden=!mapFull||!selected;
 if(!selected)fullDetails.open=false;
 fullDetails.querySelector('summary').textContent=getRow(selected)?.name||'Location details';
 listScrollToSelected();
}
function hideSuggestions(){if(suggestions)suggestions.hidden=true;search.setAttribute('aria-expanded','false');}
// Verified supplementary encounters: Bulbapedia Unova Route 8, Serebii Sigilyph locations.
// Local records are used when the downloaded catalog is missing a matching location.
function localEncounters(g){if(!isUnovaGame(g))return [];const seq=isSequel(g),black=g.startsWith('Black'),r='Route 8',out=[];const add=(name,method,min,max,conditions=[],place=r)=>out.push({name,place,records:[[place,method,min,max,conditions]]});const warm=['Spring','Summer','Autumn'];if(seq){add('croagunk','puddle',55,56,warm);add('palpitoad','puddle',54,57,warm);add('karrablast','puddle',black?57:54,black?57:54,warm);add('shelmet','puddle',black?54:57,black?54:57,warm);add('stunfisk','puddle',55,56,warm);add('palpitoad','surf',45,60);add('stunfisk','surf',45,60);add('palpitoad','surf-spots',45,60);add('seismitoad','surf-spots',60,60);add('stunfisk','surf-spots',45,60);add('barboach','super-rod',45,60);add('stunfisk','super-rod',45,60);add('barboach','super-rod-spots',45,60);add('whiscash','super-rod-spots',60,60);add('stunfisk','super-rod-spots',45,60);add('quagsire','puddle',40,55,[...warm,'Swarm']);}else{add('palpitoad','puddle',30,33,warm);add('shelmet','puddle',30,33,warm);add('stunfisk','puddle',31,32,warm);add('stunfisk','surf',15,35);add('seismitoad','surf-spots',15,40);add('stunfisk','surf-spots',15,40);add('barboach','super-rod',35,55);add('stunfisk','super-rod',35,55);add('barboach','super-rod-spots',35,60);add('whiscash','super-rod-spots',35,70);add('stunfisk','super-rod-spots',35,60);add('croagunk','puddle',15,55,[...warm,'Swarm']);}add('sigilyph','walk',seq?19:20,seq?19:20,[],'Desert Resort');
// Verified supplemental B2W2 encounter tables: https://bulbapedia.bulbagarden.net/wiki/Unova_Route_19 , /Unova_Route_20 , /Floccesy_Ranch. Preserve version-specific stripe conditions and encounter methods.
if(seq){const land=(place,method,rows)=>rows.forEach(([n,min,max])=>add(n,method,min,max,[],place));const water=(place,min=5)=>{add('basculin','surf',min,15,[black?'Red-striped':'Blue-striped'],place);add('basculin','surf-spots',5,15,[black?'Blue-striped':'Red-striped'],place);add('poliwag','super-rod',40,70,[],place);add('basculin','super-rod',40,60,[black?'Red-striped':'Blue-striped'],place);add('poliwhirl','super-rod-spots',40,70,[],place);add('politoed','super-rod-spots',50,70,[],place);add('basculin','super-rod-spots',40,60,[black?'Blue-striped':'Red-striped'],place)};
land('Route 19','walk',[['patrat',2,4],['purrloin',2,4]]);land('Route 19','rustling-grass',[['patrat',2,4]]);water('Route 19');
land('Route 20','walk',[['sunkern',2,4],['patrat',2,3],['purrloin',2,4],['pidove',2,4],['sewaddle',2,4]]);land('Route 20','dark-grass',[['sunkern',9,11],['patrat',10,10],['purrloin',10,11],['pidove',9,10],['sewaddle',10,11],['venipede',10,10]]);land('Route 20','rustling-grass',[['dunsparce',3,3],['audino',2,4]]);water('Route 20',7);add('azurill','surf',5,15,[],'Route 20');land('Route 20','surf-spots',[['marill',5,15],['azumarill',5,15]]);add(black?'sudowoodo':'mr-mime','walk',40,55,['Swarm'],'Route 20');
land('Floccesy Ranch','walk',[['psyduck',5,5],['mareep',5,5],['azurill',5,5],['riolu',4,7],['patrat',5,5],['lillipup',4,7],['pidove',7,7]]);land('Floccesy Ranch','rustling-grass',[['dunsparce',5,5],['audino',4,7]]);water('Floccesy Ranch');add('azurill','surf',5,15,[],'Floccesy Ranch');land('Floccesy Ranch','surf-spots',[['marill',5,15],['azumarill',5,15]]);land('Floccesy Ranch','hidden-grotto',[['marill',10,15],['dunsparce',10,15],['herdier',10,15]]);
}return out;}
function placeMatches(raw,name){const a=locKey(String(raw||'').split(' · ')[0]),k=locKey(name);if(a===k||a.startsWith(k+'-'))return true;return locKey(sequelAlias(a,activeMapGame))===k;}
function encounterRowsFor(place,pack=encounterPack){const found=[];for(const mon of pack?.mons||[]){const rec=(pack.entries?.[mon[0]]||[]).filter(r=>placeMatches(r[0],place));if(rec.length)found.push({name:mon[1],records:rec});}return found;}
function mergeLocal(found,place,g){const m=new Map(found.map(x=>[x.name,x]));const existing=new Set(m.keys());for(const x of localEncounters(g).filter(r=>r.place===place)){if(existing.has(x.name))continue;if(!m.has(x.name))m.set(x.name,{name:x.name,records:[]});m.get(x.name).records.push(...x.records);}return [...m.values()];}
function loadEncounters(){
 if(encounterPack||encounterLoading||encounterAttempted)return encounterLoading;
 const requested=activeMapGame,revision=activeMapRevision;encounterAttempted=true;
 encounterLoading=(async()=>{let p=await window.takDexEncounterV55?.get?.(requested);if(revision!==activeMapRevision||requested!==activeMapGame)return;encounterPack=p?.hasSource?p:null;const row=selected&&getRow(selected),host=$('td73-location-record');if(row&&host&&encounterPack&&row.kind!=='gym'){const records=encounterRowsFor(row.name);if(records.length)host.innerHTML=encounterHTML(mergeLocal(records,row.name,requested));}if(search.value&&page.hidden===false)showSuggestions();return encounterPack;})().catch(()=>null).finally(()=>{if(requested===activeMapGame&&revision===activeMapRevision)encounterLoading=null;});return encounterLoading;
}
function encounteredPlaces(mon){const records=encounterPack?.entries?.[mon[0]]||[],out=new Map();for(const row of records){const loc=available.filter(r=>r.kind!=='gym').slice().sort((a,b)=>b.name.length-a.name.length).find(r=>placeMatches(row[0],r.name));if(!loc)continue;const detail=recordDescription(row);if(!out.has(loc.name))out.set(loc.name,{name:loc.name,detail});}for(const local of localEncounters(activeMapGame).filter(x=>x.name===mon[1]))if(!out.has(local.place)&&getRow(local.place))out.set(local.place,{name:local.place,detail:recordDescription(local.records[0])});return [...out.values()];}
function recordDescription(r){const sub=String(r[0]||'').split(' · ')[1],lvl=Number(r[2]);return (sub?pretty(sub)+' · ':'')+pretty(r[1]||'Encounter')+(Number.isFinite(lvl)&&lvl>0?' · Lv '+lvl+(r[3]!==r[2]?'–'+r[3]:''):'')+(r[4]?.length?' · '+r[4].map(pretty).join(', '):'')+(window.td62Progress?.encounterAccess(activeMapGame,r)?' · '+window.td62Progress.encounterAccess(activeMapGame,r):'');}
function encounterHTML(found){return found.length?'<details class="td63-map-encounters"><summary>Wild encounters ('+found.length+')</summary>'+found.sort((a,b)=>a.name.localeCompare(b.name)).map(x=>`<div><button type="button" class="td73-tutor-move" data-td63-map-mon="${escape(x.name)}">${escape(pretty(x.name))}</button><small>${[...new Set(x.records.map(recordDescription))].map(escape).join(' · ')}</small></div>`).join('')+'</details>':'';}
function mapAcquisition(raw,requestedGame=activeMapGame){
 const text=String(raw||'').toLowerCase();
 const lookup=String(requestedGame||'');
 const places=lookup==='Platinum'?rows.sinnoh:isUnovaGame(lookup)?unovaPlaces(lookup):[];
 const rowAt=name=>places.find(p=>locKey(p.name)===locKey(name));
 // Machine names must resolve inside the requested game's TM/HM catalog.
 // Never use the machine location associated with the previously rendered map.
 const slug=normalize(text),guide=window.takDexMachineGuideV65;
 const entries=lookup==='Platinum'?guide?.platinumMachines?.()||[]:isUnovaGame(lookup)?unovaMachines(lookup):[];
 const hit=entries.find(m=>normalize(m.move)===slug||normalize(m.item)===slug||normalize(m.item+' '+m.move)===slug);
 if(hit){
  if(isSequel(lookup)&&hit.place&&rowAt(hit.place))return hit.place;
  const rawLocation=lookup==='Platinum'?guide?.label?.('Platinum',hit.item):hit.location;
  if(rawLocation){
   const fragments=String(rawLocation).split(';');
   for(const piece of fragments){
    const matches=places.filter(r=>r.kind!=='gym'&&piece.toLowerCase().includes(r.name.toLowerCase())).sort((a,b)=>b.name.length-a.name.length);
    if(matches.length)return matches[0].name;
   }
  }
 }

 const aliases=[
  ['dreamyard basement','Dreamyard'],['shopping mall nine','Shopping Mall Nine'],['poké mart','Nimbasa City'],['pokemart','Nimbasa City'],['musical theater','Nimbasa City'],
  ['veilst one','Veilstone City'],['ve ilstone','Veilstone City'],
  ['game corner','Veilstone City'],['department store','Veilstone City'],
  ['cycling road','Route 206'],['galactic warehouse','Veilstone City'],
  ['pokemon mansion','Route 212'],['pokémon mansion','Route 212'],
  ['amity square','Hearthome City'],['ruin maniac tunnel','Route 214'],
  ['prof. rowan','Sandgem Town'],['et erna condominiums','Eterna City'],
 ];
 if(isSequel(lookup)){for(const [a,b] of Object.entries(window.takDexB2W2?.aliases||{})){if(b&&text.includes(a.toLowerCase())&&rowAt(b))return b;}}
 const direct=places.filter(r=>r.kind!=='gym'&&r.name&&text.includes(r.name.toLowerCase())).sort((a,b)=>b.name.length-a.name.length);
 if(direct.length)return direct[0].name;
 for(const [term,place] of aliases){if(text.includes(term)&&rowAt(place))return place;}
 for(const r of places.filter(r=>r.kind==='gym')){const base=r.name.split(' Gym')[0].toLowerCase();if(text.includes(base+' gym'))return r.name;}
 return null;
}
function mapMachineEntries(){
 if(isUnova()){return unovaMachines(game.value).map(m=>{const place=isSequel(game.value)&&!m.place?null:mapAcquisition(m.place||m.location);return place?{name:m.item.toUpperCase()+' · '+pretty(m.move)+' — '+place,place,detail:m.location,kind:'item',aliases:'tm hm machine '+m.item+' '+m.move}:null}).filter(Boolean);}
 const guide=window.takDexMachineGuideV65;
 const destinations=guide?.allLocations?.('Platinum')||[];
 const lookup=new Map((guide?.platinumMachines?.()||mapMachines).map(m=>[String(m.item).toLowerCase(),String(m.move||'')]));
 // All 100 Platinum machines are indexed by TM/HM number and move name, when data is available.
 const out=[];
 for(const {item,location} of destinations){
  const move=lookup.get(item.toLowerCase())||'';
  const choices=String(location).split(';').map(s=>s.trim()).filter(Boolean);
  for(const part of choices){const place=mapAcquisition(part);if(!place)continue;
   out.push({name:item.toUpperCase()+(move?' · '+pretty(move):'')+' — '+place,place,detail:part,kind:'item',aliases:'tm hm machine '+item+' '+move});
  }
 }
 return out;
}
function loadMapMachines(){
 if(mapMachines.length||mapMachineLoading)return mapMachineLoading;
 mapMachineLoading=(async()=>{
  const cached=await window.takDexReferenceV58?.machinesFor?.('Platinum');
  const items=cached?.length?cached:await (typeof td70LoadMachineIndex==='function'?td70LoadMachineIndex('Platinum'):Promise.resolve([]));
  mapMachines=items||[];
  if(search.value.trim()&&!page.hidden)showSuggestions();
 })().catch(()=>{}).finally(()=>{mapMachineLoading=null;});
 return mapMachineLoading;
}
function extraLocations(g){const a=[];const add=(name,place,detail,kind,aliases='')=>a.push({name,place,detail,kind,aliases});if(isUnovaGame(g)){for(const place of ['Driftveil City','Opelucid City','Route 9','Pokémon League',...(isSequel(g)?['Icirrus City','Lentimas Town','Victory Road']:[])])add('Dusk Ball',place,place==='Route 9'?'Purchase · Shopping Mall Nine':place==='Icirrus City'?'Purchase · postgame':'Purchase · shop','item','pokeball dusk ball shop');add('Dusk Ball','Striaton City',isSequel(g)?'Found item · postgame':'Found item','item','pokeball dusk ball');if(isSequel(g)){add('Dusk Ball','Mistralton Cave','Found item · 1F · Surf to enter and Strength to reach','item','pokeball dusk ball');add('Dusk Ball','Twist Mountain','Found item · spring, summer or autumn · postgame','item','pokeball dusk ball');}if(isSequel(g)){add('Potion','Route 19','Near the ledge shortcut','item');add('Rocky Helmet','Castelia City','Relic Passage · east chamber via Castelia Sewers · Strength required','item','held item rocky helmet relic passage');add('Amulet Coin','Castelia City','Building on street toward Route 4 · NPC gift','item','held item money');add('Rare Candy','Castelia City','Oceanfront Road · Harlequin Hunt reward','item','rare candy level');add('Yellow Shard','Mistralton Cave','1F · Strength required','item','shard tutor');add('Blue Shard','Mistralton Cave','2F · northeast of entrance','item','shard tutor');add(g==='Black 2'?'Toxic Orb':'Flame Orb','Reversal Mountain','B1F near entrance to 1F · version-specific','item','held item orb');add(g==='Black 2'?'Magmarizer':'Electirizer','Route 21','Plasma Frigate · B1F '+(g==='Black 2'?'northeast room':'southwest room')+' · story boarding after badge 8','item','evolution held item plasma frigate');add('Oran Berry','Route 19','Alder gift on second meeting','item');add('Water Stone','Route 19','Northern area · Surf required (normally after badge 5)','item');add('Nest Ball','Route 19','Northeast · Surf required (normally after badge 5)','item');add('Expert Belt','Route 19','Hidden · Surf required (normally after badge 5)','item');add('Alder','Route 19','Early story meeting','story');add('Hugh','Floccesy Ranch','Rival battle · starter Lv 8','story','rival starter battle');add('Move Deleter','Pokémon World Tournament','Service stall','service','forget remove hm moves npc');add('Move Reminder','Pokémon World Tournament','Heart Scale service','service','relearner relearn remember move npc');add('Cheren · HM Surf','Route 6','After the Plasma Frigate incident at the PWT · after badge 5','story','surf hm story cheren');}else{add('Bianca · rival battle','Route 8','After receiving the Light / Dark Stone','story','bianca rival story battle');add('Parasol Lady','Route 8','Weather rocks by time of day','npc','heat rock damp rock smooth rock icy rock weather npc');add('Professor Juniper · starter','Nuvema Town','Starter Pokémon at the beginning of the game','story','starter snivy tepig oshawott story');add('Looker · Super Rod','Nuvema Town','Postgame gift','npc','fishing super rod looker story');}}return a.map(x=>({...x,place:getRow(x.place)?.name||mapAcquisition(x.place)})).filter(x=>x.place&&getRow(x.place));}
function searchIndex(){
 const entries=available.map(r=>({name:r.name,place:r.name,detail:r.kind==='route'?'Route':r.kind==='town'?'Town / city':r.kind==='gym'?'Gym & Badge':'Landmark',kind:r.kind,aliases:''}));
 for(const svc of (isSequel(game.value)?[]:isUnova()?unovaServices:mapServices))entries.push(svc);entries.push(...extraLocations(game.value));
 const tutor=window.takDexTutorV73;
 if(tutor)for(const place of available){for(const m of tutor.at(game.value,place.name))entries.push({name:pretty(m.move)+' · Move Tutor',place:place.name,detail:m.detail+' · '+m.cost,kind:'tutor',aliases:'move '+m.move+' shard '+m.place});}
 // Search all mapped TM/HM acquisitions. The full move names come from
 // the selected game's offline pack or its version-specific machine index.
 entries.push(...mapMachineEntries());
 {const mons=new Map((encounterPack?.mons||[]).map(x=>[x[1],x]));for(const x of localEncounters(game.value))if(!mons.has(x.name))mons.set(x.name,[0,x.name]);for(const mon of mons.values()){const places=encounteredPlaces(mon);if(!places.length)continue;
  entries.push({name:pretty(mon[1])+' · '+places.length+' encounter location'+(places.length===1?'':'s'),place:places[0].name,detail:places.map(p=>p.name).join(' · '),kind:'encounter',aliases:mon[1]+' encounter catch find pokemon',encounters:places});
 }}
 return entries;
}
function showSuggestions(){
 if(!suggestions)return;loadEncounters();
 const q=normalize(search.value),all=searchIndex(),tokens=q.split('-').filter(Boolean),hits=(q?all.filter(r=>{const hay=normalize(r.name+' '+r.place+' '+r.aliases+' '+r.kind);return hay.includes(q)||tokens.every(t=>hay.includes(t))}).sort((a,b)=>Number(normalize(b.name).startsWith(q))-Number(normalize(a.name).startsWith(q))):all.filter(r=>r.kind==='route'||r.kind==='town')).slice(0,q?40:12);
 suggestions.innerHTML=hits.length?hits.map((r,i)=>`<button type="button" role="option" data-map-result="${i}" aria-selected="false"><span>${escape(r.name)}</span><small>${escape(r.place!==r.name&&!r.encounters&&!r.name.includes(r.place)?r.place+' · '+r.detail:r.detail)}</small></button>`).join(''):'<p class="note">No verified locations match. Try a route, city, item, or move.</p>';
 activeSearch=hits;suggestions.hidden=false;search.setAttribute('aria-expanded','true');
}
async function selectSearch(index){const r=activeSearch?.[index];if(!r)return;
 search.value=r.name;hideSuggestions();search.blur();encounterSet=r.encounters||[];fitEncounterGroup=encounterSet.length>1;openLocation(r.place,'search');
 if(r.place!==r.name){details.insertAdjacentHTML('afterbegin',`<p class="td74-map-target"><strong>${escape(r.name)}</strong> · ${escape(r.detail)}</p>`);}
 if(r.encounters?.length>1)details.insertAdjacentHTML('beforeend','<div class="td74-encounter-places"><strong>Encounter locations</strong>'+r.encounters.map(p=>`<button type="button" data-td74-encounter-place="${escape(p.name)}">${escape(p.name)} · ${escape(p.detail)}</button>`).join('')+'</div>');
 const b=$('mapsCanvas');if(!mapFull&&window.innerWidth<=720)b.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function display(){
 if(activeMapGame!==game.value){loadDirectory();return;}
 if(!supported()){noGame();$('mapsCount').textContent='Choose Platinum, Black, White, Black 2 or White 2.';return;}
 const displayed=available.filter(matched),plotted=available.filter(r=>Number.isFinite(r.x)&&Number.isFinite(r.y));
 $('mapsCount').textContent=displayed.length+' locations · '+plotted.filter(p=>p.kind==='route').length+' routes';
 list.innerHTML=displayed.length?displayed.slice().sort((a,b)=>{
  if(a.kind==='route'&&b.kind==='route')return Number(a.name.match(/\d+/)?.[0])-Number(b.name.match(/\d+/)?.[0]);
  return a.name.localeCompare(b.name);
 }).map(r=>`<button type="button" data-location="${escape(r.name)}" aria-pressed="${locKey(r.name)===selected}" class="${locKey(r.name)===selected?'selected':''}"><span>${escape(r.name)}</span><small>${r.kind==='route'?'Route':r.kind==='gym'?'Gym · Badge':categoryFor(r)==='tutor'?'Tutor':r.kind==='town'?'Town / city':'Landmark'}</small></button>`).join(''):'<p class="note">No locations match. Change your search or category.</p>';
 // Restore the original route-shaped click targets, but NEVER draw route dots or highlight strokes.
 // The SVG hit strokes themselves have no visible paint; map/list selection remains synchronized.
 const mtCoronetHit=game.value!=='Platinum'?'':`<g class="td73-map-mountain-hit" data-kind="landmark" data-map-place="Mt. Coronet" tabindex="0" role="button" aria-label="Mt. Coronet mountain range" aria-pressed="${selected==='mount-coronet'}"><title>Mt. Coronet</title><path class="td73-mountain-zone" d="M 536,439 L 566,439 L 581,462 L 578,487 L 594,510 L 616,547 L 637,580 L 630,609 L 631,638 L 641,674 L 634,703 L 617,735 L 616,771 L 604,805 L 553,819 L 528,799 L 527,769 L 541,735 L 555,715 L 549,683 L 529,651 L 544,613 L 535,573 L 543,547 L 530,512 L 532,478 Z"/></g>`;
 const mapRoads=isUnova()?unovaRoads():paths;
 const routes=plotted.filter(r=>r.kind==='route'&&mapRoads[locKey(r.name)]?.length>1).map(r=>{
  const chosen=locKey(r.name)===selected;
  const points=mapRoads[locKey(r.name)].map(p=>p.join(',')).join(' ');
  return `<g class="td73-map-route td73-map-road-hit ${chosen?'selected':''}" data-kind="route" data-map-place="${escape(r.name)}" tabindex="0" role="button" aria-label="${escape(r.name)}" aria-pressed="${chosen}"><title>${escape(r.name)}</title><polyline class="td74-route-glow" points="${points}"/><polyline class="td74-route-visible" points="${points}"/><polyline class="td73-route-hit" points="${points}"/></g>`;
 }).join('');
 const pins=plotted.filter(r=>r.kind!=='route'||!mapRoads[locKey(r.name)]?.length).map(r=>{
  const chosen=locKey(r.name)===selected;
  // Routes not represented by a drawn road (e.g. sea routes) keep invisible point targets.
  const routeFallback=r.kind==='route';
  return `<g class="td73-map-place td73-map-${r.kind} ${chosen?'selected':''}" data-kind="${r.kind}" data-map-place="${escape(r.name)}" tabindex="0" role="button" aria-label="${escape(r.name)}" aria-pressed="${chosen}" transform="translate(${r.x},${r.y})"><title>${escape(r.name)}</title><circle class="td73-pin-hit" r="${isUnova()?(r.kind==='gym'?12:16):(r.kind==='gym'?20:24)}"/>${routeFallback?'':r.kind==='gym'?'<path class="td73-badge-diamond" d="M0,-11 L11,0 L0,11 L-11,0 Z"/><circle class="td73-badge-center" r="2.5"/>':`<circle class="td73-pin-halo" r="11"/><circle class="td73-pin-core" r="${chosen?8:5.5}"/>`}</g>`;
 }).join('');
const roadLabels=available.filter(r=>game.value==='Platinum'&&r.kind==='route').map(r=>{
   // Separate route labels from junction badges and town dots on the illustration.
   const roadLabelOffsets={'route-209':[-36,25],'route-214':[-37,-31],'route-223':[-26,-39]};
   const pts=mapRoads[locKey(r.name)],mid=isUnova()?[r.x,r.y]:(pts?.length?pts[Math.floor((pts.length-1)/2)]:[r.x,r.y]).slice();
   const unovaOffsets={}; // DEV7: route number positions are calibrated individually in unova-v74.js.
   const off=isUnova()?null:roadLabelOffsets[locKey(r.name)];if(off){mid[0]+=off[0];mid[1]+=off[1];}
   const number=(r.name.match(/\d+/)||[])[0];if(!number)return '';
   return `<g class="td74-road-label ${locKey(r.name)===selected?'selected':''}" data-map-place="${escape(r.name)}" transform="translate(${mid[0]},${mid[1]})"><title>${escape(r.name)}</title><text text-anchor="middle" dominant-baseline="central">${number}</text></g>`;
 }).join('');
const hoennRegions=hoenn()?plotted.map(r=>`<g class="td76-hoenn-place td76-hoenn-${r.kind}" data-map-place="${escape(r.name)}" role="button" tabindex="0" aria-label="${escape(r.name)}"><title>${escape(r.name)}</title><rect x="${r.left+2}" y="${r.top+2}" width="${r.w-4}" height="${r.h-4}" rx="4"/><text x="${r.x}" y="${r.y}" text-anchor="middle" dominant-baseline="central">${escape(r.kind==='route'?r.name.match(/\d+/)?.[0]||'':'•')}</text></g>`).join(''):'';
const townLabels=''; // The supplied Black/White maps already contain precise printed city labels.
const encounterPins=encounterSet.map(r=>getRow(r.name)).filter(Boolean).map(r=>`<g transform="translate(${r.x},${r.y})" class="td74-encounter-ring" data-map-place="${escape(r.name)}"><circle r="27"/></g>`).join('');
 // Selected destinations are indicated by their highlight and details panel.
 // No extra name callout: fixed-width bubbles clipped long labels and duplicated town names.
 canvas.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MAP_W} ${MAP_H}" preserveAspectRatio="xMidYMid meet" role="img" data-map-game="${escape(activeMapGame)}" data-map-revision="${activeMapRevision}" aria-label="${hoenn()?'Hoenn schematic':isUnova()?'Black and White Unova map':'Platinum Sinnoh map'} with selectable routes and landmarks" data-selection="${escape(selected)}"><g id="td73MapLayer" transform="${mapTransform()}">${hoenn()?`<rect class="td76-hoenn-water" width="${MAP_W}" height="${MAP_H}"/>${hoennRegions}`:`<image class="td82-map-fallback" href="${isUnova()?mapImageFor(activeMapGame):PLATINUM_IMAGE}" x="0" y="0" width="${MAP_W}" height="${MAP_H}" preserveAspectRatio="none"/>`}<g class="td73-mountain-overlay">${mtCoronetHit}</g><g class="td73-route-overlay">${routes}</g><g class="td73-pins">${hoenn()?'':pins}</g><g class="td75-unova-town-labels">${townLabels}</g><g class="td74-road-labels">${roadLabels}</g><g class="td74-encounter-overlays">${encounterPins}</g></g>${isUnova()&&selected?`<g id="td78MapFocusLabel" class="td78-map-focus-label" aria-hidden="true"><text text-anchor="middle">${escape(getRow(selected)?.name||'')}</text></g>`:''}</svg>`;
 td82InstallMapBitmap();
 updateViewport();
}
async function loadDirectory(){
 activeMapGame=game.value; ++activeMapRevision;applyRegions();
 ++detailRequest;selected='';encounterSet=[];encounterPack=null;encounterLoading=null;encounterAttempted=false;mapMachines=[];resetViewport();available=hoenn()?hoennPlaces:game.value==='Platinum'?[...rows.sinnoh]:isUnova()?unovaPlaces(game.value):[];
 if(layout)layout.hidden=!supported();
 if(!supported()){
  list.replaceChildren();$('mapsCount').textContent='';$('mapsHeading').textContent='Region map';details.replaceChildren();noGame();return;
 }
 $('mapsHeading').textContent=hoenn()?'Hoenn · Emerald':isUnova()?'Unova · '+game.value:'Sinnoh · Platinum';details.innerHTML='<h3>Select a location</h3>';loadEncounters();
 display();
}
function locationExtras(name){const machines=mapMachineEntries().filter(x=>locKey(x.place)===locKey(name));const extras=[...(isSequel(game.value)?[]:isUnova()?unovaServices:mapServices),...extraLocations(game.value)].filter(x=>locKey(x.place)===locKey(name));const guide=game.value==='Platinum'?window.takDexMachineGuideV65?.platinumMachines?.()||[]:unovaMachines(game.value);return (machines.length?'<details><summary>TM / HM ('+machines.length+')</summary>'+machines.map(m=>{const item=m.name.split(' · ')[0],move=guide.find(x=>x.item.toUpperCase()===item)?.move;return `<div>${move?`<button type="button" class="td73-tutor-move" data-td73-move-checker="${escape(move)}">${escape(m.name.split(' — ')[0])}</button>`:escape(m.name)}<small>${escape(m.detail)}</small></div>`}).join('')+'</details>':'')+(extras.length?'<details><summary>Items, NPCs & services</summary>'+extras.map(x=>`<div><strong>${escape(x.name)}</strong><small>${escape(x.detail)}</small></div>`).join('')+'</details>':'');}
function tutorList(name){return (window.takDexTutorV73?.at(game.value,name)||[]).slice(0,50);}
function viewTutorRows(tutors){return tutors.length?'<details class="td74-tutor-disclosure"><summary>Move Tutor moves ('+tutors.length+')</summary><div class="td73-tutor-list">'+tutors.map(t=>`<div><button type="button" class="td73-tutor-move" data-td73-move-checker="${escape(t.move)}">${escape(pretty(t.move))}</button> · ${escape(t.cost)}${t.condition?' · '+escape(t.condition):''}</div>`).join('')+'</div></details>':'';}
async function openLocation(name,origin='user'){
 if(!supported())return;
 let row=getRow(name);
 if(!row){details.innerHTML=`<h3>${escape(name)}</h3><p class="note">This location has not yet been positioned on the selected map.</p>`;return;}
 if(!matched(row)){filter.value='all';display();}
 selected=locKey(row.name);display();showSelection();
 if(origin==='list'&&window.innerWidth<=720)canvas.scrollIntoView({behavior:'smooth',block:'nearest'});
 if(origin==='move-checker')requestAnimationFrame(()=>canvas.scrollIntoView({behavior:'smooth',block:'center'}));
 if(origin!=='search')fitEncounterGroup=false;
 if(fitEncounterGroup)fitEncounters();
 else if(selected==='mount-coronet'){
  // Frame the full mountain from Route 207/208 north to Route 216.
  focusPoint(577,627,2.0);
 }else if(origin==='move-checker'&&routeFocusOverrides[selected]){
  const f=routeFocusOverrides[selected];focusPoint(f.x,f.y,f.zoom);
 }else if(row.kind==='route')focusRoute(row.name);
 else focusPoint(row.x,row.y,isUnova()?(row.kind==='gym'?10:row.kind==='town'?7.4:9):2.5);
 const tutors=tutorList(row.name),mine=++detailRequest,detailGame=activeMapGame;
 const sequelGymNames={'aspertia-gym-basic-badge':'Cheren · Basic Badge','virbank-gym-toxic-badge':'Roxie · Toxic Badge','castelia-gym-insect-badge':'Burgh · Insect Badge','nimbasa-gym-bolt-badge':'Elesa · Bolt Badge','driftveil-gym-quake-badge':'Clay · Quake Badge','mistralton-gym-jet-badge':'Skyla · Jet Badge','opelucid-gym-legend-badge':'Drayden · Legend Badge','humilau-gym-wave-badge':'Marlon · Wave Badge'};
 const gymLabel=(isSequel(game.value)?sequelGymNames:gymNames)[selected]||'';
 const gymDetail=row.kind==='gym'?`<p><b>Gym leader / badge:</b> ${escape(gymLabel||'Gym Badge')}</p>`:'';
 const trainer=row.kind==='gym'?gymLabel.split(' · ')[0]:'';
 const gymButton=trainer&&!trainer.includes('/')?`<button type="button" class="td73-gym-battle-button" data-td73-gym-trainer="${escape(trainer)}">⚔ Open in 6v6 Battle</button>`:'';
 details.innerHTML=`<h3>${escape(row.name)}</h3>${gymDetail}${gymButton}${tutors.length?`<p><b>Move Tutor:</b> ${escape(tutors[0].detail)}</p>`:''}${viewTutorRows(tutors)}${locationExtras(row.name)}<div id="td73-location-record"></div>`;
 const status=$('td73-location-record'),valid=()=>mine===detailRequest&&detailGame===activeMapGame&&status?.isConnected;
 const initial=mergeLocal(encounterRowsFor(row.name),row.name,detailGame);status.innerHTML=encounterHTML(initial)||'<small>Checking encounter records…</small>';
 if(row.kind==='gym'){status.innerHTML='';return;}
 try{const pack=encounterPack||await window.takDexEncounterV55?.cached?.(detailGame);if(!valid())return;const cached=encounterRowsFor(row.name,pack);if(cached.length){status.innerHTML=encounterHTML(mergeLocal(cached,row.name,detailGame));return;}}catch{}
 if(navigator.onLine===false){if(valid()){if(!initial.length)status.textContent='Encounter data not downloaded for this location.';else status.insertAdjacentHTML('beforeend','<small>Local records · full coverage unverified.</small>');}return;}
 try{const key=locKey(row.name),prefix=isUnovaGame(detailGame)?'unova':detailGame==='Emerald'?'hoenn':'sinnoh';let data=null;for(const n of [prefix+'-'+key,key]){try{const d=await api('location/'+encodeURIComponent(n));if(d?.region?.name&&d.region.name!==prefix)continue;if(Array.isArray(d?.areas)){data=d;break;}}catch{}}if(!valid())return;const areas=data?.areas||[],version=detailGame.toLowerCase().replace(/ /g,'-'),found=new Map();let successful=0;
 for(let i=0;i<areas.length;i+=4){const batch=areas.slice(i,i+4);await Promise.all(batch.map(async a=>{try{const area=await api('location-area/'+encodeURIComponent(a.name));if(!Array.isArray(area?.pokemon_encounters))return;successful++;for(const p of area.pokemon_encounters||[]){const vv=(p.version_details||[]).find(v=>v.version?.name===version);if(!vv)continue;let entry=found.get(p.pokemon.name);if(!entry)found.set(p.pokemon.name,entry={name:p.pokemon.name,records:[]});for(const d of vv.encounter_details||[])entry.records.push([row.name+' · '+a.name.replace((data.name||'')+'-',''),d.method?.name,d.min_level,d.max_level,(d.condition_values||[]).map(c=>c.name)]);}}catch{}}));if(!valid())return;}
 if(!valid())return;const loaded=encounterRowsFor(row.name);const rows=mergeLocal(loaded.length?loaded:[...found.values()],row.name,detailGame);status.innerHTML=encounterHTML(rows)||(data&&areas.length&&successful===areas.length?'<small>No wild encounters recorded for this version in the checked source.</small>':'<small>Encounter records unavailable for this location.</small>');if(areas.length&&successful<areas.length)status.insertAdjacentHTML('beforeend','<small>Some subareas could not be checked.</small>');else if(rows.length&&!loaded.length&&!successful)status.insertAdjacentHTML('beforeend','<small>Local records · full coverage unverified.</small>');
 }catch{if(valid()&&!initial.length)status.textContent='Encounter records unavailable for this location.';}

}
async function openSpecies(g,name){
 open(g);
 const revision=activeMapRevision;
 await loadEncounters();
 if(page.hidden||revision!==activeMapRevision)return;
 search.value=pretty(name);
 showSuggestions();
 const key=locKey(name);
 const index=activeSearch?.findIndex(r=>r.kind==='encounter'&&locKey(r.name.split(' · ')[0])===key);
 if(index>=0)selectSearch(index);
}
function setGame(g){
 const target=['Emerald','Platinum','Black','White','Black 2','White 2'].includes(g)?g:'';
 if(game.value!==target||activeMapGame!==target){game.value=target;loadDirectory();}
 else if(supported()&&!canvas.querySelector('svg[data-map-game="'+target+'"]'))loadDirectory();
}
function open(g,place){
 let target=g;
 if(!target){try{const id=localStorage.getItem('takdex-v71-active-team');const saved=JSON.parse(localStorage.getItem('poketact-teams')||'[]');const t=saved.find(t=>t.id===id);if(t?.game)target=t.game;}catch{}}
 const active=[...document.querySelectorAll('main > section')].find(el=>!el.hidden&&el.id!=='mapsPage');
 returnFrom={id:active?.id||'morePage',scroll:window.scrollY,tab:document.querySelector('.main-tabs .selected')?.id};
 $('backMaps').textContent=returnFrom.id==='morePage'?'← More':'← Back';
 for(const el of document.querySelectorAll('main > section'))el.hidden=el!==page;
 document.querySelectorAll('.main-tabs button').forEach((el,i)=>el.classList.toggle('selected',i===3));
 if(target&&!['Emerald','Platinum','Black','White','Black 2','White 2'].includes(target)){
  game.value='';loadDirectory();if(layout)layout.hidden=true;
  details.innerHTML=`<h3>Interactive map not yet available</h3><p class="note">${escape(target)} map is not enabled yet.</p>`;
  window.scrollTo(0,0);return;
 }
 if(target)setGame(target);
 else if(activeMapGame!==game.value||!canvas.querySelector('svg'))setGame(game.value);
 else display();
 // Every deep link carries its own version: resolve and select only after
 // the correct map has been loaded. No stale route numbers or Unova fallback.
 if(place&&supported()){
  search.value='';filter.value='all';encounterSet=[];
  const resolved=mapAcquisition(place,activeMapGame)||window.takDexMapsV73?.resolveLocation?.(place,activeMapGame);
  Promise.resolve().then(()=>{
   if(activeMapGame===game.value)openLocation(resolved||place,'move-checker');
  });
 }
 window.scrollTo(0,0);
}
details.addEventListener('click',e=>{
 const mon=e.target.closest('[data-td63-map-mon]');if(mon){window.takDexBattleNavigationV73?.showDex(mon.dataset.td63MapMon,'maps');return;}
 const move=e.target.closest('[data-td73-move-checker]');
 if(move){window.takDexOpenMoveFromMapsV73?.(move.dataset.td73MoveChecker,game.value);return;}
 const gym=e.target.closest('[data-td73-gym-trainer]');
 if(gym){if(window.takDexOpenGymFromMapV73?.(gym.dataset.td73GymTrainer,game.value)){
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
  else {$(previous.id).hidden=false;document.querySelectorAll('.main-tabs button').forEach((el,i)=>el.classList.toggle('selected',el.id===previous.tab));}
  requestAnimationFrame(()=>window.scrollTo(0,previous.scroll));
 }else window.takActivate(3);
});
game.addEventListener('change',()=>loadDirectory());
window.addEventListener('td58-pack-update',()=>{encounterPack=null;encounterLoading=null;loadEncounters();});
search.addEventListener('input',()=>{showSuggestions();const clear=$('mapsClearSelection');if(clear)clear.disabled=!(selected||search.value.trim()||encounterSet.length);});
search.addEventListener('focus',showSuggestions);
search.addEventListener('keydown',e=>{if(e.key==='Escape')hideSuggestions();if(e.key==='Enter'&&activeSearch?.length){e.preventDefault();selectSearch(0);}});
suggestions?.addEventListener('click',e=>{const b=e.target.closest('[data-map-result]');if(b)selectSearch(Number(b.dataset.mapResult));});
document.addEventListener('pointerdown',e=>{if(!e.target.closest('#mapsSearch,#mapsSuggestions'))hideSuggestions();});
filter.addEventListener('change',display);
details.addEventListener('click',e=>{const b=e.target.closest('[data-td74-encounter-place]');if(b)openLocation(b.dataset.td74EncounterPlace,'search');});
list.addEventListener('click',e=>{const button=e.target.closest('[data-location]');if(button)openLocation(button.dataset.location,'list');});
canvas.addEventListener('click',e=>{if(suppressClick){suppressClick=false;return;}const target=e.target.closest('[data-map-place]');if(target)openLocation(target.dataset.mapPlace,'map');});
canvas.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){const target=e.target.closest('[data-map-place]');if(target){e.preventDefault();openLocation(target.dataset.mapPlace,'map');}}});
function zoomTo(next,px=CX,py=CY){
 stopAnimation();const z=Math.min(isUnova()?14:4.4,Math.max(1,next));
 const x=(px-(CX*(1-zoom)+panX))/zoom,y=(py-(CY*(1-zoom)+panY))/zoom;
 moveViewport(z,px-CX*(1-z)-x*z,py-CY*(1-z)-y*z,false);
}
function clientToMap(e){const {b,s:scale}=mapGeometry();return {x:(e.clientX-b.left-(b.width-MAP_W*scale)/2)/scale,y:(e.clientY-b.top-(b.height-MAP_H*scale)/2)/scale};}
function fitEncounters(){
 const points=encounterSet.map(place=>getRow(place.name)).filter(Boolean);
 if(points.length<2)return;
 const left=Math.min(...points.map(p=>p.x)),right=Math.max(...points.map(p=>p.x));
 const top=Math.min(...points.map(p=>p.y)),bottom=Math.max(...points.map(p=>p.y));
 const {b,s}=mapGeometry(),padding=26/s+27;
 const zoom=Math.min(MAP_W/(right-left+2*padding),MAP_H/(bottom-top+2*padding));
 focusPoint((left+right)/2,(top+bottom)/2,zoom,false);
}
function setFull(on,restoreScroll=true){if(on===mapFull)return;mapFull=on;const bar=$('mapsFullscreen');if(on){fullScroll=window.scrollY;page.classList.add('td63-map-full');document.body.classList.add('td63-map-full-body');page.scrollTop=0;fullDetails.append(details);}else{regularDetails.prepend(details);fullDetails.open=false;page.classList.remove('td63-map-full');document.body.classList.remove('td63-map-full-body');if(restoreScroll)requestAnimationFrame(()=>window.scrollTo(0,fullScroll));}bar.textContent=on?'Exit fullscreen':'Fullscreen';bar.setAttribute('aria-pressed',String(on));showSelection();requestAnimationFrame(()=>fitEncounterGroup?fitEncounters():updateViewport());}
$('mapsFullscreen').onclick=()=>setFull(!mapFull);document.addEventListener('keydown',e=>{if(e.key==='Escape'&&mapFull&&!page.hidden)setFull(false)});new MutationObserver(()=>{if(page.hidden&&mapFull)setFull(false,false)}).observe(page,{attributes:true,attributeFilter:['hidden']});
$('mapsZoomIn').onclick=()=>zoomTo(zoom*1.35);
$('mapsZoomOut').onclick=()=>zoomTo(zoom/1.35);
$('mapsClearSelection').onclick=()=>{
 // Deliberately keep zoom and pan — this is not the Reset action.
 stopAnimation();++detailRequest;selected='';encounterSet=[];search.value='';activeSearch=null;hideSuggestions();
 details.innerHTML='<h3>Select a location</h3><p class="note">Search above or tap a route, city, or landmark.</p>';
 display();showSelection();
};
$('mapsZoomReset').onclick=()=>{++detailRequest;selected='';encounterSet=[];search.value='';hideSuggestions();filter.value='all';details.innerHTML='<h3>Select a location</h3><p class="note">Search above or tap a route, city, or landmark.</p>';display();showSelection();moveViewport(1,0,0);};
canvas.addEventListener('wheel',e=>{if(!supported())return;e.preventDefault();const p=clientToMap(e);zoomTo(zoom*(e.deltaY<0?1.14:1/1.14),p.x,p.y);},{passive:false});
canvas.addEventListener('pointerdown',e=>{
 if(!supported()||(e.pointerType==='mouse'&&e.button!==0))return;
 stopAnimation();if(!pointers.size)suppressClick=false;
 pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
 if(pointers.size===1){dragging=false;lastPointerX=e.clientX;lastPointerY=e.clientY;}
 if(pointers.size===2){dragging=true;suppressClick=true;try{canvas.setPointerCapture(e.pointerId);}catch(_){} }
});
canvas.addEventListener('pointermove',e=>{
 if(!pointers.has(e.pointerId)||!supported())return;
 const prev=pointers.get(e.pointerId),others=[...pointers.entries()].filter(([id])=>id!==e.pointerId);
 pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
 if(others.length){
  const other=others[0][1],d0=Math.hypot(prev.x-other.x,prev.y-other.y),d1=Math.hypot(e.clientX-other.x,e.clientY-other.y);
  const oldMid=clientToMap({clientX:(prev.x+other.x)/2,clientY:(prev.y+other.y)/2}),mid=clientToMap({clientX:(e.clientX+other.x)/2,clientY:(e.clientY+other.y)/2});
  if(d0>4&&d1>4){const z=Math.max(1,Math.min(isUnova()?14:4.4,zoom*d1/d0)),x=(oldMid.x-CX*(1-zoom)-panX)/zoom,y=(oldMid.y-CY*(1-zoom)-panY)/zoom;moveViewport(z,mid.x-CX*(1-z)-x*z,mid.y-CY*(1-z)-y*z,false);dragging=true;}return;
 }
 const dx=e.clientX-prev.x,dy=e.clientY-prev.y;
 if(Math.hypot(e.clientX-lastPointerX,e.clientY-lastPointerY)>5&&!dragging){dragging=true;try{canvas.setPointerCapture(e.pointerId);}catch(_){} }
 if(dragging){suppressClick=true;const {s}=mapGeometry();panX+=dx/s;panY+=dy/s;clampPan();updateViewport();}
});
function endPointer(e){pointers.delete(e.pointerId);if(!pointers.size)dragging=false;try{canvas.releasePointerCapture(e.pointerId);}catch(_){} }
canvas.addEventListener('pointerup',endPointer);canvas.addEventListener('pointercancel',endPointer);
document.addEventListener('click',e=>{
 const link=e.target.closest('[data-td73-map-link]');if(link){e.preventDefault();open(link.dataset.td73MapGame,link.dataset.td73MapLink);return;}
 if(e.target.closest('#teamsTab,#battleTab,#dexTab,#moreTab,#openPlanner,#openTM,#td56OpenCompare,#td68OpenMove,#td59OpenOffline'))page.hidden=true;
},true);
applyRegions();noGame();
window.takDexMapsV73={open,openSpecies,openLocation,mapAcquisition,setGameContext(g){setGame(g);},hasLocation:(name,g)=>{const ar=isUnovaGame(g)?unovaPlaces(g):g==='Platinum'?rows.sinnoh:g==='Emerald'?hoennPlaces:[];return ar.some(r=>locKey(r.name)===locKey(name));},resolveLocation:(name,g='Platinum')=>{
 const raw=String(name||'').split(' · ')[0].trim(),route=raw.match(/route\s+\d{3}/i);
 const places=(isUnovaGame(g)?unovaPlaces(g):g==='Platinum'?rows.sinnoh:g==='Emerald'?hoennPlaces:[]).filter(r=>r.kind!=='gym').sort((a,b)=>b.name.length-a.name.length);
 if(route)return places.find(r=>locKey(r.name)===locKey(route[0]))?.name||null;
 const q=locKey(sequelAlias(raw,g));
 return places.find(r=>q===locKey(r.name)||q.startsWith(locKey(r.name)+'-')||q.includes('-'+locKey(r.name)+'-'))?.name||null;
},gameRegions,regions:()=>Object.keys(atlas),legacySinnoh:originalSinnoh,platinumRoads:paths};
})();
