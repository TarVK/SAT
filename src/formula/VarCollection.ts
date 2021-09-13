import {createContextIdentifier} from "../context/createContextIdentifier";
import {IContextIdentifier} from "../_types/context/IContextIdentifier";
import {IVariableCollection} from "../_types/solver/IVariableCollection";
import {IVariableIdentifier} from "../_types/solver/IVariableIdentifier";

export class VarCollectionClass implements IVariableCollection {
    protected vars: Map<IVariableIdentifier<any>, any> = new Map();

    /**
     * Retrieves the value associated with this variable identifier
     * @param identifier The identifier of the variable to retrieve
     * @returns The value associated with this variable (could possibly be the type's default value)
     */
    public get<T>(identifier: IVariableIdentifier<T>): T {
        if (this.vars.has(identifier)) return this.vars.get(identifier);

        return identifier.type.defaultValue;
    }

    /**
     * Sets the value for the given variable identifier
     * @param identifier The identifier of the variable to set
     * @param value The value associated with this variable
     */
    public set<T>(identifier: IVariableIdentifier<T>, value: T): void {
        this.vars.set(identifier, value);
    }

    /**
     * Retrieves all variables that have been defined
     * @returns The variables that have received a value in this collection
     */
    public getDefined(): IVariableIdentifier<any>[] {
        return [...this.vars.keys()];
    }
}

/**
 * A variable collection to store values for specified variables
 */
export const VarCollection: typeof VarCollectionClass &
    IContextIdentifier<VarCollectionClass> = Object.assign(VarCollectionClass, {
    init: () => new VarCollectionClass(),
    id: Symbol("Vars"),
});
