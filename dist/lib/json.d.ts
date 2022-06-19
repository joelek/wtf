export declare type JSONData = boolean | null | number | string | undefined | JSONData[] | {
    [key: string]: JSONData;
};
export declare const JSONData: {
    parse(string: string): JSONData;
    serialize(json: JSONData): string;
};
export declare type JSONPath = Array<string | number>;
export declare const JSONPath: {
    serialize(path: JSONPath): string;
};
