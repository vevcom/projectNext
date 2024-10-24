import 'server-only'
import { updateCmsLinkValidation } from './validation'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import { ServerError } from '@/services/error'

export const update = ServiceMethodHandler({
    withData: true,
    validation: updateCmsLinkValidation,
    handler: async (prisma, { id }: { id: number }, data): Promise<void> => {
        const cmsLink = await prisma.cmsLink.findUniqueOrThrow({
            where: { id }
        })
        const type = data.type || cmsLink.type
        switch (type) {
            case 'RAW_URL':
                if (!data.rawUrl && !data.rawUrlText) {
                    throw new ServerError('BAD PARAMETERS', 'Mangler rawUrl eller rawUrlText')
                }
                await prisma.cmsLink.update({
                    where: { id },
                    data: {
                        name: data.name || cmsLink.name,
                        type,
                        rawUrl: data.rawUrl,
                        rawUrlText: data.rawUrlText,
                    }
                })
                return
            case 'NEWS':
                if (!data.newsArticleId) {
                    throw new ServerError('BAD PARAMETERS', 'Mangler newsArticleId')
                }
                await prisma.cmsLink.update({
                    where: { id },
                    data: {
                        name: data.name || cmsLink.name,
                        type,
                        newsArticleId: data.newsArticleId
                    }
                })
                return
            case 'ARTICLE_CATEGORY_ARTICLE':
                if (!data.articleCategoryArticleId) {
                    throw new ServerError('BAD PARAMETERS', 'Mangler articleCategoryArticleId')
                }
                await prisma.cmsLink.update({
                    where: { id },
                    data: {
                        name: data.name || cmsLink.name,
                        type,
                        articleCategoryArticleId: data.articleCategoryArticleId
                    }
                })
                return
            case 'IMAGE_COLLECTION':
                if (!data.imageCollectionId) {
                    throw new ServerError('BAD PARAMETERS', 'Mangler imageCollectionId')
                }
                await prisma.cmsLink.update({
                    where: { id },
                    data: {
                        name: data.name || cmsLink.name,
                        type,
                        imageCollectionId: data.imageCollectionId
                    }
                })
                return
            default:
                throw new ServerError('BAD PARAMETERS', 'Ukjent link type')
        }
    },
})
