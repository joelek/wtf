"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONReporter = void 0;
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
