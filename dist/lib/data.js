"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerializablePath = exports.SerializableData = exports.SerializableDataObject = exports.SerializableDataArray = void 0;
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
exports.SerializableData = {
    parse(string) {
        return globalThis.JSON.parse(string, (key, value) => {
            if (exports.SerializableDataObject.is(value)) {
                let type = value.type;
                let data = value.data;
                if (typeof type === "string" && typeof data === "string") {
                    if (type === "bigint" && /^[0-9]+n$/.test(data)) {
                        return BigInt(data);
                    }
                }
            }
            return value;
        });
    },
    serialize(json, wrap = true) {
        return globalThis.JSON.stringify(json != null ? json : null, (key, value) => {
            if (typeof value === "bigint") {
                return !wrap ? `${value}n` : {
                    type: "bigint",
                    data: `${value}n`
                };
            }
            return value;
        }, "\t");
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
