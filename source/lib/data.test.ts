import * as data from "./data";
import { createTestSuite } from "./suites";

createTestSuite("Uint8Array", async (suite) => {
	const UNWRAPPED = Uint8Array.of(1, 2);
	const WRAPPED = {
		type: "Uint8Array",
		data: [1, 2]
	};

	suite.defineTestCase(`It should wrap Uint8Array.`, async (assert) => {
		assert.equals(data.SerializableDataWrapper.wrap(UNWRAPPED), WRAPPED);
	});

	suite.defineTestCase(`It should unwrap Uint8Array.`, async (assert) => {
		assert.equals(data.SerializableDataWrapper.unwrap(WRAPPED), UNWRAPPED);
	});
});

createTestSuite("Uint16Array", async (suite) => {
	const UNWRAPPED = Uint16Array.of(1, 2);
	const WRAPPED = {
		type: "Uint16Array",
		data: [1, 2]
	};

	suite.defineTestCase(`It should wrap Uint16Array.`, async (assert) => {
		assert.equals(data.SerializableDataWrapper.wrap(UNWRAPPED), WRAPPED);
	});

	suite.defineTestCase(`It should unwrap Uint16Array.`, async (assert) => {
		assert.equals(data.SerializableDataWrapper.unwrap(WRAPPED), UNWRAPPED);
	});
});
