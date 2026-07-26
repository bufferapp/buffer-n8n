import type { INodeProperties } from 'n8n-workflow';

export const instagramProperties: INodeProperties[] = [
	{
		displayName: 'Instagram Post Type',
		name: 'instagramPostType',
		type: 'options',
		options: [
			{
				name: 'Post',
				value: 'post',
				description: 'A standard Instagram feed post',
			},
			{
				name: 'Story',
				value: 'story',
				description: 'An Instagram story',
			},
			{
				name: 'Reel',
				value: 'reel',
				description: 'An Instagram reel',
			},
		],
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				channelService: ['instagram', 'Instagram', 'INSTAGRAM'],
			},
			hide: {
				channelType: ['profile', 'Profile', 'PROFILE'],
			},
		},
		default: 'post',
		description: 'The type of Instagram post to create. Not applicable to Instagram Profiles.',
	},
	{
		displayName: 'First Comment',
		name: 'instagramFirstComment',
		type: 'string',
		typeOptions: {
			rows: 2,
		},
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				channelService: ['instagram', 'Instagram', 'INSTAGRAM'],
			},
			hide: {
				channelType: ['profile', 'Profile', 'PROFILE'],
			},
		},
		default: '',
		description: 'Text for the first comment on the Instagram post. Not applicable to Instagram Profiles.',
	},
	{
		displayName: 'Shop Grid Link',
		name: 'instagramLink',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				channelService: ['instagram', 'Instagram', 'INSTAGRAM'],
			},
			hide: {
				channelType: ['profile', 'Profile', 'PROFILE'],
			},
		},
		default: '',
		description: 'Shop Grid link for the post. Not applicable to Instagram Profiles.',
	},
	{
		displayName: 'Share to Feed',
		name: 'instagramShareToFeed',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				channelService: ['instagram', 'Instagram', 'INSTAGRAM'],
			},
			hide: {
				channelType: ['profile', 'Profile', 'PROFILE'],
			},
		},
		default: true,
		description: 'Whether the post should also appear on your Instagram feed (relevant for reels and stories). Not applicable to Instagram Profiles.',
	},
];
