import {IFormula} from "../../_types/IFormula";
import {createCNFConverter} from "../utils/convertToCnf";
import {createFormula} from "../createFormula";
import {createSMTLIBFormulaCombiner} from "../utils/combineSMTLIBFormulas";
import {createFormatter} from "../utils/format";
import {OperatorParser} from "../parsing/OperatorParser";
import {createOperatorFactory} from "../createOperatorFactory";

/** A factory to create AND operators, with different precedences and sub-parsers */
export const AndFactory = createOperatorFactory(({precedence}) => {
    /**
     * Creates a new formula by getting the conjunction of the given formulas
     * @param formulas The formulas to be conjuncted
     * @returns The formula representing the conjunction of the given formulas
     */
    const operator = (...formulas: IFormula<boolean>[]) =>
        createFormula({
            data: {children: formulas},
            precedence,
            execute: context => formulas.every(formula => formula.execute(context)),
            toCNF: createCNFConverter(
                {
                    name: "And",
                    arity: 2,
                    truthTable: [
                        false, // false && false
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
                combine: (left, right) => `${left} && ${right}`,
            }),
            toSMTLIB2: createSMTLIBFormulaCombiner({
                combine: SMTformulas => ({formula: `(and ${SMTformulas.join(" ")})`}),
                formulas,
            }),
        });

    return {
        operator,
        associativity: "left",
        infixParser: OperatorParser("&&").map(() => operator),
    };
});
