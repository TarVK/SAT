import {clauseIsTautology} from "../../solver/simplifyCNFRepresentation";
import {IFormula} from "../../_types/IFormula";
import {createOperator} from "../createOperator";

/**
 * Creates a new formula by getting the conjunction of the given formulas
 * @param formulas The formulas to be conjuncted
 * @returns The formula representing the conjunction of the given formulas
 */
export const And = createOperator((...formulas: IFormula[]) => ({
    data: {
        children: formulas,
    },
    execute: context => formulas.every(formula => formula.execute(context)),
    toCNF: (context, negated) => {
        const formulaCNFs = formulas.map(formula => formula.toCNF(context, negated));

        if (!negated) {
            // If we're not negating, then the conjunction of CNFs is simply removing the explicit associativity
            return formulaCNFs.flat();
        } else {
            // If we're negating, we're applying the demorgan rule, I.e. the result is the disjunction of `formulaCNFs` (as they are already negated when constructing their CNF)
            // We then need to apply distributivity several times, resulting in the product of all CNF clauses
            return formulaCNFs.reduce((result, formula) => {
                const newResult = [];
                for (let clauseA of result) {
                    for (let clauseB of formula) {
                        const newClause = [...clauseA, ...clauseB];

                        // Don't add the clause if it's redundant
                        if (clauseIsTautology(newClause)) continue;
                        newResult.push(newClause);
                    }
                }
                return newResult;
            });
        }
    },
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
}));
