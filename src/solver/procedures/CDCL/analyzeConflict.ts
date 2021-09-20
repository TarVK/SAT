import {ICNFLiteral} from "../../../_types/solver/ICNF";
import {Cut} from "./Cut";
import {Trail} from "./Trail";

/**
 * Analyzes the conflict and finds the clause to prevent it
 * @param trail The trail to find a new clause in
 * @param conflict The conflict that occurred that should be prevented in the future
 * @returns The clause to prevent the conflict
 */
export function analyzeConflict(trail: Trail, conflict: ICNFLiteral[]): ICNFLiteral[] {
    const cut = new Cut(
        conflict.map(({variable}) => variable),
        trail
    );
    const latestDecisionVariable = trail.getLatestDecisionVariable();

    if (!latestDecisionVariable)
        throw Error(
            "Conflict analysis is redundant if a conflict occurs without any decisions"
        );

    // Keep track of how many variables in the cut were derived from the latest decision variable
    let decisionVarCount = conflict.reduce(
        (count, {variable}) =>
            trail.getCause(variable)?.decisionVars.has(latestDecisionVariable)
                ? count + 1
                : count,
        0
    );

    // Move the cut back as long as there isn't a single unique variable that was implied by the latest decision variable in the cut, to obtain the first UIP cut
    while (decisionVarCount > 1) {
        const lastCutVariable = cut.getLast();
        const cause = trail.getCause(lastCutVariable)!; // Logically we know there must be a cause, since if there isn't we already reached a decision variable, and thus decisionVarCount must have been 1

        if (cause.decisionVars.has(latestDecisionVariable)) decisionVarCount--;

        for (let {variable: dependant} of cause.clause) {
            if (dependant == lastCutVariable) continue;
            if (cut.has(dependant)) continue;

            cut.add(dependant);
            if (trail.getCause(dependant)?.decisionVars.has(latestDecisionVariable))
                decisionVarCount++;
        }
    }

    // Given the first UIP cut, formulate a new CNF literal to prevent the encountered contradiction
    const preventionClause = cut
        .get()
        .map(variable => ({variable, negated: trail.get(variable)}));
    return preventionClause;
}
