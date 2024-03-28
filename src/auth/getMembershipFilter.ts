import type { Prisma } from '@prisma/client'

/**
 * A function to return a filter that only selects valid memberships of a order.
 * @param order - The order of what is considered valid membership. Or 'ACTIVE' to only select active memberships.
 * @param groupId - The id of the group to filter by. I.e only memberships of this group.
 * @returns - A filter that only selects valid memberships of a order.
 */
export function getMembershipFilter(
    order: number | 'ACTIVE',
    groupId?: number | undefined,
) {
    return order === 'ACTIVE' ? {
        groupId,
        active: true,
    } : {
        groupId,
        order,
    } satisfies Prisma.MembershipWhereInput
}
