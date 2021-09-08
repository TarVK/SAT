import {IFormula} from "../../_types/IFormula";
import {createOperator} from "../createOperator";
import {Not} from "./Not";
import {Or} from "./Or";

/**
 * Creates a new formula by combining two formulas using implication
 * @param premise The premise of the implication
 * @param conclusion The conclusion of the implication
 * @returns The formula representing the negated given formula
 */
export const Implies = createOperator((premise: IFormula, conclusion: IFormula) => ({
    data: {
        premise,
        conclusion,
    },
    execute: context => !premise.execute(context) || conclusion.execute(context),
    toCNF: (context, negated) => Or(Not(premise), conclusion).toCNF(context, negated),
    format: format => `${format(premise)} ⇒ ${format(conclusion)}`,
    toZ3: context => `(=> ${premise.toZ3(context)} ${conclusion.toZ3(context)})`,
}));
