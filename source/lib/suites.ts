export type TestCallback = () => Promise<void>;

export class TestCase {
	private description: string;
	private callback: TestCallback;

	constructor(description: string, callback: TestCallback) {
		this.description = description;
		this.callback = callback;
	}

	async run(): Promise<boolean> {
		try {
			await this.callback();
			return true;
		} catch (error) {
			console.log(`Case "${this.description}" raised an error:`);
			console.log(error);
			return false;
		}
	}
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

	async run(): Promise<number> {
		let failures = 0;
		for (let testCase of this.testCases) {
			let outcome = await testCase.run();
			if (!outcome) {
				failures += 1;
			}
		}
		return failures;
	}
};

export async function createTestSuite(description: string, callback: (suite: TestSuite) => Promise<void>): Promise<void> {
	let suite = new TestSuite(description);
	await callback(suite);
	let status = await suite.run();
	process.exit(status);
};
