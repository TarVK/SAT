import {TMapArray} from "./TMapArray";

/**
 * Maps both tuples and proper arrays
 */
export type TMap2dArray<T extends Array<Array<any>>, S, V> = T extends [
    infer F,
    ...infer R
]
    ? F extends Array<any>
        ? R extends Array<Array<any>>
            ? [TMapArray<F, S, V>, ...TMap2dArray<R, S, V>]
            : never
        : never
    : TMapNonTupleArray<T, S, V>;

type TMapNonTupleArray<T extends Array<any>, S, V> = T extends []
    ? T
    : T extends Array<infer U>
    ? Array<U extends Array<any> ? TMapArray<U, S, V> : U>
    : T;
