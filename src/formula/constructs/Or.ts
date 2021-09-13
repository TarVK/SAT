import {clauseIsTautology} from "../../solver/simplifyCNFRepresentation";
import {IFormula} from "../../_types/IFormula";
import {createFormula} from "../createFormula";
import {createOperator} from "../createOperator";
import {combineSMTLIBFormulas} from "../utils/combineSMTLIBFormulas";
import {convertToCnf} from "../utils/convertToCnf";

/**
 * Creates a new formula by getting the disjunction of the given formulas
 * @param formulas The formulas to be disjuncted
 * @returns The formula representing the disjunction of the given formulas
 */
export const Or = createOperator((...formulas: IFormula[]) =>
    createFormula({
        data: {
            children: formulas,
        },
        execute: context => formulas.some(formula => formula.execute(context)),
        toCNF: context =>
            convertToCnf(
                {
                    name: "Or",
                    arity: 2,
                    truthTable: [
                        false, // false && false
                        true, // false && true
                        true, // true && false
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
                    (result, formula) => `${result} ∨ ${formula}`,
                    formattedFormulas[0] || ""
                );
        },
        toSMTLIB2: context =>
            combineSMTLIBFormulas(
                SMTformulas => ({formula: `(or ${SMTformulas.join(" ")})`}),
                formulas,
                context
            ),
    })
);
