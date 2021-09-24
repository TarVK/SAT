import {IFormula} from "../../_types/IFormula";
import {createFormula} from "../createFormula";
import {createOperatorFactory} from "../createOperatorFactory";
import {OperatorParser} from "../parsing/OperatorParser";
import {createSMTLIBFormulaCombiner} from "../utils/combineSMTLIBFormulas";
import {createCNFConverter} from "../utils/convertToCnf";
import {createFormatter} from "../utils/format";

/** A factory to create IMPLIES operators, with different precedences and sub-parsers */
export const ImpliesFactory = createOperatorFactory(({precedence}) => {
    /**
     * Creates a new formula by combining two formulas using implication
     * @param Formulas The premise and conclusion (possibly chained)
     * @returns The formula representing the negated given formula
     */
    const operator = (...formulas: IFormula<boolean>[]) =>
        createFormula({
            data: {children: formulas},
            precedence,
            execute: context =>
                formulas
                    .slice(1)
                    .reduce(
                        (a, b) => !a || b.execute(context),
                        formulas[0].execute(context)
                    ),
            toCNF: createCNFConverter(
                {
                    name: "Implies",
                    arity: 2,
                    truthTable: [
                        true, // false && false
                        true, // false && true
                        false, // true && false
                        true, // true && true
                    ],
                },
                formulas
            ),
            format: createFormatter({
                formulas,
                precedence,
                combine: (premise, conclusion) => `${premise} => ${conclusion}`,
            }),
            toSMTLIB2: createSMTLIBFormulaCombiner({
                combine: SMTformulas => ({formula: `(=> ${SMTformulas.join(" ")})`}),
                formulas,
            }),
        });

    return {
        operator,
        associativity: "left",
        infixParser: OperatorParser("=>").map(() => operator),
    };
});
