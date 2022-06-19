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
exports.run = exports.createDefaultRunners = exports.createDefaultPaths = exports.scanPath = exports.scanDirectoryPath = exports.scanFilePath = exports.TypeScriptRunner = exports.JavaScriptRunner = exports.CustomRunner = exports.parseIfPossible = exports.spawn = void 0;
const libcp = require("child_process");
const libfs = require("fs");
const libpath = require("path");
const loggers = require("./loggers");
const reporters = require("./reporters");
const json_1 = require("./json");
const env_1 = require("./env");
function spawn(command, parameters, logger, environment) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let childProcess = libcp.spawn(command, parameters, { shell: true, env: Object.assign(Object.assign({}, process.env), environment) });
            let stdoutChunks = [];
            let stderrChunks = [];
            childProcess.stdout.on("data", (chunk) => {
                stdoutChunks.push(chunk);
                logger === null || logger === void 0 ? void 0 : logger.log(chunk);
            });
            childProcess.stderr.on("data", (chunk) => {
                stderrChunks.push(chunk);
                logger === null || logger === void 0 ? void 0 : logger.log(chunk);
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
    });
}
exports.spawn = spawn;
;
function parseIfPossible(string) {
    try {
        return json_1.JSON.parse(string);
    }
    catch (error) { }
    ;
    return string;
}
exports.parseIfPossible = parseIfPossible;
;
;
class CustomRunner {
    constructor(suffix, command) {
        this.suffix = suffix;
        this.command = command;
    }
    matches(path) {
        return path.endsWith(this.suffix);
    }
    run(path, logger, environment) {
        return __awaiter(this, void 0, void 0, function* () {
            let command = this.command;
            logger === null || logger === void 0 ? void 0 : logger.log(`Spawning ${command} "${path}"...\n`);
            let result = yield spawn(command, [path], logger, environment);
            let stdout = parseIfPossible(result.stdout.toString());
            let stderr = parseIfPossible(result.stderr.toString());
            let error = result.error == null ? undefined : result.error.message;
            let status = result.status;
            logger === null || logger === void 0 ? void 0 : logger.log(`Command ${command} returned status ${status !== null && status !== void 0 ? status : ""} (${status === 0 ? "success" : "failure"}).\n`);
            return {
                command,
                path,
                stdout,
                stderr,
                error,
                status
            };
        });
    }
}
exports.CustomRunner = CustomRunner;
;
class JavaScriptRunner extends CustomRunner {
    constructor() {
        super(".test.js", "node");
    }
}
exports.JavaScriptRunner = JavaScriptRunner;
;
class TypeScriptRunner extends CustomRunner {
    constructor() {
        super(".test.ts", "ts-node");
    }
}
exports.TypeScriptRunner = TypeScriptRunner;
;
function scanFilePath(path, runners, logger) {
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
}
exports.scanFilePath = scanFilePath;
;
function scanDirectoryPath(parentPath, runners, logger) {
    let runnables = [];
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
}
exports.scanDirectoryPath = scanDirectoryPath;
;
function scanPath(path, runners, logger) {
    logger === null || logger === void 0 ? void 0 : logger.log(`Scanning "${path}" for files...\n`);
    if (libfs.existsSync(path)) {
        let stats = libfs.statSync(path);
        if (stats.isDirectory()) {
            return scanDirectoryPath(path, runners, logger);
        }
        if (stats.isFile()) {
            return scanFilePath(path, runners, logger);
        }
    }
    else {
        logger === null || logger === void 0 ? void 0 : logger.log(`Path "${path}" does not exist!\n`);
    }
    return [];
}
exports.scanPath = scanPath;
;
function createDefaultPaths() {
    return [
        "./source/"
    ];
}
exports.createDefaultPaths = createDefaultPaths;
;
function createDefaultRunners() {
    return [
        new JavaScriptRunner(),
        new TypeScriptRunner()
    ];
}
exports.createDefaultRunners = createDefaultRunners;
;
function run(options) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let logger = loggers.getLogger(options.logger);
        let paths = (_a = options.paths) !== null && _a !== void 0 ? _a : createDefaultPaths();
        let reporter = reporters.getReporter(options.reporter);
        let runners = (_b = options.runners) !== null && _b !== void 0 ? _b : createDefaultRunners();
        let runnables = [];
        for (let path of paths) {
            runnables.push(...scanPath(libpath.normalize(path), runners, logger));
        }
        let environment = {
            [env_1.LOGGER_KEY]: options.logger,
            [env_1.REPORTER_KEY]: options.reporter
        };
        let reports = [];
        let status = 0;
        for (let runnable of runnables) {
            let report = yield runnable.runner.run(runnable.path, logger, environment);
            reports.push(report);
            if (report.status !== 0) {
                status += 1;
            }
        }
        logger === null || logger === void 0 ? void 0 : logger.log(`Completed with status ${status !== null && status !== void 0 ? status : ""} (${status === 0 ? "success" : "failure"}).\n`);
        let report = {
            reports,
            status
        };
        reporter === null || reporter === void 0 ? void 0 : reporter.report(report);
        return status;
    });
}
exports.run = run;
;
