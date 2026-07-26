// Facebook Groups and Instagram Profiles only support notification scheduling; Facebook Pages
// and every other network except Instagram, TikTok, and YouTube only support automatic
// scheduling. This resolves the effective schedulingType regardless of what the (possibly
// stale, or simply not applicable) form field value was.
export function resolveSchedulingType(
	requestedSchedulingType: string,
	channelService: string | undefined,
	isFacebookGroup: boolean,
	isInstagramProfile: boolean,
): string {
	if (isFacebookGroup || isInstagramProfile) {
		return 'notification';
	}

	if (channelService && !['instagram', 'tiktok', 'youtube'].includes(channelService.toLowerCase())) {
		return 'automatic';
	}

	return requestedSchedulingType;
}
