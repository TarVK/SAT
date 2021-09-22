import {IContext} from "../../_types/context/IContext";
import {IFormula} from "../../_types/IFormula";
import {ICNF, ICNFLiteral} from "../../_types/solver/ICNF";
import {IVariableIdentifier} from "../../_types/solver/IVariableIdentifier";
import {Boolean} from "../types/Boolean";

/**
 * Converts a given formula to cnf using the Tseytin transformation
 * @param config The configuration of the operator
 * @param formulas The child formulas that this operator was applied on
 * @param context The context to obtain data from
 * @returns The function that converts to CNF, given a context
 */
export function convertToCnf(
    {
        name,
        arity,
        truthTable,
        rightAssociative,
    }: {
        /** The name of the operator */
        name: string;
        /** The number of arguments used by the operator */
        arity: number;
        /**
         * The truthTable for the operator, where binary counting is used for indexing. E.g. or:
         * ```
         * [
         *   false, // false || false
         *   true, // false || true
         *   true, // true || false
         *   true, // true || true
         * ]
         * ```
         */
        truthTable: boolean[];
        /** Whether the operator is right associative */
        rightAssociative?: boolean;
    },
    formulas: IFormula[],
    context: IContext
): {cnf: ICNF; variable: IVariableIdentifier<boolean>} {
    // Make sure we have the right number of children
    const extraFormulas = arity == 1 ? 0 : (formulas.length - 1) % (arity - 1);
    if (extraFormulas != 0)
        throw Error(
            `The ${name} operator expected 1 + k * ${arity - 1} arguments, but received ${
                1 + extraFormulas
            } + k * ${arity - 1} arguments`
        );

    // Convert the children
    const childData = formulas.map(formula => formula.toCNF(context));
    const cnfs = childData.flatMap(({cnf}) => cnf);
    const childVars = childData.map(({variable}) => variable);

    // Keep track of the generated variable to represent this formula
    let variable: IVariableIdentifier<boolean> = {
        type: Boolean,
        name: `${ID++}`,
        isGenerated: true,
    };

    // Apply this operator's constraints using the Tseytin transformation
    while (childVars.length > 0) {
        // Obtain the variables to use
        const vars: IVariableIdentifier<boolean>[] = [];
        for (let i = 0; i < arity; i++)
            if (rightAssociative) vars.unshift(childVars.pop()!);
            else vars.push(childVars.shift()!);

        // Generate all clauses required to represent the truth table in CNF
        for (let i = 0; i < Math.pow(2, arity); i++) {
            const clause: ICNFLiteral[] = [
                {negated: !truthTable[i], variable},
                ...vars.map((variable, varIndex) => ({
                    variable,
                    negated: ((i >> (vars.length - 1 - varIndex)) & 1) == 1,
                })),
            ];
            cnfs.push(clause);
        }

        // Add the variable back for recursion and create a new output variable
        if (childVars.length > 0) {
            if (rightAssociative) childVars.push(variable);
            else childVars.unshift(variable);
            variable = {
                type: Boolean,
                name: `${ID++}`,
                isGenerated: true,
            };
        }
    }

    return {cnf: cnfs, variable};
}

let ID = 0;
