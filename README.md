# SAT

During one of my courses SMT-solvers were discussed in quite some detail, so I wanted to apply that theory in practice myself.
Currently this is only a SAT solver, but I may try to extend the functionality in the future.
This isn't published as a package anywhere, since there are way better SMT-solvers such as [Z3](https://github.com/Z3Prover/z3) already out there to be used in practice. 

The most interesting parts of the source code are:
- The [CDCL solver implementation](https://github.com/TarVK/SAT/blob/main/src/solver/procedures/CDCL/CDCLSolver.ts) which can efficiently solve many formulas
- The [language constructs](https://github.com/TarVK/SAT/tree/main/src/formula/constructs) and how they are combined into a [default language](https://github.com/TarVK/SAT/blob/main/src/formula/defaultLanguage.ts) with specific precedences. 

## Demo

[Check out the demo here](https://tarvk.github.io/SAT/demo/build/)

I've created a demo webpage in order to play with the tool using the built-in parser, which allows you to compare the performance of the 3 different solvers.
It features some built-in examples in order to get an idea for the things SAT-solvers can be used for.

## Functionality

Currently boolean formula constructs are implemented, with related syntax

-   `Variable`, `varName`: Creates a boolean variable of the given type (currently only Boolean is supported)
-   `Not`, `![a]`: Negates a boolean formula
-   `And`, `[a] && [b]`: Takes the conjunction of 2 or more boolean formulas
-   `Or`, `[a] || [b]`: Takes the disjunction of 2 or more boolean formulas
-   `Implies`, `[a] => [b]`: Takes a premise and conclusion formula, and ensures the conclusion holds if the premise holds
-   `BiImplies`, `[a] <=> [b]`: Checks whether two given formulas result in the same value

Created variables are unique, even if they use the same name, so they should be defined upfront. Below is an example of a formula in javascript:

```ts
const a = Variable("a", Bool);
const formula = And(a, Not(a));
```

We can also creates formulas using the parser:

```ts
const formula = parse(`a && !a`);
```

The formula can then be attempted to be solved using `solve`:

```ts
const a = Variable("a", Bool);
const b = Variable("b", Bool);

const unsatisfiableFormula = And(a, Not(a));
const satisfiableFormula = And(Or(a, Not(b)), Or(Not(a), b));

const result1 = await unsatisfiableFormula.solve();
console.log(result1); // undefined, since no solution exists

const result2 = await satisfiableFormula.solve();
if (result2) console.log(result2.get(a), result2.get(b)); // true, true
```

### Solvers

3 satisfiability solver algorithms have been implemented:

-   DavisPutnam: [Wikipedia/DavisPutman](https://en.wikipedia.org/wiki/Davis%E2%80%93Putnam_algorithm)
-   DPLL: [Wikipedia/DPLL](https://en.wikipedia.org/wiki/DPLL_algorithm), [users.aalto.fi/DPLL](https://users.aalto.fi/~tjunttil/2020-DP-AUT/notes-sat/dpll.html)
-   CDCL: [Wikipedia/CDCL](https://en.wikipedia.org/wiki/Conflict-driven_clause_learning), [users.aalto.fi/CDCL](https://users.aalto.fi/~tjunttil/2020-DP-AUT/notes-sat/cdcl.html), [cse442-17f.github.io/CDCL](https://cse442-17f.github.io/Conflict-Driven-Clause-Learning/)

Realistically the first two shouldn't be used, since they have an exponential blowup for nearly every formula. CDCL however is relatively smart, and can be used for decently large formulas. I however haven't optimized things or applied smart heuristics to improve performance, so you still shouldn't expect amazing performance.

You can pass a specific solver when calling the `solve` function on a formula:

```ts
const result2 = await satisfiableFormula.solve(DPLLSolver);
if (result2) console.log(result2.get(a), result2.get(b)); // true, true
```

If no solver is specified, CDCL is used.

### Correctness

It's not unlikely that there are mistakes in some of this code (somewhat defeating the purpose),
but I've at least confirmed it behaves correctly on a couple of formulae in the form of unit tests:

https://github.com/TarVK/SAT/tree/main/src/solver/procedures/_tests

It's also relatively likely that DavisPutnam generates incorrect solutions in some cases - or even throws errors - since the algorithm to obtain the solution after satisfiability is proven, has been improvised due to a lack of sources.
