export interface ReplaceItem {
    from: RegExp
    to: string
}

export interface StringReplaceConfig {
    filePath: string | string[]
    replace: ReplaceItem[]
}

export type HookName = 'closeBundle' | 'buildEnd' | 'buildStart'

export interface VitePlugin {
    name: string
    apply: 'build'
    [key: string]: any
} 