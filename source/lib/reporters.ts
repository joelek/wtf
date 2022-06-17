import * as loggers from "./loggers";
import { JSON } from "./json";
import { Logger } from "./loggers";

export interface Reporter<A> {
	report(report: A): void;
};

export class JSONReporter implements Reporter<JSON> {
	private logger?: Logger;

	constructor(logger?: Logger) {
		this.logger = logger;
	}

	report(report: JSON): void {
		this.logger?.log(JSON.serialize(report) + "\n");
	}
};

export function getReporter(target: string | undefined): Reporter<any> | undefined {
	return new JSONReporter(loggers.getLogger(target));
};
