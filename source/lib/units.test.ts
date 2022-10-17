import * as wtf from "./";
import * as units from "./units";

wtf.group("TestCase", async (group) => {
	group.case(`It should not capture an error when a test runs successfully.`, async (assert) => {
		let testCase = new units.TestCase("", async () => {});
		let report = await testCase.run();
		assert.equals(report.error, undefined);
	});

	group.case(`It should capture an error when a test runs unsuccessfully.`, async (assert) => {
		let testCase = new units.TestCase("", async () => { throw new Error(); });
		let report = await testCase.run();
		assert.equals(report.error, "");
	});
});
