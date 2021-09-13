import {IFormula} from "../../_types/IFormula";
import {IFormulaInput} from "../../_types/IFormulaInput";
import {IVariableIdentifier} from "../../_types/solver/IVariableIdentifier";
import {IVariableType} from "../../_types/solver/IVariableType";
import {createFormula} from "../createFormula";
import {createOperator} from "../createOperator";
import {VarCollection} from "../varCollection";

/**
 * Creates a new variable
 * @param name The name of the variable
 * @param type The type of the variable
 * @returns The formula representing this variable, including an identifier for this variable
 */
export const Variable = createOperator(<T>(name: string, type: IVariableType<T>) => {
    const This: IFormula<T> & IVariableIdentifier<T> = createFormula({
        data: {name, type},
        execute: context => {
            const variables = context.get(VarCollection);
            return variables.get(This as any as IVariableIdentifier<T>);
        },
        toCNF: () => {
            if (typeof type.defaultValue != "boolean")
                throw new Error("Only boolean variables are supported so far");
            return {cnf: [], variable: This as any as IVariableIdentifier<boolean>};
        },
        format: () => name,
        toSMTLIB2: context => {
            const variables = context.get(VarCollection);

            // TODO: try to rename variables when duplicates are found
            const duplicate = variables
                .getDefined()
                .find(variable => variable.name == name && variable != This);
            if (duplicate)
                throw Error(
                    `Duplicate variable declaration found! A variable with the name ${name} was found`
                );

            return {
                formula: name,
                variables: new Set([This]),
            };
        },
    });
    return This;
});
