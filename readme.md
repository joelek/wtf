# @joelek/wtf

Deterministic test runner and testing framework for projects built using TypeScript or JavaScript.

```
[npx] wtf \
	--path=./source/ \
	--runner=*.test.js:node
```

```ts
import * as wtf from "@joelek/wtf";

wtf.suite("Arithmetics.", async (suite) => {
	suite.case(`The sum of two plus two should equal four.`, async (assert) => {
		assert.equals(2 + 2, 4);
	});
});
```

## Features

### Test runner

The package includes a deterministic test runner that may be launched using the `[npx] wtf` command. The test runner may be used to locate, run and collect information from supported test units.

By default, the `./source/` and `./src/` paths will be recursively scanned for supported units. File or directory paths may be explicitly specified using the `--path=<path>` argument.

A test unit is identified as supported through having a filename matching one of the configured patterns for which a command is specified. The default commands are:

* The `node` command for all filenames matching the `*.test.js` pattern.
* The `ts-node` command for all filenames matching the `*.test.ts` pattern.

Commands may be explicitly specified using the `--runner=<pattern>:<command>` argument.

The test runner launches the corresponding command for each test unit and collects the output from the operations. The units are run in sequence as separate processes, providing a clean slate for each unit by eliminating runtime contamination.

The test runner is deterministic if and only if each test unit is deterministic. Units verifying functionality of or through external systems such as file systems, databases or APIs should be constructed with this in consideration.

A unit is considered having executed successfully if the command returns the EXIT_SUCCESS (0) status code. Any non-zero status code is considered a failure. The test runner itself signals the combined outcome of all units through the EXIT_SUCCESS (0) or EXIT_FAILURE (1) status codes.

#### Logging

The test runner can be configured to write log events to a specific target through the `--logger=<target>` argument. The target may be set to `stdout`, `stderr` or empty if no events should be written. By default, the target is set to `stdout`.

#### Reporting

The test runner can be configured to write test reports to a specific target through the `--reporter=<target>` argument. The target may be set to `stdout`, `stderr` or empty if no reports should be written. By default, the target is set to empty.

### Testing framework

The package includes a testing framework for projects built using TypeScript or JavaScript. The framework may be used to create test units that conform to the conventions expected by the test runner.

```ts
import * as wtf from "@joelek/wtf";
```

Each unit may specify its suites through the `suite(description, callback)` method. The callback will be supplied with a `suite` instance through which the cases of the suite should be defined. Async callbacks are supported but not required.

```ts
import * as wtf from "@joelek/wtf";

wtf.suite("Arithmetics.", async (suite) => {
	// ...
});
```

Each suite should specify its cases through the `case(description, callback)` method. The callback will be supplied with an `assert` instance through which assertions can be made. Async callbacks are supported but not required.

```ts
import * as wtf from "@joelek/wtf";

wtf.suite("Arithmetics.", async (suite) => {
	suite.case(`The sum of two plus two should equal four.`, async (assert) => {
		// ...
	});
});
```

#### Equals

The `assert` instance can be used to assert that values observed equal values expected through its `equals(observed, expected)` method. The method supports the data types listed below.

* Int8Array
* Uint8Array
* Uint8ClampedArray
* Int16Array
* Uint16Array
* Int32Array
* Uint32Array
* Float32Array
* Float64Array
* BigInt64Array
* BigUint64Array
* bigint
* boolean
* null
* number
* string
* undefined
* Array
* Object

```ts
import * as wtf from "@joelek/wtf";

wtf.suite("Arithmetics.", async (suite) => {
	suite.case(`The sum of two plus two should equal four.`, async (assert) => {
		assert.equals(2 + 2, 4);
	});
});
```

Equality is determined recursively for the composite data types Array and Object. It is therefore safe to write assertions between arrays, objects and combinations thereof.

Equality for instances of classes implementing the `equals()` method will not be determined by the asserter itself. Instead, responsibility is delegated to the class which is expected to return a boolean indicating the outcome of the comparison.

#### Throws

The `assert` instance can be use to assert that operations throw errors through its `throws(callback)` method. Async callbacks are supported but not required but the method itself needs to be awaited.

```ts
import * as wtf from "@joelek/wtf";

wtf.suite("Arithmetics.", async (suite) => {
	suite.case(`The sum of two plus two should not equal five.`, async (assert) => {
		await assert.throws(async () => {
			assert.equals(2 + 2, 5);
		});
	});
});
```

## Sponsorship

The continued development of this software depends on your sponsorship. Please consider sponsoring this project if you find that the software creates value for you and your organization.

The sponsor button can be used to view the different sponsoring options. Contributions of all sizes are welcome.

Thank you for your support!

### Ethereum

Ethereum contributions can be made to address `0xf1B63d95BEfEdAf70B3623B1A4Ba0D9CE7F2fE6D`.

![](./eth.png)

## Installation

Releases follow semantic versioning and release packages are published using the GitHub platform. Use the following command to install the latest release.

```
npm install [-g] joelek/wtf#semver:^0.2
```

Use the following command to install the very latest build. The very latest build may include breaking changes and should not be used in production environments.

```
npm install [-g] joelek/wtf#master
```

NB: This project targets TypeScript 4 in strict mode.

## Roadmap

* Write more test cases.
* Consider parallel execution of test units.
* Get rid of await requirement for assert.throws().
* Implement support for logging and reporting over HTTP.
* Implement support for logging and reporting to files.
* Add support for loading config files.
