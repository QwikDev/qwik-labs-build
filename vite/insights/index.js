"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.qwikInsights = void 0;
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const INSIGHTS_Q_MANIFEST_FILENAME = './dist/q-insights.json';
const logWarn = (message) => {
    console.warn('\x1b[33m%s\x1b[0m', `\n\nQWIK WARN: ${message}\n`);
};
async function qwikInsights(qwikInsightsOpts) {
    const { publicApiKey, baseUrl = 'https://qwik-insights.builder.io' } = qwikInsightsOpts;
    let isProd = false;
    const vitePlugin = {
        name: 'vite-plugin-qwik-insights',
        enforce: 'pre',
        async config(viteConfig) {
            isProd = viteConfig.mode !== 'ssr';
            if (isProd) {
                const qManifest = { type: 'smart' };
                try {
                    const response = await fetch(`${baseUrl}/api/v1/${publicApiKey}/bundles/`);
                    const bundles = await response.json();
                    qManifest.manual = bundles;
                }
                catch (e) {
                    logWarn('fail to fetch manifest from Insights DB');
                }
                await (0, promises_1.writeFile)(INSIGHTS_Q_MANIFEST_FILENAME, JSON.stringify(qManifest));
            }
        },
        closeBundle: async () => {
            const Q_MANIFEST_FILENAME = './dist/q-manifest.json';
            if (isProd && (0, fs_1.existsSync)('./dist/q-manifest.json')) {
                const qManifest = await (0, promises_1.readFile)(Q_MANIFEST_FILENAME, 'utf-8');
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
