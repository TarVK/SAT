import {Parser} from "parsimmon";
import {IFormula} from "./IFormula";

/** A parser for operators */
export type IOperatorParser<
    O extends IFormula,
    IA extends IFormula,
    IB extends IFormula
> = IOperatorBinaryParser<O, IA, IB> | IOperatorNonBinaryParser<O>;

export type IOperatorBinaryParser<
    O extends IFormula = IFormula,
    IA extends IFormula = IFormula,
    IB extends IFormula = IFormula
> = {
    /** Whether the operator is left or right associative */
    associativity: "left" | "right";
    /** The parser for the infix operator */
    infixParser: Parser<(left: IA, right: IB) => O>;
};

export type IOperatorNonBinaryParser<O extends IFormula = IFormula> = {
    /** A parser for non-infix operators */
    parser: Parser<O>;
};
