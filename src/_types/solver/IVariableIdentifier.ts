import {IVariableType} from "./IVariableType";

/** A unique identifier for a variable */
export type IVariableIdentifier<T> = {
    /** The name of the variable */
    name: string;
    /** The data type of the variable */
    type: IVariableType<T>;
    /** Whether this variable was generated during CNF conversion */
    isGenerated?: boolean;
};
