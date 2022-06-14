#!/usr/bin/env node

import * as lib from "../lib";

async function run(): Promise<number> {
	let options: lib.runner.Options = {};
	let badArgumentCount = 0;
	for (let arg of process.argv.slice(2)) {
		let parts: RegExpExecArray | null = null;
		if ((parts = /^--path=(.+)$/.exec(arg)) != null) {
			let path = parts[1];
			let paths = options.paths ?? [];
			paths.push(path);
			options.paths = paths;
			continue;
		}
		badArgumentCount += 1;
		console.log(`Unrecognized argument "${arg}"!`);
	}
	if (badArgumentCount === 0) {
		return lib.runner.run(options);
	} else {
		console.log(`Arguments:`);
		console.log(`--path=<string> Include specified path when scanning for test subjects.`);
		return badArgumentCount;
	}
};

run().catch(() => undefined).then((status) => process.exit(status));
