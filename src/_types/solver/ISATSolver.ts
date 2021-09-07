import {IFormula} from "../IFormula";
import {ISolveResult} from "./ISolveResult";

/** A solver for formulas */
export type ISATSolver = {
    /**
     * Finds a variable assignment to satisfy the given formula
     * @param formula The formula to be solved
     * @returns Either undefined if no assignment exists, or a variable collection that satisfies the formula
     */
    (formula: IFormula): ISolveResult;
};
