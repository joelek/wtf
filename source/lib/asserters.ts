import { JSONArray, JSONData, JSONObject, JSONPath } from "./json";

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
	private observed: JSONData;
	private expected: JSONData;
	private path: JSONPath;

	get message(): string {
		return `Expected type for observed${JSONPath.serialize(this.path)} (${getTypename(this.observed)}) to be ${getTypename(this.expected)}!`;
	}

	constructor(observed: JSONData, expected: JSONData,path: JSONPath) {
		super();
		this.observed = observed;
		this.expected = expected;
		this.path = path;
	}
};

export class IncorrectValueError extends Error {
	private observed: JSONData;
	private expected: JSONData;
	private path: JSONPath;

	get message(): string {
		return `Expected value for observed${JSONPath.serialize(this.path)} (${JSONData.serialize(this.observed)}) to be ${JSONData.serialize(this.expected)}!`;
	}

	constructor(observed: JSONData, expected: JSONData, path: JSONPath) {
		super();
		this.observed = observed;
		this.expected = expected;
		this.path = path;
	}
};

export class MissingElementError extends Error {
	private path: JSONPath;

	get message(): string {
		return `Expected element observed${JSONPath.serialize(this.path)} to be present!`;
	}

	constructor(path: JSONPath) {
		super();
		this.path = path;
	}
};

export class UnexpectedElementError extends Error {
	private path: JSONPath;

	get message(): string {
		return `Expected element observed${JSONPath.serialize(this.path)} to be absent!`;
	}

	constructor(path: JSONPath) {
		super();
		this.path = path;
	}
};

export class MissingMemberError extends Error {
	private path: JSONPath;

	get message(): string {
		return `Expected member observed${JSONPath.serialize(this.path)} to be present!`;
	}

	constructor(path: JSONPath) {
		super();
		this.path = path;
	}
};

export class UnexpectedMemberError extends Error {
	private path: JSONPath;

	get message(): string {
		return `Expected member observed${JSONPath.serialize(this.path)} to be absent!`;
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
	private equalsArray(observed: JSONData, expected: JSONData & JSONArray, path: JSONPath): void {
		if (!JSONArray.is(observed)) {
			throw new IncorrectTypeError(observed, expected, path);
		}
		for (let i = observed.length; i < expected.length; i++) {
			throw new MissingElementError([...path, i]);
		}
		for (let i = expected.length; i < observed.length; i++) {
			throw new UnexpectedElementError([...path, i]);
		}
		for (let i = 0; i < expected.length; i++) {
			this.equalsJSON(observed[i], expected[i], [...path, i]);
		}
	}

	private equalsBoolean(observed: JSONData, expected: JSONData & boolean, path: JSONPath): void {
		if (!(typeof observed === "boolean")) {
			throw new IncorrectTypeError(observed, expected, path);
		}
		if (expected !== observed) {
			throw new IncorrectValueError(observed, expected, path);
		}
	}

	private equalsNull(observed: JSONData, expected: JSONData & null, path: JSONPath): void {
		if (!(observed === null)) {
			throw new IncorrectTypeError(observed, expected, path);
		}
	}

	private equalsNumber(observed: JSONData, expected: JSONData & number, path: JSONPath): void {
		if (!(typeof observed === "number")) {
			throw new IncorrectTypeError(observed, expected, path);
		}
		if (expected !== observed) {
			throw new IncorrectValueError(observed, expected, path);
		}
	}

	private equalsObject(observed: JSONData, expected: JSONData & JSONObject, path: JSONPath): void {
		if (!JSONObject.is(observed)) {
			throw new IncorrectTypeError(observed, expected, path);
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
			this.equalsJSON(observed[key], expected[key], [...path, key]);
		}
	}

	private equalsString(observed: JSONData, expected: JSONData & string, path: JSONPath): void {
		if (!(typeof observed === "string")) {
			throw new IncorrectTypeError(observed, expected, path);
		}
		if (expected !== observed) {
			throw new IncorrectValueError(observed, expected, path);
		}
	}

	private equalsUndefined(observed: JSONData, expected: JSONData & undefined, path:JSONPath): void {
		if (!(observed === undefined)) {
			throw new IncorrectTypeError(observed, expected, path);
		}
	}

	private equalsJSON(observed: JSONData, expected: JSONData, path: JSONPath): void {
		if (JSONArray.is(expected)) {
			return this.equalsArray(observed, expected, path);
		}
		if (typeof expected === "boolean") {
			return this.equalsBoolean(observed, expected, path);
		}
		if (expected === null) {
			return this.equalsNull(observed, expected, path);
		}
		if (typeof expected === "number") {
			return this.equalsNumber(observed, expected, path);
		}
		if (JSONObject.is(expected)) {
			return this.equalsObject(observed, expected, path);
		}
		if (typeof expected === "string") {
			return this.equalsString(observed, expected, path);
		}
		if (expected === undefined) {
			return this.equalsUndefined(observed, expected, path);
		}
	}

	constructor() {}

	equals(observed: JSONData, expected: JSONData): void {
		this.equalsJSON(observed, expected, []);
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
