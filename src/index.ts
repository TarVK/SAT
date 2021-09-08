import {And} from "./formula/constructs/And";
import {Not} from "./formula/constructs/Not";
import {Or} from "./formula/constructs/Or";
import {Variable} from "./formula/constructs/Variable";
import {setupPrecedences} from "./formula/setupPrecedences";
import {Z3Solver} from "./solver/procedures/Z3Solver";
import {genList} from "./utils/genList";
import {IVariableCollection} from "./_types/solver/IVariableCollection";

setupPrecedences([[Variable], [Not], [And], [Or]]);

const formula = And(
    Or(And(Variable("a"), Variable("b")), Not(Or(Variable("b"), Variable("c")))),
    And(Not(Variable("c")), Variable("b"), Not(Variable("a")))
);

// console.log(formula.toZ3());

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
