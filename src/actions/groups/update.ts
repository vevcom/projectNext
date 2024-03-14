'use server'

import { createActionError, createPrismaActionError, createZodActionError } from '@/actions/error'
import prisma from '@/prisma'
import z from 'zod'
import type { ActionReturn } from '@/actions/Types'
import { Group, GroupType, Membership, Prisma } from '@prisma/client'
import { GroupUpdateInput } from './Types'
import { groupEnumToKey } from './ConfigVars'

export async function updateGroup<T extends GroupType>(
    id: number,
    groupType: T, 
    { details, ...data }: GroupUpdateInput<T>,
): Promise<ActionReturn<Group>> {
    const groupKey: keyof Prisma.GroupInclude = groupEnumToKey[groupType]

    const include: Prisma.GroupInclude = {
        [groupKey]: true
    }

    try {
        const group = await prisma.group.update({
            where: {
                id,
                groupType,
            },
            data: {
                ...data,
                [groupKey]: {
                    update: details,
                }
            },
            include,
        })

        if(!group[groupKey]) {
            return createActionError('UNKNOWN ERROR', 'Noe gikk galt.')
        }

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
