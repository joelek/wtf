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
exports.suite = exports.TestUnit = exports.TestSuite = exports.TestCase = void 0;
const loggers = require("./loggers");
const env_1 = require("./env");
const _1 = require(".");
const asserters_1 = require("./asserters");
class TestCase {
    constructor(description, callback) {
        this.description = description;
        this.callback = callback;
    }
    run(logger) {
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
                logger === null || logger === void 0 ? void 0 : logger.log(`Test "${description}" raised an error!\n`);
                let error;
                if (throwable instanceof Error) {
                    logger === null || logger === void 0 ? void 0 : logger.log(`${(_a = throwable.stack) !== null && _a !== void 0 ? _a : throwable.message}\n`);
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
}
exports.TestCase = TestCase;
;
class TestSuite {
    constructor(description, callback) {
        this.description = description;
        this.testCases = [];
        this.callback = callback;
    }
    case(description, callback) {
        let testCase = new TestCase(description, callback);
        this.testCases.push(testCase);
    }
    run(logger) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.callback(this);
            let description = this.description;
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
                description,
                reports,
                success
            };
        });
    }
}
exports.TestSuite = TestSuite;
;
class TestUnit {
    constructor() {
        this.testSuites = [];
    }
    suite(description, callback) {
        let testSuite = new TestSuite(description, callback);
        this.testSuites.push(testSuite);
    }
    run(logger) {
        return __awaiter(this, void 0, void 0, function* () {
            let reports = [];
            let success = true;
            for (let testSuite of this.testSuites) {
                let report = yield testSuite.run(logger);
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
exports.TestUnit = TestUnit;
;
exports.suite = (() => {
    var _a, _b;
    let logger = loggers.getLogger((_a = process.env[env_1.LOGGER_KEY]) !== null && _a !== void 0 ? _a : "stdout");
    let reporter = _1.reporters.getReporter((_b = process.env[env_1.REPORTER_KEY]) !== null && _b !== void 0 ? _b : undefined);
    let unit = new TestUnit();
    process.on("beforeExit", () => __awaiter(void 0, void 0, void 0, function* () {
        let report = yield unit.run(logger);
        reporter === null || reporter === void 0 ? void 0 : reporter.report(report);
        let status = report.success ? 0 : 1;
        process.exit(status);
    }));
    return unit.suite.bind(unit);
})();
