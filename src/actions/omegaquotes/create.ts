'use server'
import { omegaquotesSchema } from './schema'
import prisma from '@/prisma'
import { createActionError, createPrismaActionError, createZodActionError } from '@/actions/error'
import { getUser } from '@/auth'
import type { OmegaquotesSchemaType } from './schema'
import type { ActionReturn } from '@/actions/Types'
import type { OmegaQuote } from '@prisma/client'

export async function createQuote(rawdata: FormData | OmegaquotesSchemaType): Promise<ActionReturn<OmegaQuote>> {
    const { user, status } = await getUser({
        requiredPermissions: ['OMEGAQUOTES_WRITE']
    })
    if (!user) {
        return createActionError(status)
    }

    const parse = omegaquotesSchema.safeParse(rawdata)

    if (!parse.success) {
        return createZodActionError(parse)
    }

    const { quote, author } = parse.data

    try {
        const results = await prisma.omegaQuote.create({
            data: {
                author,
                quote,
                userPoster: {
                    connect: {
                        id: user.id
                    }
                }
            }
        })

        return { success: true, data: results }
    } catch (error) {
        return createPrismaActionError(error)
    }
}
