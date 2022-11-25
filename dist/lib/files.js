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
exports.test = exports.TestCollection = exports.TestCollectionReport = exports.TestCase = exports.TestCaseReport = void 0;
const loggers = require("./loggers");
const env_1 = require("./env");
const _1 = require(".");
const asserters_1 = require("./asserters");
const terminal = require("./terminal");
exports.TestCaseReport = {
    is(subject) {
        let description = subject === null || subject === void 0 ? void 0 : subject.description;
        if (!(typeof description === "string")) {
            return false;
        }
        let success = subject === null || subject === void 0 ? void 0 : subject.success;
        if (!(typeof success === "boolean")) {
            return false;
        }
        let duration = subject === null || subject === void 0 ? void 0 : subject.duration;
        if (!(typeof duration === "number" || typeof duration === "undefined")) {
            return false;
        }
        let error = subject === null || subject === void 0 ? void 0 : subject.error;
        if (!(typeof error === "string" || typeof error === "undefined")) {
            return false;
        }
        return true;
    }
};
class TestCase {
    constructor(description, callback) {
        this.description = description;
        this.callback = callback;
    }
    doRun(logger) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let description = this.description;
            let asserter = new asserters_1.Asserter();
            try {
                yield this.callback(asserter);
                let success = true;
                return {
                    description,
                    success
                };
            }
            catch (throwable) {
                logger === null || logger === void 0 ? void 0 : logger.log(`Test case ${terminal.stylize("\"" + description + "\"", terminal.FG_RED)} raised an error!\n`);
                let error;
                if (throwable instanceof Error) {
                    let message = (_a = throwable.stack) !== null && _a !== void 0 ? _a : throwable.message;
                    logger === null || logger === void 0 ? void 0 : logger.log(`${terminal.stylize(message, terminal.FG_RED)}\n`);
                    error = throwable.message;
                }
                let success = false;
                return {
                    description,
                    success,
                    error
                };
            }
        });
    }
    run(logger) {
        return __awaiter(this, void 0, void 0, function* () {
            let start = process.hrtime.bigint();
            let report = yield this.doRun(logger);
            let duration = Number(process.hrtime.bigint() - start) / 1000 / 1000;
            report.duration = duration;
            return report;
        });
    }
}
exports.TestCase = TestCase;
;
exports.TestCollectionReport = {
    is(subject) {
        let reports = subject === null || subject === void 0 ? void 0 : subject.reports;
        if (!(typeof reports === "object" && reports instanceof Array)) {
            return false;
        }
        for (let report of reports) {
            if (!(exports.TestCaseReport.is(report))) {
                return false;
            }
        }
        let success = subject === null || subject === void 0 ? void 0 : subject.success;
        if (!(typeof success === "boolean")) {
            return false;
        }
        return true;
    }
};
class TestCollection {
    constructor() {
        this.testCases = [];
    }
    test(description, callback) {
        let testCase = new TestCase(description, callback);
        this.testCases.push(testCase);
    }
    run(logger) {
        return __awaiter(this, void 0, void 0, function* () {
            let reports = [];
            let success = true;
            for (let testCase of this.testCases) {
                let report = yield testCase.run(logger);
                reports.push(report);
                if (!report.success) {
                    success = false;
                }
            }
            return {
                reports,
                success
            };
        });
    }
}
exports.TestCollection = TestCollection;
;
exports.test = (() => {
    var _a, _b;
    let logger = loggers.getLogger((_a = process.env[env_1.LOGGER_KEY]) !== null && _a !== void 0 ? _a : "stdout");
    let reporter = _1.reporters.getReporter((_b = process.env[env_1.REPORTER_KEY]) !== null && _b !== void 0 ? _b : undefined);
    let collection = new TestCollection();
    process.on("beforeExit", () => __awaiter(void 0, void 0, void 0, function* () {
        let report = yield collection.run(logger);
        reporter === null || reporter === void 0 ? void 0 : reporter.report(report);
        let status = report.success ? 0 : 1;
        process.exit(status);
    }));
    return collection.test.bind(collection);
})();
