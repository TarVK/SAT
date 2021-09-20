import {ICNFLiteral} from "../../../_types/solver/ICNF";
import {IVariableIdentifier} from "../../../_types/solver/IVariableIdentifier";

export class Trail {
    protected trail: {
        /** The variable itself */
        variable: IVariableIdentifier<boolean>;
        /** The clause that caused this variable to be true, or undefined if this is a decision variable */
        clause?: ICNFLiteral[];
    }[] = [];

    protected currentVars: Map<IVariableIdentifier<boolean>, boolean> = new Map();

    /**
     * Checks whether the trail has an assignment for the specified variable
     * @param variable The variable to check
     * @return sWhether the trail has an assignment for the variable
     */
    public has(variable: IVariableIdentifier<boolean>): boolean {
        // TODO:
    }

    /**
     * Retrieves the value for a given variable, assuming the trail has the variable
     * @param variable The variable to retrieve the assignment of
     * @return Either the assignment of the variable if this.has(variable), or false otherwise
     */
    public get(variable: IVariableIdentifier<boolean>): boolean {
        // TODO:
    }

    /**
     * Retrieves a clause from which the variable was implied, if it wasn't a decision variable
     * @param variable The variable to retrieve the causal clause for
     * @returns Either the clause from which the value was implied and all decision variables that were responsible, or undefined
     */
    public getCause(variable: IVariableIdentifier<boolean>):
        | {
              /** The clause from which the passed variable was derived */
              clause: ICNFLiteral[];
              /** All the decision variables that lead up to this derivation (were required for it) */
              decisionVars: Set<IVariableIdentifier<boolean>>;
              //   /** The latest variable that got assigned in the clause before deriving the passed variable */
              //   latestClauseVariable: ICNFLiteral;
          }
        | undefined {
        // TODO:
    }

    /**
     * Retrieves the index that this variable has within the trail
     * @param variable The variable to retrieve the index for
     * @returns The index that the variable has if it's in the trail, or -1 otherwise
     */
    public getIndex(variable: IVariableIdentifier<boolean>): number {
        // TODO:
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
        // TODO:
    }

    /**
     * Retrieves the latest decision variable that's part of the trail
     * @returns Either the latest decision variable, or undefined if there's no such variable
     */
    public getLatestDecisionVariable(): IVariableIdentifier<boolean> | undefined {
        // TODO:
    }
}
