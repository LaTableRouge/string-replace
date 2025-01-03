"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  stringReplace: () => stringReplace,
  stringReplaceOpenAndWrite: () => stringReplaceOpenAndWrite,
  viteStringReplace: () => viteStringReplace
});
module.exports = __toCommonJS(index_exports);
var import_fs = require("fs");
var import_path = __toESM(require("path"));
var stringReplaceOpenAndWrite = async (filePath, replaceArray, index = 0) => {
  if (replaceArray[index]) {
    const { from, to } = replaceArray[index];
    const data = await import_fs.promises.readFile(filePath, "utf8");
    if (from.test(data)) {
      const result = data.replace(from, to);
      await import_fs.promises.writeFile(filePath, result, "utf8");
      console.log(`Replaced "${from}" to "${to}" in file "${filePath}"`);
    } else {
      console.log(`No string found for the regex "${from}" in file "${filePath}"`);
    }
    await stringReplaceOpenAndWrite(filePath, replaceArray, index + 1);
  }
};
var stringReplaceIsFileOrFolder = async (elementPath, replace) => {
  const stat = await import_fs.promises.lstat(elementPath);
  const isFile = stat.isFile();
  if (isFile) {
    await stringReplaceOpenAndWrite(elementPath, replace);
  } else {
    const files = await import_fs.promises.readdir(elementPath);
    const getData = files.flatMap(async (file) => {
      const filePath = import_path.default.join(elementPath, file);
      const stat2 = await import_fs.promises.stat(filePath);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  stringReplace,
  stringReplaceOpenAndWrite,
  viteStringReplace
});
