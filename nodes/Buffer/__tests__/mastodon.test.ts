import { executePostCreate } from './test-helpers';

describe('Buffer Node - Create Post', () => {
	// -------------------------------------------------------
	// Mastodon
	// -------------------------------------------------------
	describe('Mastodon', () => {
		const mastodonDefaults = {
			channelId: 'chan1|mastodon',
		};

		it('should throw an error when there is no text, image, or video', async () => {
			await expect(executePostCreate(mastodonDefaults)).rejects.toThrow(
				'Mastodon posts require text, an image, or a video',
			);
		});

		it('should succeed with text only', async () => {
			const input = await executePostCreate({
				...mastodonDefaults,
				postText: 'Hello Mastodon',
			});
			expect(input.text).toBe('Hello Mastodon');
		});

		it('should not include a metadata block', async () => {
			const input = await executePostCreate({
				...mastodonDefaults,
				postText: 'Hello Mastodon',
			});
			expect(input).not.toHaveProperty('metadata');
		});

		it('should succeed with an image attachment only', async () => {
			const input = await executePostCreate({
				...mastodonDefaults,
				attachmentType: 'image',
				imageUrl: 'https://example.com/photo.jpg',
			});
			expect(input.assets).toEqual([{ image: { url: 'https://example.com/photo.jpg' } }]);
		});

		it('should succeed with a video attachment only', async () => {
			const input = await executePostCreate({
				...mastodonDefaults,
				attachmentType: 'video',
				videoUrl: 'https://example.com/video.mp4',
			});
			expect(input.assets).toEqual([{ video: { url: 'https://example.com/video.mp4' } }]);
		});

		it('should force schedulingType to automatic regardless of the field value', async () => {
			const input = await executePostCreate({
				...mastodonDefaults,
				postText: 'Hello Mastodon',
				schedulingType: 'notification',
			});
			expect(input.schedulingType).toBe('automatic');
		});

		it('should keep schedulingType as automatic when already set', async () => {
			const input = await executePostCreate({
				...mastodonDefaults,
				postText: 'Hello Mastodon',
				schedulingType: 'automatic',
			});
			expect(input.schedulingType).toBe('automatic');
		});
	});
});
