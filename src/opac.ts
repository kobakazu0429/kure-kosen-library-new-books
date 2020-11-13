import * as playwright from "playwright";

const BASE_URL = "https://libopac3-c.nagaokaut.ac.jp";

export interface Book {
  date: string;
  url: string;
  title: string;
}

export class Opac {
  public page: playwright.Page;
  public browser: playwright.Browser;

  public async init() {
    this.browser = await playwright["chromium"].launch({ headless: true });
    const context = await this.browser.newContext();
    this.page = await context.newPage();
    const url = `${BASE_URL}/opac/newbook/?kscode=036`;
    await this.page.goto(url);

    console.log("Opac.init: initialized");
  }

  public async close() {
    await this.browser.close();
    console.log("Opac.close: closed");
  }

  private async gotoNewBooksPage() {
    const url = `${BASE_URL}/opac/newbook/?lang=0&reqCode=list&dptidpl=1&jfcd=&sort=NDC&cls=all&clskey=20&name=%E3%81%99%E3%81%B9%E3%81%A6&tgt=new#`;
    await this.page.goto(url);

    console.log("Opac.gotoNewBooksPage: moved");
  }

  public async getNewBooks() {
    await this.gotoNewBooksPage();
    await this.page.waitForSelector("#example", { state: "attached" });

    const trs = await this.page.$$("tr");

    const summarys = trs.slice(1).map(async (tr) => {
      return tr.evaluate((node) => {
        // @ts-ignore
        const [date, body] = node.children;
        // @ts-ignore
        const [a] = body.children;

        const summary: Book = {
          date: date.textContent.trim(),
          url: a.attributes[0].textContent,
          title: a.innerHTML,
        };
        return summary;
      });
    });

    return (await Promise.all(summarys)).map(
      (v) =>
        ({
          ...v,
          url: `${BASE_URL}${v.url}`,
        } as Book)
    );
  }
}
