import { executePostCreate } from './test-helpers';

describe('Buffer Node - Create Post', () => {
	// -------------------------------------------------------
	// Bluesky
	// -------------------------------------------------------
	describe('Bluesky', () => {
		const blueskyDefaults = {
			channelId: 'chan1|bluesky',
			postText: 'Hello Bluesky',
		};

		it('should not include a metadata block', async () => {
			const input = await executePostCreate(blueskyDefaults);
			expect(input).not.toHaveProperty('metadata');
		});

		it('should succeed with text only', async () => {
			const input = await executePostCreate(blueskyDefaults);
			expect(input.text).toBe('Hello Bluesky');
			expect(input.assets).toEqual([]);
		});

		it('should succeed with an image attachment', async () => {
			const input = await executePostCreate({
				...blueskyDefaults,
				attachmentType: 'image',
				imageUrl: 'https://example.com/photo.jpg',
			});
			expect(input.assets).toEqual([{ image: { url: 'https://example.com/photo.jpg' } }]);
		});

		it('should succeed with a video attachment', async () => {
			const input = await executePostCreate({
				...blueskyDefaults,
				attachmentType: 'video',
				videoUrl: 'https://example.com/video.mp4',
			});
			expect(input.assets).toEqual([{ video: { url: 'https://example.com/video.mp4' } }]);
		});

		it('should force schedulingType to automatic regardless of the field value', async () => {
			const input = await executePostCreate({
				...blueskyDefaults,
				schedulingType: 'notification',
			});
			expect(input.schedulingType).toBe('automatic');
		});

		it('should keep schedulingType as automatic when already set', async () => {
			const input = await executePostCreate({
				...blueskyDefaults,
				schedulingType: 'automatic',
			});
			expect(input.schedulingType).toBe('automatic');
		});
	});
});
