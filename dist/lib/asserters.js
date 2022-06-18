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
exports.asserter = exports.Asserter = void 0;
/*
export function getTypename(subject: any): string {
    if (subject === null) {
        return "null";
    }
    if (typeof subject?.constructor?.name === "string") {
        return subject.constructor.name;
    }
    return typeof subject;
};
 */
class Asserter {
    equalsArray(expected, observed) {
        if (!(observed instanceof Array)) {
            return false;
        }
        for (let i = observed.length; i < expected.length; i++) {
            return false;
        }
        for (let i = expected.length; i < observed.length; i++) {
            return false;
        }
        for (let i = 0; i < expected.length; i++) {
            if (!this.equals(expected[i], observed[i])) {
                return false;
            }
        }
        return true;
    }
    equalsBoolean(expected, observed) {
        if (!(typeof observed === "boolean")) {
            return false;
        }
        if (expected !== observed) {
            return false;
        }
        return true;
    }
    equalsNull(expected, observed) {
        if (!(observed === null)) {
            return false;
        }
        if (expected !== observed) {
            return false;
        }
        return true;
    }
    equalsNumber(expected, observed) {
        if (!(typeof observed === "number")) {
            return false;
        }
        if (expected !== observed) {
            return false;
        }
        return true;
    }
    equalsObject(expected, observed) {
        if (!(observed instanceof Object && !(observed instanceof Array))) {
            return false;
        }
        for (let key in expected) {
            if (!(key in observed)) {
                return false;
            }
        }
        for (let key in observed) {
            if (!(key in expected)) {
                return false;
            }
        }
        for (let key in expected) {
            if (!this.equals(expected[key], observed[key])) {
                return false;
            }
        }
        return true;
    }
    equalsString(expected, observed) {
        if (!(typeof observed === "string")) {
            return false;
        }
        if (expected !== observed) {
            return false;
        }
        return true;
    }
    equalsUndefined(expected, observed) {
        if (!(observed === undefined)) {
            return false;
        }
        if (expected !== observed) {
            return false;
        }
        return true;
    }
    equals(expected, observed) {
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
        if (expected instanceof Object) {
            return this.equalsObject(expected, observed);
        }
        if (typeof expected === "string") {
            return this.equalsString(expected, observed);
        }
        if (expected === undefined) {
            return this.equalsUndefined(expected, observed);
        }
        return false;
    }
    constructor() { }
    json(expected, observed) {
        if (!this.equals(expected, observed)) {
            throw {
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
            throw new Error(`Expected operation to throw an error!`);
        });
    }
}
exports.Asserter = Asserter;
;
exports.asserter = new Asserter();
