'use server'
import { omegaquotesSchema } from './schema'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import { getUser } from '@/auth'
import type { OmegaquotesSchemaType } from './schema'
import type { ActionReturn } from '@/actions/Types'
import type { OmegaQuote } from '@prisma/client'

export async function createQuote(rawdata: FormData | OmegaquotesSchemaType): Promise<ActionReturn<OmegaQuote>> {
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
    
    const parse = omegaquotesSchema.safeParse(rawdata)

    if (!parse.success) {
        return {
            success: false,
            error: parse.error.issues
        }
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
        return errorHandler(error)
    }
}
