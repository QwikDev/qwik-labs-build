"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insightsEntryStrategy = void 0;
async function insightsEntryStrategy({ publicApiKey, }) {
    const request = await fetch(`https://qwik-insights.builder.io/api/v1/${publicApiKey}/bundles/`);
    try {
        const bundles = await request.json();
        return {
            type: 'smart',
            manual: bundles,
        };
    }
    catch (e) {
        console.error(e);
        return {
            type: 'smart',
        };
    }
}
exports.insightsEntryStrategy = insightsEntryStrategy;
