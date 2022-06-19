import { JSONData } from "./json";
import { Logger } from "./loggers";
export interface Reporter<A> {
    report(report: A): void;
}
export declare class JSONReporter implements Reporter<JSONData> {
    private logger?;
    constructor(logger?: Logger);
    report(report: JSONData): void;
}
export declare function getReporter(target: string | undefined): Reporter<any> | undefined;
