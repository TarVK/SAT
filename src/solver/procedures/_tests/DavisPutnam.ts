import {DavisPutnamSolver} from "../DavisPutnamSolver";
import {
    getFullPigeonHoleFormula,
    getPartialPigeonHoleFormula,
    getSatisfiableFormula,
    getUnSatisfiableFormula,
} from "./formulas.helper";

describe("Solvers/DavisPutnam", () => {
    const satisfiable = getSatisfiableFormula();
    const unSatisfiable = getUnSatisfiableFormula();

    it(`Should find that '${unSatisfiable.name}' isn't satisfiable`, async () => {
        expect(await unSatisfiable.formula.solve(DavisPutnamSolver)).toEqual(undefined);
    });
    it(`Should find that '${satisfiable.name}' is satisfiable`, async () => {
        expect(await satisfiable.formula.solve(DavisPutnamSolver)).not.toEqual(undefined);
    });

    // Davis Putman's procedure has such an exponential blowup that even for n=2 the pigeon hole formula isn't feasible (after having applied the Tseytin transformation)
    // it("Should find that the pigeon hole formula isn't satisfiable", async () => {
    //     const PF = getFullPigeonHoleFormula(2);
    //     expect(await PF.solve(DavisPutnamSolver)).toEqual(undefined);
    // });
    // it("Should find that the partial pigeon hole formula is satisfiable", async () => {
    //     const PF = getPartialPigeonHoleFormula(2);
    //     expect(await PF.solve(DavisPutnamSolver)).not.toEqual(undefined);
    // });
});
