import {createOperator} from "../createOperator";
import {variablesIdentifier} from "../variablesIdentifier";

/**
 * Creates a new variable
 * @param variable Either a unique symbol, or a string to represent the variable
 * @returns The formula representing this variable, including an identifier for this variable
 */
export const Variable = createOperator((variable: symbol | string) => {
    const symbolVar =
        typeof variable == "string" ? getVariableSymbol(variable) : variable;
    return {
        identifier: symbolVar,
        execute: context => {
            const variables = context.get(variablesIdentifier);
            if (!(variable in variables))
                throw new Error(
                    `Variable "${String(
                        symbolVar
                    )}" wasn't present in the passed variables`
                );
            return Boolean(variables[symbolVar]);
        },
        toCNF: (context, negated) => [[{variable: symbolVar, negated}]],
        format: () => String(variable),
        toZ3: context => `${getVariableId(variable)}`,
    };
});

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

const variableIds: Record<symbol, number> = {};
let maxId = 0;
/**
 * Obtains a uuid for the ID
 * @param variable
 */
export function getVariableId(variable: string | symbol): string {
    if (typeof variable == "string") return variable;

    if (!variableIds[variable]) variableIds[variable] = maxId++;
    const varID = "$" + variableIds[variable];
    if (!variableMap[varID]) variableMap[varID] = variable;
    return varID;
}
