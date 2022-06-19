import { JSON } from "./json";
import { Logger } from "./loggers";
import { Asserter } from "./asserters";
export declare type TestCallback = (asserter: Asserter) => void | Promise<void>;
export declare type TestCaseReport = {
    description: string;
    error?: JSON;
};
export declare class TestCase {
    private description;
    private callback;
    constructor(description: string, callback: TestCallback);
    run(logger?: Logger): Promise<TestCaseReport>;
}
export declare type TestSuiteReport = {
    reports: Array<TestCaseReport>;
    status: number;
};
export declare class TestSuite {
    private description;
    private testCases;
    constructor(description: string);
    defineTestCase(description: string, callback: TestCallback): void;
    run(logger?: Logger): Promise<TestSuiteReport>;
}
export declare function createTestSuite(description: string, callback: (suite: TestSuite) => Promise<void>): Promise<void>;
