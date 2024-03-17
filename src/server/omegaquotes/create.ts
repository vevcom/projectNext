import 'server-only'
import prisma from '@/prisma'
import type { OmegaQuote, Prisma } from '@prisma/client'
import { prismaCall } from '../prismaCall'

/**
 * A function to create a quote
 * @param userId - The user id of the user creating the quote
 * @param data - The data of the quote to be created
 * @returns
 */
export async function createQuote(
    userId: number,
    data: Omit<Prisma.OmegaQuoteCreateInput, 'userPoster'>
): Promise<OmegaQuote> {
    return await prismaCall(() => prisma.omegaQuote.create({
        data: {
            ...data,
            userPoster: {
                connect: {
                    id: userId
                }
            }
        }
    }))
}
