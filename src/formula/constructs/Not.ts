import {IFormula} from "../../_types/IFormula";
import {createFormula} from "../createFormula";

/**
 * Creates a new formula by negating a given formula
 * @param formula The formula to be negated
 * @returns The formula representing the negated given formula
 */
export const Not = (formula: IFormula): IFormula & {child: IFormula} =>
    createFormula({
        precedence: 2,
        child: formula,
        execute: context => !formula.execute(context),
        toCNF: (context, negated) => formula.toCNF(context, !negated),
        format: format => `¬${format(formula)}`,
    });
