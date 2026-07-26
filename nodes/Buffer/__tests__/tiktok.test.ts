import { executePostCreate } from './test-helpers';

describe('Buffer Node - Create Post', () => {
	// -------------------------------------------------------
	// TikTok
	// -------------------------------------------------------
	describe('TikTok', () => {
		const tiktokDefaults = {
			channelId: 'chan1|tiktok',
			attachmentType: 'video',
			videoUrl: 'https://example.com/video.mp4',
		};

		it('should throw an error when there is no image or video attachment', async () => {
			await expect(
				executePostCreate({
					...tiktokDefaults,
					attachmentType: 'none',
				}),
			).rejects.toThrow('TikTok posts require an image or video attachment');
		});

		it('should succeed with a video attachment and no TikTok metadata block', async () => {
			const input = await executePostCreate(tiktokDefaults);
			expect(input.metadata).toBeUndefined();
			expect(input.assets).toEqual([{ video: { url: 'https://example.com/video.mp4' } }]);
		});

		it('should succeed with an image attachment and no TikTok metadata block', async () => {
			const input = await executePostCreate({
				...tiktokDefaults,
				attachmentType: 'image',
				imageUrl: 'https://example.com/photo.jpg',
			});
			expect(input.metadata).toBeUndefined();
			expect(input.assets).toEqual([{ image: { url: 'https://example.com/photo.jpg' } }]);
		});

		it('should support notification scheduling and not force it to change', async () => {
			const input = await executePostCreate({
				...tiktokDefaults,
				schedulingType: 'notification',
			});
			expect(input.schedulingType).toBe('notification');
		});
	});
});
