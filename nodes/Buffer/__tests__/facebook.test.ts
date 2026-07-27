import type { IDataObject } from 'n8n-workflow';
import { executePostCreate } from './test-helpers';

describe('Buffer Node - Create Post', () => {
	// -------------------------------------------------------
	// Facebook Page
	// -------------------------------------------------------
	describe('Facebook Page', () => {
		const facebookDefaults = {
			channelId: 'chan1|facebook|page',
			facebookPostType: 'post',
			facebookFirstComment: '',
			facebookLinkAttachment: '',
		};

		it('should send required metadata: type', async () => {
			const input = await executePostCreate(facebookDefaults);
			expect(input.metadata).toEqual({
				facebook: { type: 'post' },
			});
		});

		it.each(['post', 'story', 'reel'])('should support Facebook post type: %s', async (type) => {
			const input = await executePostCreate({
				...facebookDefaults,
				facebookPostType: type,
			});
			const meta = (input.metadata as IDataObject).facebook as IDataObject;
			expect(meta.type).toBe(type);
		});

		it('should include firstComment when provided', async () => {
			const input = await executePostCreate({
				...facebookDefaults,
				facebookFirstComment: 'First!',
			});
			const meta = (input.metadata as IDataObject).facebook as IDataObject;
			expect(meta.firstComment).toBe('First!');
		});

		it('should not include firstComment when empty', async () => {
			const input = await executePostCreate(facebookDefaults);
			const meta = (input.metadata as IDataObject).facebook as IDataObject;
			expect(meta).not.toHaveProperty('firstComment');
		});

		it('should include linkAttachment as { url } when provided', async () => {
			const input = await executePostCreate({
				...facebookDefaults,
				facebookLinkAttachment: 'https://example.com/article',
			});
			const meta = (input.metadata as IDataObject).facebook as IDataObject;
			expect(meta.linkAttachment).toEqual({ url: 'https://example.com/article' });
		});

		it('should not include linkAttachment when empty', async () => {
			const input = await executePostCreate(facebookDefaults);
			const meta = (input.metadata as IDataObject).facebook as IDataObject;
			expect(meta).not.toHaveProperty('linkAttachment');
		});

		it('should force schedulingType to automatic regardless of the field value', async () => {
			const input = await executePostCreate({
				...facebookDefaults,
				schedulingType: 'notification',
			});
			expect(input.schedulingType).toBe('automatic');
		});

		it('should keep schedulingType as automatic when already set', async () => {
			const input = await executePostCreate({
				...facebookDefaults,
				schedulingType: 'automatic',
			});
			expect(input.schedulingType).toBe('automatic');
		});
	});

	// -------------------------------------------------------
	// Facebook Group
	// -------------------------------------------------------
	describe('Facebook Group', () => {
		const facebookGroupDefaults = {
			channelId: 'chan1|facebook|group',
		};

		it('should always send metadata type as post (no first comment or link attachment)', async () => {
			const input = await executePostCreate(facebookGroupDefaults);
			expect(input.metadata).toEqual({ facebook: { type: 'post' } });
		});

		it('should force schedulingType to notification regardless of the field value', async () => {
			const input = await executePostCreate({
				...facebookGroupDefaults,
				schedulingType: 'automatic',
			});
			expect(input.schedulingType).toBe('notification');
		});

		it('should keep schedulingType as notification when already set', async () => {
			const input = await executePostCreate({
				...facebookGroupDefaults,
				schedulingType: 'notification',
			});
			expect(input.schedulingType).toBe('notification');
		});
	});
});
