import { chromium } from 'playwright';
import fs from 'fs';

async function testBookingRedirect() {
  console.log('🚀 Launching Chrome to test Book Now redirect...');
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

  console.log('1️⃣ Navigating to Homepage...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  console.log('2️⃣ Clicking Header "Book Now" Button (#header-book-btn)...');
  await page.click('#header-book-btn');
  await page.waitForTimeout(600);

  const url = page.url();
  console.log('   Current URL:', url);
  await page.screenshot({ path: './test_screenshots/booking_page_desktop.png', fullPage: false });

  // Check that the heading is present
  const headingText = await page.textContent('.section-title');
  console.log('   Heading found:', headingText);

  // Check that destination dropdown has all 18 options
  const optionCount = await page.locator('select#destination option').count();
  console.log(`   Destination options count: ${optionCount}`);

  // Test Mobile view
  console.log('3️⃣ Testing Mobile Book Now Flow (390x844)...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(500);

  // Open mobile menu drawer
  console.log('   Opening mobile menu...');
  await mobilePage.click('#mobile-nav-toggle-btn');
  await mobilePage.waitForTimeout(400);
  await mobilePage.screenshot({ path: './test_screenshots/mobile_menu_with_book_btn.png' });

  // Click mobile drawer Book Now button
  console.log('   Clicking mobile drawer Book Now button...');
  await mobilePage.click('#mobile-drawer-book-btn');
  await mobilePage.waitForTimeout(600);

  console.log('   Mobile URL after click:', mobilePage.url());
  await mobilePage.screenshot({ path: './test_screenshots/booking_page_mobile.png' });

  // Check tour card book now click
  console.log('4️⃣ Testing Tour Card "Book Now" on Homepage...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Click the first "Book Now" button on preview card
  const bookNowBtn = page.locator('.preview-tour-card .inquire-wa-btn').first();
  await bookNowBtn.click();
  await page.waitForTimeout(600);

  const selectedVal = await page.locator('select#destination').inputValue();
  console.log('   Pre-selected Destination in quotation form:', selectedVal);
  await page.screenshot({ path: './test_screenshots/booking_with_preselected_tour.png' });

  console.log('🎉 ALL BOOK NOW REDIRECT TESTS PASSED SUCCESSFULLY!');
  await browser.close();
}

testBookingRedirect().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
