import * as wtf from "./";
import * as data from "./data";

{
	const UNWRAPPED = Uint8Array.of(1, 2);
	const WRAPPED = {
		type: "Uint8Array",
		data: [1, 2]
	};

	wtf.test(`SerializableDataWrapper should wrap Uint8Array.`, async (assert) => {
		assert.equals(data.SerializableDataWrapper.wrap(UNWRAPPED), WRAPPED);
	});

	wtf.test(`SerializableDataWrapper should unwrap Uint8Array.`, async (assert) => {
		assert.equals(data.SerializableDataWrapper.unwrap(WRAPPED), UNWRAPPED);
	});
};

{
	const UNWRAPPED = Uint16Array.of(1, 2);
	const WRAPPED = {
		type: "Uint16Array",
		data: [1, 2]
	};

	wtf.test(`SerializableDataWrapper should wrap Uint16Array.`, async (assert) => {
		assert.equals(data.SerializableDataWrapper.wrap(UNWRAPPED), WRAPPED);
	});

	wtf.test(`SerializableDataWrapper should unwrap Uint16Array.`, async (assert) => {
		assert.equals(data.SerializableDataWrapper.unwrap(WRAPPED), UNWRAPPED);
	});
};
