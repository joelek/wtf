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

wtf.test(`Equals should throw an error for two instances of NeverEqual.`, async (assert) => {
	await assert.throws(() => {
		assert.equals(new NeverEqual(), new NeverEqual());
	});
});

wtf.test(`Equals should not throw an error for two instances of AlwaysEqual.`, async (assert) => {
	assert.equals(new AlwaysEqual(), new AlwaysEqual());
});

wtf.test(`Throws should assert that an operation throws an error.`, async (assert) => {
	await assert.throws(() => {
		assert.equals(1, 2);
	});
});

wtf.test(`Instanceof should not throw an error when comparing Buffer and Uint8Array.`, async (assert) => {
	assert.instanceof(Buffer.of(), Uint8Array);
});

wtf.test(`Instanceof should throw an error when comparing Buffer and ArrayBuffer.`, async (assert) => {
	await assert.throws(() => {
		assert.instanceof(Buffer.of(), ArrayBuffer);
	});
});
