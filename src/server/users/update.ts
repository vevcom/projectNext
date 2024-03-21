import 'server-only'
import { updateUserValidation } from './validation'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { UpdateUserTypes } from './validation'
import type { User } from '@prisma/client'

export async function updateUser(id: number, rawdata: UpdateUserTypes['Detailed']): Promise<User> {
    const data = updateUserValidation.detailedValidate(rawdata)

    return await prismaCall(() => prisma.user.update({
        where: {
            id,
        },
        data
    }))
}
