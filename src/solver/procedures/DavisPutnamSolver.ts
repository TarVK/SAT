import {VarCollection} from "../../formula/varCollection";
import {IFormula} from "../../_types/IFormula";
import {ICNF} from "../../_types/solver/ICNF";
import {ISolveResult} from "../../_types/solver/ISolveResult";
import {applyResolution} from "../applyResolution";
import {printCNF} from "../printCNF";
import {
    clauseIsTautology,
    removeDuplicateVars,
    simplifyCNFRepresentation,
} from "../simplifyCNFRepresentation";

/**
 * Solves the satisfiability problem using Davis Putnam's procedure
 * @param formula The formula to be solved
 * @returns The found assignment, or undefined if no assignment exists
 */
export function DavisPutnamSolver(formula: IFormula | ICNF): ISolveResult {
    let cnf: ICNF;
    if ("toCNF" in formula) {
        const {cnf: formulaCnf, variable} = formula.toCNF();
        cnf = [...formulaCnf, [{variable, negated: false}]];
    } else {
        cnf = formula;
    }
    let remainingClauses = simplifyCNFRepresentation(cnf);

    // Check if the empty clause is present from the start (in which case the formula isn't satisfiable)
    const containsEmpty = remainingClauses.some(clause => clause.length == 0);
    if (containsEmpty) return undefined;

    // Apply resolution until the empty clause is found, or no clauses remain
    while (remainingClauses.length > 0) {
        const target = remainingClauses[0][0].variable;

        // Find clauses with this variable
        const clausesContainingVarOrNegatedVar = remainingClauses.filter(clause =>
            clause.some(({variable}) => variable == target)
        );
        const clausesContainingVar = clausesContainingVarOrNegatedVar.filter(clause =>
            clause.some(({variable, negated}) => variable == target && !negated)
        );
        const clausesContainingNegatedVar = clausesContainingVarOrNegatedVar.filter(
            clause => clause.some(({variable, negated}) => variable == target && negated)
        );

        // Apply resolution rule to all pairs
        for (let clause of clausesContainingVar) {
            for (let negatedClause of clausesContainingNegatedVar) {
                const newClause = applyResolution(clause, negatedClause, target);

                // If the clause is a tautology, it doesn't provide new info so doesn't need to be added
                if (clauseIsTautology(newClause)) continue;

                // If the clause is empty, the formula can't be satisfied
                if (newClause.length == 0) return undefined;

                remainingClauses.push(removeDuplicateVars(newClause));
            }
        }

        // Filter out all clauses containing the variable
        remainingClauses = remainingClauses.filter(clause =>
            clause.every(({variable}) => variable != target)
        );
    }

    // If no clauses remain, we have a conjunction over no items, which is a tautology
    // TODO: compute the actual variables
    return new VarCollection();
}
