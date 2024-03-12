'use server'
import { createJobAdSchema } from './schema'
import { createArticle } from '@/cms/articles/create'
import prisma from '@/prisma'
import { createPrismaActionError, createActionError, createZodActionError } from '@/actions/error'
import type { JobAd } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'
import type { JobAdSchemaType } from './schema'

export async function createJobAd(rawdata: FormData | JobAdSchemaType): Promise<ActionReturn<JobAd>> {
    const parse = createJobAdSchema.safeParse(rawdata)
    if (!parse.success) {
        return createZodActionError(parse)
    }

    const data = parse.data

    const articleRes = await createArticle(data.articleName)
    if (!articleRes.success) return articleRes

    try {
        const jobAds = await prisma.jobAd.create({
            data: {
                company: data.company,
                description: data.description,
                article: {
                    connect: {
                        id: articleRes.data.id
                    }
                }
            } })
        return { success: true, data: jobAds }
    } catch (error) {
        return createPrismaActionError(error)
    }
}
