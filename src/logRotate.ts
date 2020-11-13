import { promises as fs } from "fs";
import * as path from "path";

export class LogRotate {
  static async read(Filename: string) {
    const file = await fs.readFile(path.join(__dirname, "../log", Filename), {
      encoding: "utf8",
    });
    return file;
  }

  static async write(Filename: string, data: string) {
    await fs.writeFile(path.join(__dirname, "../log", Filename), data);
  }
}
