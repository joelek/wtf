"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerializedError = void 0;
exports.SerializedError = {
    fromError(error) {
        let { name: type, message, stack } = Object.assign({}, error);
        return {
            type,
            message,
            stack
        };
    }
};
