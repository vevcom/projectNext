"use server"
import prisma from '@/prisma'
import { ActionReturn } from '../Types'
import type { User } from '@prisma/client'
import errorHandler from '@/prisma/errorHandler';


export async function destroyUser(id: number) : Promise<ActionReturn<User>> {
    try {
        const user = await prisma.user.delete( {
            where: {
            id,
            },
        })

        if (!user) {
            return {success: false, error: [{message: "User not found"}]}
        }
        else {
            return {success: true, data: user}
        }
    }

    catch(error) {
        return errorHandler(error)
    }
}

