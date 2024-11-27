
export function getWeekNumber(date: Date): number {
    const startDate = new Date(date.getFullYear(), 0, 1)
    const days = Math.floor((date.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000))
    return Math.ceil((days + startDate.getDay() + 1) / 7)
}

export function datesEqual(lhs?: Date, rhs?: Date) {
    if (!lhs && !rhs) return true
    if (!lhs || !rhs) return false
    return lhs.getUTCFullYear() === rhs.getUTCFullYear()
        && lhs.getUTCMonth() === rhs.getUTCMonth()
        && lhs.getUTCDate() === rhs.getUTCDate()
}

export function dateLessThan(lhs: Date, rhs: Date) {
    if (lhs.getUTCFullYear() < rhs.getUTCFullYear()) return true
    if (lhs.getUTCMonth() < rhs.getUTCMonth()) return true
    if (lhs.getUTCDate() < rhs.getUTCDate()) return true
    return false
}
