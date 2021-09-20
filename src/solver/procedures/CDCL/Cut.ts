import {ICNFLiteral} from "../../../_types/solver/ICNF";
import {IVariableIdentifier} from "../../../_types/solver/IVariableIdentifier";
import {Trail} from "./Trail";

/**
 * The cut represented by all variables that have edges going through the cut, leading to the other side of the cut
 */
export class Cut {
    /**
     * Creates a new cut for the given trail
     * @param initial The initial cut
     * @param trail The trail to get the dependency graph from
     */
    public constructor(initial: IVariableIdentifier<boolean>[], trail: Trail) {
        // TODO:
    }

    /**
     * Retrieves the last variable in the trail that's part of this current cut
     * @returns The latest variable in the trial that's part of the cut
     */
    public getLast(): IVariableIdentifier<boolean> {
        // TODO:
    }

    /**
     * Removes the given variable from the cut
     * @param variable The variable to be removed from the cut
     */
    public remove(variable: IVariableIdentifier<boolean>): void {
        // TODO:
    }

    /**
     * Adds the given variable to the cut
     * @param variable The variable to be added to the cut
     */
    public add(variable: IVariableIdentifier<boolean>): void {
        // TODO:
    }

    /**
     * Checks whether the given variable is already part of this cut
     * @param variable The variable to check for whether it's part of the cut
     * @returns Whether the variable is part of the cut
     */
    public has(variable: IVariableIdentifier<boolean>): boolean {
        // TODO:
    }

    /**
     * Retrieves all the variables that are currently part of the cut
     * @returns All the variables currently part of the cut
     */
    public get(): IVariableIdentifier<boolean>[] {
        // TODO:
    }
}
