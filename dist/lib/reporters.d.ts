import { SerializableData } from "./data";
import { Logger } from "./loggers";
export interface Reporter<A> {
    report(report: A): void;
}
export declare class JSONReporter implements Reporter<SerializableData> {
    private logger?;
    constructor(logger?: Logger);
    report(report: SerializableData): void;
}
export declare function getReporter(target: string | undefined): Reporter<any> | undefined;
