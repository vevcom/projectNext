export function toLocalDate(date: Date): Date {
    const offset = date.getTimezoneOffset()
    const clientOffset = new Date().getTimezoneOffset()
    const diff = offset - clientOffset
    return new Date(date.getTime() + diff * 60 * 1000)
}
