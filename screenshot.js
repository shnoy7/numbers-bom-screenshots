const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  // Launch headless browser
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });

  // Generate ISO timestamp string for filenames (e.g., 2026-09-29T17-00-00)
  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
  const outputDir = path.join(__dirname, 'screenshots');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const targets = [
    {
      name: 'the-numbers',
      url: 'https://www.the-numbers.com/daily-box-office-chart'
    },
    {
      name: 'boxofficemojo',
      url: 'https://www.boxofficemojo.com'
    }
  ];

  for (const target of targets) {
    try {
      console.log(`Navigating to ${target.url}...`);
      await page.goto(target.url, { waitUntil: 'networkidle', timeout: 30000 });
      
      const filePath = path.join(outputDir, `\({target.name}_\){timestamp}.png`);
      await page.screenshot({ path: filePath, fullPage: true });
      console.log(`Saved screenshot: ${filePath}`);
    } catch (err) {
      console.error(`Failed to capture ${target.name}:`, err.message);
    }
  }

  await browser.close();
})();s
