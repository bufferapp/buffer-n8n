import { getOrganizations, getChannels, getPinterestBoards } from '../methods/loadOptions';

function mockContext(params: Record<string, unknown>, response: unknown) {
	return {
		getNodeParameter: (name: string) => params[name] ?? '',
		getCredentials: async () => ({
			apiKey: 'test-key',
			apiUrl: 'https://api.buffer.com/graphql',
		}),
		helpers: {
			httpRequestWithAuthentication: {
				call: async () => response,
			},
		},
	};
}

describe('getOrganizations', () => {
	it('maps organizations to name/value options', async () => {
		const ctx = mockContext(
			{},
			{
				data: {
					account: {
						organizations: [
							{ id: 'org-1', name: 'Org One' },
							{ id: 'org-2', name: 'Org Two' },
						],
					},
				},
			},
		);

		const result = await getOrganizations.call(ctx as never);

		expect(result).toEqual([
			{ name: 'Org One', value: 'org-1' },
			{ name: 'Org Two', value: 'org-2' },
		]);
	});

	it('returns an empty array when no organizations are present', async () => {
		const ctx = mockContext({}, { data: { account: { organizations: [] } } });
		const result = await getOrganizations.call(ctx as never);
		expect(result).toEqual([]);
	});
});

describe('getChannels', () => {
	it('returns an empty array when no organizationId is provided', async () => {
		const ctx = mockContext({ organizationId: '' }, {});
		const result = await getChannels.call(ctx as never);
		expect(result).toEqual([]);
	});

	it('maps connected channels to composite id|service|type values', async () => {
		const ctx = mockContext(
			{ organizationId: 'org-1' },
			{
				data: {
					channels: [
						{ id: 'chan-1', name: 'My Twitter', service: 'twitter', type: 'profile', isDisconnected: false },
					],
				},
			},
		);

		const result = await getChannels.call(ctx as never);

		expect(result).toHaveLength(1);
		expect(result[0].name).toBe('My Twitter (twitter - profile)');
		expect(result[0].value).toBe('chan-1|twitter|profile');
	});

	it('marks disconnected channels in both name and value', async () => {
		const ctx = mockContext(
			{ organizationId: 'org-1' },
			{
				data: {
					channels: [
						{ id: 'chan-2', name: 'Old Facebook', service: 'facebook', type: 'page', isDisconnected: true },
					],
				},
			},
		);

		const result = await getChannels.call(ctx as never);

		expect(result).toHaveLength(1);
		expect(result[0].name).toBe('Old Facebook (facebook - page) (Disconnected)');
		expect(result[0].value).toBe('chan-2|facebook|page|disconnected');
	});
});

describe('getPinterestBoards', () => {
	it('returns an empty array when no channelId is provided', async () => {
		const ctx = mockContext({ channelId: '' }, {});
		const result = await getPinterestBoards.call(ctx as never);
		expect(result).toEqual([]);
	});

	it('maps Pinterest boards to name/value options', async () => {
		const ctx = mockContext(
			{ channelId: 'chan-1|pinterest|profile' },
			{
				data: {
					channel: {
						metadata: {
							boards: [{ serviceId: 'board-1', name: 'My Board' }],
						},
					},
				},
			},
		);

		const result = await getPinterestBoards.call(ctx as never);

		expect(result).toEqual([{ name: 'My Board', value: 'board-1' }]);
	});
});
