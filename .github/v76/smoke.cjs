const { chromium } = require('playwright-core');
const assert = require('node:assert/strict');
(async () => {
 const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium', args:['--no-sandbox']});
 try {
  for (const width of [412,1280]) {
   const context = await browser.newContext({viewport:{width,height:850}, isMobile:width===412,hasTouch:width===412});
   const page = await context.newPage();
   const errors = [];
   page.on('pageerror', e => errors.push(e.message));
   await page.goto(process.argv[2], {waitUntil:'domcontentloaded'});
   await page.waitForFunction(() => !!window.takDexDB74 && !!window.takDexMoveV68);
   assert.match(await page.locator('footer').textContent(), /Developed by WHOASP/);
   await page.locator('#moreTab').click();
   await page.locator('#openMaps').click();
   await page.waitForFunction(() => !document.getElementById('mapsPage').hidden);
   assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
   const historical=await page.evaluate(async()=>{
    const assurance=await takDexDB74.api('move/assurance');
    const steelResistance=matchup('ghost',['steel'],5);
    return [moveGenerationData(assurance,5,'Black').power,moveGenerationData(assurance,6,'X').power,steelResistance];
   });
   assert.deepEqual(historical,[50,60,.5]);
   assert.deepEqual(errors, []);
   console.log(width + 'px navigation, branding, historical move/type data and map layout passed');
   await context.close();
  }
 } finally { await browser.close(); }
})().catch(e => {console.error(e);process.exitCode=1;});
