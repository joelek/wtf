/// <reference types="node" />
import { SerializableData } from "./data";
import { Logger } from "./loggers";
export declare type SpawnResult = {
    stdout: Buffer;
    stderr: Buffer;
    error?: Error;
    status?: number;
};
export declare function spawn(command: string, parameters: Array<string>, logger?: Logger, environment?: Record<string, string | undefined>): Promise<SpawnResult>;
export declare function parseIfPossible(string: string): SerializableData;
export declare type RunReport = {
    command: string;
    path: string;
    stdout: SerializableData;
    stderr: SerializableData;
    success: boolean;
    error?: string;
};
export declare type Runner = {
    pattern: string;
    command: string;
};
export declare const Runner: {
    matches(runner: Runner, path: string): boolean;
    run(runner: Runner, path: string, logger?: Logger, environment?: Record<string, string | undefined>): Promise<RunReport>;
};
export declare type Unit = {
    runner: Runner;
    path: string;
};
export declare function scanFilePath(path: string, runners: Array<Runner>, logger?: Logger): Array<Unit>;
export declare function scanDirectoryPath(parentPath: string, runners: Array<Runner>, logger?: Logger): Array<Unit>;
export declare function scanPath(path: string, runners: Array<Runner>, logger?: Logger): Array<Unit>;
export declare type Options = {
    logger?: string;
    paths?: Array<string>;
    reporter?: string;
    runners?: Array<Runner>;
};
export declare function createDefaultPaths(): Array<string>;
export declare function createDefaultRunners(): Array<Runner>;
export declare type Report = {
    reports: Array<RunReport>;
    success: boolean;
};
export declare function run(options: Options): Promise<number>;
