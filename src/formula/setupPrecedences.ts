import {IOperator} from "../_types/IOperator";

/**
 * Assigns precedences to the operators according to the specified sequence, where higher in the main list means higher precedence, and within the same sublist means the same precedence.
 * E.g.
 * ```
 * [
 *   [unaryNegation, unaryAddition],
 *   [Exponentation],
 *   [Multiply, Divide],
 *   [Addition, Subtraction]
 * ]
 * ```
 * @param precedences The operators precedence
 */
export function setupPrecedences(precedences: IOperator[][]): void {
    precedences.forEach((operators, invertedPrecedence) =>
        operators.forEach(operator => {
            operator.precedence = precedences.length - invertedPrecedence;
        })
    );
}
