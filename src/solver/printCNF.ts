import {ICNF} from "../_types/solver/ICNF";

/**
 * Prints a CNF expression into easily readable form
 * @param cnf The expression to be formatted
 * @returns The formatted expression
 */
export function printCNF(cnf: ICNF) {
    return cnf
        .map(clause =>
            clause
                .map(({variable, negated}) => (negated ? "!" : "") + variable.name)
                .join(" || ")
        )
        .join(" && \n");
}
