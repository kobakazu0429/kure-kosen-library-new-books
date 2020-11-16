import { promises as fs } from "fs";
import * as path from "path";

export class LogRotate {
  static async read(filename: string): Promise<string> {
    const file = await fs
      .readFile(path.join(__dirname, "../log", filename), {
        encoding: "utf8",
      })
      .catch((e) => {
        return "[]";
      });
    return file;
  }

  static async write(filename: string, data: string) {
    await fs.writeFile(path.join(__dirname, "../log", filename), data);
  }
}
