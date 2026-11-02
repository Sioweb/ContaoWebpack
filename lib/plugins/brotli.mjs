import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { brotliCompressSync } from 'node:zlib';

export const BROTLI_PATTERN = /\.(js|css|html|svg)$/;
export const BROTLI_THRESHOLD = 10240;
export const BROTLI_MIN_RATIO = 0.8;

export function brotliPlugin() {
    return {
        name: 'contao-brotli',
        writeBundle(outputOptions, bundle) {
            for (const fileName of Object.keys(bundle)) {
                if (!BROTLI_PATTERN.test(fileName)) {
                    continue;
                }
                const filePath = path.join(outputOptions.dir, fileName);
                const source = readFileSync(filePath);
                if (source.length < BROTLI_THRESHOLD) {
                    continue;
                }
                const compressed = brotliCompressSync(source);
                if (compressed.length / source.length > BROTLI_MIN_RATIO) {
                    continue;
                }
                writeFileSync(`${filePath}.br`, compressed);
            }
        },
    };
}
