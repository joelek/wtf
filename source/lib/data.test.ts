import * as wtf from "./";
import * as data from "./data";

wtf.suite("Uint8Array", async (suite) => {
	const UNWRAPPED = Uint8Array.of(1, 2);
	const WRAPPED = {
		type: "Uint8Array",
		data: [1, 2]
	};

	suite.case(`It should wrap Uint8Array.`, async (assert) => {
		assert.equals(data.SerializableDataWrapper.wrap(UNWRAPPED), WRAPPED);
	});

	suite.case(`It should unwrap Uint8Array.`, async (assert) => {
		assert.equals(data.SerializableDataWrapper.unwrap(WRAPPED), UNWRAPPED);
	});
});

wtf.suite("Uint16Array", async (suite) => {
	const UNWRAPPED = Uint16Array.of(1, 2);
	const WRAPPED = {
		type: "Uint16Array",
		data: [1, 2]
	};

	suite.case(`It should wrap Uint16Array.`, async (assert) => {
		assert.equals(data.SerializableDataWrapper.wrap(UNWRAPPED), WRAPPED);
	});

	suite.case(`It should unwrap Uint16Array.`, async (assert) => {
		assert.equals(data.SerializableDataWrapper.unwrap(WRAPPED), UNWRAPPED);
	});
});
