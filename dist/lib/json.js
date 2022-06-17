"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSON = void 0;
exports.JSON = {
    parse(string) {
        return globalThis.JSON.parse(string);
    },
    serialize(json) {
        return globalThis.JSON.stringify(json != null ? json : null, null, "\t");
    }
};
