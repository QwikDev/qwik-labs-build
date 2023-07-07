/**
 * @public
 */
export declare const untypedAppUrl: (route: string, params?: Record<string, string>, paramsPrefix?: string) => string;
/**
 * Creates a new object from `obj` by omitting a set of `keys`.
 *
 * @public
 */
export declare function omitProps<T, KEYS extends keyof T>(obj: T, keys: KEYS[]): Omit<T, KEYS>;
