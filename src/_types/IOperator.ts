import {Parser} from "parsimmon";
import {IFormula} from "./IFormula";
import {IOperatorParser} from "./IOperatorParser";

/** An operator type from which formulas can be generated */
export type IOperator<
    C extends (...args: any) => IFormula = (...args: any) => IFormula,
    IA extends IFormula = IFormula,
    IB extends IFormula = IFormula
> = C & IOperatorParser<ReturnType<C>, IA, IB>;

// /** An operator type from which formulas can be generated */
// export type IOperator = ((...args: any[]) => IFormula) & Parser<IFormula>;
