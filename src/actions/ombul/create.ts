'use server'
import type { Ombul } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'

/**
 * Create a new Ombul. rawData includes a pdf file with the ombul issue 
 * CoverImageId is the id of the Image that will be used as the cover of the ombul
 */
export async function createOmbul(coverImageId: number, rewdata: FormData) : Promise<ActionReturn<Ombul>>  {
    try {
        const ombul = await prisma.ombul.create({
            data: {
                coverImageId,
                issue: rewdata
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