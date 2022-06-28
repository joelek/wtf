"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicPatternMatcher = exports.StaticPatternMatcher = exports.PatternMatcher = void 0;
const asserters_1 = require("./asserters");
exports.PatternMatcher = {
    parse(pattern) {
        return pattern.split(".").map((part) => {
            if (part === "*") {
                return new DynamicPatternMatcher(1, 1);
            }
            return new StaticPatternMatcher(part);
        });
    },
    matches(subject, matchers) {
        let parts = subject.split(".");
        let currentMatcher = 0;
        outer: for (let part of parts) {
            inner: for (let matcher of matchers.slice(currentMatcher)) {
                let nextMatcher = matchers[currentMatcher + 1];
                if (matcher.isSatisfied()) {
                    if (nextMatcher === null || nextMatcher === void 0 ? void 0 : nextMatcher.acceptsPart(part)) {
                        currentMatcher += 1;
                        continue outer;
                    }
                }
                if (matcher.acceptsPart(part)) {
                    continue outer;
                }
                else {
                    if (matcher.isSatisfied()) {
                        currentMatcher += 1;
                        continue inner;
                    }
                    else {
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
class StaticPatternMatcher {
    constructor(string) {
        this.string = string;
        this.satisfied = false;
    }
    acceptsPart(part) {
        if (this.satisfied) {
            return false;
        }
        this.satisfied = part === this.string;
        return this.satisfied;
    }
    equals(that) {
        if (!(that instanceof StaticPatternMatcher)) {
            return false;
        }
        try {
            new asserters_1.Asserter().equals(Object.assign({}, this), Object.assign({}, that));
        }
        catch (error) {
            return false;
        }
        return true;
    }
    getParts() {
        return [
            this.string
        ];
    }
    isSatisfied() {
        return this.satisfied;
    }
}
exports.StaticPatternMatcher = StaticPatternMatcher;
;
class DynamicPatternMatcher {
    constructor(minOccurences, maxOccurences) {
        this.minOccurences = minOccurences;
        this.maxOccurences = maxOccurences;
        this.parts = [];
    }
    acceptsPart(part) {
        if (this.parts.length >= this.maxOccurences) {
            return false;
        }
        this.parts.push(part);
        return true;
    }
    equals(that) {
        if (!(that instanceof DynamicPatternMatcher)) {
            return false;
        }
        try {
            new asserters_1.Asserter().equals(Object.assign({}, this), Object.assign({}, that));
        }
        catch (error) {
            return false;
        }
        return true;
    }
    getParts() {
        return this.parts;
    }
    isSatisfied() {
        return this.minOccurences <= this.parts.length && this.parts.length <= this.maxOccurences;
    }
}
exports.DynamicPatternMatcher = DynamicPatternMatcher;
;
