'use server'

import { articleLinkSchema } from './schema'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { ArticleLinkSchemaType } from './schema'
import type { CmsLink } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'

export async function updateCmsLink(id: number, rawData: FormData | ArticleLinkSchemaType): Promise<ActionReturn<CmsLink>> {
    const parse = articleLinkSchema.safeParse(rawData)

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
