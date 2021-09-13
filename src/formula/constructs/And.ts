import {IFormula} from "../../_types/IFormula";
import {convertToCnf} from "../utils/convertToCnf";
import {createFormula} from "../createFormula";
import {createOperator} from "../createOperator";
import {combineSMTLIBFormulas} from "../utils/combineSMTLIBFormulas";

/**
 * Creates a new formula by getting the conjunction of the given formulas
 * @param formulas The formulas to be conjuncted
 * @returns The formula representing the conjunction of the given formulas
 */
export const And = createOperator((...formulas: IFormula[]) =>
    createFormula({
        data: {
            children: formulas,
        },
        execute: context => formulas.every(formula => formula.execute(context)),
        toCNF: context =>
            convertToCnf(
                {
                    name: "And",
                    arity: 2,
                    truthTable: [
                        false, // false && false
                        false, // false && true
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
                    (result, formula) => `${result} ∧ ${formula}`,
                    formattedFormulas[0] || ""
                );
        },
        toSMTLIB2: context =>
            combineSMTLIBFormulas(
                SMTformulas => ({formula: `(and ${SMTformulas.join(" ")})`}),
                formulas,
                context
            ),
    })
);
