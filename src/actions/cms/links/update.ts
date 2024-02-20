'use server'

import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import { z } from 'zod'
import type { CmsLink } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'

export async function updateCmsLink(id: number, rawData: FormData): Promise<ActionReturn<CmsLink>> {
    const schema = z.object({
        text: z.string().min(2, 'Linken må ha navn på mer enn 1 bokstav').max(30, 'Max lengde er 30'),
        url: z.string().refine(value => {
            try {
                const url = new URL(value)
                return url
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

    const data = parse.data
    if (data.url.includes('.') && !data.url.startsWith('http://') && !data.url.startsWith('https://')) {
        data.url = `https://${data.url}`
    }
    const { text, url } = data

    try {
        const cmsLink = await prisma.cmsLink.update({
            where: { id },
            data: { text, url }
        })
        return { success: true, data: cmsLink }
    } catch (error) {
        return errorHandler(error)
    }
}
