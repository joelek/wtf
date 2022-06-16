#!/usr/bin/env node
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
const app = require("../app.json");
const lib = require("../lib");
const stdout = new lib.loggers.StdoutLogger();
const stderr = new lib.loggers.StderrLogger();
function getLogger(target) {
    if (target === "stdout") {
        return stdout;
    }
    if (target === "stderr") {
        return stderr;
    }
}
;
function run() {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        let options = {
            logger: stdout
        };
        let unrecognizedArguments = [];
        for (let arg of process.argv.slice(2)) {
            let parts = null;
            if ((parts = /^--logger=(.*)$/.exec(arg)) != null) {
                let target = parts[1];
                let logger = getLogger(target);
                options.logger = logger;
                continue;
            }
            if ((parts = /^--path=(.*)$/.exec(arg)) != null) {
                let path = parts[1];
                let paths = (_a = options.paths) !== null && _a !== void 0 ? _a : [];
                paths.push(path);
                options.paths = paths;
                continue;
            }
            if ((parts = /^--reporter=(.*):(.*)$/.exec(arg)) != null) {
                let target = parts[1];
                let reporter = parts[2];
                let logger = getLogger(target);
                if (reporter === "json") {
                    options.reporter = new lib.reporters.JSONReporter(logger);
                }
                continue;
            }
            if ((parts = /^--runner=(.*):(.*)$/.exec(arg)) != null) {
                let suffix = parts[1];
                let command = parts[2];
                let runner = new lib.runners.CustomRunner(suffix, command);
                let runners = (_b = options.runners) !== null && _b !== void 0 ? _b : [];
                runners.push(runner);
                options.runners = runners;
                continue;
            }
            unrecognizedArguments.push(arg);
        }
        if (unrecognizedArguments.length === 0) {
            (_c = options.logger) === null || _c === void 0 ? void 0 : _c.log(`${app.name} v${app.version}\n`);
            let status = yield lib.runners.run(options);
            return status;
        }
        else {
            for (let unrecognizedArgument of unrecognizedArguments) {
                stderr.log(`Unrecognized argument "${unrecognizedArgument}"!\n`);
            }
            stderr.log(`Arguments:\n`);
            stderr.log(`\t--logger=<target> Log events to the specified target ("stdout" or "stderr").\n`);
            stderr.log(`\t--path=<path> Include the specified path when scanning for files.\n`);
            stderr.log(`\t--reporter=<target>:<reporter> Report to the specified target ("stdout" or "stderr") using the specified reporter ("json").\n`);
            stderr.log(`\t--runner=<suffix>:<command> Launch the specified command for every filename that ends with the specified suffix.\n`);
            return unrecognizedArguments.length;
        }
    });
}
;
run().then(process.exit).catch(stderr.log);
