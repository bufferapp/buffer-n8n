import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { executeGraphQL, getApiUrl } from '../transport/graphql';

export async function getOrganizations(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const apiUrl = await getApiUrl(this);

	const query = `
		query {
			account {
				organizations {
					id
					name
				}
			}
		}
	`;

	const response = await executeGraphQL(this, apiUrl, query);

	const organizations = response.data?.account?.organizations || [];

	return organizations.map((org: { id: string; name: string }) => ({
		name: org.name,
		value: org.id,
	}));
}

export async function getChannels(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const apiUrl = await getApiUrl(this);
	const organizationId = this.getNodeParameter('organizationId') as string;

	if (!organizationId) {
		return [];
	}

	const query = `
		query GetChannels($input: ChannelsInput!) {
			channels(input: $input) {
				id
				name
				service
				type
				isLocked
				isDisconnected
			}
		}
	`;

	const response = await executeGraphQL(this, apiUrl, query, {
		input: {
			organizationId,
			filter: {
				isLocked: false,
			},
		},
	});

	const channels = response.data?.channels || [];

	// Show all channels, marking disconnected ones so users can see they need reconnecting
	// Store value as "id|service|type" to enable conditional field display
	// (e.g. distinguishing Facebook Pages from Facebook Groups, which share the same service)
	return channels
		.map((channel: { id: string; name: string; service: string; type: string; isDisconnected: boolean }) => ({
			name: channel.isDisconnected
				? `${channel.name} (${channel.service} - ${channel.type}) (Disconnected)`
				: `${channel.name} (${channel.service} - ${channel.type})`,
			value: channel.isDisconnected
				? `${channel.id}|${channel.service}|${channel.type}|disconnected`
				: `${channel.id}|${channel.service}|${channel.type}`,
		}));
}

export async function getPinterestBoards(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const channelIdComposite = this.getNodeParameter('channelId') as string;

	if (!channelIdComposite) {
		return [];
	}

	const channelId = channelIdComposite.split('|')[0];
	const apiUrl = await getApiUrl(this);

	const query = `
		query GetPinterestBoards($input: ChannelInput!) {
			channel(input: $input) {
				metadata {
					... on PinterestMetadata {
						boards {
							serviceId
							name
						}
					}
				}
			}
		}
	`;

	const response = await executeGraphQL(this, apiUrl, query, {
		input: { id: channelId },
	});

	const boards = response.data?.channel?.metadata?.boards || [];

	return boards.map((board: { serviceId: string; name: string }) => ({
		name: board.name,
		value: board.serviceId,
	}));
}

export const loadOptions = {
	getOrganizations,
	getChannels,
	getPinterestBoards,
};
