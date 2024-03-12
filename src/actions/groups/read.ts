'use server'

import prisma from '@/prisma'
import { createPrismaActionError } from '@/actions/error'
import type { ActionReturn } from '@/actions/Types'
import type { Group, Membership } from '@prisma/client'

export async function readGroups(): Promise<ActionReturn<Group[]>> {
    try {
        const groups = await prisma.group.findMany({})

        return {
            success: true,
            data: groups
        }
    } catch (e) {
        return createPrismaActionError(e)
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
    } catch (e) {
        return createPrismaActionError(e)
    }
}
