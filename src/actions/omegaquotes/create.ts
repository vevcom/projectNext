'use server'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import { getUser } from '@/auth'
import { z } from 'zod'
import type { ActionReturn } from '@/actions/Types'
import type { OmegaQuote } from '@prisma/client'

export async function createQuote(rawdata: FormData): Promise<ActionReturn<OmegaQuote>> {
    const shema = z.object({
        quote: z.string().min(1, 'Sitatet kan ikke være tomt'),
        author: z.string().min(1, 'Noen må siteres'),
    })

    const parse = shema.safeParse({
        quote: rawdata.get('quote'),
        author: rawdata.get('author')
    })

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
