"use server"
import prisma from '@/prisma'
import { ActionReturn } from '../Types'
import type { User } from '@prisma/client'
import errorHandler from '@/prisma/errorHandler';
import { z } from 'zod'



export async function updateUser(id: number, rawdata: FormData) : Promise<ActionReturn<User>> {
    const schema = z.object({
        username: z.string().max(50).min(2),
        email: z.string().max(200).min(2).email(),
        firstname: z.string().max(50).min(2),
        lastname: z.string().max(50).min(2),
    })
    const parse = schema.safeParse({
        username: rawdata.get("username"),
        email: rawdata.get("email"),
        firstname: rawdata.get("firstname"),
        lastname: rawdata.get("lastname"),
    })
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
