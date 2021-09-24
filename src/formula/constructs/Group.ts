import {IFormula} from "../../_types/IFormula";
import {createFormula} from "../createFormula";
import {createSMTLIBFormulaCombiner} from "../utils/combineSMTLIBFormulas";
import {createFormatter} from "../utils/format";
import {createOperatorFactory} from "../createOperatorFactory";
import P from "parsimmon";

/** A factory to create AND operators, with different precedences and sub-parsers */
export const GroupFactory = createOperatorFactory(({precedence, nextParser}) => {
    /**
     * Creates a new formula by wrapping a given formula with brackets
     * @param formula The formula to be wrapped
     * @returns The formula representing the same sub-formula, but in a group
     */
    const operator = (formula: IFormula) =>
        createFormula({
            precedence,
            execute: context => formula.execute(context),
            toCNF: context => formula.toCNF(context),
            format: createFormatter({
                formulas: [formula],
                precedence,
                format: child => `(${child})`,
            }),
            toSMTLIB2: createSMTLIBFormulaCombiner({
                combine: SMTformulas => ({formula: SMTformulas[0]}),
                formulas: [formula],
            }),
        });

    return {
        operator,
        parser: P.seq(P.string("("), nextParser, P.string(")")).map(
            ([l, formula, r]) => formula
        ),
    };
});
