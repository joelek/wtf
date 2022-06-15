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
const lib = require("../lib");
function run() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let options = {};
        let badArgumentCount = 0;
        for (let arg of process.argv.slice(2)) {
            let parts = null;
            if ((parts = /^--path=(.+)$/.exec(arg)) != null) {
                let path = parts[1];
                let paths = (_a = options.paths) !== null && _a !== void 0 ? _a : [];
                paths.push(path);
                options.paths = paths;
                continue;
            }
            if ((parts = /^--runner=(.+):(.+)$/.exec(arg)) != null) {
                let suffix = parts[1];
                let runtime = parts[2];
                let runner = new lib.runner.CustomRunner(suffix, runtime);
                let runners = (_b = options.runners) !== null && _b !== void 0 ? _b : [];
                runners.push(runner);
                options.runners = runners;
                continue;
            }
            badArgumentCount += 1;
            console.log(`Unrecognized argument "${arg}"!`);
        }
        if (badArgumentCount === 0) {
            let log = yield lib.runner.run(options);
            console.log(JSON.stringify(log, null, "\t"));
            return log.status;
        }
        else {
            console.log(`Arguments:`);
            console.log(`--path=<path> Include the specified path when scanning for test subjects.`);
            console.log(`--runner=<suffix>:<runtime> Launch the specified runtime for every test subject that matches the specified suffix.`);
            return badArgumentCount;
        }
    });
}
;
run().then(process.exit).catch(console.log);
