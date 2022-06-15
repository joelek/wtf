import * as libcp from "child_process";
import * as libfs from "fs";
import * as libpath from "path";

export async function spawn(command: string, parameters: Array<string>): Promise<number | undefined> {
	return new Promise((resolve, reject) => {
		let stringParameters = parameters.map((parameter) => JSON.stringify(parameter)).join(" ");
		console.log(`Running ${command} with parameters ${stringParameters}...`);
		let childProcess = libcp.spawn(command, parameters, { shell: true });
		childProcess.stdout.pipe(process.stdout);
		childProcess.stderr.pipe(process.stderr);
		childProcess.on("error", (error) => {
			console.log(error);
			resolve(undefined);
		});
		childProcess.on("exit", (code, signal) => {
			if (code == null) {
				resolve(undefined);
			} else {
				resolve(code);
			}
		});
	});
};

export interface Runner {
	matches(path: string): boolean;
	run(path: string): Promise<number | undefined>;
};

export class JavaScriptRunner implements Runner {
	constructor() {}

	matches(path: string): boolean {
		return path.endsWith(".test.js");
	}

	run(path: string): Promise<number | undefined> {
		return spawn("node", [path]);
	}
};

export class TypeScriptRunner implements Runner {
	constructor() {}

	matches(path: string): boolean {
		return path.endsWith(".test.ts");
	}

	run(path: string): Promise<number | undefined> {
		return spawn("ts-node", [path]);
	}
};

export class CustomRunner implements Runner {
	private suffix: string;
	private runtime: string;

	constructor(suffix: string, runtime: string) {
		this.suffix = suffix;
		this.runtime = runtime;
	}

	matches(path: string): boolean {
		return path.endsWith(this.suffix);
	}

	run(path: string): Promise<number | undefined> {
		return spawn(this.runtime, [path]);
	}
};

export type Subject = {
	runner: Runner;
	path: string;
};

export function scanFile(path: string, runners: Array<Runner>): Array<Subject> {
	for (let runner of runners) {
		if (runner.matches(path)) {
			let subject = {
				runner,
				path
			};
			return [subject];
		}
	}
	return [];
};

export function scanDirectory(parentPath: string, runners: Array<Runner>): Array<Subject> {
	let subjects = [] as Array<Subject>;
	let entries = libfs.readdirSync(parentPath, { withFileTypes: true });
	for (let entry of entries) {
		let path = libpath.join(parentPath, entry.name);
		if (entry.isDirectory()) {
			subjects.push(...scanDirectory(path, runners));
			continue;
		}
		if (entry.isFile()) {
			subjects.push(...scanFile(path, runners));
			continue;
		}
	}
	return subjects;
};

export function scanPath(path: string, runners: Array<Runner>): Array<Subject> {
	if (libfs.existsSync(path)) {
		let stats = libfs.statSync(path);
		if (stats.isDirectory()) {
			return scanDirectory(path, runners);
		}
		if (stats.isFile()) {
			return scanFile(path, runners);
		}
	} else {
		console.log(`Path "${path}" does not exist!`);
	}
	return [];
};

export type Options = {
	paths?: Array<string>;
	runners?: Array<Runner>;
};

export function createDefaultPaths(): Array<string> {
	return [
		"./source/"
	];
};

export function createDefaultRunners(): Array<Runner> {
	return [
		new JavaScriptRunner(),
		new TypeScriptRunner()
	];
};

export type Outcome = {
	subject: Subject;
	status?: number;
};

export async function run(options: Options): Promise<number> {
	let paths = options.paths ?? createDefaultPaths();
	let runners = options.runners ?? createDefaultRunners();
	let subjects = [] as Array<Subject>;
	for (let path of paths) {
		subjects.push(...scanPath(path, runners));
	}
	let outcomes = [] as Array<Outcome>;
	for (let subject of subjects) {
		let status = await subject.runner.run(subject.path);
		outcomes.push({
			subject,
			status
		});
	}
	let failures = 0;
	for (let outcome of outcomes) {
		if (outcome.status !== 0) {
			console.log(`Failure: "${outcome.subject.path}" exited with status (${outcome.status ?? ""})`);
			failures += 1;
		}
	}
	return failures;
};
