export type SerializedError = {
	type: string;
	message: string;
	stack?: string;
};

export const SerializedError = {
	fromError(error: Error): SerializedError {
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
