import { JSON } from "./json";
export declare function getTypename(subject: any): string;
export declare class Asserter {
    private equalsArray;
    private equalsBoolean;
    private equalsNull;
    private equalsNumber;
    private equalsObject;
    private equalsString;
    private equalsUndefined;
    constructor();
    equals(expected: JSON, observed: JSON): void;
    throws<A>(operation: Promise<A> | (() => Promise<A>) | (() => A)): Promise<void>;
}
export declare const asserter: Asserter;
