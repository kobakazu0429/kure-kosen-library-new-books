import { detectAddedObejct } from "./diff";
import { LogRotate } from "./logRotate";
import { Opac, Book } from "./opac";

async function main() {
  const opac = new Opac();
  await opac.init();
  const books = await opac.getNewBooks();
  // console.log(JSON.stringify(books));
  await LogRotate.write("202012.json", JSON.stringify(books, null, 2));
  await opac.close();

  const objA = JSON.parse(await LogRotate.read("202011.json"));
  const objB = JSON.parse(await LogRotate.read("202012.json"));

  const diff = detectAddedObejct<Book>(objA, objB);
  console.log(diff.added);
}

main();
