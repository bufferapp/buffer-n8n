import type { IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

// TikTok posts require an image or video attachment
export function validateTikTok(ctx: IExecuteFunctions, itemIndex: number, attachmentType: string): void {
	if (attachmentType === 'none') {
		throw new NodeOperationError(
			ctx.getNode(),
			'TikTok posts require an image or video attachment. Please set the "Attachment Type" field.',
			{ itemIndex },
		);
	}
}
