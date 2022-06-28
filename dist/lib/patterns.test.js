"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const wtf = require("./");
const patterns_1 = require("./patterns");
wtf.suite("parse", (suite) => __awaiter(void 0, void 0, void 0, function* () {
    suite.case(`It should parse the "one.two" pattern.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
        assert.equals(patterns_1.PatternMatcher.parse("one.two"), [
            new patterns_1.StaticPatternMatcher("one"),
            new patterns_1.StaticPatternMatcher("two")
        ]);
    }));
    suite.case(`It should parse the "one.*" pattern.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
        assert.equals(patterns_1.PatternMatcher.parse("one.*"), [
            new patterns_1.StaticPatternMatcher("one"),
            new patterns_1.DynamicPatternMatcher(1, 1)
        ]);
    }));
    suite.case(`It should parse the "*.two" pattern.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
        assert.equals(patterns_1.PatternMatcher.parse("*.two"), [
            new patterns_1.DynamicPatternMatcher(1, 1),
            new patterns_1.StaticPatternMatcher("two")
        ]);
    }));
    suite.case(`It should parse the "*.*" pattern.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
        assert.equals(patterns_1.PatternMatcher.parse("*.*"), [
            new patterns_1.DynamicPatternMatcher(1, 1),
            new patterns_1.DynamicPatternMatcher(1, 1)
        ]);
    }));
}));
wtf.suite("matches", (suite) => __awaiter(void 0, void 0, void 0, function* () {
    suite.case(`The "one.two" subject should match the "one.two" pattern.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
        assert.equals(patterns_1.PatternMatcher.matches("one.two", [
            new patterns_1.StaticPatternMatcher("one"),
            new patterns_1.StaticPatternMatcher("two")
        ]), true);
    }));
    suite.case(`The "any.two" subject should not match the "one.two" pattern.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
        assert.equals(patterns_1.PatternMatcher.matches("any.two", [
            new patterns_1.StaticPatternMatcher("one"),
            new patterns_1.StaticPatternMatcher("two")
        ]), false);
    }));
    suite.case(`The "one.any" subject should not match the "one.two" pattern.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
        assert.equals(patterns_1.PatternMatcher.matches("one.any", [
            new patterns_1.StaticPatternMatcher("one"),
            new patterns_1.StaticPatternMatcher("two")
        ]), false);
    }));
    suite.case(`The "any.any" subject should not match the "one.two" pattern.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
        assert.equals(patterns_1.PatternMatcher.matches("any.any", [
            new patterns_1.StaticPatternMatcher("one"),
            new patterns_1.StaticPatternMatcher("two")
        ]), false);
    }));
    suite.case(`The "one.two" subject should match the "one.*" pattern.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
        assert.equals(patterns_1.PatternMatcher.matches("one.two", [
            new patterns_1.StaticPatternMatcher("one"),
            new patterns_1.DynamicPatternMatcher(1, 1)
        ]), true);
    }));
    suite.case(`The "any.two" subject should not match the "one.*" pattern.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
        assert.equals(patterns_1.PatternMatcher.matches("any.two", [
            new patterns_1.StaticPatternMatcher("one"),
            new patterns_1.DynamicPatternMatcher(1, 1)
        ]), false);
    }));
    suite.case(`The "one.any" subject should match the "one.*" pattern.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
        assert.equals(patterns_1.PatternMatcher.matches("one.any", [
            new patterns_1.StaticPatternMatcher("one"),
            new patterns_1.DynamicPatternMatcher(1, 1)
        ]), true);
    }));
    suite.case(`The "any.any" subject should not match the "one.*" pattern.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
        assert.equals(patterns_1.PatternMatcher.matches("any.any", [
            new patterns_1.StaticPatternMatcher("one"),
            new patterns_1.DynamicPatternMatcher(1, 1)
        ]), false);
    }));
    suite.case(`The "one.two" subject should match the "*.two" pattern.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
        assert.equals(patterns_1.PatternMatcher.matches("one.two", [
            new patterns_1.DynamicPatternMatcher(1, 1),
            new patterns_1.StaticPatternMatcher("two")
        ]), true);
    }));
    suite.case(`The "any.two" subject should match the "*.two" pattern.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
        assert.equals(patterns_1.PatternMatcher.matches("any.two", [
            new patterns_1.DynamicPatternMatcher(1, 1),
            new patterns_1.StaticPatternMatcher("two")
        ]), true);
    }));
    suite.case(`The "one.any" subject should not match the "*.two" pattern.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
        assert.equals(patterns_1.PatternMatcher.matches("one.any", [
            new patterns_1.DynamicPatternMatcher(1, 1),
            new patterns_1.StaticPatternMatcher("two")
        ]), false);
    }));
    suite.case(`The "any.any" subject should not match the "*.two" pattern.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
        assert.equals(patterns_1.PatternMatcher.matches("any.any", [
            new patterns_1.DynamicPatternMatcher(1, 1),
            new patterns_1.StaticPatternMatcher("two")
        ]), false);
    }));
    suite.case(`The "one.two" subject should match the "*.*" pattern.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
        assert.equals(patterns_1.PatternMatcher.matches("one.two", [
            new patterns_1.DynamicPatternMatcher(1, 1),
            new patterns_1.DynamicPatternMatcher(1, 1)
        ]), true);
    }));
    suite.case(`The "any.two" subject should match the "*.*" pattern.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
        assert.equals(patterns_1.PatternMatcher.matches("any.two", [
            new patterns_1.DynamicPatternMatcher(1, 1),
            new patterns_1.DynamicPatternMatcher(1, 1)
        ]), true);
    }));
    suite.case(`The "one.any" subject should match the "*.*" pattern.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
        assert.equals(patterns_1.PatternMatcher.matches("one.any", [
            new patterns_1.DynamicPatternMatcher(1, 1),
            new patterns_1.DynamicPatternMatcher(1, 1)
        ]), true);
    }));
    suite.case(`The "any.any" subject should match the "*.*" pattern.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
        assert.equals(patterns_1.PatternMatcher.matches("any.any", [
            new patterns_1.DynamicPatternMatcher(1, 1),
            new patterns_1.DynamicPatternMatcher(1, 1)
        ]), true);
    }));
}));
