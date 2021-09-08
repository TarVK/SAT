import {Context} from "../context/Context";
import {And} from "../formula/constructs/And";
import {Not} from "../formula/constructs/Not";
import {Or} from "../formula/constructs/Or";
import {Variable} from "../formula/constructs/Variable";
import {genList} from "../utils/genList";

/**
 * Unsatisfiable: (and (or (and a b) (not (or b c))) (and (not c) b (not a)))
 * Satisfiable: (and (or (and a b) (not (or b c))) (and (not c) b))
 */

describe("Satisfiability checker", () => {
    const a = Variable("a");
    const b = Variable("b");
    const c = Variable("c");
    it("Should find that `((a && b) || !(b || c)) && (!c && b && !a)` isn't satisfiable", () => {
        const formula = And(Or(And(a, b), Not(Or(b, c))), And(Not(c), b, Not(a)));
        expect(formula.solve()).toEqual(undefined);
    });
    it("Should find that `((a && b) || !(b || c)) && (!c && b)` is satisfiable", () => {
        const formula = And(Or(And(a, b), Not(Or(b, c))), And(Not(c), b));
        expect(formula.solve()).toEqual({});
    });

    // Seems like the DavisPutnamSolver takes exponential time for the pigeon hole formula, runs out of memory for n > 3
    it("Should find that the pigeon hole formula isn't satisfiable", () => {
        const n = 3;
        const P = genList(n + 1, i => genList(n, j => Variable(`${i}-${j}`)));
        const C = And(...genList(n + 1, i => Or(...genList(n, j => P[i][j]))));
        const R = And(
            ...genList(n, i =>
                genList(n, j =>
                    genList({start: j + 1, end: n + 1}, k => Not(And(P[j][i], P[k][i])))
                )
            ).flat(2)
        );
        const PF = And(C, R);
        expect(PF.solve()).toEqual(undefined);
    });
});
