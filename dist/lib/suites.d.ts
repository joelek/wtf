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
export declare type TestSuiteCallback = (suite: TestSuite) => OptionallyAsync<void>;
export declare type TestSuiteReport = {
    description: string;
    reports: Array<TestCaseReport>;
    success: boolean;
};
export declare class TestSuite {
    private description;
    private testCases;
    private callback;
    constructor(description: string, callback: TestSuiteCallback);
    case(description: string, callback: TestCaseCallback): void;
    run(logger?: Logger): Promise<TestSuiteReport>;
}
export declare type TestSuitesReport = {
    reports: Array<TestSuiteReport>;
    success: boolean;
};
export declare class TestSuites {
    private testSuites;
    constructor();
    test(description: string, callback: TestSuiteCallback): void;
    run(logger?: Logger): Promise<TestSuitesReport>;
}
export declare const suite: (description: string, callback: TestSuiteCallback) => void;
