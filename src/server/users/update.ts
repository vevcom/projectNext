import 'server-only'
import prisma from '@/prisma'
import type { Prisma, User } from '@prisma/client'
import { prismaCall } from '../prismaCall'

export async function updateUser(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return await prismaCall(() => prisma.user.update({
        where: {
            id,
        },
        data
    }))
}
