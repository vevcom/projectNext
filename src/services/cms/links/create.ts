import 'server-only'
import { createCmsLinkValidation } from './validation'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import { ServerError } from '@/services/error'
import type { CmsLink } from '@prisma/client'

export const create = ServiceMethodHandler({
    withData: true,
    validation: createCmsLinkValidation,
    handler: async (prisma, _, data): Promise<CmsLink> => {
        switch (data.type) {
            case 'RAW_URL':
                return prisma.cmsLink.create({
                    data: {
                        name: data.name,
                        type: data.type,
                        rawUrl: data.rawUrl || '/',
                        rawUrlText: data.rawUrlText || 'Link',
                    }
                })
            case 'NEWS':
                if (!data.newsArticleId) {
                    throw new ServerError('BAD PARAMETERS', 'Mangler newsArticleId')
                }
                return prisma.cmsLink.create({
                    data: {
                        name: data.name,
                        type: data.type,
                        newsArticleId: data.newsArticleId
                    }
                })
            case 'ARTICLE_CATEGORY_ARTICLE':
                if (!data.articleCategoryArticleId) {
                    throw new ServerError('BAD PARAMETERS', 'Mangler articleCategoryArticleId')
                }
                return prisma.cmsLink.create({
                    data: {
                        name: data.name,
                        type: data.type,
                        articleCategoryArticleId: data.articleCategoryArticleId
                    }
                })
            case 'IMAGE_COLLECTION':
                if (!data.imageCollectionId) {
                    throw new ServerError('BAD PARAMETERS', 'Mangler imageCollectionId')
                }
                return prisma.cmsLink.create({
                    data: {
                        name: data.name,
                        type: data.type,
                        imageCollectionId: data.imageCollectionId
                    }
                })
            default:
                throw new ServerError('BAD PARAMETERS', 'Ukjent link type')
        }
    }
})
