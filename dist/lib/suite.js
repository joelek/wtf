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
exports.createSuite = exports.Suite = exports.Test = void 0;
class Test {
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
                console.log(`Failure: "${this.description}" raised an error.`);
                console.log(error);
                return false;
            }
        });
    }
}
exports.Test = Test;
;
class Suite {
    constructor(name) {
        this.name = name;
        this.tests = [];
    }
    defineTest(description, callback) {
        let test = new Test(description, callback);
        this.tests.push(test);
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            let failures = 0;
            for (let test of this.tests) {
                let outcome = yield test.run();
                if (!outcome) {
                    failures += 1;
                }
            }
            return failures;
        });
    }
}
exports.Suite = Suite;
;
function createSuite(name, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        let suite = new Suite(name);
        yield callback(suite);
        let status = yield suite.run();
        process.exit(status);
    });
}
exports.createSuite = createSuite;
;
