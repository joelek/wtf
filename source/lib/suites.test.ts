import * as suites from "./suites";
import { createTestSuite } from "./suites";

createTestSuite("Suite", async (suite) => {
	suite.defineTestCase(`It should return true when a test runs successfully.`, async () => {
		let testCase = new suites.TestCase("", async () => {});
		let observed = await testCase.run();
		if (observed !== true) {
			throw "";
		}
	});

	suite.defineTestCase(`It should return false when a test runs unsuccessfully.`, async () => {
		let testCase = new suites.TestCase("", async () => { throw ""; });
		let observed = await testCase.run();
		if (observed !== false) {
			throw "";
		}
	});
});
