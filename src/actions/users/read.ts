'use server'
import { userFieldsToExpose } from './Types'
import prisma from '@/prisma'
import { createActionError, createPrismaActionError } from '@/actions/error'
import type { UserFiltered, UserDetails } from './Types'
import type { ActionReturn, ReadPageInput } from '@/actions/Types'
import type { User } from '@prisma/client'

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

type readUserArg = {
    id?: number,
    username?: string,
    email?: string,
}

export async function readUser({ id, username, email }: readUserArg): Promise<ActionReturn<User>> {
    if (!id && !username && !email) {
        return createActionError('BAD PARAMETERS')
    }
    try {
        const user = await prisma.user.findUnique({
            where: {
                id,
                username,
                email,
            },
        })

        if (!user) {
            return createActionError('NOT FOUND', 'Bruker ikke funnet.')
        }

        return { success: true, data: user }
    } catch (error) {
        return createPrismaActionError(error)
    }
}
