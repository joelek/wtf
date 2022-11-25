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
exports.Asserter = exports.WrongInstanceError = exports.ExpectedThrowError = exports.UnexpectedMemberError = exports.MissingMemberError = exports.UnexpectedElementError = exports.MissingElementError = exports.IncorrectValueError = exports.IncorrectTypeError = exports.UnsupportedTypeError = exports.getTypename = void 0;
const data_1 = require("./data");
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
class UnsupportedTypeError extends Error {
    constructor(expected, path) {
        super();
        this.expected = expected;
        this.path = path;
    }
    get message() {
        return `Expected type for expected${data_1.SerializablePath.serialize(this.path)}, ${getTypename(this.expected)}, to be supported by the asserter!`;
    }
}
exports.UnsupportedTypeError = UnsupportedTypeError;
;
class IncorrectTypeError extends Error {
    constructor(observed, expected, path) {
        super();
        this.observed = observed;
        this.expected = expected;
        this.path = path;
    }
    get message() {
        return `Expected type for observed${data_1.SerializablePath.serialize(this.path)}, ${getTypename(this.observed)}, to be ${getTypename(this.expected)}!`;
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
        return `Expected value for observed${data_1.SerializablePath.serialize(this.path)}, ${data_1.SerializableData.serialize(this.observed, true)}, to be ${data_1.SerializableData.serialize(this.expected, true)}!`;
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
        return `Expected element observed${data_1.SerializablePath.serialize(this.path)} to be present!`;
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
        return `Expected element observed${data_1.SerializablePath.serialize(this.path)} to be absent!`;
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
        return `Expected member observed${data_1.SerializablePath.serialize(this.path)} to be present!`;
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
        return `Expected member observed${data_1.SerializablePath.serialize(this.path)} to be absent!`;
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
class WrongInstanceError extends Error {
    constructor(subject, ctor) {
        super();
        this.subject = subject;
        this.ctor = ctor;
    }
    get message() {
        return `Expected value with type ${getTypename(this.subject)} to be an instance of ${this.ctor.name}!`;
    }
}
exports.WrongInstanceError = WrongInstanceError;
;
class Asserter {
    equalsBinaryData(constructor, observed, expected, path) {
        if (!(observed instanceof constructor)) {
            throw new IncorrectTypeError(observed, expected, path);
        }
        for (let i = observed.length; i < expected.length; i++) {
            throw new MissingElementError([...path, i]);
        }
        for (let i = expected.length; i < observed.length; i++) {
            throw new UnexpectedElementError([...path, i]);
        }
        for (let i = 0; i < expected.length; i++) {
            let observedElement = observed[i];
            let expectedElement = expected[i];
            if (observedElement !== expectedElement) {
                throw new IncorrectValueError(observedElement, expectedElement, [...path, i]);
            }
        }
    }
    equalsComparable(observed, expected, path) {
        if (!(data_1.Comparable.is(observed))) {
            throw new IncorrectTypeError(observed, expected, path);
        }
        if (!observed.equals(expected)) {
            throw new IncorrectValueError(observed, expected, path);
        }
    }
    equalsArray(observed, expected, path) {
        if (!data_1.SerializableDataArray.is(observed)) {
            throw new IncorrectTypeError(observed, expected, path);
        }
        for (let i = observed.length; i < expected.length; i++) {
            throw new MissingElementError([...path, i]);
        }
        for (let i = expected.length; i < observed.length; i++) {
            throw new UnexpectedElementError([...path, i]);
        }
        for (let i = 0; i < expected.length; i++) {
            this.equalsAny(observed[i], expected[i], [...path, i]);
        }
    }
    equalsBigint(observed, expected, path) {
        if (!(typeof observed === "bigint")) {
            throw new IncorrectTypeError(observed, expected, path);
        }
        if (expected !== observed) {
            throw new IncorrectValueError(observed, expected, path);
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
        if (!data_1.SerializableDataObject.is(observed)) {
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
            this.equalsAny(observed[key], expected[key], [...path, key]);
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
    equalsAny(observed, expected, path) {
        if (data_1.Comparable.is(expected)) {
            return this.equalsComparable(observed, expected, path);
        }
        if (data_1.SerializableDataArray.is(expected)) {
            return this.equalsArray(observed, expected, path);
        }
        if (typeof expected === "bigint") {
            return this.equalsBigint(observed, expected, path);
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
        if (data_1.SerializableDataObject.is(expected)) {
            return this.equalsObject(observed, expected, path);
        }
        if (typeof expected === "string") {
            return this.equalsString(observed, expected, path);
        }
        if (expected === undefined) {
            return this.equalsUndefined(observed, expected, path);
        }
        if (expected instanceof Int8Array) {
            return this.equalsBinaryData(Int8Array, observed, expected, path);
        }
        if (expected instanceof Uint8Array) {
            return this.equalsBinaryData(Uint8Array, observed, expected, path);
        }
        if (expected instanceof Uint8ClampedArray) {
            return this.equalsBinaryData(Uint8ClampedArray, observed, expected, path);
        }
        if (expected instanceof Int16Array) {
            return this.equalsBinaryData(Int16Array, observed, expected, path);
        }
        if (expected instanceof Uint16Array) {
            return this.equalsBinaryData(Uint16Array, observed, expected, path);
        }
        if (expected instanceof Int32Array) {
            return this.equalsBinaryData(Int32Array, observed, expected, path);
        }
        if (expected instanceof Uint32Array) {
            return this.equalsBinaryData(Uint32Array, observed, expected, path);
        }
        if (expected instanceof Float32Array) {
            return this.equalsBinaryData(Float32Array, observed, expected, path);
        }
        if (expected instanceof Float64Array) {
            return this.equalsBinaryData(Float64Array, observed, expected, path);
        }
        if (expected instanceof BigInt64Array) {
            return this.equalsBinaryData(BigInt64Array, observed, expected, path);
        }
        if (expected instanceof BigUint64Array) {
            return this.equalsBinaryData(BigUint64Array, observed, expected, path);
        }
        throw new UnsupportedTypeError(expected, path);
    }
    constructor() { }
    equals(observed, expected) {
        this.equalsAny(observed, expected, []);
    }
    instanceof(subject, ctor) {
        if (!(subject instanceof ctor)) {
            throw new WrongInstanceError(subject, ctor);
        }
    }
    throws(callback) {
        return __awaiter(this, void 0, void 0, function* () {
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
