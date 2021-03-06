/// <reference types="node" />
export interface Logger {
    log(string: string): void;
}
export declare class WriteStreamLogger implements Logger {
    private stream;
    constructor(stream: NodeJS.WriteStream);
    log(chunk: string | Uint8Array): void;
}
export declare class StdoutLogger extends WriteStreamLogger {
    constructor();
}
export declare class StderrLogger extends WriteStreamLogger {
    constructor();
}
export declare const stdout: StdoutLogger;
export declare const stderr: StderrLogger;
export declare function getLogger(target: string | undefined): Logger | undefined;
