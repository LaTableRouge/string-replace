interface ReplaceItem {
    from: RegExp;
    to: string;
}
interface StringReplaceConfig {
    filePath: string | string[];
    replace: ReplaceItem[];
}
type HookName = 'closeBundle' | 'buildEnd' | 'buildStart';
interface VitePlugin {
    name: string;
    apply: 'build';
    [key: string]: any;
}

declare const stringReplaceOpenAndWrite: (filePath: string, replaceArray: ReplaceItem[], index?: number) => Promise<void>;
declare const stringReplace: (array: StringReplaceConfig[]) => Promise<void>;
declare const viteStringReplace: (array: StringReplaceConfig[], hook?: HookName) => VitePlugin;

export { stringReplace, stringReplaceOpenAndWrite, viteStringReplace };
