"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerializedError = void 0;
exports.SerializedError = {
    fromError(error) {
        let type = error.name;
        let message = error.message;
        let stack = error.stack;
        return {
            type,
            message,
            stack
        };
    }
};
