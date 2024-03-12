import prisma from '@/prisma'
import { createPrismaActionError } from '@/actions/error'
import { SpecialCollection } from '@prisma/client'
import type { ImageCollection } from '@prisma/client'
import logger from '@/logger'
import type { ActionReturn } from '@/actions/Types'

export async function readSpecialImageCollection(special: SpecialCollection): Promise<ActionReturn<ImageCollection>> {
    try {
        const collection = await prisma.imageCollection.findUnique({
            where: {
                special
            }
        })
        if (!collection) {
            logger.warn(`Special collection ${special} did not exist, creating it`)
            const newCollection = await prisma.imageCollection.create({
                data: {
                    name: special,
                    special
                }
            })
            return { success: true, data: newCollection }
        }
        return { success: true, data: collection }
    } catch (error) {
        return createPrismaActionError(error)
    }
}