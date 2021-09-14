import {ICNF, ICNFLiteral} from "../_types/solver/ICNF";

/**
 * Applies unit resolution in the given formula
 * @param formula The formula to apply the resolution in
 * @returns The same formula where unit resolution has been performed
 */
export function applyUnitResolution(formula: ICNF): ICNF {
    const newFormula: (ICNFLiteral[] | undefined)[] = [...formula];
    for (let i = 0; i < newFormula.length; i++) {
        const clause = newFormula[i];
        if (!clause) continue;

        const isUnitClause = clause.length == 1;
        if (!isUnitClause) continue;

        const {variable, negated} = clause[0];
        for (let j = 0; j < newFormula.length; j++) {
            if (j == i) continue;

            const clause2 = newFormula[j];
            if (!clause2) continue;

            const match = clause2.find(({variable: v}) => variable == v);
            if (match) {
                // If the clause is an extension of the found unit clause, it's redundant and can be removed
                if (match.negated == negated) newFormula[j] = undefined;
                // If the clause contains a negation of the found unit clause, that negation can be removed
                else newFormula.push(clause2.filter(({variable: v}) => variable != v));
            }
        }
    }

    return newFormula.filter((clause): clause is ICNFLiteral[] => !!clause);
}
