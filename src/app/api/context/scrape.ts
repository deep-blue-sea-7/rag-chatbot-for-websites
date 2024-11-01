import { load } from 'cheerio';
const puppeteer = require('puppeteer'); // To load dynamic pages

interface Entry {
  link: string;
  text: string;
}

async function getWebsiteSitemap(url: string, pages: number): Promise<string[]> {
  const response = await fetch(url);
  const $ = load(await response.text());

  const sitemapLinks: string[] = $('urlset > url > loc')
    .map((index, element) => $(element).text().trim())
    .get();

  return sitemapLinks.slice(0, pages);
}

async function getEntriesFromLinks(links: string[]): Promise<Entry[]> {
  let allEntries: Entry[] = [];

  // Use of an agent allows us to open the browser in the background.
  const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36';

  for (const link of links) {
    console.log('Scraping Page: ', link);
    try {
      const browser = await puppeteer.launch({ headless: 'new' });
      const page = await browser.newPage();
      page.setUserAgent(ua);
    
      const res = await page.goto(link)
      const text = await res.text();

        // Wait for the content to be dynamically loaded
      await page.waitForSelector('body');

      // Fetch the page content
      const response = await page.content();

      // Load the page content into Cheerio
      const $ = load(response);

      const contentArray: string[] = [];
      $('p').each((index, element) => {
        contentArray.push($(element).text().trim());
        // console.log("Paragraph: ", $(element).text().trim());
      });

      await browser.close();

      const content = contentArray
        .join('\n')
        .split('\n')
        .filter(line => line.length > 0)
        .map(line => ({ link: link, text: line }));

      allEntries = allEntries.concat(content);
    } catch (error) {
      console.error(`Error processing ${link}:`, error);
    }
  }

  return allEntries;
}

export async function getDomObjects(url: string, pages: number, isDirect: boolean): Promise<Entry[]> {
  let sitemapUrls: string[] = [];
  
  // Check whether the user submitted a sitemap or a simple link
  if (!isDirect) {
    sitemapUrls = await getWebsiteSitemap(url, pages);
  } else {
    sitemapUrls[0] = url;
  }
  const allEntries = await getEntriesFromLinks(sitemapUrls);
  
  return allEntries;
}
