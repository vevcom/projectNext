import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import { Group, Membership } from '@prisma/client'
import { ActionReturn } from '@/actions/type'

export async function readGroups(): Promise<ActionReturn<Group[]>> {
    try {
        const groups = await prisma.group.findMany({})

        return {
            success: true,
            data: groups
        }
    } catch(e) {
        return errorHandler(e)
    }
}

export async function readGroupMemberships(groupId: number): Promise<ActionReturn<Membership[]>> {
    try {
        const memberships = await prisma.membership.findMany({
            where: {
                groupId,
                active: true,
            },
        })

        return {
            success: true,
            data: memberships
        }
    } catch(e) {
        return errorHandler(e)
    }
}