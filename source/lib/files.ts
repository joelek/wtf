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
	error?: string;
};

export class TestCase {
	private description: string;
	private callback: TestCaseCallback;

	constructor(description: string, callback: TestCaseCallback) {
		this.description = description;
		this.callback = callback;
	}

	async run(logger?: Logger): Promise<TestCaseReport> {
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
				logger?.log(`${throwable.stack ?? throwable.message}\n`);
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
};

export type TestCollectionReport = {
	reports: Array<TestCaseReport>;
	success: boolean;
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
