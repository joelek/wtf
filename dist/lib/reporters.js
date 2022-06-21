"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReporter = exports.JSONReporter = void 0;
const loggers = require("./loggers");
const data_1 = require("./data");
;
class JSONReporter {
    constructor(logger) {
        this.logger = logger;
    }
    report(report) {
        var _a;
        (_a = this.logger) === null || _a === void 0 ? void 0 : _a.log(data_1.SerializableData.serialize(report) + "\n");
    }
}
exports.JSONReporter = JSONReporter;
;
function getReporter(target) {
    return new JSONReporter(loggers.getLogger(target));
}
exports.getReporter = getReporter;
;
