import {IContextIdentifier} from "./IContextIdentifier";

/** The context that's used to track for formula execution or conversion */
export type IContext = {
    /**
     * Augments the evaluation context
     * @param identifier The identifier of the data to replace/add
     * @param data The data to be added/replaced
     * @returns The new evaluation context
     */
    augment<T>(identifier: IContextIdentifier<T>, data: T): IContext;

    /**
     * Retrieves the data that this context holds for the specified identifier
     * @param identifier The identifier of the data to retrieve
     * @returns The data that was stored in this context, or newly generated data from the identifier
     */
    get<T>(identifier: IContextIdentifier<T>): T;
};
