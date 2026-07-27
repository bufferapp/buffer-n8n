import type { INodeProperties } from 'n8n-workflow';

export const googleBusinessProperties: INodeProperties[] = [
	{
		displayName: 'Google Business Post Type',
		name: 'googlePostType',
		type: 'options',
		options: [
			{
				name: "What's New",
				value: 'whats_new',
				description: 'A standard Google Business post',
			},
			{
				name: 'Offer',
				value: 'offer',
				description: 'A Google Business offer',
			},
			{
				name: 'Event',
				value: 'event',
				description: 'A Google Business event',
			},
		],
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				channelService: ['google', 'Google', 'GOOGLE', 'googlebusiness', 'GoogleBusiness', 'GOOGLEBUSINESS', 'google_business', 'Google_Business', 'GOOGLE_BUSINESS'],
			},
		},
		default: 'whats_new',
		description: 'The type of Google Business post to create',
	},
	// ----------------------------------
	//   Google Business: What's New fields
	// ----------------------------------
	{
		displayName: 'Action Button',
		name: 'googleWhatsNewButton',
		type: 'options',
		options: [
			{ name: 'Book', value: 'book' },
			{ name: 'Call', value: 'call' },
			{ name: 'Learn More', value: 'learn_more' },
			{ name: 'None', value: 'none' },
			{ name: 'Order', value: 'order' },
			{ name: 'Shop', value: 'shop' },
			{ name: 'Sign Up', value: 'signup' },
		],
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				channelService: ['google', 'Google', 'GOOGLE', 'googlebusiness', 'GoogleBusiness', 'GOOGLEBUSINESS', 'google_business', 'Google_Business', 'GOOGLE_BUSINESS'],
				googlePostType: ['whats_new'],
			},
		},
		default: 'none',
		description: 'The call-to-action button for the post',
	},
	{
		displayName: 'Action Button Link',
		name: 'googleWhatsNewLink',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				channelService: ['google', 'Google', 'GOOGLE', 'googlebusiness', 'GoogleBusiness', 'GOOGLEBUSINESS', 'google_business', 'Google_Business', 'GOOGLE_BUSINESS'],
				googlePostType: ['whats_new'],
			},
		},
		default: '',
		description: 'URL for the action button',
	},
	// ----------------------------------
	//   Google Business: Offer fields
	// ----------------------------------
	{
		displayName: 'Offer Title',
		name: 'googleOfferTitle',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				channelService: ['google', 'Google', 'GOOGLE', 'googlebusiness', 'GoogleBusiness', 'GOOGLEBUSINESS', 'google_business', 'Google_Business', 'GOOGLE_BUSINESS'],
				googlePostType: ['offer'],
			},
		},
		default: '',
		description: 'Title of the offer',
	},
	{
		displayName: 'Offer Start Date',
		name: 'googleOfferStartDate',
		type: 'dateTime',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				channelService: ['google', 'Google', 'GOOGLE', 'googlebusiness', 'GoogleBusiness', 'GOOGLEBUSINESS', 'google_business', 'Google_Business', 'GOOGLE_BUSINESS'],
				googlePostType: ['offer'],
			},
		},
		default: '',
		description: 'Start date of the offer. Only the date is used; Google Business offers do not support a specific time.',
	},
	{
		displayName: 'Offer End Date',
		name: 'googleOfferEndDate',
		type: 'dateTime',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				channelService: ['google', 'Google', 'GOOGLE', 'googlebusiness', 'GoogleBusiness', 'GOOGLEBUSINESS', 'google_business', 'Google_Business', 'GOOGLE_BUSINESS'],
				googlePostType: ['offer'],
			},
		},
		default: '',
		description: 'End date of the offer. Only the date is used; Google Business offers do not support a specific time.',
	},
	{
		displayName: 'Coupon Code',
		name: 'googleOfferCode',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				channelService: ['google', 'Google', 'GOOGLE', 'googlebusiness', 'GoogleBusiness', 'GOOGLEBUSINESS', 'google_business', 'Google_Business', 'GOOGLE_BUSINESS'],
				googlePostType: ['offer'],
			},
		},
		default: '',
		description: 'Coupon code for the offer',
	},
	{
		displayName: 'Offer Link',
		name: 'googleOfferLink',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				channelService: ['google', 'Google', 'GOOGLE', 'googlebusiness', 'GoogleBusiness', 'GOOGLEBUSINESS', 'google_business', 'Google_Business', 'GOOGLE_BUSINESS'],
				googlePostType: ['offer'],
			},
		},
		default: '',
		description: 'Link to the offer',
	},
	{
		displayName: 'Terms & Conditions',
		name: 'googleOfferTerms',
		type: 'string',
		typeOptions: {
			rows: 3,
		},
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				channelService: ['google', 'Google', 'GOOGLE', 'googlebusiness', 'GoogleBusiness', 'GOOGLEBUSINESS', 'google_business', 'Google_Business', 'GOOGLE_BUSINESS'],
				googlePostType: ['offer'],
			},
		},
		default: '',
		description: 'Terms and conditions of the offer',
	},
	// ----------------------------------
	//   Google Business: Event fields
	// ----------------------------------
	{
		displayName: 'Event Title',
		name: 'googleEventTitle',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				channelService: ['google', 'Google', 'GOOGLE', 'googlebusiness', 'GoogleBusiness', 'GOOGLEBUSINESS', 'google_business', 'Google_Business', 'GOOGLE_BUSINESS'],
				googlePostType: ['event'],
			},
		},
		default: '',
		description: 'Title of the event',
	},
	{
		displayName: 'Event Start Date',
		name: 'googleEventStartDate',
		type: 'dateTime',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				channelService: ['google', 'Google', 'GOOGLE', 'googlebusiness', 'GoogleBusiness', 'GOOGLEBUSINESS', 'google_business', 'Google_Business', 'GOOGLE_BUSINESS'],
				googlePostType: ['event'],
			},
		},
		default: '',
		description: 'Start date of the event. Only the date is used here; enable "Specify Event Time" below to add a start time.',
	},
	{
		displayName: 'Event End Date',
		name: 'googleEventEndDate',
		type: 'dateTime',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				channelService: ['google', 'Google', 'GOOGLE', 'googlebusiness', 'GoogleBusiness', 'GOOGLEBUSINESS', 'google_business', 'Google_Business', 'GOOGLE_BUSINESS'],
				googlePostType: ['event'],
			},
		},
		default: '',
		description: 'End date of the event. Only the date is used here; enable "Specify Event Time" below to add an end time.',
	},
	{
		displayName: 'Specify Event Time',
		name: 'googleEventHasTime',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				channelService: ['google', 'Google', 'GOOGLE', 'googlebusiness', 'GoogleBusiness', 'GOOGLEBUSINESS', 'google_business', 'Google_Business', 'GOOGLE_BUSINESS'],
				googlePostType: ['event'],
			},
		},
		default: false,
		description: 'Whether to set a specific start/end time for the event. If disabled, the event is posted as an all-day event.',
	},
	{
		displayName: 'Event Start Time',
		name: 'googleEventStartTime',
		type: 'string',
		placeholder: 'e.g. 14:30',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				channelService: ['google', 'Google', 'GOOGLE', 'googlebusiness', 'GoogleBusiness', 'GOOGLEBUSINESS', 'google_business', 'Google_Business', 'GOOGLE_BUSINESS'],
				googlePostType: ['event'],
				googleEventHasTime: [true],
			},
		},
		default: '',
		description: 'Start time of the event, in 24-hour HH:mm format',
	},
	{
		displayName: 'Event End Time',
		name: 'googleEventEndTime',
		type: 'string',
		placeholder: 'e.g. 18:00',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				channelService: ['google', 'Google', 'GOOGLE', 'googlebusiness', 'GoogleBusiness', 'GOOGLEBUSINESS', 'google_business', 'Google_Business', 'GOOGLE_BUSINESS'],
				googlePostType: ['event'],
				googleEventHasTime: [true],
			},
		},
		default: '',
		description: 'End time of the event, in 24-hour HH:mm format',
	},
	{
		displayName: 'Action Button',
		name: 'googleEventButton',
		type: 'options',
		options: [
			{ name: 'Book', value: 'book' },
			{ name: 'Call', value: 'call' },
			{ name: 'Learn More', value: 'learn_more' },
			{ name: 'None', value: 'none' },
			{ name: 'Order', value: 'order' },
			{ name: 'Shop', value: 'shop' },
			{ name: 'Sign Up', value: 'signup' },
		],
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				channelService: ['google', 'Google', 'GOOGLE', 'googlebusiness', 'GoogleBusiness', 'GOOGLEBUSINESS', 'google_business', 'Google_Business', 'GOOGLE_BUSINESS'],
				googlePostType: ['event'],
			},
		},
		default: 'none',
		description: 'The call-to-action button for the event',
	},
	{
		displayName: 'Action Button Link',
		name: 'googleEventLink',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
				channelService: ['google', 'Google', 'GOOGLE', 'googlebusiness', 'GoogleBusiness', 'GOOGLEBUSINESS', 'google_business', 'Google_Business', 'GOOGLE_BUSINESS'],
				googlePostType: ['event'],
			},
		},
		default: '',
		description: 'URL for the action button',
	},
];
