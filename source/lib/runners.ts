import * as libcp from "child_process";
import * as libfs from "fs";
import * as libpath from "path";
import * as loggers from "./loggers";
import * as reporters from "./reporters";
import { SerializableData } from "./data";
import { Logger } from "./loggers";
import { LOGGER_KEY, REPORTER_KEY } from "./env";
import { PatternMatcher } from "./patterns";

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
	success: boolean;
	error?: string;
};

export type Runner = {
	pattern: string;
	command: string;
};

export const Runner = {
	matches(runner: Runner, path: string): boolean {
		let basename = libpath.basename(path);
		let matchers = PatternMatcher.parse(runner.pattern);
		return PatternMatcher.matches(basename, matchers);
	},
	async run(runner: Runner, path: string, logger?: Logger, environment?: Record<string, string | undefined>): Promise<RunReport> {
		let command = runner.command;
		logger?.log(`Spawning ${command} "${path}"...\n`);
		let result = await spawn(command, [path], logger, environment);
		let stdout = parseIfPossible(result.stdout.toString());
		let stderr = parseIfPossible(result.stderr.toString());
		let error = result.error == null ? undefined : result.error.message;
		let status = result.status;
		let success = status === 0;
		logger?.log(`Command ${command} "${path}" returned status ${status ?? ""} (${success ? "success" : "failure"}).\n`);
		return {
			command,
			path,
			stdout,
			stderr,
			success,
			error
		};
	}
};

export type Unit = {
	runner: Runner;
	path: string;
};

export function scanFilePath(path: string, runners: Array<Runner>, logger?: Logger): Array<Unit> {
	for (let runner of runners) {
		if (Runner.matches(runner, path)) {
			let runnable = {
				runner,
				path
			};
			return [runnable];
		}
	}
	return [];
};

export function scanDirectoryPath(parentPath: string, runners: Array<Runner>, logger?: Logger): Array<Unit> {
	let units = [] as Array<Unit>;
	let entries = libfs.readdirSync(parentPath, { withFileTypes: true });
	for (let entry of entries) {
		let path = libpath.join(parentPath, entry.name);
		if (entry.isDirectory()) {
			units.push(...scanDirectoryPath(path, runners, logger));
			continue;
		}
		if (entry.isFile()) {
			units.push(...scanFilePath(path, runners, logger));
			continue;
		}
	}
	return units;
};

export function scanPath(path: string, runners: Array<Runner>, logger?: Logger): Array<Unit> {
	if (libfs.existsSync(path)) {
		logger?.log(`Scanning "${path}" for supported test units...\n`);
		let stats = libfs.statSync(path);
		if (stats.isDirectory()) {
			return scanDirectoryPath(path, runners, logger);
		}
		if (stats.isFile()) {
			return scanFilePath(path, runners, logger);
		}
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
		"./source/",
		"./src/"
	];
};

export function createDefaultRunners(): Array<Runner> {
	return [
		{
			pattern: "*.test.js",
			command: "node"
		},
		{
			pattern: "*.test.ts",
			command: "ts-node"
		}
	];
};

export type Report = {
	reports: Array<RunReport>;
	success: boolean;
};

export async function run(options: Options): Promise<number> {
	let logger = loggers.getLogger(options.logger);
	let paths = options.paths ?? createDefaultPaths();
	let reporter = reporters.getReporter(options.reporter);
	let runners = options.runners ?? createDefaultRunners();
	let units = [] as Array<Unit>;
	for (let path of paths) {
		units.push(...scanPath(libpath.normalize(path), runners, logger));
	}
	let environment: Record<string, string | undefined> = {
		[LOGGER_KEY]: options.logger,
		[REPORTER_KEY]: options.reporter
	};
	let reports = [] as Array<RunReport>;
	let success = true;
	for (let unit of units) {
		let report = await Runner.run(unit.runner, unit.path, logger, environment);
		reports.push(report);
		if (!report.success) {
			success = false;
		}
	}
	logger?.log(`A total of ${units.length} test units were run.\n`);
	let status = success ? 0 : 1;
	logger?.log(`Completed with status ${status ?? ""} (${success ? "success" : "failure"}).\n`);
	let report: Report = {
		reports,
		success
	};
	reporter?.report(report);
	return status;
};
