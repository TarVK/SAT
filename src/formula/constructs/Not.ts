import {IFormula} from "../../_types/IFormula";
import {createFormula} from "../createFormula";
import {createOperatorFactory} from "../createOperatorFactory";
import P from "parsimmon";
import {OperatorParser} from "../parsing/OperatorParser";
import {createSMTLIBFormulaCombiner} from "../utils/combineSMTLIBFormulas";
import {convertToCnf} from "../utils/convertToCnf";
import {createFormatter} from "../utils/format";

/** A factory to create NOT operators, with different precedences and sub-parsers */
export const NotFactory = createOperatorFactory(({precedence, currentParser}) => {
    /**
     * Creates a new formula by negating a given formula
     * @param formula The formula to be negated
     * @returns The formula representing the negated given formula
     */
    const operator = (formula: IFormula<boolean>) =>
        createFormula({
            data: {child: formula},
            precedence,
            execute: context => !formula.execute(context),
            toCNF: context =>
                convertToCnf(
                    {
                        name: "Not",
                        arity: 1,
                        truthTable: [
                            true, // false
                            false, // true
                        ],
                    },
                    [formula],
                    context
                ),
            format: createFormatter({
                formulas: [formula],
                precedence,
                format: a => `!${a}`,
            }),
            toSMTLIB2: createSMTLIBFormulaCombiner({
                combine: SMTformulas => ({formula: `(not ${SMTformulas.join(" ")})`}),
                formulas: [formula],
            }),
        });

    return {
        operator,
        parser: P.seqMap(OperatorParser("!"), currentParser, (_, formula) =>
            operator(formula)
        ),
    };
});
