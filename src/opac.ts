import * as playwright from "playwright";
import promiseAllProperties from "promise-all-properties";

const BASE_URL = "https://libopac3-c.nagaokaut.ac.jp";

export interface Book {
  date: string;
  url: string;
  title: string;
  isbn: string;
}

export class Opac {
  public page!: playwright.Page;
  public browser!: playwright.Browser;

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

  public async getIsbn(url: string): Promise<string> {
    await this.page.goto(url);
    const isbn =
      (await this.page.$("td.BBISBN").then((el) => el?.textContent())) ?? "";
    return isbn;
  }

  public async getNewBooks(): Promise<Book[]> {
    await this.gotoNewBooksPage();
    await this.page.waitForSelector("#example", { state: "attached" });

    const trs = await this.page.$$("tr");
    if ((await trs[1].textContent()) === "No data available in table") {
      console.log("Opac.getNewBooks: No data");
      process.exit();
    }

    const newBookLinks = await Promise.all(
      trs.slice(1).map(async (tr) => {
        const a = await tr.$("a");
        const date = await tr.$("td");
        return promiseAllProperties({
          title: (await a?.textContent()) ?? "",
          date: (await date?.textContent())?.trim() ?? "",
          url: BASE_URL + (await a?.getAttribute("href")),
        });
      })
    );

    const newBooks: Book[] = [];

    for await (const newBook of newBookLinks) {
      const isbn = await this.getIsbn(newBook.url);
      newBooks.push({ ...newBook, isbn });
    }

    return newBooks;
  }

  private async gotoNewBooksPage() {
    const url = `${BASE_URL}/opac/newbook/?lang=0&reqCode=list&dptidpl=1&jfcd=&sort=NDC&cls=all&clskey=20&name=%E3%81%99%E3%81%B9%E3%81%A6&tgt=new#`;
    await this.page.goto(url);

    console.log("Opac.gotoNewBooksPage: moved");
  }
}
