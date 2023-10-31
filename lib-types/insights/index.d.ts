import { z } from 'zod';
export interface InsightsPayload {
    /**
     * Unique ID per user session.
     *
     * Every page refresh constitutes a new SessionID. An SPA navigation will generate a new
     * SessionID.
     *
     * NOTE: A user session implies same route URL.
     */
    sessionID: string;
    /** Manifest Hash of the container. */
    manifestHash: string;
    /**
     * API key of the application which we are trying to profile.
     *
     * This key can be used for sharding the data.
     */
    publicApiKey: string;
    /**
     * Previous symbol received on the client.
     *
     * Client periodically sends symbol log to the server. Being able to connect the order of symbols
     * is useful for server clustering. Sending previous symbol name allows the server to stitch the
     * symbol list together.
     */
    previousSymbol: string | null;
    /** List of symbols which have been received since last update. */
    symbols: InsightSymbol[];
}
export interface InsightSymbol {
    /** Symbol name */
    symbol: string;
    /** Current route so we can have a better understanding of which symbols are needed for each route. */
    route: string;
    /** Time delta since last symbol. Can be used to stich symbol requests together */
    delay: number;
    /** Number of ms between the time the symbol was requested and it was loaded. */
    latency: number;
    /** Number of ms between the q:route attribute change and the qsymbol event */
    timeline: number;
    /**
     * Was this symbol as a result of user interaction. User interactions represent roots for
     * clouters.
     */
    interaction: boolean;
}
export interface InsightsError {
    sessionID: string;
    /** Manifest Hash of the container. */
    manifestHash: string;
    timestamp: number;
    url: string;
    source: string;
    line: number;
    column: number;
    error: string;
    message: string;
    stack: string;
}
export declare const InsightsError: z.ZodObject<{
    manifestHash: z.ZodString;
    sessionID: z.ZodString;
    url: z.ZodString;
    timestamp: z.ZodNumber;
    source: z.ZodString;
    line: z.ZodNumber;
    column: z.ZodNumber;
    message: z.ZodString;
    error: z.ZodString;
    stack: z.ZodString;
}, "strip", z.ZodTypeAny, {
    error: string;
    manifestHash: string;
    sessionID: string;
    url: string;
    timestamp: number;
    source: string;
    line: number;
    column: number;
    message: string;
    stack: string;
}, {
    error: string;
    manifestHash: string;
    sessionID: string;
    url: string;
    timestamp: number;
    source: string;
    line: number;
    column: number;
    message: string;
    stack: string;
}>;
export declare const InsightSymbol: z.ZodObject<{
    symbol: z.ZodString;
    route: z.ZodString;
    delay: z.ZodNumber;
    latency: z.ZodNumber;
    timeline: z.ZodNumber;
    interaction: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    symbol: string;
    route: string;
    delay: number;
    latency: number;
    timeline: number;
    interaction: boolean;
}, {
    symbol: string;
    route: string;
    delay: number;
    latency: number;
    timeline: number;
    interaction: boolean;
}>;
export declare const InsightsPayload: z.ZodObject<{
    sessionID: z.ZodString;
    manifestHash: z.ZodString;
    publicApiKey: z.ZodString;
    previousSymbol: z.ZodNullable<z.ZodString>;
    symbols: z.ZodArray<z.ZodObject<{
        symbol: z.ZodString;
        route: z.ZodString;
        delay: z.ZodNumber;
        latency: z.ZodNumber;
        timeline: z.ZodNumber;
        interaction: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        route: string;
        delay: number;
        latency: number;
        timeline: number;
        interaction: boolean;
    }, {
        symbol: string;
        route: string;
        delay: number;
        latency: number;
        timeline: number;
        interaction: boolean;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    manifestHash: string;
    sessionID: string;
    publicApiKey: string;
    previousSymbol: string | null;
    symbols: {
        symbol: string;
        route: string;
        delay: number;
        latency: number;
        timeline: number;
        interaction: boolean;
    }[];
}, {
    manifestHash: string;
    sessionID: string;
    publicApiKey: string;
    previousSymbol: string | null;
    symbols: {
        symbol: string;
        route: string;
        delay: number;
        latency: number;
        timeline: number;
        interaction: boolean;
    }[];
}>;
export declare const Insights: import("@builder.io/qwik").Component<{
    publicApiKey: string;
    postUrl?: string | undefined;
}>;
