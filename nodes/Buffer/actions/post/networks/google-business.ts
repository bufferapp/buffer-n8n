import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { TIME_FORMAT_REGEX, toDateOnlyIso, combineDateAndTime } from '../../../helpers/dateTime';

// Google Business posts do not support video attachments
export function validateGoogleBusiness(ctx: IExecuteFunctions, itemIndex: number, attachmentType: string): void {
	if (attachmentType === 'video') {
		throw new NodeOperationError(
			ctx.getNode(),
			'Google Business posts do not support video attachments. Please use an image or no attachment.',
			{ itemIndex },
		);
	}
}

export function buildGoogleBusinessMetadata(ctx: IExecuteFunctions, itemIndex: number): IDataObject {
	const googlePostType = ctx.getNodeParameter('googlePostType', itemIndex) as string;
	const googleMeta: IDataObject = { type: googlePostType };

	if (googlePostType === 'whats_new') {
		const button = ctx.getNodeParameter('googleWhatsNewButton', itemIndex) as string;
		const link = ctx.getNodeParameter('googleWhatsNewLink', itemIndex) as string;
		const details: IDataObject = {};
		if (button) details.button = button;
		if (link) details.link = link;
		googleMeta.detailsWhatsNew = details;
	} else if (googlePostType === 'offer') {
		const title = ctx.getNodeParameter('googleOfferTitle', itemIndex) as string;
		const startDate = ctx.getNodeParameter('googleOfferStartDate', itemIndex) as string;
		const endDate = ctx.getNodeParameter('googleOfferEndDate', itemIndex) as string;
		const code = ctx.getNodeParameter('googleOfferCode', itemIndex) as string;
		const link = ctx.getNodeParameter('googleOfferLink', itemIndex) as string;
		const terms = ctx.getNodeParameter('googleOfferTerms', itemIndex) as string;
		if (title) googleMeta.title = title;
		const details: IDataObject = {
			title,
			// Google Business offers only support a calendar date, not a time of day
			startDate: toDateOnlyIso(startDate),
			endDate: toDateOnlyIso(endDate),
		};
		if (code) details.code = code;
		if (link) details.link = link;
		if (terms) details.terms = terms;
		googleMeta.detailsOffer = details;
	} else if (googlePostType === 'event') {
		const title = ctx.getNodeParameter('googleEventTitle', itemIndex) as string;
		const startDate = ctx.getNodeParameter('googleEventStartDate', itemIndex) as string;
		const endDate = ctx.getNodeParameter('googleEventEndDate', itemIndex) as string;
		const hasTime = ctx.getNodeParameter('googleEventHasTime', itemIndex) as boolean;
		const button = ctx.getNodeParameter('googleEventButton', itemIndex) as string;
		const link = ctx.getNodeParameter('googleEventLink', itemIndex) as string;

		let eventStartDate: string;
		let eventEndDate: string;
		if (hasTime) {
			const startTime = ctx.getNodeParameter('googleEventStartTime', itemIndex) as string;
			const endTime = ctx.getNodeParameter('googleEventEndTime', itemIndex) as string;
			if (!startTime || !endTime) {
				throw new NodeOperationError(
					ctx.getNode(),
					'Please provide both an "Event Start Time" and "Event End Time", or disable "Specify Event Time" to create an all-day event.',
					{ itemIndex },
				);
			}
			if (!TIME_FORMAT_REGEX.test(startTime) || !TIME_FORMAT_REGEX.test(endTime)) {
				throw new NodeOperationError(
					ctx.getNode(),
					'Event times must be in 24-hour HH:mm format, e.g. 14:30.',
					{ itemIndex },
				);
			}
			eventStartDate = combineDateAndTime(startDate, startTime);
			eventEndDate = combineDateAndTime(endDate, endTime);
		} else {
			eventStartDate = toDateOnlyIso(startDate);
			eventEndDate = toDateOnlyIso(endDate);
		}

		if (title) googleMeta.title = title;
		const details: IDataObject = {
			title,
			startDate: eventStartDate,
			endDate: eventEndDate,
			isFullDayEvent: !hasTime,
		};
		if (button) details.button = button;
		if (link) details.link = link;
		googleMeta.detailsEvent = details;
	}

	return googleMeta;
}
