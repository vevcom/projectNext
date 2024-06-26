import type { Group, GroupType } from '@prisma/client'

export type ExpandedGroup = Group & {
    firstOrder: number
    name: string
    members: number
}

export type GroupsStructured = {
    [key in GroupType]: {
        name: string,
        description: string,
        groups: ExpandedGroup[]
    }
}
