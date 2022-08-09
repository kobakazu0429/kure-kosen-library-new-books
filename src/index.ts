import groupBy from "just-group-by";

import { LogRotate } from "./logRotate";
import { Opac } from "./opac";

async function main() {
  const opac = new Opac();
  await opac.init();
  const books = await opac.getNewBooks();
  await opac.close();

  const monthlyBooks = groupBy(books, (book) => {
    // 2022.08.01 to 202208
    return book.date.split(".").slice(0, 2).join("");
  });

  console.log(monthlyBooks);

  await Promise.all(
    Object.keys(monthlyBooks).map(async (monthly) => {
      const filename = `${monthly}.json`;
      const old = await LogRotate.read(filename);
      old.push(...monthlyBooks[monthly]);
      const reversed = old.reverse();
      const merged = Array.from(new Set(old.map(({ url }) => url))).map(
        (url) => reversed.find((oldBook) => oldBook.url === url)!
      );
      await LogRotate.write(filename, merged);
    })
  );
}

main();
