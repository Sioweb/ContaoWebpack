import { fileURLToPath } from 'node:url';

export const VIRTUAL_ENTRY = 'virtual:contao-entry';

const CONTAO_PLUGIN = fileURLToPath(new URL('../../src/contao/index.js', import.meta.url));

export function contaoEntryPlugin(entries) {
    const resolvedId = `\0${VIRTUAL_ENTRY}`;

    return {
        name: 'contao-entry',
        resolveId(id) {
            return id === VIRTUAL_ENTRY ? resolvedId : null;
        },
        load(id) {
            if (id !== resolvedId) {
                return null;
            }
            return [
                `import * as ContaoWebpack from ${JSON.stringify(CONTAO_PLUGIN)};`,
                'globalThis.ContaoWebpack = ContaoWebpack;',
                ...entries.map((file) => `import ${JSON.stringify(file)};`),
            ].join('\n');
        },
    };
}
