import { SerializableDataArray, SerializableData, SerializableDataObject, SerializablePath, BinaryData, Comparable } from "./data";

export type OptionallyAsync<A> = A | Promise<A>;

export function getTypename(subject: any): string {
	if (subject === null) {
		return "null";
	}
	if (typeof subject?.constructor?.name === "string") {
		return subject.constructor.name;
	}
	return typeof subject;
};

export class UnsupportedTypeError extends Error {
	private expected: SerializableData;
	private path: SerializablePath;

	get message(): string {
		return `Expected type for expected${SerializablePath.serialize(this.path)}, ${getTypename(this.expected)}, to be supported by the asserter!`;
	}

	constructor(expected: SerializableData, path: SerializablePath) {
		super();
		this.expected = expected;
		this.path = path;
	}
};

export class IncorrectTypeError extends Error {
	private observed: SerializableData;
	private expected: SerializableData;
	private path: SerializablePath;

	get message(): string {
		return `Expected type for observed${SerializablePath.serialize(this.path)}, ${getTypename(this.observed)}, to be ${getTypename(this.expected)}!`;
	}

	constructor(observed: SerializableData, expected: SerializableData, path: SerializablePath) {
		super();
		this.observed = observed;
		this.expected = expected;
		this.path = path;
	}
};

export class IncorrectValueError extends Error {
	private observed: SerializableData;
	private expected: SerializableData;
	private path: SerializablePath;

	get message(): string {
		return `Expected value for observed${SerializablePath.serialize(this.path)}, ${SerializableData.serialize(this.observed, true)}, to be ${SerializableData.serialize(this.expected, true)}!`;
	}

	constructor(observed: SerializableData, expected: SerializableData, path: SerializablePath) {
		super();
		this.observed = observed;
		this.expected = expected;
		this.path = path;
	}
};

export class MissingElementError extends Error {
	private path: SerializablePath;

	get message(): string {
		return `Expected element observed${SerializablePath.serialize(this.path)} to be present!`;
	}

	constructor(path: SerializablePath) {
		super();
		this.path = path;
	}
};

export class UnexpectedElementError extends Error {
	private path: SerializablePath;

	get message(): string {
		return `Expected element observed${SerializablePath.serialize(this.path)} to be absent!`;
	}

	constructor(path: SerializablePath) {
		super();
		this.path = path;
	}
};

export class MissingMemberError extends Error {
	private path: SerializablePath;

	get message(): string {
		return `Expected member observed${SerializablePath.serialize(this.path)} to be present!`;
	}

	constructor(path: SerializablePath) {
		super();
		this.path = path;
	}
};

export class UnexpectedMemberError extends Error {
	private path: SerializablePath;

	get message(): string {
		return `Expected member observed${SerializablePath.serialize(this.path)} to be absent!`;
	}

	constructor(path: SerializablePath) {
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

export type Constructor<A> = {
	readonly prototype: A;
	new(...args: Array<any>): A;
};

export class Asserter {
	private equalsBinaryData<A extends BinaryData>(constructor: Constructor<A>, observed: SerializableData, expected: A, path: SerializablePath): void {
		if (!(observed instanceof constructor)) {
			throw new IncorrectTypeError(observed, expected, path);
		}
		for (let i = observed.length; i < expected.length; i++) {
			throw new MissingElementError([...path, i]);
		}
		for (let i = expected.length; i < observed.length; i++) {
			throw new UnexpectedElementError([...path, i]);
		}
		for (let i = 0; i < expected.length; i++) {
			let observedElement = observed[i];
			let expectedElement = expected[i];
			if (observedElement !== expectedElement) {
				throw new IncorrectValueError(observedElement, expectedElement, [...path, i]);
			}
		}
	}

	private equalsComparable(observed: SerializableData, expected: SerializableData & Comparable, path: SerializablePath): void {
		if (!(Comparable.is(observed))) {
			throw new IncorrectTypeError(observed, expected, path);
		}
		if (!observed.equals(expected)) {
			throw new IncorrectValueError(observed, expected, path);
		}
	}

	private equalsArray(observed: SerializableData, expected: SerializableData & SerializableDataArray, path: SerializablePath): void {
		if (!SerializableDataArray.is(observed)) {
			throw new IncorrectTypeError(observed, expected, path);
		}
		for (let i = observed.length; i < expected.length; i++) {
			throw new MissingElementError([...path, i]);
		}
		for (let i = expected.length; i < observed.length; i++) {
			throw new UnexpectedElementError([...path, i]);
		}
		for (let i = 0; i < expected.length; i++) {
			this.equalsAny(observed[i], expected[i], [...path, i]);
		}
	}

	private equalsBigint(observed: SerializableData, expected: SerializableData & bigint, path: SerializablePath): void {
		if (!(typeof observed === "bigint")) {
			throw new IncorrectTypeError(observed, expected, path);
		}
		if (expected !== observed) {
			throw new IncorrectValueError(observed, expected, path);
		}
	}

	private equalsBoolean(observed: SerializableData, expected: SerializableData & boolean, path: SerializablePath): void {
		if (!(typeof observed === "boolean")) {
			throw new IncorrectTypeError(observed, expected, path);
		}
		if (expected !== observed) {
			throw new IncorrectValueError(observed, expected, path);
		}
	}

	private equalsNull(observed: SerializableData, expected: SerializableData & null, path: SerializablePath): void {
		if (!(observed === null)) {
			throw new IncorrectTypeError(observed, expected, path);
		}
	}

	private equalsNumber(observed: SerializableData, expected: SerializableData & number, path: SerializablePath): void {
		if (!(typeof observed === "number")) {
			throw new IncorrectTypeError(observed, expected, path);
		}
		if (expected !== observed) {
			throw new IncorrectValueError(observed, expected, path);
		}
	}

	private equalsObject(observed: SerializableData, expected: SerializableData & SerializableDataObject, path: SerializablePath): void {
		if (!SerializableDataObject.is(observed)) {
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
			this.equalsAny(observed[key], expected[key], [...path, key]);
		}
	}

	private equalsString(observed: SerializableData, expected: SerializableData & string, path: SerializablePath): void {
		if (!(typeof observed === "string")) {
			throw new IncorrectTypeError(observed, expected, path);
		}
		if (expected !== observed) {
			throw new IncorrectValueError(observed, expected, path);
		}
	}

	private equalsUndefined(observed: SerializableData, expected: SerializableData & undefined, path: SerializablePath): void {
		if (!(observed === undefined)) {
			throw new IncorrectTypeError(observed, expected, path);
		}
	}

	private equalsAny(observed: SerializableData, expected: SerializableData, path: SerializablePath): void {
		if (Comparable.is(expected)) {
			return this.equalsComparable(observed, expected, path);
		}
		if (SerializableDataArray.is(expected)) {
			return this.equalsArray(observed, expected, path);
		}
		if (typeof expected === "bigint") {
			return this.equalsBigint(observed, expected, path);
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
		if (SerializableDataObject.is(expected)) {
			return this.equalsObject(observed, expected, path);
		}
		if (typeof expected === "string") {
			return this.equalsString(observed, expected, path);
		}
		if (expected === undefined) {
			return this.equalsUndefined(observed, expected, path);
		}
		if (expected instanceof Int8Array) {
			return this.equalsBinaryData(Int8Array, observed, expected, path);
		}
		if (expected instanceof Uint8Array) {
			return this.equalsBinaryData(Uint8Array, observed, expected, path);
		}
		if (expected instanceof Uint8ClampedArray) {
			return this.equalsBinaryData(Uint8ClampedArray, observed, expected, path);
		}
		if (expected instanceof Int16Array) {
			return this.equalsBinaryData(Int16Array, observed, expected, path);
		}
		if (expected instanceof Uint16Array) {
			return this.equalsBinaryData(Uint16Array, observed, expected, path);
		}
		if (expected instanceof Int32Array) {
			return this.equalsBinaryData(Int32Array, observed, expected, path);
		}
		if (expected instanceof Uint32Array) {
			return this.equalsBinaryData(Uint32Array, observed, expected, path);
		}
		if (expected instanceof Float32Array) {
			return this.equalsBinaryData(Float32Array, observed, expected, path);
		}
		if (expected instanceof Float64Array) {
			return this.equalsBinaryData(Float64Array, observed, expected, path);
		}
		if (expected instanceof BigInt64Array) {
			return this.equalsBinaryData(BigInt64Array, observed, expected, path);
		}
		if (expected instanceof BigUint64Array) {
			return this.equalsBinaryData(BigUint64Array, observed, expected, path);
		}
		throw new UnsupportedTypeError(expected, path);
	}

	constructor() {}

	equals(observed: SerializableData, expected: SerializableData): void {
		this.equalsAny(observed, expected, []);
	}

	async throws<A>(callback: () => OptionallyAsync<A>): Promise<void> {
		try {
			await callback();
		} catch (error) {
			return;
		}
		throw new ExpectedThrowError();
	}
};
