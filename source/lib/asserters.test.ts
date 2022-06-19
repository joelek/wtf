import { createTestSuite } from "./suites";

createTestSuite("", async (suite) => {
	suite.defineTestCase(`It should assert that an operation throws an error.`, async (assert) => {
		await assert.throws(() => {
			assert.equals(1, 2);
		});
	});
});
