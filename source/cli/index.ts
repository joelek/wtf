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
		if ((parts = /^--runner=(.+):(.+)$/.exec(arg)) != null) {
			let suffix = parts[1];
			let runtime = parts[2];
			let runner = new lib.runner.CustomRunner(suffix, runtime);
			let runners = options.runners ?? [];
			runners.push(runner);
			options.runners = runners;
			continue;
		}
		badArgumentCount += 1;
		console.log(`Unrecognized argument "${arg}"!`);
	}
	if (badArgumentCount === 0) {
		return lib.runner.run(options);
	} else {
		console.log(`Arguments:`);
		console.log(`--path=<path> Include the specified path when scanning for test subjects.`);
		console.log(`--runner=<suffix>:<runtime> Launch the specified runtime for every test subject that matches the specified suffix.`);
		return badArgumentCount;
	}
};

run().catch(() => undefined).then((status) => process.exit(status));
