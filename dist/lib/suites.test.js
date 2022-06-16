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
const suites = require("./suites");
const suites_1 = require("./suites");
(0, suites_1.createTestSuite)("Suite", (suite) => __awaiter(void 0, void 0, void 0, function* () {
    suite.defineTestCase(`It should return true when a test runs successfully.`, () => __awaiter(void 0, void 0, void 0, function* () {
        let testCase = new suites.TestCase("", () => __awaiter(void 0, void 0, void 0, function* () { }));
        let observed = yield testCase.run();
        if (observed !== true) {
            throw "";
        }
    }));
    suite.defineTestCase(`It should return false when a test runs unsuccessfully.`, () => __awaiter(void 0, void 0, void 0, function* () {
        let testCase = new suites.TestCase("", () => __awaiter(void 0, void 0, void 0, function* () { throw ""; }));
        let observed = yield testCase.run();
        if (observed !== false) {
            throw "";
        }
    }));
}));
