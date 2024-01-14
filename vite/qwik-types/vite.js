"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.qwikTypes = void 0;
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const generator_1 = require("./generator");
function qwikTypes() {
    const srcFolder = (0, node_path_1.join)(process.cwd(), 'src');
    const routesFolder = (0, node_path_1.join)(srcFolder, 'routes');
    return {
        name: 'Qwik Type Generator',
        async buildStart() {
            await regenerateRoutes(srcFolder, routesFolder);
        },
    };
}
exports.qwikTypes = qwikTypes;
async function regenerateRoutes(srcDir, routesDir) {
    assertDirectoryExists(srcDir);
    assertDirectoryExists(routesDir);
    const routes = [];
    await collectRoutes(routesDir, routesDir, routes);
    routes.sort();
    (0, generator_1.generateRouteTypes)(srcDir, routesDir, routes);
    const seenRoutes = new Set();
    routes.forEach((route) => seenRoutes.add((0, node_path_1.join)(routesDir, route, `index.tsx`)));
    return seenRoutes;
}
async function assertDirectoryExists(directoryPath) {
    try {
        const stats = await (0, promises_1.stat)(directoryPath);
        if (!stats.isDirectory()) {
            throw new Error(`${directoryPath} is not a directory.`);
        }
    }
    catch (error) {
        throw new Error(`Directory ${directoryPath} does not exist.`);
    }
}
function getRouteDirectory(id) {
    const lastSlash = id.lastIndexOf(node_path_1.sep);
    const filename = id.substring(lastSlash + 1);
    if (filename.endsWith('index.md') ||
        filename.endsWith('index.mdx') ||
        filename.endsWith('index.js') ||
        filename.endsWith('index.jsx') ||
        filename.endsWith('index.ts') ||
        filename.endsWith('index.tsx')) {
        return id.substring(0, lastSlash + 1);
    }
    return null;
}
async function collectRoutes(base, directoryPath, routes) {
    const files = await (0, promises_1.readdir)(directoryPath);
    for (let i = 0; i < files.length; i++) {
        const filePath = (0, node_path_1.join)(directoryPath, files[i]);
        const fileStat = await (0, promises_1.stat)(filePath);
        let route;
        if (fileStat.isDirectory()) {
            await collectRoutes(base, filePath, routes);
        }
        else if ((route = getRouteDirectory(filePath)) !== null) {
            routes.push(route.substring(base.length).replaceAll(node_path_1.sep, '/'));
        }
    }
}
