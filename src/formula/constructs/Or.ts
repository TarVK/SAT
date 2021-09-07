import {clauseIsTautology} from "../../solver/simplifyCNFRepresentation";
import {IFormula} from "../../_types/IFormula";
import {createFormula} from "../createFormula";

/**
 * Creates a new formula by getting the disjunction of the given formulas
 * @param formulas The formulas to be disjuncted
 * @returns The formula representing the disjunction of the given formulas
 */
export const Or = (...formulas: IFormula[]): IFormula & {children: IFormula[]} =>
    createFormula({
        children: formulas,
        execute: context => formulas.some(formula => formula.execute(context)),
        toCNF: (context, negated) => {
            const formulaCNFs = formulas.map(formula => formula.toCNF(context, negated));

            if (negated) {
                // If we're negating, we're applying the demorgan rule, I.e. the result is the conjunction of `formulaCNFs` (as they are already negated when constructing their CNF)
                // Then the conjunction of CNFs is simply removing the explicit associativity
                return formulaCNFs.flat();
            } else {
                // If we're not negating we need to apply distributivity several times, resulting in the product of all CNF clauses
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
    });