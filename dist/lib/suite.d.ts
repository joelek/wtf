export declare type TestCallback = () => Promise<void>;
export declare class Test {
    private description;
    private callback;
    constructor(description: string, callback: TestCallback);
    run(): Promise<boolean>;
}
export declare class Suite {
    private name;
    private tests;
    constructor(name: string);
    defineTest(description: string, callback: TestCallback): void;
    run(): Promise<number>;
}
export declare function createSuite(name: string, callback: (suite: Suite) => Promise<void>): Promise<void>;
