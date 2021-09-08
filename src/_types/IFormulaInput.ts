import {IContext} from "./context/IContext";
import {IFormula} from "./IFormula";
import {ICNF} from "./solver/ICNF";

export type IFormulaInput<D extends Object = {}> = {
    /** The precedence for this operator */
    precedence?: number;
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
     * Formats this formula into a neatly readable string
     * @param format The function that can be used to format a subformula, which automatically inserts brackets if necessary
     * @param context The context to pass data with
     * @returns The neatly formatted string
     */
    format(format: (subFormula: IFormula) => string, context: IContext): string;
    /**
     * Formats this formula into a Z3 string
     * @param context The context to pass data with
     * @returns A string that z3 can understand
     */
    toZ3(context: IContext): string;
    /** Additional data for the formula */
    data?: D;
};
