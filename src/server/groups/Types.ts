import type { Group, Membership } from '@prisma/client'

export type ExpandedGroup = Group & {
    firstOrder: number
    name: string
}

export type ExpandedMembership = Membership

export type BasicMembership = Omit<Membership, 'order' | 'userId'>
