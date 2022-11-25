import { SerializableData, SerializablePath } from "./data";
export declare type OptionallyAsync<A> = A | Promise<A>;
export declare function getTypename(subject: any): string;
export declare class UnsupportedTypeError extends Error {
    private expected;
    private path;
    get message(): string;
    constructor(expected: SerializableData, path: SerializablePath);
}
export declare class IncorrectTypeError extends Error {
    private observed;
    private expected;
    private path;
    get message(): string;
    constructor(observed: SerializableData, expected: SerializableData, path: SerializablePath);
}
export declare class IncorrectValueError extends Error {
    private observed;
    private expected;
    private path;
    get message(): string;
    constructor(observed: SerializableData, expected: SerializableData, path: SerializablePath);
}
export declare class MissingElementError extends Error {
    private path;
    get message(): string;
    constructor(path: SerializablePath);
}
export declare class UnexpectedElementError extends Error {
    private path;
    get message(): string;
    constructor(path: SerializablePath);
}
export declare class MissingMemberError extends Error {
    private path;
    get message(): string;
    constructor(path: SerializablePath);
}
export declare class UnexpectedMemberError extends Error {
    private path;
    get message(): string;
    constructor(path: SerializablePath);
}
export declare class ExpectedThrowError extends Error {
    get message(): string;
    constructor();
}
export declare class WrongInstanceError extends Error {
    private subject;
    private ctor;
    get message(): string;
    constructor(subject: any, ctor: Constructor<any>);
}
export declare type Constructor<A> = {
    readonly prototype: A;
    new (...args: Array<any>): A;
};
export declare class Asserter {
    private equalsBinaryData;
    private equalsComparable;
    private equalsArray;
    private equalsBigint;
    private equalsBoolean;
    private equalsNull;
    private equalsNumber;
    private equalsObject;
    private equalsString;
    private equalsUndefined;
    private equalsAny;
    constructor();
    equals(observed: SerializableData, expected: SerializableData): void;
    instanceof(subject: any, ctor: Constructor<any>): void;
    throws<A>(callback: () => OptionallyAsync<A>): Promise<void>;
}
