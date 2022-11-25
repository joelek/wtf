"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = exports.ConfigFormatError = exports.run = exports.createDefaultRunners = exports.createDefaultPaths = exports.Options = exports.scanPath = exports.scanDirectoryPath = exports.scanFilePath = exports.Runner = exports.getCounterFromReport = exports.parseIfPossible = exports.spawn = exports.SpawnSignalError = void 0;
const libcp = require("child_process");
const libfs = require("fs");
const libpath = require("path");
const loggers = require("./loggers");
const reporters = require("./reporters");
const data_1 = require("./data");
const env_1 = require("./env");
const patterns_1 = require("./patterns");
const terminal = require("./terminal");
const files_1 = require("./files");
class SpawnSignalError extends Error {
    constructor(signal) {
        super();
        this.signal = signal;
    }
    get message() {
        return `Expected process not to exit with signal ${this.signal}!`;
    }
}
exports.SpawnSignalError = SpawnSignalError;
;
function spawn(command, parameters, logger, environment, timeout) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let childProcess = libcp.spawn(command, parameters, { timeout: timeout, shell: true, env: environment });
            let stdoutChunks = [];
            let stderrChunks = [];
            childProcess.stdout.on("data", (chunk) => {
                stdoutChunks.push(chunk);
                if ((environment === null || environment === void 0 ? void 0 : environment[env_1.REPORTER_KEY]) !== "stdout") {
                    logger === null || logger === void 0 ? void 0 : logger.log(chunk);
                }
            });
            childProcess.stderr.on("data", (chunk) => {
                stderrChunks.push(chunk);
                if ((environment === null || environment === void 0 ? void 0 : environment[env_1.REPORTER_KEY]) !== "stderr") {
                    logger === null || logger === void 0 ? void 0 : logger.log(chunk);
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
            childProcess.on("exit", (code, signal) => {
                let stdout = Buffer.concat(stdoutChunks);
                let stderr = Buffer.concat(stderrChunks);
                let error = signal == null ? undefined : new SpawnSignalError(signal);
                let status = code == null ? undefined : code;
                resolve({
                    stdout,
                    stderr,
                    error,
                    status
                });
            });
        });
    });
}
exports.spawn = spawn;
;
function parseIfPossible(string) {
    try {
        return data_1.SerializableData.parse(string);
    }
    catch (error) { }
    ;
    return string;
}
exports.parseIfPossible = parseIfPossible;
;
function getCounterFromReport(reports) {
    let pass = 0;
    let fail = 0;
    for (let report of reports) {
        if (report.success) {
            pass += 1;
        }
        else {
            fail += 1;
        }
    }
    return {
        pass,
        fail
    };
}
exports.getCounterFromReport = getCounterFromReport;
;
exports.Runner = {
    matches(runner, path) {
        let basename = libpath.basename(path);
        let matchers = patterns_1.PatternMatcher.parse(runner.pattern);
        return patterns_1.PatternMatcher.matches(basename, matchers);
    },
    run(runner, path, logger, environment) {
        return __awaiter(this, void 0, void 0, function* () {
            let command = runner.command;
            logger === null || logger === void 0 ? void 0 : logger.log(`Spawning ${terminal.stylize(command, terminal.FG_MAGENTA)} ${terminal.stylize("\"" + path + "\"", terminal.FG_YELLOW)}...\n`);
            let start = process.hrtime.bigint();
            let result = yield spawn(command, [path], logger, environment);
            let duration = Number(process.hrtime.bigint() - start) / 1000 / 1000;
            let stdout = parseIfPossible(result.stdout.toString());
            let stderr = parseIfPossible(result.stderr.toString());
            let error = result.error == null ? undefined : result.error.message;
            let status = result.status;
            let success = status === 0;
            let counter;
            if (files_1.TestCollectionReport.is(stderr)) {
                counter = getCounterFromReport(stderr.reports);
            }
            else if (files_1.TestCollectionReport.is(stdout)) {
                counter = getCounterFromReport(stdout.reports);
            }
            let total = typeof counter !== "undefined" ? counter.pass + counter.fail : undefined;
            logger === null || logger === void 0 ? void 0 : logger.log(`Command ${terminal.stylize(command, terminal.FG_MAGENTA)} ${terminal.stylize("\"" + path + "\"", terminal.FG_YELLOW)} ran ${terminal.stylize(total !== null && total !== void 0 ? total : "?", terminal.FG_CYAN)} test cases and returned status ${status !== null && status !== void 0 ? status : "?"} (${success ? terminal.stylize("success", terminal.FG_GREEN) : terminal.stylize("failure", terminal.FG_RED)}).\n`);
            return {
                command,
                path,
                stdout,
                stderr,
                success,
                duration,
                counter,
                error
            };
        });
    }
};
function scanFilePath(path, runners, logger) {
    for (let runner of runners) {
        if (exports.Runner.matches(runner, path)) {
            let runnable = {
                runner,
                path
            };
            return [runnable];
        }
    }
    return [];
}
exports.scanFilePath = scanFilePath;
;
function scanDirectoryPath(parentPath, runners, logger) {
    let files = [];
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
}
exports.scanDirectoryPath = scanDirectoryPath;
;
function scanPath(path, runners, logger) {
    if (libfs.existsSync(path)) {
        logger === null || logger === void 0 ? void 0 : logger.log(`Scanning ${terminal.stylize("\"" + path + "\"", terminal.FG_YELLOW)} for supported test files...\n`);
        let stats = libfs.statSync(path);
        if (stats.isDirectory()) {
            return scanDirectoryPath(path, runners, logger);
        }
        if (stats.isFile()) {
            return scanFilePath(path, runners, logger);
        }
    }
    return [];
}
exports.scanPath = scanPath;
;
exports.Options = {
    is(subject) {
        let logger = subject === null || subject === void 0 ? void 0 : subject.logger;
        if (!(typeof logger === "string" || typeof logger === "undefined")) {
            return false;
        }
        let paths = subject === null || subject === void 0 ? void 0 : subject.paths;
        if (!(Array.isArray(paths) || typeof paths === "undefined")) {
            return false;
        }
        for (let path of paths !== null && paths !== void 0 ? paths : []) {
            if (!(typeof path === "string")) {
                return false;
            }
        }
        let reporter = subject === null || subject === void 0 ? void 0 : subject.reporter;
        if (!(typeof reporter === "string" || typeof reporter === "undefined")) {
            return false;
        }
        let runners = subject === null || subject === void 0 ? void 0 : subject.runners;
        if (!(Array.isArray(runners) || typeof runners === "undefined")) {
            return false;
        }
        for (let runner of runners !== null && runners !== void 0 ? runners : []) {
            let pattern = runner === null || runner === void 0 ? void 0 : runner.pattern;
            if (!(typeof pattern === "string")) {
                return false;
            }
            let command = runner === null || runner === void 0 ? void 0 : runner.command;
            if (!(typeof command === "string")) {
                return false;
            }
        }
        return true;
    }
};
function createDefaultPaths() {
    return [
        "./source/",
        "./src/"
    ];
}
exports.createDefaultPaths = createDefaultPaths;
;
function createDefaultRunners() {
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
}
exports.createDefaultRunners = createDefaultRunners;
;
function run(options) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        let logger = loggers.getLogger((_a = options.logger) !== null && _a !== void 0 ? _a : "stdout");
        let paths = (_b = options.paths) !== null && _b !== void 0 ? _b : createDefaultPaths();
        let reporter = reporters.getReporter(options.reporter);
        let runners = (_c = options.runners) !== null && _c !== void 0 ? _c : createDefaultRunners();
        let files = [];
        for (let path of paths) {
            files.push(...scanPath(libpath.normalize(path), runners, logger));
        }
        let environment = Object.assign(Object.assign({}, process.env), { [env_1.LOGGER_KEY]: "stdout", [env_1.REPORTER_KEY]: "stderr" });
        let reports = [];
        let success = true;
        let counter;
        for (let file of files) {
            let report = yield exports.Runner.run(file.runner, file.path, logger, environment);
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
        let total = typeof counter !== "undefined" ? counter.pass + counter.fail : files.length === 0 ? 0 : undefined;
        logger === null || logger === void 0 ? void 0 : logger.log(`A total of ${terminal.stylize(total !== null && total !== void 0 ? total : "?", terminal.FG_CYAN)} test cases across ${files.length} test files were run.\n`);
        let status = success ? 0 : 1;
        logger === null || logger === void 0 ? void 0 : logger.log(`Completed with status ${status} (${success ? terminal.stylize("success", terminal.FG_GREEN) : terminal.stylize("failure", terminal.FG_RED)}).\n`);
        let report = {
            reports,
            success,
            counter
        };
        reporter === null || reporter === void 0 ? void 0 : reporter.report(report);
        return status;
    });
}
exports.run = run;
;
class ConfigFormatError extends Error {
    get message() {
        return `Expected a valid config file!`;
    }
    constructor() {
        super();
    }
}
exports.ConfigFormatError = ConfigFormatError;
;
function loadConfig(path) {
    let string = libfs.readFileSync(path, "utf-8");
    let json = JSON.parse(string);
    if (!exports.Options.is(json)) {
        throw new ConfigFormatError();
    }
    return json;
}
exports.loadConfig = loadConfig;
;
