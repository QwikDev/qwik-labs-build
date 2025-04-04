import { PluginOption } from 'vite';

/** @public */
export interface InsightManifest {
    manual: Record<string, string>;
    prefetch: {
        route: string;
        symbols: string[];
    }[];
}
export declare function qwikInsights(qwikInsightsOpts: {
    publicApiKey: string;
    baseUrl?: string;
    outDir?: string;
}): Promise<PluginOption>;
