import type { INodeProperties } from 'n8n-workflow';

export const youtubeProperties: INodeProperties[] = [
	{
		displayName: 'YouTube Title',
		name: 'youtubeTitle',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				channelService: ['youtube', 'YouTube', 'YOUTUBE'],
			},
			hide: {
				schedulingType: ['notification'],
			},
		},
		default: '',
		description: 'The title of the YouTube video',
	},
	{
		displayName: 'YouTube Category',
		name: 'youtubeCategoryId',
		type: 'options',
		options: [
			{ name: 'Film & Animation', value: '1' },
			{ name: 'Autos & Vehicles', value: '2' },
			{ name: 'Music', value: '10' },
			{ name: 'Pets & Animals', value: '15' },
			{ name: 'Sports', value: '17' },
			{ name: 'Travel & Events', value: '19' },
			{ name: 'Gaming', value: '20' },
			{ name: 'People & Blogs', value: '22' },
			{ name: 'Comedy', value: '23' },
			{ name: 'Entertainment', value: '24' },
			{ name: 'News & Politics', value: '25' },
			{ name: 'Howto & Style', value: '26' },
			{ name: 'Education', value: '27' },
			{ name: 'Science & Technology', value: '28' },
			{ name: 'Nonprofits & Activism', value: '29' },
		],
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				channelService: ['youtube', 'YouTube', 'YOUTUBE'],
			},
			hide: {
				schedulingType: ['notification'],
			},
		},
		default: '22',
		description: 'The YouTube category ID for the video',
	},
	{
		displayName: 'Privacy Status',
		name: 'youtubePrivacy',
		type: 'options',
		options: [
			{ name: 'Public', value: 'public' },
			{ name: 'Private', value: 'private' },
			{ name: 'Unlisted', value: 'unlisted' },
		],
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				channelService: ['youtube', 'YouTube', 'YOUTUBE'],
			},
			hide: {
				schedulingType: ['notification'],
			},
		},
		default: 'public',
		description: 'The privacy status of the YouTube video',
	},
	{
		displayName: 'License',
		name: 'youtubeLicense',
		type: 'options',
		options: [
			{ name: 'Standard YouTube License', value: 'youtube' },
			{ name: 'Creative Commons - Attribution', value: 'creativeCommon' },
		],
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				channelService: ['youtube', 'YouTube', 'YOUTUBE'],
			},
			hide: {
				schedulingType: ['notification'],
			},
		},
		default: 'youtube',
		description: 'The license under which the video is shared',
	},
	{
		displayName: 'Made for Kids',
		name: 'youtubeMadeForKids',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				channelService: ['youtube', 'YouTube', 'YOUTUBE'],
			},
			hide: {
				schedulingType: ['notification'],
			},
		},
		default: false,
		description: 'Whether the video is made for kids',
	},
	{
		displayName: 'Allow Embedding',
		name: 'youtubeEmbeddable',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				channelService: ['youtube', 'YouTube', 'YOUTUBE'],
			},
			hide: {
				schedulingType: ['notification'],
			},
		},
		default: true,
		description: 'Whether the video can be embedded on other websites',
	},
	{
		displayName: 'Notify Subscribers',
		name: 'youtubeNotifySubscribers',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				channelService: ['youtube', 'YouTube', 'YOUTUBE'],
			},
			hide: {
				schedulingType: ['notification'],
			},
		},
		default: true,
		description: 'Whether to notify subscribers that the video has been published',
	},
];
