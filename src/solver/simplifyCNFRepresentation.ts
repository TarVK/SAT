import {ICNFLiteral, ICNF} from "../_types/solver/ICNF";
import {ISCNF} from "../_types/solver/ISCNF";

/**
 * Simplifies the formula in CNF form
 * @param formula The formula to be simplified
 * @returns The simplified formula
 */
export function simplifyCNFRepresentation(formula: ICNF): ISCNF {
    const noRedundantClauses = formula.filter(clause => !clauseIsTautology(clause));

    const noRedundantLiterals = noRedundantClauses.map(clause => {
        const vars: Record<symbol, boolean> = {};
        return clause.filter(({variable}) => {
            if (variable in vars) return false;
            vars[variable] = true;
            return true;
        });
    });

    return noRedundantLiterals;
}

/**
 * Checks whether a given clause on its own is a tautology
 * @param clause The clause to be checked
 * @returns Whether the given clause is a tautology
 */
export function clauseIsTautology(clause: ICNFLiteral[]): boolean {
    const varsNegated: Record<symbol, boolean> = {};
    for (let {variable, negated} of clause) {
        if (variable in varsNegated && varsNegated[variable] != negated) return true;
        varsNegated[variable] = negated;
    }

    return false;
}
