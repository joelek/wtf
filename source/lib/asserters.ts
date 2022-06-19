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

export function serializePath(path: Array<string | number>): string {
	let strings = ["observed"] as Array<string>;
	for (let part of path) {
		if (typeof part === "string") {
			if (/^[a-z_][a-z_0-9]*$/i.test(part)) {
				strings.push(`.${part}`);
			} else {
				strings.push(`.${JSON.serialize(part)}`);
			}
			continue;
		}
		if (typeof part === "number") {
			strings.push(`[${part}]`);
			continue;
		}
	}
	return strings.join("");
};

export class Asserter {
	private equalsArray(expected: JSON & Array<JSON>, observed: JSON, path: Array<string | number>): void {
		if (!(observed instanceof Array)) {
			throw `Expected type ${getTypename(observed)} to be ${getTypename(expected)} at ${serializePath(path)}!`;
		}
		for (let i = observed.length; i < expected.length; i++) {
			throw `Expected element to be present at ${serializePath([...path, i])}!`;
		}
		for (let i = expected.length; i < observed.length; i++) {
			throw `Expected element to be absent at ${serializePath([...path, i])}!`;
		}
		for (let i = 0; i < expected.length; i++) {
			this.equals(expected[i], observed[i], [...path, i]);
		}
	}

	private equalsBoolean(expected: JSON & boolean, observed: JSON, path: Array<string | number>): void {
		if (!(typeof observed === "boolean")) {
			throw `Expected type ${getTypename(observed)} to be ${getTypename(expected)} at ${serializePath(path)}!`;
		}
		if (expected !== observed) {
			throw `Expected value ${observed} to be ${expected} at ${serializePath(path)}!`;
		}
	}

	private equalsNull(expected: JSON & null, observed: JSON, path: Array<string | number>): void {
		if (!(observed === null)) {
			throw `Expected type ${getTypename(observed)} to be ${getTypename(expected)} at ${serializePath(path)}!`;
		}
	}

	private equalsNumber(expected: JSON & number, observed: JSON, path: Array<string | number>): void {
		if (!(typeof observed === "number")) {
			throw `Expected type ${getTypename(observed)} to be ${getTypename(expected)} at ${serializePath(path)}!`;
		}
		if (expected !== observed) {
			throw `Expected value ${observed} to be ${expected} at ${serializePath(path)}!`;
		}
	}

	private equalsObject(expected: JSON & Record<string, JSON>, observed: JSON, path: Array<string | number>): void {
		if (!(observed instanceof Object && !(observed instanceof Array))) {
			throw `Expected type ${getTypename(observed)} to be ${getTypename(expected)} at ${serializePath(path)}!`;
		}
		for (let key in expected) {
			if (!(key in observed)) {
				throw `Expected member to be present at ${serializePath([...path, key])}!`;
			}
		}
		for (let key in observed) {
			if (!(key in expected)) {
				throw `Expected member to be absent at ${serializePath([...path, key])}!`;
			}
		}
		for (let key in expected) {
			this.equals(expected[key], observed[key], [...path, key]);
		}
	}

	private equalsString(expected: JSON & string, observed: JSON, path: Array<string | number>): void {
		if (!(typeof observed === "string")) {
			throw `Expected type ${getTypename(observed)} to be ${getTypename(expected)} at ${serializePath(path)}!`;
		}
		if (expected !== observed) {
			throw `Expected value "${observed}" to be "${expected}" at ${serializePath(path)}!`;
		}
	}

	private equalsUndefined(expected: JSON & undefined, observed: JSON, path: Array<string | number>): void {
		if (!(observed === undefined)) {
			throw `Expected type ${getTypename(observed)} to be ${getTypename(expected)} at ${serializePath(path)}!`;
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
