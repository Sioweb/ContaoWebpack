import { existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

export const MARKERS = ['.webpack', '.vite'];
export const BUNDLE_SUBDIRS = ['frontend', 'backend'];
export const OUT_DIR_NAME = 'webpack';

export function isDirectory(dir) {
    return existsSync(dir) && statSync(dir).isDirectory();
}

export function listFiles(dir) {
    if (!existsSync(dir)) {
        return [];
    }
    return readdirSync(dir, { withFileTypes: true })
        .filter((entry) => entry.name !== 'node_modules' && entry.name !== '.git')
        .flatMap((entry) => {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                return listFiles(fullPath);
            }
            return entry.isFile() ? [fullPath] : [];
        });
}

export function hasMarker(dir) {
    return MARKERS.some((marker) => existsSync(path.join(dir, marker)));
}

export function findThemeDirs(themesDir) {
    const dirs = new Set(
        listFiles(themesDir)
            .filter((file) => MARKERS.includes(path.basename(file)))
            .map((file) => path.dirname(file))
    );
    return [...dirs].sort();
}

export function findBundlePublicDirs(vendorDir) {
    if (!isDirectory(vendorDir)) {
        return [];
    }
    return readdirSync(vendorDir)
        .map((vendor) => path.join(vendorDir, vendor))
        .filter((vendorPath) => isDirectory(vendorPath))
        .flatMap((vendorPath) =>
            readdirSync(vendorPath)
                .map((pkg) => path.join(vendorPath, pkg))
                .filter((pkgPath) => isDirectory(pkgPath))
        )
        .map((pkgPath) => path.join(pkgPath, 'public'))
        .filter((publicDir) => isDirectory(publicDir) && hasMarker(publicDir))
        .sort();
}

export function existing(file) {
    return existsSync(file) ? [file] : [];
}

export function assetsOf(privateFiles, fileName) {
    const suffix = path.sep + path.join('src', 'Resources', 'assets', fileName);
    return privateFiles.filter((file) => file.endsWith(suffix));
}

export function themeEntries(themeRoot, privateFiles) {
    return [
        ...assetsOf(privateFiles, 'init.js'),
        ...existing(path.join(themeRoot, 'js', 'base.js')),
        ...assetsOf(privateFiles, 'frontend.js'),
        ...assetsOf(privateFiles, 'init.scss'),
        ...existing(path.join(themeRoot, 'scss', 'base.scss')),
        ...assetsOf(privateFiles, 'frontend.scss'),
    ];
}

export function bundleEntries(bundleRoot) {
    return [
        ...existing(path.join(bundleRoot, 'js', 'base.js')),
        ...existing(path.join(bundleRoot, 'scss', 'base.scss')),
    ];
}

export function createTarget(rootDir, root, entries) {
    return {
        label: path.relative(rootDir, root),
        root,
        outDir: path.join(root, OUT_DIR_NAME),
        entries,
    };
}

export function discoverTargets(rootDir) {
    const privateFiles = listFiles(path.join(rootDir, 'privateSrc')).sort();
    const themesDir = path.join(rootDir, 'files', 'themes');
    const vendorDir = path.join(rootDir, 'vendor');

    const themeTargets = findThemeDirs(themesDir).map((themeDir) =>
        createTarget(rootDir, themeDir, themeEntries(themeDir, privateFiles))
    );

    const bundleTargets = findBundlePublicDirs(vendorDir).flatMap((publicDir) =>
        BUNDLE_SUBDIRS.map((subdir) => {
            const bundleRoot = path.join(publicDir, subdir);
            return createTarget(rootDir, bundleRoot, bundleEntries(bundleRoot));
        })
    );

    return [...themeTargets, ...bundleTargets]
        .filter((target) => target.entries.length > 0)
        .sort((a, b) => a.label.localeCompare(b.label));
}
