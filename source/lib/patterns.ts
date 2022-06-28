import { Asserter } from "./asserters";
import { Comparable } from "./data";

export type PatternMatcher = Comparable & {
	acceptsPart(part: string): boolean;
	getParts(): Array<string>;
	isSatisfied(): boolean;
};

export const PatternMatcher = {
	parse(pattern: string): Array<PatternMatcher> {
		return pattern.split(".").map((part) => {
			if (part === "*") {
				return new DynamicPatternMatcher(1, 1);
			}
			return new StaticPatternMatcher(part);
		});
	},
	matches(subject: string, matchers: Array<PatternMatcher>): boolean {
		let parts = subject.split(".");
		let currentMatcher = 0;
		outer: for (let part of parts) {
			inner: for (let matcher of matchers.slice(currentMatcher)) {
				let nextMatcher = matchers[currentMatcher + 1] as PatternMatcher | undefined;
				if (matcher.isSatisfied()) {
					if (nextMatcher?.acceptsPart(part)) {
						currentMatcher += 1;
						continue outer;
					}
				}
				if (matcher.acceptsPart(part)) {
					continue outer;
				} else {
					if (matcher.isSatisfied()) {
						currentMatcher += 1;
						continue inner;
					} else {
						break outer;
					}
				}
			}
			break outer;
		}
		if (currentMatcher >= matchers.length) {
			return false;
		}
		for (let matcher of matchers.slice(currentMatcher)) {
			if (!matcher.isSatisfied()) {
				return false;
			}
		}
		return true;
	}
};

export class StaticPatternMatcher implements PatternMatcher {
	private string: string;
	private satisfied: boolean;

	constructor(string: string) {
		this.string = string;
		this.satisfied = false;
	}

	acceptsPart(part: string): boolean {
		if (this.satisfied) {
			return false;
		}
		this.satisfied = part === this.string;
		return this.satisfied;
	}

	equals(that: Comparable): boolean {
		if (!(that instanceof StaticPatternMatcher)) {
			return false;
		}
		try {
			new Asserter().equals({ ...this }, { ...that});
		} catch (error) {
			return false;
		}
		return true;
	}

	getParts(): Array<string> {
		return [
			this.string
		];
	}

	isSatisfied(): boolean {
		return this.satisfied;
	}
};

export class DynamicPatternMatcher implements PatternMatcher {
	private minOccurences: number;
	private maxOccurences: number;
	private parts: Array<string>;

	constructor(minOccurences: number, maxOccurences: number) {
		this.minOccurences = minOccurences;
		this.maxOccurences = maxOccurences;
		this.parts = [];
	}

	acceptsPart(part: string): boolean {
		if (this.parts.length >= this.maxOccurences) {
			return false;
		}
		this.parts.push(part);
		return true;
	}

	equals(that: Comparable): boolean {
		if (!(that instanceof DynamicPatternMatcher)) {
			return false;
		}
		try {
			new Asserter().equals({ ...this }, { ...that});
		} catch (error) {
			return false;
		}
		return true;
	}

	getParts(): Array<string> {
		return this.parts;
	}

	isSatisfied(): boolean {
		return this.minOccurences <= this.parts.length && this.parts.length <= this.maxOccurences;
	}
};
