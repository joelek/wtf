#!/usr/bin/env node

import * as app from "../app.json";
import * as lib from "../lib";

const stdout = new lib.loggers.StdoutLogger();
const stderr = new lib.loggers.StderrLogger();

function getLogger(target: string): lib.loggers.Logger | undefined {
	if (target === "stdout") {
		return stdout;
	}
	if (target === "stderr") {
		return stderr;
	}
};

async function run(): Promise<number> {
	let options: lib.runners.Options = {
		logger: stdout
	};
	let unrecognizedArguments = [] as Array<string>;
	for (let arg of process.argv.slice(2)) {
		let parts: RegExpExecArray | null = null;
		if ((parts = /^--logger=(.*)$/.exec(arg)) != null) {
			let target = parts[1];
			let logger = getLogger(target);
			options.logger = logger;
			continue;
		}
		if ((parts = /^--path=(.*)$/.exec(arg)) != null) {
			let path = parts[1];
			let paths = options.paths ?? [];
			paths.push(path);
			options.paths = paths;
			continue;
		}
		if ((parts = /^--reporter=(.*):(.*)$/.exec(arg)) != null) {
			let target = parts[1];
			let reporter = parts[2];
			let logger = getLogger(target);
			if (reporter === "json") {
				options.reporter = new lib.reporters.JSONReporter(logger);
			}
			continue;
		}
		if ((parts = /^--runner=(.*):(.*)$/.exec(arg)) != null) {
			let suffix = parts[1];
			let command = parts[2];
			let runner = new lib.runners.CustomRunner(suffix, command);
			let runners = options.runners ?? [];
			runners.push(runner);
			options.runners = runners;
			continue;
		}
		unrecognizedArguments.push(arg);
	}
	if (unrecognizedArguments.length === 0) {
		options.logger?.log(`${app.name} v${app.version}\n`);
		let status = await lib.runners.run(options);
		return status;
	} else {
		for (let unrecognizedArgument of unrecognizedArguments) {
			stderr.log(`Unrecognized argument "${unrecognizedArgument}"!\n`);
		}
		stderr.log(`Arguments:\n`);
		stderr.log(`\t--logger=<target> Log events to the specified target ("stdout" or "stderr").\n`);
		stderr.log(`\t--path=<path> Include the specified path when scanning for files.\n`);
		stderr.log(`\t--reporter=<target>:<reporter> Report to the specified target ("stdout" or "stderr") using the specified reporter ("json").\n`);
		stderr.log(`\t--runner=<suffix>:<command> Launch the specified command for every filename that ends with the specified suffix.\n`);
		return unrecognizedArguments.length;
	}
};

run().then(process.exit).catch(console.error);
