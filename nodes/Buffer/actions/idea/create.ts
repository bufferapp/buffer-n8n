import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { executeGraphQL } from '../../transport/graphql';

export async function createIdea(
	ctx: IExecuteFunctions,
	apiUrl: string,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const organizationId = ctx.getNodeParameter('organizationId', itemIndex) as string;
	const text = ctx.getNodeParameter('text', itemIndex) as string;
	const title = ctx.getNodeParameter('title', itemIndex) as string;

	// Build content input
	const content: IDataObject = {};

	if (text) {
		content.text = text;
	}
	if (title) {
		content.title = title;
	}

	// Build the input
	const input: IDataObject = {
		organizationId,
		content,
	};

	// GraphQL mutation
	const mutation = `
		mutation CreateIdea($input: CreateIdeaInput!) {
			createIdea(input: $input) {
				... on Idea {
					id
					organizationId
					groupId
					position
					createdAt
					updatedAt
					content {
						title
						text
					}
				}
				... on IdeaResponse {
					idea {
						id
						organizationId
						groupId
						position
						createdAt
						updatedAt
						content {
							title
							text
						}
					}
					refreshIdeas
				}
				... on InvalidInputError {
					message
				}
				... on UnauthorizedError {
					message
				}
				... on UnexpectedError {
					message
				}
				... on LimitReachedError {
					message
				}
			}
		}
	`;

	const response = await executeGraphQL(ctx, apiUrl, mutation, { input });

	// Check for GraphQL errors
	if (response.errors && response.errors.length > 0) {
		throw new NodeApiError(ctx.getNode(), response.errors[0], { itemIndex });
	}

	const result = response.data?.createIdea;

	// Check for mutation-level errors
	if (result?.message) {
		throw new NodeApiError(ctx.getNode(), result, { itemIndex });
	}

	// Handle IdeaResponse wrapper
	const idea = result?.idea || result;

	return {
		json: idea,
		pairedItem: { item: itemIndex },
	};
}
