import {VarCollection} from "../../formula/varCollection";
import {IFormula} from "../../_types/IFormula";
import {ICNF} from "../../_types/solver/ICNF";
import {ISolveResult} from "../../_types/solver/ISolveResult";
import {applyResolution} from "../applyResolution";
import {ICNFLiteral} from "../../_types/solver/ICNF";
import {IVariableIdentifier} from "../../_types/solver/IVariableIdentifier";
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
export async function DavisPutnamSolver(formula: IFormula | ICNF): Promise<ISolveResult> {
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
    const steps = [remainingClauses];
    const varSteps: IVariableIdentifier<boolean>[] = [];
    while (remainingClauses.length > 0) {
        const target = remainingClauses[0][0].variable;
        varSteps.push(target);

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
        steps.push(remainingClauses);
    }

    // If no clauses remain, we have a conjunction over no items, which is a tautology

    // Go back through the steps to find the solution by applying unit resolution with the known variables on every clause (this algorithm is quite improvised, and may not be sound)
    const vars = new Map<IVariableIdentifier<boolean>, boolean>();
    for (let i = steps.length - 2; i >= 0; i--) {
        const formula = steps[i];
        const stepVar = varSteps[i];

        let validStepDecisionClause: ICNFLiteral[] | undefined;
        const resolve = () => {
            clause: for (let clause of formula) {
                let multipleOpen = false;
                let containsStep = false;
                let openLiteral: ICNFLiteral | undefined;
                for (let literal of clause) {
                    if (literal.variable == stepVar) containsStep = true;

                    if (vars.has(literal.variable)) {
                        // If the assignment satisfies the clause, we can't conclude anything
                        if (vars.get(literal.variable) == !literal.negated)
                            continue clause;
                    } else {
                        if (openLiteral) multipleOpen = true;
                        openLiteral = literal;
                    }
                }

                // If the clause has multiple open literals, we can't conclude anything
                if (multipleOpen) {
                    if (containsStep) validStepDecisionClause = clause;
                    continue;
                }

                if (!openLiteral)
                    throw Error(
                        "Reached a contradiction despite proving satisfiable, this shouldn't be reachable. 2"
                    );

                console.log(openLiteral.variable.name, !openLiteral.negated);
                vars.set(openLiteral.variable, !openLiteral.negated);
            }
        };
        resolve();

        // Sometimes the variable could've gone either way, in which case we need to just assign a value
        if (!vars.has(stepVar)) {
            if (!validStepDecisionClause)
                throw Error(
                    "Reached a contradiction despite proving satisfiable, this shouldn't be reachable. 1"
                );

            vars.set(
                stepVar,
                !validStepDecisionClause.find(({variable}) => variable == stepVar)
                    ?.negated
            );
            resolve();
        }
    }

    const collection = new VarCollection();
    vars.forEach((value, key) => collection.set(key, value));
    return collection;
}
