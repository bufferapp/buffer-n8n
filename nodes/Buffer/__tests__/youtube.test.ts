import type { IDataObject } from 'n8n-workflow';
import { executePostCreate } from './test-helpers';

describe('Buffer Node - Create Post', () => {
	// -------------------------------------------------------
	// YouTube
	// -------------------------------------------------------
	describe('YouTube', () => {
		const youtubeDefaults = {
			channelId: 'chan1|youtube',
			youtubeTitle: 'My Video',
			youtubeCategoryId: '22',
			youtubePrivacy: 'public',
			youtubeLicense: 'youtube',
			youtubeMadeForKids: false,
			youtubeEmbeddable: true,
			youtubeNotifySubscribers: true,
			videoUrl: 'https://example.com/video.mp4',
		};

		it('should send required metadata: title and categoryId', async () => {
			const input = await executePostCreate(youtubeDefaults);
			expect(input.metadata).toEqual({
				youtube: {
					title: 'My Video',
					categoryId: '22',
					privacy: 'public',
					license: 'youtube',
					madeForKids: false,
					embeddable: true,
					notifySubscribers: true,
				},
			});
		});

		it.each(['public', 'private', 'unlisted'])('should support privacy status: %s', async (privacy) => {
			const input = await executePostCreate({
				...youtubeDefaults,
				youtubePrivacy: privacy,
			});
			const meta = (input.metadata as IDataObject).youtube as IDataObject;
			expect(meta.privacy).toBe(privacy);
		});

		it.each(['youtube', 'creativeCommon'])('should support license: %s', async (license) => {
			const input = await executePostCreate({
				...youtubeDefaults,
				youtubeLicense: license,
			});
			const meta = (input.metadata as IDataObject).youtube as IDataObject;
			expect(meta.license).toBe(license);
		});

		it('should send madeForKids as true when enabled', async () => {
			const input = await executePostCreate({
				...youtubeDefaults,
				youtubeMadeForKids: true,
			});
			const meta = (input.metadata as IDataObject).youtube as IDataObject;
			expect(meta.madeForKids).toBe(true);
		});

		it('should send embeddable as false when disabled', async () => {
			const input = await executePostCreate({
				...youtubeDefaults,
				youtubeEmbeddable: false,
			});
			const meta = (input.metadata as IDataObject).youtube as IDataObject;
			expect(meta.embeddable).toBe(false);
		});

		it('should send notifySubscribers as false when disabled', async () => {
			const input = await executePostCreate({
				...youtubeDefaults,
				youtubeNotifySubscribers: false,
			});
			const meta = (input.metadata as IDataObject).youtube as IDataObject;
			expect(meta.notifySubscribers).toBe(false);
		});

		it('should throw an error when the title is missing', async () => {
			await expect(
				executePostCreate({
					...youtubeDefaults,
					youtubeTitle: '',
				}),
			).rejects.toThrow('YouTube posts require a title');
		});

		it('should force attachmentType to video regardless of the field value', async () => {
			const input = await executePostCreate({
				...youtubeDefaults,
				attachmentType: 'none',
			});
			expect(input.assets).toEqual([{ video: { url: 'https://example.com/video.mp4' } }]);
		});

		it('should support notification scheduling and not force it to change', async () => {
			const input = await executePostCreate({
				...youtubeDefaults,
				schedulingType: 'notification',
			});
			expect(input.schedulingType).toBe('notification');
		});
	});
});
