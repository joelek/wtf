"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONPath = exports.JSONData = exports.JSONObject = exports.JSONArray = void 0;
exports.JSONArray = {
    is(subject) {
        return subject != null && subject.constructor === Array;
    }
};
exports.JSONObject = {
    is(subject) {
        return subject != null && subject.constructor === Object;
    }
};
exports.JSONData = {
    parse(string) {
        return globalThis.JSON.parse(string);
    },
    serialize(json) {
        return globalThis.JSON.stringify(json != null ? json : null, null, "\t");
    }
};
exports.JSONPath = {
    serialize(path) {
        let strings = [];
        for (let part of path) {
            if (typeof part === "string") {
                if (/^[a-z_][a-z_0-9]*$/i.test(part)) {
                    strings.push(`.${part}`);
                }
                else {
                    strings.push(`.${exports.JSONData.serialize(part)}`);
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
