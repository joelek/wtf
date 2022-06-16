import { Logger } from "./loggers";

export type RunReport = {
	command: string;
	path: string;
	stdout: string;
	stderr: string;
	error?: Error;
	status?: number;
};

export type Error = {
	name: string;
	message: string;
	stack?: string;
};

export type Report = {
	reports: Array<RunReport>;
	status: number;
};

export interface Reporter {
	report(report: Report): void;
};

export class JSONReporter implements Reporter {
	private logger?: Logger;

	constructor(logger?: Logger) {
		this.logger = logger;
	}

	report(report: Report): void {
		this.logger?.log(JSON.stringify(report, null, "\t") + "\n");
	}
};
