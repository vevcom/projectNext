import 'server-only'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { Prisma, User } from '@prisma/client'

export async function updateUser(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return await prismaCall(() => prisma.user.update({
        where: {
            id,
        },
        data
    }))
}
