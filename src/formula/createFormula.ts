import {Context} from "../context/Context";
import {CDCLSolver} from "../solver/procedures/CDCL/CDCLSolver";
import {IContext} from "../_types/context/IContext";
import {IFormula} from "../_types/IFormula";
import {IFormulaInput} from "../_types/IFormulaInput";

/**
 * Creates a full CNF formula
 * @param cnf The core formula to be wrapped
 * @param formula The formula object
 * @returns The formula together with some useful functions
 */
export function createFormula<T extends IFormulaInput>(
    formula: T
): IFormula<T extends IFormulaInput<infer V> ? V : never> & T["data"] {
    // A format function that takes care of adding association brackets if necessary
    const format = (context: IContext) => (formula: IFormula) =>
        formula.precedence < completeFormula.precedence
            ? `(${formula.format(context)})`
            : formula.format(context);

    const completeFormula: IFormula & T["data"] = {
        ...formula.data,
        precedence: formula.precedence,
        execute: (context = new Context()) => formula.execute(context),
        format: (context = new Context()) => formula.format(context),
        toCNF: (context = new Context()) => formula.toCNF(context),
        solve: solver => (solver || CDCLSolver)(completeFormula),
        toSMTLIB2: (context = new Context()) => formula.toSMTLIB2(context),
    };

    return completeFormula;
}
