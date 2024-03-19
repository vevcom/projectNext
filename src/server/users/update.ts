import 'server-only'
import { updateUserValidation } from './schema'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { UpdateUserType } from './schema'
import type { User } from '@prisma/client'

export async function updateUser(id: number, rawdata: UpdateUserType): Promise<User> {
    const data = updateUserValidation.detailedValidate(rawdata)

    return await prismaCall(() => prisma.user.update({
        where: {
            id,
        },
        data
    }))
}
