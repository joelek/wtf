import { Logger } from "./loggers";
export interface Reporter<A> {
    report(report: A): void;
}
export declare type JSON = boolean | null | number | string | undefined | JSON[] | {
    [key: string]: JSON;
};
export declare class JSONReporter implements Reporter<JSON> {
    private logger?;
    constructor(logger?: Logger);
    report(report: JSON): void;
}
