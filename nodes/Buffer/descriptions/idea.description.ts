import type { INodeProperties } from 'n8n-workflow';

export const ideaProperties: INodeProperties[] = [
	// ----------------------------------
	//         Operations
	// ----------------------------------
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['idea'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new idea',
				action: 'Create an idea',
			},
		],
		default: 'create',
	},
	// ----------------------------------
	//         Idea: Create
	// ----------------------------------
	{
		displayName: 'Organization Name or ID',
		name: 'organizationId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getOrganizations',
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['idea'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Text',
		name: 'text',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		displayOptions: {
			show: {
				resource: ['idea'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The main body text or description of the idea',
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['idea'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Title or headline of the idea (optional)',
	},
];
