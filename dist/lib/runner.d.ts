/// <reference types="node" />
export declare type SpawnOutcome = {
    stdout: Buffer;
    stderr: Buffer;
    error?: Error;
    status?: number;
};
export declare function spawn(command: string, parameters: Array<string>): Promise<SpawnOutcome>;
export declare type RunLog = {
    path: string;
    runtime: string;
    stdout: string;
    stderr: string;
    error?: Error;
    status?: number;
};
export interface Runner {
    matches(path: string): boolean;
    run(path: string): Promise<RunLog>;
}
export declare class CustomRunner implements Runner {
    private suffix;
    private runtime;
    constructor(suffix: string, runtime: string);
    matches(path: string): boolean;
    run(path: string): Promise<RunLog>;
}
export declare class JavaScriptRunner extends CustomRunner {
    constructor();
}
export declare class TypeScriptRunner extends CustomRunner {
    constructor();
}
export declare type Subject = {
    runner: Runner;
    path: string;
};
export declare function scanFile(path: string, runners: Array<Runner>): Array<Subject>;
export declare function scanDirectory(parentPath: string, runners: Array<Runner>): Array<Subject>;
export declare function scanPath(path: string, runners: Array<Runner>): Array<Subject>;
export declare type Options = {
    paths?: Array<string>;
    runners?: Array<Runner>;
};
export declare function createDefaultPaths(): Array<string>;
export declare function createDefaultRunners(): Array<Runner>;
export declare type Log = {
    suites: Array<RunLog>;
    status: number;
};
export declare function run(options: Options): Promise<Log>;
