import {Parser} from "parsimmon";
import {IFormula} from "../_types/IFormula";
import {IOperator} from "../_types/IOperator";
import {IOperatorFactory} from "../_types/IOperatorFactory";
import {IOperatorParser} from "../_types/IOperatorParser";

/**
 * Creates a factory for operators, such that operators with different precedences can be created from this factor
 * @param constructor A function that given a next (recursive) parser and a precedence creates an operator and its associated parser
 * @returns The created operator factor
 */
export function createOperatorFactory<
    C extends (...args: any[]) => IFormula,
    IA extends IFormula,
    IB extends IFormula
>(
    constructor: (data: {
        /** The next (recursive) parser to be applied */
        nextParser: Parser<IFormula>;
        /** The precedence of this operator */
        precedence: number;
        /** The current parser, including all operators with this same precedence */
        currentParser: Parser<IFormula>;
    }) => {operator: C} & IOperatorParser<ReturnType<C>, IA, IB>
): IOperatorFactory<IOperator<C, IA, IB>> {
    return (...args) => {
        const {operator, ...rest} = constructor(...args);
        return Object.assign(operator, rest);
    };
}
