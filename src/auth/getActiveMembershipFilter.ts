import type { Prisma } from '@prisma/client'

/**
 * A function to return a filter that only selects valid memberships of a order.
 * @param order - The order of what is considered valid membership.
 * @param strictness - If 'ACTIVE' all memberships that are valid will be returned (default).
 * If exact only mebership that matches the exact order will be returned. This only matters
 * if the group has membershipRenewal. I.e OMEGA_MEMBER group has renewal and will return all
 * members of all orders less than or equal to the given order if 'ACTIVE' is used. If 'EXACT'
 * is used the membership must be exanctly the given order, even if the membership is valid.
 * @returns - A filter that only selects valid memberships of a order.
 */
export function getActiveMembershipFilter(
    order: number,
    strictness: 'ACTIVE' | 'EXACT' = 'ACTIVE'
) {
    return {
        OR: [
            {
                group: {
                    membershipRenewal: false,
                },
                order,
            },
            {
                group: {
                    membershipRenewal: true,
                },
                order: strictness === 'ACTIVE' ? {
                    lte: order,
                } : {
                    equals: order,
                },
            }
        ]
    } satisfies Prisma.MembershipWhereInput
}
