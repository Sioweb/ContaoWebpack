import path from 'node:path';
import { existsSync } from 'node:fs';
import { contaoEntryPlugin, VIRTUAL_ENTRY } from './plugins/contao-entry.mjs';
import { brotliPlugin } from './plugins/brotli.mjs';
import { stylesOnlyPlugin } from './plugins/styles-only.mjs';

export const ENTRY_NAME = 'main';

const SCRIPT_PATTERN = /\.js$/;
const STYLE_PATTERN = /\.(s?css)$/;

export function assetFileNames(info) {
    const name = info.names?.[0] ?? info.name ?? '';
    if (name.endsWith('.css')) {
        return 'src/css/styles.min.css';
    }
    if (/\.(png|jpe?g|gif|svg)$/i.test(name)) {
        return 'src/img/[hash][extname]';
    }
    if (/\.(eot|ttf|woff2?)$/i.test(name)) {
        return 'src/fonts/[hash][extname]';
    }
    return 'assets/[name]-[hash][extname]';
}

export function scssLoadPaths(target) {
    return [path.join(target.root, 'scss')].filter((dir) => existsSync(dir));
}

export function splitEntries(entries) {
    return {
        scripts: entries.filter((file) => SCRIPT_PATTERN.test(file)),
        styles: entries.filter((file) => STYLE_PATTERN.test(file)),
    };
}

function commonConfig(target, { root, watch, mode }, plugins, output) {
    return {
        configFile: false,
        root,
        publicDir: false,
        base: './',
        css: {
            postcss: {},
            preprocessorOptions: {
                scss: {
                    loadPaths: scssLoadPaths(target),
                },
            },
        },
        mode,
        plugins,
        build: {
            outDir: target.outDir,
            emptyOutDir: false,
            sourcemap: true,
            minify: mode === 'production' ? 'esbuild' : false,
            target: 'es2022',
            assetsInlineLimit: 0,
            reportCompressedSize: false,
            ...(watch
                ? {
                      watch: {
                          aggregateTimeout: 300,
                          chokidar: { usePolling: true, interval: 1000 },
                      },
                  }
                : {}),
            rollupOptions: {
                input: { [ENTRY_NAME]: VIRTUAL_ENTRY },
                output: {
                    ...output,
                    entryFileNames: 'src/js/[name].js',
                    chunkFileNames: 'src/js/[name].js',
                    assetFileNames,
                },
            },
        },
    };
}

function createScriptConfig(target, options, scripts) {
    return commonConfig(
        target,
        options,
        [contaoEntryPlugin(scripts, { withGlobal: true }), brotliPlugin()],
        { format: 'iife', inlineDynamicImports: true }
    );
}

function createStyleConfig(target, options, styles) {
    return commonConfig(
        target,
        options,
        [contaoEntryPlugin(styles), stylesOnlyPlugin(), brotliPlugin()],
        {}
    );
}

export function createBuildConfigs(target, options) {
    const { scripts, styles } = splitEntries(target.entries);
    const configs = [];

    if (scripts.length > 0) {
        configs.push(createScriptConfig(target, options, scripts));
    }

    if (styles.length > 0) {
        configs.push(createStyleConfig(target, options, styles));
    }

    return configs;
}
