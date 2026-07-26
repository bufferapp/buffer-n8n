import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';

export function buildFacebookMetadata(
	ctx: IExecuteFunctions,
	itemIndex: number,
	isFacebookGroup: boolean,
): IDataObject {
	if (isFacebookGroup) {
		// Facebook Groups only support the "post" type; no first comment or link attachment
		return { type: 'post' };
	}

	const facebookPostType = ctx.getNodeParameter('facebookPostType', itemIndex) as string;
	const facebookFirstComment = ctx.getNodeParameter('facebookFirstComment', itemIndex) as string;
	const facebookLinkAttachment = ctx.getNodeParameter('facebookLinkAttachment', itemIndex) as string;

	const meta: IDataObject = { type: facebookPostType };
	if (facebookFirstComment) meta.firstComment = facebookFirstComment;
	if (facebookLinkAttachment) meta.linkAttachment = { url: facebookLinkAttachment };
	return meta;
}
