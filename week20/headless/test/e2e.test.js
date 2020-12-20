const puppeteer = require('puppeteer');
const assert = require('assert');

describe("puppteer", () => {
  it('images', async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:8080', { waitUntil: 'networkidle0'});
    const imgs = await page.$$('img');
    assert.strictEqual(imgs.length, 4);
   
    await browser.close();  
  });
});
