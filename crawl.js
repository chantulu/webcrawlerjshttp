import { JSDOM } from "jsdom";

export function normalizeURL(url) {
  let ret = url.toLowerCase();
  if (ret.indexOf("http") == 0) {
    ret = ret.replace("http://", "");
    ret = ret.replace("https://", "");
  }
  if (ret.length > 0 && ret[ret.length - 1] == "/") {
    ret = ret.substring(0, ret.length - 1);
  }
  return ret.split("#")[0];
}

export function getURLsFromHTML(htmlBody, baseURL) {
  const dom = new JSDOM(htmlBody, { url: baseURL });
  const links = [...dom.window.document.querySelectorAll("a")]
    .filter((a) => !a.href.startsWith("mailto:") && !a.href.startsWith("tel:"))
    .map((a) => {
      if (a.href.startsWith("http")) {
        return a.href;
      }
      return new URL(a.href, baseURL).href;
    });
  return links;
}

export async function crawlPage(baseURL, currentURL = baseURL, pages = {}) {
  const b = new URL(baseURL);
  const c = new URL(currentURL, baseURL);
  const nc = normalizeURL(c.toString());

  if (b.host !== c.host) {
    return pages;
  }

  if (pages.hasOwnProperty(nc)) {
    pages[nc] += 1;
  } else {
    pages[nc] = 1;
  }

  console.log(`Crawling ${c.href}`); // Log each URL before processing

  try {
    const html = await getHtml(c.href);
    const links = getURLsFromHTML(html, baseURL);
    for (let l of links.filter(
      (link) =>
        normalizeURL(link) !== nc && !pages.hasOwnProperty(normalizeURL(link))
    )) {
      // console.log(`Crawling ${l}`); // Add this line to log each URL before crawling it
      pages = await crawlPage(baseURL, l, pages);
    }
  } catch (error) {
    console.error(`Failed to crawl ${nc}: `, error);
  }
  return pages;
}

async function getHtml(url) {
  const response = await fetch(url);
  if (response.status > 399) {
    throw new Error("Network Error");
  }
  if (
    !response.headers.get("content-type") ||
    !response.headers.get("content-type").toLowerCase().includes("text/html")
  ) {
    throw new Error("Non html content");
  }
  return await response.text();
}

export function printReport(pages = {}) {
  console.log("------------");
  console.log("Begin Report");
  console.log("------------");
  Object.keys(pages)
    .sort((a, b) => pages[a] - pages[b])
    .reverse()
    .forEach((page) => {
      console.log(`Found ${pages[page]} internal links to ${page}`);
    });
}
