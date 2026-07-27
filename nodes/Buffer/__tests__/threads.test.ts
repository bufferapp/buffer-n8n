import { executePostCreate } from './test-helpers';

describe('Buffer Node - Create Post', () => {
	// -------------------------------------------------------
	// Threads
	// -------------------------------------------------------
	describe('Threads', () => {
		const threadsDefaults = {
			channelId: 'chan1|threads',
			postText: 'Hello Threads',
		};

		it('should not include a metadata block', async () => {
			const input = await executePostCreate(threadsDefaults);
			expect(input).not.toHaveProperty('metadata');
		});

		it('should succeed with text only', async () => {
			const input = await executePostCreate(threadsDefaults);
			expect(input.text).toBe('Hello Threads');
			expect(input.assets).toEqual([]);
		});

		it('should succeed with an image attachment', async () => {
			const input = await executePostCreate({
				...threadsDefaults,
				attachmentType: 'image',
				imageUrl: 'https://example.com/photo.jpg',
			});
			expect(input.assets).toEqual([{ image: { url: 'https://example.com/photo.jpg' } }]);
		});

		it('should succeed with a video attachment', async () => {
			const input = await executePostCreate({
				...threadsDefaults,
				attachmentType: 'video',
				videoUrl: 'https://example.com/video.mp4',
			});
			expect(input.assets).toEqual([{ video: { url: 'https://example.com/video.mp4' } }]);
		});

		it('should force schedulingType to automatic regardless of the field value', async () => {
			const input = await executePostCreate({
				...threadsDefaults,
				schedulingType: 'notification',
			});
			expect(input.schedulingType).toBe('automatic');
		});

		it('should keep schedulingType as automatic when already set', async () => {
			const input = await executePostCreate({
				...threadsDefaults,
				schedulingType: 'automatic',
			});
			expect(input.schedulingType).toBe('automatic');
		});
	});
});
