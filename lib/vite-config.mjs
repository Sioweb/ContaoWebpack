import path from 'node:path';
import { existsSync } from 'node:fs';
import { contaoEntryPlugin, VIRTUAL_ENTRY } from './plugins/contao-entry.mjs';
import { brotliPlugin } from './plugins/brotli.mjs';

export const ENTRY_NAME = 'main';

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

export function createBuildConfig(target, { root, watch, mode }) {
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
        plugins: [contaoEntryPlugin(target.entries), brotliPlugin()],
        build: {
            outDir: target.outDir,
            emptyOutDir: true,
            sourcemap: true,
            minify: mode === 'production' ? 'esbuild' : false,
            target: 'es2015',
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
                    entryFileNames: 'src/js/[name].js',
                    chunkFileNames: 'src/js/[name].js',
                    assetFileNames,
                },
            },
        },
    };
}
