import * as loggers from "./loggers";
import { SerializedError } from "./errors";
import { JSON } from "./json";
import { LOGGER_KEY, REPORTER_KEY } from "./env";
import { reporters } from ".";
import { Logger } from "./loggers";

export type TestCallback = () => Promise<void>;

export type TestCaseReport = {
	description: string;
	error?: JSON;
};

export class TestCase {
	private description: string;
	private callback: TestCallback;

	constructor(description: string, callback: TestCallback) {
		this.description = description;
		this.callback = callback;
	}

	async run(logger?: Logger): Promise<TestCaseReport> {
		let description = this.description;
		try {
			await this.callback();
			return {
				description
			};
		} catch (throwable) {
			logger?.log(`Test "${description}" raised an error!\n`);
			let error = throwable instanceof Error ? SerializedError.fromError(throwable) : JSON.parse(JSON.serialize(throwable as any));
			let lines = JSON.serialize(error).split(/\r?\n/);
			for (let line of lines) {
				logger?.log(`\t${line}\n`);
			}
			return {
				description,
				error
			};
		}
	}
};

export type TestSuiteReport = {
	reports: Array<TestCaseReport>;
	status: number;
};

export class TestSuite {
	private description: string;
	private testCases: Array<TestCase>;

	constructor(description: string) {
		this.description = description;
		this.testCases = [];
	}

	defineTestCase(description: string, callback: TestCallback): void {
		let testCase = new TestCase(description, callback);
		this.testCases.push(testCase);
	}

	async run(logger?: Logger): Promise<TestSuiteReport> {
		let reports = [] as Array<TestCaseReport>;
		let status = 0;
		for (let testCase of this.testCases) {
			let report = await testCase.run(logger);
			reports.push(report);
			if (report.error != null) {
				status += 1;
			}
		}
		return {
			reports,
			status
		};
	}
};

export async function createTestSuite(description: string, callback: (suite: TestSuite) => Promise<void>): Promise<void> {
	let logger = loggers.getLogger(process.env[LOGGER_KEY]);
	let reporter = reporters.getReporter(process.env[REPORTER_KEY]);
	let suite = new TestSuite(description);
	await callback(suite);
	let report = await suite.run(logger);
	reporter?.report(report);
	process.exit(report.status);
};
