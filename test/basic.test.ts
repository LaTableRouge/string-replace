import { promises as fs } from 'fs'
import path from 'path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { stringReplace, stringReplaceOpenAndWrite } from '../src'
import type { StringReplaceConfig } from '../src/types'

// Create test directory and files
const TEST_DIR = path.join(__dirname, 'test-files')
const TEST_FILE = path.join(TEST_DIR, 'test.txt')
const TEST_FILE2 = path.join(TEST_DIR, 'test2.txt')

describe('String Replace Functions', () => {
    beforeEach(async () => {
        // Create test directory and files before each test
        await fs.mkdir(TEST_DIR, { recursive: true })
        await fs.writeFile(TEST_FILE, 'Hello World! This is a test file.')
        await fs.writeFile(TEST_FILE2, 'Another test file with some content.')
    })

    afterEach(async () => {
        // Cleanup test directory after each test
        await fs.rm(TEST_DIR, { recursive: true, force: true })
    })

    describe('stringReplaceOpenAndWrite', () => {
        it('should replace a single string match', async () => {
            const replaceArray = [{
                from: /World/,
                to: 'TypeScript'
            }]

            await stringReplaceOpenAndWrite(TEST_FILE, replaceArray)
            const content = await fs.readFile(TEST_FILE, 'utf8')
            expect(content).toBe('Hello TypeScript! This is a test file.')
        })

        it('should handle multiple replacements', async () => {
            const replaceArray = [
                { from: /Hello/, to: 'Hi' },
                { from: /World/, to: 'TypeScript' }
            ]

            await stringReplaceOpenAndWrite(TEST_FILE, replaceArray)
            const content = await fs.readFile(TEST_FILE, 'utf8')
            expect(content).toBe('Hi TypeScript! This is a test file.')
        })

        it('should handle regex patterns', async () => {
            const replaceArray = [{
                from: /test\sfile/,
                to: 'documentation'
            }]

            await stringReplaceOpenAndWrite(TEST_FILE, replaceArray)
            const content = await fs.readFile(TEST_FILE, 'utf8')
            expect(content).toBe('Hello World! This is a documentation.')
        })

        it('should not modify file if pattern is not found', async () => {
            const replaceArray = [{
                from: /nonexistent/,
                to: 'replacement'
            }]

            await stringReplaceOpenAndWrite(TEST_FILE, replaceArray)
            const content = await fs.readFile(TEST_FILE, 'utf8')
            expect(content).toBe('Hello World! This is a test file.')
        })
    })

    describe('stringReplace', () => {
        it('should handle single file replacement', async () => {
            const config: StringReplaceConfig[] = [{
                filePath: TEST_FILE,
                replace: [
                    { from: /World/, to: 'TypeScript' }
                ]
            }]

            await stringReplace(config)
            const content = await fs.readFile(TEST_FILE, 'utf8')
            expect(content).toBe('Hello TypeScript! This is a test file.')
        })

        it('should handle multiple files', async () => {
            const config: StringReplaceConfig[] = [{
                filePath: [TEST_FILE, TEST_FILE2],
                replace: [
                    { from: /test/, to: 'sample' }
                ]
            }]

            await stringReplace(config)
            const content1 = await fs.readFile(TEST_FILE, 'utf8')
            const content2 = await fs.readFile(TEST_FILE2, 'utf8')
            expect(content1).toBe('Hello World! This is a sample file.')
            expect(content2).toBe('Another sample file with some content.')
        })

        it('should handle multiple configurations', async () => {
            const config: StringReplaceConfig[] = [
                {
                    filePath: TEST_FILE,
                    replace: [{ from: /World/, to: 'TypeScript' }]
                },
                {
                    filePath: TEST_FILE2,
                    replace: [{ from: /Another/, to: 'Second' }]
                }
            ]

            await stringReplace(config)
            const content1 = await fs.readFile(TEST_FILE, 'utf8')
            const content2 = await fs.readFile(TEST_FILE2, 'utf8')
            expect(content1).toBe('Hello TypeScript! This is a test file.')
            expect(content2).toBe('Second test file with some content.')
        })

        it('should handle empty config array', async () => {
            const config: StringReplaceConfig[] = []
            await expect(stringReplace(config)).resolves.not.toThrow()
        })

        it('should handle non-existent files gracefully', async () => {
            const config: StringReplaceConfig[] = [{
                filePath: 'nonexistent.txt',
                replace: [
                    { from: /test/, to: 'sample' }
                ]
            }]

            await expect(stringReplace(config)).rejects.toThrow()
        })
    })
})
