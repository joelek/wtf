"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerializablePath = exports.SerializableData = exports.SerializableDataWrapper = exports.SerializableDataObject = exports.SerializableDataArray = void 0;
exports.SerializableDataArray = {
    is(subject) {
        return subject != null && subject.constructor === Array;
    }
};
exports.SerializableDataObject = {
    is(subject) {
        return subject != null && subject.constructor === Object;
    }
};
exports.SerializableDataWrapper = {
    wrap(value) {
        if (typeof value === "bigint") {
            return {
                type: "BigInt",
                data: value.toString()
            };
        }
        if (value instanceof Int8Array) {
            return {
                type: "Int8Array",
                data: Array.from(value)
            };
        }
        if (value instanceof Uint8Array) {
            return {
                type: "Uint8Array",
                data: Array.from(value)
            };
        }
        if (value instanceof Uint8ClampedArray) {
            return {
                type: "Uint8ClampedArray",
                data: Array.from(value)
            };
        }
        if (value instanceof Int16Array) {
            return {
                type: "Int16Array",
                data: Array.from(value)
            };
        }
        if (value instanceof Uint16Array) {
            return {
                type: "Uint16Array",
                data: Array.from(value)
            };
        }
        if (value instanceof Int32Array) {
            return {
                type: "Int32Array",
                data: Array.from(value)
            };
        }
        if (value instanceof Uint32Array) {
            return {
                type: "Uint32Array",
                data: Array.from(value)
            };
        }
        if (value instanceof Float32Array) {
            return {
                type: "Float32Array",
                data: Array.from(value)
            };
        }
        if (value instanceof Float64Array) {
            return {
                type: "Float64Array",
                data: Array.from(value)
            };
        }
        if (value instanceof BigInt64Array) {
            return {
                type: "BigInt64Array",
                data: Array.from(value)
            };
        }
        if (value instanceof BigUint64Array) {
            return {
                type: "BigUint64Array",
                data: Array.from(value)
            };
        }
        return value;
    },
    unwrap(value) {
        if (exports.SerializableDataObject.is(value)) {
            let type = value.type;
            let data = value.data;
            if (typeof type === "string") {
                if (type === "BigInt") {
                    return BigInt(data);
                }
                if (type === "Int8Array") {
                    return Int8Array.from(data);
                }
                if (type === "Uint8Array") {
                    return Uint8Array.from(data);
                }
                if (type === "Uint8ClampedArray") {
                    return Uint8ClampedArray.from(data);
                }
                if (type === "Int16Array") {
                    return Int16Array.from(data);
                }
                if (type === "Uint16Array") {
                    return Uint16Array.from(data);
                }
                if (type === "Int32Array") {
                    return Int32Array.from(data);
                }
                if (type === "Uint32Array") {
                    return Uint32Array.from(data);
                }
                if (type === "Float32Array") {
                    return Float32Array.from(data);
                }
                if (type === "Float64Array") {
                    return Float64Array.from(data);
                }
                if (type === "BigInt64Array") {
                    return BigInt64Array.from(data);
                }
                if (type === "BigUint64Array") {
                    return BigUint64Array.from(data);
                }
            }
        }
        return value;
    }
};
exports.SerializableData = {
    parse(string) {
        return globalThis.JSON.parse(string, (key, value) => exports.SerializableDataWrapper.unwrap(value));
    },
    serialize(json, compact = false) {
        return globalThis.JSON.stringify(json != null ? json : null, (key, value) => exports.SerializableDataWrapper.wrap(value), "\t");
    }
};
exports.SerializablePath = {
    serialize(path) {
        let strings = [];
        for (let part of path) {
            if (typeof part === "string") {
                if (/^[a-z_][a-z_0-9]*$/i.test(part)) {
                    strings.push(`.${part}`);
                }
                else {
                    strings.push(`.${exports.SerializableData.serialize(part)}`);
                }
                continue;
            }
            if (typeof part === "number") {
                strings.push(`[${part}]`);
                continue;
            }
        }
        return strings.join("");
    }
};
