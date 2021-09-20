import {IFormula} from "../../../_types/IFormula";
import {ICNF} from "../../../_types/solver/ICNF";
import {ISolveResult} from "../../../_types/solver/ISolveResult";
import {simplifyCNFRepresentation} from "../../simplifyCNFRepresentation";
import {analyzeConflict} from "./analyzeConflict";
import {CNF} from "./CNF";
import {getFirstDecisionVar} from "./getFirstDecisionVar";
import {Trail} from "./Trail";
import {unitPropagate} from "./unitPropagate";

/**
 * Solves the satisfiability problem using a basic CDCL implementation
 *
 * Some good resources to learn about this algorithm:
 * - https://en.wikipedia.org/wiki/Conflict-driven_clause_learning#CDCL_(conflict-driven_clause_learning)
 * - https://cse442-17f.github.io/Conflict-Driven-Clause-Learning/
 * - https://users.aalto.fi/~tjunttil/2020-DP-AUT/notes-sat/cdcl.html
 * @param formula The formula to be solved
 * @returns The found assignment, or undefined if no assignment exists
 */
export async function CDCLSolver(formula: IFormula | ICNF): Promise<ISolveResult> {
    let rawCnf: ICNF;
    if ("toCNF" in formula) {
        const {cnf: formulaCnf, variable} = formula.toCNF();
        rawCnf = [...formulaCnf, [{variable, negated: false}]];
    } else {
        rawCnf = formula;
    }

    // Create the trail and CNF variables to operate on
    const trail = new Trail();
    const cnf = new CNF(simplifyCNFRepresentation(rawCnf));

    // Perform an initial unit resolution without propagation
    const initialUnitClauses = rawCnf
        .filter(clause => clause.length == 1)
        .map(clause => ({clause, literal: clause[0]}));
    for (let {
        clause,
        literal: {variable, negated},
    } of initialUnitClauses)
        trail.set(variable, !negated, clause);
    const initialVars = initialUnitClauses.map(({literal: {variable}}) => variable);

    // Iterate while not reaching a solution or conflict
    let prevChangesToPropagate = initialVars;
    while (true) {
        const conflict = unitPropagate(cnf, trail, prevChangesToPropagate);
        if (conflict) {
            const latestDecisionVariable = trail.getLatestDecisionVariable();
            if (!latestDecisionVariable) return undefined; // If there is no decision variable but there's a conflict the formula isn't satisfiable

            const newClause = analyzeConflict(trail, conflict);
            cnf.addClause(newClause);

            const firstDecisionVar = getFirstDecisionVar(
                newClause.map(({variable}) => variable),
                trail
            );
        } else {
        }
    }
}
