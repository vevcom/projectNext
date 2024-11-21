

export function sortObjectsByName<T extends {
    name: string
}>(list: T[], ): T[] {
    return list.toSorted((a, b) => {
        if (a.name === b.name) return 0
        if (a.name < b.name) return -1
        return 1
    })
}
