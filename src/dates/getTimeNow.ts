import { DateTime } from 'luxon'

/**
 * @returns The current time in the timezone Europe/Oslo
 */
export function getTimeNow(): Date {
    const nowInOslo = DateTime.now().setZone('Europe/Oslo')
    return new Date(
        nowInOslo.year,
        nowInOslo.month - 1,
        nowInOslo.day,
        nowInOslo.hour,
        nowInOslo.minute,
        nowInOslo.second,
        nowInOslo.millisecond
    )
}
