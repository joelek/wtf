import { JSON } from "./json";
/*
export function getTypename(subject: any): string {
	if (subject === null) {
		return "null";
	}
	if (typeof subject?.constructor?.name === "string") {
		return subject.constructor.name;
	}
	return typeof subject;
};
 */

export class Asserter {
	private equalsArray(expected: JSON & Array<JSON>, observed: JSON): boolean {
		if (!(observed instanceof Array)) {
			return false;
		}
		for (let i = observed.length; i < expected.length; i++) {
			return false;
		}
		for (let i = expected.length; i < observed.length; i++) {
			return false;
		}
		for (let i = 0; i < expected.length; i++) {
			if (!this.equals(expected[i], observed[i])) {
				return false;
			}
		}
		return true;
	}

	private equalsBoolean(expected: JSON & boolean, observed: JSON): boolean {
		if (!(typeof observed === "boolean")) {
			return false;
		}
		if (expected !== observed) {
			return false;
		}
		return true;
	}

	private equalsNull(expected: JSON & null, observed: JSON): boolean {
		if (!(observed === null)) {
			return false;
		}
		if (expected !== observed) {
			return false;
		}
		return true;
	}

	private equalsNumber(expected: JSON & number, observed: JSON): boolean {
		if (!(typeof observed === "number")) {
			return false;
		}
		if (expected !== observed) {
			return false;
		}
		return true;
	}

	private equalsObject(expected: JSON & Record<string, JSON>, observed: JSON): boolean {
		if (!(observed instanceof Object && !(observed instanceof Array))) {
			return false;
		}
		for (let key in expected) {
			if (!(key in observed)) {
				return false;
			}
		}
		for (let key in observed) {
			if (!(key in expected)) {
				return false;
			}
		}
		for (let key in expected) {
			if (!this.equals(expected[key], observed[key])) {
				return false;
			}
		}
		return true;
	}

	private equalsString(expected: JSON & string, observed: JSON): boolean {
		if (!(typeof observed === "string")) {
			return false;
		}
		if (expected !== observed) {
			return false;
		}
		return true;
	}

	private equalsUndefined(expected: JSON & undefined, observed: JSON): boolean {
		if (!(observed === undefined)) {
			return false;
		}
		if (expected !== observed) {
			return false;
		}
		return true;
	}

	private equals(expected: JSON, observed: JSON): boolean {
		if (expected instanceof Array) {
			return this.equalsArray(expected, observed);
		}
		if (typeof expected === "boolean") {
			return this.equalsBoolean(expected, observed);
		}
		if (expected === null) {
			return this.equalsNull(expected, observed);
		}
		if (typeof expected === "number") {
			return this.equalsNumber(expected, observed);
		}
		if (expected instanceof Object) {
			return this.equalsObject(expected, observed);
		}
		if (typeof expected === "string") {
			return this.equalsString(expected, observed);
		}
		if (expected === undefined) {
			return this.equalsUndefined(expected, observed);
		}
		return false;
	}

	constructor() {}

	json(expected: JSON, observed: JSON): void {
		if (!this.equals(expected, observed)) {
			throw {
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
		throw new Error(`Expected operation to throw an error!`);
	}
};

export const asserter = new Asserter();
