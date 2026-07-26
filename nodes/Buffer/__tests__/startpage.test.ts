import { executePostCreate } from './test-helpers';

describe('Buffer Node - Create Post', () => {
	// -------------------------------------------------------
	// Start Page
	// -------------------------------------------------------
	describe('Start Page', () => {
		const startPageDefaults = {
			channelId: 'chan1|startpage',
			postText: 'Check out my new page',
		};

		it('should throw an error when there is no text', async () => {
			await expect(
				executePostCreate({
					...startPageDefaults,
					postText: '',
				}),
			).rejects.toThrow('Start Page posts require text content');
		});

		it('should throw an error when a video attachment is used', async () => {
			await expect(
				executePostCreate({
					...startPageDefaults,
					attachmentType: 'video',
					videoUrl: 'https://example.com/video.mp4',
				}),
			).rejects.toThrow('Start Page posts do not support video attachments');
		});

		it('should succeed with text and no attachment', async () => {
			const input = await executePostCreate(startPageDefaults);
			expect(input.text).toBe('Check out my new page');
		});

		it('should not include a metadata block', async () => {
			const input = await executePostCreate(startPageDefaults);
			expect(input).not.toHaveProperty('metadata');
		});

		it('should succeed with text and an image attachment', async () => {
			const input = await executePostCreate({
				...startPageDefaults,
				attachmentType: 'image',
				imageUrl: 'https://example.com/photo.jpg',
			});
			expect(input.assets).toEqual([{ image: { url: 'https://example.com/photo.jpg' } }]);
		});

		it('should force schedulingType to automatic regardless of the field value', async () => {
			const input = await executePostCreate({
				...startPageDefaults,
				schedulingType: 'notification',
			});
			expect(input.schedulingType).toBe('automatic');
		});

		it('should keep schedulingType as automatic when already set', async () => {
			const input = await executePostCreate({
				...startPageDefaults,
				schedulingType: 'automatic',
			});
			expect(input.schedulingType).toBe('automatic');
		});
	});
});
