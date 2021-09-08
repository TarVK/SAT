import {IFormulaInput} from "../_types/IFormulaInput";
import {IOperator} from "../_types/IOperator";
import {createFormula} from "./createFormula";

/**
 * Creates a new operator
 * @param behavior The base behavior of the formula
 * @returns The created operator
 */
export function createOperator<C extends (...args: any[]) => IFormulaInput>(
    behavior: C
): IOperator<C> {
    const This = Object.assign(
        (...args: any) =>
            createFormula({...behavior(...args), precedence: This.precedence}),
        {precedence: 0}
    );
    return This;
}
