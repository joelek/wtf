import * as libcp from "child_process";
import * as libfs from "fs";
import * as libpath from "path";
import * as loggers from "./loggers";
import * as reporters from "./reporters";
import { SerializableData } from "./data";
import { Logger } from "./loggers";
import { LOGGER_KEY, REPORTER_KEY } from "./env";
import { PatternMatcher } from "./patterns";
import * as terminal from "./terminal";
import { TestCaseReport, TestCollectionReport } from "./files";

export type SpawnResult = {
	stdout: Buffer;
	stderr: Buffer;
	error?: Error;
	status?: number;
};

export async function spawn(command: string, parameters: Array<string>, logger?: Logger, environment?: Record<string, string | undefined>): Promise<SpawnResult> {
	return new Promise((resolve, reject) => {
		let childProcess = libcp.spawn(command, parameters, { shell: true, env: environment });
		let stdoutChunks = [] as Array<Buffer>;
		let stderrChunks = [] as Array<Buffer>;
		childProcess.stdout.on("data", (chunk) => {
			stdoutChunks.push(chunk);
			if (environment?.[REPORTER_KEY] !== "stdout") {
				logger?.log(chunk);
			}
		});
		childProcess.stderr.on("data", (chunk) => {
			stderrChunks.push(chunk);
			if (environment?.[REPORTER_KEY] !== "stderr") {
				logger?.log(chunk);
			}
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

export type Counter = {
	pass: number;
	fail: number;
};

export type RunReport = {
	command: string;
	path: string;
	stdout: SerializableData;
	stderr: SerializableData;
	success: boolean;
	counter?: Counter;
	error?: string;
};

export type Runner = {
	pattern: string;
	command: string;
};

export function getCounterFromReport(reports: Array<TestCaseReport>): Counter {
	let pass = 0;
	let fail = 0;
	for (let report of reports) {
		if (report.success) {
			pass += 1;
		} else {
			fail += 1;
		}
	}
	return {
		pass,
		fail
	};
};

export const Runner = {
	matches(runner: Runner, path: string): boolean {
		let basename = libpath.basename(path);
		let matchers = PatternMatcher.parse(runner.pattern);
		return PatternMatcher.matches(basename, matchers);
	},
	async run(runner: Runner, path: string, logger?: Logger, environment?: Record<string, string | undefined>): Promise<RunReport> {
		let command = runner.command;
		logger?.log(`Spawning ${terminal.stylize(command, terminal.FG_MAGENTA)} ${terminal.stylize("\"" +  path + "\"", terminal.FG_YELLOW)}...\n`);
		let result = await spawn(command, [path], logger, environment);
		let stdout = parseIfPossible(result.stdout.toString());
		let stderr = parseIfPossible(result.stderr.toString());
		let error = result.error == null ? undefined : result.error.message;
		let status = result.status;
		let success = status === 0;
		let counter: Counter | undefined;
		if (TestCollectionReport.is(stderr)) {
			counter = getCounterFromReport(stderr.reports);
		} else if (TestCollectionReport.is(stdout)) {
			counter = getCounterFromReport(stdout.reports);
		}
		let total = typeof counter !== "undefined" ? counter.pass + counter.fail : undefined;
		logger?.log(`Command ${terminal.stylize(command, terminal.FG_MAGENTA)} ${terminal.stylize("\"" +  path + "\"", terminal.FG_YELLOW)} ran ${terminal.stylize(total ?? "?", terminal.FG_CYAN)} test cases and returned status ${status ?? ""} (${success ? terminal.stylize("success", terminal.FG_GREEN) : terminal.stylize("failure", terminal.FG_RED)}).\n`);
		return {
			command,
			path,
			stdout,
			stderr,
			success,
			counter,
			error
		};
	}
};

export type File = {
	runner: Runner;
	path: string;
};

export function scanFilePath(path: string, runners: Array<Runner>, logger?: Logger): Array<File> {
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

export function scanDirectoryPath(parentPath: string, runners: Array<Runner>, logger?: Logger): Array<File> {
	let files = [] as Array<File>;
	let entries = libfs.readdirSync(parentPath, { withFileTypes: true });
	for (let entry of entries) {
		let path = libpath.join(parentPath, entry.name);
		if (entry.isDirectory()) {
			files.push(...scanDirectoryPath(path, runners, logger));
			continue;
		}
		if (entry.isFile()) {
			files.push(...scanFilePath(path, runners, logger));
			continue;
		}
	}
	return files;
};

export function scanPath(path: string, runners: Array<Runner>, logger?: Logger): Array<File> {
	if (libfs.existsSync(path)) {
		logger?.log(`Scanning ${terminal.stylize("\"" + path + "\"", terminal.FG_YELLOW)} for supported test files...\n`);
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
	counter?: Counter;
};

export async function run(options: Options): Promise<number> {
	let logger = loggers.getLogger(options.logger);
	let paths = options.paths ?? createDefaultPaths();
	let reporter = reporters.getReporter(options.reporter);
	let runners = options.runners ?? createDefaultRunners();
	let files = [] as Array<File>;
	for (let path of paths) {
		files.push(...scanPath(libpath.normalize(path), runners, logger));
	}
	let environment: Record<string, string | undefined> = {
		...process.env,
		[LOGGER_KEY]: "stdout",
		[REPORTER_KEY]: "stderr"
	};
	let reports = [] as Array<RunReport>;
	let success = true;
	let counter: Counter | undefined;
	for (let file of files) {
		let report = await Runner.run(file.runner, file.path, logger, environment);
		reports.push(report);
		if (!report.success) {
			success = false;
		}
		if (typeof report.counter !== "undefined") {
			if (typeof counter === "undefined") {
				counter = {
					pass: 0,
					fail: 0
				};
			}
			counter.pass += report.counter.pass;
			counter.fail += report.counter.fail;
		}
	}
	let total = typeof counter !== "undefined" ? counter.pass + counter.fail : undefined;
	logger?.log(`A total of ${terminal.stylize(total ?? "?", terminal.FG_CYAN)} test cases across ${files.length} test files were run.\n`);
	let status = success ? 0 : 1;
	logger?.log(`Completed with status ${status ?? ""} (${success ? terminal.stylize("success", terminal.FG_GREEN) : terminal.stylize("failure", terminal.FG_RED)}).\n`);
	let report: Report = {
		reports,
		success,
		counter
	};
	reporter?.report(report);
	return status;
};
