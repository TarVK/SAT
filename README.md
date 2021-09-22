# SAT

Me messing around with SAT stuff, applying some common satisfiability checking techniques myself.

This project will most likely not end up being something I publish as a package, as it probably won't be useful.
But in the end I may make some web tool to play around with this thing.

## Current state

Currently boolean formula constructs are implemented

-   `Variable`: Creates a boolean variable of the given type (currently only Boolean is supported)
-   `Not`: Negates a boolean formula
-   `And`: Takes the conjunction of 2 or more boolean formulas
-   `Or`: Takes the disjunction of 2 or more boolean formulas
-   `Implies`: Takes a premise and conclusion formula, and ensures the conclusion holds if the premise holds
-   `BiImplies`: Checks whether two given formulas result in the same value

Created variable are unique, even if they use the same name, so they should be defined upfront. Below is an example of a formula:

```ts
const a = Variable("a", Bool);
const formula = And(a, Not(a));
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
-   DPLL: [Wikipedia/DPLL](https://en.wikipedia.org/wiki/DPLL_algorithm), [users.aalto.fi/](https://users.aalto.fi/~tjunttil/2020-DP-AUT/notes-sat/dpll.html)
-   CDCL: [Wikipedia/CDCL](https://en.wikipedia.org/wiki/Conflict-driven_clause_learning), [users.aalto.fi/CDCL](https://users.aalto.fi/~tjunttil/2020-DP-AUT/notes-sat/cdcl.html), [cse442-17f.github.io/CDCL](https://cse442-17f.github.io/Conflict-Driven-Clause-Learning/)

Realistically the first two shouldn't be used, since they have an exponential blowup for nearly every formula. CDCL however is relatively smart, and can be used for decently large formulas. I however haven't optimized things or applied smart heuristics to improve performance, so you still shouldn't expect amazing performance.

You can pass a specific solver when calling the `solve` function on a formula:

```ts
const result2 = await satisfiableFormula.solve(DPLLSolver);
if (result2) console.log(result2.get(a), result2.get(b)); // true, true
```

If no solver is specified, CDCL is used.

### Correctness

IT's not unlikely that there are mistakes in some of this code (somewhat defeating the purpose),
but I've at least confirmed it behaves correctly on a couple of formulae in the form of unit tests:

https://github.com/TarVK/SAT/tree/main/src/solver/procedures/_tests
