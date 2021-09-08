import {IFormula} from "../../_types/IFormula";
import {createOperator} from "../createOperator";
import {And} from "./And";
import {Implies} from "./Implies";

/**
 * Creates a new formula by combining two formulas using bi-implication
 * @param a Formula a
 * @param b Formula b
 * @returns The formula representing the negated given formula
 */
export const BiImplies = createOperator((a: IFormula, b: IFormula) => ({
    data: {
        children: [a, b],
    },
    execute: context => a.execute(context) == b.execute(context),
    toCNF: (context, negated) =>
        And(Implies(a, b), Implies(b, a)).toCNF(context, negated),
    format: format => `${format(a)} ⇔ ${format(b)}`,
    toZ3: context => `(= ${a.toZ3(context)} ${b.toZ3(context)})`,
}));
