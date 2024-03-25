import type { Group } from '@prisma/client'

export type ExpandedGroup = Group & {
    firstOrder: number
    name: string
    members: number
}

export type GroupsStructured = {
    [key: string]: {
        name: string,
        description: string,
        groups: ExpandedGroup[]
    }
}
