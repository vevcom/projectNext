import type { Prisma } from '@prisma/client'

/**
 * A function to return a filter that only selects valid memberships of a order.
 * @param order - The order of what is considered valid membership. Or 'ACTIVE' to only select active memberships.
 * @returns - A filter that only selects valid memberships of a order.
 */
export function getActiveMembershipFilter(
    order: number | 'ACTIVE',
) {
    return order === 'ACTIVE' ? {
        active: true,
    } : {
        order: order,
    } satisfies Prisma.MembershipWhereInput
}