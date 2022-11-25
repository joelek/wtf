import * as loggers from "./loggers";
import { LOGGER_KEY, REPORTER_KEY } from "./env";
import { reporters } from ".";
import { Logger } from "./loggers";
import { Asserter } from "./asserters";
import * as terminal from "./terminal";

export type OptionallyAsync<A> = A | Promise<A>;

export type TestCaseCallback = (asserter: Asserter) => OptionallyAsync<void>;

export type TestCaseReport = {
	description: string;
	success: boolean;
	duration?: number;
	error?: string;
};

export const TestCaseReport = {
	is(subject: any): subject is TestCaseReport {
		let description = subject?.description;
		if (!(typeof description === "string")) {
			return false;
		}
		let success = subject?.success;
		if (!(typeof success === "boolean")) {
			return false;
		}
		let duration = subject?.duration;
		if (!(typeof duration === "number" || typeof duration === "undefined")) {
			return false;
		}
		let error = subject?.error;
		if (!(typeof error === "string" || typeof error === "undefined")) {
			return false;
		}
		return true;
	}
};

export class TestCase {
	private description: string;
	private callback: TestCaseCallback;

	private async doRun(logger?: Logger): Promise<TestCaseReport> {
		let description = this.description;
		let asserter = new Asserter();
		try {
			await this.callback(asserter);
			let success = true;
			return {
				description,
				success
			};
		} catch (throwable) {
			logger?.log(`Test case ${terminal.stylize("\"" +  description + "\"", terminal.FG_RED)} raised an error!\n`);
			let error: string | undefined;
			if (throwable instanceof Error) {
				let message = throwable.stack ?? throwable.message;
				logger?.log(`${terminal.stylize(message, terminal.FG_RED)}\n`);
				error = throwable.message;
			}
			let success = false;
			return {
				description,
				success,
				error
			};
		}
	}

	constructor(description: string, callback: TestCaseCallback) {
		this.description = description;
		this.callback = callback;
	}

	async run(logger?: Logger): Promise<TestCaseReport> {
		let start = process.hrtime.bigint();
		let report = await this.doRun(logger);
		let duration = Number(process.hrtime.bigint() - start) / 1000 / 1000;
		report.duration = duration;
		return report;
	}
};

export type TestCollectionReport = {
	reports: Array<TestCaseReport>;
	success: boolean;
};

export const TestCollectionReport = {
	is(subject: any): subject is TestCollectionReport {
		let reports = subject?.reports;
		if (!(typeof reports === "object" && reports instanceof Array)) {
			return false;
		}
		for (let report of reports) {
			if (!(TestCaseReport.is(report))) {
				return false;
			}
		}
		let success = subject?.success;
		if (!(typeof success === "boolean")) {
			return false;
		}
		return true;
	}
};

export class TestCollection {
	private testCases: Array<TestCase>;

	constructor() {
		this.testCases = [];
	}

	test(description: string, callback: TestCaseCallback): void {
		let testCase = new TestCase(description, callback);
		this.testCases.push(testCase);
	}

	async run(logger?: Logger): Promise<TestCollectionReport> {
		let reports = [] as Array<TestCaseReport>;
		let success = true;
		for (let testCase of this.testCases) {
			let report = await testCase.run(logger);
			reports.push(report);
			if (!report.success) {
				success = false;
			}
		}
		return {
			reports,
			success
		};
	}
};

export const test = (() => {
	let logger = loggers.getLogger(process.env[LOGGER_KEY] ?? "stdout");
	let reporter = reporters.getReporter(process.env[REPORTER_KEY] ?? undefined);
	let collection = new TestCollection();
	process.on("beforeExit", async () => {
		let report = await collection.run(logger);
		reporter?.report(report);
		let status = report.success ? 0 : 1;
		process.exit(status);
	});
	return collection.test.bind(collection);
})();
