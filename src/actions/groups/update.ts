import z from 'zod'
import { ActionReturn } from '../type'
import { Group, Membership } from '@prisma/client'
import errorHandler from '@/prisma/errorHandler'

export async function updateGroup(groupId: number, rawData: FormData): Promise<ActionReturn<Group>> {
    const schema = z.object({
        name: z.string(),
        membershipRenewal: z.boolean(),
    })

    const parse = schema.safeParse(rawData)

    if (!parse.success) return { 
        success: false,
        error: parse.error.issues
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
    } catch(e) {
        return errorHandler(e)
    }
}

export async function addGroupMember(groupId: number, userId: number): Promise<ActionReturn<Membership>> {
    try {
        const membership = await prisma.membership.create({
            data: {
                groupId: groupId,
                userId: userId,
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
    } catch(e) {
        return errorHandler(e)
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
    } catch(e) {
        return errorHandler(e)
    }
}