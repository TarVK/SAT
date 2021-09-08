/** Replaces the return type of the given function */
export type TReplaceReturnType<T extends (...arg: any) => any, TNewReturn> = (
    ...arg: Parameters<T>
) => TNewReturn;
