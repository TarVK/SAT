import {IFormula} from "../../_types/IFormula";
import {createOperator} from "../createOperator";

/**
 * Creates a new formula by negating a given formula
 * @param formula The formula to be negated
 * @returns The formula representing the negated given formula
 */
export const Not = createOperator((formula: IFormula) => ({
    data: {
        child: formula,
    },
    precedence: 2,
    execute: context => !formula.execute(context),
    toCNF: (context, negated) => formula.toCNF(context, !negated),
    format: format => `¬${format(formula)}`,
    toZ3: context => `(not ${formula.toZ3(context)})`,
}));
