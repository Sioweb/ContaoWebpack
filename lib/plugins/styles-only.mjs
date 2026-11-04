export function stylesOnlyPlugin() {
    return {
        name: 'contao-styles-only',
        generateBundle(_options, bundle) {
            for (const fileName of Object.keys(bundle)) {
                if (/\.js(\.map)?$/.test(fileName)) {
                    delete bundle[fileName];
                }
            }
        },
    };
}
