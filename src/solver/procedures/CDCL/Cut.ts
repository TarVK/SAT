import {ICNFLiteral} from "../../../_types/solver/ICNF";
import {IVariableIdentifier} from "../../../_types/solver/IVariableIdentifier";
import {Trail} from "./Trail";

/**
 * The cut represented by all variables that have edges going through the cut, leading to the other side of the cut
 */
export class Cut {
    protected variables: IVariableIdentifier<boolean>[] = [];
    protected trail: Trail;

    /**
     * Creates a new cut for the given trail
     * @param initial The initial cut
     * @param trail The trail to get the dependency graph from
     */
    public constructor(initial: IVariableIdentifier<boolean>[], trail: Trail) {
        this.trail = trail;
        initial.forEach(variable => this.add(variable));
    }

    /**
     * Retrieves the last variable in the trail that's part of this current cut
     * @returns The latest variable in the trial that's part of the cut
     */
    public getLast(): IVariableIdentifier<boolean> {
        return this.variables[this.variables.length - 1];
    }

    /**
     * Removes the given variable from the cut
     * @param variable The variable to be removed from the cut
     */
    public remove(variable: IVariableIdentifier<boolean>): void {
        if (this.variables.length == 0)
            throw Error(
                "Variable can not be removed from the cut, since that would leave the cut empty (which doesn't make semantical sense)"
            );

        this.variables = this.variables.filter(v => v != variable);
    }

    /**
     * Adds the given variable to the cut
     * @param variable The variable to be added to the cut
     */
    public add(variable: IVariableIdentifier<boolean>): void {
        const index = this.trail.getIndex(variable);
        for (let i = 0; i < this.variables.length; i++) {
            const compareIndex = this.trail.getIndex(this.variables[i]);
            if (compareIndex == index) return; // The variable must already abe part of the cut

            // If the index is smaller than the index
            if (index < compareIndex) {
                this.variables.splice(i, 0, variable);
                return;
            }
        }

        this.variables.push(variable);
    }

    /**
     * Checks whether the given variable is already part of this cut
     * @param variable The variable to check for whether it's part of the cut
     * @returns Whether the variable is part of the cut
     */
    public has(variable: IVariableIdentifier<boolean>): boolean {
        return this.variables.includes(variable);
    }

    /**
     * Retrieves all the variables that are currently part of the cut
     * @returns All the variables currently part of the cut
     */
    public get(): readonly IVariableIdentifier<boolean>[] {
        return this.variables;
    }
}
