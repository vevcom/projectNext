

export function getTodaysUTCDate() {
    return new Date(Date.UTC(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth(),
        new Date().getUTCDate(),
    ))
}
