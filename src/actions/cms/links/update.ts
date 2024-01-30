'use server'

import prisma from '@/prisma'
import errorHandeler from '@/prisma/errorHandler'
import { z } from 'zod'
import type { CmsLink } from '@prisma/client'
import type { ActionReturn } from '@/actions/type'

export default async function update(id: number, rawData: FormData) : Promise<ActionReturn<CmsLink>> {
    const schema = z.object({
        text: z.string().min(2).max(30),
        url: z.string().refine(value => {
            try {
                new URL(value)
                return true
            } catch (_) {
                return value.startsWith('/') || value.includes('.')
            }
        }, {
            message: 'Invalid URL',
        })
    })
    const parse = schema.safeParse({
        text: rawData.get('text'),
        url: rawData.get('url'),
    })

    if (!parse.success) {
        return { success: false, error: parse.error.issues }
    }

    let { text, url } = parse.data

    if (url.includes('.') && !url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`
    }

    try {
        const cmsLink = await prisma.cmsLink.update({
            where: { id },
            data: { text, url }
        })
        return { success: true, data: cmsLink }
    } catch (error) {
        return errorHandeler(error)
    }
}
