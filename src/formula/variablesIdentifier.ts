import {createContextIdentifier} from "../context/createContextIdentifier";
import {IVariableCollection} from "../_types/solver/IVariableCollection";

/** An identifier to obtain the variables from the context */
export const variablesIdentifier = createContextIdentifier<IVariableCollection>(
    "variables",
    () => ({})
);
