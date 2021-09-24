import P from "parsimmon";

/**
 * A parser that doesn't consume any input, but results in the input text and current index.
 * This can be useful during mapping
 * ```ts
 * P.seq(parser, MetaDataParser).map((value, metaData)=>...));
 * ```
 */
export const MetaDataParser = P((input, index) => ({
    status: true,
    index,
    furthest: -1,
    expected: [],
    value: {
        input,
        index,
    },
}));
