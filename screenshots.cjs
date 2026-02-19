const { chromium } = require('playwright');

(async () => {
  const pages = [
    { url: '/', name: 'home' },
    { url: '/chart/new', name: 'chart-new' },
    { url: '/auth/login', name: 'login' },
    { url: '/zodiac/aries', name: 'zodiac-aries' },
    { url: '/zodiac/scorpio', name: 'zodiac-scorpio' },
  ];

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }
  });

  for (const p of pages) {
    const page = await context.newPage();
    await page.goto(`https://astro-web-five.vercel.app${p.url}`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.screenshot({ path: `/tmp/${p.name}.png`, fullPage: true });
    console.log(`✅ ${p.name}.png`);
    await page.close();
  }

  await browser.close();
})();
