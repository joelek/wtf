import * as wtf from "./";

wtf.suite("", async (suite) => {
	suite.case(`It should assert that an operation throws an error.`, async (assert) => {
		await assert.throws(() => {
			assert.equals(1, 2);
		});
	});
});
