/** An identifier for a type of data to obtain from the context */
export type IContextIdentifier<T> = {
    /** The name of this data type */
    name: string;
    /** The id of the context data */
    id: symbol;
    /**
     * Retrieves the initial data of the context
     * @returns The initial data
     */
    init: () => T;
};
