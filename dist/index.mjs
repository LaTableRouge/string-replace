// src/index.ts
import { promises as fs } from "fs";
import path from "path";
var stringReplaceOpenAndWrite = async (filePath, replaceArray, index = 0) => {
  if (replaceArray[index]) {
    const { from, to } = replaceArray[index];
    const data = await fs.readFile(filePath, "utf8");
    if (from.test(data)) {
      const result = data.replace(from, to);
      await fs.writeFile(filePath, result, "utf8");
      console.log(`Replaced "${from}" to "${to}" in file "${filePath}"`);
    } else {
      console.log(`No string found for the regex "${from}" in file "${filePath}"`);
    }
    await stringReplaceOpenAndWrite(filePath, replaceArray, index + 1);
  }
};
var stringReplaceIsFileOrFolder = async (elementPath, replace) => {
  const stat = await fs.lstat(elementPath);
  const isFile = stat.isFile();
  if (isFile) {
    await stringReplaceOpenAndWrite(elementPath, replace);
  } else {
    const files = await fs.readdir(elementPath);
    const getData = files.flatMap(async (file) => {
      const filePath = path.join(elementPath, file);
      const stat2 = await fs.stat(filePath);
      if (stat2.isDirectory()) {
        return void 0;
      }
      return filePath;
    });
    const datas = await Promise.all(getData);
    if (datas.length) {
      await Promise.all(
        datas.map(async (filePath) => {
          if (filePath) {
            await stringReplaceOpenAndWrite(filePath, replace);
          }
        })
      );
    }
  }
};
var stringReplace = async (array) => {
  if (array && array.length) {
    await Promise.all(
      array.map(async (element) => {
        const elementPath = element.filePath;
        const replace = element.replace;
        if (elementPath && replace.length) {
          if (Array.isArray(elementPath)) {
            const elementPaths = elementPath;
            if (elementPaths.length) {
              await Promise.all(
                elementPaths.map((path2) => stringReplaceIsFileOrFolder(path2, replace))
              );
            }
          } else {
            await stringReplaceIsFileOrFolder(elementPath, replace);
          }
        }
      })
    );
  }
};
var viteStringReplace = (array, hook = "closeBundle") => {
  return {
    name: "vite-plugin-string-replace",
    apply: "build",
    [hook]: () => {
      stringReplace(array);
    }
  };
};
if (typeof exports === "object" && typeof module !== "undefined") {
  module.exports = { stringReplaceOpenAndWrite, stringReplace, viteStringReplace };
}
export {
  stringReplace,
  stringReplaceOpenAndWrite,
  viteStringReplace
};
