"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONReporter = void 0;
;
class JSONReporter {
    constructor(logger) {
        this.logger = logger;
    }
    report(report) {
        var _a;
        (_a = this.logger) === null || _a === void 0 ? void 0 : _a.log(JSON.stringify(report, null, "\t") + "\n");
    }
}
exports.JSONReporter = JSONReporter;
;
