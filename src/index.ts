import { Opac } from "./opac";

async function main() {
  const opac = new Opac();
  await opac.init();
  const books = await opac.getNewBooks();

  console.log(books);

  await opac.close();
}

main();
