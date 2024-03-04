'use server'
import { ombulUpdateSchema } from "./schema"
import type { ActionReturn } from "@/actions/Types"
import type { ExpandedOmbul } from "./Types"
import { getUser } from "@/auth"
import prisma from "@/prisma"
import errorHandler from "@/prisma/errorHandler"

export async function updateOmbul(id: number, rawdata: FormData): Promise<ActionReturn<ExpandedOmbul>> {
    // auth route
    const { user, status } = await getUser({
        permissions: ['OMBUL_UPDATE']
    })
    if (!user) {
        return {
            success: false,
            error: [{
                message: status
            }]
        }
    }
    
    const parse = ombulUpdateSchema.safeParse(Object.fromEntries(rawdata.entries()))
    if (!parse.success) return {
        success: false,
        error: parse.error.issues
    }
    const data = parse.data

    try {
        const ombul = await prisma.ombul.update({
            where: {
                id
            },
            data,
            include: {
                coverImage: {
                    include: {
                        image: true
                    }
                }
            }
        })
        return {
            success: true,
            data: ombul
        }
    } catch (error) {
        return errorHandler(error)
    }
}