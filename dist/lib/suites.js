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
exports.createTestSuite = exports.TestSuite = exports.TestCase = void 0;
const loggers = require("./loggers");
const errors_1 = require("./errors");
const json_1 = require("./json");
const reporters_1 = require("./reporters");
class TestCase {
    constructor(description, callback) {
        this.description = description;
        this.callback = callback;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            let description = this.description;
            try {
                yield this.callback();
                return {
                    description
                };
            }
            catch (throwable) {
                let error = throwable instanceof Error ? errors_1.SerializedError.fromError(throwable) : json_1.JSON.parse(json_1.JSON.serialize(throwable));
                return {
                    description,
                    error
                };
            }
        });
    }
}
exports.TestCase = TestCase;
;
class TestSuite {
    constructor(description) {
        this.description = description;
        this.testCases = [];
    }
    defineTestCase(description, callback) {
        let testCase = new TestCase(description, callback);
        this.testCases.push(testCase);
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            let reports = [];
            let status = 0;
            for (let testCase of this.testCases) {
                let report = yield testCase.run();
                reports.push(report);
                if (report.error != null) {
                    status += 1;
                }
            }
            return {
                reports,
                status
            };
        });
    }
}
exports.TestSuite = TestSuite;
;
function createTestSuite(description, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        let suite = new TestSuite(description);
        yield callback(suite);
        let report = yield suite.run();
        let logger = loggers.stderr;
        let reporter = new reporters_1.JSONReporter(logger);
        reporter.report(report);
        process.exit(report.status);
    });
}
exports.createTestSuite = createTestSuite;
;
