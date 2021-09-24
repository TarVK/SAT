import {IFormula} from "../../_types/IFormula";
import {createFormula} from "../createFormula";
import {createOperatorFactory} from "../createOperatorFactory";
import {OperatorParser} from "../parsing/OperatorParser";
import {createSMTLIBFormulaCombiner} from "../utils/combineSMTLIBFormulas";
import {createCNFConverter} from "../utils/convertToCnf";
import {createFormatter} from "../utils/format";

/** A factory to create BIIMPLIES operators, with different precedences and sub-parsers */
export const BiImpliesFactory = createOperatorFactory(({precedence}) => {
    /**
     * Creates a new formula by combining two formulas using bi-implication
     * @param formulas The formulas to be bi-implied
     * @returns The formula representing the negated given formula
     */
    const operator = (...formulas: IFormula[]) =>
        createFormula({
            data: {children: formulas},
            precedence,
            execute: context =>
                formulas
                    .slice(1)
                    .reduce(
                        (a, b) => a == b.execute(context),
                        formulas[0].execute(context)
                    ),
            toCNF: createCNFConverter(
                {
                    name: "BiImplies",
                    arity: 2,
                    truthTable: [
                        true, // false && false
                        false, // false && true
                        false, // true && false
                        true, // true && true
                    ],
                },
                formulas
            ),
            format: createFormatter({
                formulas,
                precedence,
                combine: (left, right) => `${left} <=> ${right}`,
            }),
            toSMTLIB2: createSMTLIBFormulaCombiner({
                combine: SMTformulas => ({formula: `(= ${SMTformulas.join(" ")})`}),
                formulas,
            }),
        });

    return {
        operator,
        associativity: "left",
        infixParser: OperatorParser("<=>").map(() => operator),
    };
});
