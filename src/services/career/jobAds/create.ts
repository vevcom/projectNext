import 'server-only'
import { createJobAdValidation } from './validation'
import { createArticle } from '@/services/cms/articles/create'
import { readCurrentOmegaOrder } from '@/services/omegaOrder/read'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'

export const create = ServiceMethodHandler({
    withData: true,
    validation: createJobAdValidation,
    handler: async (prisma, _, { articleName, company, description }) => {
        const article = await createArticle({ name: articleName })

        const currentOrder = await readCurrentOmegaOrder()

        return await prisma.jobAd.create({
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
        })
    }
})
