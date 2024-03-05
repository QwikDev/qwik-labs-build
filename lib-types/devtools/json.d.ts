export declare function runQwikJsonDebug(window: Window, document: Document, debug: typeof qwikJsonDebug): void;
export declare function qwikJsonDebug(document: Document, qwikJson: QwikJson, derivedFns: Function[]): DebugState;
export interface QwikJson {
    refs: Record<string, string>;
    ctx: Record<string, {
        w?: string;
        s?: string;
        h?: string;
        c?: string;
    }>;
    objs: Array<QwikJsonObjsPrimitives | QwikJsonObjsObj>;
    subs: Array<Array<string>>;
}
export type QwikJsonObjsPrimitives = string | boolean | number | null;
export type QwikJsonObjsObj = Record<string, QwikJsonObjsPrimitives>;
export interface Base {
    __id: number;
    __backRefs: any[];
}
export interface QRL extends Base {
    chunk: string;
    symbol: string;
    capture: any[];
}
export interface QRefs {
    element: Element;
    refMap: any[];
    listeners: Listener[];
}
export interface Listener {
    event: string;
    qrl: QRL;
}
export interface SubscriberEffect {
}
export interface QContext {
    element: Node | null;
    props: Record<string, any> | null;
    componentQrl: QRL | null;
    listeners: Listener[];
    seq: any[] | null;
    tasks: SubscriberEffect[] | null;
    contexts: Map<string, any> | null;
    scopeIds: string[] | null;
}
export interface DebugState {
    refs: Record<string, QRefs>;
    ctx: Record<string, QContext>;
    objs: any[];
    subs: unknown;
}
export type QwikType = 'string' | 'number' | 'bigint' | 'boolean' | 'function' | 'undefined' | 'object' | 'symbol' | 'QRL' | 'Signal' | 'SignalWrapper' | 'Task' | 'Resource' | 'URL' | 'Date' | 'Regex' | 'Error' | 'DerivedSignal' | 'FormData' | 'URLSearchParams' | 'Component' | 'NoFiniteNumber' | 'JSXNode' | 'BigInt' | 'Set' | 'Map' | 'Document';
