"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.json = exports.JSONReporter = void 0;
;
class JSONReporter {
    constructor(logger) {
        this.logger = logger;
    }
    report(report) {
        var _a;
        (_a = this.logger) === null || _a === void 0 ? void 0 : _a.log(globalThis.JSON.stringify(report != null ? report : null, null, "\t") + "\n");
    }
}
exports.JSONReporter = JSONReporter;
;
exports.json = new JSONReporter();
