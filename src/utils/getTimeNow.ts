import { DateTime } from 'luxon'

/**
 * @returns The current time in the timezone Europe/Oslo
 */
export function getTimeNow(): Date {
    return DateTime.now().setZone('Europe/Oslo').toJSDate()
}
