import {And} from "./formula/constructs/And";
import {BiImplies} from "./formula/constructs/BiImplies";
import {Implies} from "./formula/constructs/Implies";
import {Not} from "./formula/constructs/Not";
import {Or} from "./formula/constructs/Or";
import {Variable} from "./formula/constructs/Variable";
import {setupPrecedences} from "./formula/setupPrecedences";
import {Boolean} from "./formula/types/Boolean";
import {DPLLSolver} from "./solver/procedures/DPLLSolver";
import {genList} from "./utils/genList";
import {IVariableCollection} from "./_types/solver/IVariableCollection";

setupPrecedences([[Variable], [Not], [And], [Or], [Implies, BiImplies]]);

const a = Variable("a", Boolean);
const b = Variable("b", Boolean);
const c = Variable("c", Boolean);
// const formula = And(Or(And(a, b), Not(Or(b, c))), And(Not(c), b));
// const formula = And(Implies(a, Not(b)), a, b);
// TODO: fix when too few params are supplied
// const formula = And(And(Or(a), Or(b)), And(Not(And(a, b))));
// const formula = Implies(a, b);

const n = 4;
const P = genList(n + 1, i => genList(n, j => Variable(`${i}-${j}`, Boolean)));
const C = And(...genList(n + 1, i => Or(...genList(n, j => P[i][j]))));
const R = And(
    ...genList(n, i =>
        genList(n, j =>
            genList({start: j + 1, end: n + 1}, k => Not(And(P[j][i], P[k][i])))
        )
    ).flat(2)
);
const formula = And(C, R);

console.log(formula.format());

console.time();
formula.solve(DPLLSolver).then(res => {
    console.timeEnd();
    console.log(res);
});

// const n = 1;
// const P = genList(n + 1, i => genList(n, j => Variable(`${i}-${j}`, Boolean)));
// const C = And(...genList(n + 1, i => Or(...genList(n, j => P[i][j]))));
// const R = And(
//     ...genList(n, i =>
//         genList(n, j =>
//             genList({start: j + 1, end: n + 1}, k => Not(And(P[j][i], P[k][i])))
//         )
//     ).flat(2)
// );
// const PF = And(C, R);
// debugger;
// PF.solve().then(console.log, console.error);

// Z3Solver(`\
// ; Variable declarations
// (declare-fun a () Int)
// (declare-fun b () Int)
// (declare-fun c () Int)

// ; Constraints
// (assert (> a 0))
// (assert (> b 0))
// (assert (> c 0))
// (assert (= (+ (* a a) (* b b)) (* c c)))
// `).then(console.log, console.error);
