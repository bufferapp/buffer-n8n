import type { IExecuteFunctions, ILoadOptionsFunctions, IHttpRequestMethods } from 'n8n-workflow';

// Resolves the Buffer GraphQL endpoint from the node's credentials, falling back to the
// production API when no override is configured.
export async function getApiUrl(ctx: IExecuteFunctions | ILoadOptionsFunctions): Promise<string> {
	const credentials = await ctx.getCredentials('bufferApi');
	return (credentials.apiUrl as string) || 'https://api.buffer.com/graphql';
}

// Thin wrapper around the authenticated HTTP request used to POST every GraphQL query/mutation
// to Buffer's API, shared by loadOptions methods and the Idea/Post create actions.
export async function executeGraphQL(
	ctx: IExecuteFunctions | ILoadOptionsFunctions,
	apiUrl: string,
	query: string,
	variables?: Record<string, unknown>,
) {
	return ctx.helpers.httpRequestWithAuthentication.call(ctx, 'bufferApi', {
		method: 'POST' as IHttpRequestMethods,
		url: apiUrl,
		headers: {
			'Content-Type': 'application/json',
		},
		body: variables !== undefined ? { query, variables } : { query },
		json: true,
	});
}
