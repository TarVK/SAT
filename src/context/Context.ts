import {IContext} from "../_types/context/IContext";
import {IContextIdentifier} from "../_types/context/IContextIdentifier";

/**
 * A context to store data in during evaluation
 */
export class Context implements IContext {
    protected data: Record<symbol, any> = {};

    /**
     * Augments the evaluation context
     * @param identifier The identifier of the data to replace/add
     * @param data The data to be added/replaced
     * @returns The new evaluation context
     */
    public augment<T>(identifier: IContextIdentifier<T>, data: T): IContext {
        const context = new Context();
        context.data = {...this.data, [identifier.id]: data};
        return context;
    }

    /**
     * Updates an entry in the current evaluation context
     * @param identifier The identifier of the data to replace/add
     * @param data The data to be added/replaced
     * @returns This evaluation context
     */
    public update<T>(identifier: IContextIdentifier<T>, data: T): Context {
        this.data = {...this.data, [identifier.id]: data};
        return this;
    }

    /**
     * Retrieves the data for the given identifier that's stored in this context
     * @param identifier The identifier to get the data of
     * @returns The data that was found
     */
    public get<T>(identifier: IContextIdentifier<T>): T {
        if (!(identifier.id in this.data)) this.data[identifier.id] = identifier.init();
        return this.data[identifier.id];
    }
}
