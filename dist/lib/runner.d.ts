export declare function spawn(command: string, parameters: Array<string>): Promise<number | undefined>;
export interface Runner {
    matches(path: string): boolean;
    run(path: string): Promise<number | undefined>;
}
export declare class JavaScriptRunner implements Runner {
    constructor();
    matches(path: string): boolean;
    run(path: string): Promise<number | undefined>;
}
export declare class TypeScriptRunner implements Runner {
    constructor();
    matches(path: string): boolean;
    run(path: string): Promise<number | undefined>;
}
export declare type Subject = {
    runner: Runner;
    path: string;
};
export declare function scanDirectory(parentPath: string, runners: Array<Runner>): Array<Subject>;
export declare type Options = {
    paths?: Array<string>;
    runners?: Array<Runner>;
};
export declare function createDefaultPaths(): Array<string>;
export declare function createDefaultRunners(): Array<Runner>;
export declare type Outcome = {
    subject: Subject;
    status?: number;
};
export declare function run(options: Options): Promise<number>;
