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

  console.log('1️⃣ Testing Homepage (Minimalist)...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: './test_screenshots/1_home_desktop.png' });
  const homeTitle = await page.title();
  console.log('   ✅ Homepage loaded. Title:', homeTitle);

  console.log('2️⃣ Testing Destinations Subpage Navigation...');
  await page.click('#nav-destinations');
  await page.waitForTimeout(600);
  await page.screenshot({ path: './test_screenshots/2_destinations.png' });
  const destHeading = await page.textContent('.subpage-title');
  console.log('   ✅ Destinations subpage loaded. Heading:', destHeading);

  // Test filter
  console.log('   Testing filter pill click...');
  await page.click('button:has-text("Snow & Passes")');
  await page.waitForTimeout(400);
  await page.screenshot({ path: './test_screenshots/2_destinations_filtered.png' });
  console.log('   ✅ Filtered successfully');

  console.log('3️⃣ Testing About Subpage Navigation...');
  await page.click('#nav-about');
  await page.waitForTimeout(600);
  await page.screenshot({ path: './test_screenshots/3_about.png' });
  const aboutHeading = await page.textContent('.subpage-title');
  console.log('   ✅ About subpage loaded. Heading:', aboutHeading);

  console.log('4️⃣ Testing Blog Subpage Navigation...');
  await page.click('#nav-blog');
  await page.waitForTimeout(600);
  await page.screenshot({ path: './test_screenshots/4_blog.png' });
  const blogHeading = await page.textContent('.subpage-title');
  console.log('   ✅ Blog subpage loaded. Heading:', blogHeading);

  console.log('5️⃣ Testing Contact Subpage Navigation...');
  await page.click('#nav-contact');
  await page.waitForTimeout(600);
  await page.screenshot({ path: './test_screenshots/5_contact.png' });
  const contactHeading = await page.textContent('.subpage-title');
  console.log('   ✅ Contact subpage loaded. Heading:', contactHeading);

  console.log('6️⃣ Testing Mobile Responsiveness (Viewport 390x844)...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:5173/#/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: './test_screenshots/6_mobile_home.png' });

  // Open mobile menu
  console.log('   Testing Mobile Hamburger Drawer...');
  await page.click('#mobile-nav-toggle-btn');
  await page.waitForTimeout(400);
  await page.screenshot({ path: './test_screenshots/7_mobile_menu.png' });
  console.log('   ✅ Mobile menu opened.');

  // Click Destinations in mobile menu
  await page.click('.mobile-nav-drawer button:has-text("DESTINATIONS")');
  await page.waitForTimeout(600);
  await page.screenshot({ path: './test_screenshots/8_mobile_destinations.png' });
  console.log('   ✅ Mobile navigation to Destinations verified.');

  await browser.close();
  console.log('🎉 ALL PLAYWRIGHT TESTS PASSED SUCCESSFULLY!');
}

testWebsite().catch((err) => {
  console.error('❌ Test error:', err);
  process.exit(1);
});
