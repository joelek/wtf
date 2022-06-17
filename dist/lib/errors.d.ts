export declare type SerializedError = {
    type: string;
    message: string;
    stack?: string;
};
export declare const SerializedError: {
    fromError(error: Error): SerializedError;
};
