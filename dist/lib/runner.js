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
exports.run = exports.createDefaultRunners = exports.createDefaultPaths = exports.scanPath = exports.scanDirectory = exports.scanFile = exports.TypeScriptRunner = exports.JavaScriptRunner = exports.CustomRunner = exports.spawn = void 0;
const libcp = require("child_process");
const libfs = require("fs");
const libpath = require("path");
function spawn(command, parameters) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let stringParameters = parameters.map((parameter) => JSON.stringify(parameter)).join(" ");
            process.stderr.write(`Running ${command} with parameters ${stringParameters}...\n`);
            let childProcess = libcp.spawn(command, parameters, { shell: true });
            let stdoutChunks = [];
            let stderrChunks = [];
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
    });
}
exports.spawn = spawn;
;
;
class CustomRunner {
    constructor(suffix, runtime) {
        this.suffix = suffix;
        this.runtime = runtime;
    }
    matches(path) {
        return path.endsWith(this.suffix);
    }
    run(path) {
        return __awaiter(this, void 0, void 0, function* () {
            let runtime = this.runtime;
            let outcome = yield spawn(runtime, [path]);
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
function scanFile(path, runners) {
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
}
exports.scanFile = scanFile;
;
function scanDirectory(parentPath, runners) {
    let subjects = [];
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
}
exports.scanDirectory = scanDirectory;
;
function scanPath(path, runners) {
    if (libfs.existsSync(path)) {
        let stats = libfs.statSync(path);
        if (stats.isDirectory()) {
            return scanDirectory(path, runners);
        }
        if (stats.isFile()) {
            return scanFile(path, runners);
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
        let subjects = [];
        for (let path of paths) {
            subjects.push(...scanPath(path, runners));
        }
        let suites = [];
        let status = 0;
        for (let subject of subjects) {
            let runLog = yield subject.runner.run(subject.path);
            suites.push(runLog);
            if (runLog.status !== 0) {
                status += 1;
            }
        }
        return {
            suites,
            status
        };
    });
}
exports.run = run;
;
