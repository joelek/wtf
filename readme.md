# @joelek/wtf

Test runner and testing framework for projects built using TypeScript or JavaScript.

```
[npx] wtf --runner=.test.js:node --path=./source/
```

```ts
import * as wtf from "@joelek/wtf";

wtf.createSuite("MySuite", async (suite) => {
	suite.defineTest(`It should not break!`, async () => {
		// ...
	});
});
```

## Features

### Test runner

### Testing framework

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
npm install joelek/wtf#semver:^0.0
```

Use the following command to install the very latest build. The very latest build may include breaking changes and should not be used in production environments.

```
npm install joelek/wtf#master
```

NB: This project targets TypeScript 4 in strict mode.

## Roadmap

* Create helper lib for writing JavaScript and TypeScript tests.
