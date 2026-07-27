import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';
import { executeGraphQL } from '../../transport/graphql';
import { validateUrl } from '../../helpers/urlValidation';
import { resolveSchedulingType } from './scheduling';
import { validateInstagram, buildInstagramMetadata } from './networks/instagram';
import { buildFacebookMetadata } from './networks/facebook';
import { buildYoutubeMetadata } from './networks/youtube';
import { validateGoogleBusiness, buildGoogleBusinessMetadata } from './networks/google-business';
import { validatePinterest, buildPinterestMetadata } from './networks/pinterest';
import { validateTikTok } from './networks/tiktok';
import { validateMastodon } from './networks/mastodon';
import { validateStartPage } from './networks/startpage';

export async function createPost(
	ctx: IExecuteFunctions,
	apiUrl: string,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const i = itemIndex;
	const channelIdComposite = ctx.getNodeParameter('channelId', i) as string;
	// Check if channel is disconnected (format: "id|service|type|disconnected")
	if (channelIdComposite.endsWith('|disconnected')) {
		throw new NodeOperationError(
			ctx.getNode(),
			'The selected channel is disconnected. Please reconnect it in Buffer before posting.',
			{ itemIndex: i },
		);
	}
	// Extract channel ID from composite value (format: "id|service|type")
	const channelId = channelIdComposite.split('|')[0];
	const postText = ctx.getNodeParameter('postText', i) as string;
	const shareMode = ctx.getNodeParameter('shareMode', i) as string;
	let attachmentType = ctx.getNodeParameter('attachmentType', i) as string;
	const requestedSchedulingType = ctx.getNodeParameter('schedulingType', i) as string;

	// Add channel-specific post type metadata
	const channelService = channelIdComposite.split('|')[1];
	const channelType = channelIdComposite.split('|')[2];
	const isFacebookGroup = channelService?.toLowerCase() === 'facebook' && channelType?.toLowerCase() === 'group';
	const isInstagramProfile = channelService?.toLowerCase() === 'instagram' && channelType?.toLowerCase() === 'profile';

	const schedulingType = resolveSchedulingType(requestedSchedulingType, channelService, isFacebookGroup, isInstagramProfile);

	// YouTube posts only support video attachments; force it regardless of the field's value
	if (channelService?.toLowerCase() === 'youtube') {
		attachmentType = 'video';
	}

	// Instagram and TikTok posts require an image or video attachment
	if (channelService?.toLowerCase() === 'instagram') {
		validateInstagram(ctx, i, attachmentType);
	}
	if (channelService?.toLowerCase() === 'tiktok') {
		validateTikTok(ctx, i, attachmentType);
	}

	// Google Business posts do not support video attachments
	if (channelService && ['google', 'googlebusiness', 'google_business'].includes(channelService.toLowerCase())) {
		validateGoogleBusiness(ctx, i, attachmentType);
	}

	// Start Page posts require text and do not support video attachments
	if (channelService?.toLowerCase() === 'startpage') {
		validateStartPage(ctx, i, attachmentType, postText);
	}

	// Mastodon posts require at least text, an image, or a video
	if (channelService?.toLowerCase() === 'mastodon') {
		validateMastodon(ctx, i, attachmentType, postText);
	}

	// Pinterest posts require a Board, an image/video attachment, and text
	if (channelService?.toLowerCase() === 'pinterest') {
		validatePinterest(ctx, i, attachmentType, postText);
	}

	// Build the input
	const input: IDataObject = {
		channelId,
		mode: shareMode,
		schedulingType,
		assets: [],
	};

	if (channelService && channelService.toLowerCase() === 'instagram') {
		input.metadata = { instagram: buildInstagramMetadata(ctx, i, isInstagramProfile) };
	} else if (channelService && channelService.toLowerCase() === 'facebook') {
		input.metadata = { facebook: buildFacebookMetadata(ctx, i, isFacebookGroup) };
	} else if (channelService && channelService.toLowerCase() === 'youtube' && schedulingType !== 'notification') {
		// YouTube-specific fields (title, category, privacy, license, etc.) only apply when the
		// video will actually be published; they're hidden from the UI and unused when the
		// scheduling mode is "Notification" (manual publish).
		input.metadata = { youtube: buildYoutubeMetadata(ctx, i) };
	} else if (channelService && ['google', 'googlebusiness', 'google_business'].includes(channelService.toLowerCase())) {
		input.metadata = { google: buildGoogleBusinessMetadata(ctx, i) };
	} else if (channelService?.toLowerCase() === 'pinterest') {
		input.metadata = { pinterest: buildPinterestMetadata(ctx, i) };
	}

	// Add text if provided
	if (postText) {
		input.text = postText;
	}

	// Handle image attachments
	if (attachmentType === 'image') {
		const imageUrl = ctx.getNodeParameter('imageUrl', i) as string;
		validateUrl(ctx, imageUrl, i, { required: true, requiredLabel: 'Image URL', formatLabel: 'image' });

		const imageInput: IDataObject = { url: imageUrl };

		// Validate and add optional thumbnail URL
		const imageThumbnailUrl = ctx.getNodeParameter('imageThumbnailUrl', i) as string;
		if (imageThumbnailUrl && imageThumbnailUrl.trim() !== '') {
			validateUrl(ctx, imageThumbnailUrl, i, { required: false, formatLabel: 'thumbnail' });
			imageInput.thumbnailUrl = imageThumbnailUrl;
		}

		// Handle metadata (altText)
		const imageAltText = ctx.getNodeParameter('imageAltText', i) as string;
		if (imageAltText && imageAltText.trim() !== '') {
			imageInput.metadata = {
				altText: imageAltText,
			};
		}

		input.assets = [{ image: imageInput }];
	} else if (attachmentType === 'video') {
		const videoUrl = ctx.getNodeParameter('videoUrl', i) as string;
		validateUrl(ctx, videoUrl, i, { required: true, requiredLabel: 'Video URL', formatLabel: 'video' });

		const videoInput: IDataObject = { url: videoUrl };

		// Validate and add optional thumbnail URL
		const videoThumbnailUrl = ctx.getNodeParameter('videoThumbnailUrl', i) as string;
		if (videoThumbnailUrl && videoThumbnailUrl.trim() !== '') {
			validateUrl(ctx, videoThumbnailUrl, i, { required: false, formatLabel: 'thumbnail' });
			videoInput.thumbnailUrl = videoThumbnailUrl;
		}

		input.assets = [{ video: videoInput }];
	}

	// Add dueAt if custom scheduled
	if (shareMode === 'customScheduled') {
		const dueAt = ctx.getNodeParameter('dueAt', i) as string;
		// Ensure ISO 8601 format with timezone
		input.dueAt = new Date(dueAt).toISOString();
	}

	// GraphQL mutation
	const mutation = `
		mutation CreatePost($input: CreatePostInput!) {
			createPost(input: $input) {
				... on PostActionSuccess {
					post {
						id
						status
						text
						dueAt
						sentAt
						createdAt
						updatedAt
						channelId
						channelService
						shareMode
						isCustomScheduled
						externalLink
						assets {
							id
							type
							mimeType
							source
							thumbnail
						}
					}
				}
				... on InvalidInputError {
					message
				}
				... on UnauthorizedError {
					message
				}
				... on UnexpectedError {
					message
				}
				... on NotFoundError {
					message
				}
				... on LimitReachedError {
					message
				}
				... on RestProxyError {
					message
					code
					link
				}
			}
		}
	`;

	const response = await executeGraphQL(ctx, apiUrl, mutation, { input });

	// Check for GraphQL errors
	if (response.errors && response.errors.length > 0) {
		throw new NodeApiError(ctx.getNode(), response.errors[0], { itemIndex: i });
	}

	const result = response.data?.createPost;

	// Check for mutation-level errors
	if (result?.message) {
		throw new NodeApiError(ctx.getNode(), result, { itemIndex: i });
	}

	// Return the post
	const post = result?.post;

	return {
		json: post,
		pairedItem: { item: i },
	};
}
