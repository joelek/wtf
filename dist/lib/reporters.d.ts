import { Logger } from "./loggers";
export declare type RunReport = {
    command: string;
    path: string;
    stdout: string;
    stderr: string;
    error?: Error;
    status?: number;
};
export declare type Error = {
    name: string;
    message: string;
    stack?: string;
};
export declare type Report = {
    reports: Array<RunReport>;
    status: number;
};
export interface Reporter {
    report(report: Report): void;
}
export declare class JSONReporter implements Reporter {
    private logger?;
    constructor(logger?: Logger);
    report(report: Report): void;
}
