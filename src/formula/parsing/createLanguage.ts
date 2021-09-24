import P, {Parser} from "parsimmon";
import {Result} from "parsimmon";
import {IFormula} from "../../_types/IFormula";
import {IOperator} from "../../_types/IOperator";
import {IOperatorFactory} from "../../_types/IOperatorFactory";
import {
    IOperatorBinaryParser,
    IOperatorNonBinaryParser,
} from "../../_types/IOperatorParser";
import {TMapOperatorFactories} from "../../_types/utils/TMapOperatorFactories";

/**
 * Constructs a language from the given operators, where every row represents a precedence (higher in list = higher precedence).
 * @param operators The operators to combine into a language
 * @returns The constructed parser, as well as the created operators
 */
export function createLanguage<O extends IOperatorFactory[][]>(
    operators: O
): {
    /**
     * Parses the string
     * @param input The input to be parsed
     * @returns Either the resulting formula, or an error
     */
    parse(input: string): Result<IFormula>;
    /**
     * The instantiated operators, with the specified precedence
     */
    operators: TMapOperatorFactories<O>;
} {
    type R = {parser: Parser<IFormula>; operators: IOperator[][]};
    const startPrecedence = operators.length - 1;
    const result: R = operators.reduce<R>(
        ({parser: nextParser, operators}, precedenceLevel, i) => {
            const precedence = startPrecedence - i;
            const levelParser: Parser<IFormula> = P.lazy(() => leftRecursiveParser);

            // Instantiate all operators on this level
            const levelOperators = precedenceLevel.map(factory =>
                factory({nextParser, currentParser: levelParser, precedence})
            );

            // Retrieve the different types of parsers
            const leftRecursive = levelOperators
                .filter(
                    operator =>
                        "associativity" in operator && operator.associativity == "left"
                )
                .map(operator => (operator as IOperatorBinaryParser).infixParser);
            const rightRecursive = levelOperators
                .filter(
                    operator =>
                        "associativity" in operator && operator.associativity == "right"
                )
                .map(operator => (operator as IOperatorBinaryParser).infixParser);
            const nonBinary = levelOperators
                .filter(operator => !("associativity" in operator))
                .map(operator => (operator as IOperatorNonBinaryParser).parser);

            // Construct the parser for this precedence level
            const baseParser =
                nonBinary.length > 0
                    ? P.alt(...nonBinary, ...(i == 0 ? [] : [nextParser]))
                    : i == 0
                    ? P.fail("Parser should have a base case")
                    : nextParser;
            const rightRecursiveParser: Parser<IFormula> =
                rightRecursive.length > 0
                    ? P.lazy(() =>
                          baseParser.chain(leftValue =>
                              P.seq(P.alt(...rightRecursive), rightRecursiveParser).map(
                                  ([combiner, rightValue]) =>
                                      combiner(leftValue, rightValue)
                              )
                          )
                      )
                    : baseParser;
            const leftRecursiveParser =
                leftRecursive.length > 0
                    ? P.seq(
                          rightRecursiveParser,
                          P.seq(P.alt(...leftRecursive), rightRecursiveParser).many()
                      ).map(([first, rest]) =>
                          rest.reduce(
                              (formula, [combiner, nextValue]) =>
                                  combiner(formula, nextValue),
                              first
                          )
                      )
                    : rightRecursiveParser;

            return {
                parser: leftRecursiveParser,
                operators: [...operators, levelOperators],
            };
        },
        {parser: P.lazy(() => result.parser), operators: [] as IOperator[][]}
    );

    return {
        parse: (...args) => result.parser.parse(...args),
        operators: result.operators as any,
    };
}
