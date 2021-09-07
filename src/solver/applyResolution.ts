import {ICNFLiteral} from "../_types/solver/ICNF";
import {IVariableIdentifier} from "../_types/solver/IVariableIdentifier";

/**
 * Combines two clauses on a given literal
 * @param a The first clause
 * @param b The second clause
 * @param variable The variable that was combined on
 * @returns The newly combined literal
 */
export function applyResolution(
    a: ICNFLiteral[],
    b: ICNFLiteral[],
    variable: IVariableIdentifier
): ICNFLiteral[] {
    return a
        .filter(({variable: v}) => variable != v)
        .concat(b.filter(({variable: v}) => variable != v));
}
