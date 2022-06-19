import * as suites from "./suites";
import { createTestSuite } from "./suites";

createTestSuite("Suite", async (suite) => {
	suite.defineTestCase(`It should not capture an error when a test runs successfully.`, async (assert) => {
		let testCase = new suites.TestCase("", async () => {});
		let report = await testCase.run();
		if (report.error != null) {
			throw "";
		}
	});

	suite.defineTestCase(`It should capture an error when a test runs unsuccessfully.`, async (assert) => {
		let testCase = new suites.TestCase("", async () => { throw new Error(); });
		let report = await testCase.run();
		if (report.error == null) {
			throw "";
		}
	});
});
