import * as loggers from "./loggers";
import { JSONData } from "./json";
import { Logger } from "./loggers";

export interface Reporter<A> {
	report(report: A): void;
};

export class JSONReporter implements Reporter<JSONData> {
	private logger?: Logger;

	constructor(logger?: Logger) {
		this.logger = logger;
	}

	report(report: JSONData): void {
		this.logger?.log(JSONData.serialize(report) + "\n");
	}
};

export function getReporter(target: string | undefined): Reporter<any> | undefined {
	return new JSONReporter(loggers.getLogger(target));
};
