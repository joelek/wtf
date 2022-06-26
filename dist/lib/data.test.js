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
const data = require("./data");
const suites_1 = require("./suites");
(0, suites_1.createTestSuite)("Uint8Array", (suite) => __awaiter(void 0, void 0, void 0, function* () {
    const UNWRAPPED = Uint8Array.of(1, 2);
    const WRAPPED = {
        type: "Uint8Array",
        data: [1, 2]
    };
    suite.defineTestCase(`It should wrap Uint8Array.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
        assert.equals(data.SerializableDataWrapper.wrap(UNWRAPPED), WRAPPED);
    }));
    suite.defineTestCase(`It should unwrap Uint8Array.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
        assert.equals(data.SerializableDataWrapper.unwrap(WRAPPED), UNWRAPPED);
    }));
}));
(0, suites_1.createTestSuite)("Uint16Array", (suite) => __awaiter(void 0, void 0, void 0, function* () {
    const UNWRAPPED = Uint16Array.of(1, 2);
    const WRAPPED = {
        type: "Uint16Array",
        data: [1, 2]
    };
    suite.defineTestCase(`It should wrap Uint16Array.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
        assert.equals(data.SerializableDataWrapper.wrap(UNWRAPPED), WRAPPED);
    }));
    suite.defineTestCase(`It should unwrap Uint16Array.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
        assert.equals(data.SerializableDataWrapper.unwrap(WRAPPED), UNWRAPPED);
    }));
}));
