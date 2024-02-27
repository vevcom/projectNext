'use server'

import errorHandler from '@/prisma/errorHandler'
import prisma from '@/prisma'
import type { ActionReturn } from '@/actions/Types'
import type { Group } from '@prisma/client'

export async function destroyGroup(groupId: number): Promise<ActionReturn<Group>> {
    try {
        const group = await prisma.group.delete({
            where: {
                id: groupId,
            },
        })

        return {
            success: true,
            data: group,
        }
    } catch (e) {
        return errorHandler(e)
    }
}
