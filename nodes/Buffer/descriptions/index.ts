import type { INodeProperties } from 'n8n-workflow';
import { ideaProperties } from './idea.description';
import { postCoreProperties, postAttachmentProperties, postAssetProperties } from './post.description';
import { googleBusinessProperties } from './google-business.description';
import { pinterestProperties } from './pinterest.description';
import { facebookProperties } from './facebook.description';
import { instagramProperties } from './instagram.description';
import { youtubeProperties } from './youtube.description';

// Concatenated in the same order the fields originally appeared in Buffer.node.ts's `properties`
// array, so the field order in the n8n UI is unchanged by the split into per-resource/network files.
export const properties: INodeProperties[] = [
	...ideaProperties,
	...postCoreProperties,
	...googleBusinessProperties,
	...pinterestProperties,
	...facebookProperties,
	...instagramProperties,
	...youtubeProperties,
	...postAttachmentProperties,
	...postAssetProperties,
];
