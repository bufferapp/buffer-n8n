import { runExecute } from './test-helpers';

describe('continueOnFail behavior', () => {
	it('rethrows the error when continueOnFail is false (default)', async () => {
		await expect(
			runExecute([{ channelId: 'chan123|twitter|profile|disconnected' }]),
		).rejects.toThrow('The selected channel is disconnected');
	});

	it('captures the error as a json item when continueOnFail is true', async () => {
		const { returnData } = await runExecute(
			[{ channelId: 'chan123|twitter|profile|disconnected' }],
			{ continueOnFail: true },
		);

		expect(returnData).toHaveLength(1);
		expect(returnData[0].json.error).toContain('The selected channel is disconnected');
		expect(returnData[0].pairedItem).toEqual({ item: 0 });
	});

	it('continues processing subsequent items after a caught failure', async () => {
		const { returnData } = await runExecute(
			[
				{ channelId: 'chan123|twitter|profile|disconnected' },
				{ channelId: 'chan456|twitter' },
			],
			{ continueOnFail: true },
		);

		expect(returnData).toHaveLength(2);
		expect(returnData[0].json.error).toContain('The selected channel is disconnected');
		expect(returnData[0].pairedItem).toEqual({ item: 0 });
		expect(returnData[1].json.error).toBeUndefined();
		expect(returnData[1].pairedItem).toEqual({ item: 1 });
	});
});
