'use server'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import { getUser } from '@/auth'
import { z } from 'zod'
import type { ActionReturn } from '@/actions/Types'
import type { OmegaQuote } from '@prisma/client'
import { omegaquotesSchema, OmegaquotesSchemaType } from './schema'

export async function createQuote(rawdata: FormData | OmegaquotesSchemaType): Promise<ActionReturn<OmegaQuote>> {
    const parse = omegaquotesSchema.safeParse(rawdata)

    if (!parse.success) {
        return {
            success: false,
            error: parse.error.issues
        }
    }

    const { quote, author } = parse.data

    const { user, status } = await getUser({
        permissions: ['OMEGAQUOTES_WRITE']
    })

    if (!user) {
        return {
            success: false,
            error: [{
                message: status
            }]
        }
    }

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
        return errorHandler(error)
    }
}
