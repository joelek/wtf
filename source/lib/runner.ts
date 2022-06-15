import * as libcp from "child_process";
import * as libfs from "fs";
import * as libpath from "path";

export type SpawnOutcome = {
	stdout: Buffer;
	stderr: Buffer;
	error?: Error;
	status?: number;
};

export async function spawn(command: string, parameters: Array<string>): Promise<SpawnOutcome> {
	return new Promise((resolve, reject) => {
		let stringParameters = parameters.map((parameter) => JSON.stringify(parameter)).join(" ");
		process.stderr.write(`Running ${command} with parameters ${stringParameters}...\n`);
		let childProcess = libcp.spawn(command, parameters, { shell: true });
		let stdoutChunks = [] as Array<Buffer>;
		let stderrChunks = [] as Array<Buffer>;
		childProcess.stdout.on("data", (chunk) => {
			stdoutChunks.push(chunk);
		});
		childProcess.stderr.on("data", (chunk) => {
			stderrChunks.push(chunk);
		});
		childProcess.on("error", (error) => {
			let stdout = Buffer.concat(stdoutChunks);
			let stderr = Buffer.concat(stderrChunks);
			resolve({
				stdout,
				stderr,
				error
			});
		});
		childProcess.on("exit", (code) => {
			let stdout = Buffer.concat(stdoutChunks);
			let stderr = Buffer.concat(stderrChunks);
			let status = code != null ? code : undefined;
			resolve({
				stdout,
				stderr,
				status
			});
		});
	});
};

export type RunLog = {
	path: string;
	runtime: string;
	stdout: string;
	stderr: string;
	error?: Error;
	status?: number;
};

export interface Runner {
	matches(path: string): boolean;
	run(path: string): Promise<RunLog>;
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

	async run(path: string): Promise<RunLog> {
		let runtime = this.runtime;
		let outcome = await spawn(runtime, [path]);
		let stdout = outcome.stdout.toString();
		let stderr = outcome.stderr.toString();
		let error = outcome.error;
		let status = outcome.status;
		return {
			path,
			runtime,
			stdout,
			stderr,
			error,
			status
		};
	}
};

export class JavaScriptRunner extends CustomRunner {
	constructor() {
		super(".test.js", "node");
	}
};

export class TypeScriptRunner  extends CustomRunner {
	constructor() {
		super(".test.ts", "ts-node");
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
		throw `Path "${path}" does not exist!`;
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

export type Log = {
	suites: Array<RunLog>;
	status: number;
};

export async function run(options: Options): Promise<Log> {
	let paths = options.paths ?? createDefaultPaths();
	let runners = options.runners ?? createDefaultRunners();
	let subjects = [] as Array<Subject>;
	for (let path of paths) {
		subjects.push(...scanPath(path, runners));
	}
	let suites = [] as Array<RunLog>;
	let status = 0;
	for (let subject of subjects) {
		let runLog = await subject.runner.run(subject.path);
		suites.push(runLog);
		if (runLog.status !== 0) {
			status += 1;
		}
	}
	return {
		suites,
		status
	};
};
