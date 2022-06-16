"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stderr = exports.stdout = exports.StderrLogger = exports.StdoutLogger = exports.WriteStreamLogger = void 0;
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
exports.stdout = new StdoutLogger();
exports.stderr = new StderrLogger();
