import {And} from "../../../formula/constructs/And";
import {Not} from "../../../formula/constructs/Not";
import {Or} from "../../../formula/constructs/Or";
import {Variable} from "../../../formula/constructs/Variable";
import {Boolean} from "../../../formula/types/Boolean";
import {genList} from "../../../utils/genList";

/**
 * Unsatisfiable: (and (or (and a b) (not (or b c))) (and (not c) b (not a)))
 * Satisfiable: (and (or (and a b) (not (or b c))) (and (not c) b))
 */

export function getUnSatisfiableFormula() {
    const a = Variable("a", Boolean);
    const b = Variable("b", Boolean);
    const c = Variable("c", Boolean);

    return {
        name: "((a && b) || !(b || c)) && (!c && b && !a)",
        formula: And(Or(And(a, b), Not(Or(b, c))), And(Not(c), b, Not(a))),
    };
}

export function getSatisfiableFormula() {
    const a = Variable("a", Boolean);
    const b = Variable("b", Boolean);
    const c = Variable("c", Boolean);

    return {
        name: "((a && b) || !(b || c)) && (!c && b)",
        formula: And(Or(And(a, b), Not(Or(b, c))), And(Not(c), b)),
    };
}

/**
 * The pigeon hole formula, which isn't satisfiable (because it expresses the pigeon hole argument/principle)
 * @param n The size of the formula
 * @returns The formula
 */
export function getFullPigeonHoleFormula(n: number) {
    const P = genList(n + 1, i => genList(n, j => Variable(`${i}-${j}`, Boolean)));
    const C = And(...genList(n + 1, i => Or(...genList(n, j => P[i][j]))));
    const R = And(
        ...genList(n, i =>
            genList(n, j =>
                genList({start: j + 1, end: n + 1}, k => Not(And(P[j][i], P[k][i])))
            )
        ).flat(2)
    );
    const PF = And(C, R);
    return PF;
}

/**
 * Retrieves the pigeon hole formula with 1 constraint removed, making it satisfiable
 * @param n The size of the formula
 * @returns The formula
 */
export function getPartialPigeonHoleFormula(n: number) {
    const P = genList(n + 1, i => genList(n, j => Variable(`${i}-${j}`, Boolean)));
    const C = And(...genList(n + 1, i => Or(...genList(n, j => P[i][j]))));
    const R = And(
        ...genList(n, i =>
            genList(n, j =>
                genList({start: j + 1, end: n + 1}, k => Not(And(P[j][i], P[k][i])))
            )
        )
            .flat(2)
            .slice(1)
    );
    const PF = And(C, R);
    return PF;
}
