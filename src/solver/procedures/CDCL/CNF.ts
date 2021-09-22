import {ICNF, ICNFLiteral} from "../../../_types/solver/ICNF";
import {IVariableIdentifier} from "../../../_types/solver/IVariableIdentifier";
import {printCNF} from "../../printCNF";

export class CNF {
    protected cnf: ICNF;

    /** A structure to find all clauses that contain a variable */
    protected clauses: Map<
        IVariableIdentifier<boolean>,
        [
            /** All clauses containing the variable */
            ICNFLiteral[][],
            /** All clauses containing the negated variable */
            ICNFLiteral[][]
        ]
    > = new Map();

    /**
     * Creates a mutable CNF with optimized clause retrieval
     * @param cnf The base CNF to start from
     */
    public constructor(cnf: ICNF = []) {
        this.cnf = cnf;
        cnf.forEach(clause =>
            clause.forEach(({variable, negated}) => {
                let varClauses = this.clauses.get(variable);
                if (!varClauses) {
                    varClauses = [[], []];
                    this.clauses.set(variable, varClauses);
                }

                const list = varClauses[negated ? 1 : 0];
                if (list.includes(clause)) return;
                list.push(clause);
            })
        );
    }

    /**
     * Retrieves all of the cnf clauses
     * @returns All cnf clauses
     */
    public getClauses(): ICNF {
        return this.cnf;
    }

    /**
     * Retrieves all clauses in which the given literal is contained
     * @param variable The variable of the literal
     * @param negated Whether the variable is negated
     * @returns The clauses including the literal
     */
    public getLiteralClauses(
        variable: IVariableIdentifier<boolean>,
        negated: boolean
    ): ICNFLiteral[][] {
        return this.clauses.get(variable)?.[negated ? 1 : 0] ?? [];
    }

    /**
     * Removes a clause from the CNF
     * @param clause The clause to be removed
     */
    public removeClause(clause: ICNFLiteral[]): void {
        this.cnf = this.cnf.filter(c => c != clause);
        clause.forEach(({variable, negated}) => {
            const varClauses = this.clauses.get(variable);
            if (!varClauses) return;

            varClauses[negated ? 1 : 0] = varClauses[negated ? 1 : 0].filter(
                c => c != clause
            );
        });
    }

    /**
     * Removes a number of clauses from the CNF
     * @param clauses The clauses to be removed
     */
    public removeClauses(...clauses: ICNFLiteral[][]): void {
        const clauseSet = new Set(clauses);
        this.cnf = this.cnf.filter(c => !clauseSet.has(c));
        const vars = new Set(clauses.flat());
        vars.forEach(({variable, negated}) => {
            const varClauses = this.clauses.get(variable);
            if (!varClauses) return;

            varClauses[negated ? 1 : 0] = varClauses[negated ? 1 : 0].filter(
                c => !clauseSet.has(c)
            );
        });
    }

    /**
     * Adds a clause to the cnf
     * @param clause The clause to be added
     */
    public addClause(clause: ICNFLiteral[]): void {
        // TODO: make this check disableable, it should never occur if the algorithm behaves as intended
        if (this.hasClause(clause))
            throw new Error(
                `Tried to add a clause that's already present: ${printCNF([clause])}`
            );

        this.cnf.push(clause);
        clause.forEach(({variable, negated}) => {
            const varClauses = this.clauses.get(variable);
            if (!varClauses) return;

            const list = varClauses[negated ? 1 : 0];
            if (list.includes(clause)) return;
            list.push(clause);
        });
    }

    /**
     * Adds a number of clauses to the cnf
     * @param clauses The clause to be added
     */
    public addClauses(...clauses: ICNFLiteral[][]): void {
        // TODO: make this check disableable, it should never occur if the algorithm behaves as intended
        clauses = clauses.filter(clause => !this.hasClause(clause));

        this.cnf.push(...clauses);
        clauses.forEach(clause => {
            clause.forEach(({variable, negated}) => {
                const varClauses = this.clauses.get(variable);
                if (!varClauses) return;

                const list = varClauses[negated ? 1 : 0];
                if (list.includes(clause)) return;
                list.push(clause);
            });
        });
    }

    /**
     * Checks whether this cnf already contain a given clause
     * @param clause The clause to check
     * @returns Whether the cnf contains the clause
     */
    protected hasClause(clause: ICNFLiteral[]): boolean {
        const clausesWithFirstLiteral = this.clauses.get(clause[0].variable)?.[
            clause[0].negated ? 1 : 0
        ];
        if (!clausesWithFirstLiteral) return false;

        const sameLengthClauses = clausesWithFirstLiteral.filter(
            c => c.length == clause.length
        );
        const hasClause = sameLengthClauses.some(c =>
            clause.every(({variable: v1, negated: n1}) =>
                c.find(({variable: v2, negated: n2}) => v1 == v2 && n1 == n2)
            )
        );
        return hasClause;
    }
}
