#!/usr/bin/env node
import { rmSync } from 'node:fs';
import { build } from 'vite';
import { discoverTargets } from '../lib/discovery.mjs';
import { createBuildConfigs } from '../lib/vite-config.mjs';

const projectRoot = process.cwd();

async function main() {
    const watch = process.argv.includes('--watch');
    const mode = process.env.NODE_ENV || 'production';
    const targets = discoverTargets(projectRoot);

    if (targets.length === 0) {
        console.warn('Keine Ziele mit .webpack oder .vite gefunden.');
        return;
    }

    for (const target of targets) {
        rmSync(target.outDir, { recursive: true, force: true });
    }

    const configs = targets.flatMap((target) =>
        createBuildConfigs(target, { root: projectRoot, watch, mode })
    );

    await Promise.all(configs.map((config) => build(config)));
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
