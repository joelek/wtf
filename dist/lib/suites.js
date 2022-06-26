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
exports.createTestSuite = exports.TestSuites = exports.TestSuite = exports.TestCase = void 0;
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
                let status = 0;
                return {
                    description,
                    status
                };
            }
            catch (throwable) {
                logger === null || logger === void 0 ? void 0 : logger.log(`Test "${description}" raised an error!\n`);
                let error;
                if (throwable instanceof Error) {
                    logger === null || logger === void 0 ? void 0 : logger.log(`${(_a = throwable.stack) !== null && _a !== void 0 ? _a : throwable.message}\n`);
                    error = throwable.message;
                }
                let status = 1;
                return {
                    description,
                    status,
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
    defineTestCase(description, callback) {
        let testCase = new TestCase(description, callback);
        this.testCases.push(testCase);
    }
    run(logger) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.callback(this);
            let description = this.description;
            let reports = [];
            let status = 0;
            for (let testCase of this.testCases) {
                let report = yield testCase.run(logger);
                reports.push(report);
                if (report.status != 0) {
                    status = 1;
                }
            }
            return {
                description,
                reports,
                status
            };
        });
    }
}
exports.TestSuite = TestSuite;
;
class TestSuites {
    constructor() {
        this.testSuites = [];
    }
    createTestSuite(description, callback) {
        let testSuite = new TestSuite(description, callback);
        this.testSuites.push(testSuite);
    }
    run(logger) {
        return __awaiter(this, void 0, void 0, function* () {
            let reports = [];
            let status = 0;
            for (let testSuite of this.testSuites) {
                let report = yield testSuite.run(logger);
                reports.push(report);
                if (report.status != 0) {
                    status = 1;
                }
            }
            return {
                reports,
                status
            };
        });
    }
}
exports.TestSuites = TestSuites;
;
exports.createTestSuite = (() => {
    var _a, _b;
    let logger = loggers.getLogger((_a = process.env[env_1.LOGGER_KEY]) !== null && _a !== void 0 ? _a : "stdout");
    let reporter = _1.reporters.getReporter((_b = process.env[env_1.REPORTER_KEY]) !== null && _b !== void 0 ? _b : undefined);
    let suites = new TestSuites();
    process.on("beforeExit", () => __awaiter(void 0, void 0, void 0, function* () {
        let report = yield suites.run(logger);
        reporter === null || reporter === void 0 ? void 0 : reporter.report(report);
        process.exit(report.status);
    }));
    return suites.createTestSuite.bind(suites);
})();
