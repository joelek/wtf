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
    constructor(observed, expected, path) {
        super();
        this.observed = observed;
        this.expected = expected;
        this.path = path;
    }
    get message() {
        return `Expected type for observed${json_1.JSONPath.serialize(this.path)} (${getTypename(this.observed)}) to be ${getTypename(this.expected)}!`;
    }
}
exports.IncorrectTypeError = IncorrectTypeError;
;
class IncorrectValueError extends Error {
    constructor(observed, expected, path) {
        super();
        this.observed = observed;
        this.expected = expected;
        this.path = path;
    }
    get message() {
        return `Expected value for observed${json_1.JSONPath.serialize(this.path)} (${json_1.JSONData.serialize(this.observed)}) to be ${json_1.JSONData.serialize(this.expected)}!`;
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
        return `Expected element observed${json_1.JSONPath.serialize(this.path)} to be present!`;
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
        return `Expected element observed${json_1.JSONPath.serialize(this.path)} to be absent!`;
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
        return `Expected member observed${json_1.JSONPath.serialize(this.path)} to be present!`;
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
        return `Expected member observed${json_1.JSONPath.serialize(this.path)} to be absent!`;
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
    equalsArray(observed, expected, path) {
        if (!json_1.JSONArray.is(observed)) {
            throw new IncorrectTypeError(observed, expected, path);
        }
        for (let i = observed.length; i < expected.length; i++) {
            throw new MissingElementError([...path, i]);
        }
        for (let i = expected.length; i < observed.length; i++) {
            throw new UnexpectedElementError([...path, i]);
        }
        for (let i = 0; i < expected.length; i++) {
            this.equalsJSON(observed[i], expected[i], [...path, i]);
        }
    }
    equalsBoolean(observed, expected, path) {
        if (!(typeof observed === "boolean")) {
            throw new IncorrectTypeError(observed, expected, path);
        }
        if (expected !== observed) {
            throw new IncorrectValueError(observed, expected, path);
        }
    }
    equalsNull(observed, expected, path) {
        if (!(observed === null)) {
            throw new IncorrectTypeError(observed, expected, path);
        }
    }
    equalsNumber(observed, expected, path) {
        if (!(typeof observed === "number")) {
            throw new IncorrectTypeError(observed, expected, path);
        }
        if (expected !== observed) {
            throw new IncorrectValueError(observed, expected, path);
        }
    }
    equalsObject(observed, expected, path) {
        if (!json_1.JSONObject.is(observed)) {
            throw new IncorrectTypeError(observed, expected, path);
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
            this.equalsJSON(observed[key], expected[key], [...path, key]);
        }
    }
    equalsString(observed, expected, path) {
        if (!(typeof observed === "string")) {
            throw new IncorrectTypeError(observed, expected, path);
        }
        if (expected !== observed) {
            throw new IncorrectValueError(observed, expected, path);
        }
    }
    equalsUndefined(observed, expected, path) {
        if (!(observed === undefined)) {
            throw new IncorrectTypeError(observed, expected, path);
        }
    }
    equalsJSON(observed, expected, path) {
        if (json_1.JSONArray.is(expected)) {
            return this.equalsArray(observed, expected, path);
        }
        if (typeof expected === "boolean") {
            return this.equalsBoolean(observed, expected, path);
        }
        if (expected === null) {
            return this.equalsNull(observed, expected, path);
        }
        if (typeof expected === "number") {
            return this.equalsNumber(observed, expected, path);
        }
        if (json_1.JSONObject.is(expected)) {
            return this.equalsObject(observed, expected, path);
        }
        if (typeof expected === "string") {
            return this.equalsString(observed, expected, path);
        }
        if (expected === undefined) {
            return this.equalsUndefined(observed, expected, path);
        }
    }
    constructor() { }
    equals(observed, expected) {
        this.equalsJSON(observed, expected, []);
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
