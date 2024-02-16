'use server'
import { userFieldsToExpose } from './Types'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { UserFiltered, UserDetails } from './Types'
import type { ActionReturn, ReadPageInput } from '@/actions/type'

export async function readUserPage<const PageSize extends number>({
    page,
    details
}: ReadPageInput<PageSize, UserDetails>): Promise<ActionReturn<UserFiltered[]>> {
    const words = details.partOfName.split(' ')
    try {
        const users = await prisma.user.findMany({
            skip: page.page * page.pageSize,
            take: page.pageSize,
            select: userFieldsToExpose.reduce((prev, field) => ({
                ...prev,
                [field]: true
            }), {} as { [key in typeof userFieldsToExpose[number]]: true }),
            where: {
                AND: words.map((word, i) => {
                    console.log(word)
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
                { id: 'asc' }, //Important to make sure the order is consistent. Same last name - order by id
            ]
        })
        return { success: true, data: users }
    } catch (error) {
        return errorHandler(error)
    }
}
