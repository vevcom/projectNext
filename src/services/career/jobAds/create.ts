import 'server-only'
import { createJobAdValidation } from './validation'
import { createJobAdAuther } from './authers'
import { createArticle } from '@/services/cms/articles/create'
import { readCurrentOmegaOrder } from '@/services/omegaOrder/read'
import { ServiceMethod } from '@/services/ServiceMethod'

export const createJobAd = ServiceMethod({
    dataValidation: createJobAdValidation,
    auther: () => createJobAdAuther.dynamicFields({}),
    method: async ({ prisma, data: { articleName, companyId, ...data } }) => {
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
