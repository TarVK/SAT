import {IVariableIdentifier} from "./IVariableIdentifier";

/**
 * The core representation of a conjunctive normal form boolean formula:
 * ```
 * [[{variable: x, negated: true}, {variable: y, negated: false}], [{variable: y, negated: true}, {variable: z, negated: false}]]
 * ==
 * (not x or y) and (not y or z)
 * ```
 */
export type ICNF = ICNFLiteral[][];

/** A single literal in a CNF formula */
export type ICNFLiteral = {variable: IVariableIdentifier<boolean>; negated: boolean};
