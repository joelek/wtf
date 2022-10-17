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
export declare type TestGroupCallback = (group: TestGroup) => OptionallyAsync<void>;
export declare type TestGroupReport = {
    description: string;
    reports: Array<TestCaseReport>;
    success: boolean;
};
export declare class TestGroup {
    private description;
    private testCases;
    private callback;
    constructor(description: string, callback: TestGroupCallback);
    case(description: string, callback: TestCaseCallback): void;
    run(logger?: Logger): Promise<TestGroupReport>;
}
export declare type TestGroupsReport = {
    reports: Array<TestGroupReport>;
    success: boolean;
};
export declare class TestUnit {
    private testGroups;
    constructor();
    group(description: string, callback: TestGroupCallback): void;
    run(logger?: Logger): Promise<TestGroupsReport>;
}
export declare const group: (description: string, callback: TestGroupCallback) => void;
