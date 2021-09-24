import P from "parsimmon";
import {Parser, Reply} from "parsimmon";

/**
 * Caches the given parser such that if it operates multiple times on the same input, it will recall the output without having to reparse
 * @param parser The parser to be cached
 * @param size The number of entries to be cached, defaults to 1 (such that it just works for repeated prefixes)
 * @returns The cached version of the parser
 */
export function Cache<T>(parser: Parser<T>, size: number = 1): Parser<T> {
    // Special optimized case for a cache of size 1
    if (size == 1) {
        let prev: {input: string; index: number; value: Reply<T>} | undefined;
        return P((input, index) => {
            if (!prev || prev.input != input || prev.index != index) {
                const parserResult: Reply<T> = (parser as any)._(input, index);
                prev = {input, index, value: parserResult};
            }
            return prev.value;
        });
    }

    const seq: [string, number][] = [];
    const cache = new Map<string, Map<number, Reply<T>>>();
    return P((input, index) => {
        const cached = cache.get(input)?.get(index);
        if (cached) return cached;

        const parserResult: Reply<T> = (parser as any)._(input, index);
        if (seq.length == size) {
            const [dropInput, dropIndex] = seq.pop()!;
            const dropInputCache = cache.get(dropInput);
            dropInputCache?.delete(dropIndex);
            if (dropInputCache?.size == 0) cache.delete(dropInput);
        }

        seq.unshift([input, index]);
        let inputCache = cache.get(input);
        if (!inputCache) {
            inputCache = new Map();
            cache.set(input, inputCache);
        }
        inputCache.set(index, parserResult);
        return parserResult;
    });
}
