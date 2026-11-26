const assert = require('node:assert/strict');
const { chromium } = require('playwright-core');

const url = process.argv[2] || 'http://127.0.0.1:8795';
const party = [
 { id: 54, name: 'Psyduck', level: 22, types: ['water'], moves: [{ name: 'Water Gun' }, { name: 'Scratch' }, { name: 'Frustration' }] },
 { id: 58, name: 'Growlithe', level: 26, types: ['fire'], moves: [{ name: 'Flame Wheel' }, { name: 'Bite' }, { name: 'Reversal' }, { name: 'Take Down' }] },
 { id: 81, name: 'Magnemite', level: 22, types: ['electric', 'steel'], moves: [{ name: 'ThunderShock' }, { name: 'SonicBoom' }] },
 { id: 559, name: 'Scraggy', level: 22, types: ['dark', 'fighting'], moves: [{ name: 'Faint Attack' }, { name: 'Brick Break' }] },
];
const seed = { id: 'round5', name: 'Route and moveset checks', game: 'Black 2', pokemon: party, saveLink: { progression: { badgeCount: 3 } } };
const planKey = 'Black 2:round5';
const moves = list => list.map(m => m.replacement || m.move);
const selected = (page, i) => page.evaluate(([key, i]) => JSON.parse(localStorage.getItem('takdex-v74-playthrough-plans'))[key].slots[i], [planKey, i]);

async function openPlanner(page) {
 await page.goto(url, { waitUntil: 'domcontentloaded' });
 const link = page.locator('[data-td41-team-plan="round5"]');
 if (!await link.isVisible()) await page.locator('[data-td71-toggle="round5"]').click();
 await link.click();
 await page.locator('#td77MoveViews').waitFor();
}
async function openEditor(page, i) {
 const tile = page.locator(`#td4Slots [data-td4-slot="${i}"]`);
 if (await tile.getAttribute('aria-expanded') !== 'true') await tile.click();
 const change = page.locator('#td4Edit > details.td42-settings').first();
 if (!await change.evaluate(el => el.open)) await change.locator(':scope > summary').click();
}
async function preview(page, name) {
 await page.locator('#td4Search').fill(name);
 await page.locator(`#td4SearchResults [data-value="${name}"]`).first().click();
 await page.locator('#td63ManualCandidate [data-td77-preview-route]').waitFor();
}
async function choose(page, i, name) {
 await page.locator('[data-td63-manual-select]').click();
 await page.waitForFunction(([key, i, name]) => JSON.parse(localStorage.getItem('takdex-v74-playthrough-plans'))[key].slots[i]?.name === name, [planKey, i, name]);
 await page.locator('#td72MoveTitle').filter({ hasText: new RegExp(name, 'i') }).waitFor();
}
async function press(page, locator, touch) {
 const rect = await locator.boundingBox();
 const x = Math.floor(rect.x + rect.width / 2);
 const y = Math.floor(rect.y + rect.height / 2);
 if (!touch) {
  await page.mouse.move(x, y);
  await page.mouse.down();
  return () => page.mouse.up();
 }
 const session = await page.context().newCDPSession(page);
 await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
 return async () => { await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await session.detach(); };
}
async function dexSearch(page, name) {
 await page.locator('#dexTab').click();
 await page.locator('#dexGame').selectOption('Black 2');
 await page.locator('#dexInput').fill(name);
 await page.locator('#dexResults button').filter({ hasText: new RegExp(name, 'i') }).first().click();
 await page.locator('#dexResult [data-td71-quick-compare]').first().waitFor();
}

(async () => {
 const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
 try {
  for (const width of [320, 360, 390, 412, 1280]) {
   const page = await browser.newPage({ viewport: { width, height: 870 }, hasTouch: width < 600, isMobile: width < 600, ignoreHTTPSErrors: true, reducedMotion: 'reduce' });
   const errors = [];
   page.on('pageerror', error => errors.push(error.message));
   await page.addInitScript(team => {
    if (!localStorage.getItem('poketact-teams')) localStorage.setItem('poketact-teams', JSON.stringify([team]));
   }, seed);
   await openPlanner(page);
   await openEditor(page, 0);
   await page.locator('#td4Candidates [data-candidate-id]').first().waitFor();
   assert.ok(Number((await page.locator('#td4CandidateStatus').textContent()).match(/^\d+/)?.[0]) > 24);
   await page.locator('#td77TypeFilter').click();
   assert.equal(await page.locator('[data-td77-filter-type="fairy"]').count(), 0);
   await page.locator('[data-td77-filter-type="ground"]').click();
   await page.locator('[data-td77-filter-type="dragon"]').click();
   await page.locator('#td77RequireTypes').check();
   assert.equal(await page.locator('#td77ActiveTypes .pill').count(), 2);
   await page.locator('#td4Search').fill('flyg');
   await page.locator('#td4SearchResults [data-value="flygon"]').waitFor();
   await page.locator('[data-td77-clear-types]').click();
   await page.locator('#td77TypeFilter').click();
   const geometry = await page.evaluate(() => {
    const progress = [...document.querySelectorAll('#td4PlanProgress>div')].map(row => [...row.children].map(x => x.getBoundingClientRect().width));
    const action = ['td77Lock', 'td4Clear'].map(id => document.getElementById(id).getBoundingClientRect());
    const search = document.getElementById('td4Search').getBoundingClientRect();
    const filter = document.getElementById('td77TypeFilter').getBoundingClientRect();
    return { width: document.documentElement.clientWidth, overflow: document.documentElement.scrollWidth, progress,
     filterAlignment: search.right <= filter.left && Math.abs(search.top - filter.top) < 2, buttonAlignment: [
      action[0].right < action[1].left, Math.abs((action[0].top + action[0].height / 2) - (action[1].top + action[1].height / 2))
    ] };
   });
   assert.equal(geometry.width, width);
   assert.equal(geometry.overflow, width);
   assert.equal(geometry.filterAlignment, true);
   assert.deepEqual(geometry.progress.map(row => row.length), [3, 2]);
   assert.ok(geometry.progress.every(row => Math.max(...row) - Math.min(...row) < 1));
   assert.equal(geometry.buttonAlignment[0], true);
   assert.ok(geometry.buttonAlignment[1] < 2);
   if (process.env.TAKDEX_SCREENSHOTS) await page.screenshot({ path: `${process.env.TAKDEX_SCREENSHOTS}/r5-${width}.png` });

   if (width === 390) {
    const output = {};
    for (const [i, name] of [[0, 'golduck'], [1, 'arcanine']]) {
     await openEditor(page, i);
     await preview(page, name);
     await choose(page, i, name);
     const slot = await selected(page, i);
     assert.equal(slot.acquisitionRoute.startId, party[i].id);
     for (const mode of ['duringMoves', 'plannedMoves']) assert.equal(moves(slot[mode]).filter(Boolean).length, 4);
     output[name] = { during: moves(slot.duringMoves), final: moves(slot.plannedMoves), route: slot.acquisitionRoute.id };
    }
    console.log('Full pool, four filled planned slots with two team slots empty', JSON.stringify(output));
    await openEditor(page, 0);
    const currentRoute = page.locator('[data-td77-route="slot"]');
    const direct = await currentRoute.locator('option').filter({ hasText: /Obtain Golduck directly.*Village Bridge.*Walk/ }).first().getAttribute('value');
    await currentRoute.selectOption(direct);
    await page.waitForFunction(key => JSON.parse(localStorage.getItem('takdex-v74-playthrough-plans'))[key].slots[0].acquisitionRoute.startId === 55, planKey);
    assert.match(await page.locator('#td77SlotRoute').textContent(), /Village Bridge.*Lv 36–38/);
    assert.equal(Object.keys((await selected(page, 0)).finalLearnset.learnBefore).length, 0);
    await openEditor(page, 4);
    await preview(page, 'flygon');
    assert.match(await page.locator('[data-td77-preview-route]').textContent(), /Trapinch.*Vibrava.*35.*Flygon.*45/);
    const location = page.locator('[data-td77-preview-route] [data-td74-dex-map="Desert Resort"]');
    await location.scrollIntoViewIfNeeded();
    const originScroll = await page.evaluate(() => scrollY);
    await location.click();
    await page.waitForFunction(() => document.querySelector('#mapsSelectionLabel')?.textContent === 'Desert Resort');
    await page.locator('#backMaps').click();
    await page.waitForFunction(y => Math.abs(scrollY - y) < 5, originScroll);
    assert.ok(await page.locator('#td63ManualCandidate').isVisible());
    await choose(page, 4, 'flygon');
    assert.equal((await selected(page, 4)).acquisitionRoute.startId, 328);
    for (const mode of ['during', 'final']) {
     await page.locator(`[data-view="${mode}"]`).click();
     const field = page.locator(`${mode === 'during' ? '[data-td77-during="0"]' : '[data-td45-move="0:goal"]'}`);
     await field.click();
     assert.equal(await field.evaluate(input => input.selectionEnd - input.selectionStart), (await field.inputValue()).length);
     await field.fill('fly');
     await field.locator('..').locator('[data-td45-pick="fly"]').waitFor();
     if (mode === 'during') {
      await field.press('Enter');
      await page.waitForFunction(key => JSON.parse(localStorage.getItem('takdex-v74-playthrough-plans'))[key].slots[4].duringMoves[0].move === 'fly', planKey);
     }
    }
    const tile = page.locator('#td4Slots [data-td4-slot="4"]');
    await tile.scrollIntoViewIfNeeded();
    const release = await press(page, tile, true);
    const menu = page.locator('dialog[open]');
    await menu.getByRole('button', { name: 'Open Pokédex' }).waitFor();
    assert.equal(await menu.getByRole('button', { name: 'Compare', exact: true }).count(), 0);
    await release();
    await menu.getByRole('button', { name: 'Open Pokédex' }).click();
    await page.locator('#dexResult .dex-entry[data-td71-quick-compare="flygon"]').waitFor();
    await page.locator('#td73DexReturn').click();
    await page.locator('#td72MoveTitle').filter({ hasText: 'Flygon' }).waitFor();
    await openEditor(page, 5);
    await preview(page, 'ninetales');
    const select = page.locator('[data-td77-route="preview"]');
    const vulpix = await select.locator('option').filter({ hasText: 'Obtain Vulpix' }).first().getAttribute('value');
    await select.selectOption(vulpix);
    await page.locator('[data-td77-preview-route]').filter({ hasText: 'Use a Fire Stone' }).waitFor();
    await choose(page, 5, 'ninetales');
    await page.locator('#td77Improvements').locator('..').locator('summary').first().click();
    const warning = page.locator('#td77Improvements').getByText(/Fire Stone.*2 required/);
    await warning.waitFor();
    assert.match(await warning.textContent(), /1 required for routes after the deadline/);
    await page.reload({ waitUntil: 'domcontentloaded' });
    const link = page.locator('[data-td41-team-plan="round5"]');
    if (!await link.isVisible()) await page.locator('[data-td71-toggle="round5"]').click();
    await link.click();
    await page.locator('#td72MoveTitle').filter({ hasText: 'Ninetales' }).waitFor();
    assert.equal((await selected(page, 5)).acquisitionRoute.startId, 37);
    console.log('Flygon routes, map return, future Fly, held touch, stone warning and refresh passed');
   }
   if (width === 1280) {
    await dexSearch(page, 'Emboar');
    const learnset = page.locator('[data-dex-section="learnset"]');
    if (!await learnset.evaluate(el => el.open)) await learnset.locator('summary').click();
    const hammer = learnset.locator('[data-td68-move="hammer-arm"]');
    assert.match(await hammer.locator('xpath=../../..').textContent(), /Move Reminder.*Pokémon World Tournament.*One Heart Scale/);
    await hammer.click();
    await page.locator('#td68MoveResult .td64-move-back').click();
    assert.ok(await learnset.isVisible());
    const hero = page.locator('#dexResult [data-td71-quick-compare]').first();
    await hero.scrollIntoViewIfNeeded();
    const release = await press(page, hero, false);
    const quick = page.locator('#td71CompareQuick');
    await quick.waitFor();
    await release();
    await quick.locator('[data-td71-quick-side="A"]').click();
    assert.ok(await quick.isVisible());
    await quick.locator('#td71QuickClose').click();
    await dexSearch(page, 'Golduck');
    await hero.scrollIntoViewIfNeeded();
    const end = await press(page, hero, false);
    await quick.waitFor();
    await end();
    await quick.locator('[data-td71-quick-side="B"]').click();
    assert.match(await quick.textContent(), /Emboar.*Golduck/);
    await quick.locator('#td77QuickOpen').click();
    await page.locator('#td56ComparePage .td56-cards').first().waitFor();
    await page.waitForFunction(() => Math.abs(document.querySelector('#td56ComparePage .td56-cards').getBoundingClientRect().top) < 100);
    await page.locator('#td56Back').click();
    await page.locator('#dexResult .dex-entry[data-td71-quick-compare="golduck"]').waitFor();
    await page.locator('#moreTab').click();
    await page.locator('#td68OpenMove').click();
    await page.getByRole('tab', { name: 'TM / HM' }).click();
    await page.locator('#tmGame').selectOption('Black 2');
    await page.locator('#tmMoveSearch').fill('fly');
    const machine = page.locator('#tmMoveResults [data-td77-machine-move="fly"]');
    await machine.locator('.pill').waitFor();
    assert.match(await machine.textContent(), /HM02.*Fly.*Flying.*Physical.*PWR 90.*ACC 95%/i);
    await machine.click();
    await page.locator('#td68MoveResult .td64-move-back').waitFor();
    await page.getByRole('button', { name: '← More', exact: true }).click();
    assert.ok(await page.locator('#morePage').isVisible());
    console.log('Move Reminder, mouse hold, Quick Compare and combined TM/HM navigation passed');
   }
   assert.deepEqual(errors, []);
   console.log(width + 'px responsive planner geometry passed');
   await page.close();
  }
 } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
