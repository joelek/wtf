import * as wtf from "./";

class AlwaysEqual {
	equals(): boolean {
		return true;
	}
};

class NeverEqual {
	equals(): boolean {
		return false;
	}
};

wtf.group("equals", async (group) => {
	group.case(`It should throw an error for two instances of NeverEqual.`, async (assert) => {
		await assert.throws(() => {
			assert.equals(new NeverEqual(), new NeverEqual());
		});
	});

	group.case(`It should not throw an error for two instances of AlwaysEqual.`, async (assert) => {
		assert.equals(new AlwaysEqual(), new AlwaysEqual());
	});
});

wtf.group("throws", async (group) => {
	group.case(`It should assert that an operation throws an error.`, async (assert) => {
		await assert.throws(() => {
			assert.equals(1, 2);
		});
	});
});
