import {IContext} from "../../_types/context/IContext";
import {IFormula} from "../../_types/IFormula";
import {IVariableIdentifier} from "../../_types/solver/IVariableIdentifier";

/**
 * Combines the given formulas using the combine function
 * @param config The configuration of what to combine
 * @returns The combine formulas
 */
export function combineSMTLIBFormulas({
    combine,
    formulas,
    context,
}: {
    /**
     * Combines a list of string formulas together
     * @param formulas The formulas to be combined
     * @returns The new formula, and possibly additional variables
     */
    combine: (formulas: string[]) => {
        formula: string;
        variables?: IVariableIdentifier<any>[];
    };
    /** The formulas to be combined */
    formulas: IFormula[];
    /** The context to specify additional data */
    context: IContext;
}): {formula: string; variables: Set<IVariableIdentifier<any>>} {
    const childData = formulas.map(formula => formula.toSMTLIB2(context));
    const childFormulas = childData.map(({formula}) => formula);
    const childVariables = childData.map(({variables}) => variables);

    const {formula, variables} = combine(childFormulas);
    const allVariables = new Set([
        ...(variables ? variables : []),
        ...childVariables.flatMap(m => [...m]),
    ]);

    return {formula, variables: allVariables};
}

/**
 * Creates a simple combiner that given a context combines the passed subformulas together as well as the used variables
 * @param config The configuration for the combiner
 * @returns A function that can be used to combine the formulas
 */
export const createSMTLIBFormulaCombiner =
    ({
        combine,
        formulas,
    }: {
        /**
         * Combines a list of string formulas together
         * @param formulas The formulas to be combined
         * @returns The new formula, and possibly additional variables
         */
        combine: (formulas: string[]) => {
            formula: string;
            variables?: IVariableIdentifier<any>[];
        };
        /**
         * The formulas to be combined
         */
        formulas: IFormula[];
    }) =>
    (context: IContext) =>
        combineSMTLIBFormulas({combine, formulas, context});
