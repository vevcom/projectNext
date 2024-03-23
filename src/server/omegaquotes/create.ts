import 'server-only'
import { createOmegaquotesValidation } from './validation'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { CreateOmegaguotesTypes } from './validation'
import type { OmegaQuote } from '@prisma/client'

/**
 * A function to create a quote
 * @param userId - The user id of the user creating the quote
 * @param data - The data of the quote to be created
 * @returns
 */
export async function createQuote(
    userId: number,
    rawdata: CreateOmegaguotesTypes['Detailed']
): Promise<OmegaQuote> {
    const data = createOmegaquotesValidation.detailedValidate(rawdata)
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
