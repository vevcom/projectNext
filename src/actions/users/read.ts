"use server"
import prisma from '@/prisma'
import { ActionReturn } from "../type";
import type { User } from '@prisma/client'
import errorHandler from '@/prisma/errorHandler';

export default async function read(id: number) : Promise<ActionReturn<User>> {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id,
            },
        })

        if (!user) {
            return {success: false, error: [{message: "User not found"}]}
        }
        else {
            return { success: true, data: user}
        }
    }
    catch(error) {
        return errorHandler(error)
    }
}



export async function readByEmail(email: string) : Promise<ActionReturn<User>> {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        })

        if (!user) {
            return {success: false, error: [{message: "User not found"}]}
        }
        else {
            return { success: true, data: user}
        }
    }
    catch(error) {
        return errorHandler(error)
    }
}

