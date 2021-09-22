import {DPLLSolver} from "../DPLLSolver";
import {
    getFullPigeonHoleFormula,
    getPartialPigeonHoleFormula,
    getSatisfiableFormula,
    getUnSatisfiableFormula,
} from "./formulas.helper";

describe("Solvers/DPLL", () => {
    const satisfiable = getSatisfiableFormula();
    const unSatisfiable = getUnSatisfiableFormula();

    it(`Should find that '${unSatisfiable.name}' isn't satisfiable`, async () => {
        expect(await unSatisfiable.formula.solve(DPLLSolver)).toEqual(undefined);
    });
    it(`Should find that '${satisfiable.name}' is satisfiable`, async () => {
        expect(await satisfiable.formula.solve(DPLLSolver)).not.toEqual(undefined);
    });

    it("Should find that the pigeon hole formula isn't satisfiable", async () => {
        const PF = getFullPigeonHoleFormula(2);
        expect(await PF.solve(DPLLSolver)).toEqual(undefined);
    });
    it("Should find that the partial pigeon hole formula is satisfiable", async () => {
        const PF = getPartialPigeonHoleFormula(2);
        expect(await PF.solve(DPLLSolver)).not.toEqual(undefined);
    });
});
