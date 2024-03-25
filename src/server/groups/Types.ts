import type { Group, Membership } from '@prisma/client'

export type ExpandedGroup = Group & {
    firstOrder: number
    name: string
}

export type GroupsStructured = {
    [key: string]: {
        name: string,
        description: string,
        groups: ExpandedGroup[] 
    }
}

export type ExpandedMembership = Membership

export type BasicMembership = Omit<Membership, 'order' | 'userId'>
