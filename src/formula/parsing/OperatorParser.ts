import P, {Parser} from "parsimmon";

/**
 * Creates a simple parser to literally match the given text, and possibly surrounding whitespace
 * @param text The text to be matched
 * @returns The parser to match the text
 */
export function OperatorParser(text: string): Parser<string> {
    return P.string(text).trim(P.optWhitespace);
}
