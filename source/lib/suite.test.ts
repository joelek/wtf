import * as subject from "./suite";
import { createTestSuite } from "./suite";

createTestSuite("Suite", async (suite) => {
	suite.defineTestCase(`It should return true when a test runs successfully.`, async () => {
		let testCase = new subject.TestCase("", async () => {});
		let observed = await testCase.run();
		if (observed !== true) {
			throw "";
		}
	});

	suite.defineTestCase(`It should return false when a test runs unsuccessfully.`, async () => {
		let testCase = new subject.TestCase("", async () => { throw ""; });
		let observed = await testCase.run();
		if (observed !== false) {
			throw "";
		}
	});
});
