import type { INodeProperties } from 'n8n-workflow';

export const facebookProperties: INodeProperties[] = [
	{
		displayName: 'Facebook Post Type',
		name: 'facebookPostType',
		type: 'options',
		options: [
			{
				name: 'Post',
				value: 'post',
				description: 'A standard Facebook feed post',
			},
			{
				name: 'Story',
				value: 'story',
				description: 'A Facebook story',
			},
			{
				name: 'Reel',
				value: 'reel',
				description: 'A Facebook reel',
			},
		],
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				channelService: ['facebook', 'Facebook', 'FACEBOOK'],
			},
			hide: {
				channelType: ['group', 'Group', 'GROUP'],
			},
		},
		default: 'post',
		description: 'The type of Facebook post to create. Not applicable to Facebook Groups.',
	},
	{
		displayName: 'First Comment',
		name: 'facebookFirstComment',
		type: 'string',
		typeOptions: {
			rows: 2,
		},
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				channelService: ['facebook', 'Facebook', 'FACEBOOK'],
			},
			hide: {
				channelType: ['group', 'Group', 'GROUP'],
			},
		},
		default: '',
		description: 'Text for the first comment on the Facebook post. Not applicable to Facebook Groups.',
	},
	{
		displayName: 'Link Attachment URL',
		name: 'facebookLinkAttachment',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				channelService: ['facebook', 'Facebook', 'FACEBOOK'],
			},
			hide: {
				channelType: ['group', 'Group', 'GROUP'],
			},
		},
		default: '',
		description: 'URL for a link preview attachment. Mutually exclusive with video assets. Not applicable to Facebook Groups.',
	},
];
