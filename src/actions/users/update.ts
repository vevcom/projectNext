"use server"

import prisma from '@/prisma'
import type { ActionReturn } from '@/actions/Types'
import type { User } from '@prisma/client'
import errorHandler from '@/prisma/errorHandler';
import { z } from 'zod'
import { UpdateUserSchemaType, updateUserSchema } from './schema';



export async function updateUser(id: number, rawdata: FormData | UpdateUserSchemaType) : Promise<ActionReturn<User>> {

    const parse = updateUserSchema.safeParse(rawdata);

    if (!parse.success) return { success: false, error: parse.error.issues}
    const data = parse.data

    try {
        const user = await prisma.user.update({
            where: {
                id,
            },
            data
        })
        return {success: true, data: user }
    }
    catch (error) {
        return errorHandler(error)
    }
}

export async function invalidateOneUserSessionData(userId: number): Promise<ActionReturn<void, false>> {
    try {
        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {}
        })
    } catch (e) {
        return errorHandler(e)
    }

    return { success: true, data: undefined }
}

export async function invalidateManyUserSessionData(userIds: number[]): Promise<ActionReturn<void, false>> {
    const results = await Promise.all(userIds.map(userId => invalidateOneUserSessionData(userId)))

    if (results.some(result => !result.success)) return { success: false }

    return { success: true, data: undefined }
}
