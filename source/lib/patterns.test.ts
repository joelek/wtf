import * as wtf from "./";
import { DynamicPatternMatcher, PatternMatcher, StaticPatternMatcher } from "./patterns";

wtf.test(`It should parse the "one.two" pattern.`, async (assert) => {
	assert.equals(PatternMatcher.parse("one.two"), [
		new StaticPatternMatcher("one"),
		new StaticPatternMatcher("two")
	]);
});

wtf.test(`It should parse the "one.*" pattern.`, async (assert) => {
	assert.equals(PatternMatcher.parse("one.*"), [
		new StaticPatternMatcher("one"),
		new DynamicPatternMatcher(1, 1)
	]);
});

wtf.test(`It should parse the "*.two" pattern.`, async (assert) => {
	assert.equals(PatternMatcher.parse("*.two"), [
		new DynamicPatternMatcher(1, 1),
		new StaticPatternMatcher("two")
	]);
});

wtf.test(`It should parse the "*.*" pattern.`, async (assert) => {
	assert.equals(PatternMatcher.parse("*.*"), [
		new DynamicPatternMatcher(1, 1),
		new DynamicPatternMatcher(1, 1)
	]);
});

wtf.test(`The "one.two" subject should match the "one.two" pattern.`, async (assert) => {
	assert.equals(PatternMatcher.matches("one.two", [
		new StaticPatternMatcher("one"),
		new StaticPatternMatcher("two")
	]), true);
});

wtf.test(`The "any.two" subject should not match the "one.two" pattern.`, async (assert) => {
	assert.equals(PatternMatcher.matches("any.two", [
		new StaticPatternMatcher("one"),
		new StaticPatternMatcher("two")
	]), false);
});

wtf.test(`The "one.any" subject should not match the "one.two" pattern.`, async (assert) => {
	assert.equals(PatternMatcher.matches("one.any", [
		new StaticPatternMatcher("one"),
		new StaticPatternMatcher("two")
	]), false);
});

wtf.test(`The "any.any" subject should not match the "one.two" pattern.`, async (assert) => {
	assert.equals(PatternMatcher.matches("any.any", [
		new StaticPatternMatcher("one"),
		new StaticPatternMatcher("two")
	]), false);
});

wtf.test(`The "one.two" subject should match the "one.*" pattern.`, async (assert) => {
	assert.equals(PatternMatcher.matches("one.two", [
		new StaticPatternMatcher("one"),
		new DynamicPatternMatcher(1, 1)
	]), true);
});

wtf.test(`The "any.two" subject should not match the "one.*" pattern.`, async (assert) => {
	assert.equals(PatternMatcher.matches("any.two", [
		new StaticPatternMatcher("one"),
		new DynamicPatternMatcher(1, 1)
	]), false);
});

wtf.test(`The "one.any" subject should match the "one.*" pattern.`, async (assert) => {
	assert.equals(PatternMatcher.matches("one.any", [
		new StaticPatternMatcher("one"),
		new DynamicPatternMatcher(1, 1)
	]), true);
});

wtf.test(`The "any.any" subject should not match the "one.*" pattern.`, async (assert) => {
	assert.equals(PatternMatcher.matches("any.any", [
		new StaticPatternMatcher("one"),
		new DynamicPatternMatcher(1, 1)
	]), false);
});

wtf.test(`The "one.two" subject should match the "*.two" pattern.`, async (assert) => {
	assert.equals(PatternMatcher.matches("one.two", [
		new DynamicPatternMatcher(1, 1),
		new StaticPatternMatcher("two")
	]), true);
});

wtf.test(`The "any.two" subject should match the "*.two" pattern.`, async (assert) => {
	assert.equals(PatternMatcher.matches("any.two", [
		new DynamicPatternMatcher(1, 1),
		new StaticPatternMatcher("two")
	]), true);
});

wtf.test(`The "one.any" subject should not match the "*.two" pattern.`, async (assert) => {
	assert.equals(PatternMatcher.matches("one.any", [
		new DynamicPatternMatcher(1, 1),
		new StaticPatternMatcher("two")
	]), false);
});

wtf.test(`The "any.any" subject should not match the "*.two" pattern.`, async (assert) => {
	assert.equals(PatternMatcher.matches("any.any", [
		new DynamicPatternMatcher(1, 1),
		new StaticPatternMatcher("two")
	]), false);
});

wtf.test(`The "one.two" subject should match the "*.*" pattern.`, async (assert) => {
	assert.equals(PatternMatcher.matches("one.two", [
		new DynamicPatternMatcher(1, 1),
		new DynamicPatternMatcher(1, 1)
	]), true);
});

wtf.test(`The "any.two" subject should match the "*.*" pattern.`, async (assert) => {
	assert.equals(PatternMatcher.matches("any.two", [
		new DynamicPatternMatcher(1, 1),
		new DynamicPatternMatcher(1, 1)
	]), true);
});

wtf.test(`The "one.any" subject should match the "*.*" pattern.`, async (assert) => {
	assert.equals(PatternMatcher.matches("one.any", [
		new DynamicPatternMatcher(1, 1),
		new DynamicPatternMatcher(1, 1)
	]), true);
});

wtf.test(`The "any.any" subject should match the "*.*" pattern.`, async (assert) => {
	assert.equals(PatternMatcher.matches("any.any", [
		new DynamicPatternMatcher(1, 1),
		new DynamicPatternMatcher(1, 1)
	]), true);
});
