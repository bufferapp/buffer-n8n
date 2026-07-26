import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

export function buildYoutubeMetadata(ctx: IExecuteFunctions, itemIndex: number): IDataObject {
	const youtubeTitle = ctx.getNodeParameter('youtubeTitle', itemIndex) as string;
	if (!youtubeTitle) {
		throw new NodeOperationError(
			ctx.getNode(),
			'YouTube posts require a title. Please set the "YouTube Title" field.',
			{ itemIndex },
		);
	}

	const youtubeCategoryId = ctx.getNodeParameter('youtubeCategoryId', itemIndex) as string;
	const youtubePrivacy = ctx.getNodeParameter('youtubePrivacy', itemIndex) as string;
	const youtubeLicense = ctx.getNodeParameter('youtubeLicense', itemIndex) as string;
	const youtubeMadeForKids = ctx.getNodeParameter('youtubeMadeForKids', itemIndex) as boolean;
	const youtubeEmbeddable = ctx.getNodeParameter('youtubeEmbeddable', itemIndex) as boolean;
	const youtubeNotifySubscribers = ctx.getNodeParameter('youtubeNotifySubscribers', itemIndex) as boolean;

	return {
		title: youtubeTitle,
		categoryId: youtubeCategoryId,
		privacy: youtubePrivacy,
		license: youtubeLicense,
		madeForKids: youtubeMadeForKids,
		embeddable: youtubeEmbeddable,
		notifySubscribers: youtubeNotifySubscribers,
	};
}
