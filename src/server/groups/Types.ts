import type { Group, Membership } from '@prisma/client'

export type ExpandedGroup = Group

export type ExpandedMembership = Membership

export type BasicMembership = Omit<Membership, 'order' | 'userId'>