import {And} from "../formula/constructs/And";
import {Not} from "../formula/constructs/Not";
import {Or} from "../formula/constructs/Or";
import {Variable} from "../formula/constructs/Variable";
import {Boolean} from "../formula/types/Boolean";
import {genList} from "../utils/genList";

/**
 * Unsatisfiable: (and (or (and a b) (not (or b c))) (and (not c) b (not a)))
 * Satisfiable: (and (or (and a b) (not (or b c))) (and (not c) b))
 */

describe("Satisfiability checker", () => {
    const a = Variable("a", Boolean);
    const b = Variable("b", Boolean);
    const c = Variable("c", Boolean);
    it("Should find that `((a && b) || !(b || c)) && (!c && b && !a)` isn't satisfiable", async () => {
        const formula = And(Or(And(a, b), Not(Or(b, c))), And(Not(c), b, Not(a)));
        expect(await formula.solve()).toEqual(undefined);
    });
    it("Should find that `((a && b) || !(b || c)) && (!c && b)` is satisfiable", async () => {
        const formula = And(Or(And(a, b), Not(Or(b, c))), And(Not(c), b));
        expect(await formula.solve()).not.toEqual(undefined);
    });

    it("Should find that the pigeon hole formula isn't satisfiable", async () => {
        const n = 2; // Keep n small, since it's exponential
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
        expect(await PF.solve()).toEqual(undefined);
    });
});
