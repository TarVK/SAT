import {ICNFLiteral} from "../../../_types/solver/ICNF";
import {IVariableIdentifier} from "../../../_types/solver/IVariableIdentifier";
import {Trail} from "./Trail";
import {CNF} from "./CNF";

/**
 * Performs unit resolution from the given targets
 * @param formula The formula of which to use the clauses to perform inference
 * @param trail The trail of value assignments that are presumed to hold
 * @param target The variable to start performing derivations from, which must already have a value assigned in the trail
 * @returns The contradiction clause, if any was found
 */
export function unitPropagate(
    formula: CNF,
    trail: Trail,
    target: IVariableIdentifier<boolean>[]
): ICNFLiteral[] | undefined {
    // Keep track of variables we've inferred, such that we can use them to attempt new inferences
    const propagationVars = [...target];

    while (propagationVars.length > 0) {
        const target = propagationVars.pop()!;

        /** Obtain all clauses containing !target */
        const clauses = formula.getLiteralClauses(target, trail.get(target));

        clauseLoop: for (let clause of clauses) {
            let openClauseVariable:
                | {variable: IVariableIdentifier<boolean>; negated: boolean}
                | undefined;

            for (let literal of clause) {
                if (trail.has(literal.variable)) {
                    // If the assignment makes the clause true, we can't obtain any useful data from it
                    const literalAssignment = trail.get(literal.variable);
                    const makesClauseTrue = !literalAssignment == literal.negated;
                    if (makesClauseTrue) continue clauseLoop;
                } else {
                    // If we already found an open variable, this would imply we have multiple open variables in the clause, not resulting in any new info
                    if (openClauseVariable) continue clauseLoop;
                    else openClauseVariable = literal;
                }
            }

            // If the clause isn't true, but no open variable was found, we must have a contradiction
            if (!openClauseVariable) return clause;

            // Infer the value, and add it to the trail
            const inferredValue = !openClauseVariable.negated;
            trail.set(openClauseVariable.variable, inferredValue, clause);

            propagationVars.push(openClauseVariable.variable);
        }
    }
}
