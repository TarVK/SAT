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

    const result = await execZ3(`${Z3Formula}
    
; Solve
(check-sat)
(get-model)`);

    if (!result) return undefined;

    const variables: IVariableCollection = {};

    // Obtain constant vars
    const varRegex = /define-fun\s+([\w\-]+)\s+\(\)\s+(\w+)\s+(\w+)/gm;
    const matches: RegExpMatchArray[] = [];
    let match: RegExpMatchArray | null;
    while ((match = varRegex.exec(result))) matches.push(match);

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

/**
 * Solves the satisfiability problem using the Z3 solver, only works in a node environment and if z3 is installed globally
 * @param formula The formula to be solved
 * @returns The found assignment or undefined if no assignment exists
 * @throws An error if the specified formula has problems
 */
export async function Z3SolverRaw(formula: string): Promise<undefined | IRawResult> {
    const result = await execZ3(`${formula}
    
    ; Solve
    (check-sat)
    (get-model)`);
    if (!result) return undefined;

    // Obtain constant vars
    const variables: IRawResult = {};
    const varRegex = /define-fun\s+([\w\-]+)\s+\(\)\s+(\w+)\s+(\w+)/gm;
    const matches: RegExpMatchArray[] = [];
    let match: RegExpMatchArray | null;
    while ((match = varRegex.exec(result))) matches.push(match);

    matches.sort(([a], [b]) => (a > b ? 1 : a < b ? -1 : 0));

    matches.forEach(([_, variable, type, value]) => {
        const parser =
            Z3ResultParsers[type.toLowerCase() as keyof typeof Z3ResultParsers];
        if (!parser) throw new Error(`No output parser defined for data type ${type}`);

        const parsedValue = parser(value);
        variables[variable] = parsedValue;
    });

    // Obtain indexed vars (currently only supports 1 variable)
    const funcRegex =
        /define-fun\s+([\w\-]+)\s+\(.*\)\s+(\w+)\s+((?:\(ite\s+\(\=[^\)]*\)\s+.+\s+)*)(\w+)/gm;
    const iteRegex = /ite\s+\(\=\s+([^\s]+)\s+([^\)]+)\)\s+([^\n]+)/gm;
    while ((match = funcRegex.exec(result))) {
        const [_, variable, type, ite, def] = match;
        const parser =
            Z3ResultParsers[type.toLowerCase() as keyof typeof Z3ResultParsers];
        if (!parser) throw new Error(`No output parser defined for data type ${type}`);

        const options: Record<string, any> = {};
        while ((match = iteRegex.exec(ite))) {
            const [_, param, arg, val] = match;
            options[arg] = parser(val);
        }

        const defVal = parser(def);
        variables[variable] = arg => options[arg + ""] ?? defVal;
    }

    // Obtain boolean indexed vars
    const booleanFuncRegex =
        /define-fun\s+([\w\-]+)\s+\(.*\)\s+(\w+)\s+(?:\(or((?:\s+\(\=[^\)]*\))+))\)/gm;
    const orRegex = /\=\s+([^\s]+)\s+([^)]+)/gm;
    while ((match = booleanFuncRegex.exec(result))) {
        const [_, variable, type, or] = match;

        const options: Record<string, any> = {};
        while ((match = orRegex.exec(or))) {
            const [_, param, arg] = match;
            options[arg] = true;
        }

        const defVal = false;
        variables[variable] = arg => options[arg + ""] ?? defVal;
    }

    return variables;
}

/**
 * Executes z3 on the given formula, and returns the result string
 * @param formula The formula to be executed
 * @returns The resulting string
 */
export async function execZ3(formula: string): Promise<undefined | string> {
    // Import the node specific utilities
    const {exec} = require("child_process") as typeof cp;
    const {writeFile} = (require("fs") as typeof fs).promises;
    const Path = require("path") as typeof path;

    // Evaluate the formula with z3
    await writeFile(Path.join(process.cwd(), "temp.txt"), formula);
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
    console.log(result);
    return result;
}

export const Z3ResultParsers = {
    bool: (val: string) => val.toLocaleLowerCase() == "true",
    int: (val: string) => Number(val),
    real: (val: string) => {
        const match = val.match(/\/\s+([^\s]+)\s+([^\s\)]+)/);
        if (match) return Number(match[1]) / Number(match[2]);
        return Number(val);
    },
};
type IRawResult = Record<string, IRetType | ((arg: IRetType) => IRetType)>;
type IRetType = number | boolean;
