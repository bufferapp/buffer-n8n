import type { IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

// Mastodon posts require at least text, an image, or a video
export function validateMastodon(
	ctx: IExecuteFunctions,
	itemIndex: number,
	attachmentType: string,
	postText: string,
): void {
	if (attachmentType === 'none' && (!postText || postText.trim() === '')) {
		throw new NodeOperationError(
			ctx.getNode(),
			'Mastodon posts require text, an image, or a video.',
			{ itemIndex },
		);
	}
}
