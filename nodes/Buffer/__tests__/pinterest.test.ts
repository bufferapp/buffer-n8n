import type { IDataObject } from 'n8n-workflow';
import { executePostCreate } from './test-helpers';

describe('Buffer Node - Create Post', () => {
	// -------------------------------------------------------
	// Pinterest
	// -------------------------------------------------------
	describe('Pinterest', () => {
		const pinterestDefaults = {
			channelId: 'chan1|pinterest',
			pinterestBoardId: 'board-123',
			postText: 'Check out this pin',
			attachmentType: 'image',
			imageUrl: 'https://example.com/photo.jpg',
		};

		it('should throw an error when there is no board selected', async () => {
			await expect(
				executePostCreate({
					...pinterestDefaults,
					pinterestBoardId: '',
				}),
			).rejects.toThrow('Pinterest posts require a Board');
		});

		it('should throw an error when there is no image attachment', async () => {
			await expect(
				executePostCreate({
					...pinterestDefaults,
					attachmentType: 'none',
				}),
			).rejects.toThrow('Pinterest posts require an image attachment');
		});

		it('should throw an error when a video attachment is selected', async () => {
			await expect(
				executePostCreate({
					...pinterestDefaults,
					attachmentType: 'video',
					videoUrl: 'https://example.com/video.mp4',
				}),
			).rejects.toThrow('Pinterest posts do not support video attachments');
		});

		it('should throw an error when there is no text', async () => {
			await expect(
				executePostCreate({
					...pinterestDefaults,
					postText: '',
				}),
			).rejects.toThrow('Pinterest posts require text content');
		});

		it('should send required metadata: boardServiceId', async () => {
			const input = await executePostCreate(pinterestDefaults);
			expect(input.metadata).toEqual({
				pinterest: { boardServiceId: 'board-123' },
			});
		});

		it('should include title and url in metadata when provided', async () => {
			const input = await executePostCreate({
				...pinterestDefaults,
				pinterestTitle: 'My Pin',
				pinterestUrl: 'https://example.com/product',
			});
			const meta = (input.metadata as IDataObject).pinterest as IDataObject;
			expect(meta.title).toBe('My Pin');
			expect(meta.url).toBe('https://example.com/product');
		});

		it('should not include title or url in metadata when empty', async () => {
			const input = await executePostCreate(pinterestDefaults);
			const meta = (input.metadata as IDataObject).pinterest as IDataObject;
			expect(meta).not.toHaveProperty('title');
			expect(meta).not.toHaveProperty('url');
		});

		it('should force schedulingType to automatic regardless of the field value', async () => {
			const input = await executePostCreate({
				...pinterestDefaults,
				schedulingType: 'notification',
			});
			expect(input.schedulingType).toBe('automatic');
		});

		it('should keep schedulingType as automatic when already set', async () => {
			const input = await executePostCreate({
				...pinterestDefaults,
				schedulingType: 'automatic',
			});
			expect(input.schedulingType).toBe('automatic');
		});
	});
});
