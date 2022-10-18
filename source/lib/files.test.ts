import * as wtf from ".";
import * as files from "./files";

wtf.test(`It should not capture an error when a test runs successfully.`, async (assert) => {
	let testCase = new files.TestCase("", async () => {});
	let report = await testCase.run();
	assert.equals(report.error, undefined);
});

wtf.test(`It should capture an error when a test runs unsuccessfully.`, async (assert) => {
	let testCase = new files.TestCase("", async () => { throw new Error(); });
	let report = await testCase.run();
	assert.equals(report.error, "");
});
