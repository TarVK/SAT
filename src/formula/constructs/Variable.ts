import {IFormula} from "../../_types/IFormula";
import {createFormula} from "../createFormula";
import {variablesIdentifier} from "../variablesIdentifier";

/**
 * Creates a new variable
 * @param variable Either a unique symbol, or a string to represent the variable
 * @returns The formula representing this variable, including an identifier for this variable
 */
export const Variable = (variable: symbol | string): IFormula & {identifier: symbol} => {
    const symbolVar =
        typeof variable == "string" ? getVariableSymbol(variable) : variable;
    return createFormula({
        precedence: Infinity,
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
        format: () => String(variable),
    });
};

const variableMap: Record<string, symbol> = {};
/**
 * Creates a symbol for the given name, such that the same name results in the same variables
 * @param name The name of the variable
 * @returns The symbol for the variable
 */
export function getVariableSymbol(name: string): symbol {
    if (!variableMap[name]) variableMap[name] = Symbol(name);
    return variableMap[name];
}
