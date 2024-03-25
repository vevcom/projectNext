import { Prisma } from '@prisma/client'

/**
 * A function to return a filter that only selects valid memberships of a order.
 * @param order - The order of what is considered valid membership.
 * @returns 
 */
export function getActiveMembershipFilter(order: number) {
    return {
        OR: [
            {
                group: {
                    membershipRenewal: false,
                },
                order: order,
            },
            {
                group: {
                    membershipRenewal: true,
                },
                order: {
                    gte: order,
                },
            }
        ]
    } satisfies Prisma.MembershipWhereInput
}