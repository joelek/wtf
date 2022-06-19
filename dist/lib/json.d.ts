export declare type JSONData = boolean | null | number | string | undefined | JSONData[] | {
    [key: string]: JSONData;
};
export declare type JSONArray = Array<JSONData>;
export declare const JSONArray: {
    is(subject: JSONData): subject is JSONData[];
};
export declare type JSONObject = Record<string, JSONData>;
export declare const JSONObject: {
    is(subject: JSONData): subject is Record<string, JSONData>;
};
export declare const JSONData: {
    parse(string: string): JSONData;
    serialize(json: JSONData): string;
};
export declare type JSONPath = Array<string | number>;
export declare const JSONPath: {
    serialize(path: JSONPath): string;
};
