import {IVariableIdentifier} from "./IVariableIdentifier";

// TODO: figure out how to handle values other than booleans
/** A collection of variables, and their current values */
export type IVariableCollection = Record<IVariableIdentifier, boolean | number>;
