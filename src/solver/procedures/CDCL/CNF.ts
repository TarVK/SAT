import {ICNF, ICNFLiteral} from "../../../_types/solver/ICNF";
import {IVariableIdentifier} from "../../../_types/solver/IVariableIdentifier";

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
        if (!this.cnf.includes(clause)) return;

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
        clauses = clauses.filter(clause => !this.cnf.includes(clause));

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
}
