#!/usr/bin/env node

import { version } from "../version.json";
import * as lib from "../lib";

async function run(): Promise<number> {
	console.log(`wtf v${version}`);
	let options: lib.runners.Options = {};
	let unrecognizedArgumentCount = 0;
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
			let command = parts[2];
			let runner = new lib.runners.CustomRunner(suffix, command);
			let runners = options.runners ?? [];
			runners.push(runner);
			options.runners = runners;
			continue;
		}
		console.log(`Unrecognized argument "${arg}"!`);
		unrecognizedArgumentCount += 1;
	}
	if (unrecognizedArgumentCount === 0) {
		let result = await lib.runners.run(options);
		console.warn(JSON.stringify(result, null, "\t"));
		return result.status;
	} else {
		console.log(`Arguments:`);
		console.log(`--path=<path> Include the specified path when scanning for files.`);
		console.log(`--runner=<suffix>:<command> Launch the specified command for every filename that ends with the specified suffix.`);
		return unrecognizedArgumentCount;
	}
};

run().then(process.exit).catch(console.log);
