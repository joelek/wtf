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
function run() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let options = {};
        let unrecognizedArguments = [];
        for (let arg of process.argv.slice(2)) {
            let parts = null;
            if ((parts = /^--config=(.*)$/.exec(arg)) != null) {
                options = lib.runners.loadConfig(parts[1]);
                continue;
            }
            if ((parts = /^--logger=(.*)$/.exec(arg)) != null) {
                let target = parts[1];
                options.logger = target;
                continue;
            }
            if ((parts = /^--path=(.*)$/.exec(arg)) != null) {
                let path = parts[1];
                let paths = (_a = options.paths) !== null && _a !== void 0 ? _a : [];
                paths.push(path);
                options.paths = paths;
                continue;
            }
            if ((parts = /^--reporter=(.*)$/.exec(arg)) != null) {
                let target = parts[1];
                options.reporter = target;
                continue;
            }
            if ((parts = /^--runner=(.*):(.*)$/.exec(arg)) != null) {
                let pattern = parts[1];
                let command = parts[2];
                let runners = (_b = options.runners) !== null && _b !== void 0 ? _b : [];
                runners.push({
                    pattern,
                    command
                });
                options.runners = runners;
                continue;
            }
            if ((parts = /^--timeout=([0-9]+)$/.exec(arg)) != null) {
                let ms = Number.parseInt(parts[1], 10);
                options.timeout = ms;
                continue;
            }
            unrecognizedArguments.push(arg);
        }
        if (unrecognizedArguments.length === 0) {
            let status = yield lib.runners.run(options);
            return status;
        }
        else {
            let logger = lib.loggers.stderr;
            logger.log(`${app.name} v${app.version}\n`);
            logger.log(`\n`);
            for (let unrecognizedArgument of unrecognizedArguments) {
                logger.log(`Unrecognized argument "${unrecognizedArgument}"!\n`);
            }
            logger.log(`\n`);
            logger.log(`Arguments:\n`);
            logger.log(`\t--config=<path> Load config file from the specified path.\n`);
            logger.log(`\t--logger=<target> Log events to the specified target ("stdout", "stderr" or "").\n`);
            logger.log(`\t--path=<path> Include the specified path when scanning for supported test files.\n`);
            logger.log(`\t--reporter=<target> Report to the specified target ("stdout", "stderr" or "").\n`);
            logger.log(`\t--runner=<pattern>:<command> Launch the specified command for every filename that matches the specified pattern.\n`);
            logger.log(`\t--timeout=<ms> Configure the maximum time a test file is allowed to run.\n`);
            return 1;
        }
    });
}
;
run().then(process.exit);
