#!/usr/bin/env node

import * as app from "../app.json";
import * as lib from "../lib";

function getLogger(target: string): lib.loggers.Logger | undefined {
	if (target === "stdout") {
		return lib.loggers.stdout;
	}
	if (target === "stderr") {
		return lib.loggers.stderr;
	}
};

async function run(): Promise<number> {
	let options: lib.runners.Options = {
		logger: lib.loggers.stdout
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
		if ((parts = /^--reporter=(.*)$/.exec(arg)) != null) {
			let target = parts[1];
			let logger = getLogger(target);
			let reporter = lib.reporters.json;
			options.reporter = reporter;
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
		let logger = lib.loggers.stderr;
		for (let unrecognizedArgument of unrecognizedArguments) {
			logger.log(`Unrecognized argument "${unrecognizedArgument}"!\n`);
		}
		logger.log(`Arguments:\n`);
		logger.log(`\t--logger=<target> Log events to the specified target ("stdout" or "stderr").\n`);
		logger.log(`\t--path=<path> Include the specified path when scanning for files.\n`);
		logger.log(`\t--reporter=<target> Report to the specified target ("stdout" or "stderr").\n`);
		logger.log(`\t--runner=<suffix>:<command> Launch the specified command for every filename that ends with the specified suffix.\n`);
		return unrecognizedArguments.length;
	}
};

run().then(process.exit);
