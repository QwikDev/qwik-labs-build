import { type QwikVitePluginOptions } from '@builder.io/qwik/optimizer';
export declare function insightsEntryStrategy({ publicApiKey, }: {
    publicApiKey: string;
}): Promise<QwikVitePluginOptions['entryStrategy']>;
