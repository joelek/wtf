export type BinaryData =
	Int8Array |
	Uint8Array |
	Uint8ClampedArray |
	Int16Array |
	Uint16Array |
	Int32Array |
	Uint32Array |
	Float32Array |
	Float64Array |
	BigInt64Array |
	BigUint64Array;

export type Comparable = {
	equals(that: Comparable): boolean;
};

export const Comparable = {
	is(subject: SerializableData): subject is Comparable {
		return subject != null && typeof (subject as any)["equals"] === "function";
	}
};

export type SerializableData = BinaryData | Comparable | bigint | boolean | null | number | string | undefined | SerializableData[] | {
	[key: string]: SerializableData;
};

export type SerializableDataArray = Array<SerializableData>;

export const SerializableDataArray = {
	is(subject: SerializableData): subject is SerializableDataArray {
		return subject != null && subject.constructor === Array;
	}
};

export type SerializableDataObject = Record<string, SerializableData>;

export const SerializableDataObject = {
	is(subject: SerializableData): subject is SerializableDataObject {
		return subject != null && subject.constructor === Object;
	}
};

export const SerializableDataWrapper = {
	wrap(value: SerializableData): SerializableData {
		if (typeof value === "bigint") {
			return {
				type: "BigInt",
				data: value.toString()
			};
		}
		if (value instanceof Int8Array) {
			return {
				type: "Int8Array",
				data: Array.from(value)
			};
		}
		if (value instanceof Uint8Array) {
			return {
				type: "Uint8Array",
				data: Array.from(value)
			};
		}
		if (value instanceof Uint8ClampedArray) {
			return {
				type: "Uint8ClampedArray",
				data: Array.from(value)
			};
		}
		if (value instanceof Int16Array) {
			return {
				type: "Int16Array",
				data: Array.from(value)
			};
		}
		if (value instanceof Uint16Array) {
			return {
				type: "Uint16Array",
				data: Array.from(value)
			};
		}
		if (value instanceof Int32Array) {
			return {
				type: "Int32Array",
				data: Array.from(value)
			};
		}
		if (value instanceof Uint32Array) {
			return {
				type: "Uint32Array",
				data: Array.from(value)
			};
		}
		if (value instanceof Float32Array) {
			return {
				type: "Float32Array",
				data: Array.from(value)
			};
		}
		if (value instanceof Float64Array) {
			return {
				type: "Float64Array",
				data: Array.from(value)
			};
		}
		if (value instanceof BigInt64Array) {
			return {
				type: "BigInt64Array",
				data: Array.from(value)
			};
		}
		if (value instanceof BigUint64Array) {
			return {
				type: "BigUint64Array",
				data: Array.from(value)
			};
		}
		return value;
	},
	unwrap(value: SerializableData): SerializableData {
		if (SerializableDataObject.is(value)) {
			let type = value.type;
			let data = value.data;
			if (typeof type === "string") {
				if (type === "BigInt") {
					return BigInt(data as any);
				}
				if (type === "Int8Array") {
					return Int8Array.from(data as any);
				}
				if (type === "Uint8Array") {
					return Uint8Array.from(data as any);
				}
				if (type === "Uint8ClampedArray") {
					return Uint8ClampedArray.from(data as any);
				}
				if (type === "Int16Array") {
					return Int16Array.from(data as any);
				}
				if (type === "Uint16Array") {
					return Uint16Array.from(data as any);
				}
				if (type === "Int32Array") {
					return Int32Array.from(data as any);
				}
				if (type === "Uint32Array") {
					return Uint32Array.from(data as any);
				}
				if (type === "Float32Array") {
					return Float32Array.from(data as any);
				}
				if (type === "Float64Array") {
					return Float64Array.from(data as any);
				}
				if (type === "BigInt64Array") {
					return BigInt64Array.from(data as any);
				}
				if (type === "BigUint64Array") {
					return BigUint64Array.from(data as any);
				}
			}
		}
		return value;
	}
};

export const SerializableData = {
	parse(string: string): SerializableData {
		return globalThis.JSON.parse(string, (key, value) => SerializableDataWrapper.unwrap(value));
	},
	serialize(json: SerializableData, compact: boolean = false): string {
		return globalThis.JSON.stringify(json != null ? json : null, (key, value) => SerializableDataWrapper.wrap(value), "\t");
	}
};

export type SerializablePath = Array<string | number>;

export const SerializablePath = {
	serialize(path: SerializablePath): string {
		let strings = [] as Array<string>;
		for (let part of path) {
			if (typeof part === "string") {
				if (/^[a-z_][a-z_0-9]*$/i.test(part)) {
					strings.push(`.${part}`);
				} else {
					strings.push(`.${SerializableData.serialize(part)}`);
				}
				continue;
			}
			if (typeof part === "number") {
				strings.push(`[${part}]`);
				continue;
			}
		}
		return strings.join("");
	}
};
