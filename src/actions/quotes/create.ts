'use server'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import { ActionReturn } from '@/actions/type'
import { OmegaQuote } from '@prisma/client'
import { z } from 'zod'

export default async function create(rawdata: FormData) : Promise<ActionReturn<OmegaQuote>> {

    const shema = z.object({
        quote: z.string().min(1, "Sitatet kan ikke være tomt"),
        saidBy: z.string().min(1, "Noen må siteres"),
    })

    const parse = shema.safeParse({
        quote: rawdata.get("quote"),
        saidBy: rawdata.get("said_by")
    })

    if (!parse.success) {
        return {
            success: false,
            error: parse.error.issues
        };
    }

    const { quote, saidBy } = parse.data;

    // TODO: Check for permission to add a quote
    const user = await prisma.user.findFirst();
    console.log(user);

    if (!user) {
        return {
            success: false,
            error: [{
                message: "No user, this message should be a 403"
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