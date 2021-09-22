import {ICNFLiteral} from "../../../_types/solver/ICNF";
import {IVariableIdentifier} from "../../../_types/solver/IVariableIdentifier";

export class Trail {
    protected trail: IVariableIdentifier<boolean>[] = [];
    protected decisionTrail: IVariableIdentifier<boolean>[] = []; // Trail that only includes decision variable

    protected currentVars: Map<
        IVariableIdentifier<boolean>,
        {
            /** The current value that the variable has within this trail */
            value: boolean;
            /** The clause that this variable got inferred from, if any */
            clause?: ICNFLiteral[];
            /** All the decision variables that lead up to this derivation (were required for it), includes itself if this is a decision variable */
            decisionVars: Set<IVariableIdentifier<boolean>>;
            /** The index that this variable has within the trail */
            index: number;
        }
    > = new Map();
    protected availableVars: Set<IVariableIdentifier<boolean>>;

    /**
     * Creates a new trail that should eventually contain all the specified variables
     * @param variables THe variables
     */
    public constructor(variables: Set<IVariableIdentifier<boolean>>) {
        this.availableVars = new Set(variables);
    }

    /**
     * Checks whether the trail has an assignment for the specified variable
     * @param variable The variable to check
     * @return sWhether the trail has an assignment for the variable
     */
    public has(variable: IVariableIdentifier<boolean>): boolean {
        return this.currentVars.has(variable);
    }

    /**
     * Retrieves the value for a given variable, assuming the trail has the variable
     * @param variable The variable to retrieve the assignment of
     * @return Either the assignment of the variable if this.has(variable), or false otherwise
     */
    public get(variable: IVariableIdentifier<boolean>): boolean {
        return this.currentVars.get(variable)?.value ?? false;
    }

    /**
     * Retrieves a clause from which the variable was implied, if it wasn't a decision variable
     * @param variable The variable to retrieve the causal clause for
     * @returns The decision variables that are responsible for the truthiness (a decision variable includes itself in the decision variables), and the clause the value got derived from if the variable isn't a decision variable, or undefined if the trail doesn't contain the variable
     */
    public getCause(variable: IVariableIdentifier<boolean>):
        | {
              /** The clause from which the passed variable was derived */
              clause?: ICNFLiteral[];
              /** All the decision variables that lead up to this derivation (were required for it) */
              decisionVars: Set<IVariableIdentifier<boolean>>;
          }
        | undefined {
        const varData = this.currentVars.get(variable);
        if (varData)
            return {
                clause: varData.clause,
                decisionVars: varData.decisionVars,
            };
    }

    /**
     * Retrieves the index that this variable has within the trail
     * @param variable The variable to retrieve the index for
     * @returns The index that the variable has if it's in the trail, or -1 otherwise
     */
    public getIndex(variable: IVariableIdentifier<boolean>): number {
        return this.currentVars.get(variable)?.index ?? -1;
    }

    /**
     * Assigns the variable a value in this trail
     * @param variable The variable to assign a value
     * @param value The value to be assigned
     * @param clause The clause that the value was derived from, if any
     */
    public set(
        variable: IVariableIdentifier<boolean>,
        value: boolean,
        clause?: ICNFLiteral[]
    ): void {
        const index = this.trail.length;
        this.trail.push(variable);

        let decisionVars: Set<IVariableIdentifier<boolean>>;
        if (clause) {
            decisionVars = new Set(
                clause.flatMap(({variable}) => [
                    ...(this.currentVars.get(variable)?.decisionVars ?? []),
                ])
            );
        } else {
            decisionVars = new Set([variable]);
            this.decisionTrail.push(variable);
        }

        this.availableVars.delete(variable);
        this.currentVars.set(variable, {value, index, clause, decisionVars});
    }

    /**
     * Retrieves the latest decision variable that's part of the trail
     * @returns Either the latest decision variable, or undefined if there's no such variable
     */
    public getLatestDecisionVariable(): IVariableIdentifier<boolean> | undefined {
        return this.decisionTrail[this.decisionTrail.length - 1];
    }

    /**
     * Jumps back to the highest decision level where the given clause is still a unit clause
     * @param clause The clause that should remain a unit clause while jumping back
     * @remark I found the precise definition of how to perform the jump at the end of chapter 3.2 of this paper: https://www21.in.tum.de/teaching/sar/SS20/1.pdf (though it's quite logical in hindsight)
     */
    public jumpTo(clause: ICNFLiteral[]): void {
        const variableIndices = clause
            .map(({variable}) => this.getIndex(variable))
            .sort((a, b) => a - b);

        // Get the second highest index, since as long as that variable is part of the trail, the clause is a unit clause
        const secondLastIndex = variableIndices[variableIndices.length - 2] ?? 0;

        // Drop all decision variables that occur after the second last index
        let latestDecision: IVariableIdentifier<boolean> | undefined;
        while (
            (latestDecision = this.getLatestDecisionVariable()) &&
            this.getIndex(latestDecision) > secondLastIndex
        ) {
            // Drop all variables until we reach the latest at the end of trail until we hit latest decision
            let droppedDecision = false;
            while (!droppedDecision) {
                const top = this.trail.pop()!;

                // Properly dispose of the variable
                this.currentVars.delete(top);
                this.availableVars.add(top);
                if (this.decisionTrail[this.decisionTrail.length - 1] == top)
                    this.decisionTrail.pop();

                droppedDecision = top == latestDecision;
            }
        }
    }

    /**
     * Retrieves all variables that haven't been assigned in the trail yet
     * @returns A set of the currently free variables
     */
    public getFreeVariables(): Set<IVariableIdentifier<boolean>> {
        return this.availableVars;
    }

    /**
     * Returns the current state of the trail in string form
     */
    public toString(): string {
        return this.trail
            .map(
                variable =>
                    `${this.getCause(variable)?.clause ? "" : " >"}${
                        this.get(variable) ? "" : "!"
                    }${variable.name}`
            )
            .join(",");
    }
}
