"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.qwikInsights = void 0;
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const node_path_1 = require("node:path");
const logWarn = (message) => {
    // eslint-disable-next-line no-console
    console.warn('\x1b[33m%s\x1b[0m', `qwikInsight()[WARN]: ${message}`);
};
const log = (message) => {
    // eslint-disable-next-line no-console
    console.log('\x1b[35m%s\x1b[0m', `qwikInsight(): ${message}`);
};
async function qwikInsights(qwikInsightsOpts) {
    const { publicApiKey, baseUrl = 'https://qwik-insights.builder.io', outDir = 'dist', } = qwikInsightsOpts;
    let isProd = false;
    const vitePlugin = {
        name: 'vite-plugin-qwik-insights',
        enforce: 'pre',
        apply: 'build',
        async config(viteConfig) {
            isProd = viteConfig.mode !== 'ssr';
            if (isProd) {
                const qManifest = { type: 'smart' };
                try {
                    const response = await fetch(`${baseUrl}/api/v1/${publicApiKey}/bundles/strategy/`);
                    const strategy = await response.json();
                    Object.assign(qManifest, strategy);
                }
                catch (e) {
                    logWarn('fail to fetch manifest from Insights DB');
                }
                const cwdRelativePath = (0, node_path_1.join)(viteConfig.root || '.', outDir);
                const cwdRelativePathJson = (0, node_path_1.join)(cwdRelativePath, 'q-insights.json');
                if (!(0, fs_1.existsSync)((0, node_path_1.join)(process.cwd(), cwdRelativePath))) {
                    (0, fs_1.mkdirSync)((0, node_path_1.join)(process.cwd(), cwdRelativePath), { recursive: true });
                }
                log('Fetched latest Qwik Insight data into: ' + cwdRelativePathJson);
                await (0, promises_1.writeFile)((0, node_path_1.join)(process.cwd(), cwdRelativePathJson), JSON.stringify(qManifest));
            }
        },
        closeBundle: async () => {
            const path = (0, node_path_1.join)(process.cwd(), outDir, 'q-manifest.json');
            if (isProd && (0, fs_1.existsSync)(path)) {
                const qManifest = await (0, promises_1.readFile)(path, 'utf-8');
                try {
                    await fetch(`${baseUrl}/api/v1/${publicApiKey}/post/manifest`, {
                        method: 'post',
                        body: qManifest,
                    });
                }
                catch (e) {
                    logWarn('fail to post manifest to Insights DB');
                }
            }
        },
    };
    return vitePlugin;
}
exports.qwikInsights = qwikInsights;
