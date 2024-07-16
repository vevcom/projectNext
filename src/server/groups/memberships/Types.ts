import type { Membership } from '@prisma/client'
import { membershipFieldsToExpose } from './ConfigVars'

export type ExpandedMembership = Membership
export type MembershipFiltered = Pick<Membership, typeof membershipFieldsToExpose[number]>

/**
 * This type is ment to abstract abstract away selecting memberships on order.
 * - A number means the a spesific order
 * - ACTIVE means all active memberships (regarthless of order)
 * - ALL means all active and unactive of all orders.
 */
export type MembershipSelectorType = number | 'ACTIVE' | 'ALL'
