import fs from "fs";
import path from "path";

export function getTestPath(fPath: string) {
  return path.join(process.cwd(), "__testfixtures__", fPath);
}

export const getCodeFromFile = (fPath: string) => fs.readFileSync(getTestPath(fPath), "utf8");
const getTestFiles = (fPath: string) => ({
  in: getCodeFromFile(fPath + ".tsx"),
  out: getCodeFromFile(fPath + ".svelte"),
});