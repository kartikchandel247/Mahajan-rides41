import { chromium } from 'playwright';
import fs from 'fs';

async function testFilter() {
  console.log('🚀 Testing Destinations Filter Scroll & UI...');
  let browser;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
  } catch (e) {
    browser = await chromium.launch({ headless: true });
  }

  const context = await browser.newContext({
    viewport: { width: 1280, height: 850 }
  });
  const page = await context.newPage();
  fs.mkdirSync('./test_screenshots', { recursive: true });

  console.log('1️⃣ Navigating to Destinations Page...');
  await page.goto('http://localhost:5173/#/destinations', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: './test_screenshots/destinations_filter_top.png' });

  console.log('2️⃣ Scrolling down 500px to test if filter is NOT stuck over cards...');
  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(500);
  await page.screenshot({ path: './test_screenshots/destinations_scrolled_500px.png' });

  console.log('3️⃣ Scrolling down 1000px...');
  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(500);
  await page.screenshot({ path: './test_screenshots/destinations_scrolled_1000px.png' });

  // Mobile test
  console.log('4️⃣ Testing Mobile View (390x844)...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:5173/#/destinations', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({ path: './test_screenshots/destinations_mobile_filter.png' });

  console.log('   Scrolling mobile down 400px...');
  await mobilePage.evaluate(() => window.scrollBy(0, 400));
  await mobilePage.waitForTimeout(500);
  await mobilePage.screenshot({ path: './test_screenshots/destinations_mobile_scrolled.png' });

  console.log('🎉 Filter scrollability tests completed successfully!');
  await browser.close();
}

testFilter().catch(err => {
  console.error('❌ Error testing filter:', err);
  process.exit(1);
});
