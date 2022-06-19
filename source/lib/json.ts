export type JSONData = boolean | null | number | string | undefined | JSONData[] | {
	[key: string]: JSONData;
};

export const JSONData = {
	parse(string: string): JSONData {
		return globalThis.JSON.parse(string);
	},
	serialize(json: JSONData): string {
		return globalThis.JSON.stringify(json != null ? json : null, null, "\t");
	}
};

export type JSONPath = Array<string | number>;

export const JSONPath = {
	serialize(path: JSONPath): string {
		let strings = [] as Array<string>;
		for (let part of path) {
			if (typeof part === "string") {
				if (/^[a-z_][a-z_0-9]*$/i.test(part)) {
					strings.push(`.${part}`);
				} else {
					strings.push(`.${JSONData.serialize(part)}`);
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
