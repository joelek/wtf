/// <reference types="node" />
export declare type SpawnResult = {
    stdout: Buffer;
    stderr: Buffer;
    error?: Error;
    status?: number;
};
export declare function spawn(command: string, parameters: Array<string>): Promise<SpawnResult>;
export declare type SerializedError = {
    name: string;
    message: string;
    stack?: string;
};
export declare function serializeError(error: Error): SerializedError;
export declare type Log = {
    command: string;
    path: string;
    stdout: string;
    stderr: string;
    error?: SerializedError;
    status?: number;
};
export interface Runner {
    matches(path: string): boolean;
    run(path: string): Promise<Log>;
}
export declare class CustomRunner implements Runner {
    private suffix;
    private command;
    constructor(suffix: string, command: string);
    matches(path: string): boolean;
    run(path: string): Promise<Log>;
}
export declare class JavaScriptRunner extends CustomRunner {
    constructor();
}
export declare class TypeScriptRunner extends CustomRunner {
    constructor();
}
export declare type Runnable = {
    runner: Runner;
    path: string;
};
export declare function scanFilePath(path: string, runners: Array<Runner>): Array<Runnable>;
export declare function scanDirectoryPath(parentPath: string, runners: Array<Runner>): Array<Runnable>;
export declare function scanPath(path: string, runners: Array<Runner>): Array<Runnable>;
export declare type Options = {
    paths?: Array<string>;
    runners?: Array<Runner>;
};
export declare function createDefaultPaths(): Array<string>;
export declare function createDefaultRunners(): Array<Runner>;
export declare type RunResult = {
    logs: Array<Log>;
    status: number;
};
export declare function run(options: Options): Promise<RunResult>;
