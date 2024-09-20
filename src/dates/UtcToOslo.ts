import { DateTime } from "luxon"

export function UtcToOslo(utc: Date): Date {
    return DateTime.fromJSDate(utc).setZone('Europe/Oslo').toJSDate()
}