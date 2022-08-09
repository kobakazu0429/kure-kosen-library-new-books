import "dotenv/config";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { chromium } from "playwright";
import { postWithMedia } from "./twitter";
import { LogRotate } from "./logRotate";

interface ScreenshotOption {
  isbns: string[];
  filePath: string;
  year: number;
  month: number;
}

const saveScreenshot = async ({
  isbns,
  filePath,
  year,
  month,
}: ScreenshotOption) => {
  try {
    if (!filePath.endsWith(".png")) {
      throw new Error("file extention must be PNG");
    }

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 2560, height: 3000 },
    });
    const page = await context.newPage();

    const url = `file://${path.join(
      __dirname,
      "..",
      "index.html"
    )}?isbns=${isbns.join(",")}&year=${year}&month=${month}`;
    console.log(url);

    await page.goto(url);

    await page.waitForSelector(".book");

    const body = await page.$("body");
    await body?.screenshot({ path: filePath, type: "png" });

    await browser.close();
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const getISBNs = async (year: number, month: number) => {
  const filename = `${year}${String(month).padStart(2, "0")}.json`;
  return LogRotate.read(filename);
};

const main = async () => {
  // const [, , _year, _month] = process.env.YEAR;
  // const [year, month] = [_year, _month].map((v) => parseInt(v, 10));
  // console.log(year, month);
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  const isbns = (await getISBNs(year, month))
    .filter(({ isbn }) => !!isbn)
    .map(({ isbn }) => isbn) as string[];
  const filePath = path.resolve(path.join(__dirname, "..", "screenshot.png"));

  const result = await saveScreenshot({ isbns, filePath, year, month });
  if (!result) {
    process.exit();
  }

  const body = `${year}年${month}月の新着本はこちらです！`;
  const media = await readFile(filePath);
  await postWithMedia(body, media);
};

main();
