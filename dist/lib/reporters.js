"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReporter = exports.JSONReporter = void 0;
const loggers = require("./loggers");
const json_1 = require("./json");
;
class JSONReporter {
    constructor(logger) {
        this.logger = logger;
    }
    report(report) {
        var _a;
        (_a = this.logger) === null || _a === void 0 ? void 0 : _a.log(json_1.JSON.serialize(report) + "\n");
    }
}
exports.JSONReporter = JSONReporter;
;
function getReporter(target) {
    return new JSONReporter(loggers.getLogger(target));
}
exports.getReporter = getReporter;
;
