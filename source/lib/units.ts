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

export type TestGroupCallback = (group: TestGroup) => OptionallyAsync<void>;

export type TestGroupReport = {
	description: string;
	reports: Array<TestCaseReport>;
	success: boolean;
};

export class TestGroup {
	private description: string;
	private testCases: Array<TestCase>;
	private callback: TestGroupCallback;

	constructor(description: string, callback: TestGroupCallback) {
		this.description = description;
		this.testCases = [];
		this.callback = callback;
	}

	case(description: string, callback: TestCaseCallback): void {
		let testCase = new TestCase(description, callback);
		this.testCases.push(testCase);
	}

	async run(logger?: Logger): Promise<TestGroupReport> {
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

export type TestGroupsReport = {
	reports: Array<TestGroupReport>;
	success: boolean;
};

export class TestUnit {
	private testGroups: Array<TestGroup>;

	constructor() {
		this.testGroups = [];
	}

	group(description: string, callback: TestGroupCallback): void {
		let testGroup = new TestGroup(description, callback);
		this.testGroups.push(testGroup);
	}

	async run(logger?: Logger): Promise<TestGroupsReport> {
		let reports = [] as Array<TestGroupReport>;
		let success = true;
		for (let testGroup of this.testGroups) {
			let report = await testGroup.run(logger);
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

export const group = (() => {
	let logger = loggers.getLogger(process.env[LOGGER_KEY] ?? "stdout");
	let reporter = reporters.getReporter(process.env[REPORTER_KEY] ?? undefined);
	let unit = new TestUnit();
	process.on("beforeExit", async () => {
		let report = await unit.run(logger);
		reporter?.report(report);
		let status = report.success ? 0 : 1;
		process.exit(status);
	});
	return unit.group.bind(unit);
})();
