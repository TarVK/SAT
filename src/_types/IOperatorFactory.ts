import {Parser} from "parsimmon";
import {IFormula} from "./IFormula";
import {IOperator} from "./IOperator";

/** Creates a new operator factory, that can be used to create operators with a given precedence */
export type IOperatorFactory<C extends IOperator = IOperator> = (data: {
    /** The next (recursive) parser to be applied */
    nextParser: Parser<IFormula>;
    /** The precedence of this operator */
    precedence: number;
    /** The current parser, including all operators with this same precedence */
    currentParser: Parser<IFormula>;
}) => C;
