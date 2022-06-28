/// <reference types="node" />
export declare type BinaryData = Buffer | Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array | BigInt64Array | BigUint64Array;
export declare type Comparable = {
    equals(that: Comparable): boolean;
};
export declare const Comparable: {
    is(subject: SerializableData): subject is Comparable;
};
export declare type SerializableData = BinaryData | Comparable | bigint | boolean | null | number | string | undefined | SerializableData[] | {
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
export declare const SerializableDataWrapper: {
    wrap(value: SerializableData): SerializableData;
    unwrap(value: SerializableData): SerializableData;
};
export declare const SerializableData: {
    parse(string: string): SerializableData;
    serialize(json: SerializableData, compact?: boolean): string;
};
export declare type SerializablePath = Array<string | number>;
export declare const SerializablePath: {
    serialize(path: SerializablePath): string;
};
