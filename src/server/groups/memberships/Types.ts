import type { Membership } from '@prisma/client'

export type ExpandedMembership = Membership
export type BasicMembership = Omit<Membership, 'order' | 'userId'>
