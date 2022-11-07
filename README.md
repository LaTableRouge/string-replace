# string-replace

string-replace is a package used to find a string match in a file and replace it

## Usage example

string-replace is available as an NPM package:

```bash
npm i @mlnop/string-replace --save-dev
```

```js
const {stringReplaceOpenAndWrite, stringReplace} = require("@mlnop/string-replace");

// single file usage
stringReplaceOpenAndWrite("README.md", [
  {
    from: /\bstring-replace/g,
    to: "ayaya",
  },
]);

// single or multiple file usage
stringReplace([
  {
    filePath: ["README.md"],
    replace: [
      {
        from: /\bstring-replace/g,
        to: "ayaya",
      },
      {
        from: /\bUsage example/g,
        to: "hello there",
      },
    ],
  },
  {
    filePath: "README.md",
    replace: [
      {
        from: /\bstring-replace/g,
        to: "ayaya",
      },
      {
        from: /\bUsage example/g,
        to: "hello there",
      },
    ],
  },
]);
```

## Changelog

#### 1.0.0 &mdash; 07/11/2022

- First commit.
- Published to NPM.
