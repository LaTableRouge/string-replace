const fs = require('fs').promises

const stringReplaceOpenAndWrite = async (filePath, replaceArray, index = 0) => {
  if (replaceArray[index]) {
    const { from, to } = replaceArray[index]
    const data = await fs.readFile(filePath, 'utf8')
    if (from.test(data)) {
      const result = data.replace(from, to)
      await fs.writeFile(filePath, result, 'utf8')
      console.log(`Replaced "${from}" to "${to}" in file "${filePath}"`)
    } else {
      // console.log(`No string found for the regex "${from}" in file "${filePath}"`)
    }

    stringReplaceOpenAndWrite(filePath, replaceArray, index + 1)
  }
}

const stringReplaceIsFileOrFolder = async (elementPath, replace) => {
  const stat = await fs.lstat(resolve(__dirname, elementPath))
  const isFile = stat.isFile()

  if (isFile) {
    stringReplaceOpenAndWrite(elementPath, replace)
  } else {
    // récupère les fichiers du path
    const files = await fs.readdir(resolve(__dirname, elementPath))

    // Créé un array avec la lsite des path des fichiers
    const getData = files.flatMap(async (file) => {
      const filePath = path.join(elementPath, file)
      const stat = await fs.stat(filePath)
      if (stat.isDirectory()) {
        return
      }
      return filePath
    })

    // Replace des strings dans l'array de fichiers
    const datas = await Promise.all(getData)
    if (datas.length) {
      datas.forEach(async (filePath) => {
        if (filePath) {
          stringReplaceOpenAndWrite(filePath, replace)
        }
      })
    }
  }
}

const stringReplace = (array) => {
  if (array && array.length) {
    array.forEach(async element => {
      const elementPath = element.filePath
      const replace = element.replace
      if (elementPath && replace.length) {
        if (Array.isArray(elementPath)) {
          const elementPaths = elementPath
          if (elementPaths.length) {
            elementPaths.forEach(elementPath => {
              stringReplaceIsFileOrFolder(elementPath, replace)
            })
          }
        } else {
          stringReplaceIsFileOrFolder(elementPath, replace)
        }
      }
    })
  }
}

module.exports = { stringReplaceOpenAndWrite, stringReplace }