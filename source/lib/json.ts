export type JSON = boolean | null | number | string | undefined | JSON[] | {
	[key: string]: JSON;
};

export const JSON = {
	parse(string: string): JSON {
		return globalThis.JSON.parse(string);
	},
	serialize(json: JSON): string {
		return globalThis.JSON.stringify(json != null ? json : null, null, "\t");
	}
};
