import {IFormula} from "../../_types/IFormula";
import {createFormula} from "../createFormula";
import {createOperatorFactory} from "../createOperatorFactory";
import {OperatorParser} from "../parsing/OperatorParser";
import {createSMTLIBFormulaCombiner} from "../utils/combineSMTLIBFormulas";
import {createCNFConverter} from "../utils/convertToCnf";
import {createFormatter} from "../utils/format";

/** A factory to create OR operators, with different precedences and sub-parsers */
export const OrFactory = createOperatorFactory(({precedence}) => {
    /**
     * Creates a new formula by getting the disjunction of the given formulas
     * @param formulas The formulas to be disjuncted
     * @returns The formula representing the disjunction of the given formulas
     */
    const operator = (...formulas: IFormula[]) =>
        createFormula({
            data: {children: formulas},
            precedence,
            execute: context => formulas.some(formula => formula.execute(context)),
            toCNF: createCNFConverter(
                {
                    name: "Or",
                    arity: 2,
                    truthTable: [
                        false, // false && false
                        true, // false && true
                        true, // true && false
                        true, // true && true
                    ],
                },
                formulas
            ),
            format: createFormatter({
                formulas,
                precedence,
                combine: (left, right) => `${left} || ${right}`,
            }),
            toSMTLIB2: createSMTLIBFormulaCombiner({
                combine: SMTformulas => ({formula: `(or ${SMTformulas.join(" ")})`}),
                formulas,
            }),
        });

    return {
        operator,
        associativity: "left",
        infixParser: OperatorParser("||").map(() => operator),
    };
});
