import type { INodeProperties } from 'n8n-workflow';

// The Resource selector, kept as its own export so it can be placed first in the concatenated
// properties array (see descriptions/index.ts) — it must come before the Idea/Post-specific
// fields it controls, otherwise those fields render above it once "Idea" (the default) is
// selected, pushing the selector out of its expected position in the n8n UI.
export const resourceProperty: INodeProperties[] = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Idea',
				value: 'idea',
			},
			{
				name: 'Post',
				value: 'post',
			},
		],
		default: 'idea',
	},
];

// Post's Operation field, core post fields (channel/text/scheduling), and both schedulingType
// field variants (see the comment on the field below for why there are two).
export const postCoreProperties: INodeProperties[] = [
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
				resource: ['post'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new post',
				action: 'Create a post',
			},
		],
		default: 'create',
	},
	// ----------------------------------
	//         Post: Create
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
				resource: ['post'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Channel Name or ID',
		name: 'channelId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getChannels',
			loadOptionsDependsOn: ['organizationId'],
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Channel Service',
		name: 'channelService',
		type: 'hidden',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
			},
		},
		default: '={{ $parameter["channelId"].split("|")[1] }}',
		description: 'The service type of the selected channel (auto-populated)',
	},
	{
		displayName: 'Channel Type',
		name: 'channelType',
		type: 'hidden',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
			},
		},
		default: '={{ $parameter["channelId"].split("|")[2] }}',
		description: 'The type of the selected channel, e.g. page or group (auto-populated)',
	},
	{
		displayName: 'Text',
		name: 'postText',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The text content of the post (optional for image posts)',
	},
	{
		displayName: 'Share Mode',
		name: 'shareMode',
		type: 'options',
		options: [
			{
				name: 'Share Now',
				value: 'shareNow',
				description: 'Publish the post immediately',
			},
			{
				name: 'Add to Queue',
				value: 'addToQueue',
				description: 'Add the post to the publishing queue',
			},
			{
				name: 'Share Next',
				value: 'shareNext',
				description: 'Add the post to the front of the queue',
			},
			{
				name: 'Custom Schedule',
				value: 'customScheduled',
				description: 'Schedule the post for a specific time',
			},
		],
		required: true,
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
			},
		},
		default: 'shareNow',
		description: 'When to publish the post',
	},
	{
		displayName: 'Scheduled Time',
		name: 'dueAt',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				shareMode: ['customScheduled'],
			},
		},
		default: '',
		description: 'The date and time to publish the post. Example: 2026-03-26T10:28:47.545Z.',
	},
	{
		// Per-option displayOptions (hiding just "Automatic") are not reliably enforced by n8n's
		// UI when the comparator is a hidden, expression-derived field like channelType. Instead,
		// this field is hidden entirely for Facebook Pages/Groups and Instagram Profiles (Facebook
		// Pages only support automatic scheduling, so they fall back to this field's default) and
		// replaced with the notification-only field below for Groups/Profiles, using field-level
		// displayOptions which do work correctly.
		displayName: 'Scheduling Mode',
		name: 'schedulingType',
		type: 'options',
		options: [
			{
				name: 'Automatic',
				value: 'automatic',
				description: 'Post will be published automatically at the scheduled time',
			},
			{
				name: 'Notification',
				value: 'notification',
				description: 'You will receive a notification to manually publish the post',
			},
		],
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				channelService: ['instagram', 'tiktok', 'youtube', 'Instagram', 'TikTok', 'YouTube', 'INSTAGRAM', 'TIKTOK', 'YOUTUBE'],
			},
			hide: {
				channelType: ['profile', 'Profile', 'PROFILE'],
			},
		},
		default: 'automatic',
		description: 'How the post should be scheduled',
	},
	{
		displayName: 'Scheduling Mode',
		name: 'schedulingType',
		type: 'options',
		options: [
			{
				name: 'Notification',
				value: 'notification',
				description: 'You will receive a notification to manually publish the post',
			},
		],
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				channelService: ['facebook', 'Facebook', 'FACEBOOK', 'instagram', 'Instagram', 'INSTAGRAM'],
				channelType: ['group', 'Group', 'GROUP', 'profile', 'Profile', 'PROFILE'],
			},
		},
		default: 'notification',
		description: 'Facebook Groups and Instagram Profiles only support notification scheduling',
	},
];

// The four attachmentType field variants: YouTube-only (forces 'video'), Google Business-only
// (no video option), Pinterest-only (forces 'image'), and generic (hidden for those three
// channels). The generic variant is deliberately listed LAST: n8n resolves a duplicate-named
// field's initial default (before an org/channel has been selected, so channelService is empty
// and no displayOptions match yet) from the LAST matching property definition in the array,
// not by evaluating displayOptions. Listing the generic 'none' variant last ensures a freshly
// added node defaults to "No Attachment" instead of whichever network-specific variant happens
// to be last.
export const postAttachmentProperties: INodeProperties[] = [
	{
		displayName: 'Attachment Type',
		name: 'attachmentType',
		type: 'options',
		options: [
			{
				name: 'Video',
				value: 'video',
				description: 'Create a post with a video',
			},
		],
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				channelService: ['youtube', 'YouTube', 'YOUTUBE'],
			},
		},
		default: 'video',
		description: 'YouTube posts only support video attachments',
	},
	{
		displayName: 'Attachment Type',
		name: 'attachmentType',
		type: 'options',
		options: [
			{
				name: 'No Attachment',
				value: 'none',
				description: 'Create a text-only post',
			},
			{
				name: 'Image',
				value: 'image',
				description: 'Create a post with an image',
			},
		],
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				channelService: ['google', 'Google', 'GOOGLE', 'googlebusiness', 'GoogleBusiness', 'GOOGLEBUSINESS', 'google_business', 'Google_Business', 'GOOGLE_BUSINESS'],
			},
		},
		default: 'none',
		description: 'Google Business posts do not support video attachments',
	},
	{
		displayName: 'Attachment Type',
		name: 'attachmentType',
		type: 'options',
		options: [
			{
				name: 'Image',
				value: 'image',
				description: 'Create a post with an image',
			},
		],
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				channelService: ['pinterest', 'Pinterest', 'PINTEREST'],
			},
		},
		default: 'image',
		description: 'Pinterest posts always require an image attachment',
	},
	{
		// YouTube posts are always videos, Google Business does not support video, and
		// Pinterest posts are always images, so this field is hidden for those channels and
		// replaced with the network-specific fields above (see the Scheduling Mode fields
		// above for why this uses field-level displayOptions rather than per-option
		// displayOptions).
		displayName: 'Attachment Type',
		name: 'attachmentType',
		type: 'options',
		options: [
			{
				name: 'No Attachment',
				value: 'none',
				description: 'Create a text-only post',
			},
			{
				name: 'Image',
				value: 'image',
				description: 'Create a post with an image',
			},
			{
				name: 'Video',
				value: 'video',
				description: 'Create a post with a video',
			},
		],
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
			},
			hide: {
				channelService: [
					'youtube', 'YouTube', 'YOUTUBE',
					'google', 'Google', 'GOOGLE', 'googlebusiness', 'GoogleBusiness', 'GOOGLEBUSINESS', 'google_business', 'Google_Business', 'GOOGLE_BUSINESS',
					'pinterest', 'Pinterest', 'PINTEREST',
				],
			},
		},
		default: 'none',
		description: 'Type of attachment to add to the post',
	},
];

// Image and video asset fields (URL, alt text, thumbnail).
export const postAssetProperties: INodeProperties[] = [
	// ----------------------------------
	//         Post: Create - Images
	// ----------------------------------
	{
		displayName: 'Image URL',
		name: 'imageUrl',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				attachmentType: ['image'],
			},
		},
		default: '',
		description: 'The publicly accessible URL of the image (must be HTTP/HTTPS)',
	},
	{
		displayName: 'Alt Text',
		name: 'imageAltText',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				attachmentType: ['image'],
			},
		},
		default: '',
		description: 'Alternative text describing the image for accessibility',
	},
	{
		displayName: 'Image Thumbnail URL',
		name: 'imageThumbnailUrl',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				attachmentType: ['image'],
			},
		},
		default: '',
		description: 'Optional URL for a thumbnail version of the image',
	},
	// ----------------------------------
	//         Post: Create - Videos
	// ----------------------------------
	{
		displayName: 'Video URL',
		name: 'videoUrl',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				attachmentType: ['video'],
			},
		},
		default: '',
		description: 'The publicly accessible URL of the video (must be HTTP/HTTPS)',
	},
	{
		displayName: 'Video Thumbnail URL',
		name: 'videoThumbnailUrl',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				attachmentType: ['video'],
			},
		},
		default: '',
		description: 'Optional URL for a thumbnail version of the video',
	},
];
