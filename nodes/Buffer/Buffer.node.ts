import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeConnectionTypes } from 'n8n-workflow';
import { getApiUrl } from './transport/graphql';
import { properties } from './descriptions';
import { loadOptions } from './methods/loadOptions';
import { createIdea } from './actions/idea/create';
import { createPost } from './actions/post/create';

export class Buffer implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Buffer',
		name: 'buffer',
		icon: {
			light: 'file:../../icons/logo.svg',
			dark: 'file:../../icons/logo.dark.svg',
		} as const,
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Buffer to manage ideas and posts',
		defaults: {
			name: 'Buffer',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'bufferApi',
				required: true,
			},
		],
		properties,
	};

	methods = {
		loadOptions,
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const apiUrl = await getApiUrl(this);

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'idea') {
					if (operation === 'create') {
						returnData.push(await createIdea(this, apiUrl, i));
					}
				} else if (resource === 'post') {
					if (operation === 'create') {
						returnData.push(await createPost(this, apiUrl, i));
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw new NodeApiError(this.getNode(), error as JsonObject);
			}
		}

		return [returnData];
	}
}
