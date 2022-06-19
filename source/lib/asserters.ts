import { SerializedError } from "./errors";
import { JSON } from "./json";

export function getTypename(subject: any): string {
	if (subject === null) {
		return "null";
	}
	if (typeof subject?.constructor?.name === "string") {
		return subject.constructor.name;
	}
	return typeof subject;
};

export class Asserter {
	private equalsArray(expected: JSON & Array<JSON>, observed: JSON, path: Array<string | number>): void {
		if (!(observed instanceof Array)) {
			throw `Expected type ${getTypename(observed)} to be ${getTypename(expected)}!`;
		}
		for (let i = observed.length; i < expected.length; i++) {
			throw `Expected element ${i} to be present!`;
		}
		for (let i = expected.length; i < observed.length; i++) {
			throw `Expected element ${i} to be absent!`;
		}
		for (let i = 0; i < expected.length; i++) {
			this.equals(expected[i], observed[i], [...path, i]);
		}
	}

	private equalsBoolean(expected: JSON & boolean, observed: JSON, path: Array<string | number>): void {
		if (!(typeof observed === "boolean")) {
			throw `Expected type ${getTypename(observed)} to be ${getTypename(expected)}!`;
		}
		if (expected !== observed) {
			throw `Expected value ${observed} to be ${expected}!`;
		}
	}

	private equalsNull(expected: JSON & null, observed: JSON, path: Array<string | number>): void {
		if (!(observed === null)) {
			throw `Expected type ${getTypename(observed)} to be ${getTypename(expected)}!`;
		}
	}

	private equalsNumber(expected: JSON & number, observed: JSON, path: Array<string | number>): void {
		if (!(typeof observed === "number")) {
			throw `Expected type ${getTypename(observed)} to be ${getTypename(expected)}!`;
		}
		if (expected !== observed) {
			throw `Expected value ${observed} to be ${expected}!`;
		}
	}

	private equalsObject(expected: JSON & Record<string, JSON>, observed: JSON, path: Array<string | number>): void {
		if (!(observed instanceof Object && !(observed instanceof Array))) {
			throw `Expected type ${getTypename(observed)} to be ${getTypename(expected)}!`;
		}
		for (let key in expected) {
			if (!(key in observed)) {
				throw `Expected key "${key}" to be present!`;
			}
		}
		for (let key in observed) {
			if (!(key in expected)) {
				throw `Expected key "${key}" to be absent!`;
			}
		}
		for (let key in expected) {
			this.equals(expected[key], observed[key], [...path, key]);
		}
	}

	private equalsString(expected: JSON & string, observed: JSON, path: Array<string | number>): void {
		if (!(typeof observed === "string")) {
			throw `Expected type ${getTypename(observed)} to be ${getTypename(expected)}!`;
		}
		if (expected !== observed) {
			throw `Expected value "${observed}" to be "${expected}"!`;
		}
	}

	private equalsUndefined(expected: JSON & undefined, observed: JSON, path: Array<string | number>): void {
		if (!(observed === undefined)) {
			throw `Expected type ${getTypename(observed)} to be ${getTypename(expected)}!`;
		}
	}

	constructor() {}

	equals(expected: JSON, observed: JSON, path: Array<string | number> = []): void {
		try {
			if (expected instanceof Array) {
				return this.equalsArray(expected, observed, path);
			}
			if (typeof expected === "boolean") {
				return this.equalsBoolean(expected, observed, path);
			}
			if (expected === null) {
				return this.equalsNull(expected, observed, path);
			}
			if (typeof expected === "number") {
				return this.equalsNumber(expected, observed, path);
			}
			if (expected instanceof Object && !(expected instanceof Array)) {
				return this.equalsObject(expected, observed, path);
			}
			if (typeof expected === "string") {
				return this.equalsString(expected, observed, path);
			}
			if (expected === undefined) {
				return this.equalsUndefined(expected, observed, path);
			}
		} catch (throwable) {
			let error = throwable instanceof Error ? SerializedError.fromError(throwable) : JSON.parse(JSON.serialize(throwable as any));
			throw {
				error,
				path,
				expected,
				observed
			};
		}
	}

	async throws<A>(operation: Promise<A> | (() => Promise<A>) | (() => A)): Promise<void> {
		let callback = operation instanceof Promise ? () => operation : operation;
		try {
			await callback();
		} catch (error) {
			return;
		}
		let error = SerializedError.fromError(new Error(`Expected operation to throw an error!`));
		throw {
			error
		};
	}
};

export const asserter = new Asserter();
