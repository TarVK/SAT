import {IFormula} from "./IFormula";
import {IFormulaInput} from "./IFormulaInput";

/** An operator type from which formulas can be generated */
export type IOperator<C extends (...args: any) => IFormula = (...args: any) => IFormula> =
    C & {
        /** The precedence of this operator */
        precedence: number;
    };
