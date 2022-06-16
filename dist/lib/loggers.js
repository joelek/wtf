"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StderrLogger = exports.StdoutLogger = exports.WriteStreamLogger = void 0;
;
class WriteStreamLogger {
    constructor(stream) {
        this.stream = stream;
    }
    log(chunk) {
        this.stream.write(chunk);
    }
}
exports.WriteStreamLogger = WriteStreamLogger;
;
class StdoutLogger extends WriteStreamLogger {
    constructor() {
        super(process.stdout);
    }
}
exports.StdoutLogger = StdoutLogger;
;
class StderrLogger extends WriteStreamLogger {
    constructor() {
        super(process.stderr);
    }
}
exports.StderrLogger = StderrLogger;
;
