export declare type JSON = boolean | null | number | string | undefined | JSON[] | {
    [key: string]: JSON;
};
export declare const JSON: {
    parse(string: string): JSON;
    serialize(json: JSON): string;
};
export declare type JSONPath = Array<string | number>;
export declare const JSONPath: {
    serialize(path: JSONPath): string;
};
