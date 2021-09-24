import {IContext} from "../../_types/context/IContext";
import {IFormula} from "../../_types/IFormula";
import {formatBrackets} from "./formatBrackets";

/**
 * Formats a given expression
 * @param config The configuration for the formatting
 * @param context The context to be used during formatting
 * @returns The formatted formulas
 */
export function format<B>(
    {
        formulas,
        precedence,
        combine,
        format,
    }: {
        /** The subformulas to apply this formatting to */
        formulas: IFormula<B>[];
        /** The precedence of the operator that this formatting is for */
        precedence: number;
        /** The way to combine multiple sub-formulas together */
        combine?: (a: string, b: string, bF: IFormula<B>) => string;
        /** The way to process a single sub-formula */
        format?: (a: string, f: IFormula<B>) => string;
    },
    context: IContext
): string {
    const bracketFormulas = formulas
        .map(formula => ({text: formatBrackets(formula, context, precedence), formula}))
        .filter(({text}) => text.length > 0);
    const formattedFormulas = format
        ? bracketFormulas.map(({text, formula}) => ({
              text: format(text, formula),
              formula,
          }))
        : bracketFormulas;
    return formattedFormulas
        .slice(1)
        .reduce(
            (a, {text: b, formula: bF}) => combine?.(a, b, bF) ?? a,
            formattedFormulas[0].text || ""
        );
}

/**
 * Creates a new formatter to format the given formulas
 * @param config The configuration for the formatting
 * @returns The function that can format the formulas if a context is supplied
 */
export const createFormatter =
    <B>(config: {
        /** The subformulas to apply this formatting to */
        formulas: IFormula<B>[];
        /** The precedence of the operator that this formatting is for */
        precedence: number;
        /** The way to combine multiple sub-formulas together */
        combine?: (a: string, b: string, bF: IFormula<B>) => string;
        /** The way to process a single sub-formula */
        format?: (a: string, f: IFormula<B>) => string;
    }) =>
    (context: IContext) =>
        format(config, context);
