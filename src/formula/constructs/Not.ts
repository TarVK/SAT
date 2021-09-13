import {IFormula} from "../../_types/IFormula";
import {createFormula} from "../createFormula";
import {createOperator} from "../createOperator";
import {combineSMTLIBFormulas} from "../utils/combineSMTLIBFormulas";
import {convertToCnf} from "../utils/convertToCnf";

/**
 * Creates a new formula by negating a given formula
 * @param formula The formula to be negated
 * @returns The formula representing the negated given formula
 */
export const Not = createOperator((formula: IFormula) =>
    createFormula({
        data: {
            child: formula,
        },
        execute: context => !formula.execute(context),
        toCNF: context =>
            convertToCnf(
                {
                    name: "Not",
                    arity: 1,
                    truthTable: [
                        true, // false
                        false, // true
                    ],
                },
                [formula],
                context
            ),
        format: format => `¬${format(formula)}`,
        toSMTLIB2: context =>
            combineSMTLIBFormulas(
                SMTformulas => ({formula: `(not ${SMTformulas.join(" ")})`}),
                [formula],
                context
            ),
    })
);
