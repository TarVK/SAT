import {VarCollection} from "../../formula/varCollection";
import {IFormula} from "../../_types/IFormula";
import {ICNF} from "../../_types/solver/ICNF";
import {ISolveResult} from "../../_types/solver/ISolveResult";
import {applyUnitResolution} from "../applyUnitResolution";

/**
 * Solves the satisfiability problem using a simple (inefficient) implementation of DPLL method
 * @param formula The formula to be solved
 * @returns The found assignment, or undefined if no assignment exists
 */
export async function DPLLSolver(formula: IFormula | ICNF): Promise<ISolveResult> {
    let cnf: ICNF;
    if ("toCNF" in formula) {
        const {cnf: formulaCnf, variable} = formula.toCNF();
        cnf = [...formulaCnf, [{variable, negated: false}]];
    } else {
        cnf = formula;
    }

    return DPLLRec(cnf);
}

export function DPLLRec(formula: ICNF): ISolveResult {
    formula = applyUnitResolution(formula);

    const allLiterals = formula.every(clause => clause.length == 1);
    if (allLiterals) {
        const result = new VarCollection();
        formula.forEach(([literal]) => result.set(literal.variable, !literal.negated));
        return result;
    }

    const containsEmptyClause = formula.some(clause => clause.length == 0);
    if (containsEmptyClause) return undefined;

    const variables = formula
        .filter(clause => clause.length == 1)
        .map(([{variable}]) => variable);
    const unassignedVariable = formula
        .flat()
        .find(({variable}) => !variables.includes(variable));
    if (!unassignedVariable) return undefined;

    return (
        DPLLRec([
            ...formula,
            [{variable: unassignedVariable.variable, negated: false}],
        ]) ||
        DPLLRec([...formula, [{variable: unassignedVariable.variable, negated: true}]])
    );
}

// type INode = {
//     guessedBariable:
// }
