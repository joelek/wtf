import * as libcp from "child_process";
import * as libfs from "fs";
import * as libpath from "path";
import { Logger } from "./loggers";
import { Reporter } from "./reporters";

export type SpawnResult = {
	stdout: Buffer;
	stderr: Buffer;
	error?: Error;
	status?: number;
};

export async function spawn(command: string, parameters: Array<string>, logger?: Logger): Promise<SpawnResult> {
	return new Promise((resolve, reject) => {
		let childProcess = libcp.spawn(command, parameters, { shell: true });
		let stdoutChunks = [] as Array<Buffer>;
		let stderrChunks = [] as Array<Buffer>;
		childProcess.stdout.on("data", (chunk) => {
			stdoutChunks.push(chunk);
			logger?.log(chunk);
		});
		childProcess.stderr.on("data", (chunk) => {
			stderrChunks.push(chunk);
			logger?.log(chunk);
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
			let status = code == null ? undefined : code;
			resolve({
				stdout,
				stderr,
				status
			});
		});
	});
};

export function serializeError(error: Error): Error {
	let { name, message, stack } = { ...error };
	return {
		name,
		message,
		stack
	};
};

export type RunReport = {
	command: string;
	path: string;
	stdout: string;
	stderr: string;
	error?: Error;
	status?: number;
};

export interface Runner {
	matches(path: string): boolean;
	run(path: string, logger?: Logger): Promise<RunReport>;
};

export class CustomRunner implements Runner {
	private suffix: string;
	private command: string;

	constructor(suffix: string, command: string) {
		this.suffix = suffix;
		this.command = command;
	}

	matches(path: string): boolean {
		return path.endsWith(this.suffix);
	}

	async run(path: string, logger?: Logger): Promise<RunReport> {
		let command = this.command;
		logger?.log(`Running ${command} "${path}"...\n`);
		let result = await spawn(command, [path], logger);
		let stdout = result.stdout.toString();
		let stderr = result.stderr.toString();
		let error = result.error == null ? undefined : serializeError(result.error);
		let status = result.status;
		logger?.log(`Completed with status (${status ?? ""}).\n`);
		return {
			command,
			path,
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

export class TypeScriptRunner extends CustomRunner {
	constructor() {
		super(".test.ts", "ts-node");
	}
};

export type Runnable = {
	runner: Runner;
	path: string;
};

export function scanFilePath(path: string, runners: Array<Runner>, logger?: Logger): Array<Runnable> {
	for (let runner of runners) {
		if (runner.matches(path)) {
			let runnable = {
				runner,
				path
			};
			return [runnable];
		}
	}
	return [];
};

export function scanDirectoryPath(parentPath: string, runners: Array<Runner>, logger?: Logger): Array<Runnable> {
	let runnables = [] as Array<Runnable>;
	let entries = libfs.readdirSync(parentPath, { withFileTypes: true });
	for (let entry of entries) {
		let path = libpath.join(parentPath, entry.name);
		if (entry.isDirectory()) {
			runnables.push(...scanDirectoryPath(path, runners, logger));
			continue;
		}
		if (entry.isFile()) {
			runnables.push(...scanFilePath(path, runners, logger));
			continue;
		}
	}
	return runnables;
};

export function scanPath(path: string, runners: Array<Runner>, logger?: Logger): Array<Runnable> {
	logger?.log(`Scanning "${path}" for files...\n`);
	if (libfs.existsSync(path)) {
		let stats = libfs.statSync(path);
		if (stats.isDirectory()) {
			return scanDirectoryPath(path, runners, logger);
		}
		if (stats.isFile()) {
			return scanFilePath(path, runners, logger);
		}
	} else {
		logger?.log(`Path "${path}" does not exist!\n`);
	}
	return [];
};

export type Options = {
	logger?: Logger;
	paths?: Array<string>;
	reporter?: Reporter<any>;
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

export type Report = {
	reports: Array<RunReport>;
	status: number;
};

export async function run(options: Options): Promise<number> {
	let logger = options.logger;
	let paths = options.paths ?? createDefaultPaths();
	let reporter = options.reporter;
	let runners = options.runners ?? createDefaultRunners();
	let runnables = [] as Array<Runnable>;
	for (let path of paths) {
		runnables.push(...scanPath(libpath.normalize(path), runners, logger));
	}
	let reports = [] as Array<RunReport>;
	let status = 0;
	for (let runnable of runnables) {
		let report = await runnable.runner.run(runnable.path, options.logger);
		reports.push(report);
		if (report.status !== 0) {
			status += 1;
		}
	}
	let report: Report = {
		reports,
		status
	};
	reporter?.report(report);
	return status;
};
