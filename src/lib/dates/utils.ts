

export function getCurrentUTCDate() {
    return new Date(Date.UTC(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth(),
        new Date().getUTCDate(),
    ))
}
