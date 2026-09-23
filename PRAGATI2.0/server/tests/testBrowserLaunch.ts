import puppeteer from 'puppeteer';

async function test() {
  console.log('Testing browser launch with puppeteer...');
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    console.log('Default Puppeteer Chrome launched successfully!');
  } catch (err: any) {
    console.log('Default failed, trying msedge channel...', err.message);
    browser = await puppeteer.launch({
      channel: 'msedge',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    console.log('Microsoft Edge launched successfully!');
  }

  const page = await browser.newPage();
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  const title = await page.title();
  console.log('Page title at http://localhost:5173:', title);
  await browser.close();
}

test().catch(console.error);
