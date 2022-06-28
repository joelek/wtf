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
class AlwaysEqual {
    equals() {
        return true;
    }
}
;
class NeverEqual {
    equals() {
        return false;
    }
}
;
wtf.suite("equals", (suite) => __awaiter(void 0, void 0, void 0, function* () {
    suite.case(`It should throw an error for two instances of NeverEqual.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
        yield assert.throws(() => {
            assert.equals(new NeverEqual(), new NeverEqual());
        });
    }));
    suite.case(`It should not throw an error for two instances of AlwaysEqual.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
        assert.equals(new AlwaysEqual(), new AlwaysEqual());
    }));
}));
wtf.suite("throws", (suite) => __awaiter(void 0, void 0, void 0, function* () {
    suite.case(`It should assert that an operation throws an error.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
        yield assert.throws(() => {
            assert.equals(1, 2);
        });
    }));
}));
