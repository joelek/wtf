import * as wtf from "./";
import * as units from "./units";

wtf.suite("TestCase", async (suite) => {
	suite.case(`It should not capture an error when a test runs successfully.`, async (assert) => {
		let testCase = new units.TestCase("", async () => {});
		let report = await testCase.run();
		assert.equals(report.error, undefined);
	});

	suite.case(`It should capture an error when a test runs unsuccessfully.`, async (assert) => {
		let testCase = new units.TestCase("", async () => { throw new Error(); });
		let report = await testCase.run();
		assert.equals(report.error, "");
	});
});
