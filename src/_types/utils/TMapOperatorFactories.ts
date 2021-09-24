import {IOperatorFactory} from "../IOperatorFactory";

/**
 * Maps both tuples and proper arrays
 */
export type TMapOperatorFactories<T extends Array<Array<any>>> = T extends [
    infer F,
    ...infer R
]
    ? F extends Array<any>
        ? R extends Array<Array<any>>
            ? [TMapArray<F>, ...TMapOperatorFactories<R>]
            : never
        : never
    : TMapNonTuple2dArray<T>;

type TMapNonTuple2dArray<T extends Array<any>> = T extends []
    ? T
    : T extends Array<infer U>
    ? Array<U extends Array<any> ? TMapArray<U> : U>
    : T;

type TMapArray<T extends Array<any>> = T extends [infer F, ...infer R]
    ? [F] extends [IOperatorFactory<infer C>]
        ? [C, ...TMapArray<R>]
        : [F, ...TMapArray<R>]
    : TMapNonTupleArray<T>;

type TMapNonTupleArray<T extends Array<any>> = T extends []
    ? T
    : T extends Array<infer U>
    ? Array<U extends IOperatorFactory<infer C> ? C : U>
    : T;
