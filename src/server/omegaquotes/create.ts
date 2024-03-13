import 'server-only'
import prisma from '@/prisma'
import { createActionError, createPrismaActionError } from '@/actions/error'
import type { ActionReturn } from '@/actions/Types'
import type { OmegaQuote, Prisma } from '@prisma/client'

/**
 * A function to create a quote
 * @param userId - The user id of the user creating the quote
 * @param data - The data of the quote to be created
 * @returns 
 */
export async function createQuote(
    userId: number, 
    data: Omit<Prisma.OmegaQuoteCreateInput, 'userPoster'>
): Promise<ActionReturn<OmegaQuote>> {
    try {
        const quote = await prisma.omegaQuote.create({
            data: {
                ...data,
                userPoster: {
                    connect: {
                        id: userId
                    }
                }
            }
        })

        return { success: true, data: quote }
    } catch (error) {
        return createPrismaActionError(error)
    }
}