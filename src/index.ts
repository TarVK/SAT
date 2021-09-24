import {Context} from "./context/Context";
import {Bool} from "./formula/types/Bool";
import {VarCollection} from "./formula/varCollection";
import {CDCLSolver} from "./solver/procedures/CDCL/CDCLSolver";
import {DPLLSolver} from "./solver/procedures/DPLLSolver";
import {getPartialPigeonHoleFormula} from "./solver/procedures/_tests/formulas.helper";
import {genList} from "./utils/genList";
import {IVariableCollection} from "./_types/solver/IVariableCollection";
import {And, Not, Or, parse, Variable} from "./formula/defaultLanguage";
import {IFormula} from "./_types/IFormula";

// const a = Variable("a", Bool);
// const b = Variable("b", Bool);
// const c = Variable("c", Bool);
// const formula = And(Or(And(a, b), Not(Or(b, c))), And(Not(c), b));
// // const formula = And(Implies(a, Not(b)), a, b);
// // TODO: fix when too few params are supplied
// // const formula = And(And(Or(a), Or(b)), And(Not(And(a, b))));
// // const formula = Implies(a, b);

// formula.solve().then(console.log);
const result = parse("((a && b) || !(b || c)) && (!c && b && !a)");
if (result.status) {
    const formula = result.value;
    console.log(formula.format());

    formula.solve().then(solution => {
        if (solution) logResult(formula, solution);
        else console.log("unsatisfiable");
    });
} else console.log(result);

function logResult(formula: IFormula, solution: IVariableCollection) {
    const result = [...formula.toSMTLIB2().variables].map(v => ({
        var: v.name,
        val: solution.get(v),
    }));
    console.log(result);
}

// const formula = getPartialPigeonHoleFormula(8);

// // console.log(formula.format());

// console.time();
// formula.solve(CDCLSolver).then(res => {
//     console.timeEnd();
//     console.log(res);
//     if (res)
//         console.log(
//             "Correct:",
//             formula.execute(new Context().augment(VarCollection, res))
//         );
// });

// const a = Variable("a", Bool);
// const b = Variable("b", Bool);

// const unsatisfiableFormula = And(a, Not(a));
// const satisfiableFormula = And(Or(a, Not(b)), Or(Not(a), b), a);

// (async () => {
//     const result1 = await unsatisfiableFormula.solve();
//     console.log(result1); // undefined

//     const result2 = await satisfiableFormula.solve();
//     if (result2) console.log(result2.get(a), result2.get(b)); // true, true
// })();
