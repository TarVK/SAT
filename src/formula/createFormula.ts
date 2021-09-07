import {DavisPutnamSolver} from "../solver/procedures/DavisPutnamSolver";
import {IFormula} from "../_types/IFormula";

/**
 * Creates a full CNF formula
 * @param cnf The core formula to be wrapped
 * @param formula The formula object
 * @returns The formula together with some useful functions
 */
export function createFormula<T extends Omit<IFormula, "solve">>(
    formula: T
): IFormula & T {
    const completeFormula: IFormula & T = {
        ...formula,
        solve: solver => (solver || DavisPutnamSolver)(completeFormula),
    };
    return completeFormula;
}
