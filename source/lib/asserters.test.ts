import { createTestSuite } from "./suites";

createTestSuite("", async (suite) => {
	suite.defineTestCase(`It should ...`, async (assert) => {
		await assert.throws(() => {
			assert.equals(1, 2);
		});
	});
});
