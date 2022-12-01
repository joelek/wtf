import { Logger } from "./loggers";
import { Asserter } from "./asserters";
export type OptionallyAsync<A> = A | Promise<A>;
export type TestCaseCallback = (asserter: Asserter) => OptionallyAsync<void>;
export type TestCaseReport = {
    description: string;
    success: boolean;
    duration?: number;
    error?: string;
};
export declare const TestCaseReport: {
    is(subject: any): subject is TestCaseReport;
};
export declare class TestCase {
    private description;
    private callback;
    private doRun;
    constructor(description: string, callback: TestCaseCallback);
    run(logger?: Logger): Promise<TestCaseReport>;
}
export type TestCollectionReport = {
    reports: Array<TestCaseReport>;
    success: boolean;
};
export declare const TestCollectionReport: {
    is(subject: any): subject is TestCollectionReport;
};
export declare class TestCollection {
    private testCases;
    constructor();
    test(description: string, callback: TestCaseCallback): void;
    run(logger?: Logger): Promise<TestCollectionReport>;
}
export declare const test: (description: string, callback: TestCaseCallback) => void;
