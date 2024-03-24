import 'server-only'
import { destroyArticleSection } from './destroy'
import { destroyCmsImage } from '@/server/cms/images/destoy'
import { destroyCmsLink } from '@/server/cms/links/destroy'
import { destroyCmsParagraph } from '@/server/cms/paragraphs/destroy'
import { maxImageSize, minImageSize, articleSectionsRealtionsIncluder } from '@/cms/articleSections/ConfigVars'
import prisma from '@/prisma'
import { createCmsImage } from '@/server/cms/images/create'
import { createCmsParagraph } from '@/server/cms/paragraphs/create'
import { createCmsLink } from '@/server/cms/links/create'
import { prismaCall } from '@/server/prismaCall'
import { ServerError } from '@/server/error'
import type { ImageSize, ArticleSection, Position, Prisma } from '@prisma/client'
import type { ExpandedArticleSection, ArticleSectionPart } from '@/cms/articleSections/Types'

/**
 * This is the function that updates an article section metadata about how the (cms)image is displayed
 * in the article section. It will also change the image size (resolution) based on the image size in
 * the article section
 * @param nameOrId - The name or id of the article section to update
 * @param changes - The changes to make to the article section. imageSize is the size of
 * the image in pixels, imagePosition is the position of the image in the article section
 * @returns
 */
export async function updateArticleSection(nameOrId: string | number, changes: {
    imageSize?: number,
    imagePosition?: Position,
}): Promise<ExpandedArticleSection> {
    //Sets the image resolution based on the image size
    let newCmsImageResolution: ImageSize | undefined = undefined

    if (changes.imageSize) {
        if (changes.imageSize > maxImageSize) {
            changes.imageSize = maxImageSize
        }
        if (changes.imageSize < minImageSize) {
            changes.imageSize = minImageSize
        }
        newCmsImageResolution = 'SMALL'
        if (changes.imageSize > 250) {
            newCmsImageResolution = 'MEDIUM'
        }
    }

    const articleSection = await prismaCall(() => prisma.articleSection.update({
        where: {
            name: typeof nameOrId === 'string' ? nameOrId : undefined,
            id: typeof nameOrId === 'number' ? nameOrId : undefined
        },
        data: {
            ...changes,
            cmsImage: {
                update: {
                    imageSize: newCmsImageResolution,
                },
            },
        },
        include: articleSectionsRealtionsIncluder
    }))
    return articleSection
}

/**
 * This is the function that adds a part to an article section. The part can be a cmsImage, cmsParagraph.
 * If the part already exists in the article section, it will return an error
 * If it does not it will create the part and add it to the article section
 * @param nameOrId - The name or id of the article section to add the part to
 * @param part - The part to add to the article section cmsImage, cmsParagraph or cmsLink
 * @returns - The updated article section
 */
export async function addArticleSectionPart(
    nameOrId: string | number,
    part: ArticleSectionPart
): Promise<ExpandedArticleSection> {
    const where = {
        name: typeof nameOrId === 'string' ? nameOrId : undefined,
        id: typeof nameOrId === 'number' ? nameOrId : undefined
    } as const satisfies Prisma.ArticleSectionWhereUniqueInput

    const articleSection = await prismaCall(() => prisma.articleSection.findUnique({
        where,
        include: { [part]: true }
    }))
    if (!articleSection) {
        throw new ServerError('NOT FOUND', 'ArticleSection not found')
    }
    if (articleSection[part]) {
        throw new ServerError('BAD PARAMETERS', `ArticleSection already has ${part}`)
    }

    switch (part) {
        case 'cmsImage':
        {
            const cmsImage = await createCmsImage({ name: `${nameOrId}_image` })
            return await prismaCall(() => prisma.articleSection.update({
                where,
                data: { cmsImage: { connect: { id: cmsImage.id } } },
                include: articleSectionsRealtionsIncluder
            }))
        }
        case 'cmsParagraph':
        {
            const cmsParagraph = await createCmsParagraph({ name: `${nameOrId}_paragraph` })
            return await prismaCall(() => prisma.articleSection.update({
                where,
                data: { cmsParagraph: { connect: { id: cmsParagraph.id } } },
                include: articleSectionsRealtionsIncluder
            }))
        }
        case 'cmsLink':
        {
            const cmsLink = await createCmsLink({ name: `${nameOrId}_link` })
            return await prismaCall(() => prisma.articleSection.update({
                where,
                data: { cmsLink: { connect: { id: cmsLink.id } } },
                include: articleSectionsRealtionsIncluder
            }))
        }
        default:
            break
    }
    throw new ServerError('BAD PARAMETERS', 'Invalid part')
}

/**
 * This is a function that removes a part from an article section. The part can be a cmsImage, cmsParagraph.
 * It does so by deleting the associated part from the database, in tern setting the part to null in the article section
 * If the attribute destroyOnEmpty is true, it will also remove the article section if all parts are removed
 * @param nameOrId - The name or id of the article section to remove the part from
 * @param part - The part to remove from the article section cmsImage, cmsParagraph or cmsLink
 * @returns - The updated article section
 */
export async function removeArticleSectionPart(
    nameOrId: string | number,
    part: ArticleSectionPart
): Promise<ArticleSection> {
    const where = {
        name: typeof nameOrId === 'string' ? nameOrId : undefined,
        id: typeof nameOrId === 'number' ? nameOrId : undefined
    } as const satisfies Prisma.ArticleSectionWhereUniqueInput
    const articleSection = await prismaCall(() => prisma.articleSection.findUnique({
        where,
        include: { cmsLink: true, cmsParagraph: true, cmsImage: true }
    }))
    if (!articleSection) {
        throw new ServerError('NOT FOUND', 'ArticleSection not found')
    }
    if (!articleSection[part]) {
        throw new ServerError('BAD PARAMETERS', `ArticleSection does not have ${part}`)
    }

    switch (part) {
        case 'cmsLink':
            if (articleSection.cmsLink) await destroyCmsLink(articleSection.cmsLink.id)
            break
        case 'cmsParagraph':
            if (articleSection.cmsParagraph) await destroyCmsParagraph(articleSection.cmsParagraph.id)
            break
        case 'cmsImage':
            if (articleSection.cmsImage) await destroyCmsImage(articleSection.cmsImage.id)
            break
        default:
            break
    }

    // check if all Parts are removed and if so, remove the articleSection,
    // but only if destroyOnEmpty is true
    const afterDelete = await prisma.articleSection.findUnique({
        where,
        include: { cmsParagraph: true, cmsImage: true, cmsLink: true }
    })
    if (!afterDelete) {
        throw new ServerError('UNKNOWN ERROR', 'Noe uventet skjedde etter sletting av del av artclesection')
    }
    if (
        articleSection.destroyOnEmpty &&
        !afterDelete.cmsImage &&
        !afterDelete.cmsParagraph &&
        !afterDelete.cmsImage
    ) {
        return await destroyArticleSection(nameOrId)
    }

    return afterDelete
}
