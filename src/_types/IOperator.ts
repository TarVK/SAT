import {IFormula} from "./IFormula";
import {IFormulaInput} from "./IFormulaInput";
import {TReplaceReturnType} from "./TReplaceReturnType";

/** An operator type from which formulas can be generated */
export type IOperator<
    C extends (...args: any) => IFormulaInput = (...args: any) => IFormulaInput
> = TReplaceReturnType<C, IFormula & ReturnType<C>["data"]> & {
    /** The precedence of this operator */
    precedence: number;
};
