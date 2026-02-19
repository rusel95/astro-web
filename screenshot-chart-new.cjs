const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('https://astro-web-five.vercel.app/chart/new', { waitUntil: 'networkidle', timeout: 30000 });
  await page.screenshot({ path: '/tmp/chart-new-updated.png', fullPage: true });
  console.log('✅ screenshot saved');
  await browser.close();
})();
