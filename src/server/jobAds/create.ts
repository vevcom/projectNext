'use server'
import { createJobAdSchema } from './validation'
import { createArticleAction } from '@/cms/articles/create'
import prisma from '@/prisma'
import { createZodActionError } from '@/actions/error'
import type { JobAd } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'
import type { JobAdSchemaType } from './validation'
import { read } from 'fs'
import { readCurrenOmegaOrder } from '@/server/omegaOrder/read'
import { ActionErrorCode } from '@/actions/Types'

export async function createJobAd(rawdata: FormData | JobAdSchemaType): Promise<ActionReturn<JobAd>> {
    const parse = createJobAdSchema.safeParse(rawdata)
    if (!parse.success) {
        return createZodActionError(parse)
    }

    const data = parse.data

    const articleRes = await createArticleAction(data.articleName)
    if (!articleRes.success) return articleRes

    const currentOrder = await readCurrenOmegaOrder()
    if (!currentOrder.success) return currentOrder
        const jobAds = await prisma.jobAd.create({
            data: {
                company: data.company,
                description: data.description,
                article: {
                    connect: {
                        id: articleRes.data.id
                    }
                },
                omegaOrder: {
                    connect: {
                        order: currentOrder.data.order
                    }
                }
            }
        })
        return { success: true, data: jobAds }
   
}
