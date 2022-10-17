import * as wtf from "./";
import * as data from "./data";

wtf.group("Uint8Array", async (group) => {
	const UNWRAPPED = Uint8Array.of(1, 2);
	const WRAPPED = {
		type: "Uint8Array",
		data: [1, 2]
	};

	group.case(`It should wrap Uint8Array.`, async (assert) => {
		assert.equals(data.SerializableDataWrapper.wrap(UNWRAPPED), WRAPPED);
	});

	group.case(`It should unwrap Uint8Array.`, async (assert) => {
		assert.equals(data.SerializableDataWrapper.unwrap(WRAPPED), UNWRAPPED);
	});
});

wtf.group("Uint16Array", async (group) => {
	const UNWRAPPED = Uint16Array.of(1, 2);
	const WRAPPED = {
		type: "Uint16Array",
		data: [1, 2]
	};

	group.case(`It should wrap Uint16Array.`, async (assert) => {
		assert.equals(data.SerializableDataWrapper.wrap(UNWRAPPED), WRAPPED);
	});

	group.case(`It should unwrap Uint16Array.`, async (assert) => {
		assert.equals(data.SerializableDataWrapper.unwrap(WRAPPED), UNWRAPPED);
	});
});
