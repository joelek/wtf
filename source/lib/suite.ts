export type TestCallback = () => Promise<void>;

export class Test {
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
			console.log(`Failure: "${this.description}" raised an error.`);
			console.log(error);
			return false;
		}
	}
};

export class Suite {
	private name: string;
	private tests: Array<Test>;

	constructor(name: string) {
		this.name = name;
		this.tests = [];
	}

	defineTest(description: string, callback: TestCallback): void {
		let test = new Test(description, callback);
		this.tests.push(test);
	}

	async run(): Promise<number> {
		let failures = 0;
		for (let test of this.tests) {
			let outcome = await test.run();
			if (!outcome) {
				failures += 1;
			}
		}
		return failures;
	}
};

export async function createSuite(name: string, callback: (suite: Suite) => Promise<void>): Promise<void> {
	let suite = new Suite(name);
	await callback(suite);
	let status = await suite.run();
	process.exit(status);
};
