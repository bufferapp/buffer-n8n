import type { IDataObject } from 'n8n-workflow';
import { executePostCreate } from './test-helpers';

describe('Buffer Node - Create Post', () => {
	// -------------------------------------------------------
	// Google Business - What's New
	// -------------------------------------------------------
	describe('Google Business - What\'s New', () => {
		const googleWhatsNewDefaults = {
			channelId: 'chan1|googlebusiness',
			googlePostType: 'whats_new',
			googleWhatsNewButton: 'none',
			googleWhatsNewLink: '',
		};

		it('should send correct metadata structure for whats_new', async () => {
			const input = await executePostCreate(googleWhatsNewDefaults);
			const meta = (input.metadata as IDataObject).google as IDataObject;
			expect(meta.type).toBe('whats_new');
			expect(meta).toHaveProperty('detailsWhatsNew');
		});

		it.each(['none', 'book', 'order', 'shop', 'learn_more', 'signup', 'call'])(
			'should support action button: %s',
			async (button) => {
				const input = await executePostCreate({
					...googleWhatsNewDefaults,
					googleWhatsNewButton: button,
				});
				const meta = (input.metadata as IDataObject).google as IDataObject;
				const details = meta.detailsWhatsNew as IDataObject;
				expect(details.button).toBe(button);
			},
		);

		it('should include link in detailsWhatsNew when provided', async () => {
			const input = await executePostCreate({
				...googleWhatsNewDefaults,
				googleWhatsNewLink: 'https://example.com/promo',
			});
			const meta = (input.metadata as IDataObject).google as IDataObject;
			const details = meta.detailsWhatsNew as IDataObject;
			expect(details.link).toBe('https://example.com/promo');
		});

		it('should not include link in detailsWhatsNew when empty', async () => {
			const input = await executePostCreate(googleWhatsNewDefaults);
			const meta = (input.metadata as IDataObject).google as IDataObject;
			const details = meta.detailsWhatsNew as IDataObject;
			expect(details).not.toHaveProperty('link');
		});

		it('should throw an error when a video attachment is used', async () => {
			await expect(
				executePostCreate({
					...googleWhatsNewDefaults,
					attachmentType: 'video',
				}),
			).rejects.toThrow('Google Business posts do not support video attachments');
		});

		it('should succeed with no attachment', async () => {
			const input = await executePostCreate(googleWhatsNewDefaults);
			expect((input.metadata as IDataObject).google).toBeDefined();
		});

		it('should succeed with an image attachment', async () => {
			const input = await executePostCreate({
				...googleWhatsNewDefaults,
				attachmentType: 'image',
				imageUrl: 'https://example.com/photo.jpg',
			});
			expect((input.metadata as IDataObject).google).toBeDefined();
		});
	});

	// -------------------------------------------------------
	// Google Business - Offer
	// -------------------------------------------------------
	describe('Google Business - Offer', () => {
		const googleOfferDefaults = {
			channelId: 'chan1|googlebusiness',
			googlePostType: 'offer',
			googleOfferTitle: 'Summer Sale',
			googleOfferStartDate: '2026-06-01T00:00:00Z',
			googleOfferEndDate: '2026-06-30T23:59:59Z',
			googleOfferCode: '',
			googleOfferLink: '',
			googleOfferTerms: '',
		};

		it('should send correct metadata structure for offer', async () => {
			const input = await executePostCreate(googleOfferDefaults);
			const meta = (input.metadata as IDataObject).google as IDataObject;
			expect(meta.type).toBe('offer');
			expect(meta.title).toBe('Summer Sale');
			expect(meta).toHaveProperty('detailsOffer');
		});

		it('should include title, startDate, and endDate in detailsOffer', async () => {
			const input = await executePostCreate(googleOfferDefaults);
			const meta = (input.metadata as IDataObject).google as IDataObject;
			const details = meta.detailsOffer as IDataObject;
			expect(details.title).toBe('Summer Sale');
			expect(details.startDate).toBe('2026-06-01T00:00:00.000Z');
			expect(details.endDate).toBe('2026-06-30T00:00:00.000Z');
		});

		it('should truncate any time component from the start/end date, since offers only support a date', async () => {
			const input = await executePostCreate({
				...googleOfferDefaults,
				googleOfferStartDate: '2026-06-01T15:45:00Z',
				googleOfferEndDate: '2026-06-30T23:59:59Z',
			});
			const meta = (input.metadata as IDataObject).google as IDataObject;
			const details = meta.detailsOffer as IDataObject;
			expect(details.startDate).toBe('2026-06-01T00:00:00.000Z');
			expect(details.endDate).toBe('2026-06-30T00:00:00.000Z');
		});

		it('should include optional offer fields when provided', async () => {
			const input = await executePostCreate({
				...googleOfferDefaults,
				googleOfferCode: 'SUMMER20',
				googleOfferLink: 'https://example.com/sale',
				googleOfferTerms: 'While supplies last',
			});
			const meta = (input.metadata as IDataObject).google as IDataObject;
			const details = meta.detailsOffer as IDataObject;
			expect(details.code).toBe('SUMMER20');
			expect(details.link).toBe('https://example.com/sale');
			expect(details.terms).toBe('While supplies last');
		});

		it('should not include optional offer fields when empty', async () => {
			const input = await executePostCreate(googleOfferDefaults);
			const meta = (input.metadata as IDataObject).google as IDataObject;
			const details = meta.detailsOffer as IDataObject;
			expect(details).not.toHaveProperty('code');
			expect(details).not.toHaveProperty('link');
			expect(details).not.toHaveProperty('terms');
		});

		it('should throw an error when a video attachment is used', async () => {
			await expect(
				executePostCreate({
					...googleOfferDefaults,
					attachmentType: 'video',
					videoUrl: 'https://example.com/video.mp4',
				}),
			).rejects.toThrow('Google Business posts do not support video attachments');
		});
	});

	// -------------------------------------------------------
	// Google Business - Event
	// -------------------------------------------------------
	describe('Google Business - Event', () => {
		const googleEventDefaults = {
			channelId: 'chan1|googlebusiness',
			googlePostType: 'event',
			googleEventTitle: 'Grand Opening',
			googleEventStartDate: '2026-07-01T10:00:00Z',
			googleEventEndDate: '2026-07-01T18:00:00Z',
			googleEventHasTime: false,
			googleEventStartTime: '',
			googleEventEndTime: '',
			googleEventButton: 'none',
			googleEventLink: '',
		};

		it('should send correct metadata structure for event', async () => {
			const input = await executePostCreate(googleEventDefaults);
			const meta = (input.metadata as IDataObject).google as IDataObject;
			expect(meta.type).toBe('event');
			expect(meta.title).toBe('Grand Opening');
			expect(meta).toHaveProperty('detailsEvent');
		});

		it('should default to an all-day event and truncate the date when time is not specified', async () => {
			const input = await executePostCreate(googleEventDefaults);
			const meta = (input.metadata as IDataObject).google as IDataObject;
			const details = meta.detailsEvent as IDataObject;
			expect(details.title).toBe('Grand Opening');
			expect(details.startDate).toBe('2026-07-01T00:00:00.000Z');
			expect(details.endDate).toBe('2026-07-01T00:00:00.000Z');
			expect(details.isFullDayEvent).toBe(true);
		});

		it('should combine the date and time when a specific event time is provided', async () => {
			const input = await executePostCreate({
				...googleEventDefaults,
				googleEventHasTime: true,
				googleEventStartTime: '10:00',
				googleEventEndTime: '18:00',
			});
			const meta = (input.metadata as IDataObject).google as IDataObject;
			const details = meta.detailsEvent as IDataObject;
			expect(details.startDate).toBe('2026-07-01T10:00:00.000Z');
			expect(details.endDate).toBe('2026-07-01T18:00:00.000Z');
			expect(details.isFullDayEvent).toBe(false);
		});

		it('should throw an error when time is enabled but start or end time is missing', async () => {
			await expect(
				executePostCreate({
					...googleEventDefaults,
					googleEventHasTime: true,
					googleEventStartTime: '10:00',
					googleEventEndTime: '',
				}),
			).rejects.toThrow(
				'Please provide both an "Event Start Time" and "Event End Time", or disable "Specify Event Time" to create an all-day event.',
			);
		});

		it('should throw an error when the provided time is not in 24-hour HH:mm format', async () => {
			await expect(
				executePostCreate({
					...googleEventDefaults,
					googleEventHasTime: true,
					googleEventStartTime: '10am',
					googleEventEndTime: '18:00',
				}),
			).rejects.toThrow('Event times must be in 24-hour HH:mm format, e.g. 14:30.');
		});

		it('should include action button and link when provided', async () => {
			const input = await executePostCreate({
				...googleEventDefaults,
				googleEventButton: 'book',
				googleEventLink: 'https://example.com/rsvp',
			});
			const meta = (input.metadata as IDataObject).google as IDataObject;
			const details = meta.detailsEvent as IDataObject;
			expect(details.button).toBe('book');
			expect(details.link).toBe('https://example.com/rsvp');
		});

		it('should not include action button link when empty', async () => {
			const input = await executePostCreate(googleEventDefaults);
			const meta = (input.metadata as IDataObject).google as IDataObject;
			const details = meta.detailsEvent as IDataObject;
			expect(details).not.toHaveProperty('link');
		});

		it('should throw an error when a video attachment is used', async () => {
			await expect(
				executePostCreate({
					...googleEventDefaults,
					attachmentType: 'video',
					videoUrl: 'https://example.com/video.mp4',
				}),
			).rejects.toThrow('Google Business posts do not support video attachments');
		});
	});

	// -------------------------------------------------------
	// Google Business - Scheduling
	// -------------------------------------------------------
	describe('Google Business - Scheduling', () => {
		const googleWhatsNewDefaults = {
			channelId: 'chan1|googlebusiness',
			googlePostType: 'whats_new',
			googleWhatsNewButton: 'none',
			googleWhatsNewLink: '',
		};

		it('should force schedulingType to automatic regardless of the field value', async () => {
			const input = await executePostCreate({
				...googleWhatsNewDefaults,
				schedulingType: 'notification',
			});
			expect(input.schedulingType).toBe('automatic');
		});

		it('should keep schedulingType as automatic when already set', async () => {
			const input = await executePostCreate({
				...googleWhatsNewDefaults,
				schedulingType: 'automatic',
			});
			expect(input.schedulingType).toBe('automatic');
		});
	});
});
