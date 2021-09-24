import {IContext} from "./context/IContext";
import {ICNF} from "./solver/ICNF";
import {IVariableIdentifier} from "./solver/IVariableIdentifier";

export type IFormulaInput<T = any, D extends Object = {}> = {
    /** The precedence for this operator */
    precedence: number;
    /**
     * Executes the formula given the collection of variables
     * @param context The context to retrieve variables from, etc
     * @returns The result
     */
    execute(context: IContext): T;
    /**
     * Converts the formula to a Conjunctive Normal Form (CNF) with the equivalent interpretation
     * @param context The context to E.g. retrieve function definitions from
     * @returns The CNF
     */
    toCNF(context: IContext): {cnf: ICNF; variable: IVariableIdentifier<boolean>};
    /**
     * Formats this formula into a neatly readable string
     * @param context The context to pass data with
     * @returns The neatly formatted string
     */
    format(context: IContext): string;
    /**
     * Formats this formula into a SMT-LIB2 string with accompanying variable declarations
     * @param context The context to pass data with
     * @returns A string that z3 can understand
     */
    toSMTLIB2(context: IContext): {
        formula: string;
        variables: Set<IVariableIdentifier<any>>;
    };
    /** Additional data for the formula */
    data?: D;
};
