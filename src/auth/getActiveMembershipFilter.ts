import { Prisma } from '@prisma/client'

/**
 * A function to return a filter that only selects valid memberships of a order.
 * @param order - The order of what is considered valid membership.
 * @returns - A filter that only selects valid memberships of a order.
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
                    lte: order,
                },
            }
        ]
    } satisfies Prisma.MembershipWhereInput
}