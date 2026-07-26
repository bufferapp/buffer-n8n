export const TIME_FORMAT_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

// Google Business Offers only support a calendar date (no time-of-day component); this
// truncates whatever value the dateTime picker returned down to midnight UTC on that date.
export function toDateOnlyIso(dateStr: string): string {
	return `${new Date(dateStr).toISOString().slice(0, 10)}T00:00:00.000Z`;
}

// Combines a calendar date with a separately-provided "HH:mm" time into a single ISO timestamp,
// used for Google Business Events when the user opts in to specifying a start/end time.
export function combineDateAndTime(dateStr: string, timeStr: string): string {
	const datePart = new Date(dateStr).toISOString().slice(0, 10);
	return new Date(`${datePart}T${timeStr}:00.000Z`).toISOString();
}
