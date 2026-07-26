import { runExecute } from './test-helpers';

describe('Idea create', () => {
	it('builds the content input from text and title', async () => {
		const { capturedRequests } = await runExecute([
			{
				resource: 'idea',
				operation: 'create',
				organizationId: 'org-1',
				text: 'idea body text',
				title: 'idea title',
			},
		]);

		expect(capturedRequests[0].variables.input).toEqual({
			organizationId: 'org-1',
			content: { text: 'idea body text', title: 'idea title' },
		});
	});

	it('omits title from content when not provided', async () => {
		const { capturedRequests } = await runExecute([
			{
				resource: 'idea',
				operation: 'create',
				organizationId: 'org-1',
				text: 'idea body text',
			},
		]);

		expect(capturedRequests[0].variables.input).toEqual({
			organizationId: 'org-1',
			content: { text: 'idea body text' },
		});
	});

	it('returns the idea directly when the API returns an unwrapped Idea', async () => {
		const idea = {
			id: 'idea-1',
			organizationId: 'org-1',
			groupId: 'group-1',
			position: 0,
			content: { text: 'idea body text', title: 'idea title' },
		};

		const { returnData } = await runExecute(
			[{ resource: 'idea', operation: 'create', organizationId: 'org-1', text: 'idea body text' }],
			{ responses: [{ data: { createIdea: idea } }] },
		);

		expect(returnData[0].json).toEqual(idea);
	});

	it('unwraps the idea from an IdeaResponse wrapper', async () => {
		const idea = {
			id: 'idea-2',
			organizationId: 'org-1',
			groupId: 'group-1',
			position: 1,
			content: { text: 'another idea' },
		};

		const { returnData } = await runExecute(
			[{ resource: 'idea', operation: 'create', organizationId: 'org-1', text: 'another idea' }],
			{ responses: [{ data: { createIdea: { idea, refreshIdeas: true } } }] },
		);

		expect(returnData[0].json).toEqual(idea);
	});
});
