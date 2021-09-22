import {CDCLSolver} from "../CDCL/CDCLSolver";
import {
    getFullPigeonHoleFormula,
    getPartialPigeonHoleFormula,
    getSatisfiableFormula,
    getUnSatisfiableFormula,
} from "./formulas.helper";

describe("Solvers/CDCL", () => {
    const satisfiable = getSatisfiableFormula();
    const unSatisfiable = getUnSatisfiableFormula();

    it(`Should find that '${unSatisfiable.name}' isn't satisfiable`, async () => {
        expect(await unSatisfiable.formula.solve(CDCLSolver)).toEqual(undefined);
    });
    it(`Should find that '${satisfiable.name}' is satisfiable`, async () => {
        expect(await satisfiable.formula.solve(CDCLSolver)).not.toEqual(undefined);
    });

    it("Should find that the pigeon hole formula isn't satisfiable", async () => {
        const PF = getFullPigeonHoleFormula(6);
        expect(await PF.solve(CDCLSolver)).toEqual(undefined);
    });
    it("Should find that the partial pigeon hole formula is satisfiable", async () => {
        const PF = getPartialPigeonHoleFormula(6);
        expect(await PF.solve(CDCLSolver)).not.toEqual(undefined);
    });
});
