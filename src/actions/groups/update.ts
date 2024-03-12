'use server'

import { createPrismaActionError, createZodActionError } from '@/actions/error'
import prisma from '@/prisma'
import z from 'zod'
import type { ActionReturn } from '@/actions/Types'
import type { Group, Membership } from '@prisma/client'

export async function updateGroup(groupId: number, rawData: FormData): Promise<ActionReturn<Group>> {
    const schema = z.object({
        name: z.string(),
        membershipRenewal: z.boolean(),
    })

    const parse = schema.safeParse(rawData)

    if (!parse.success) {
        return createZodActionError(parse)
    }

    const { name, membershipRenewal } = parse.data

    try {
        const group = await prisma.group.update({
            where: {
                id: groupId
            },
            data: {
                name,
                membershipRenewal,
            },
        })

        return {
            success: true,
            data: group,
        }
    } catch (e) {
        return createPrismaActionError(e)
    }
}

export async function addGroupMember(groupId: number, userId: number): Promise<ActionReturn<Membership>> {
    try {
        const membership = await prisma.membership.create({
            data: {
                groupId,
                userId,
                admin: false,
                active: true,
                endOrder: 0,
                startOrder: 0,
            },
        })

        return {
            success: true,
            data: membership,
        }
    } catch (e) {
        return createPrismaActionError(e)
    }
}

export async function removeGroupMember(groupId: number, userId: number) {
    try {
        const membership = await prisma.membership.delete({
            where: {
                userId_groupId: { userId, groupId }
            }
        })

        return {
            success: true,
            data: membership,
        }
    } catch (e) {
        return createPrismaActionError(e)
    }
}
