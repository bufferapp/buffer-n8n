import type { IDataObject } from 'n8n-workflow';
import { executePostCreate } from './test-helpers';

describe('Buffer Node - Create Post', () => {
	// -------------------------------------------------------
	// Core input structure
	// -------------------------------------------------------
	describe('core input fields', () => {
		it('should always include required fields: channelId, mode, schedulingType, assets', async () => {
			const input = await executePostCreate({
				channelId: 'chan1|twitter',
			});
			expect(input).toHaveProperty('channelId', 'chan1');
			expect(input).toHaveProperty('mode', 'shareNow');
			expect(input).toHaveProperty('schedulingType', 'automatic');
			expect(input).toHaveProperty('assets');
		});

		it('should send assets as an empty array for text-only posts', async () => {
			const input = await executePostCreate({
				channelId: 'chan1|twitter',
				attachmentType: 'none',
			});
			expect(input.assets).toEqual([]);
		});

		it('should include text when provided', async () => {
			const input = await executePostCreate({
				channelId: 'chan1|twitter',
				postText: 'Hello world',
			});
			expect(input.text).toBe('Hello world');
		});

		it('should not include text when empty', async () => {
			const input = await executePostCreate({
				channelId: 'chan1|twitter',
				postText: '',
			});
			expect(input).not.toHaveProperty('text');
		});
	});

	// -------------------------------------------------------
	// Share modes
	// -------------------------------------------------------
	describe('share modes', () => {
		it.each([
			['shareNow'],
			['addToQueue'],
			['shareNext'],
			['customScheduled'],
		])('should support share mode: %s', async (mode) => {
			const params: Record<string, unknown> = {
				channelId: 'chan1|twitter',
				shareMode: mode,
			};
			if (mode === 'customScheduled') {
				params.dueAt = '2026-06-01T12:00:00Z';
			}
			const input = await executePostCreate(params);
			expect(input.mode).toBe(mode);
		});

		it('should include dueAt in ISO format for customScheduled mode', async () => {
			const input = await executePostCreate({
				channelId: 'chan1|twitter',
				shareMode: 'customScheduled',
				dueAt: '2026-06-01T12:00:00Z',
			});
			expect(input.dueAt).toBe('2026-06-01T12:00:00.000Z');
		});

		it('should not include dueAt for non-scheduled modes', async () => {
			const input = await executePostCreate({
				channelId: 'chan1|twitter',
				shareMode: 'shareNow',
			});
			expect(input).not.toHaveProperty('dueAt');
		});
	});

	// -------------------------------------------------------
	// Assets - new array format
	// -------------------------------------------------------
	describe('assets', () => {
		it('should send image asset in new array format with { image: ... }', async () => {
			const input = await executePostCreate({
				channelId: 'chan1|twitter',
				attachmentType: 'image',
				imageUrl: 'https://example.com/photo.jpg',
				imageThumbnailUrl: '',
				imageAltText: '',
			});
			expect(input.assets).toEqual([
				{ image: { url: 'https://example.com/photo.jpg' } },
			]);
		});

		it('should include image thumbnailUrl when provided', async () => {
			const input = await executePostCreate({
				channelId: 'chan1|twitter',
				attachmentType: 'image',
				imageUrl: 'https://example.com/photo.jpg',
				imageThumbnailUrl: 'https://example.com/thumb.jpg',
				imageAltText: '',
			});
			expect((input.assets as IDataObject[])[0]).toEqual({
				image: {
					url: 'https://example.com/photo.jpg',
					thumbnailUrl: 'https://example.com/thumb.jpg',
				},
			});
		});

		it('should include image alt text in metadata when provided', async () => {
			const input = await executePostCreate({
				channelId: 'chan1|twitter',
				attachmentType: 'image',
				imageUrl: 'https://example.com/photo.jpg',
				imageThumbnailUrl: '',
				imageAltText: 'A beautiful sunset',
			});
			const asset = (input.assets as IDataObject[])[0] as IDataObject;
			const image = asset.image as IDataObject;
			expect(image.metadata).toEqual({ altText: 'A beautiful sunset' });
		});

		it('should send video asset in new array format with { video: ... }', async () => {
			const input = await executePostCreate({
				channelId: 'chan1|twitter',
				attachmentType: 'video',
				videoUrl: 'https://example.com/clip.mp4',
				videoThumbnailUrl: '',
			});
			expect(input.assets).toEqual([
				{ video: { url: 'https://example.com/clip.mp4' } },
			]);
		});

		it('should include video thumbnailUrl when provided', async () => {
			const input = await executePostCreate({
				channelId: 'chan1|twitter',
				attachmentType: 'video',
				videoUrl: 'https://example.com/clip.mp4',
				videoThumbnailUrl: 'https://example.com/vthumb.jpg',
			});
			expect((input.assets as IDataObject[])[0]).toEqual({
				video: {
					url: 'https://example.com/clip.mp4',
					thumbnailUrl: 'https://example.com/vthumb.jpg',
				},
			});
		});
	});

	// -------------------------------------------------------
	// Asset URL validation
	// -------------------------------------------------------
	describe('asset URL validation', () => {
		it('should throw an error when the image URL is empty', async () => {
			await expect(
				executePostCreate({
					channelId: 'chan1|twitter',
					attachmentType: 'image',
					imageUrl: '',
				}),
			).rejects.toThrow('Image URL is required and cannot be empty');
		});

		it('should throw an error when the image URL is not a valid URL', async () => {
			await expect(
				executePostCreate({
					channelId: 'chan1|twitter',
					attachmentType: 'image',
					imageUrl: 'not-a-url',
				}),
			).rejects.toThrow('Invalid image URL format');
		});

		it('should throw an error when the image URL protocol is not HTTP or HTTPS', async () => {
			await expect(
				executePostCreate({
					channelId: 'chan1|twitter',
					attachmentType: 'image',
					imageUrl: 'ftp://example.com/photo.jpg',
				}),
			).rejects.toThrow('Invalid image URL protocol');
		});

		it('should throw an error when the image thumbnail URL is not a valid URL', async () => {
			await expect(
				executePostCreate({
					channelId: 'chan1|twitter',
					attachmentType: 'image',
					imageUrl: 'https://example.com/photo.jpg',
					imageThumbnailUrl: 'not-a-url',
				}),
			).rejects.toThrow('Invalid thumbnail URL format');
		});

		it('should throw an error when the image thumbnail URL protocol is not HTTP or HTTPS', async () => {
			await expect(
				executePostCreate({
					channelId: 'chan1|twitter',
					attachmentType: 'image',
					imageUrl: 'https://example.com/photo.jpg',
					imageThumbnailUrl: 'ftp://example.com/thumb.jpg',
				}),
			).rejects.toThrow('Invalid thumbnail URL protocol');
		});

		it('should throw an error when the video URL is empty', async () => {
			await expect(
				executePostCreate({
					channelId: 'chan1|twitter',
					attachmentType: 'video',
					videoUrl: '',
				}),
			).rejects.toThrow('Video URL is required and cannot be empty');
		});

		it('should throw an error when the video URL is not a valid URL', async () => {
			await expect(
				executePostCreate({
					channelId: 'chan1|twitter',
					attachmentType: 'video',
					videoUrl: 'not-a-url',
				}),
			).rejects.toThrow('Invalid video URL format');
		});

		it('should throw an error when the video URL protocol is not HTTP or HTTPS', async () => {
			await expect(
				executePostCreate({
					channelId: 'chan1|twitter',
					attachmentType: 'video',
					videoUrl: 'ftp://example.com/video.mp4',
				}),
			).rejects.toThrow('Invalid video URL protocol');
		});

		it('should throw an error when the video thumbnail URL is not a valid URL', async () => {
			await expect(
				executePostCreate({
					channelId: 'chan1|twitter',
					attachmentType: 'video',
					videoUrl: 'https://example.com/video.mp4',
					videoThumbnailUrl: 'not-a-url',
				}),
			).rejects.toThrow('Invalid thumbnail URL format');
		});

		it('should throw an error when the video thumbnail URL protocol is not HTTP or HTTPS', async () => {
			await expect(
				executePostCreate({
					channelId: 'chan1|twitter',
					attachmentType: 'video',
					videoUrl: 'https://example.com/video.mp4',
					videoThumbnailUrl: 'ftp://example.com/thumb.jpg',
				}),
			).rejects.toThrow('Invalid thumbnail URL protocol');
		});
	});

	// -------------------------------------------------------
	// No metadata for generic channels
	// -------------------------------------------------------
	describe('generic channels (Twitter, LinkedIn, etc.)', () => {
		it('should not include metadata for channels without specific requirements', async () => {
			const input = await executePostCreate({
				channelId: 'chan1|twitter',
				postText: 'Hello Twitter',
			});
			expect(input).not.toHaveProperty('metadata');
		});
	});

	// -------------------------------------------------------
	// Disconnected channel
	// -------------------------------------------------------
	describe('disconnected channel', () => {
		it('should throw an error for disconnected channels', async () => {
			await expect(
				executePostCreate({
					channelId: 'chan1|twitter|disconnected',
				}),
			).rejects.toThrow('The selected channel is disconnected');
		});
	});

	// -------------------------------------------------------
	// Scheduling type
	// -------------------------------------------------------
	describe('scheduling type', () => {
		it('should send scheduling type as automatic by default', async () => {
			const input = await executePostCreate({
				channelId: 'chan1|twitter',
			});
			expect(input.schedulingType).toBe('automatic');
		});

		it('should send notification scheduling type when specified', async () => {
			const input = await executePostCreate({
				channelId: 'chan1|instagram',
				schedulingType: 'notification',
				instagramPostType: 'post',
				instagramShareToFeed: true,
				instagramFirstComment: '',
				instagramLink: '',
				attachmentType: 'image',
				imageUrl: 'https://example.com/photo.jpg',
			});
			expect(input.schedulingType).toBe('notification');
		});
	});
});
