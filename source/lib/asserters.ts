import { JSONData, JSONPath } from "./json";

export function getTypename(subject: any): string {
	if (subject === null) {
		return "null";
	}
	if (typeof subject?.constructor?.name === "string") {
		return subject.constructor.name;
	}
	return typeof subject;
};

export class IncorrectTypeError extends Error {
	private expected: JSONData;
	private observed: JSONData;
	private path: JSONPath;

	get message(): string {
		return `Expected type ${getTypename(this.observed)} to be ${getTypename(this.expected)} for ${JSONPath.serialize(this.path)}!`;
	}

	constructor(expected: JSONData, observed: JSONData, path: JSONPath) {
		super();
		this.expected = expected;
		this.observed = observed;
		this.path = path;
	}
};

export class IncorrectValueError extends Error {
	private expected: JSONData;
	private observed: JSONData;
	private path: JSONPath;

	get message(): string {
		return `Expected value ${JSONData.serialize(this.observed)} to be ${JSONData.serialize(this.expected)} for ${JSONPath.serialize(this.path)}!`;
	}

	constructor(expected: JSONData, observed: JSONData, path: JSONPath) {
		super();
		this.expected = expected;
		this.observed = observed;
		this.path = path;
	}
};

export class MissingElementError extends Error {
	private path: JSONPath;

	get message(): string {
		return `Expected element to be present for ${JSONPath.serialize(this.path)}!`;
	}

	constructor(path: JSONPath) {
		super();
		this.path = path;
	}
};

export class UnexpectedElementError extends Error {
	private path: JSONPath;

	get message(): string {
		return `Expected element to be absent for ${JSONPath.serialize(this.path)}!`;
	}

	constructor(path: JSONPath) {
		super();
		this.path = path;
	}
};

export class MissingMemberError extends Error {
	private path: JSONPath;

	get message(): string {
		return `Expected member to be present for ${JSONPath.serialize(this.path)}!`;
	}

	constructor(path: JSONPath) {
		super();
		this.path = path;
	}
};

export class UnexpectedMemberError extends Error {
	private path: JSONPath;

	get message(): string {
		return `Expected member to be absent for ${JSONPath.serialize(this.path)}!`;
	}

	constructor(path: JSONPath) {
		super();
		this.path = path;
	}
};

export class ExpectedThrowError extends Error {
	get message(): string {
		return `Expected operation to throw an error!`;
	}

	constructor() {
		super();
	}
};

export class Asserter {
	private equalsArray(expected: JSONData & Array<JSONData>, observed: JSONData, path: JSONPath): void {
		if (!(observed instanceof Array)) {
			throw new IncorrectTypeError(expected, observed, path);
		}
		for (let i = observed.length; i < expected.length; i++) {
			throw new MissingElementError([...path, i]);
		}
		for (let i = expected.length; i < observed.length; i++) {
			throw new UnexpectedElementError([...path, i]);
		}
		for (let i = 0; i < expected.length; i++) {
			this.equalsJSON(expected[i], observed[i], [...path, i]);
		}
	}

	private equalsBoolean(expected: JSONData & boolean, observed: JSONData, path: JSONPath): void {
		if (!(typeof observed === "boolean")) {
			throw new IncorrectTypeError(expected, observed, path);
		}
		if (expected !== observed) {
			throw new IncorrectValueError(expected, observed, path);
		}
	}

	private equalsNull(expected: JSONData & null, observed: JSONData, path: JSONPath): void {
		if (!(observed === null)) {
			throw new IncorrectTypeError(expected, observed, path);
		}
	}

	private equalsNumber(expected: JSONData & number, observed: JSONData, path: JSONPath): void {
		if (!(typeof observed === "number")) {
			throw new IncorrectTypeError(expected, observed, path);
		}
		if (expected !== observed) {
			throw new IncorrectValueError(expected, observed, path);
		}
	}

	private equalsObject(expected: JSONData & Record<string, JSONData>, observed: JSONData, path: JSONPath): void {
		if (!(observed instanceof Object && !(observed instanceof Array))) {
			throw new IncorrectTypeError(expected, observed, path);
		}
		for (let key in expected) {
			if (!(key in observed)) {
				throw new MissingMemberError([...path, key]);
			}
		}
		for (let key in observed) {
			if (!(key in expected)) {
				throw new UnexpectedMemberError([...path, key]);
			}
		}
		for (let key in expected) {
			this.equalsJSON(expected[key], observed[key], [...path, key]);
		}
	}

	private equalsString(expected: JSONData & string, observed: JSONData, path: JSONPath): void {
		if (!(typeof observed === "string")) {
			throw new IncorrectTypeError(expected, observed, path);
		}
		if (expected !== observed) {
			throw new IncorrectValueError(expected, observed, path);
		}
	}

	private equalsUndefined(expected: JSONData & undefined, observed: JSONData, path:JSONPath): void {
		if (!(observed === undefined)) {
			throw new IncorrectTypeError(expected, observed, path);
		}
	}

	private equalsJSON(expected: JSONData, observed: JSONData, path: JSONPath): void {
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
	}

	constructor() {}

	equals(expected: JSONData, observed: JSONData): void {
		this.equalsJSON(expected, observed, []);
	}

	async throws<A>(operation: Promise<A> | (() => Promise<A>) | (() => A)): Promise<void> {
		let callback = operation instanceof Promise ? () => operation : operation;
		try {
			await callback();
		} catch (error) {
			return;
		}
		throw new ExpectedThrowError();
	}
};
