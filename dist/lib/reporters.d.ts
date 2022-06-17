import { JSON } from "./json";
import { Logger } from "./loggers";
export interface Reporter<A> {
    report(report: A): void;
}
export declare class JSONReporter implements Reporter<JSON> {
    private logger?;
    constructor(logger?: Logger);
    report(report: JSON): void;
}
export declare function getReporter(target: string | undefined): Reporter<any> | undefined;
