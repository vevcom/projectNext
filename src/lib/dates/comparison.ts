
export function getWeekNumber(date: Date): number {
    const tempDate = new Date(date.valueOf())
    const dayNum = (date.getDay() + 6) % 7
    tempDate.setDate(tempDate.getDate() - dayNum + 3)
    const firstThursday = tempDate.valueOf()
    tempDate.setMonth(0, 1)
    if (tempDate.getDay() !== 4) {
        tempDate.setMonth(0, 1 + ((4 - tempDate.getDay()) + 7) % 7)
    }
    return 1 + Math.ceil((firstThursday - tempDate.valueOf()) / 604800000)
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
    if (lhs.getUTCFullYear() > rhs.getUTCFullYear()) return false

    if (lhs.getUTCMonth() < rhs.getUTCMonth()) return true
    if (lhs.getUTCMonth() > rhs.getUTCMonth()) return false

    if (lhs.getUTCDate() < rhs.getUTCDate()) return true
    return false
}

export function dateLessThanOrEqualTo(lhs: Date, rhs: Date) {
    return datesEqual(lhs, rhs) || dateLessThan(lhs, rhs)
}
