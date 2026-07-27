import { getApiUrl, executeGraphQL } from '../transport/graphql';

describe('getApiUrl', () => {
	it('falls back to the default Buffer API URL when credentials do not specify one', async () => {
		const ctx = { getCredentials: async () => ({ apiKey: 'test-key' }) };
		const result = await getApiUrl(ctx as never);
		expect(result).toBe('https://api.buffer.com/graphql');
	});

	it('uses the apiUrl from credentials when provided', async () => {
		const ctx = {
			getCredentials: async () => ({ apiKey: 'test-key', apiUrl: 'https://custom.example.com/graphql' }),
		};
		const result = await getApiUrl(ctx as never);
		expect(result).toBe('https://custom.example.com/graphql');
	});
});

describe('executeGraphQL', () => {
	it('POSTs the query with variables as authenticated JSON', async () => {
		let capturedOpts: Record<string, unknown> | undefined;
		let capturedCredType: string | undefined;
		const ctx = {
			helpers: {
				httpRequestWithAuthentication: {
					call: async (_thisArg: unknown, credType: string, opts: Record<string, unknown>) => {
						capturedCredType = credType;
						capturedOpts = opts;
						return { data: {} };
					},
				},
			},
		};

		await executeGraphQL(ctx as never, 'https://api.buffer.com/graphql', 'query { account { id } }', {
			input: { foo: 'bar' },
		});

		expect(capturedCredType).toBe('bufferApi');
		expect(capturedOpts).toEqual({
			method: 'POST',
			url: 'https://api.buffer.com/graphql',
			headers: { 'Content-Type': 'application/json' },
			body: { query: 'query { account { id } }', variables: { input: { foo: 'bar' } } },
			json: true,
		});
	});

	it('omits variables from the body when none are provided', async () => {
		let capturedOpts: Record<string, unknown> | undefined;
		const ctx = {
			helpers: {
				httpRequestWithAuthentication: {
					call: async (_thisArg: unknown, _credType: string, opts: Record<string, unknown>) => {
						capturedOpts = opts;
						return { data: {} };
					},
				},
			},
		};

		await executeGraphQL(ctx as never, 'https://api.buffer.com/graphql', 'query { account { id } }');

		expect(capturedOpts?.body).toEqual({ query: 'query { account { id } }' });
	});
});
