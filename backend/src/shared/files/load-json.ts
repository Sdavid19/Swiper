import * as fs from "fs";
import * as path from "path";

export async function loadJson<T>(relativePath: string): Promise<T> {
  const filePath = path.join(process.cwd(), relativePath);
  return await JSON.parse(fs.readFileSync(filePath, "utf-8"));
}