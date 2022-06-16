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
exports.run = exports.createDefaultRunners = exports.createDefaultPaths = exports.scanPath = exports.scanDirectoryPath = exports.scanFilePath = exports.TypeScriptRunner = exports.JavaScriptRunner = exports.CustomRunner = exports.serializeError = exports.spawn = void 0;
const libcp = require("child_process");
const libfs = require("fs");
const libpath = require("path");
function spawn(command, parameters) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let childProcess = libcp.spawn(command, parameters, { shell: true });
            let stdoutChunks = [];
            let stderrChunks = [];
            childProcess.stdout.pipe(process.stdout);
            childProcess.stderr.pipe(process.stdout); // This is intentional.
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
function serializeError(error) {
    return {
        name: error.name,
        message: error.message,
        stack: error.stack
    };
}
exports.serializeError = serializeError;
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
    run(path) {
        return __awaiter(this, void 0, void 0, function* () {
            let command = this.command;
            console.log(`Running ${command} "${path}"...`);
            let result = yield spawn(command, [path]);
            let stdout = result.stdout.toString();
            let stderr = result.stderr.toString();
            let error = result.error == null ? undefined : serializeError(result.error);
            let status = result.status;
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
function scanFilePath(path, runners) {
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
function scanDirectoryPath(parentPath, runners) {
    let runnables = [];
    let entries = libfs.readdirSync(parentPath, { withFileTypes: true });
    for (let entry of entries) {
        let path = libpath.join(parentPath, entry.name);
        if (entry.isDirectory()) {
            runnables.push(...scanDirectoryPath(path, runners));
            continue;
        }
        if (entry.isFile()) {
            runnables.push(...scanFilePath(path, runners));
            continue;
        }
    }
    return runnables;
}
exports.scanDirectoryPath = scanDirectoryPath;
;
function scanPath(path, runners) {
    if (libfs.existsSync(path)) {
        let stats = libfs.statSync(path);
        if (stats.isDirectory()) {
            return scanDirectoryPath(path, runners);
        }
        if (stats.isFile()) {
            return scanFilePath(path, runners);
        }
    }
    else {
        throw `Path "${path}" does not exist!`;
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
        let paths = (_a = options.paths) !== null && _a !== void 0 ? _a : createDefaultPaths();
        let runners = (_b = options.runners) !== null && _b !== void 0 ? _b : createDefaultRunners();
        let runnables = [];
        for (let path of paths) {
            runnables.push(...scanPath(path, runners));
        }
        let logs = [];
        let status = 0;
        for (let runnable of runnables) {
            let log = yield runnable.runner.run(runnable.path);
            logs.push(log);
            if (log.status !== 0) {
                status += 1;
            }
        }
        return {
            logs,
            status
        };
    });
}
exports.run = run;
;
