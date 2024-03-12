import 'server-only'
import { createPrismaActionError } from '@/actions/error'
import prisma from '@/prisma'
import type { ActionReturn } from '@/actions/Types'
import { Prisma } from '@prisma/client'
import type { User } from '@prisma/client'

export async function updateUser(id: number, data: Prisma.UserUpdateInput): Promise<ActionReturn<User>> {
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