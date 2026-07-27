import { Buffer } from '../Buffer.node';
import type { IDataObject, INodeExecutionData } from 'n8n-workflow';

/**
 * Test helper: creates a mock n8n execution context and runs the Buffer node's
 * execute method for a single post-create item. Returns the GraphQL variables
 * that were sent to the API so tests can assert on the `input` shape.
 */
export async function executePostCreate(params: Record<string, unknown>) {
	const node = new Buffer();
	let capturedBody: { query: string; variables: { input: IDataObject } } | undefined;

	const defaults: Record<string, unknown> = {
		resource: 'post',
		operation: 'create',
		channelId: 'chan123|twitter',
		postText: '',
		shareMode: 'shareNow',
		attachmentType: 'none',
		schedulingType: 'automatic',
		...params,
	};

	const mockContext = {
		getInputData: () => [{ json: {} }],
		getNodeParameter: (name: string) => {
			if (!(name in defaults)) {
				return '';
			}
			return defaults[name];
		},
		getCredentials: async () => ({
			apiKey: 'test-key',
			apiUrl: 'https://api.buffer.com/graphql',
		}),
		getNode: () => ({ name: 'Buffer', type: 'buffer', typeVersion: 1, position: [0, 0] }),
		helpers: {
			httpRequestWithAuthentication: {
				call: async (_thisArg: unknown, _credType: string, opts: { body: typeof capturedBody }) => {
					capturedBody = opts.body;
					return {
						data: {
							createPost: {
								post: { id: 'post-1', status: 'scheduled' },
							},
						},
					};
				},
			},
		},
		continueOnFail: () => false,
	};

	await node.execute.call(mockContext as never);

	if (!capturedBody) throw new Error('No API call was made');
	return capturedBody.variables.input;
}

export interface CapturedRequest {
	query: string;
	variables: { input: IDataObject };
}

export interface RunExecuteOptions {
	/**
	 * Mock GraphQL responses to return, one per sequential API call across all
	 * items. If there are more calls than responses, the last response is reused
	 * for any remaining calls.
	 */
	responses?: unknown[];
	/** Overrides the mock context's continueOnFail() return value. Defaults to false. */
	continueOnFail?: boolean;
}

/**
 * Lower-level test helper: like executePostCreate, but supports multiple input
 * items (each with its own parameter overrides), custom/injectable mock GraphQL
 * responses (including error shapes), and an overridable continueOnFail(). Use
 * this when testing error-handling, continueOnFail behavior, or multi-item
 * batches; use executePostCreate for simple single-item success-path assertions.
 */
export async function runExecute(
	itemsParams: Record<string, unknown>[],
	options: RunExecuteOptions = {},
): Promise<{ capturedRequests: CapturedRequest[]; returnData: INodeExecutionData[] }> {
	const node = new Buffer();
	const capturedRequests: CapturedRequest[] = [];
	const responses = options.responses ?? [
		{ data: { createPost: { post: { id: 'post-1', status: 'scheduled' } } } },
	];

	const itemsDefaults: Record<string, unknown>[] = itemsParams.map((params) => ({
		resource: 'post',
		operation: 'create',
		channelId: 'chan123|twitter',
		postText: '',
		shareMode: 'shareNow',
		attachmentType: 'none',
		schedulingType: 'automatic',
		...params,
	}));

	const mockContext = {
		getInputData: () => itemsDefaults.map(() => ({ json: {} })),
		getNodeParameter: (name: string, itemIndex: number) => {
			const defaults = itemsDefaults[itemIndex];
			if (!defaults || !(name in defaults)) {
				return '';
			}
			return defaults[name];
		},
		getCredentials: async () => ({
			apiKey: 'test-key',
			apiUrl: 'https://api.buffer.com/graphql',
		}),
		getNode: () => ({ name: 'Buffer', type: 'buffer', typeVersion: 1, position: [0, 0] }),
		helpers: {
			httpRequestWithAuthentication: {
				call: async (_thisArg: unknown, _credType: string, opts: { body: CapturedRequest }) => {
					capturedRequests.push(opts.body);
					const responseIndex = Math.min(capturedRequests.length - 1, responses.length - 1);
					return responses[responseIndex];
				},
			},
		},
		continueOnFail: () => options.continueOnFail ?? false,
	};

	const returnData = (await node.execute.call(mockContext as never)) as unknown as INodeExecutionData[][];

	return { capturedRequests, returnData: returnData[0] };
}
