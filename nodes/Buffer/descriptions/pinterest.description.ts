import type { INodeProperties } from 'n8n-workflow';

export const pinterestProperties: INodeProperties[] = [
	{
		displayName: 'Pinterest Board Name or ID',
		name: 'pinterestBoardId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getPinterestBoards',
			loadOptionsDependsOn: ['channelId'],
		},
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				channelService: ['pinterest', 'Pinterest', 'PINTEREST'],
			},
		},
		default: '',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Pinterest Title',
		name: 'pinterestTitle',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				channelService: ['pinterest', 'Pinterest', 'PINTEREST'],
			},
		},
		default: '',
		description: 'The title of the Pin',
	},
	{
		displayName: 'Pinterest Destination URL',
		name: 'pinterestUrl',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				channelService: ['pinterest', 'Pinterest', 'PINTEREST'],
			},
		},
		default: '',
		description: 'The destination URL for the Pin',
	},
];
