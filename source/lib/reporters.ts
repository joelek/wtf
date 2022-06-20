import * as loggers from "./loggers";
import { SerializableData } from "./json";
import { Logger } from "./loggers";

export interface Reporter<A> {
	report(report: A): void;
};

export class JSONReporter implements Reporter<SerializableData> {
	private logger?: Logger;

	constructor(logger?: Logger) {
		this.logger = logger;
	}

	report(report: SerializableData): void {
		this.logger?.log(SerializableData.serialize(report) + "\n");
	}
};

export function getReporter(target: string | undefined): Reporter<any> | undefined {
	return new JSONReporter(loggers.getLogger(target));
};
