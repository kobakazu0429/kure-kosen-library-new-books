import { LogRotate } from "./logRotate";
import { Opac } from "./opac";

const year = "2022";
const month = "04";
const filename = `${year}${month}.json`;
console.log(filename);

async function main() {
  const opac = new Opac();
  await opac.init();

  const json = await LogRotate.read(filename);

  const addIsbnJson: any = [];

  for await (const data of json) {
    const isbn = await opac.getIsbn(data.url);
    addIsbnJson.push({ ...data, isbn });
  }

  console.log(addIsbnJson);

  await opac.close();
  await LogRotate.write(filename, addIsbnJson);
}

main();
