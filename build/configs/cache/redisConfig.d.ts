export declare const setCache: (key: string, value: string, ex?: number) => Promise<"OK">;
export declare const getCache: (key: string) => Promise<string | null>;
export declare const removeCache: (key: string) => Promise<number>;
