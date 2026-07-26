import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

// Pinterest posts require an image/video attachment and text (the Board requirement is
// enforced separately in buildPinterestMetadata, since it needs the loaded board value).
export function validatePinterest(
	ctx: IExecuteFunctions,
	itemIndex: number,
	attachmentType: string,
	postText: string,
): void {
	if (attachmentType === 'none') {
		throw new NodeOperationError(
			ctx.getNode(),
			'Pinterest posts require an image or video attachment.',
			{ itemIndex },
		);
	}
	if (!postText || postText.trim() === '') {
		throw new NodeOperationError(
			ctx.getNode(),
			'Pinterest posts require text content.',
			{ itemIndex },
		);
	}
}

export function buildPinterestMetadata(ctx: IExecuteFunctions, itemIndex: number): IDataObject {
	const pinterestBoardId = ctx.getNodeParameter('pinterestBoardId', itemIndex) as string;
	if (!pinterestBoardId) {
		throw new NodeOperationError(
			ctx.getNode(),
			'Pinterest posts require a Board. Please set the "Pinterest Board" field.',
			{ itemIndex },
		);
	}

	const pinterestTitle = ctx.getNodeParameter('pinterestTitle', itemIndex) as string;
	const pinterestUrl = ctx.getNodeParameter('pinterestUrl', itemIndex) as string;

	const meta: IDataObject = { boardServiceId: pinterestBoardId };
	if (pinterestTitle) meta.title = pinterestTitle;
	if (pinterestUrl) meta.url = pinterestUrl;
	return meta;
}
