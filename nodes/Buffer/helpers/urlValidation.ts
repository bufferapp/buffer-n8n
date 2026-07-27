import type { IExecuteFunctions } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

interface ValidateUrlOptions {
	/** Whether an empty value should throw. When false, an empty value is silently accepted (skips validation). */
	required: boolean;
	/** Label used in the "is required and cannot be empty" message, e.g. "Image URL". Required when `required` is true. */
	requiredLabel?: string;
	/** Label used in the "Invalid <label> URL format/protocol" messages, e.g. "image", "video", "thumbnail". */
	formatLabel: string;
}

// Shared validation for the publicly-accessible asset URLs (image/video main + thumbnail), used
// by every network's asset-building logic. Mirrors the checks previously duplicated 4x inline in
// Buffer.node.ts: empty check (only for required URLs), URL-format parseability, and HTTP/HTTPS protocol.
export function validateUrl(
	ctx: IExecuteFunctions,
	url: string,
	itemIndex: number,
	options: ValidateUrlOptions,
): void {
	if (!url || url.trim() === '') {
		if (options.required) {
			throw new NodeApiError(
				ctx.getNode(),
				{ message: `${options.requiredLabel} is required and cannot be empty` },
				{ itemIndex },
			);
		}
		return;
	}

	let parsedUrl: URL;
	try {
		parsedUrl = new URL(url);
	} catch {
		throw new NodeApiError(
			ctx.getNode(),
			{ message: `Invalid ${options.formatLabel} URL format: "${url}" is not a valid URL` },
			{ itemIndex },
		);
	}

	if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
		throw new NodeApiError(
			ctx.getNode(),
			{ message: `Invalid ${options.formatLabel} URL protocol: URL must use HTTP or HTTPS (got ${parsedUrl.protocol})` },
			{ itemIndex },
		);
	}
}
