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
class TestCase {
    constructor(description, callback) {
        this.description = description;
        this.callback = callback;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.callback();
                return true;
            }
            catch (error) {
                // todo, use loggers
                console.log(`Case "${this.description}" raised an error:`);
                console.log(error);
                return false;
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
            let failures = 0;
            for (let testCase of this.testCases) {
                let outcome = yield testCase.run();
                if (!outcome) {
                    failures += 1;
                }
            }
            return failures;
        });
    }
}
exports.TestSuite = TestSuite;
;
function createTestSuite(description, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        let suite = new TestSuite(description);
        yield callback(suite);
        let status = yield suite.run();
        process.exit(status);
    });
}
exports.createTestSuite = createTestSuite;
;
