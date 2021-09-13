import {ICNFLiteral, ICNF} from "../_types/solver/ICNF";
import {ISCNF} from "../_types/solver/ISCNF";
import {IVariableIdentifier} from "../_types/solver/IVariableIdentifier";

/**
 * Simplifies the formula in CNF form
 * @param formula The formula to be simplified
 * @returns The simplified formula
 */
export function simplifyCNFRepresentation(formula: ICNF): ISCNF {
    const noRedundantClauses = formula.filter(clause => !clauseIsTautology(clause));
    const noRedundantLiterals = noRedundantClauses.map(clause =>
        removeDuplicateVars(clause)
    );

    return noRedundantLiterals;
}

/**
 * Checks whether a given clause on its own is a tautology
 * @param clause The clause to be checked
 * @returns Whether the given clause is a tautology
 */
export function clauseIsTautology(clause: ICNFLiteral[]): boolean {
    const varsNegated: Map<IVariableIdentifier<boolean>, boolean> = new Map();
    for (let {variable, negated} of clause) {
        if (varsNegated.has(variable) && varsNegated.get(variable) != negated)
            return true;
        varsNegated.set(variable, negated);
    }

    return false;
}

/**
 * Removes duplicate variables in a given clause
 * @param clause The clause to remove duplicate variables from
 * @returns The literals without duplicates
 */
export function removeDuplicateVars(clause: ICNFLiteral[]): ICNFLiteral[] {
    const vars: Set<IVariableIdentifier<boolean>> = new Set();
    return clause.filter(({variable}) => {
        if (vars.has(variable)) return false;
        vars.add(variable);
        return true;
    });
}
