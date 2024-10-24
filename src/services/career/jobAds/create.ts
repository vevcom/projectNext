import 'server-only'
import { createJobAdValidation } from './validation'
import { createArticle } from '@/services/cms/articles/create'
import { readCurrentOmegaOrder } from '@/services/omegaOrder/read'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'

export const create = ServiceMethodHandler({
    withData: true,
    validation: createJobAdValidation,
    handler: async (prisma, _, { articleName, companyId, ...data }) => {
        const article = await createArticle({ name: articleName })

        const currentOrder = await readCurrentOmegaOrder()

        return await prisma.jobAd.create({
            data: {
                article: {
                    connect: {
                        id: article.id
                    }
                },
                omegaOrder: {
                    connect: currentOrder,
                },
                company: {
                    connect: {
                        id: companyId
                    }
                },
                ...data,
            },
        })
    }
})
