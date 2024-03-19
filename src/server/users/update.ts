import 'server-only'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { Prisma, User } from '@prisma/client'
import { UpdateUserType, updateUserValidation } from './schema'

export async function updateUser(id: number, rawdata: UpdateUserType): Promise<User> {
    const data = updateUserValidation.detailedValidate(rawdata)

    return await prismaCall(() => prisma.user.update({
        where: {
            id,
        },
        data
    }))
}
