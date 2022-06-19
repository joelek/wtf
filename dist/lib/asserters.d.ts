import { JSONData, JSONPath } from "./json";
export declare function getTypename(subject: any): string;
export declare class IncorrectTypeError extends Error {
    private observed;
    private expected;
    private path;
    get message(): string;
    constructor(observed: JSONData, expected: JSONData, path: JSONPath);
}
export declare class IncorrectValueError extends Error {
    private observed;
    private expected;
    private path;
    get message(): string;
    constructor(observed: JSONData, expected: JSONData, path: JSONPath);
}
export declare class MissingElementError extends Error {
    private path;
    get message(): string;
    constructor(path: JSONPath);
}
export declare class UnexpectedElementError extends Error {
    private path;
    get message(): string;
    constructor(path: JSONPath);
}
export declare class MissingMemberError extends Error {
    private path;
    get message(): string;
    constructor(path: JSONPath);
}
export declare class UnexpectedMemberError extends Error {
    private path;
    get message(): string;
    constructor(path: JSONPath);
}
export declare class ExpectedThrowError extends Error {
    get message(): string;
    constructor();
}
export declare class Asserter {
    private equalsArray;
    private equalsBoolean;
    private equalsNull;
    private equalsNumber;
    private equalsObject;
    private equalsString;
    private equalsUndefined;
    private equalsJSON;
    constructor();
    equals(observed: JSONData, expected: JSONData): void;
    throws<A>(operation: Promise<A> | (() => Promise<A>) | (() => A)): Promise<void>;
}
