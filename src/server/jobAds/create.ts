import 'server-only'
import { createJobAdValidation, CreateJobAdTypes } from './validation'
import { createArticle } from '@/server/cms/articles/create'
import prisma from '@/prisma'
import { readCurrenOmegaOrder } from '@/server/omegaOrder/read'
import { ExpandedJobAd } from './Types'
import { prismaCall } from '../prismaCall'
import { jobAdArticleRealtionsIncluder } from './ConfigVars'

export async function createJobAd(rawdata: CreateJobAdTypes['Detailed']): Promise<ExpandedJobAd>  {

    
    const { articleName, company, description } = createJobAdValidation.detailedValidate(rawdata)

    const article = await createArticle({ name: articleName })

    const currentOrder = await readCurrenOmegaOrder()

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
