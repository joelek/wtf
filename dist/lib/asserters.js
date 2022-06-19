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
exports.asserter = exports.Asserter = exports.getTypename = void 0;
const errors_1 = require("./errors");
const json_1 = require("./json");
function getTypename(subject) {
    var _a;
    if (subject === null) {
        return "null";
    }
    if (typeof ((_a = subject === null || subject === void 0 ? void 0 : subject.constructor) === null || _a === void 0 ? void 0 : _a.name) === "string") {
        return subject.constructor.name;
    }
    return typeof subject;
}
exports.getTypename = getTypename;
;
class Asserter {
    equalsArray(expected, observed) {
        if (!(observed instanceof Array)) {
            throw `Expected type ${getTypename(observed)} to be ${getTypename(expected)}!`;
        }
        for (let i = observed.length; i < expected.length; i++) {
            throw `Expected element ${i} to be present!`;
        }
        for (let i = expected.length; i < observed.length; i++) {
            throw `Expected element ${i} to be absent!`;
        }
        for (let i = 0; i < expected.length; i++) {
            this.equals(expected[i], observed[i]);
        }
    }
    equalsBoolean(expected, observed) {
        if (!(typeof observed === "boolean")) {
            throw `Expected type ${getTypename(observed)} to be ${getTypename(expected)}!`;
        }
        if (expected !== observed) {
            throw `Expected value ${observed} to be ${expected}!`;
        }
    }
    equalsNull(expected, observed) {
        if (!(observed === null)) {
            throw `Expected type ${getTypename(observed)} to be ${getTypename(expected)}!`;
        }
    }
    equalsNumber(expected, observed) {
        if (!(typeof observed === "number")) {
            throw `Expected type ${getTypename(observed)} to be ${getTypename(expected)}!`;
        }
        if (expected !== observed) {
            throw `Expected value ${observed} to be ${expected}!`;
        }
    }
    equalsObject(expected, observed) {
        if (!(observed instanceof Object && !(observed instanceof Array))) {
            throw `Expected type ${getTypename(observed)} to be ${getTypename(expected)}!`;
        }
        for (let key in expected) {
            if (!(key in observed)) {
                throw `Expected key "${key}" to be present!`;
            }
        }
        for (let key in observed) {
            if (!(key in expected)) {
                throw `Expected key "${key}" to be absent!`;
            }
        }
        for (let key in expected) {
            this.equals(expected[key], observed[key]);
        }
    }
    equalsString(expected, observed) {
        if (!(typeof observed === "string")) {
            throw `Expected type ${getTypename(observed)} to be ${getTypename(expected)}!`;
        }
        if (expected !== observed) {
            throw `Expected value "${observed}" to be "${expected}"!`;
        }
    }
    equalsUndefined(expected, observed) {
        if (!(observed === undefined)) {
            throw `Expected type ${getTypename(observed)} to be ${getTypename(expected)}!`;
        }
    }
    constructor() { }
    equals(expected, observed) {
        try {
            if (expected instanceof Array) {
                return this.equalsArray(expected, observed);
            }
            if (typeof expected === "boolean") {
                return this.equalsBoolean(expected, observed);
            }
            if (expected === null) {
                return this.equalsNull(expected, observed);
            }
            if (typeof expected === "number") {
                return this.equalsNumber(expected, observed);
            }
            if (expected instanceof Object && !(expected instanceof Array)) {
                return this.equalsObject(expected, observed);
            }
            if (typeof expected === "string") {
                return this.equalsString(expected, observed);
            }
            if (expected === undefined) {
                return this.equalsUndefined(expected, observed);
            }
        }
        catch (throwable) {
            let error = throwable instanceof Error ? errors_1.SerializedError.fromError(throwable) : json_1.JSON.parse(json_1.JSON.serialize(throwable));
            throw {
                error,
                expected,
                observed
            };
        }
    }
    throws(operation) {
        return __awaiter(this, void 0, void 0, function* () {
            let callback = operation instanceof Promise ? () => operation : operation;
            try {
                yield callback();
            }
            catch (error) {
                return;
            }
            let error = errors_1.SerializedError.fromError(new Error(`Expected operation to throw an error!`));
            throw {
                error
            };
        });
    }
}
exports.Asserter = Asserter;
;
exports.asserter = new Asserter();
