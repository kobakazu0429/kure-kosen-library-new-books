import { promises as fs } from "fs";
import * as path from "path";

export interface Log {
  date: string;
  url: string;
  title: string;
  isbn?: string;
}

export class LogRotate {
  static async read(filename: string): Promise<Log[]> {
    const file = await fs
      .readFile(path.join(__dirname, "../log", filename), {
        encoding: "utf8",
      })
      .catch((_e) => {
        return "[]";
      });
    return JSON.parse(file);
  }

  static async write(filename: string, data: Log[]): Promise<void> {
    const d = JSON.stringify(
      data.sort((a, b) => {
        if (a.date < b.date) return -1;
        if (a.date > b.date) return 1;
        return 0;
      }),
      null,
      2
    );
    await fs.writeFile(path.join(__dirname, "../log", filename), d);
  }
}
