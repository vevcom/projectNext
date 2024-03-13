import { userFilterSelection } from './ConfigVars'
import prisma from '@/prisma'
import { createPrismaActionError } from '@/actions/error'
import type { UserFiltered, UserDetails } from './Types'
import type { ActionReturn, ReadPageInput } from '@/actions/Types'

/**
 * A function to read a page of users with the given details (filtering)
 * @param readPageInput - This is a) the page to read and b) the details to filter by like
 * name and groups
 * @returns
 */
export async function readUserPage<const PageSize extends number>({
    page,
    details
}: ReadPageInput<PageSize, UserDetails>): Promise<ActionReturn<UserFiltered[]>> {
    const words = details.partOfName.split(' ')
    try {
        const users = await prisma.user.findMany({
            skip: page.page * page.pageSize,
            take: page.pageSize,
            select: userFilterSelection,
            where: {
                AND: words.map((word, i) => {
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
                })
                //TODO select on groups
            },
            orderBy: [
                { lastname: 'asc' },
                { firstname: 'asc' },
                // We have to sort with at least one unique field to have a
                // consistent order. Sorting rows by fieds that have the same
                // value is undefined behaviour in postgresql.
                { username: 'asc' },
            ]
        })
        return { success: true, data: users }
    } catch (error) {
        return createPrismaActionError(error)
    }
}
