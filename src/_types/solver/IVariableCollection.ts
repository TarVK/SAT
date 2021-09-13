import {IVariableIdentifier} from "./IVariableIdentifier";

// TODO: figure out how to handle values other than booleans
/** A collection of variables, and their current values */
export type IVariableCollection = {
    /**
     * Retrieves the value associated with this variable identifier
     * @param identifier The identifier of the variable to retrieve
     * @returns The value associated with this variable (could possibly be the type's default value)
     */
    get<T>(identifier: IVariableIdentifier<T>): T;

    /**
     * Sets the value for the given variable identifier
     * @param identifier The identifier of the variable to set
     * @param value The value associated with this variable
     */
    set<T>(identifier: IVariableIdentifier<T>, value: T): void;

    /**
     * Retrieves all variables that have been defined
     * @returns The variables that have received a value in this collection
     */
    getDefined(): IVariableIdentifier<any>[];
};
