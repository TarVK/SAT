import {And} from "./formula/constructs/And";
import {Not} from "./formula/constructs/Not";
import {Or} from "./formula/constructs/Or";
import {Variable} from "./formula/constructs/Variable";
import {setupPrecedences} from "./formula/setupPrecedences";

setupPrecedences([[Variable], [Not], [And], [Or]]);

const formula = And(
    Or(And(Variable("a"), Variable("b")), Not(Or(Variable("b"), Variable("c")))),
    And(Not(Variable("c")), Variable("b"), Not(Variable("a")))
);

console.log(formula.format());
