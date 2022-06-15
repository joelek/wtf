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
exports.run = exports.createDefaultRunners = exports.createDefaultPaths = exports.scanPath = exports.scanDirectory = exports.scanFile = exports.CustomRunner = exports.TypeScriptRunner = exports.JavaScriptRunner = exports.spawn = void 0;
const libcp = require("child_process");
const libfs = require("fs");
const libpath = require("path");
function spawn(command, parameters) {
    return __awaiter(this, void 0, void 0, function* () {
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
                }
                else {
                    resolve(code);
                }
            });
        });
    });
}
exports.spawn = spawn;
;
;
class JavaScriptRunner {
    constructor() { }
    matches(path) {
        return path.endsWith(".test.js");
    }
    run(path) {
        return spawn("node", [path]);
    }
}
exports.JavaScriptRunner = JavaScriptRunner;
;
class TypeScriptRunner {
    constructor() { }
    matches(path) {
        return path.endsWith(".test.ts");
    }
    run(path) {
        return spawn("ts-node", [path]);
    }
}
exports.TypeScriptRunner = TypeScriptRunner;
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
        return spawn(this.runtime, [path]);
    }
}
exports.CustomRunner = CustomRunner;
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
        console.log(`Path "${path}" does not exist!`);
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
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        let paths = (_a = options.paths) !== null && _a !== void 0 ? _a : createDefaultPaths();
        let runners = (_b = options.runners) !== null && _b !== void 0 ? _b : createDefaultRunners();
        let subjects = [];
        for (let path of paths) {
            subjects.push(...scanPath(path, runners));
        }
        let outcomes = [];
        for (let subject of subjects) {
            let status = yield subject.runner.run(subject.path);
            outcomes.push({
                subject,
                status
            });
        }
        let failures = 0;
        for (let outcome of outcomes) {
            if (outcome.status !== 0) {
                console.log(`Failure: "${outcome.subject.path}" exited with status (${(_c = outcome.status) !== null && _c !== void 0 ? _c : ""})`);
                failures += 1;
            }
        }
        return failures;
    });
}
exports.run = run;
;
