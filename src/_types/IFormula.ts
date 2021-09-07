import {IContext} from "./context/IContext";
import {ICNF} from "./solver/ICNF";
import {ISATSolver} from "./solver/ISATSolver";
import {ISolveResult} from "./solver/ISolveResult";

export type IFormula = {
    /**
     * Executes the formula given the collection of variables
     * @param context The context to retrieve variables from, etc
     * @returns The result
     */
    execute(context: IContext): boolean;
    /**
     * Converts the formula to a Conjunctive Normal Form (CNF) with the equivalent interpretation
     * @param context The context to E.g. retrieve function definitions from
     * @param negate Whether this formula should be negated
     * @returns The CNF
     */
    toCNF(context: IContext, negate: boolean): ICNF;
    /**
     * Tries to solve this formula
     * @param solver The specific solver to be used
     * @returns The found result
     */
    solve(solver?: ISATSolver): ISolveResult;
};
