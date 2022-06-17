export type SerializedError = {
	type: string;
	message: string;
	stack?: string;
};

export const SerializedError = {
	fromError(error: Error): SerializedError {
		let { name: type, message, stack } = { ...error };
		return {
			type,
			message,
			stack
		};
	}
};
