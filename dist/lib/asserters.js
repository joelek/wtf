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
exports.Asserter = exports.ExpectedThrowError = exports.UnexpectedMemberError = exports.MissingMemberError = exports.UnexpectedElementError = exports.MissingElementError = exports.IncorrectValueError = exports.IncorrectTypeError = exports.getTypename = void 0;
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
class IncorrectTypeError extends Error {
    constructor(expected, observed, path) {
        super();
        this.expected = expected;
        this.observed = observed;
        this.path = path;
    }
    get message() {
        return `Expected type ${getTypename(this.observed)} to be ${getTypename(this.expected)} for ${json_1.JSONPath.serialize(this.path)}!`;
    }
}
exports.IncorrectTypeError = IncorrectTypeError;
;
class IncorrectValueError extends Error {
    constructor(expected, observed, path) {
        super();
        this.expected = expected;
        this.observed = observed;
        this.path = path;
    }
    get message() {
        return `Expected value ${json_1.JSON.serialize(this.observed)} to be ${json_1.JSON.serialize(this.expected)} for ${json_1.JSONPath.serialize(this.path)}!`;
    }
}
exports.IncorrectValueError = IncorrectValueError;
;
class MissingElementError extends Error {
    constructor(path) {
        super();
        this.path = path;
    }
    get message() {
        return `Expected element to be present for ${json_1.JSONPath.serialize(this.path)}!`;
    }
}
exports.MissingElementError = MissingElementError;
;
class UnexpectedElementError extends Error {
    constructor(path) {
        super();
        this.path = path;
    }
    get message() {
        return `Expected element to be absent for ${json_1.JSONPath.serialize(this.path)}!`;
    }
}
exports.UnexpectedElementError = UnexpectedElementError;
;
class MissingMemberError extends Error {
    constructor(path) {
        super();
        this.path = path;
    }
    get message() {
        return `Expected member to be present for ${json_1.JSONPath.serialize(this.path)}!`;
    }
}
exports.MissingMemberError = MissingMemberError;
;
class UnexpectedMemberError extends Error {
    constructor(path) {
        super();
        this.path = path;
    }
    get message() {
        return `Expected member to be absent for ${json_1.JSONPath.serialize(this.path)}!`;
    }
}
exports.UnexpectedMemberError = UnexpectedMemberError;
;
class ExpectedThrowError extends Error {
    get message() {
        return `Expected operation to throw an error!`;
    }
    constructor() {
        super();
    }
}
exports.ExpectedThrowError = ExpectedThrowError;
;
class Asserter {
    equalsArray(expected, observed, path) {
        if (!(observed instanceof Array)) {
            throw new IncorrectTypeError(expected, observed, path);
        }
        for (let i = observed.length; i < expected.length; i++) {
            throw new MissingElementError([...path, i]);
        }
        for (let i = expected.length; i < observed.length; i++) {
            throw new UnexpectedElementError([...path, i]);
        }
        for (let i = 0; i < expected.length; i++) {
            this.equalsJSON(expected[i], observed[i], [...path, i]);
        }
    }
    equalsBoolean(expected, observed, path) {
        if (!(typeof observed === "boolean")) {
            throw new IncorrectTypeError(expected, observed, path);
        }
        if (expected !== observed) {
            throw new IncorrectValueError(expected, observed, path);
        }
    }
    equalsNull(expected, observed, path) {
        if (!(observed === null)) {
            throw new IncorrectTypeError(expected, observed, path);
        }
    }
    equalsNumber(expected, observed, path) {
        if (!(typeof observed === "number")) {
            throw new IncorrectTypeError(expected, observed, path);
        }
        if (expected !== observed) {
            throw new IncorrectValueError(expected, observed, path);
        }
    }
    equalsObject(expected, observed, path) {
        if (!(observed instanceof Object && !(observed instanceof Array))) {
            throw new IncorrectTypeError(expected, observed, path);
        }
        for (let key in expected) {
            if (!(key in observed)) {
                throw new MissingMemberError([...path, key]);
            }
        }
        for (let key in observed) {
            if (!(key in expected)) {
                throw new UnexpectedMemberError([...path, key]);
            }
        }
        for (let key in expected) {
            this.equalsJSON(expected[key], observed[key], [...path, key]);
        }
    }
    equalsString(expected, observed, path) {
        if (!(typeof observed === "string")) {
            throw new IncorrectTypeError(expected, observed, path);
        }
        if (expected !== observed) {
            throw new IncorrectValueError(expected, observed, path);
        }
    }
    equalsUndefined(expected, observed, path) {
        if (!(observed === undefined)) {
            throw new IncorrectTypeError(expected, observed, path);
        }
    }
    equalsJSON(expected, observed, path) {
        if (expected instanceof Array) {
            return this.equalsArray(expected, observed, path);
        }
        if (typeof expected === "boolean") {
            return this.equalsBoolean(expected, observed, path);
        }
        if (expected === null) {
            return this.equalsNull(expected, observed, path);
        }
        if (typeof expected === "number") {
            return this.equalsNumber(expected, observed, path);
        }
        if (expected instanceof Object && !(expected instanceof Array)) {
            return this.equalsObject(expected, observed, path);
        }
        if (typeof expected === "string") {
            return this.equalsString(expected, observed, path);
        }
        if (expected === undefined) {
            return this.equalsUndefined(expected, observed, path);
        }
    }
    constructor() { }
    equals(expected, observed) {
        this.equalsJSON(expected, observed, []);
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
            throw new ExpectedThrowError();
        });
    }
}
exports.Asserter = Asserter;
;
