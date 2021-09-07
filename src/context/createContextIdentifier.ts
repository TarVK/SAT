import {IContextIdentifier} from "../_types/context/IContextIdentifier";

/**
 * Creates a new context data identifier
 * @param name The name of the identifier
 * @param init The function to retrieve the initial data
 * @returns The evaluation identifier
 */
export function createContextIdentifier<T>(
    name: string,
    init: () => T
): IContextIdentifier<T> {
    return {
        name,
        init,
        id: Symbol(name),
    };
}
