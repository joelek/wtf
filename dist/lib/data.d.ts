export declare type SerializableData = bigint | boolean | null | number | string | undefined | SerializableData[] | {
    [key: string]: SerializableData;
};
export declare type SerializableDataArray = Array<SerializableData>;
export declare const SerializableDataArray: {
    is(subject: SerializableData): subject is SerializableDataArray;
};
export declare type SerializableDataObject = Record<string, SerializableData>;
export declare const SerializableDataObject: {
    is(subject: SerializableData): subject is SerializableDataObject;
};
export declare const SerializableData: {
    parse(string: string): SerializableData;
    serialize(json: SerializableData, wrap?: boolean): string;
};
export declare type SerializablePath = Array<string | number>;
export declare const SerializablePath: {
    serialize(path: SerializablePath): string;
};
