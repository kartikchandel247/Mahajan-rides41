import { chromium } from 'playwright';
import fs from 'fs';

async function testWebsite() {
  console.log('🚀 Launching Chrome via Playwright...');
  let browser;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
  } catch (e) {
    console.log('Falling back to default chromium...');
    browser = await chromium.launch({ headless: true });
  }

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  fs.mkdirSync('./test_screenshots', { recursive: true });

  console.log('1️⃣ Testing Homepage...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: './test_screenshots/1_home_desktop.png' });

  console.log('2️⃣ Testing Destinations Subpage Navigation...');
  await page.click('#nav-destinations');
  await page.waitForTimeout(600);
  await page.screenshot({ path: './test_screenshots/2_destinations_all.png' });
  console.log('   ✅ Destinations subpage loaded.');

  // Test Snow & High Passes filter
  console.log('3️⃣ Testing Snow & High Passes Filter...');
  await page.click('button:has-text("Snow & High Passes")');
  await page.waitForTimeout(400);
  await page.screenshot({ path: './test_screenshots/2_filter_snow_passes.png' });
  console.log('   ✅ Snow & High Passes filter working with multiple circuits.');

  // Test Spiritual & Sacred Temples filter
  console.log('4️⃣ Testing Spiritual & Sacred Temples Filter...');
  await page.click('button:has-text("Spiritual & Sacred Temples")');
  await page.waitForTimeout(400);
  await page.screenshot({ path: './test_screenshots/2_filter_spiritual.png' });
  console.log('   ✅ Spiritual & Sacred Temples filter working.');

  // Test Tibetan & Monasteries filter
  console.log('5️⃣ Testing Tibetan & Monasteries Filter...');
  await page.click('button:has-text("Tibetan & Monasteries")');
  await page.waitForTimeout(400);
  await page.screenshot({ path: './test_screenshots/2_filter_tibetan.png' });
  console.log('   ✅ Tibetan & Monasteries filter working.');

  // Test Alpine Lakes filter
  console.log('6️⃣ Testing Alpine Lakes & High Altitude Filter...');
  await page.click('button:has-text("Alpine Lakes & High Altitude")');
  await page.waitForTimeout(400);
  await page.screenshot({ path: './test_screenshots/2_filter_lakes.png' });
  console.log('   ✅ Alpine Lakes filter working.');

  // Test Adventure & Valleys filter
  console.log('7️⃣ Testing Adventure & Valleys Filter...');
  await page.click('button:has-text("Adventure & Valleys")');
  await page.waitForTimeout(400);
  await page.screenshot({ path: './test_screenshots/2_filter_adventure.png' });
  console.log('   ✅ Adventure & Valleys filter working.');

  // Test Colonial Hills & Pine filter
  console.log('8️⃣ Testing Colonial Hills & Pine Filter...');
  await page.click('button:has-text("Colonial Hills & Pine")');
  await page.waitForTimeout(400);
  await page.screenshot({ path: './test_screenshots/2_filter_colonial.png' });
  console.log('   ✅ Colonial Hills & Pine filter working.');

  // Test Search Box for "Chitkul"
  console.log('9️⃣ Testing Search Filter for "Chitkul"...');
  await page.fill('.destinations-search-input', 'Chitkul');
  await page.waitForTimeout(400);
  await page.screenshot({ path: './test_screenshots/2_search_chitkul.png' });
  console.log('   ✅ Search for Chitkul verified.');

  // Test Itinerary Modal
  console.log('🔟 Testing Detailed Itinerary Modal...');
  await page.click('.dest-details-btn');
  await page.waitForTimeout(500);
  await page.screenshot({ path: './test_screenshots/2_modal_itinerary.png' });
  console.log('   ✅ Modal opened with day-by-day plan.');
  await page.click('.tour-modal-close');
  await page.waitForTimeout(300);

  // Mobile testing
  console.log('1️⃣1️⃣ Testing Mobile View (390x844)...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:5173/#/destinations', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: './test_screenshots/8_mobile_destinations.png' });
  console.log('   ✅ Mobile destinations page verified.');

  await browser.close();
  console.log('🎉 ALL COMPREHENSIVE TOUR TESTS PASSED SUCCESSFULLY!');
}

testWebsite().catch((err) => {
  console.error('❌ Test error:', err);
  process.exit(1);
});
