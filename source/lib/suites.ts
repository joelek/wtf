import * as loggers from "./loggers";
import { SerializedError } from "./errors";
import { JSON } from "./json";
import { JSONReporter } from "./reporters";

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

	async run(): Promise<TestCaseReport> {
		let description = this.description;
		try {
			await this.callback();
			return {
				description
			};
		} catch (throwable) {
			let error = throwable instanceof Error ? SerializedError.fromError(throwable) : JSON.parse(JSON.serialize(throwable as any));
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

	async run(): Promise<TestSuiteReport> {
		let reports = [] as Array<TestCaseReport>;
		let status = 0;
		for (let testCase of this.testCases) {
			let report = await testCase.run();
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
	let suite = new TestSuite(description);
	await callback(suite);
	let report = await suite.run();
	let logger = loggers.stderr;
	let reporter = new JSONReporter(logger);
	reporter.report(report);
	process.exit(report.status);
};
