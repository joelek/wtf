/// <reference types="node" />
/// <reference types="node" />
import { SerializableData } from "./data";
import { Logger } from "./loggers";
import { TestCaseReport } from "./files";
export declare type SpawnResult = {
    stdout: Buffer;
    stderr: Buffer;
    error?: Error;
    status?: number;
};
export declare class SpawnSignalError extends Error {
    private signal;
    get message(): string;
    constructor(signal: NodeJS.Signals);
}
export declare function spawn(command: string, parameters: Array<string>, logger?: Logger, environment?: Record<string, string | undefined>, timeout?: number): Promise<SpawnResult>;
export declare function parseIfPossible(string: string): SerializableData;
export declare type Counter = {
    pass: number;
    fail: number;
};
export declare type RunReport = {
    command: string;
    path: string;
    stdout: SerializableData;
    stderr: SerializableData;
    success: boolean;
    duration: number;
    counter?: Counter;
    error?: string;
};
export declare type Runner = {
    pattern: string;
    command: string;
};
export declare function getCounterFromReport(reports: Array<TestCaseReport>): Counter;
export declare const Runner: {
    matches(runner: Runner, path: string): boolean;
    run(runner: Runner, path: string, logger?: Logger, environment?: Record<string, string | undefined>, timeout?: number): Promise<RunReport>;
};
export declare type File = {
    runner: Runner;
    path: string;
};
export declare function scanFilePath(path: string, runners: Array<Runner>, logger?: Logger): Array<File>;
export declare function scanDirectoryPath(parentPath: string, runners: Array<Runner>, logger?: Logger): Array<File>;
export declare function scanPath(path: string, runners: Array<Runner>, logger?: Logger): Array<File>;
export declare type Options = {
    logger?: string;
    paths?: Array<string>;
    reporter?: string;
    runners?: Array<Runner>;
    timeout?: number;
};
export declare const Options: {
    is(subject: any): subject is Options;
};
export declare function createDefaultPaths(): Array<string>;
export declare function createDefaultRunners(): Array<Runner>;
export declare type Report = {
    reports: Array<RunReport>;
    success: boolean;
    counter?: Counter;
};
export declare function run(options: Options): Promise<number>;
export declare class ConfigFormatError extends Error {
    get message(): string;
    constructor();
}
export declare function loadConfig(path: string): Options;
