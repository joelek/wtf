export interface Logger {
	log(string: string): void;
};

export class WriteStreamLogger implements Logger {
	private stream: NodeJS.WriteStream;

	constructor(stream: NodeJS.WriteStream) {
		this.stream = stream;
	}

	log(chunk: string | Uint8Array): void {
		this.stream.write(chunk);
	}
};

export class StdoutLogger extends WriteStreamLogger {
	constructor() {
		super(process.stdout);
	}
};

export class StderrLogger extends WriteStreamLogger {
	constructor() {
		super(process.stderr);
	}
};

export const stdout = new StdoutLogger();
export const stderr = new StderrLogger();
