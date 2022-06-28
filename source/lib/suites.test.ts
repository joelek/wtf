import * as wtf from "./";
import * as suites from "./suites";

wtf.suite("Suite", async (suite) => {
	suite.case(`It should not capture an error when a test runs successfully.`, async (assert) => {
		let testCase = new suites.TestCase("", async () => {});
		let report = await testCase.run();
		if (report.error != null) {
			throw "";
		}
	});

	suite.case(`It should capture an error when a test runs unsuccessfully.`, async (assert) => {
		let testCase = new suites.TestCase("", async () => { throw new Error(); });
		let report = await testCase.run();
		if (report.error == null) {
			throw "";
		}
	});
});
