import { DateTime } from 'luxon'

export function utcToOslo(utc: Date): Date {
    return DateTime.fromJSDate(utc).setZone('Europe/Oslo').toJSDate()
}
