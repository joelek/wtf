import { JSON } from "./json";
export declare class Asserter {
    private equalsArray;
    private equalsBoolean;
    private equalsNull;
    private equalsNumber;
    private equalsObject;
    private equalsString;
    private equalsUndefined;
    private equals;
    constructor();
    json(expected: JSON, observed: JSON): void;
    throws<A>(operation: Promise<A> | (() => Promise<A>) | (() => A)): Promise<void>;
}
export declare const asserter: Asserter;
