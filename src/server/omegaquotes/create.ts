import 'server-only'
import { createOmegaquotesValidation } from './schema'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { CreateOmegaguotesType } from './schema'
import type { OmegaQuote } from '@prisma/client'

/**
 * A function to create a quote
 * @param userId - The user id of the user creating the quote
 * @param data - The data of the quote to be created
 * @returns
 */
export async function createQuote(
    userId: number,
    rawdata: CreateOmegaguotesType
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
