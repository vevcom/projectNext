import 'server-only'
import { CmsLinkRelationsIncluder } from './ConfigVars'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import logger from '@/logger'
import { ServerError } from '@/services/error'
import type { CmsLinkInfered, CmsLinkExpanded } from './Types'
import type { SpecialCmsLink } from '@prisma/client'

/**
 * This function reduces a CmsLinkExpanded to a CmsLinkInfered. The way it is reduced is
 * specified in the type of the cms link. If the cmsLink is of a type lacking info about a
 * way to reduce it, it will be set to type raw pointing to front page. This can for example happen if
 * the link points to a news article, but the news article is deleted.
 */
export const validateAndCollapseCmsLink = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, cmsLink: CmsLinkExpanded): Promise<CmsLinkInfered> => {
        switch (cmsLink.type) {
            case 'RAW_URL':
                if (!cmsLink.rawUrl || !cmsLink.rawUrlText) {
                    logger.error(
                        `Cms link with id ${cmsLink.id} is of type RAW_URL, 
                        but is missing rawUrl or rawUrlText. Setting to front page.
                        This can happen if the link is created without a url.
                        `
                    )
                    await prisma.cmsLink.update({
                        where: { id: cmsLink.id },
                        data: {
                            rawUrl: '/',
                            rawUrlText: 'Link'
                        }
                    })
                    return {
                        ...cmsLink,
                        text: 'Link',
                        url: '/'
                    }
                }
                return {
                    ...cmsLink,
                    text: cmsLink.rawUrlText,
                    url: cmsLink.rawUrl
                }
            case 'NEWS':
                if (!cmsLink.newsArticle) {
                    logger.error(
                        `Cms link with id ${cmsLink.id} is of type NEWS, 
                        but is missing newsArticle. Setting to front page.
                        This can happen if the news article is deleted.
                        `
                    )
                    await prisma.cmsLink.update({
                        where: { id: cmsLink.id },
                        data: {
                            type: 'RAW_URL',
                            rawUrl: '/',
                            rawUrlText: 'Link'
                        }
                    })
                    return {
                        ...cmsLink,
                        text: 'Link',
                        url: '/'
                    }
                }
                return {
                    ...cmsLink,
                    text: cmsLink.newsArticle.articleName,
                    url: `/news/${cmsLink.newsArticle.orderPublished}/${cmsLink.newsArticle.articleName}`
                }
            case 'ARTICLE_CATEGORY_ARTICLE':
                if (!cmsLink.articleCategoryArticle || !cmsLink.articleCategoryArticle.articleCategory) {
                    logger.error(
                        `Cms link with id ${cmsLink.id} is of type ARTICLE_CATEGORY_ARTICLE, 
                        but is missing articleCategoryArticle. Setting to front page.
                        This can happen if the article is deleted.
                        `
                    )
                    await prisma.cmsLink.update({
                        where: { id: cmsLink.id },
                        data: {
                            type: 'RAW_URL',
                            rawUrl: '/',
                            rawUrlText: 'Link'
                        }
                    })
                    return {
                        ...cmsLink,
                        text: 'Link',
                        url: '/'
                    }
                }
                return {
                    ...cmsLink,
                    text: cmsLink.articleCategoryArticle.name,
                    url: `
                        /articles/${cmsLink.articleCategoryArticle.articleCategory.name}/
                        ${cmsLink.articleCategoryArticle.name}
                    `
                }
            case 'IMAGE_COLLECTION':
                if (!cmsLink.imageCollection) {
                    logger.error(
                        `Cms link with id ${cmsLink.id} is of type IMAGE_COLLECTION,
                        but is missing imageCollection. Setting to front page.
                        This can happen if the image collection is deleted.
                        `
                    )
                    await prisma.cmsLink.update({
                        where: { id: cmsLink.id },
                        data: {
                            type: 'RAW_URL',
                            rawUrl: '/',
                            rawUrlText: 'Link'
                        }
                    })
                    return {
                        ...cmsLink,
                        text: 'Link',
                        url: '/'
                    }
                }
                return {
                    ...cmsLink,
                    text: cmsLink.imageCollection.name,
                    url: `/images/collections/${cmsLink.imageCollectionId}`
                }
            default:
                logger.error(
                    `Cms link with id ${cmsLink.id} is of unknown type ${cmsLink.type}. 
                    Setting to front page.
                    `
                )
                throw new ServerError('BAD PARAMETERS', 'Unknown link type')
        }
    }
})


export const readSpecial = ServiceMethodHandler({
    withData: false,
    handler: async (
        prisma,
        { special }: { special: SpecialCmsLink },
        session
    ): Promise<CmsLinkInfered> => {
        const cmsLink = await prisma.cmsLink.findUnique({
            where: { special },
            include: CmsLinkRelationsIncluder
        })
        if (!cmsLink) {
            logger.error(`Could not find special cms link with special ${special} - creating it!`)
            const created = await prisma.cmsLink.create({
                data: { special },
                include: CmsLinkRelationsIncluder
            })
            return validateAndCollapseCmsLink.client(prisma).execute({ params: created, session })
        }
        return validateAndCollapseCmsLink.client(prisma).execute({ params: cmsLink, session })
    }
})
