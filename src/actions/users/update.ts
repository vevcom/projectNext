'use server'
import { updateUserSchema } from './schema'
import { createActionError, createPrismaActionError, createZodActionError } from '@/actions/error'
import prisma from '@/prisma'
import type { ActionReturn } from '@/actions/Types'
import type { User } from '@prisma/client'
import type { UpdateUserSchemaType } from './schema'


export async function updateUser(id: number, rawdata: FormData | UpdateUserSchemaType): Promise<ActionReturn<User>> {
    const parse = updateUserSchema.safeParse(rawdata)

    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    try {
        const user = await prisma.user.update({
            where: {
                id,
            },
            data
        })
        return { success: true, data: user }
    } catch (error) {
        return createPrismaActionError(error)
    }
}
