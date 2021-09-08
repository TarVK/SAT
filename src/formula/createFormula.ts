import {Context} from "../context/Context";
import {DavisPutnamSolver} from "../solver/procedures/DavisPutnamSolver";
import {IContext} from "../_types/context/IContext";
import {IFormula} from "../_types/IFormula";
import {IFormulaInput} from "../_types/IFormulaInput";

/**
 * Creates a full CNF formula
 * @param cnf The core formula to be wrapped
 * @param formula The formula object
 * @returns The formula together with some useful functions
 */
export function createFormula<T extends IFormulaInput>(formula: T): IFormula & T["data"] {
    const precedence = formula.precedence ?? 0;

    // A format function that takes care of adding association brackets if necessary
    const format = (context: IContext) => (formula: IFormula) =>
        formula.precedence < precedence
            ? `(${formula.format(context)})`
            : formula.format(context);

    const completeFormula: IFormula & T["data"] = {
        ...formula.data,
        precedence,
        execute: (context = new Context()) => formula.execute(context),
        format: (context = new Context()) => formula.format(format(context), context),
        toCNF: (context = new Context(), negate = false) =>
            formula.toCNF(context, negate),
        solve: async solver => (solver || DavisPutnamSolver)(completeFormula),
        toZ3: (context = new Context()) => formula.toZ3(context),
    };

    return completeFormula;
}
