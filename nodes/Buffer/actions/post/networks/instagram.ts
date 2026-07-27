import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

// Instagram posts require an image or video attachment
export function validateInstagram(ctx: IExecuteFunctions, itemIndex: number, attachmentType: string): void {
	if (attachmentType === 'none') {
		throw new NodeOperationError(
			ctx.getNode(),
			'Instagram posts require an image or video attachment. Please set the "Attachment Type" field.',
			{ itemIndex },
		);
	}
}

export function buildInstagramMetadata(
	ctx: IExecuteFunctions,
	itemIndex: number,
	isInstagramProfile: boolean,
): IDataObject {
	if (isInstagramProfile) {
		// Instagram Profiles only support the "post" type, no first comment or link.
		// shouldShareToFeed has no real effect for a personal profile, but the API schema
		// requires the field to be present (non-nullable), so default it to true.
		return { type: 'post', shouldShareToFeed: true };
	}

	const instagramPostType = ctx.getNodeParameter('instagramPostType', itemIndex) as string;
	const shouldShareToFeed = ctx.getNodeParameter('instagramShareToFeed', itemIndex) as boolean;
	const instagramFirstComment = ctx.getNodeParameter('instagramFirstComment', itemIndex) as string;
	const instagramLink = ctx.getNodeParameter('instagramLink', itemIndex) as string;

	const meta: IDataObject = {
		type: instagramPostType,
		shouldShareToFeed,
	};
	if (instagramFirstComment) meta.firstComment = instagramFirstComment;
	if (instagramLink) meta.link = instagramLink;
	return meta;
}
