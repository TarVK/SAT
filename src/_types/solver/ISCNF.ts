import {ICNF} from "./ICNF";

/**
 * The representation of a simplified conjunctive normal form boolean formula:
 * ```
 * [[{variable: x, negated: true}, {variable: y, negated: false}], [{variable: y, negated: true}, {variable: z, negated: false}]]
 * ==
 * (not x or y) and (not y or z)
 * ```
 *
 * Additional constraints that make this the simplified form are (which aren't expressible in the type system):
 * - No clause including `x or not x` is allowed
 * - No duplicate variables are allowed in a clause (essentially already preventing the above)
 */
export type ISCNF = ICNF;
