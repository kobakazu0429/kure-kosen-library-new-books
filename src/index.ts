import "dotenv/config";
import { detectAddedObejct } from "./diff";
import { LogRotate } from "./logRotate";
import { Opac, Book } from "./opac";
import { feed } from "./twitter";

const today = new Date();
const year = String(today.getFullYear());
const month = String(today.getMonth() + 1).padStart(2, "0");
const filename = `${year}${month}.json`;
console.log(filename);

async function main() {
  const opac = new Opac();
  await opac.init();
  const books = await opac.getNewBooks();
  await opac.close();

  const thisMonth = await LogRotate.read(filename);
  const diff = detectAddedObejct<Book>(thisMonth, books, "url");

  const { added, same, updated } = diff;
  console.log(added);

  await LogRotate.write(filename, [...same, ...updated, ...added]);

  added.forEach(async (book: any) => {
    await feed(book);
  });
}

main();
