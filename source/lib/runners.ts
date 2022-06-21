import * as libcp from "child_process";
import * as libfs from "fs";
import * as libpath from "path";
import * as loggers from "./loggers";
import * as reporters from "./reporters";
import { SerializableData } from "./data";
import { Logger } from "./loggers";
import { LOGGER_KEY, REPORTER_KEY } from "./env";

export type SpawnResult = {
	stdout: Buffer;
	stderr: Buffer;
	error?: Error;
	status?: number;
};

export async function spawn(command: string, parameters: Array<string>, logger?: Logger, environment?: Record<string, string | undefined>): Promise<SpawnResult> {
	return new Promise((resolve, reject) => {
		let childProcess = libcp.spawn(command, parameters, { shell: true, env: { ...process.env, ...environment } });
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

export function parseIfPossible(string: string): SerializableData {
	try {
		return SerializableData.parse(string);
	} catch (error) {};
	return string;
};

export type RunReport = {
	command: string;
	path: string;
	stdout: SerializableData;
	stderr: SerializableData;
	error?: string;
	status?: number;
};

export interface Runner {
	matches(path: string): boolean;
	run(path: string, logger?: Logger, environment?: Record<string, string | undefined>): Promise<RunReport>;
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

	async run(path: string, logger?: Logger, environment?: Record<string, string | undefined>): Promise<RunReport> {
		let command = this.command;
		logger?.log(`Spawning ${command} "${path}"...\n`);
		let result = await spawn(command, [path], logger, environment);
		let stdout = parseIfPossible(result.stdout.toString());
		let stderr = parseIfPossible(result.stderr.toString());
		let error = result.error == null ? undefined : result.error.message;
		let status = result.status;
		logger?.log(`Command ${command} returned status ${status ?? ""} (${status === 0 ? "success" : "failure"}).\n`);
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
	logger?: string;
	paths?: Array<string>;
	reporter?: string;
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
	let logger = loggers.getLogger(options.logger);
	let paths = options.paths ?? createDefaultPaths();
	let reporter = reporters.getReporter(options.reporter);
	let runners = options.runners ?? createDefaultRunners();
	let runnables = [] as Array<Runnable>;
	for (let path of paths) {
		runnables.push(...scanPath(libpath.normalize(path), runners, logger));
	}
	let environment: Record<string, string | undefined> = {
		[LOGGER_KEY]: options.logger,
		[REPORTER_KEY]: options.reporter
	};
	let reports = [] as Array<RunReport>;
	let status = 0;
	for (let runnable of runnables) {
		let report = await runnable.runner.run(runnable.path, logger, environment);
		reports.push(report);
		if (report.status !== 0) {
			status = 1;
		}
	}
	logger?.log(`Completed with status ${status ?? ""} (${status === 0 ? "success" : "failure"}).\n`);
	let report: Report = {
		reports,
		status
	};
	reporter?.report(report);
	return status;
};
