import { toLocalDate } from './toLocal'

/**
 * WARNING: Do not use this function directly on server side rendering as it will use the server's timezone.
 * Use the `date` component instead, which is client side rendered.
 * Displays date and time in norwegian format
 * @param date - The date to display
 * @returns
 */
export function displayDate(date: Date, includeTime: boolean = true): string {
    if (!includeTime) {
        return toLocalDate(date).toLocaleString('nb-NO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        })
    }

    return toLocalDate(date).toLocaleString('nb-NO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    })
}
