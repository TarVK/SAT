import {IFormula} from "../../_types/IFormula";
import {createFormula} from "../createFormula";
import {variablesIdentifier} from "../variablesIdentifier";

/**
 * Creates a new variable
 * @param variable Either a unique symbol, or a string to represent the variable
 * @returns The formula representing this variable, including an identifier for this variable
 */
export const Variable = (variable: symbol | string): IFormula & {identifier: symbol} => {
    const symbolVar = typeof variable == "string" ? Symbol(variable) : variable;
    return createFormula({
        identifier: symbolVar,
        execute: context => {
            const variables = context.get(variablesIdentifier);
            if (!(variable in variables))
                throw new Error(
                    `Variable "${String(
                        symbolVar
                    )}" wasn't present in the passed variables`
                );
            return variables[symbolVar];
        },
        toCNF: (context, negated) => [[{variable: symbolVar, negated}]],
    });
};
