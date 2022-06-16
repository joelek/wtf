export declare type TestCallback = () => Promise<void>;
export declare class TestCase {
    private description;
    private callback;
    constructor(description: string, callback: TestCallback);
    run(): Promise<boolean>;
}
export declare class TestSuite {
    private name;
    private testCases;
    constructor(name: string);
    defineTestCase(description: string, callback: TestCallback): void;
    run(): Promise<number>;
}
export declare function createTestSuite(name: string, callback: (suite: TestSuite) => Promise<void>): Promise<void>;
