export declare type JSON = boolean | null | number | string | undefined | JSON[] | {
    [key: string]: JSON;
};
export declare const JSON: {
    parse(string: string): JSON;
    serialize(json: JSON): string;
};
