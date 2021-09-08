import {IFormula} from "./IFormula";
import {IFormulaInput} from "./IFormulaInput";
import {TReplaceReturnType} from "./TReplaceReturnType";

export type IOperator<
    C extends (...args: any) => IFormulaInput = (...args: any) => IFormulaInput
> = TReplaceReturnType<C, IFormula & ReturnType<C>["data"]> & {
    /** The precedence of this operator */
    precedence: number;
};
