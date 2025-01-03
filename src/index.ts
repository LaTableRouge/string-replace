import { promises as fs } from 'fs'
import path from 'path'

import { HookName, ReplaceItem, StringReplaceConfig, VitePlugin } from './types'

const stringReplaceOpenAndWrite = async (
    filePath: string,
    replaceArray: ReplaceItem[],
    index: number = 0
): Promise<void> => {
    if (replaceArray[index]) {
        const { from, to } = replaceArray[index]
        const data = await fs.readFile(filePath, 'utf8')
        if (from.test(data)) {
            const result = data.replace(from, to)
            await fs.writeFile(filePath, result, 'utf8')
            console.log(`Replaced "${from}" to "${to}" in file "${filePath}"`)
        } else {
            console.log(`No string found for the regex "${from}" in file "${filePath}"`)
        }

        await stringReplaceOpenAndWrite(filePath, replaceArray, index + 1)
    }
}

const stringReplaceIsFileOrFolder = async (
    elementPath: string,
    replace: ReplaceItem[]
): Promise<void> => {
    const stat = await fs.lstat(elementPath)
    const isFile = stat.isFile()

    if (isFile) {
        await stringReplaceOpenAndWrite(elementPath, replace)
    } else {
        // Get files from path
        const files = await fs.readdir(elementPath)

        // Create an array with file paths
        const getData = files.flatMap(async (file) => {
            const filePath = path.join(elementPath, file)
            const stat = await fs.stat(filePath)
            if (stat.isDirectory()) {
                return undefined
            }
            return filePath
        })

        // Replace strings in the files array
        const datas = await Promise.all(getData)
        if (datas.length) {
            await Promise.all(
                datas.map(async (filePath) => {
                    if (filePath) {
                        await stringReplaceOpenAndWrite(filePath, replace)
                    }
                })
            )
        }
    }
}

const stringReplace = async (array: StringReplaceConfig[]): Promise<void> => {
    if (array && array.length) {
        await Promise.all(
            array.map(async (element) => {
                const elementPath = element.filePath
                const replace = element.replace
                if (elementPath && replace.length) {
                    if (Array.isArray(elementPath)) {
                        const elementPaths = elementPath
                        if (elementPaths.length) {
                            await Promise.all(
                                elementPaths.map((path) => stringReplaceIsFileOrFolder(path, replace))
                            )
                        }
                    } else {
                        await stringReplaceIsFileOrFolder(elementPath, replace)
                    }
                }
            })
        )
    }
}

const viteStringReplace = (
    array: StringReplaceConfig[],
    hook: HookName = 'closeBundle'
): VitePlugin => {
    return {
        name: 'vite-plugin-string-replace',
        apply: 'build',
        [hook]: () => {
            stringReplace(array)
        }
    }
}

export { stringReplaceOpenAndWrite, stringReplace, viteStringReplace } 
if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = { stringReplaceOpenAndWrite, stringReplace, viteStringReplace }
}