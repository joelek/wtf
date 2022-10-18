import { Logger } from "./loggers";
import { Asserter } from "./asserters";
export declare type OptionallyAsync<A> = A | Promise<A>;
export declare type TestCaseCallback = (asserter: Asserter) => OptionallyAsync<void>;
export declare type TestCaseReport = {
    description: string;
    success: boolean;
    error?: string;
};
export declare class TestCase {
    private description;
    private callback;
    constructor(description: string, callback: TestCaseCallback);
    run(logger?: Logger): Promise<TestCaseReport>;
}
export declare type TestCollectionReport = {
    reports: Array<TestCaseReport>;
    success: boolean;
};
export declare class TestCollection {
    private testCases;
    constructor();
    test(description: string, callback: TestCaseCallback): void;
    run(logger?: Logger): Promise<TestCollectionReport>;
}
export declare const test: (description: string, callback: TestCaseCallback) => void;
