/// <reference types="node" />
import { JSON } from "./json";
import { Logger } from "./loggers";
import { Reporter } from "./reporters";
export declare type SpawnResult = {
    stdout: Buffer;
    stderr: Buffer;
    error?: Error;
    status?: number;
};
export declare function spawn(command: string, parameters: Array<string>, logger?: Logger): Promise<SpawnResult>;
export declare type RunReport = {
    command: string;
    path: string;
    stdout: string;
    stderr: string;
    error?: JSON;
    status?: number;
};
export interface Runner {
    matches(path: string): boolean;
    run(path: string, logger?: Logger): Promise<RunReport>;
}
export declare class CustomRunner implements Runner {
    private suffix;
    private command;
    constructor(suffix: string, command: string);
    matches(path: string): boolean;
    run(path: string, logger?: Logger): Promise<RunReport>;
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
export declare function scanFilePath(path: string, runners: Array<Runner>, logger?: Logger): Array<Runnable>;
export declare function scanDirectoryPath(parentPath: string, runners: Array<Runner>, logger?: Logger): Array<Runnable>;
export declare function scanPath(path: string, runners: Array<Runner>, logger?: Logger): Array<Runnable>;
export declare type Options = {
    logger?: Logger;
    paths?: Array<string>;
    reporter?: Reporter<any>;
    runners?: Array<Runner>;
};
export declare function createDefaultPaths(): Array<string>;
export declare function createDefaultRunners(): Array<Runner>;
export declare type Report = {
    reports: Array<RunReport>;
    status: number;
};
export declare function run(options: Options): Promise<number>;
