import * as loggers from "./loggers";
import { LOGGER_KEY, REPORTER_KEY } from "./env";
import { reporters } from ".";
import { Logger } from "./loggers";
import { Asserter } from "./asserters";

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
			logger?.log(`Test "${description}" raised an error!\n`);
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

export type TestSuiteCallback = (suite: TestSuite) => OptionallyAsync<void>;

export type TestSuiteReport = {
	description: string;
	reports: Array<TestCaseReport>;
	success: boolean;
};

export class TestSuite {
	private description: string;
	private testCases: Array<TestCase>;
	private callback: TestSuiteCallback;

	constructor(description: string, callback: TestSuiteCallback) {
		this.description = description;
		this.testCases = [];
		this.callback = callback;
	}

	defineTestCase(description: string, callback: TestCaseCallback): void {
		let testCase = new TestCase(description, callback);
		this.testCases.push(testCase);
	}

	async run(logger?: Logger): Promise<TestSuiteReport> {
		await this.callback(this);
		let description = this.description;
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
			description,
			reports,
			success
		};
	}
};

export type TestSuitesReport = {
	reports: Array<TestSuiteReport>;
	success: boolean;
};

export class TestSuites {
	private testSuites: Array<TestSuite>;

	constructor() {
		this.testSuites = [];
	}

	createTestSuite(description: string, callback: TestSuiteCallback): void {
		let testSuite = new TestSuite(description, callback);
		this.testSuites.push(testSuite);
	}

	async run(logger?: Logger): Promise<TestSuitesReport> {
		let reports = [] as Array<TestSuiteReport>;
		let success = true;
		for (let testSuite of this.testSuites) {
			let report = await testSuite.run(logger);
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

export const createTestSuite = (() => {
	let logger = loggers.getLogger(process.env[LOGGER_KEY] ?? "stdout");
	let reporter = reporters.getReporter(process.env[REPORTER_KEY] ?? undefined);
	let suites = new TestSuites();
	process.on("beforeExit", async () => {
		let report = await suites.run(logger);
		reporter?.report(report);
		let status = report.success ? 0 : 1;
		process.exit(status);
	});
	return suites.createTestSuite.bind(suites);
})();
