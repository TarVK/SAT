import {AndFactory} from "./constructs/And";
import {BiImpliesFactory} from "./constructs/BiImplies";
import {GroupFactory} from "./constructs/Group";
import {ImpliesFactory} from "./constructs/Implies";
import {NotFactory} from "./constructs/Not";
import {OrFactory} from "./constructs/Or";
import {VariableFactory} from "./constructs/Variable";
import {createLanguage} from "./parsing/createLanguage";

/**
 * The default language and default precedences for all of the operators
 */
export const {
    parse,
    operators: [[Variable, Group], [Not], [And], [Or], [Implies, BiImplies]],
} = createLanguage([
    [VariableFactory, GroupFactory],
    [NotFactory],
    [AndFactory],
    [OrFactory],
    [ImpliesFactory, BiImpliesFactory],
]);
