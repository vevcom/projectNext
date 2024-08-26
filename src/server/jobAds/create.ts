import 'server-only'
import { createJobAdValidation } from './validation'
import { jobAdArticleRealtionsIncluder } from './ConfigVars'
import { prismaCall } from '@/server/prismaCall'
import { createArticle } from '@/server/cms/articles/create'
import prisma from '@/prisma'
import { readCurrentOmegaOrder } from '@/server/omegaOrder/read'
import type { ExpandedJobAd } from './Types'
import type { CreateJobAdTypes } from './validation'

export async function createJobAd(rawdata: CreateJobAdTypes['Detailed']): Promise<ExpandedJobAd> {
    const { articleName, company, description } = createJobAdValidation.detailedValidate(rawdata)

    const article = await createArticle({ name: articleName })

    const currentOrder = await readCurrentOmegaOrder()

    const jobAd = await prismaCall(() => prisma.jobAd.create({
        data: {
            company,
            description,
            article: {
                connect: {
                    id: article.id
                }
            },
            omegaOrder: {
                connect: currentOrder,
            }
        },
        include: jobAdArticleRealtionsIncluder,
    }))
    return jobAd
}
