import {IFormula} from "../../_types/IFormula";
import {ISolveResult} from "../../_types/solver/ISolveResult";
import type * as cp from "child_process";
import type * as fs from "fs";
import type * as path from "path";
import {IVariableCollection} from "../../_types/solver/IVariableCollection";
import {getVariableId, getVariableSymbol} from "../../formula/constructs/Variable";

/**
 * Solves the satisfiability problem using the Z3 solver, only works in a node environment and if z3 is installed globally
 * @param formula The formula to be solved
 * @returns The found assignment or undefined if no assignment exists
 * @throws An error if the specified formula has problems
 */
export async function Z3Solver(formula: IFormula | string): Promise<ISolveResult> {
    const Z3Formula = typeof formula == "string" ? formula : formula.toZ3();

    // Import the node specific utilities
    const {exec} = require("child_process") as typeof cp;
    const {writeFile} = (require("fs") as typeof fs).promises;
    const Path = require("path") as typeof path;

    // Obtain the final formula
    const completeFormula = `
${Z3Formula}

; Solve
(check-sat)
(get-model)
`;

    // Evaluate the formula with z3
    await writeFile(Path.join(process.cwd(), "temp.txt"), completeFormula);
    let result;
    try {
        result = (await new Promise((res, rej) => {
            exec("z3 temp.txt", (error, result, errorMsg) => {
                if (error) rej(result);
                else res(result);
            });
        })) as string;
    } catch (e) {
        if (typeof e == "string" && e.includes("unsat")) return undefined;
        throw e;
    }

    // Check the result
    if (result.includes("unsat")) return undefined;

    const variables: IVariableCollection = {};
    const regex = /define-fun\s+([\w\-]+)\s+\(\)\s+(\w+)\s+(\w+)/gm;
    const matches: RegExpMatchArray[] = [];
    let match: RegExpMatchArray | null;
    while ((match = regex.exec(result))) matches.push(match);

    matches.sort(([a], [b]) => (a > b ? 1 : a < b ? -1 : 0));

    matches.forEach(([_, variable, type, value]) => {
        const parser =
            Z3ResultParsers[type.toLowerCase() as keyof typeof Z3ResultParsers];
        if (!parser) throw new Error(`No output parser defined for data type ${type}`);

        const parsedValue = parser(value);
        variables[getVariableSymbol(variable)] = parsedValue;
    });

    return variables;
}

export const Z3ResultParsers = {
    bool: (val: string) => val.toLocaleLowerCase() == "true",
    int: (val: string) => Number(val),
};
