import {IContext} from "../../_types/context/IContext";
import {IFormula} from "../../_types/IFormula";
import {IVariableIdentifier} from "../../_types/solver/IVariableIdentifier";

/**
 * Combines the given formulas using the combine function
 * @param combine The function that specifies how to combine the given formulas
 * @param formulas The formulas to be combined
 * @param context The context to specify additional data
 * @returns The combine formulas
 */
export function combineSMTLIBFormulas(
    combine: (formulas: string[]) => {
        formula: string;
        variables?: IVariableIdentifier<any>[];
    },
    formulas: IFormula[],
    context: IContext
): {formula: string; variables: Set<IVariableIdentifier<any>>} {
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
