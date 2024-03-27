import { maxNumberOfGroupsInFilter, userFilterSelection } from './ConfigVars'
import { readCurrentGroupOrder, readGroup } from '@/server/groups/read'
import { ServerError } from '@/server/error'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import { getActiveMembershipFilter } from '@/auth/getActiveMembershipFilter'
import type { UserFiltered, UserDetails } from './Types'
import type { ReadPageInput } from '@/actions/Types'

/**
 * A function to read a page of users with the given details (filtering)
 * @param readPageInput - This is a) the page to read and b) the details to filter by like
 * name and groups
 * @returns
 */
export async function readUserPage<const PageSize extends number>({
    page,
    details
}: ReadPageInput<PageSize, UserDetails>): Promise<UserFiltered[]> {
    const words = details.partOfName.split(' ')

    if (details.groups.length > maxNumberOfGroupsInFilter) {
        throw new ServerError('BAD PARAMETERS', 'Too many groups in filter')
    }
    const groups = await Promise.all(details.groups.map(async ({ groupId, groupOrder }) => {
        const order = await readCurrentGroupOrder(groupId)
        return {
            groupId,
            groupOrder: groupOrder ?? order,
            strictness: groupOrder ? 'EXACT' as const : 'ACTIVE' as const
        }
    }))

    return await prismaCall(() => prisma.user.findMany({
        skip: page.page * page.pageSize,
        take: page.pageSize,
        select: userFilterSelection,
        where: {
            AND: [
                ...words.map((word, i) => {
                    const condition = {
                        [i === words.length - 1 ? 'contains' : 'equals']: word,
                        mode: 'insensitive'
                    } as const
                    return {
                        OR: [
                            { firstname: condition },
                            { lastname: condition },
                            { username: condition },
                        ],
                    }
                }),
                ...groups.map(group => ({
                    memberships: {
                        some: {
                            groupId: group.groupId,
                            ...getActiveMembershipFilter(group.groupOrder, group.strictness),
                        }
                    }
                }))
            ],
        },
        orderBy: [
            { lastname: 'asc' },
            { firstname: 'asc' },
            // We have to sort with at least one unique field to have a
            // consistent order. Sorting rows by fieds that have the same
            // value is undefined behaviour in postgresql.
            { username: 'asc' },
        ]
    }))
}
