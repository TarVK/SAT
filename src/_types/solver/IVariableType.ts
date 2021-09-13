export type IVariableType<T> = {
    /** The name of the variable type */
    name: string;
    /** The default value for this data type */
    defaultValue: T;
};
