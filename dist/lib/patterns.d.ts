import { Comparable } from "./data";
export declare type PatternMatcher = Comparable & {
    acceptsPart(part: string): boolean;
    getParts(): Array<string>;
    isSatisfied(): boolean;
};
export declare const PatternMatcher: {
    parse(pattern: string): Array<PatternMatcher>;
    matches(subject: string, matchers: Array<PatternMatcher>): boolean;
};
export declare class StaticPatternMatcher implements PatternMatcher {
    private string;
    private satisfied;
    constructor(string: string);
    acceptsPart(part: string): boolean;
    equals(that: Comparable): boolean;
    getParts(): Array<string>;
    isSatisfied(): boolean;
}
export declare class DynamicPatternMatcher implements PatternMatcher {
    private minOccurences;
    private maxOccurences;
    private parts;
    constructor(minOccurences: number, maxOccurences: number);
    acceptsPart(part: string): boolean;
    equals(that: Comparable): boolean;
    getParts(): Array<string>;
    isSatisfied(): boolean;
}
