import { runExecute } from './test-helpers';

describe('Multi-item batches', () => {
	it('isolates per-item parameters across the batch', async () => {
		const { capturedRequests } = await runExecute([
			{ postText: 'first post', channelId: 'chan1|twitter' },
			{ postText: 'second post', channelId: 'chan2|linkedin' },
			{ postText: 'third post', channelId: 'chan3|threads' },
		]);

		expect(capturedRequests).toHaveLength(3);
		expect(capturedRequests[0].variables.input.text).toBe('first post');
		expect(capturedRequests[0].variables.input.channelId).toBe('chan1');
		expect(capturedRequests[1].variables.input.text).toBe('second post');
		expect(capturedRequests[1].variables.input.channelId).toBe('chan2');
		expect(capturedRequests[2].variables.input.text).toBe('third post');
		expect(capturedRequests[2].variables.input.channelId).toBe('chan3');
	});

	it('assigns the correct pairedItem index to each successful result', async () => {
		const { returnData } = await runExecute([
			{ postText: 'first post' },
			{ postText: 'second post' },
			{ postText: 'third post' },
		]);

		expect(returnData).toHaveLength(3);
		returnData.forEach((item, index) => {
			expect(item.pairedItem).toEqual({ item: index });
		});
	});

	it('returns distinct responses per item when different mock responses are provided', async () => {
		const { returnData } = await runExecute(
			[{ postText: 'first post' }, { postText: 'second post' }],
			{
				responses: [
					{ data: { createPost: { post: { id: 'post-1', status: 'scheduled' } } } },
					{ data: { createPost: { post: { id: 'post-2', status: 'sent' } } } },
				],
			},
		);

		expect(returnData[0].json).toEqual({ id: 'post-1', status: 'scheduled' });
		expect(returnData[1].json).toEqual({ id: 'post-2', status: 'sent' });
	});

	it('handles a mix of successes and continued failures across a larger batch', async () => {
		const { returnData } = await runExecute(
			[
				{ postText: 'ok post 1' },
				{ channelId: 'chan-bad|twitter|profile|disconnected' },
				{ postText: 'ok post 2' },
				{ channelId: 'chan-bad-2|twitter|profile|disconnected' },
			],
			{ continueOnFail: true },
		);

		expect(returnData).toHaveLength(4);
		expect(returnData[0].json.error).toBeUndefined();
		expect(returnData[0].pairedItem).toEqual({ item: 0 });
		expect(returnData[1].json.error).toContain('The selected channel is disconnected');
		expect(returnData[1].pairedItem).toEqual({ item: 1 });
		expect(returnData[2].json.error).toBeUndefined();
		expect(returnData[2].pairedItem).toEqual({ item: 2 });
		expect(returnData[3].json.error).toContain('The selected channel is disconnected');
		expect(returnData[3].pairedItem).toEqual({ item: 3 });
	});
});
