'use server'
import { readPermissionsOfUser } from '@/actions/permissions'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import { ActionReturn } from '@/actions/type'
import { getUser } from '@/auth'
import { OmegaQuote } from '@prisma/client'
import { z } from 'zod'

export default async function create(rawdata: FormData) : Promise<ActionReturn<OmegaQuote>> {
    const shema = z.object({
        quote: z.string().min(1, 'Sitatet kan ikke være tomt'),
        saidBy: z.string().min(1, 'Noen må siteres'),
    })

    const parse = shema.safeParse({
        quote: rawdata.get('quote'),
        saidBy: rawdata.get('said_by')
    })

    if (!parse.success) {
        return {
            success: false,
            error: parse.error.issues
        }
    }

    const { quote, saidBy } = parse.data

    // REFACTOR when new permission system is working
    const user = await getUser()

    if (!user) {
        return {
            success: false,
            error: [{
                message: '403: Not authenticated'
            }]
        }
    }

    const permissions = await readPermissionsOfUser(user.id)
    if (!permissions.success) {
        return {
            success: false,
            error: [{
                message: '500: Failed to read permissions of user'
            }]
        }
    }

    if (!permissions.data.has('OMEGAQUOTES_WRITE')) {
        return {
            success: false,
            error: [{
                message: '403: User not allowed to add quotes'
            }]
        }
    }

    try {
        const results = await prisma.omegaQuote.create({
            data: {
                author: saidBy,
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
