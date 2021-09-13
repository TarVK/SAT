import {IFormula} from "../_types/IFormula";
import {IOperator} from "../_types/IOperator";

/**
 * Creates a new operator
 * @param behavior The base behavior of the formula
 * @returns The created operator
 */
export function createOperator<C extends (...args: any[]) => IFormula>(
    behavior: C
): IOperator<C> {
    const This = Object.assign(
        (...args: any) => {
            const formula = behavior(...args);
            formula.precedence = This.precedence;
            return formula;
        },
        {precedence: 0}
    );
    return This as any;
}
