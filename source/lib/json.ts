export type SerializableData = bigint | boolean | null | number | string | undefined | SerializableData[] | {
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

export const SerializableData = {
	parse(string: string): SerializableData {
		return globalThis.JSON.parse(string, (key, value) => {
			if (SerializableDataObject.is(value)) {
				let type = value.type;
				let data = value.data;
				if (typeof type === "string" && typeof data === "string") {
					if (type === "bigint" && /^[0-9]+n$/.test(data)) {
						return BigInt(data);
					}
				}
			}
			return value;
		});
	},
	serialize(json: SerializableData, wrap: boolean = true): string {
		return globalThis.JSON.stringify(json != null ? json : null, (key, value) => {
			if (typeof value === "bigint") {
				return !wrap ? `${value}n` : {
					type: "bigint",
					data: `${value}n`
				};
			}
			return value;
		}, "\t");
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
