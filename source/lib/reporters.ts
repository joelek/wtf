import { Logger } from "./loggers";

export interface Reporter<A> {
	report(report: A): void;
};

export type JSON = boolean | null | number | string | undefined | JSON[] | {
	[key: string]: JSON;
};

export class JSONReporter implements Reporter<JSON> {
	private logger?: Logger;

	constructor(logger?: Logger) {
		this.logger = logger;
	}

	report(report: JSON): void {
		this.logger?.log(globalThis.JSON.stringify(report != null ? report : null, null, "\t") + "\n");
	}
};
