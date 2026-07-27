import type { IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

// Start Page posts require text and do not support video attachments
export function validateStartPage(
	ctx: IExecuteFunctions,
	itemIndex: number,
	attachmentType: string,
	postText: string,
): void {
	if (attachmentType === 'video') {
		throw new NodeOperationError(
			ctx.getNode(),
			'Start Page posts do not support video attachments.',
			{ itemIndex },
		);
	}
	if (!postText || postText.trim() === '') {
		throw new NodeOperationError(
			ctx.getNode(),
			'Start Page posts require text content.',
			{ itemIndex },
		);
	}
}
