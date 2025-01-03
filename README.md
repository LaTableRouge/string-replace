# string-replace

string-replace is a package used to find a string match in a file and replace it

## Usage example

string-replace is available as an NPM package:

```bash
npm i @mlnop/string-replace --save-dev
```

### Usual

```js
const {stringReplaceOpenAndWrite, stringReplace} = require("@mlnop/string-replace");
const {resolve} = require("path");
// OR
import { stringReplaceOpenAndWrite, stringReplace } from "@mlnop/string-replace";
import { resolve } from "path";

// single file usage
stringReplaceOpenAndWrite(resolve(__dirname, "README.md"), [
  {
    from: /\bstring-replace/g,
    to: "ayaya",
  },
]);

// single or multiple file usage
stringReplace([
  {
    filePath: [resolve(__dirname, "README.md")],
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
    filePath: resolve(__dirname, "README.md"),
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

### Vite plugin

for the vite compatibilty, you can pass a hook as second parameter in the function ("closeBundle" is the default value)

```js
const {viteStringReplace} = require("@mlnop/string-replace");
const {resolve} = require("path");
// OR
import { viteStringReplace } from "@mlnop/string-replace";
import { resolve } from "path";

// vite plugin single or multiple file usage
viteStringReplace(
  [
    {
      filePath: [resolve(__dirname, "README.md")],
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
      filePath: resolve(__dirname, "README.md"),
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
  ],
  "closeBundle"
);
```

## Changelog

#### 2.0.0 &mdash; 03/01/2024

- TypeScript support
- Unit tests

#### 1.0.5 &mdash; 07/11/2022

- Added vite compatibility
- Published to NPM.

#### 1.0.0 &mdash; 07/11/2022

- First commit.
- Published to NPM.
