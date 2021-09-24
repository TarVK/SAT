import {Context} from "../../context/Context";
import {IContext} from "../../_types/context/IContext";
import {IFormula} from "../../_types/IFormula";

/**
 * Formats the formula and adds surrounding brackets
 * @param formula The formula to be formatted
 * @param context The context to retrieve data from
 * @param precedence The precedence of the operations the sub-formula occurs in, in order to decide whether to add brackets
 * @returns THe formatted formula
 */
export function formatBrackets(
    formula: IFormula,
    context: IContext = new Context(),
    precedence?: number
): string {
    if (precedence != undefined && formula.precedence < precedence)
        return `(${formula.format(context)})`;
    return formula.format(context);
}
