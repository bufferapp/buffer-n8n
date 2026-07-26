import { BufferApi } from '../../../credentials/BufferApi.credentials';

describe('BufferApi credentials', () => {
	const credential = new BufferApi();

	it('is named bufferApi', () => {
		expect(credential.name).toBe('bufferApi');
	});

	it('defines a required apiKey property and an apiUrl property with a default', () => {
		const apiKey = credential.properties.find((p) => p.name === 'apiKey');
		const apiUrl = credential.properties.find((p) => p.name === 'apiUrl');

		expect(apiKey?.required).toBe(true);
		expect(apiKey?.typeOptions).toEqual({ password: true });
		expect(apiUrl?.default).toBe('https://api.buffer.com/graphql');
	});

	it('authenticates using a Bearer token header', () => {
		expect(credential.authenticate).toEqual({
			type: 'generic',
			properties: {
				headers: {
					Authorization: '=Bearer {{$credentials.apiKey}}',
				},
			},
		});
	});

	it('tests the credential against the account query', () => {
		expect(credential.test.request).toEqual({
			baseURL: '={{$credentials.apiUrl}}',
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ query: '{ account { id } }' }),
		});
	});
});
