import puppeteer from 'puppeteer';
import path from 'path';

async function capture() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }).catch(() => puppeteer.launch({
    channel: 'msedge',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }));

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100 });

  // 1. Government Scale-Up Management Page
  await page.goto('http://localhost:5173/government/scale-up', { waitUntil: 'networkidle2' });
  await page.evaluate(() => localStorage.setItem('pragati_ai_role', 'government'));
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));

  const artifactDir = path.resolve('C:/Users/rohan/.gemini/antigravity-ide/brain/69d2ddaf-6c1b-4c32-b6c5-d185fec3462d');
  await page.screenshot({ path: path.join(artifactDir, 'scaleup_management_dashboard.png'), fullPage: true });
  console.log('Saved scaleup_management_dashboard.png');

  // 2. Open Creation Modal
  const createBtn = await page.$('#btn-open-create-scaleup');
  if (createBtn) {
    await createBtn.click();
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(artifactDir, 'scaleup_creation_modal.png') });
    console.log('Saved scaleup_creation_modal.png');
  }

  // 3. Startup Dashboard with Scale-Up Roadmap Card
  await page.goto('http://localhost:5173/startup/dashboard', { waitUntil: 'networkidle2' });
  await page.evaluate(() => localStorage.setItem('pragati_ai_role', 'startup'));
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'startup_scaleup_roadmap_dashboard.png'), fullPage: true });
  console.log('Saved startup_scaleup_roadmap_dashboard.png');

  await browser.close();
}

capture().catch(err => {
  console.error('Screenshot error:', err);
  process.exit(1);
});
