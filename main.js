import { crawlPage, printReport } from "./crawl.js";

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error("Arugments less than 1");
    return;
  }
  if (args.length > 1) {
    console.error("arguments more than 1");
    return;
  }
  console.log(`Crawling baseURL: ${args[0]}`);
  const c = await crawlPage(args[0]);
  printReport(c);
}

main();
