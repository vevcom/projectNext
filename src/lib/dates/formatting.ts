

export function getZodDateString(date?: Date) {
    if (!date) { return undefined }
    return date.toISOString().split('T')[0]
}
