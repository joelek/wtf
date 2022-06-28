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
const wtf = require("./");
const suites = require("./suites");
wtf.createTestSuite("Suite", (suite) => __awaiter(void 0, void 0, void 0, function* () {
    suite.defineTestCase(`It should not capture an error when a test runs successfully.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
        let testCase = new suites.TestCase("", () => __awaiter(void 0, void 0, void 0, function* () { }));
        let report = yield testCase.run();
        if (report.error != null) {
            throw "";
        }
    }));
    suite.defineTestCase(`It should capture an error when a test runs unsuccessfully.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
        let testCase = new suites.TestCase("", () => __awaiter(void 0, void 0, void 0, function* () { throw new Error(); }));
        let report = yield testCase.run();
        if (report.error == null) {
            throw "";
        }
    }));
}));
