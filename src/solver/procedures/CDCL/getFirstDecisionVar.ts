import {ICNFLiteral} from "../../../_types/solver/ICNF";
import {IVariableIdentifier} from "../../../_types/solver/IVariableIdentifier";
import {Trail} from "./Trail";

/**
 * Retrieves the first decision variable that is responsible for the assignment of any of the passed variables
 * @param variables The variables for which to retrieve the first decision variable
 * @param trail The trail to use to obtain the data from
 * @returns The first decision variable if any exists
 */
export function getFirstDecisionVar(
    variables: IVariableIdentifier<boolean>[],
    trail: Trail
): IVariableIdentifier<boolean> | undefined {
    const allDecisionVariables = new Set([
        ...variables.flatMap(variable => [
            ...(trail.getCause(variable)?.decisionVars ?? []),
        ]),
    ]);

    // Find the first of the decision variables
    let firstDecisionVariable: IVariableIdentifier<boolean> | undefined;
    let firstIndex = Infinity;

    for (let decisionVariable of allDecisionVariables) {
        const index = trail.getIndex(decisionVariable);
        if (index < firstIndex) {
            firstIndex = index;
            firstDecisionVariable = decisionVariable;
        }
    }

    return firstDecisionVariable;
}
