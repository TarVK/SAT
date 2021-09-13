import {IFormula} from "../../_types/IFormula";
import {createFormula} from "../createFormula";
import {createOperator} from "../createOperator";
import {combineSMTLIBFormulas} from "../utils/combineSMTLIBFormulas";
import {convertToCnf} from "../utils/convertToCnf";

/**
 * Creates a new formula by combining two formulas using implication
 * @param Formulas The premise and conclusion (possibly chained)
 * @returns The formula representing the negated given formula
 */
export const Implies = createOperator((...formulas: IFormula[]) =>
    createFormula({
        data: {
            children: formulas,
        },
        execute: context =>
            formulas
                .slice(1)
                .reduce((a, b) => !a || b.execute(context), formulas[0].execute(context)),
        toCNF: context =>
            convertToCnf(
                {
                    name: "Implies",
                    arity: 2,
                    truthTable: [
                        true, // false && false
                        true, // false && true
                        false, // true && false
                        true, // true && true
                    ],
                },
                formulas,
                context
            ),
        format: format => {
            const formattedFormulas = formulas
                .map(formula => format(formula))
                .filter(text => text.length > 0);
            return formattedFormulas
                .slice(1)
                .reduce(
                    (result, formula) => `${result} ⇒ ${formula}`,
                    formattedFormulas[0] || ""
                );
        },
        toSMTLIB2: context =>
            combineSMTLIBFormulas(
                SMTformulas => ({formula: `(=> ${SMTformulas.join(" ")})`}),
                formulas,
                context
            ),
    })
);
