import 'server-only'
import { updateArticleValidation } from './validation'
import { articleRealtionsIncluder, maxSections } from '@/cms/articles/ConfigVars'
import prisma from '@/prisma'
import { addArticleSectionPart } from '@/services/cms/articleSections/update'
import { prismaCall } from '@/services/prismaCall'
import { ServerError } from '@/services/error'
import type { UpdateArticleTypes } from './validation'
import type { ArticleSectionPart } from '@/services/cms/articleSections/Types'
import type { ArticleSection } from '@prisma/client'
import type { ExpandedArticle } from '@/cms/articles/Types'

/**
 * A function to update metadata of an article. This includes for ex. name.
 * @param id - The id of the article to update
 * @param data - The new data to update the article with
 * @returns
 */
export async function updateArticle(
    id: number,
    rawData: UpdateArticleTypes['Detailed'],
): Promise<ExpandedArticle> {
    const data = updateArticleValidation.detailedValidate(rawData)

    return await prismaCall(() => prisma.article.update({
        where: { id },
        data,
        include: articleRealtionsIncluder,
    }))
}

/**
 * A function to add a new article section to an article
 * @param id - The id of the article to add a section to
 * @param include - The parts to include in the new section
 * @returns
 */
export async function addSectionToArticle(
    id: number,
    include: Partial<Record<ArticleSectionPart, boolean>>,
): Promise<ExpandedArticle> {
    const article = await prisma.article.findUnique({
        where: {
            id,
        },
    })

    if (!article) throw new ServerError('NOT FOUND', 'Artikkel ikke funnet.')

    const highestOrderSection = await prismaCall(() => prisma.articleSection.findMany({
        where: {
            articleId: id,
        },
        orderBy: {
            order: 'desc',
        },
        take: 1,
    }))

    // Get the order of the highest order section, or 0 if there are no sections
    const nextOreder = highestOrderSection.length > 0 ? highestOrderSection[0].order + 1 : 0


    const numberOfSections = await prisma.articleSection.count({
        where: {
            articleId: id,
        },
    })
    if (numberOfSections >= maxSections) {
        throw new ServerError('BAD PARAMETERS', `The maximum number of sections is ${maxSections}`)
    }

    const newSectionName = `${article.name} section ${nextOreder}`

    const updatedArticle = await prismaCall(() => prisma.article.update({
        where: {
            id,
        },
        data: {
            articleSections: {
                create: {
                    name: newSectionName,
                    order: nextOreder,
                },
            },
        },
        include: articleRealtionsIncluder,
    }))

    for (const part of ['cmsParagraph', 'cmsLink', 'cmsImage'] satisfies ArticleSectionPart[]) {
        if (include[part]) {
            await addArticleSectionPart(newSectionName, part)
        }
    }

    return updatedArticle
}

/**
 * A function to move a section in an article up or down
 * @param id - The id of the article to move a section in
 * @param sectionId - The id of the section to move
 * @param direction - The direction to move the section in
 * @returns
 */
export async function moveSectionOrder(
    id: number,
    sectionId: number,
    direction: 'UP' | 'DOWN',
): Promise<ArticleSection> {
    //TODO: auth on visability

    //get section to move
    const section = await prismaCall(() => prisma.articleSection.findUnique({
        where: {
            articleId: id,
            id: sectionId,
        },
    }))
    if (!section) throw new ServerError('NOT FOUND', 'Seksjon ikke funnet.')

    //find the section with the order one higher/lower than the current section
    const otherSection = await prismaCall(() => prisma.articleSection.findMany({
        where: {
            articleId: id,
            order: direction === 'UP' ? {
                lt: section.order,
            } : {
                gt: section.order,
            },
        },
        orderBy: {
            order: direction === 'UP' ? 'desc' : 'asc',
        },
        take: 1,
    }).then(sections => sections[0]))
    if (!otherSection) throw new ServerError('BAD PARAMETERS', 'Seksjon kan ikke flyttes opp/ned.')

    //flip thir order numbers
    const tempOrder = -1 // Or any other value that won't violate the unique constraint

    // First, set the order of the section to the temporary value
    await prismaCall(() => prisma.articleSection.update({
        where: {
            articleId: id,
            id: section.id
        },
        data: { order: tempOrder },
    }))
    const updatedOtherSection = await prismaCall(() => prisma.articleSection.update({
        where: {
            articleId: id,
            id: otherSection.id
        },
        data: { order: section.order },
    }))
    // Finally, set the order of the section to the otherSection's original order
    const updatedSection = await prismaCall(() => prisma.articleSection.update({
        where: {
            articleId: id,
            id: section.id
        },
        data: { order: otherSection.order },
    }))


    if (!updatedSection || !updatedOtherSection) {
        throw new ServerError('UNKNOWN ERROR', 'Noe uventet skjedde under flytting av seksjonen.')
    }

    return updatedSection
}
