#!/usr/bin/env node
import { build } from 'vite';
import { discoverTargets } from '../lib/discovery.mjs';
import { createBuildConfig } from '../lib/vite-config.mjs';

const projectRoot = process.cwd();

async function main() {
    const watch = process.argv.includes('--watch');
    const mode = process.env.NODE_ENV || 'production';
    const targets = discoverTargets(projectRoot);

    if (targets.length === 0) {
        console.warn('Keine Ziele mit .webpack oder .vite gefunden.');
        return;
    }

    await Promise.all(
        targets.map((target) => build(createBuildConfig(target, { root: projectRoot, watch, mode })))
    );
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
