import { runExecute } from './test-helpers';

describe('Post create - error response handling', () => {
	it('throws when the GraphQL response contains top-level errors', async () => {
		await expect(
			runExecute([{}], {
				responses: [{ errors: [{ message: 'GraphQL syntax error' }] }],
			}),
		).rejects.toThrow('GraphQL syntax error');
	});

	it('throws on an InvalidInputError union response', async () => {
		await expect(
			runExecute([{}], {
				responses: [{ data: { createPost: { message: 'Invalid input provided' } } }],
			}),
		).rejects.toThrow('Invalid input provided');
	});

	it('throws on an UnauthorizedError union response', async () => {
		await expect(
			runExecute([{}], {
				responses: [{ data: { createPost: { message: 'Not authorized' } } }],
			}),
		).rejects.toThrow('Not authorized');
	});

	it('throws on a LimitReachedError union response', async () => {
		await expect(
			runExecute([{}], {
				responses: [{ data: { createPost: { message: 'Plan limit reached' } } }],
			}),
		).rejects.toThrow('Plan limit reached');
	});

	it('throws on a RestProxyError union response', async () => {
		await expect(
			runExecute([{}], {
				responses: [
					{
						data: {
							createPost: {
								message: 'Rest proxy failure',
								code: 'CUSTOM_CODE',
								link: 'https://example.com/help',
							},
						},
					},
				],
			}),
		).rejects.toThrow('Rest proxy failure');
	});
});

describe('Idea create - error response handling', () => {
	const ideaParams = { resource: 'idea', operation: 'create', organizationId: 'org1', text: 'hello' };

	it('throws when the GraphQL response contains top-level errors', async () => {
		await expect(
			runExecute([ideaParams], {
				responses: [{ errors: [{ message: 'GraphQL syntax error' }] }],
			}),
		).rejects.toThrow('GraphQL syntax error');
	});

	it('throws on an InvalidInputError union response', async () => {
		await expect(
			runExecute([ideaParams], {
				responses: [{ data: { createIdea: { message: 'Invalid idea input' } } }],
			}),
		).rejects.toThrow('Invalid idea input');
	});

	it('throws on an UnauthorizedError union response', async () => {
		await expect(
			runExecute([ideaParams], {
				responses: [{ data: { createIdea: { message: 'Not authorized' } } }],
			}),
		).rejects.toThrow('Not authorized');
	});

	it('throws on a LimitReachedError union response', async () => {
		await expect(
			runExecute([ideaParams], {
				responses: [{ data: { createIdea: { message: 'Plan limit reached' } } }],
			}),
		).rejects.toThrow('Plan limit reached');
	});
});
