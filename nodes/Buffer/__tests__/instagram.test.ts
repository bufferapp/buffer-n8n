import type { IDataObject } from 'n8n-workflow';
import { executePostCreate } from './test-helpers';

describe('Buffer Node - Create Post', () => {
	// -------------------------------------------------------
	// Instagram
	// -------------------------------------------------------
	describe('Instagram', () => {
		const instagramDefaults = {
			channelId: 'chan1|instagram|business',
			instagramPostType: 'post',
			instagramShareToFeed: true,
			instagramFirstComment: '',
			instagramLink: '',
			attachmentType: 'image',
			imageUrl: 'https://example.com/photo.jpg',
		};

		it('should send required metadata: type and shouldShareToFeed', async () => {
			const input = await executePostCreate(instagramDefaults);
			expect(input.metadata).toEqual({
				instagram: {
					type: 'post',
					shouldShareToFeed: true,
				},
			});
		});

		it.each(['post', 'story', 'reel'])('should support Instagram post type: %s', async (type) => {
			const input = await executePostCreate({
				...instagramDefaults,
				instagramPostType: type,
			});
			const meta = (input.metadata as IDataObject).instagram as IDataObject;
			expect(meta.type).toBe(type);
		});

		it('should send shouldShareToFeed as false when disabled', async () => {
			const input = await executePostCreate({
				...instagramDefaults,
				instagramShareToFeed: false,
			});
			const meta = (input.metadata as IDataObject).instagram as IDataObject;
			expect(meta.shouldShareToFeed).toBe(false);
		});

		it('should include firstComment when provided', async () => {
			const input = await executePostCreate({
				...instagramDefaults,
				instagramFirstComment: 'Check this out!',
			});
			const meta = (input.metadata as IDataObject).instagram as IDataObject;
			expect(meta.firstComment).toBe('Check this out!');
		});

		it('should not include firstComment when empty', async () => {
			const input = await executePostCreate(instagramDefaults);
			const meta = (input.metadata as IDataObject).instagram as IDataObject;
			expect(meta).not.toHaveProperty('firstComment');
		});

		it('should include Shop Grid link when provided', async () => {
			const input = await executePostCreate({
				...instagramDefaults,
				instagramLink: 'https://shop.example.com/item',
			});
			const meta = (input.metadata as IDataObject).instagram as IDataObject;
			expect(meta.link).toBe('https://shop.example.com/item');
		});

		it('should not include link when empty', async () => {
			const input = await executePostCreate(instagramDefaults);
			const meta = (input.metadata as IDataObject).instagram as IDataObject;
			expect(meta).not.toHaveProperty('link');
		});

		it('should throw an error when there is no image or video attachment', async () => {
			await expect(
				executePostCreate({
					...instagramDefaults,
					attachmentType: 'none',
				}),
			).rejects.toThrow('Instagram posts require an image or video attachment');
		});

		it('should succeed with an image attachment', async () => {
			const input = await executePostCreate(instagramDefaults);
			expect((input.metadata as IDataObject).instagram).toBeDefined();
		});

		it('should succeed with a video attachment', async () => {
			const input = await executePostCreate({
				...instagramDefaults,
				attachmentType: 'video',
				videoUrl: 'https://example.com/video.mp4',
			});
			expect((input.metadata as IDataObject).instagram).toBeDefined();
		});

		it('should support notification scheduling and not force it to change', async () => {
			const input = await executePostCreate({
				...instagramDefaults,
				schedulingType: 'notification',
			});
			expect(input.schedulingType).toBe('notification');
		});
	});

	// -------------------------------------------------------
	// Instagram Profile
	// -------------------------------------------------------
	describe('Instagram Profile', () => {
		const instagramProfileDefaults = {
			channelId: 'chan1|instagram|profile',
			attachmentType: 'image',
			imageUrl: 'https://example.com/photo.jpg',
		};

		it('should always send metadata type as post with shouldShareToFeed true (no first comment or link)', async () => {
			const input = await executePostCreate(instagramProfileDefaults);
			expect(input.metadata).toEqual({ instagram: { type: 'post', shouldShareToFeed: true } });
		});

		it('should force schedulingType to notification regardless of the field value', async () => {
			const input = await executePostCreate({
				...instagramProfileDefaults,
				schedulingType: 'automatic',
			});
			expect(input.schedulingType).toBe('notification');
		});

		it('should keep schedulingType as notification when already set', async () => {
			const input = await executePostCreate({
				...instagramProfileDefaults,
				schedulingType: 'notification',
			});
			expect(input.schedulingType).toBe('notification');
		});

		it('should throw an error when there is no image or video attachment', async () => {
			await expect(
				executePostCreate({
					...instagramProfileDefaults,
					attachmentType: 'none',
				}),
			).rejects.toThrow('Instagram posts require an image or video attachment');
		});
	});
});
