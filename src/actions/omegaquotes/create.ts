'use server'
import prisma from '@/prisma'
import { createActionError, createPrismaActionError, createZodActionError } from '@/actions/error'
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
        return createZodActionError(parse)
    }

    const { quote, author } = parse.data

    const { user, status } = await getUser({
        requiredPermissions: ['OMEGAQUOTES_WRITE']
    })

    if (status !== 'AUTHORIZED') {
        return createActionError(status)
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
        return createPrismaActionError(error)
    }
}
