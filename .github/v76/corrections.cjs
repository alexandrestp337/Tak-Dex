const {chromium}=require('playwright-core');
const assert=require('node:assert/strict');
const path=require('node:path');

const base=process.argv[2]||'http://127.0.0.1:8775';
const shots=process.env.TAKDEX_SCREENSHOTS;
const baseline=process.env.TAKDEX_BASELINE;
const roster=['raichu','basculin-red-striped','magikarp','golbat','pikachu'];
const moveNames=['thunderbolt','volt-switch','focus-blast','thunder-wave'];
const enemyMoves=['hydro-pump','aqua-tail','chip-away','double-edge'];

(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try {
  const css=el=>{const style=getComputedStyle(el);return [style.borderLeftWidth,style.borderLeftColor];};
  const badgeCss=el=>{const style=getComputedStyle(el);return [style.color,style.textShadow,style.fontWeight,style.backgroundColor];};
  let approved={safe:['3px','rgb(59, 189, 131)'],danger:['3px','rgb(226, 74, 97)']};
  if(baseline){
   const reference=await browser.newPage();
   await reference.goto(baseline,{waitUntil:'domcontentloaded'});
   await reference.evaluate(()=>{
    document.querySelector('#battlePage').insertAdjacentHTML('beforeend',`<div class="td74-clash td74-expanded-pair" id="baseline-style-probe"><article class="td74-move-detail td74-effect-safe"><span class="td75-move-name">${pill('electric')}</span></article><article class="td74-move-detail td74-effect-danger"></article></div>`);
   });
   approved={
    safe:await reference.locator('#baseline-style-probe .td74-effect-safe').evaluate(css),
    danger:await reference.locator('#baseline-style-probe .td74-effect-danger').evaluate(css),
    badge:await reference.locator('#baseline-style-probe .pill').evaluate(badgeCss)
   };
   await reference.close();
   console.log('Read V75-STABLE computed move accents and Electric badge styles');
  }
  for(const width of [320,412,1280]){
   const page=await browser.newPage({viewport:{width,height:900},isMobile:width<500,hasTouch:width<500,ignoreHTTPSErrors:true});
   page.setDefaultTimeout(12000);
   const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base,{waitUntil:'domcontentloaded'});
   await page.evaluate(async ({roster,moveNames})=>{
    const pokemon=await Promise.all(roster.map(async (name,i)=>{
     const p=await api('pokemon/'+name);
     const moves=i===0?await Promise.all(moveNames.map(async name=>{
      const move=await api('move/'+name);
      return {name:pretty(name),...moveGenerationData(move,5,'Black')};
     })):[];
     return {id:p.id,name:pretty(p.name),types:historicalTypes(p,'Black'),abilities:historicalAbilities(p,'Black'),baseStats:Object.fromEntries(td76HistoricalStats(p,'Black').map(s=>[s.stat.name,s.base_stat])),moves};
    }));
    teams.push({id:'correction-check',name:'Correction check',game:'Black',pokemon});
    save();openTeam('correction-check');
   },{roster,moveNames});
   await page.locator('#battleTab').click();
   await page.evaluate(()=>td74OpenBattleOpponent('darmanitan','Black'));
   const battle=page.locator('#matchups .td74-clash');
   const thunder=battle.locator('.td76-move-card').filter({has:page.locator('[data-td76-move="Thunderbolt"]')});
   assert.match(await thunder.locator('.td76-move-effect').textContent(),/1\.5×STAB/);
   assert.equal(await thunder.getAttribute('data-type-effect'),'1');
   assert.equal(await thunder.evaluate(node=>node.classList.contains('td74-effect-neutral')),true);
   const orderCheck=async(host,label,side,color)=>{
    const badge=host.locator('.td76-turn-order');
    assert.equal(await badge.count(),1);
    assert.equal(await badge.textContent(),label);
    assert.equal(await badge.evaluate(el=>{
     const row=el.parentElement,header=row.previousElementSibling;
     const info=['strong','.td77-duel-types','.td77-duel-ability','.td31-duel-level','.td77-duel-item'];
     const sides=[...header.querySelectorAll('.td77-duel-mon')];
     return row.classList.contains('td77-turn-row')&&header.classList.contains('td75-duel-title')&&
      sides.length===2&&info.every(selector=>{
       const [a,b]=sides.map(side=>side.querySelector(selector)?.getBoundingClientRect().top);
       return a===b;
      })&&row.getBoundingClientRect().height===32;
    }),true);
    assert.equal(await badge.getAttribute('data-side'),side==='opponent'?'opp':'own');
    assert.ok(await badge.evaluate((el,side)=>el.classList.contains(side),side));
    if(color)assert.equal(await badge.evaluate(el=>getComputedStyle(el).color),color);
   };
   await orderCheck(battle,'Should strike first','player','rgb(71, 217, 145)');
   assert.notEqual((await thunder.evaluate(css))[0],'3px');
   const typeBadge=await thunder.locator('.pill').evaluate(badgeCss);
   assert.equal(typeBadge[0],'rgb(255, 255, 255)');
   assert.match(typeBadge[1],/rgba\(0, 0, 0/);
   if(approved.badge)assert.deepEqual(typeBadge,approved.badge);
   if(shots&&width!==320)await battle.screenshot({path:path.join(shots,'quick-battle-'+width+'.png'),style:'.main-tabs{visibility:hidden}'});
   const crown=page.locator('#td76BattleStrip .td74-crowned.active');
   const gold=async locator=>{
    assert.equal(await locator.evaluate(node=>getComputedStyle(node).borderTopColor),'rgb(255, 224, 123)');
    assert.match(await locator.evaluate(node=>getComputedStyle(node).boxShadow),/255, 198, 49/);
    assert.notEqual(await locator.evaluate(node=>getComputedStyle(node).outlineStyle),'solid');
   };
   await gold(crown);
   const stab=await page.evaluate(async()=>{
    const data=await api('move/thunderbolt');
    const m={name:'Thunderbolt',...moveGenerationData(data,5,'Black')};
    const stats={hp:100,attack:100,defense:100,speed:100,'special-attack':100,'special-defense':100};
    const a={types:['electric'],level:50,battleStats:stats};
    const neutral={types:['normal'],level:50,battleStats:stats};
    return [
     ...['normal','water','grass'].map(type=>td2Combined(m,a,{...neutral,types:[type]},5)),
     estimateDamage(a,neutral,m,5),estimateDamage({...a,types:['normal']},neutral,m,5)
    ];
   });
   assert.deepEqual(stab,[1.5,3,.75,64,43]);

   await page.evaluate(()=>td74OpenBattleOpponent('basculin-red-striped','Black'));
   const defense=battle.locator('.td76-defense-type');
   assert.match(await defense.textContent(),/1× Neutral/);
   const defensivePanel=battle.locator('.td76-defense');
   assert.equal(await defense.count(),1);
   assert.equal((await defense.evaluate(css))[0],'3px');
   assert.ok(await defensivePanel.evaluate(panel=>panel.offsetHeight<panel.parentElement.offsetHeight));
   assert.match(await defensivePanel.locator('.td76-defense-stats').textContent(),/Base Atk.+Sp\. Atk.+Spe.+tendency/);
   if(shots&&width!==320)await battle.screenshot({path:path.join(shots,'defense-single-'+width+'.png'),style:'.main-tabs{visibility:hidden}'});
   await page.evaluate(async()=>{
    const p=await api('pokemon/darmanitan');
    current.pokemon[0].types=historicalTypes(p,'Black');
    showBattle();
   });
   assert.match(await defense.textContent(),/2× Weak/);
   assert.equal(await defense.evaluate(node=>node.classList.contains('td74-effect-danger')),true);
   await page.evaluate(()=>{current.pokemon[0].types=['grass'];showBattle();});
   assert.match(await defense.textContent(),/0\.5× Resists/);
   assert.equal(await defense.evaluate(node=>node.classList.contains('td74-effect-safe')),true);
   await page.evaluate(async()=>{current.pokemon[0].types=['fire','electric'];await td74OpenBattleOpponent('pelipper','Black');});
   await page.waitForFunction(()=>document.querySelectorAll('#matchups .td76-defense-type').length===2);
   assert.match(await defense.filter({hasText:'Water'}).textContent(),/2× Weak/);
   assert.match(await defense.filter({hasText:'Flying'}).textContent(),/0\.5× Resists/);
   const tones=await defense.evaluateAll(rows=>rows.map(row=>getComputedStyle(row).borderLeftColor));
   assert.deepEqual(new Set(tones),new Set(['rgb(255, 113, 131)','rgb(87, 202, 146)']));
   if(shots&&width!==320)await battle.screenshot({path:path.join(shots,'defense-dual-'+width+'.png'),style:'.main-tabs{visibility:hidden}'});
   await page.evaluate(async()=>{
    current.pokemon[0].types=['electric'];current.pokemon[0].abilities=['levitate'];current.pokemon[0].ability='levitate';
    await td74OpenBattleOpponent('sandshrew','Black');
   });
   assert.match(await defense.textContent(),/0× Immune/);
   assert.equal((await defense.evaluate(css))[1],'rgb(87, 202, 146)');
   await page.evaluate(async()=>{
    current.pokemon[0].abilities=['static'];current.pokemon[0].ability='static';
    await td74OpenBattleOpponent('basculin-red-striped','Black');
   });

   await page.evaluate(()=>{current.pokemon[0].types=['electric'];showBattle();});
   await orderCheck(battle,'Speed too close to call','neutral');
   await page.evaluate(()=>td74OpenBattleOpponent('jolteon','Black'));
   await orderCheck(battle,'Should strike first','opponent','rgb(255, 101, 117)');
   assert.deepEqual(await thunder.evaluate(css),approved.danger);
   const immunity=await page.evaluate(async()=>{
    const m={name:'Earthquake',type:'ground',power:100,accuracy:100,damageClass:'physical'};
    const markup=td76QuickMoveCards({types:['ground'],moves:[m]},{types:['electric'],abilities:['levitate']},5);
    return /td74-effect-danger/.test(markup)&&/Immune/.test(markup);
   });
   assert.equal(immunity,true);

   await page.locator('#moreTab').click();
   await page.locator('#openPlanner').click();
   await page.locator('#planGame').selectOption('Black');
   await page.locator('#planTeam').selectOption('correction-check');
   await page.locator('#planMode').selectOption('custom');
   await page.evaluate(enemyMoves=>{
    plannerOpp[0]={name:'basculin-red-striped',level:50,moves:enemyMoves};
    renderPlannerSlots('planOpp',plannerOpp,false);
    document.getElementById('planAnalyze').click();
   },enemyMoves);
   const grid=page.locator('#td74Focus .td76-duel-grid');
   await page.waitForFunction(()=>document.querySelectorAll('#td74Focus .td76-move-card').length===8);
   await gold(page.locator('#td74OwnChips .td74-crowned.active'));
   const aligned=await grid.locator('.td76-move-card').evaluateAll(cards=>cards.every((card,i)=>{
    const row=cards[i^1].getBoundingClientRect();
    const rect=card.getBoundingClientRect(), head=card.querySelector('.td76-move-head');
    const name=head.querySelector('button').getBoundingClientRect(),type=head.querySelector('.pill').getBoundingClientRect();
    const category=card.querySelector('.td76-move-category').getBoundingClientRect();
    return row.top===rect.top&&row.height===rect.height&&name.right<=type.left&&type.right<=rect.right&&category.top>=name.bottom&&head.scrollWidth<=head.clientWidth;
   }));
   assert.equal(aligned,true);
   assert.equal(await grid.locator('.td76-damage-track.incoming').count(),4);
   const electric=grid.locator('.td76-move-card').filter({has:page.locator('[data-td76-move="Thunderbolt"]')});
   assert.deepEqual(await electric.evaluate(css),approved.safe);
   assert.match(await electric.textContent(),/Guaranteed OHKO/);
   const focusBlast=grid.locator('.td76-move-card').filter({has:page.locator('[data-td76-move="Focus Blast"]')});
   assert.match(await focusBlast.textContent(),/2HKO chance:/);
   await orderCheck(page.locator('#td74Focus'),'Strikes first','player','rgb(71, 217, 145)');
   const turnOffset=()=>page.locator('#td74Focus .td77-turn-row').evaluate(row=>row.getBoundingClientRect().top-row.previousElementSibling.getBoundingClientRect().top);
   const originalTurnOffset=await turnOffset();
   if(shots&&width!==320)await page.locator('#td74Focus .td74-clash').screenshot({path:path.join(shots,'battle-'+width+'.png'),style:'.main-tabs{visibility:hidden}'});
   assert.equal(await page.locator('#td74EditorOwn').isVisible(),false);
   if(shots&&width!==320)await page.locator('#plannerPage').screenshot({path:path.join(shots,'saved-6v6-'+width+'.png'),style:'.main-tabs{visibility:hidden}'});
   await page.locator('#td74EditorOpp > summary').click();
   const slot=page.locator('#planOpp details.td63-slot').first();
   await slot.locator('summary').first().click();
   await slot.locator('.td74-battle-stats > summary').click();
   const stat=slot.locator('.td76-stat-stepper').first();
   assert.equal(await stat.evaluate(el=>{
    const [minus,input,plus]=[...el.children].map(n=>n.getBoundingClientRect());
    return minus.right<input.left&&input.right<plus.left&&Math.abs(minus.y-plus.y)<=1&&Math.abs(input.y-plus.y)<=1;
   }),true);

   await page.evaluate(()=>{
    plannerOwn[1].moves=['double-edge'];
    plannerOwn[1].statAdjustments={attack:600,speed:800};
    plannerOpp[0].moves=['hyper-beam'];
    plannerOpp[0].statAdjustments={'special-attack':500,speed:500};
    document.getElementById('planAnalyze').click();
   });
   await page.locator('#td74OwnChips [data-td74-i="1"].td74-crowned').waitFor();
   await page.locator('#td74OwnChips [data-td74-i="0"]').click();
   const warning=page.locator('#td74Focus .td76-battle-warning');
   assert.match(await warning.textContent(),/Hyper Beam can KO before you attack/);
   assert.equal(await warning.evaluate(el=>{
    const css=getComputedStyle(el);
    return css.borderTopWidth==='1px'&&css.fontWeight==='800'&&css.backgroundColor==='rgb(64, 30, 39)'&&css.color==='rgb(255, 138, 152)';
   }),true);
   if(shots&&width!==320)await page.locator('#td74Focus .td74-clash').screenshot({path:path.join(shots,'incoming-ko-'+width+'.png'),style:'.main-tabs{visibility:hidden}'});
   assert.doesNotMatch(await warning.textContent(),/No safe|Opponent moves first|Better matchup/i);
   await orderCheck(page.locator('#td74Focus'),'Strikes first','opponent','rgb(255, 101, 117)');
   assert.ok(Math.abs(await turnOffset()-originalTurnOffset)<0.5);
   assert.equal(await warning.evaluate(el=>el.previousElementSibling.classList.contains('td77-turn-row')),true);
   const lethalMove=grid.locator('.td76-move-card').filter({has:page.locator('[data-td76-move="Thunderbolt"]')});
   assert.match(await lethalMove.textContent(),/OHKO chance: 10%/);
   await page.evaluate(()=>{
    plannerOpp[0].moves=['ice-beam'];
    document.getElementById('planAnalyze').click();
   });
   await grid.locator('[data-td76-move="Ice Beam"]').waitFor();
   assert.match(await lethalMove.textContent(),/OHKO damage · may be KO’d before attacking/);
   assert.doesNotMatch(await lethalMove.textContent(),/Guaranteed|OHKO chance:/);

   await page.locator('#moreTab').click();
   assert.equal(await page.locator('#openTM').count(),0);
   await page.locator('#td68OpenMove').click();
   await page.locator('#td68MoveInput').fill('HM03');
   await page.locator('#td68MoveGo').click();
   await page.locator('#tmMoveResults button').filter({hasText:'Surf'}).click();
   await page.waitForFunction(()=>document.querySelector('#td68MoveResult h2')?.textContent.includes('Surf'));
   assert.equal(await page.locator('#td68MovePage #tmPage').isVisible(),true);
   await page.locator('#tmTeam').selectOption('correction-check');
   await page.locator('#tmMoveSearch').fill('Surf');
   await page.locator('#tmMoveResults button').filter({hasText:'Surf'}).click();
   await page.locator('#td5TMStrip .td5-tm-now').first().waitFor();
   assert.equal(await page.locator('#td5TMStrip .td74-mon-chip').count(),6);
   assert.match(await page.locator('#td5TMStrip .td5-tm-now').first().textContent(),/HM03/);
   await page.locator('#tmTeam').selectOption('');
   await page.locator('#tmMoveSearch').fill('Surf');
   await page.locator('#tmMoveResults button').filter({hasText:'Surf'}).click();
   await page.locator('#tmPokemon').fill('basculin-red-striped');
   await page.locator('#tmPokemonResults [data-value="basculin-red-striped"]').click();
   await page.locator('#tmResults .td5-tm-now').waitFor();
   await page.locator('#td65MachineGuide > summary').click();
   const mapLink=page.locator('#td65MachineGuide [data-td74-tm-map]');
   await mapLink.click();
   await page.locator('#backMaps').click();
   assert.equal(await page.locator('#td68MovePage').isVisible(),true);
   assert.equal(await page.locator('#tmResults .td5-tm-now').isVisible(),true);
   await page.locator('#tmPokemon').fill('magikarp');
   await page.locator('#tmPokemonResults [data-value="magikarp"]').click();
   await page.locator('#tmResults .td5-tm-later').waitFor();
   assert.match(await page.locator('#tmResults .td5-tm-later').textContent(),/Gyarados/);
   await page.locator('[data-move-catalog="tm"]').click();
   await page.locator('#tmMoveSearch').fill('26');
   await page.locator('#tmMoveResults button').filter({hasText:'Earthquake'}).click();
   await page.waitForFunction(()=>document.querySelector('#td68MoveResult h2')?.textContent.includes('Earthquake'));
   await page.locator('[data-move-catalog=""]').click();
   await page.locator('#td68MoveInput').fill('Thunderbolt');
   await page.locator('#td68MoveInput').press('Enter');
   await page.waitForFunction(()=>document.querySelector('#td68MoveResult h2')?.textContent.includes('Thunderbolt'));
   const pikachu=page.locator('#td72MoveCompatibility .td5-tm-now').filter({hasText:'Pikachu'});
   assert.match(await pikachu.textContent(),/LVL/);

   await page.locator('#teamsTab').click();
   await page.locator('[data-td74-builder-team="correction-check"][data-td74-builder-slot="0"]').click();
   const panelStyle=el=>{
    const css=getComputedStyle(el);
    return [css.borderTopColor,css.borderTopWidth,css.borderTopLeftRadius];
   };
   assert.equal(await page.locator('#td74BuilderDex').isVisible(),true);
   const profile=page.locator('#td77BuilderBattle');
   await profile.waitFor();
   assert.equal(await profile.evaluate(el=>el.open),false);
   assert.equal(await profile.locator('details[open]').count(),0);
   assert.match(await page.locator('#pokePreview').textContent(),/Lv 50/);
   assert.equal(await page.locator('#moveFields [data-move-input]:visible').count(),4);
   assert.equal(await profile.locator('.td74-battle-stats #td77BuilderLevel').count(),1);
   assert.equal(await profile.locator('.td77-builder-equipment #td2TeamAbility').count(),1);
   assert.equal(await profile.locator('.td77-builder-equipment #td77BuilderItem').count(),1);
   if(shots&&width!==320)await page.locator('.td74-builder-inline').screenshot({path:path.join(shots,'settings-collapsed-'+width+'.png'),style:'.main-tabs{visibility:hidden}'});
   await profile.locator(':scope > summary').click();
   assert.equal(await profile.locator('.td77-builder-equipment').evaluate(el=>el.open),false);
   assert.equal(await profile.locator('.td74-battle-stats').evaluate(el=>el.open),false);
   await profile.locator('.td74-battle-stats > summary').click();
   await profile.locator('.td77-builder-equipment > summary').click();
   if(shots&&width!==320)await page.locator('.td74-builder-inline').screenshot({path:path.join(shots,'settings-expanded-'+width+'.png'),style:'.main-tabs{visibility:hidden}'});
   const builderOutline=await page.locator('.td74-builder-inline').evaluate(panelStyle);
   await page.locator('[data-td41-team-plan="correction-check"]').click();
   await page.locator('#td4Slots [data-td4-slot="0"]').click();
   assert.deepEqual(await page.locator('#td4Edit').evaluate(panelStyle),builderOutline);
   assert.equal(await page.locator('#td4TeamPlannerPage button').filter({hasText:/^Pokédex$/}).count(),0);

   await page.evaluate(()=>takDexBattleNavigationV73.showDex('zigzagoon','dex',{game:'Emerald',id:263}));
   const dexActions=page.locator('#dexResult .td74-dex-actions');
   await dexActions.waitFor();
   assert.equal(await dexActions.evaluate(el=>{
    const card=el.closest('.td66-pokemon-card').getBoundingClientRect();
    const [left,right]=[...el.querySelectorAll('button')].map(node=>node.getBoundingClientRect());
    return Math.abs((left.left+right.right)-(card.left+card.right))<=2&&
     Math.abs(left.width-right.width)<=1&&left.height===right.height&&left.y===right.y;
   }),true);

   await page.locator('#moreTab').click();
   await page.locator('#openMaps').click();
   await page.locator('#mapsGame').selectOption('Emerald');
   const toolbar=page.locator('.td73-map-toolbar');
   const toolbarFits=()=>toolbar.evaluate(el=>{
    const row=el.getBoundingClientRect();
    return [...el.querySelectorAll('button,#mapsZoomValue')].every(n=>{
     const r=n.getBoundingClientRect();
     return r.left>=row.left-1&&r.right<=row.right+1&&r.bottom<=row.bottom+1&&r.height>0;
    });
   });
   assert.equal(await toolbarFits(),true);
   await page.locator('#mapsFullscreen').click();
   assert.equal(await toolbarFits(),true);
   if(shots&&width===412)await page.screenshot({path:path.join(shots,'map-412.png')});
   assert.deepEqual(errors,[]);
   console.log(width+'px: V75 accents and badge, turn order, KO labels, aligned cards, team editor, centered Pokédex actions and prior regression checks passed');
   await page.close();
  }
 } finally {await browser.close();}
})().catch(err=>{console.error(err);process.exitCode=1;});
